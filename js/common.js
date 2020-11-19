var Common = (function() {

    let currentUserLocation;

    //const configOne = { asset: 'obj: #bee-obj; mtl: #bee-mtl', scale: '10 10 10' };
    const configOne = { asset: '#mug', scale: '.04 .04 .04' };

    const locations = [{ lat: 53.543909, long: -113.442837, uuid: 4 }];

    let locationChangedCount = 0;

    makeFullScreen = () => {
        console.log('make full screen');

        var doc = window.document;
        var docEl = doc.documentElement;

        var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

        if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
            requestFullScreen.call(docEl);
        } else {
            cancelFullScreen.call(doc);
        }
    }

    addModelToScene = (location, config) => {
        const scene = document.querySelector('a-scene');
        const icon = document.createElement('a-entity');
        icon.setAttribute('gps-entity-place', `latitude: ${location.latitude}; longitude: ${location.longitude}`);
        //icon.setAttribute('obj-model', config.asset);
        icon.setAttribute('gltf-model', config.asset);
        //icon.setAttribute('uuid', location.uuid);
        icon.setAttribute('scale', config.scale);
        icon.setAttribute('clickhandler', '');
        icon.setAttribute('animation-mixer', '');
        icon.setAttribute('class', 'mug');

        scene.appendChild(icon);
    }

    setCurrentUserLocation = (coords) => {
        currentUserLocation = coords;
    }

    getUserLocation = (onSuccess) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((resp) => {
                if (onSuccess) {
                    onSuccess(resp.coords);
                }
            })
        }
    }

    addInitialLocations = () => {
        var me = this;
        this.getUserLocation((coords) => {
            // Set the iniital location of the user
            this.setCurrentUserLocation(coords);
            // Get the prizes within one kilometer of the user
            Services.getPrizesNearLocation(coords.latitude, coords.longitude, 0.5, (resp) => {
                this.addAllModelsToScene(resp);
                this.setDebugContent(resp.length, currentUserLocation, locationChangedCount, 0);
            })
        })
    }

    addAllModelsToScene = (data) => {
        data.forEach((item) => {
            let location = item.data();
            this.addModelToScene(location.coordinates, configOne);
        })

    }

    removeModelsFromScene = () => {
        const beeModels = document.querySelectorAll('.mug') || [];

        beeModels.forEach((item)=>{
            item.remove();
        })
    }

    addNewLocations = () => {
        const currCoords = currentUserLocation;

        if (currCoords) {
            this.getUserLocation((newCoords) => {
                const distance = this.calcDistanceBetweenGeopoints(currCoords.latitude, currCoords.longitude, newCoords.latitude, newCoords.longitude);

                console.warn(`The user has moved ${distance} kms`);

                this.updateDistance(distance);

                if (distance && distance > .05) {
                    // Remove the old locations before adding new ones
                    this.removeModelsFromScene();
                    // Update current coords
                    this.setCurrentUserLocation(newCoords);
                    // get prizes from new location
                    Services.getPrizesNearLocation(newCoords.latitude, newCoords.longitude, 0.5, (resp) => {
                        // TODO Remove models from scene
                        this.addAllModelsToScene(resp);
                        locationChangedCount ++ 
                        this.setDebugContent(resp.length, currentUserLocation, locationChangedCount, distance);
                    })
                }
            })
        } else {
            this.addInitialLocations();
        }

    }

    //This function takes in latitude and longitude of two location and returns the distance (in km)
    calcDistanceBetweenGeopoints = (lat1, lon1, lat2, lon2) => {
        var R = 6371; // km
        var dLat = toRad(lat2 - lat1);
        var dLon = toRad(lon2 - lon1);
        var lat1 = toRad(lat1);
        var lat2 = toRad(lat2);

        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d;
    }

    // Converts numeric degrees to radians
    toRad = (Value) => {
        return Value * Math.PI / 180;
    }

    setDebugContent = (numLocations, location, countLocationChanged, moved) => {
        let a, b, c, d, prizes;
        a = document.querySelector('.num-locations');
        b = document.querySelector('.curr-location');
        c = document.querySelector('.count-location-changed');
        d = document.querySelector('.moved');

        prizes = document.querySelectorAll('.mug');

        a.innerHTML = `There are ${prizes.length} prizes now`;
        b.innerHTML = `The users last location was ${location.latitude} ${location.longitude}`;
        c.innerHTML = `The user changed locations ${countLocationChanged}`;
        d.innerHTML = `The user has moved ${moved} kms`;
    }

    updateDistance = (moved) => {
        let a = document.querySelector('.moved');

        a.innerHTML = `The user has moved ${moved} kms`;
    }

    goToExitPage = ()=>{
        window.open("exit-page.html","_self");
    }

    closeApp = ()=> {
        var customWindow = window.open('', '_blank', '');
        customWindow.close();
    }

    return {
        makeFullScreen,
        addModelToScene,
        locations,
        configOne,
        addInitialLocations,
        addNewLocations,
        closeApp,
        goToExitPage
    };
})();


document.addEventListener('DOMContentLoaded', (event) => {

    console.log('DOM loaded');

    setTimeout(() => {
        Common.addInitialLocations();
    }, 3000);

    // Call this every 20 seconds
    setInterval(() => {
        Common.addNewLocations()
    }, 10000)
});