(function () {
    // Constants for configurable parameters
    const NUM_PARTICLES = 100;
    const MAX_VELOCITY = 2;
    const MIN_RADIUS = 10;
    const MAX_RADIUS = 20;
    const INTERACTION_RADIUS = 50;
    const MAX_SPEED = 5;
    const OPACITY_INCREMENT = 0.02;
    const MAX_OPACITY = 0.5;
    const MIN_SEPARATION = 1;
    const DAMPING = 1;
    const RESTITUTION = 1;
    const SEPARATION_SPEED = 0.5;
    
    const COLOR_PALETTE = [
        "#FF6B6B",
        "#FFD93D",
        "#6BCB77",
        "#4D96FF",
        "#FF6BA3"
    ];

    const canvas = document.querySelector('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const c = canvas.getContext('2d');

    const mouse = {
        x: undefined,
        y: undefined,
    };

    canvas.addEventListener('mousemove', function (event) {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    });

    canvas.addEventListener('mouseleave', function () {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    window.addEventListener('resize', function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
    });

    function getRandomColor() {
        return COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)];
    }

    function randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }

    function getDistance(x1, y1, x2, y2) {
        const xDist = x2 - x1;
        const yDist = y2 - y1;
        return Math.sqrt(xDist * xDist + yDist * yDist);
    }

    function rotate(velocity, angle) {
        return {
            x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
            y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
        };
    }

    function resolveCollision(particle, otherParticle) {
        const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
        const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;
        const xDist = otherParticle.x - particle.x;
        const yDist = otherParticle.y - particle.y;

        //Dot Product to check whether the particles are moving towards each other
        if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
            const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);
            const m1 = particle.mass;
            const m2 = otherParticle.mass;

            const u1 = rotate(particle.velocity, angle);
            const u2 = rotate(otherParticle.velocity, angle);

            const v1 = {
                x: (u1.x * (m1 - m2) + 2 * m2 * u2.x) / (m1 + m2),
                y: u1.y
            };
            const v2 = {
                x: (u2.x * (m2 - m1) + 2 * m1 * u1.x) / (m1 + m2),
                y: u2.y
            };

            const vFinal1 = rotate(v1, -angle);
            const vFinal2 = rotate(v2, -angle);

            // Apply damping and restitution
            particle.velocity.x = vFinal1.x * DAMPING * RESTITUTION;
            particle.velocity.y = vFinal1.y * DAMPING * RESTITUTION;
            otherParticle.velocity.x = vFinal2.x * DAMPING * RESTITUTION;
            otherParticle.velocity.y = vFinal2.y * DAMPING * RESTITUTION;
        }
    }

    class Particle {
        constructor(x, y, radius, color) {
            this.x = x;
            this.y = y;
            this.velocity = {
                x: randomFloat(-MAX_VELOCITY, MAX_VELOCITY),
                y: randomFloat(-MAX_VELOCITY, MAX_VELOCITY)
            };
            this.radius = radius;
            this.color = color;
            this.mass = radius * radius * Math.PI;
            this.opacity = 0;
            this.isColliding = false;
        }

        draw() {
            c.beginPath();
            c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            c.save();
            c.globalAlpha = this.opacity;
            c.fillStyle = this.color;
            c.fill();
            c.restore();
            c.strokeStyle = this.color;
            c.stroke();
            c.closePath();
        }

        update(particles) {
            this.draw();

            for (let i = 0; i < particles.length; i++) {
                if (this === particles[i]) continue;

                const distance = getDistance(this.x, this.y, particles[i].x, particles[i].y);
                const minDistance = this.radius + particles[i].radius + MIN_SEPARATION;

                if (distance < minDistance) {
                    // Apply separation force
                    const angle = Math.atan2(this.y - particles[i].y, this.x - particles[i].x);
                    
                    this.x += Math.cos(angle) * SEPARATION_SPEED;
                    this.y += Math.sin(angle) * SEPARATION_SPEED;
                    particles[i].x -= Math.cos(angle) * SEPARATION_SPEED;
                    particles[i].y -= Math.sin(angle) * SEPARATION_SPEED;

                    // Resolve collision
                    resolveCollision(this, particles[i]);

                    // Adjust positions to prevent overlapping
                    const overlap = minDistance - distance;
                    const moveBy = overlap / 2;

                    this.x += Math.cos(angle) * moveBy;
                    this.y += Math.sin(angle) * moveBy;
                    particles[i].x -= Math.cos(angle) * moveBy;
                    particles[i].y -= Math.sin(angle) * moveBy;
                }
            }

            // Mouse interaction
            if (mouse.x !== undefined && mouse.y !== undefined) {
                const distance = getDistance(mouse.x, mouse.y, this.x, this.y);

                if (distance < INTERACTION_RADIUS) {
                    if (this.opacity < MAX_OPACITY) {
                        this.opacity += OPACITY_INCREMENT;
                    }
                    
                    const force = (INTERACTION_RADIUS - distance) / INTERACTION_RADIUS;
                    const angle = Math.atan2(this.y - mouse.y, this.x - mouse.x);
                    
                    const acceleration = {
                        x: Math.cos(angle) * force,
                        y: Math.sin(angle) * force
                    };
                    this.velocity.x += acceleration.x;
                    this.velocity.y += acceleration.y;
                } 
                else {
                    if (this.opacity > 0) {
                        this.opacity -= OPACITY_INCREMENT;
                        this.opacity = Math.max(0, this.opacity);
                    }
                }
            } 
            else {
                if (this.opacity > 0) {
                    this.opacity -= OPACITY_INCREMENT;
                    this.opacity = Math.max(0, this.opacity);
                }
            }

            // Speed limiting
            const speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
            if (speed > MAX_SPEED) {
                this.velocity.x = (this.velocity.x / speed) * MAX_SPEED;
                this.velocity.y = (this.velocity.y / speed) * MAX_SPEED;
            }

            // Update position
            this.x += this.velocity.x;
            this.y += this.velocity.y;

            // Boundary collision
            if (this.x - this.radius <= 0 || this.x + this.radius >= canvas.width) {
                this.velocity.x = -this.velocity.x * RESTITUTION;
                this.x = Math.max(this.radius, Math.min(this.x, canvas.width - this.radius));
            }
            if (this.y - this.radius <= 0 || this.y + this.radius >= canvas.height) {
                this.velocity.y = -this.velocity.y * RESTITUTION;
                this.y = Math.max(this.radius, Math.min(this.y, canvas.height - this.radius));
            }
        }
    }

    let particles;

    function init() {
        particles = [];
        for (let i = 0; i < NUM_PARTICLES; i++) {
            const radius = randomFloat(MIN_RADIUS, MAX_RADIUS);
            let x = randomFloat(radius, canvas.width - radius);
            let y = randomFloat(radius, canvas.height - radius);
            const color = getRandomColor();

            if (particles.length > 0) {
                let overlap = false;
                do {
                    overlap = false;
                    for (let j = 0; j < particles.length; j++) {
                        if (getDistance(x, y, particles[j].x, particles[j].y) < radius + particles[j].radius + MIN_SEPARATION) {
                            x = randomFloat(radius, canvas.width - radius);
                            y = randomFloat(radius, canvas.height - radius);
                            overlap = true;
                            break;
                        }
                    }
                } while (overlap);
            }

            particles.push(new Particle(x, y, radius, color));
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        c.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(particle => particle.update(particles));
    }

    init();
    animate();
})();