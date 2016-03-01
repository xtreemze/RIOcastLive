$(document).ready(function () {
    $("#headerLiveTrackHolder").airtimeLiveTrackInfo({
        sourceDomain: "http://radio.riocast.net",
        text: {
            onAirNow: "AL AIRE",
            offline: "Offline",
            current: "Reproduciéndo ahora",
            next: "Próximamente"
        },
        updatePeriod: 20 //seconds
    });
    $("#onAirToday").airtimeShowSchedule({
        sourceDomain: "http://radio.riocast.net",
        updatePeriod: 20, //seconds
        showLimit: 20
    });

});

//var url = "http://radio.riocast.net:8000/status-json.xsl";


        //fix browser vender for AudioContext and requestAnimationFrame
        window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
        window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
        window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame;
        try {
            this.audioContext = new AudioContext();
        } catch (e) {
            this._updateInfo('!Your browser does not support AudioContext', false);
            console.log(e);
        }
    

// Create Audio Object and Decalre Properties

var audioElement = new Audio();
smartSource = function() {if (audioElement.canPlayType('audio/mpeg')) {
  audioElement.setAttribute('src','http://192.30.164.78:8000/rio');
  $('#mp3').addClass("active");
} else if (audioElement.canPlayType('audio/ogg')) {
  audioElement.setAttribute('src','http://192.30.164.78:8000/airtime');
  $('#ogg').addClass("active");
}
};
smartSource();

audioElement.controls = false;
audioElement.autoplay = false;
audioElement.crossOrigin = "anonymous";
audioElement.id = 'a';

$('#audio-visual')[0].appendChild(audioElement);


$('#pause').click(function() {
    audioElement.pause();
    $('#pause').addClass("btn-warning");
    $('#play').removeClass("btn-success");
    $('#bar').removeClass("active")
});

$('#reconnect').click(function() {
    $('#bar').removeClass("active").removeClass("progress-bar-success").addClass("progress-bar-warning");
    $('#pause').removeClass("btn-warning");
    smartSource(); checkSource();
    $('#play').removeClass("btn-success");
    play();
});

play = function() {
    audioElement.play();
    $('#pause').removeClass("btn-warning");
    $('#bar').addClass("active");
    $('#play').addClass("btn-success");
}

$('#play').click( function() {
    play();
    } );

play();

audioElement.addEventListener("stalled", function() {
    console.log('Audio Element Stall')
    redZone();
});

audioElement.addEventListener("loadstart", function() {
    console.log('Audio Element Loading...')
        $('#bar').addClass("progress-bar-info").removeClass("progress-bar-danger").removeClass("progress-bar-warning").addClass("active");
        $('#play').removeClass("btn-danger").removeClass('btn-success');
        $('#pause').removeClass("btn-danger");
});

audioElement.addEventListener("canplay", function() {
    console.log('Audio Element Ready to Play')
        $('#bar').addClass("progress-bar-success").removeClass("progress-bar-info").removeClass("progress-bar-danger").removeClass("progress-bar-warning");
        $('#play').removeClass("btn-danger").removeClass('btn-success');
        $('#pause').removeClass("btn-danger");
        if (audioElement.paused){
        console.log('Can play but paused')
        } else { 
        $('#play').addClass("btn-success");
        $('#pause').removeClass("btn-warning");
        }
});

audioElement.addEventListener("abort", function() {
    console.log('Audio Element Abort')
    redZone();
});

redZone = function() {
    console.log('Red Zoned')
    //$('#bar').addClass("progress-bar-danger").removeClass("progress-bar-success").removeClass("active");
    //$('#play').addClass("btn-danger");
    //$('#pause').addClass("btn-danger").removeClass("btn-warning");    
}



    // canvas stuff
    canvas = $('#c')[0];
    canvasCtx = canvas.getContext('2d');

    // Create Analyzer
    context = new(window.AudioContext || window.webkitAudioContext)();
    analyser = context.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.5;
    //analyser.minDecibels = -90;
    //analyser.maxDecibels = -30;
    
// draw the analyser to the canvas
function freqAnalyser() {
    window.requestAnimationFrame(freqAnalyser);
    var sum;
    var average;
    var bar_width;
    var scaled_average;
    var num_bars = 24;

    data = new Uint8Array(128);
    analyser.getByteFrequencyData(data);


    // clear canvas
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    var gradient = canvasCtx.createLinearGradient(0, canvas.height, 0, 0);
    gradient.addColorStop(0, "#28B62C");
    gradient.addColorStop(0.8, "#F5D802");
    gradient.addColorStop(1, "red");
    canvasCtx.fillStyle = gradient;


    //DRAW Individual Bars
    var bin_size = Math.floor((data.length - 40) / num_bars);
    for (var i = 0; i < num_bars; i++) {
        sum = 0;
        for (var j = 0; j < bin_size; j++) {
            sum += data[(i * bin_size) + j];
        }
        average = sum / bin_size;
        bar_width = canvas.width / num_bars;
        scaled_average = (average / 256) * canvas.height;
        
        canvasCtx.fillRect(i * bar_width, canvas.height, bar_width / 1.1, -scaled_average);

    }


}

// NAVIGATION Buttons change audio source format between OGG and MP3
function sourceChange(soundFormat) {
    if ($('#a')[0].src !== soundFormat) {
        $('#a')[0].src = soundFormat;
        $('#a')[0].play();
    }

    checkSource();
}

checkSource = function() {
        if ($('#a')[0].src === 'http://192.30.164.78:8000/rio') {
        $('#mp3').addClass("active");
        $('#ogg').removeClass("active");
    } else if ($('#a')[0].src === 'http://192.30.164.78:8000/airtime') {
        $('#mp3').removeClass("active");
        $('#ogg').addClass("active");
    };
}

$('document').ready(function () {
   
    // connect AudioElement to Analyzer via source1 variable then Analyzer to Destination
    source1 = context.createMediaElementSource(audioElement);
    source1.connect(analyser);
    analyser.connect(context.destination);
    freqAnalyser();

    //Initial call 
    respondCanvas();
    
    //Run function when browser resizes
    $(window).resize(respondCanvas);

})


function respondCanvas() {
    canvas.width = $("#bottom").width(); //max width
    canvas.height = $("#controlAudio").height()-72; //max height
    //Call a function to redraw other content (texts, images etc)
}