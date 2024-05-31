const { Firestore } = require('@google-cloud/firestore');
require('dotenv').config();

const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);

const firestore = new Firestore({
  projectId: CREDENTIALS.project_id,
  credentials: {
    client_email: CREDENTIALS.client_email,
    private_key: CREDENTIALS.private_key.replace(/\\n/g, '\n') // fix for multiline private key
  }
});

const sample_collection = firestore.collection('Destinations');

const upsertRecord = async (record) => {
  try {
    const querySnapshot = await sample_collection.where('Destination name', '==', record['Destination name']).get();
    if (querySnapshot.empty) {
      await sample_collection.add(record);
      console.log(`Record for ${record['Destination name']} created.`);
    } else {
      querySnapshot.forEach(async (doc) => {
        await sample_collection.doc(doc.id).update(record);
        console.log(`Record for ${record['Destination name']} updated.`);
      });
    }
  } catch (error) {
    console.log(`Error at upsertRecord --> ${error}`);
  }
};

let database = require('./dataset_malang.json');

for (let index = 0; index < database.length; index++) {
  let element = database[index];
  element['isActive'] = true;
  upsertRecord(element);
}
