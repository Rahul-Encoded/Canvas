let canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let c = canvas.getContext('2d');

window.addEventListener("resize", 
    function(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        init();
    }
);

window.addEventListener("click", function(){
    init();
})

function getRandomColor() {

    let colorArray = [
        "#225378",
        "#1495a3",
        "#adf0f2",
        "#f3ffe2",
        "#eb7f00",
    ]

    return colorArray[Math.floor(Math.random() * colorArray.length)]
}

function getRandomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1) + 1);
}

let gravity = 0.5; 
let elasticity = 0.9; 
let friction = 0.99; 

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

    this.update = function () {
        // Vertical bounce and gravity
        if (this.y + this.radius + this.dy > innerHeight) {
            this.dy = -this.dy * elasticity; // Invert and reduce speed
        } else {
            this.dy += gravity; // Apply gravity
        }

        // Horizontal wall bounce
        if ((this.x + this.radius > innerWidth) || (this.x - this.radius < 0)) {
            this.dx = -this.dx * elasticity;
        }

        // Friction application
        this.dx *= friction;
        this.dy *= friction;

        // Update position
        this.x += this.dx;
        this.y += this.dy;

        // Stop jittering for very small velocities
        if (Math.abs(this.dy) < 0.05) this.dy = 0;
        if (Math.abs(this.dx) < 0.05) this.dx = 0;

        this.draw();
    };
}


let balls = [];
function init(){
    balls = [];
    
    for (let i = 0; i < 1000; i++) {
        let radius = getRandomInt(12, 24);
        let x = getRandomInt(radius, canvas.width - radius)
        let y = getRandomInt(radius, canvas.height - radius)
        let dx = getRandomInt(-100, 100);
        let dy = getRandomInt(-100, 100);
        let color = getRandomColor(); 

        let ball = new Object(x, y, radius, dx, dy, color);
        balls.push(ball);
    }

}

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight);
    for(let i = 0; i < balls.length; i++){
        balls[i].update();
    }
}

init();
animate();