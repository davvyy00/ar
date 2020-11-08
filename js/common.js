// Click event for a 3d model, or any object inside the scene
AFRAME.registerComponent('clickhandler', {
    init: function() {
        this.el.addEventListener('click', () => {
            console.log(this.el);
            const distance = this.el.getAttribute('distancemsg')
            alert(`You are ${distance} from the bee`);
        });
    }
});

var Common = (function() {

    let currentUserLocation;

    const configOne = { asset: 'obj: #bee-obj; mtl: #bee-mtl', scale: '10 10 10' };

    const locations = [{ lat: 53.543909, long: -113.442837, uuid: 4 }];

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
        icon.setAttribute('gps-entity-place', `latitude: ${location.lat}; longitude: ${location.long}`);
        icon.setAttribute('obj-model', config.asset);
        //icon.setAttribute('uuid', location.uuid);
        icon.setAttribute('scale', config.scale);
        icon.setAttribute('clickhandler', '');
        //icon.setAttribute('animation-mixer', '');

        scene.appendChild(icon);
    }

    setCurrentUserLocation = (coords) => {
        this.currentUserLocation = coords;
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
            Services.getPrizesNearLocation(coords.latitude, coords.longitude, 1000, (resp) => {
                console.log(coords)
                console.log(resp)
                // add models to scene func
                this.addModelToScene(location, configOne);
            })
        })
    }

    addNewLocations = () => {
        const currCoords = this.currentUserLocation;
      
        if (currCoords) {
            this.getUserLocation((newCoords) => {
                const distance = this.calcDistanceBetweenGeopoints(currCoords.latitude, currCoords.longitude, newCoords.latitude, newCoords.longitude);

                console.warn(`The user has moved ${distance} kms`);

                if(distance > 1) {
                    // Update current coords
                    // get prizes from new location
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

    return {
        makeFullScreen,
        addModelToScene,
        locations,
        configOne,
        addInitialLocations,
        addNewLocations
    };
})();


document.addEventListener('DOMContentLoaded', (event) => {

    console.log('DOM loaded');

    setTimeout(() => {
        Common.addInitialLocations();
    }, 3000);

    // Call this every 20 seconds
    setInterval(() => {
        //Common.addNewLocations()
    }, 10000)
});