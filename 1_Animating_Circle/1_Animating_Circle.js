let canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


let c = canvas.getContext('2d');

//rectangle
//c.fillStyle = "";
//c.fillRect(x, y, width, height);

//line
//c.beginpath();
//c.moveto(x, y);
//c.lineTo(x, y);
//add colors
//c.strokeStyle = "";
//c.stroke();


//Arc/Circle
//c.beginPath(); //so the leine before this does not continue on to the next shape.
//c.arc(x: Int, y: Int, r: Int, startAngle: Float(Radians), endAngle: Float(Radians), drawCounterClockwise: Bool);
//c.stroke();

c.beginPath();
c.arc(200, 200, 30, 0, Math.PI*2, true);
c.strokeStyle = "#FFD700";
c.stroke();

let x = Math.random()*innerWidth; 
let y = Math.random()*innerHeight; 
let dx = (Math.random() - 0.5)*3; //Speed
let dy = (Math.random() - 0.5)*3;
let radius = 30;
function animate(){
    requestAnimationFrame(animate);

    c.clearRect(0, 0, innerWidth, innerHeight);
    c.beginPath();
    c.arc(x, y, radius, 0, Math.PI*2, true);
    c.strokeStyle = "#FFD700";
    c.stroke();
    // console.log(i);

    if((x + radius > innerWidth) || (x - radius < 0)) dx = -dx;
    if((y + radius > innerHeight) || (y - radius < 0)) dy = -dy;
    
    x += dx;
    y += dy
}

animate();