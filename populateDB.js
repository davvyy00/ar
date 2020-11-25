// TODO: Replace the following with your app's Firebase project configuration
var firebaseConfig = {
    apiKey: "AIzaSyCNuxdjzx7hyAmbOAiT3SsEgPy-Br0vQ_k",
    authDomain: "ar-test-98f3b.firebaseapp.com",
    databaseURL: "https://ar-test-98f3b.firebaseio.com",
    projectId: "ar-test-98f3b",
    storageBucket: "ar-test-98f3b.appspot.com",
    messagingSenderId: "552186953036",
    appId: "1:552186953036:web:8bddf3af9886362cee63e9",
    measurementId: "G-WZPEEFDFCE"
};

var GeoFirestore = require('geofirestore').GeoFirestore;
var firebase = require('firebase');
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const geoFirestore = new GeoFirestore(db);

var parse = require('csv-parse')
const fs = require('fs')

var addLocation = (rows) => {
    const collection = geoFirestore.collection('prize_locations');

    rows.forEach((row) => {
    	console.warn(row[0]);
        collection.add({
            coordinates: new firebase.firestore.GeoPoint(Number(row[0]), Number(row[1])),
            prize_type: row[2],
            prize_desc: row[3],
            claimed_by: '',
        })
    })
}


fs.readFile('./sample-data.csv', function(err, fileData) {
    parse(fileData, { columns: false, trim: true }, function(err, rows) {
        // Your CSV data is in an array of arrys passed to this callback as rows.
        console.log(rows)
        addLocation(rows);
    })
})