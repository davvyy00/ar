var Services = (function() {

    const db = firebase.firestore();
    const geoFirestore = new GeoFirestore(db);

    db.settings({ timestampsInSnapshots: true });

    let getLocations = () => {
        const collection = db.collection('prize_locations');

        collection.get().then(snapshot => {

            snapshot.forEach(doc => {

                console.log(doc.data().location);
                console.log(doc.id);

            });

        });
    }

    let setPrizeClaimed = (id) => {
        const collection = db.collection('prize_locations');

        collection.doc(id).update({ claimed_by: 'test' });
    }

    let addLocation = (data) => {
        const collection = geoFirestore.collection('prize_locations');

        collection.add({
            claimed_by: '',
            coordinates: new firebase.firestore.GeoPoint(data.lat, data.long),
        })
    }

    /**
     * [Get a list prizes near a gps location]
     * @param  {[type]} latitude
     * @param  {[type]} longitude
     * @param  {[type]} radius    [ The radius in kms]
     * @return {[type]}           [description]
     */
    let getPrizesNearLocation = (latitude, longitude, radius, onSuccess) => {
        const collection = geoFirestore.collection('prize_locations');

        //53.543909; longitude: -113.442837
        const query = collection.near({
            center: new firebase.firestore.GeoPoint(latitude, longitude),
            radius
        }).where('claimed_by', '==', '')

        // Get query (as Promise)
        query.get().then((value) => {
            // All GeoDocument returned by GeoQuery, like the GeoDocument added above
            console.log(value.docs);
            if(onSuccess) {
                onSuccess(value.docs);
            }
        });

    }

    return {
        getLocations,
        setPrizeClaimed,
        getPrizesNearLocation, 
        addLocation
    };

})();

//Services.getLocations();

//Services.addLocation({lat:53.539030,  long:  -113.418423});

//Services.setPrizeClaimed("7mDbuaJ9C56vrrAoXG7U")

// Test getting the prizes
//Services.getPrizesNearLocation(53.543909,-113.442837, 20)