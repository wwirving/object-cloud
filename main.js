// canvas setup

const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");

let width = 800;
let height = 500;

canvas.width = width;
canvas.height = height;

let score = 0;
let gameFrame = 0;
ctx.font = "50px Georgia";

// mouse interactivity

// get canvas position so we can use it to scale coordinates
let canvasPosition = canvas.getBoundingClientRect();

// measures current size and position of canvas element
const mouse = {
  x: canvas.width / 2, // start in middle of canvas
  y: canvas.height / 2,
  click: false,
};

canvas.addEventListener("mousedown", (event) => {
  // on click, mouse coordinate is overwritten with event coordinate
  mouse.click = true;
  mouse.x = event.x - canvasPosition.left;
  mouse.y = event.y - canvasPosition.top;
  console.log(mouse.x, mouse.y);
});

canvas.addEventListener("mouseup", () => {
  mouse.click = false;
});

const playerImg = new Image();
playerImg.src = "bigfolder.png";
// player character
class Player {
  constructor() {
    this.x = canvas.width / 2; //start coordinates
    this.y = canvas.height / 2;
    this.radius = 50;
    this.angle = 0;
    this.frameX = 0;
    this.frameY = 0;
    this.frame = 0;
    this.spriteWidth = 92;
    this.spriteHeight = 92;
  }

  update() {
    // takes distance between current position and mouse
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;
    // if mouse x position is not equal to current position
    if (mouse.x != this.x) {
      this.x -= dx / 30; // div 30 tames speed
      // dx can be - or + thus allowing both positions
    }
    if (mouse.y != this.y) {
      this.y -= dy / 30;
    }
  }

  draw() {
    if (mouse.click) {
      ctx.lineWidth = 0.2;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.stroke();
    }
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.fillRect(this.x, this.y, this.radius, 10);

    ctx.drawImage(
      playerImg,
      this.frameX * this.spriteWidth, //
      this.frameY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.x - 40, // adjust here to align item with collision area
      this.y - 50, // and here (i.e. - 60)
      this.spriteWidth, // scale here if needed (i.e. this.spriteWidth/4)
      this.spriteHeight
    );
  }
}

const player = new Player();

// bubbles

const bubblesArray = [];

class Bubble {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 100;
    this.radius = 50;
    this.speed = Math.random() * 5 + 1;
    this.distance;
    this.counted = false;
    this.sound = "sound1"; //Math.random() <= 0.5 ? "sound1" : "sound2";
    // ternary operator, if value produced by Math.random is less than 0.5, assign 'sound1' else assign 'sound2'
  }

  update() {
    this.y -= this.speed; //moves bubbles up the y axis depending on their speed value
    const dx = this.x - player.x;
    const dy = this.y - player.y;
    // updating distance for each bubble as a function of its current distance from bubble allows us to create a collision detection. NB - this must be called on the animate loop in order to work!
    this.distance = Math.sqrt(dx * dx + dy * dy);
  }

  draw() {
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
  }
}

const bubblePop1 = document.createElement("audio");
bubblePop1.src = "";
bubblePop1.crossOrigin = "anonymous";

const bubblePop2 = document.createElement("audio");
bubblePop1.src = "";
bubblePop2.crossOrigin = "anonymous";

function handleBubbles() {
  if (gameFrame % 50 == 0) {
    //every 50 frames..
    bubblesArray.push(new Bubble());
  }

  for (let i = 0; i < bubblesArray.length; i++) {
    // call update and draw methods for each bubbles in the array
    bubblesArray[i].update();
    bubblesArray[i].draw();
  }

  // when y position > 0 then delete bubbles. 0 - this.radius * 2 ensures full bubbles has passed

  for (let i = 0; i < bubblesArray.length; i++) {
    if (bubblesArray[i].y < 0 - bubblesArray[i].radius * 2) {
      bubblesArray.splice(i, 1);
    }

    if (bubblesArray[i]) {
      if (bubblesArray[i].distance < bubblesArray[i].radius + player.radius) {
        console.log("collision!");
        // this line allows us to set the score only once per bubble, even though multiple collisions will continue to be registered
        if (!bubblesArray[i].counted) {
          if (bubblesArray[i].sound == "sound1") {
            console.log("fuck");
            bubblePop1.play();
          } else {
            console.log(bubblesArray[i].sound);
            bubblePop2.play();
          }
          score++;
          bubblesArray[i].counted = true;
          bubblesArray.splice(i, 1); //by calling splice, we remove i element from the array upon collision (1 just means only this one)
        }
      }
    }
    // collision detection, using distance of each bubble agaisnt player radius
  }
}

// animation loop

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas as part of render loop
  player.update();
  player.draw();
  handleBubbles();

  ctx.fillStyle = "black";
  ctx.fillText("score: " + score, 10, 50);
  gameFrame++; // increase game frame as game continues
  requestAnimationFrame(animate);
}

let resizeCanvas = () => {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width - 100;
  canvas.height = height - 104;
  ctx.font = "50px Georgia";
};

resizeCanvas();

window.addEventListener("resize", () => {
  resizeCanvas();
});

animate();
