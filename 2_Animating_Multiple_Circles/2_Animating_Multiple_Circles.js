let canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let c = canvas.getContext('2d');


function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    // const a = Math.random();
    return `rgb(${r}, ${g}, ${b})`;
}

function Circle(x, y, radius, dx, dy, color) {
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

    this.update = function () {
        if ((this.x + this.radius > innerWidth) || (this.x - this.radius < 0)) this.dx = -this.dx;
        if ((this.y + this.radius > innerHeight) || (this.y - this.radius < 0)) this.dy = -this.dy;

        this.x += this.dx;
        this.y += this.dy;

        this.draw();
    };
}

let circleArray = [];
let radius = 30;

for (let i = 0; i < 100; i++) {
    let x = Math.random() * (innerWidth - 2 * radius);
    let y = Math.random() * (innerHeight - 2 * radius);
    let dx = (Math.random() - 0.5) * 3;
    let dy = (Math.random() - 0.5) * 3;
    let color = getRandomColor(); 

    let circle = new Circle(x, y, radius, dx, dy, color);
    circleArray.push(circle);
}

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < circleArray.length; i++) {
        circleArray[i].update();
    }
}

animate();
