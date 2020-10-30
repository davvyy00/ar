var Common = (function() {
    console.log('IFFE called');
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

    return {
        makeFullScreen
    };
})();


document.addEventListener('DOMContentLoaded', (event) => {
    //the event occurred
    console.log('DOM loaded');

    /*let bee1 = document.querySelector('.one');
    let bee2 = document.querySelector('.two');

    bee1.addEventListener('click', (e)=>{
    	console.log(e.target)
    	alert(e.target.distancemsg);
    })

    bee2.addEventListener('click', (e)=>{
    	console.log(e.target);
    	alert(e.target.distancemsg);
    })*/
});
