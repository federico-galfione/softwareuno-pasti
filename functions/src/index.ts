import * as cors from 'cors';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as nodemailer from 'nodemailer';


admin.initializeApp();
// import * as admin from 'firebase-admin';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'pasti.softwareuno@gmail.com',
        pass: 'Qazplm-5'
    }
})

export const getSecretLink = functions.https.onRequest(async (req, res) => {
    return cors()(req, res, async () => {
        try{
            await authenticate(req, 'EMPLOYEE');
            const currentKey = (await admin.firestore().collection('app').doc('hiddenSettings').get()).data()?.guestAccessString
            res.status(200).send({ data: { secretKey: Buffer.from(currentKey, 'base64').toString('binary') }});
            return;
        }catch(e){
            res.status(403).send(e);
            return;
        }
    });
})

export const checkSecretLink = functions.https.onRequest(async (req, res) => {
    return cors()(req, res, async () => {
        try{
            const data = req.body.data;
            const currentKey = (await admin.firestore().collection('app').doc('hiddenSettings').get()).data()?.guestAccessString
            console.log(Buffer.from(currentKey, 'base64').toString('binary'), data.key);
            if(data.key === Buffer.from(currentKey, 'base64').toString('binary')){
                res.status(200).send({ data: { authenticated: true } })
                return;
            }
            res.status(403).send({ data: { authenticated: false } })
            return;
        }catch(e){
            res.status(403).send(e);
            return;
        }
    });
})

export const createSecretLink = functions.pubsub.schedule('every day 00:00')
    .timeZone('Europe/Rome') 
    .onRun(async (context) => {
        await admin.firestore().collection('app').doc('hiddenSettings').set({guestAccessString: Buffer.from(Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)).toString('base64')}, {merge: true});
    });

export const deleteGuests = functions.pubsub.schedule('every day 00:00')
    .timeZone('Europe/Rome') 
    .onRun(async (context) => {
        const listUsers = await admin.auth().listUsers();
        listUsers.users.filter(user => !user.email).forEach(user => {
            admin.auth().deleteUser(user.uid)
                .then(_ => console.log('User deleted'))
                .catch(_ => console.log('Error'))
        })
    });

export const sendEmail = functions.pubsub.schedule('every 1 minutes from 11:00 to 00:00')
    .timeZone('Europe/Rome')
    .onRun(async (context) => {
        const currentTime = new Date();
        const stopOrdersTime = (await admin.firestore().collection('app').doc('settings').get()).data()?.stopOrdersTime.toDate() as Date;
        console.log(await setupOrders());

        if(currentTime.getHours() === stopOrdersTime.getHours() && currentTime.getMinutes() === stopOrdersTime.getMinutes()){
            const allRestaurantAccounts = (await admin.firestore().collection('users').where('role', '==', 'RESTAURANT').get());
            

            allRestaurantAccounts.forEach(doc => {
                const mail = {
                    from: 'pasti.softwareuno@gmail.com',
                    to: doc.data()?.email,
                    subject: `Ordini del giorno (${currentTime.getDate()}/${currentTime.getMonth()+1}/${currentTime.getFullYear()})`,
                    html: `<h1>Ordini del giorno<h1>
                        <p>Di seguito sono elencati gli ordini di oggi!<p>
                    `
                }
                transporter.sendMail(mail).then(() => {
                    console.log('MAIL SENT TO ' + doc.data()?.email)
                }).catch(() => {
                    console.log('ERROR WHILE SENDING THE EMAIL!')
                });
            })
        }
    });

export const createUser = functions.https.onRequest(async (req, res) => {
    return cors()(req, res, async () => {
        try{
            await authenticate(req);
            const data = req.body.data;
            const newUser = await admin.auth().createUser({
                email: data.email,
                password: Math.random().toString(36).substr(2, 8)
            });
            await admin.firestore().collection('users').doc(newUser.uid).set({
                email: newUser.email,
                firstName: data.firstName,
                lastName: data.lastName,
                role: data.role
            })
            res.status(200).send({ data: newUser });
            return;
        }catch(e){
            console.log(e);
            res.status(403).send(e);
            return;
        }
    });
})

export const editUser = functions.https.onRequest(async (req, res) => {
    return cors()(req, res, async () => {
        try{
            await authenticate(req);
            const data = req.body.data;
            const userToEdit = await admin.auth().getUserByEmail(data.email);
            await admin.firestore().collection('users').doc(userToEdit.uid).update({
                firstName: data.firstName,
                lastName: data.lastName,
                role: data.role
            });
            res.status(200).send({ data: userToEdit });
            return;
        }catch(e){
            res.status(403).send(e);
            return;
        }
    });
})

export const deleteUser = functions.https.onRequest(async (req, res) => {
    return cors()(req, res, async () => {
        try{
            await authenticate(req);
            const data = req.body.data;
            const userToDelete = await admin.auth().getUserByEmail(data.email);
            await admin.auth().deleteUser(userToDelete.uid);
            await admin.firestore().collection('users').doc(userToDelete.uid).delete();
            res.status(200).send({ data: userToDelete });
            return;
        }catch(e){
            console.log(e);
            res.status(403).send(e);
            return;
        }
    });
})


//Check if the user is authenticated and has role == role
export async function authenticate(req: functions.https.Request, role: string = 'ADMIN'): Promise<admin.auth.DecodedIdToken>{
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        throw new Error();
      }
      const idToken = req.headers.authorization.split('Bearer ')[1];
      try {
        const decodedIdToken = await admin.auth().verifyIdToken(idToken);
        if((await admin.firestore().collection('users').doc(decodedIdToken.uid).get()).data()?.role !== role){
            throw new Error();
        }
        return decodedIdToken;
      } catch(e) {
        throw new Error();
      }
}

interface Orders{
    primi: Map<string, number>;
    secondi: Map<string, number>;
    contorni: Map<string, number>;
    pizze: Map<string, number>;
}

interface RestAndTakeawayOrders{
    coperti: Orders;
    takeAway: Orders;
}

export async function setupOrders(): Promise<RestAndTakeawayOrders>{
    const currentTime = new Date();
    const todayOrders = (await admin.firestore().collection('menus').doc(`${currentTime.getFullYear()}-${currentTime.getMonth()}-${currentTime.getDate()}`).collection('orders').get());
    const orders: RestAndTakeawayOrders = {
        coperti: {
            primi: new Map<string, number>(),
            secondi: new Map<string, number>(),
            contorni: new Map<string, number>(),
            pizze: new Map<string, number>()
        },
        takeAway: {
            primi: new Map<string, number>(),
            secondi: new Map<string, number>(),
            contorni: new Map<string, number>(),
            pizze: new Map<string, number>()
        }
    }
    todayOrders.docs.filter(doc => doc.data()?.takeAway).forEach(el => {
        const data = el.data();
        data?.primi.forEach((primo: string) => orders.takeAway.primi.get(primo) ? orders.takeAway.primi.set(primo, (orders.takeAway.primi.get(primo) as number + 1)) : orders.takeAway.primi.set(primo, 1));
        data?.secondi.forEach((secondo: string) => orders.takeAway.secondi.get(secondo) ? orders.takeAway.secondi.set(secondo, (orders.takeAway.secondi.get(secondo) as number + 1)) : orders.takeAway.secondi.set(secondo, 1));
        data?.contorni.forEach((contorno: string) => orders.takeAway.contorni.get(contorno) ? orders.takeAway.contorni.set(contorno, (orders.takeAway.contorni.get(contorno) as number + 1)) : orders.takeAway.contorni.set(contorno, 1));
        data?.pizze.forEach((pizza: string) => orders.takeAway.pizze.get(pizza) ? orders.takeAway.pizze.set(pizza, (orders.takeAway.pizze.get(pizza) as number + 1)) : orders.takeAway.pizze.set(pizza, 1));
    })
    todayOrders.docs.filter(doc => !doc.data()?.takeAway).forEach(el => {
        const data = el.data();
        data?.primi.forEach((primo: string) => orders.coperti.primi.get(primo) ? orders.coperti.primi.set(primo, (orders.coperti.primi.get(primo) as number + 1)) : orders.coperti.primi.set(primo, 1));
        data?.secondi.forEach((secondo: string) => orders.coperti.secondi.get(secondo) ? orders.coperti.secondi.set(secondo, (orders.coperti.secondi.get(secondo) as number + 1)) : orders.coperti.secondi.set(secondo, 1));
        data?.contorni.forEach((contorno: string) => orders.coperti.contorni.get(contorno) ? orders.coperti.contorni.set(contorno, (orders.coperti.contorni.get(contorno) as number + 1)) : orders.coperti.contorni.set(contorno, 1));
        data?.pizze.forEach((pizza: string) => orders.coperti.pizze.get(pizza) ? orders.coperti.pizze.set(pizza, (orders.coperti.pizze.get(pizza) as number + 1)) : orders.coperti.pizze.set(pizza, 1));
    })
    console.log(orders);
    return orders;
}