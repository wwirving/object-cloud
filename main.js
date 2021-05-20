// canvas setup

//sound loadins

const bearSound = new Howl({
  src: ["./sounds/1.mp3"],
});
const bijoSound = new Howl({
  src: ["./sounds/2.mp3"],
});
const folderSound = new Howl({
  src: ["./sounds/3.mp3"],
});
const heroSound = new Howl({
  src: ["./sounds/4.mp3"],
});
const humbergSound = new Howl({
  src: ["./sounds/5.mp3"],
});
const kamakiriSound = new Howl({
  src: ["./sounds/6.mp3"],
});
const masterSound = new Howl({
  src: ["./sounds/7.mp3"],
});
const milkSound = new Howl({
  src: ["./sounds/8.mp3"],
});
const pencilSound = new Howl({
  src: ["./sounds/9.mp3"],
});
const ramensoupSound = new Howl({
  src: ["./sounds/10.mp3"],
});
const showsSound = new Howl({
  src: ["./sounds/11.mp3"],
});
const tomatoSound = new Howl({
  src: ["./sounds/12.mp3"],
});
const tyunSound = new Howl({
  src: ["./sounds/13.mp3"],
});
const usagiSound = new Howl({
  src: ["./sounds/14.mp3"],
});
const yakyuSound = new Howl({
  src: ["./sounds/15.mp3"],
});

// canvas/setup

const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");

let width = 800;
let height = 500;

canvas.width = width;
canvas.height = height;

let score = 0;
let gameFrame = 0;
ctx.font = "50px Arial";

let resizeCanvas = () => {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width - 100;
  canvas.height = height - 104;
  ctx.font = "40px myFont";
};

resizeCanvas();

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

// Player character

const playerImg = new Image();
playerImg.src = "./images/player.png";

class Player {
  constructor() {
    this.x = canvas.width / 2; //start coordinates
    this.y = canvas.height / 2;
    this.radius = 86;
    this.angle = 0;
    this.frameX = 0;
    this.frameY = 0;
    this.frame = 0;
    this.spriteWidth = 182;
    this.spriteHeight = 179;
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
    ctx.fillStyle = "transparent";
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
      this.x - 100, // adjust here to align item with collision area
      this.y - 100, // and here (i.e. - 60)
      this.spriteWidth, // scale here if needed (i.e. this.spriteWidth/4)
      this.spriteHeight
    );
  }
}

// object handling

const objectArray = [];

function handleObjects() {
  if (gameFrame % 50 == 0) {
    //every 50 frames..
    objectArray.push(new Milk());
  }

  if (gameFrame % 50 == 0) {
    //every 50 frames..
    objectArray.push(new Bear());
  }

  if (gameFrame % 50 == 0) {
    //every 50 frames..
    objectArray.push(new Folder());
  }

  if (gameFrame % 50 == 0) {
    //every 50 frames..
    objectArray.push(new Hero());
  }

  if (gameFrame % 50 == 0) {
    //every 50 frames..
    objectArray.push(new Bijo());
  }

  if (gameFrame % 50 == 0) {
    //every 50 frames..
    objectArray.push(new Humberg());
  }

  for (let i = 0; i < objectArray.length; i++) {
    // call update and draw methods for each bubbles in the array
    objectArray[i].update();
    objectArray[i].draw();
  }

  // when y position > 0 then delete bubbles. 0 - this.radius * 2 ensures full bubbles has passed

  for (let i = 0; i < objectArray.length; i++) {
    if (objectArray[i].y < 0 - objectArray[i].radius * 2) {
      objectArray.splice(i, 1);
    }

    if (objectArray[i]) {
      if (objectArray[i].distance < objectArray[i].radius + player.radius) {
        console.log("collision!");
        // this line allows us to set the score only once per bubble, even though multiple collisions will continue to be registered
        if (!objectArray[i].counted) {
          if (objectArray[i].sound == "milk") {
            milkSound.play();
          } else if (objectArray[i].sound == "folder") {
            folderSound.play();
          } else if (objectArray[i].sound == "bear") {
            bearSound.play();
          } else if (objectArray[i].sound == "bijo") {
            bijoSound.play();
          } else if (objectArray[i].sound == "hero") {
            heroSound.play();
          } else if (objectArray[i].sound == "humberg") {
            humbergSound.play();
          }
          score++;
          objectArray[i].counted = true;
          objectArray.splice(i, 1); //by calling splice, we remove i element from the array upon collision (1 just means only this one)
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
  handleObjects();

  ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
  ctx.fillText("IDEAS - " + score, 20, 50);
  ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
  ctx.fillText("TIME ELAPSED - " + gameFrame, 20, 120);
  gameFrame++; // increase game frame as game continues
  requestAnimationFrame(animate);
}

// classes (objects in game)
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

const folderImg = new Image();
folderImg.src = "./images/folder.png";

class Folder {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 100;
    this.radius = 50;
    this.speed = Math.random() * 5 + 1;
    this.distance;
    this.counted = false;
    this.sound = "folder"; //Math.random() <= 0.5 ? "sound1" : "sound2";
    // ternary operator, if value produced by Math.random is less than 0.5, assign 'sound1' else assign 'sound2'
    this.frameX = 0;
    this.frameY = 0;
    this.frame = 0;
    this.spriteWidth = 182;
    this.spriteHeight = 179;
  }

  update() {
    this.y -= this.speed; //moves bubbles up the y axis depending on their speed value
    const dx = this.x - player.x;
    const dy = this.y - player.y;
    // updating distance for each bubble as a function of its current distance from bubble allows us to create a collision detection. NB - this must be called on the animate loop in order to work!
    this.distance = Math.sqrt(dx * dx + dy * dy);
  }

  draw() {
    ctx.fillStyle = "transparent";
    ctx.beginPath();
    // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();

    ctx.drawImage(
      folderImg,
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

const bearImg = new Image();
bearImg.src = "./images/bear.png";

class Bear {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 100;
    this.radius = 50;
    this.speed = Math.random() * 5 + 1;
    this.distance;
    this.counted = false;
    this.sound = "bear"; //Math.random() <= 0.5 ? "sound1" : "sound2";
    // ternary operator, if value produced by Math.random is less than 0.5, assign 'sound1' else assign 'sound2'
    this.frameX = 0;
    this.frameY = 0;
    this.frame = 0;
    this.spriteWidth = 50;
    this.spriteHeight = 50;
  }

  update() {
    this.y -= this.speed; //moves bubbles up the y axis depending on their speed value
    const dx = this.x - player.x;
    const dy = this.y - player.y;
    // updating distance for each bubble as a function of its current distance from bubble allows us to create a collision detection. NB - this must be called on the animate loop in order to work!
    this.distance = Math.sqrt(dx * dx + dy * dy);
  }

  draw() {
    ctx.fillStyle = "transparent";
    ctx.beginPath();
    // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();

    ctx.drawImage(
      bearImg,
      this.frameX * this.spriteWidth, //
      this.frameY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.x - 40, // adjust here to align item with collision area
      this.y - 50, // and here (i.e. - 60)
      this.spriteWidth * 1.5, // scale here if needed (i.e. this.spriteWidth/4)
      this.spriteHeight * 1.5
    );
  }
}

const milkImg = new Image();
milkImg.src = "./images/milk.png";

class Milk {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 100;
    this.radius = 50;
    this.speed = Math.random() * 5 + 1;
    this.distance;
    this.counted = false;
    this.sound = "milk"; //Math.random() <= 0.5 ? "sound1" : "sound2";
    // ternary operator, if value produced by Math.random is less than 0.5, assign 'sound1' else assign 'sound2'
    this.frameX = 0;
    this.frameY = 0;
    this.frame = 0;
    this.spriteWidth = 19;
    this.spriteHeight = 35;
  }

  update() {
    this.y -= this.speed; //moves bubbles up the y axis depending on their speed value
    const dx = this.x - player.x;
    const dy = this.y - player.y;
    // updating distance for each bubble as a function of its current distance from bubble allows us to create a collision detection. NB - this must be called on the animate loop in order to work!
    this.distance = Math.sqrt(dx * dx + dy * dy);
  }

  draw() {
    ctx.fillStyle = "transparent";
    ctx.beginPath();
    // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();

    ctx.drawImage(
      milkImg,
      this.frameX * this.spriteWidth, //
      this.frameY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.x - 40, // adjust here to align item with collision area
      this.y - 50, // and here (i.e. - 60)
      this.spriteWidth * 2, // scale here if needed (i.e. this.spriteWidth/4)
      this.spriteHeight * 2
    );
  }
}

const bijoImg = new Image();
bijoImg.src = "./images/bijo.png";

class Bijo {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 100;
    this.radius = 40;
    this.speed = Math.random() * 5 + 1;
    this.distance;
    this.counted = false;
    this.sound = "bijo"; //Math.random() <= 0.5 ? "sound1" : "sound2";
    // ternary operator, if value produced by Math.random is less than 0.5, assign 'sound1' else assign 'sound2'
    this.frameX = 0;
    this.frameY = 0;
    this.frame = 0;
    this.spriteWidth = 30;
    this.spriteHeight = 60;
  }

  update() {
    this.y -= this.speed; //moves bubbles up the y axis depending on their speed value
    const dx = this.x - player.x;
    const dy = this.y - player.y;
    // updating distance for each bubble as a function of its current distance from bubble allows us to create a collision detection. NB - this must be called on the animate loop in order to work!
    this.distance = Math.sqrt(dx * dx + dy * dy);
  }

  draw() {
    ctx.fillStyle = "transparent";
    ctx.beginPath();
    //ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();

    ctx.drawImage(
      bijoImg,
      this.frameX * this.spriteWidth, //
      this.frameY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.x - 30, // adjust here to align item with collision area
      this.y - 40, // and here (i.e. - 60)
      this.spriteWidth * 1.5, // scale here if needed (i.e. this.spriteWidth/4)
      this.spriteHeight * 1.5
    );
  }
}

const heroImg = new Image();
heroImg.src = "./images/hero.png";

class Hero {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 100;
    this.radius = 40;
    this.speed = Math.random() * 5 + 1;
    this.distance;
    this.counted = false;
    this.sound = "hero"; //Math.random() <= 0.5 ? "sound1" : "sound2";
    // ternary operator, if value produced by Math.random is less than 0.5, assign 'sound1' else assign 'sound2'
    this.frameX = 0;
    this.frameY = 0;
    this.frame = 0;
    this.spriteWidth = 32;
    this.spriteHeight = 70;
  }

  update() {
    this.y -= this.speed; //moves bubbles up the y axis depending on their speed value
    const dx = this.x - player.x;
    const dy = this.y - player.y;
    // updating distance for each bubble as a function of its current distance from bubble allows us to create a collision detection. NB - this must be called on the animate loop in order to work!
    this.distance = Math.sqrt(dx * dx + dy * dy);
  }

  draw() {
    ctx.fillStyle = "transparent";
    ctx.beginPath();
    //ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();

    ctx.drawImage(
      heroImg,
      this.frameX * this.spriteWidth, //
      this.frameY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.x - 20, // adjust here to align item with collision area
      this.y - 35, // and here (i.e. - 60)
      this.spriteWidth * 1, // scale here if needed (i.e. this.spriteWidth/4)
      this.spriteHeight * 1
    );
  }
}

const humbergImg = new Image();
humbergImg.src = "./images/humberg.png";

class Humberg {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 100;
    this.radius = 40;
    this.speed = Math.random() * 5 + 1;
    this.distance;
    this.counted = false;
    this.sound = "humberg"; //Math.random() <= 0.5 ? "sound1" : "sound2";
    // ternary operator, if value produced by Math.random is less than 0.5, assign 'sound1' else assign 'sound2'
    this.frameX = 0;
    this.frameY = 0;
    this.frame = 0;
    this.spriteWidth = 60;
    this.spriteHeight = 32;
  }

  update() {
    this.y -= this.speed; //moves bubbles up the y axis depending on their speed value
    const dx = this.x - player.x;
    const dy = this.y - player.y;
    // updating distance for each bubble as a function of its current distance from bubble allows us to create a collision detection. NB - this must be called on the animate loop in order to work!
    this.distance = Math.sqrt(dx * dx + dy * dy);
  }

  draw() {
    ctx.fillStyle = "transparent";
    ctx.beginPath();
    //ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();

    ctx.drawImage(
      humbergImg,
      this.frameX * this.spriteWidth, //
      this.frameY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.x - 35, // adjust here to align item with collision area
      this.y - 20, // and here (i.e. - 60)
      this.spriteWidth * 1.2, // scale here if needed (i.e. this.spriteWidth/4)
      this.spriteHeight * 1.2
    );
  }
}

// resizing, call to action

window.addEventListener("resize", () => {
  resizeCanvas();
});

resizeCanvas();

const player = new Player();

animate();
