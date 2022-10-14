const mongodb= require('mongodb');
const MongoClient = mongodb.MongoClient;
const dbName = 'instagram';
const connectionURL = 'mongodb://localhost:27017';
const OID = mongodb.ObjectId;

module.exports = {
    MongoClient,
    dbName,
    connectionURL,
    OID
}