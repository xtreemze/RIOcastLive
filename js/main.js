/* global $, Audio, AudioContext*/
// var url = "http://radio.riocast.net:8000/status-json.xsl"
// fix browser vender for AudioContext and requestAnimationFrame
window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame;
try {
  this.audioContext = new AudioContext();
} catch (e) {
  this._updateInfo("!Your browser does not support AudioContext", false);
  // console.log(e);
}
/*
 █████  ██    ██ ██████  ██  ██████       ██████  ██████       ██ ███████  ██████ ████████
██   ██ ██    ██ ██   ██ ██ ██    ██     ██    ██ ██   ██      ██ ██      ██         ██
███████ ██    ██ ██   ██ ██ ██    ██     ██    ██ ██████       ██ █████   ██         ██
██   ██ ██    ██ ██   ██ ██ ██    ██     ██    ██ ██   ██ ██   ██ ██      ██         ██
██   ██  ██████  ██████  ██  ██████       ██████  ██████   █████  ███████  ██████    ██
*/
// Create Audio Object and Decalre Properties
var audioElement = new Audio();

audioElement.controls = false;
audioElement.autoplay = false;
audioElement.crossOrigin = "anonymous";
audioElement.id = "a";
audioElement.src = "http://192.30.164.78:8000/bahia"
/*
 ██████  ██████  ███    ██ ████████ ██████   ██████  ██      ███████
██      ██    ██ ████   ██    ██    ██   ██ ██    ██ ██      ██
██      ██    ██ ██ ██  ██    ██    ██████  ██    ██ ██      ███████
██      ██    ██ ██  ██ ██    ██    ██   ██ ██    ██ ██           ██
 ██████  ██████  ██   ████    ██    ██   ██  ██████  ███████ ███████
*/
$("#audio-visual")[0].appendChild(audioElement);
$("#pause")
  .click(function () {
    audioElement.pause();
    $("#pause")
      .addClass("btn-warning");
    $("#play")
      .removeClass("btn-success");
    $("#bar")
      .removeClass("active");
  });

var play = function () {
  audioElement.play();
  $("#pause")
    .removeClass("btn-warning");
  $("#bar")
    .addClass("active");
  $("#play")
    .addClass("btn-success");
};
$("#play")
  .click(function () {
    play();
  });
play();
audioElement.addEventListener("loadstart", function () {
  // console.log("Audio Element Loading...");
  $("#bar")
    .addClass("progress-bar-info")
    .removeClass("progress-bar-danger")
    .removeClass("progress-bar-warning")
    .addClass("active");
  $("#play")
    .removeClass("btn-danger")
    .removeClass("btn-success");
  $("#pause")
    .removeClass("btn-danger");
});
audioElement.addEventListener("canplay", function () {
  // console.log("Audio Element Ready to Play");
  $("#bar")
    .addClass("progress-bar-success")
    .removeClass("progress-bar-info")
    .removeClass("progress-bar-danger")
    .removeClass("progress-bar-warning");
  $("#play")
    .removeClass("btn-danger")
    .removeClass("btn-success");
  $("#pause")
    .removeClass("btn-danger");
  if (audioElement.paused) {
    // console.log("Can play but paused");
  } else {
    $("#play")
      .addClass("btn-success");
    $("#pause")
      .removeClass("btn-warning");
  }
});
/*
 ██████  █████  ███    ██ ██    ██  █████  ███████
██      ██   ██ ████   ██ ██    ██ ██   ██ ██
██      ███████ ██ ██  ██ ██    ██ ███████ ███████
██      ██   ██ ██  ██ ██  ██  ██  ██   ██      ██
 ██████ ██   ██ ██   ████   ████   ██   ██ ███████
*/
var canvas = $("#c")[0];
var canvasCtx = canvas.getContext("2d");
// Create Analyzer
var context = new(window.AudioContext || window.webkitAudioContext)();
var analyser = context.createAnalyser();
analyser.fftSize = 256;
analyser.smoothingTimeConstant = 0.2;
analyser.minDecibels = -98
analyser.maxDecibels = -16
// draw the analyser to the canvas
/*
██████  ██████   █████  ██     ██
██   ██ ██   ██ ██   ██ ██     ██
██   ██ ██████  ███████ ██  █  ██
██   ██ ██   ██ ██   ██ ██ ███ ██
██████  ██   ██ ██   ██  ███ ███
*/
function freqAnalyser() {
  window.requestAnimationFrame(freqAnalyser);
  var sum;
  var average;
  var bar_width;
  var scaled_average;
  var num_bars = 10;
  var data = new Uint8Array(12);
  analyser.getByteFrequencyData(data);
  if (!analyser) {
    $("#vis")
      .html(data[0]);
  }
  // clear canvas
  canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
  var gradient = canvasCtx.createLinearGradient(0, canvas.height, 0, 0);
  gradient.addColorStop(0, "#4caf50");
  gradient.addColorStop(0.5, "#cddc39");
  gradient.addColorStop(0.98, "#f44336");
  canvasCtx.fillStyle = gradient;
  // DRAW Individual Bars
  var bin_size = Math.floor((data.length) / num_bars);
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
/*
███    ██  █████  ██    ██ ██  ██████   █████  ████████ ██  ██████  ███    ██
████   ██ ██   ██ ██    ██ ██ ██       ██   ██    ██    ██ ██    ██ ████   ██
██ ██  ██ ███████ ██    ██ ██ ██   ███ ███████    ██    ██ ██    ██ ██ ██  ██
██  ██ ██ ██   ██  ██  ██  ██ ██    ██ ██   ██    ██    ██ ██    ██ ██  ██ ██
██   ████ ██   ██   ████   ██  ██████  ██   ██    ██    ██  ██████  ██   ████
*/


function respondCanvas() {
  canvas.width = $("#bottom")
    .width(); // max width
  canvas.height = $("#controlAudio")
    .height() - 72; // max height
  // Call a function to redraw other content (texts, images etc)
}
/*
██████   ██████   ██████     ██████  ███████  █████  ██████  ██    ██
██   ██ ██    ██ ██          ██   ██ ██      ██   ██ ██   ██  ██  ██
██   ██ ██    ██ ██          ██████  █████   ███████ ██   ██   ████
██   ██ ██    ██ ██          ██   ██ ██      ██   ██ ██   ██    ██
██████   ██████   ██████     ██   ██ ███████ ██   ██ ██████     ██
*/
$("document")
  .ready(function () {
    // connect AudioElement to Analyzer via source1 variable then Analyzer to Destination
    var source1 = context.createMediaElementSource(audioElement);
    source1.connect(analyser);
    analyser.connect(context.destination);
    freqAnalyser();
    // Initial call
    respondCanvas();
    // Run function when browser resizes
    $(window)
      .resize(respondCanvas);
    $("#headerLiveTrackHolder")
      .airtimeLiveTrackInfo({
        sourceDomain: "http://radio.riocast.net",
        text: {
          onAirNow: "AL AIRE",
          offline: "Offline",
          current: "Reproduciéndo ahora",
          next: "Próximamente"
        },
        updatePeriod: 20 // seconds
      });
    $("#onAirToday")
      .airtimeShowSchedule({
        sourceDomain: "http://radio.riocast.net",
        updatePeriod: 20, // seconds
        showLimit: 20
      });
    if (window.audioContext || window.webkitAudioContext) {
      // console.log("audioContext Supported");
    } else {
      $("#vis")
        .hide();
    }
  });
