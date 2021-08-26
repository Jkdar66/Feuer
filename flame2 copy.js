var canvas = document.createElement("canvas");
document.body.appendChild(canvas);
var ctx = canvas.getContext("2d");

canvas.width = 50;
canvas.height = 150;


class Particle {
    constructor(x, y) {
        this.radius = Math.round( 5 + Math.random() * 15);
        this.x = Math.round(x);
        this.y = Math.round(y + this.radius);
        var min_xs = 0;
        this.xs = (-min_xs/2 + Math.random() * min_xs);

        this.ys = Math.round(-1 + Math.random() * 0.5);

        this.remaining_radius = this.radius;
        this.life = Math.round(5 + Math.random() * 5);
        this.remaining_life = this.life;
        this.r = 255; //Math.round(Math.random() * 255);
        this.g = 125; //125;
        this.b = 30; //30 //Math.round(Math.random() * 100);
    }
}

class Bullet {
    constructor(config) {
        this.x = config.x;
        this.y = config.y;
        this.particle = [];
        for (let j = 0; j < 200; j++) {
            var flameParticle = new Particle(this.x, this.y);
            this.particle.push(flameParticle);
        }
    }
    draw() {
        for (let i = 0; i < this.particle.length; i++) {
            var elem = this.particle[i];

            var path = new Path2D();
            path.arc(elem.x, elem.y, elem.remaining_radius, 0, Math.PI * 2, false);

            ctx.globalCompositeOperation = "color-dodge";
            var opacity = Math.round(elem.remaining_life / elem.life * 100) / 100;

            var r = elem.remaining_radius;
            var gradient = ctx.createRadialGradient(elem.x, elem.y, 0, elem.x, elem.y, r);
            
            gradient.addColorStop(0, "rgba(" + elem.r + ", " + elem.g + ", " + elem.b + ", " + opacity + ")");
            gradient.addColorStop(1, "rgba(" + elem.r + ", " + elem.g + ", " + elem.b + ", 0)");

            ctx.fillStyle = gradient;

            ctx.fill(path);

            
            elem.remaining_life -= 1;
            elem.remaining_radius -= 0.5;
            elem.x += elem.xs;
            elem.y -= elem.ys*8;

            if (elem.remaining_life < 0 || elem.remaining_radius < 0) {
                var flameParticle = new Particle(this.x, this.y);
                this.particle.push(flameParticle);
                this.particle.splice(i, 1);
                i--;
            }
        }
    }
}

var bullet = new Bullet({x: 25, y: 0});

function update(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.fillStyle = "black";
    // ctx.fillRect(0, 0, canvas.width, canvas.height);
    bullet.draw();
    requestAnimationFrame(update);
}

update();


var zip = new JSZip();

var img = zip.folder("images");

document.getElementById("start").onclick = () => {
    for (let i = 0; i < 100; i++) {
        var imgs = canvas.toDataURL("image/png");
        img.file(i + ".png", imgs.substr(imgs.indexOf(',')+1), { base64: true });
    }
    
    zip.generateAsync({type:"blob"})
    .then(function(content) {
        // Force down of the Zip file
        saveAs(content, "archive.zip");
    });
}
