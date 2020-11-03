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
    console.log('IFFE called');

    const configOne = { modelId: '#asset', scale: '10 10 10' };

    const locations = [{ lat: 53.543909, long: -113.442837, uuid: 4 }];

    let makeFullScreen = () => {
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

    let addModelToScene = (location, config) => {
        const scene = document.querySelector('a-scene');
        const icon = document.createElement('a-entity');
        icon.setAttribute('gps-entity-place', `latitude: ${location.lat}; longitude: ${location.long}`);
        icon.setAttribute('obj-model', config.modelId);
        icon.setAttribute('uuid', location.uuid);
        icon.setAttribute('scale', config.scale);
        icon.setAttribute('clickhandler', '');
        icon.setAttribute('animation-mixer', '');

        scene.appendChild(icon);
    }

    return {
        makeFullScreen,
        addModelToScene,
        locations,
        configOne
    };
})();


document.addEventListener('DOMContentLoaded', (event) => {

    console.log('DOM loaded');

    setTimeout(() => {
        Common.locations.forEach((location) => {
            Common.addModelToScene(location, Common.configOne);
        })
    }, 3000);
});