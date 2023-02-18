let zplanecanvas = document.getElementById("zplanecanvas");
let ctxzplane = zplanecanvas.getContext("2d");
let type = "zeros";
let hittype;
let magnitude;
let angle;
let w;
let zerosvalues;
let polesvalues;
let hit;
let allpassfilterszeros = [];
let allpassfilterspoles = [];
let slidervalue = 10;
let signalIterator = 0;
let $canvas = $("#zplanecanvas");
let canvasOffset = $canvas.offset();
let offsetX = canvasOffset.left;
let offsetY = canvasOffset.top;
let cw = zplanecanvas.width;
let ch = zplanecanvas.height;



drawfrequencyreposne([], [], [], "mydiv", '', '');


// flag to indicate a drag is in process
// and the last XY position that has already been processed
let isDown = false;
let lastX;
let lastY;

// the radian value of a full circle is used often, cache it
let PI2 = Math.PI * 2;

// letiables relating to existing zeros and poles
let zeros = [];
let poles = [];
let draggingelement = -1;

function getvalues(element) {
  return ([((element[0] - 150) / 100), (-(element[1] - 150) / 100)])
}

function drawfrequencyreposne(w, magnitude, angle, div, label1, label2) {
  let trace1 = {
    x: w,
    y: magnitude,
    type: 'scatter',
    name: label1
  };

  let trace2 = {
    x: w,
    y: angle,
    xaxis: 'x2',
    yaxis: 'y2',
    type: 'scatter',
    name: label2
  };

  let data = [trace1, trace2];

  let layout = {
    grid: {
      rows: 2,
      columns: 1,
      pattern: 'independent'
    },
  };

    if(w>w+50){
      w.shift();
      signal.shift();
    }
  Plotly.newPlot(div, data, layout);

}
drawPlane(ctxzplane);

function drawPlane(context) {
  context.beginPath();
  context.arc(150, 150, 100, 0, 2 * Math.PI);
  context.stroke();
  context.moveTo(10, 150);
  context.lineTo(290, 150);
  context.stroke();
  context.moveTo(150, 10);
  context.lineTo(150, 290);
  context.strokeStyle = '#000000';
  context.stroke();
  context.closePath();
}

function changeType() {
  type = $('input[name="type"]:checked').val();
}




function drawAll(context, allzeros, allpoles, color) {



  drawPlane(context);
  for (let i = 0; i < allzeros.length; i++) {
    let zero = allzeros[i];
    context.beginPath();
    context.strokeStyle = color;
    context.arc(zero[0], zero[1], 6, 0, PI2);
    if (hittype == 'zeros' && i == hit) {
      context.strokeStyle = '#ff0000';

    }
    context.stroke();
    context.closePath();

  }

  for (let i = 0; i < allpoles.length; i++) {
    let pole = allpoles[i];
    let x = pole[0];
    let y = pole[1];
    context.beginPath();
    context.moveTo(x + 6 / Math.sqrt(2), y + 6 / Math.sqrt(2));
    context.lineTo(x - 6 / Math.sqrt(2), y - 6 / Math.sqrt(2));
    context.moveTo(x + 6 / Math.sqrt(2), y - 6 / Math.sqrt(2));
    context.lineTo(x - 6 / Math.sqrt(2), y + 6 / Math.sqrt(2));
    context.strokeStyle = color;
    if (hittype != 'zeros' && i == hit) {
      context.strokeStyle = '#ff0000';
    }
    context.stroke();
    context.closePath();
  }
}

function handleMouseDown(e) {

  // tell the browser we'll handle this event
  e.preventDefault();
  e.stopPropagation();
  // save the mouse position
  // in case this becomes a drag operation
  lastX = parseInt(e.clientX - offsetX);
  lastY = parseInt(e.clientY - offsetY);
  hit = -1;
  // hit test all existing zeros
  for (let i = 0; i < zeros.length; i++) {
    let zero = zeros[i];
    let dx = lastX - zero[0];
    let dy = lastY - zero[1];
    if (dx * dx + dy * dy < 6 * 6) {
      hit = i;
      hittype = "zeros"
      $("#coordinates").html("(" + ((zero[0] - 150) / 100) + "," + (-(zero[1] - 150) / 100) + ")");

    }
  }
  // hit test all existing poles
  for (let i = 0; i < poles.length; i++) {
    let pole = poles[i];
    let dx = lastX - pole[0];
    let dy = lastY - pole[1];
    if (dx * dx + dy * dy < 6 * 6) {
      hit = i;
      hittype = "poles"
      $("#coordinates").html("(" + ((pole[0] - 150) / 100) + "," + (-(pole[1] - 150) / 100) + ")");

    }
  }
  // if no hits then add a zeros or pole
  // if hit then set the isDown flag to start a drag
  if (hit < 0) {
    if (type == "zeros") {
      hittype = 'zeros';
      hit = zeros.length
      zeros.push([lastX, lastY]);
    } else {
      hittype = 'poles';
      hit = poles.length
      poles.push([lastX, lastY]);
    }
    $("#coordinates").html("(" + ((lastX - 150) / 100) + "," + (-(lastY - 150) / 100) + ")");
  } else {

    if (hittype == "zeros") {
      draggingelement = zeros[hit];
    } else {
      draggingelement = poles[hit];
    }

    isDown = true;
  }
  updatefrequencyrespose();

}

function handleMouseUp(e) {
  // tell the browser we'll handle this event
  e.preventDefault();
  e.stopPropagation();

  // stop the drag
  isDown = false;
}

function handleMouseMove(e) {
  // if we're not dragging, just exit
  if (!isDown) {
    return;
  }

  // tell the browser we'll handle this event
  e.preventDefault();
  e.stopPropagation();

  // get the current mouse position
  mouseX = parseInt(e.clientX - offsetX);
  mouseY = parseInt(e.clientY - offsetY);

  // calculate how far the mouse has moved
  // since the last mousemove event was processed
  let dx = mouseX - lastX;
  let dy = mouseY - lastY;

  // reset the lastX/Y to the current mouse position
  lastX = mouseX;
  lastY = mouseY;

  // change the target circles position by the
  // distance the mouse has moved since the last
  // mousemove event
  draggingelement[0] += dx;
  draggingelement[1] += dy;


  $("#coordinates").html("(" + ((lastX - 150) / 100) + "," + (-(lastY - 150) / 100) + ")");
  // redraw all the circles
  updatefrequencyrespose();

}


function sendzeros() {
  zerosvalues = zeros.map(getvalues);
  let js_zeros = JSON.stringify(zerosvalues);
  $.ajax({
    url: '/getzeros',
    type: 'post',
    contentType: 'application/json',
    dataType: 'json',
    data: js_zeros
  });
}

function sendpoles() {
  polesvalues = poles.map(getvalues)
  let js_poles = JSON.stringify(polesvalues);

  $.ajax({
    url: '/getpoles',
    type: 'post',
    contentType: 'application/json',
    dataType: 'json',
    data: js_poles
  });
}

function updatefrequencyrespose() {
  sendzeros();
  sendpoles();
  $.ajax({
    url: '/sendfrequencyresposedata',
    type: 'get',
    success: function(response) {
      data = response;
      magnitude = data.magnitude;
      w = data.w;
      angle = data.angle;
      drawfrequencyreposne(w, magnitude, angle, 'myDiv', 'magnitude', 'angle');
      ctxzplane.clearRect(0, 0, cw, ch);
      drawAll(ctxzplane, zeros, poles, '#0000FF');
      drawAll(ctxzplane, allpassfilterszeros, allpassfilterspoles, '#91b233')
    }
  });
}





//Responsible for deleting of a specific zero or pole
function deleteFreq() {
  getFrequencyArray().splice(hit, 1);
  updatefrequencyrespose();
}

// Deleting All zeros
function clearallZeros() {
  zeros.splice(0, zeros.length);
  updatefrequencyrespose();
}
// Deleting ALL poles
function clearallPoles() {
  poles.splice(0, poles.length);
  updatefrequencyrespose();
}

function clearAll() {
  zeros.splice(0, zeros.length);
  poles.splice(0, poles.length);
  updatefrequencyrespose();
}


// Call this function to know whether you want the zeros or poles array of objects AND RETURNS IT
function getFrequencyArray() {
  if (hittype == "zeros") {
    return zeros;
  } else {
    return poles;
  }
}

// save filter
function save_func(){

  var data_string = JSON.stringify(zeros);
  var data_string1 = JSON.stringify(poles);
  var file = new Blob([data_string+""+data_string1],{type:"text"});
  var anchor = document.createElement("a");
  anchor.href = URL.createObjectURL(file);
  anchor.download = "save.txt";
  anchor.click();
}








// listen for mouse events

document
  .getElementById("zplanecanvas")
  .addEventListener("mousedown", function(e) {
    handleMouseDown(e);
  });
document
  .getElementById("zplanecanvas")
  .addEventListener("mousemove", function(e) {
    handleMouseMove(e);

  });
document.getElementById("zplanecanvas").addEventListener("mouseup", function(e) {
  handleMouseUp(e);
  drawfrequencyreposne(w, magnitude, angle, 'myDiv', 'magnitude', 'angle');

});
document
  .getElementById("zplanecanvas")
  .addEventListener("mouseout", function(e) {
    handleMouseUp(e);
  })

$(".side-button").click(function() {
  if ($(this).css("right") == "0px") {
    $(this).animate({
      right: $('.sidebar').outerWidth()
    }, 500);
    $(".sidebar").animate({
      right: "0"
    }, 500);
  } else {
    $(this).animate({
      right: "0"
    }, 500);
    $(".sidebar").animate({
      right: -$('.sidebar').outerWidth()
    }, 500);
  }
});



// ///////////
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
ctx.font = "16px Arial";
generate_signal([], [],  "myDiv", '');
generate_signal([], [],  "realTimeSignal", '');
let Xdata =[];
let Ydata =[];

function generate_signal(x, y, div, label1) {
  let trace1 = {
    x: x,
    y: y,
    mode: 'lines',
    name: label1,
    marker: {
      color: ' #5e5e5e '
    }
  };
  let data = [trace1];

  let layout = {
    title: 'generated Signal',
    xaxis: {title: 'X_axis'},
    yaxis: {title: 'Y_axis'},
    plot_bgcolor:"#f1f1f1",
    paper_bgcolor:"#f1f1f1",
  };
  
  Plotly.newPlot(div, data, layout);
}

ctx.beginPath();
ctx.stroke();
ctx.moveTo(10, 150);
ctx.stroke();
ctx.moveTo(150, 10);
ctx.strokeStyle = '#000000';
ctx.stroke();
ctx.closePath();

canvas.addEventListener("mousemove", function(e) { 
var cRect = canvas.getBoundingClientRect();        // Gets CSS pos, and width/height
var canvasX = Math.round(e.clientX - cRect.left);  // Subtract the 'left' of the canvas 
var canvasY = Math.round(e.clientY - cRect.top);   // from the X/Y positions to make  
ctx.clearRect(0, 0, canvas.width, canvas.height);  // (0,0) the top left of the canvas
var x=Math.random();
ctx.fillText(" Y: "+canvasY, 10, 20);
Xdata.push(canvasX);
Ydata.push(canvasY);




generate_signal(x,Ydata,'mydiv', 'generated Signal');

arr = [Ydata, x];
data = JSON.stringify(arr);

$.ajax({
 url: '/getSignals',
 type: 'post',
 contentType: 'application/json',
 dataType: 'json',
 data: data,
 success: function(response) {
   yData = response.canvasY;
   X=response.x;
   filtered = response.filter;
   generate_signal(X,filtered,'realTimeSignal', 'filtered signal');

 }
});
    
});




