// const gen = document.getElementById('pad');
// gen.addEventListener("mousemove", (event) => {
//     event.preventDefault();
//     updatefrequencyrespose(event.clientX);
//     var xhr = new XMLHttpRequest();
//     var JSON_sent = {signal};
//     xhr.open('POST', '/', true);z
//     xhr.setRequestHeader('Content-Type', 'application/json');
//     xhr.onload = function (e) {
//         if (xhr.readyState === 4 && xhr.status === 200) {
//             console.log(JSON_sent['signal'])
//             console.log(JSON.parse(xhr.response))
//             Plotly.newPlot('output-plot', [{
//                 x: x_s,
//                 y: JSON.parse(xhr.response),
//                type: 'scatter'
//             }],layoutoutput);
            
//         } else {
//             console.log(xhr.responseText);
//         }
//     };
//     xhr.send(JSON.stringify(JSON_sent));
//   });
//   function updatefrequencyrespose(x) {
//     signal.push(x);
//     x_val ++;
//     x_s.push(x_val);
//     if (x_s.length > 100) {
//         x_s.shift();
//         signal.shift();
//     }
//     Plotly.newPlot('live-plot', [{
//         x: x_s,
//         y: signal,
//         type: 'scatter'
//     }],layoutinput);

// }
// const gen = document.getElementById('pad');
// gen.addEventListener("mousemove", (event) => {
//     event.preventDefault();
//     drawAll(event.clientX);
//     var xhr = new XMLHttpRequest();
//     var JSON_sent = {signal};
//     xhr.open('POST', '/', true);
//     xhr.setRequestHeader('Content-Type', 'application/json');
//     xhr.onload = function (e) {
//         if (xhr.readyState === 4 && xhr.status === 200) {
//             console.log(JSON_sent['signal'])
//             console.log(JSON.parse(xhr.response))
//             Plotly.newPlot('output-plot', [{
//                 x: x_s,
//                 y: JSON.parse(xhr.response),
//                type: 'scatter'
//             }],layoutoutput);
            
//         } else {
//             console.log(xhr.responseText);
//         }
//     };
//     xhr.send(JSON.stringify(JSON_sent));
//     angle = data.angle;
//     drawAll(x, y, angle, 'myDiv', 'magnitude', 'angle');

//   });
// //   function update_graph(w){
// //     signal.push(w);
// //     x_val ++;
// //     x_s.push(x_val);
// //     if (x_s.length > 100) {
// //         x_s.shift();
// //         signal.shift();
// //     }
// //     Plotly.newPlot('live-plot', [{
// //         x: x_s,
// //         y: signal,
// //         type: 'scatter'
// //     }],layoutinput);

// // }

const gen = document.getElementById('pad');
gen.addEventListener("mousemove", (event) => {
    event.preventDefault();
    update_graph(event.clientX);
    var xhr = new XMLHttpRequest();
    var JSON_sent = { signal };
    xhr.open('POST', '/generate', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function(e) {
        if (xhr.readyState === 4 && xhr.status === 200) {
            drawfrequencyreposne(x_s, signal, JSON.parse(xhr.response), "realTimeSignal2", "input", "output")

        } else {
            console.log(xhr.responseText);
            console.log("ahmed")
        }
    };
    xhr.send(JSON.stringify(JSON_sent));
});

function update_graph(x) {
    signal.push(x);
    x_val++;
    x_s.push(x_val);
    if (x_s.length > 100) {
        x_s.shift();
        signal.shift();
    }


}