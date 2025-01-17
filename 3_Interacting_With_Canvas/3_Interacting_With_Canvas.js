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
)

function getRandomColor() {
    // const r = Math.floor(Math.random() * 256);
    // const g = Math.floor(Math.random() * 256);
    // const b = Math.floor(Math.random() * 256);
    // // const a = Math.random();
    // return `rgb(${r}, ${g}, ${b})`;

    let colorArray = [
        "#225378",
        "#1495a3",
        "#adf0f2",
        "#f3ffe2",
        "#eb7f00",
    ]

    return colorArray[Math.floor(Math.random() * colorArray.length)]
}

function Circle(x, y, radius, dx, dy, color) {
    this.x = x;
    this.dx = dx;
    this.y = y;
    this.dy = dy;
    this.radius = radius;
    this.maxRad = 45;
    this.minRad = radius;
    
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

        //INTERACTIVITY

        if ((mouse.x - this.x < 50) && 
            (mouse.x - this.x > -50) && 
            (mouse.y - this.y < 50) && 
            (mouse.y - this.y > -50) && 
            (this.radius < this.maxRad)) this.radius += 1;

        else if(this.radius > this.minRad) this.radius -= 1;

        this.draw();
    };
}

let circleArray = [];
function init(){

    circleArray = [];

    for (let i = 0; i < 250; i++) {
        let radius = Math.random() * 3 + 1;
        let x = Math.random() * (innerWidth - 2 * radius);
        let y = Math.random() * (innerHeight - 2 * radius);
        let dx = (Math.random() - 0.5) * 3;
        let dy = (Math.random() - 0.5) * 3;
        let color = getRandomColor(); 

        let circle = new Circle(x, y, radius, dx, dy, color);
        circleArray.push(circle);
    }
}

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < circleArray.length; i++) {
        circleArray[i].update();
    }
}

animate();
init();