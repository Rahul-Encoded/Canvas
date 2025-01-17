let canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let c = canvas.getContext('2d');

let mouse = {
    x: undefined,
    y: undefined,
}

window.addEventListener('mousemove', 
    function(event){
        mouse.x = event.x;
        mouse.y = event.y;
    }
);

window.addEventListener("resize", 
    function(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        init();
    }
);

function getRandomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1) + 1);
}

function getDistance(x1, y1, x2, y2){
    let xDist = x2 - x1;
    let yDist = y2 - y1;

    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(xDist, 2));
}

function Object(x, y, radius, dx, dy, color) {
    this.x = x;
    this.dx = dx;
    this.y = y;
    this.dy = dy;
    this.radius = radius;
    this.color = color;

    this.draw = function () {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);
        c.fillStyle = this.color; 
        c.fill();
        c.strokeStyle = "black"; 
        c.stroke();
    };

    this.update = function(){
        
        this.draw();
    }

}

let circle1;
let circle2;
function init(){
    circle1 = new Object(300, 300, 40, 0, 0, "rgb(248, 44, 96)");
    circle2 = new Object(undefined, undefined, 40, 0, 0, "rgb(96, 217, 238)")
}

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight);
    circle1.update();
    circle2.x = mouse.x;
    circle2.y = mouse.y;
    circle2.update();

    if(getDistance(circle1.x, circle1.y, circle2.x, circle2.y) < circle1.radius + circle2.radius) circle1.color = "rgb(139, 48, 177)";
    else circle1.color = "rgb(248, 44, 96)";
}

init();
animate();