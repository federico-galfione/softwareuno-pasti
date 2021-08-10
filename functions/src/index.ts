import * as cors from 'cors';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';


admin.initializeApp();
// import * as admin from 'firebase-admin';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

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

//Check if the user is authenticated and has role == role
async function authenticate(req: functions.https.Request, role: string = 'ADMIN'): Promise<admin.auth.DecodedIdToken>{
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

