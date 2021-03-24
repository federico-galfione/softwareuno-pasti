import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';
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
            console.log(e);
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

//CHeck id the user is authenticated and an ADMIN
async function authenticate(req: functions.https.Request): Promise<admin.auth.DecodedIdToken>{
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        throw new Error();
      }
      const idToken = req.headers.authorization.split('Bearer ')[1];
      try {
        const decodedIdToken = await admin.auth().verifyIdToken(idToken);
        if((await admin.firestore().collection('users').doc(decodedIdToken.uid).get()).data()?.role !== 'ADMIN'){
            throw new Error();
        }
        return decodedIdToken;
      } catch(e) {
        throw new Error();
      }
}