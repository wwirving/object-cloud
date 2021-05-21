// canvas setup

// FUNCTIONS

const getRandom = (upperLimit) => {
  function shuffle(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  const arrayNum = [...Array(upperLimit)].map((_, i) => i);

  const ranNums = shuffle(arrayNum);

  return ranNums;
};

const loadSounds = (length) => {
  const soundArray = new Array(length);

  for (let i = 0; i < soundArray.length; i++) {
    const relPath = "./sounds/";
    const fileType = ".mp3";
    const srcLink = `${relPath}${i}${fileType}`;
    soundArray[i] = new Howl({
      src: [`${srcLink}`],
    });
  }

  return soundArray;
};

const makeImg = (name) => {
  const img = new Image();
  const path = "./images/";
  const fileType = ".png";
  const imgStr = `${path}${name}${fileType}`;
  img.src = imgStr;
  return img;
};

const shuffle = (array) => {
  const newArray = [...array];
  var currentIndex = newArray.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = newArray[currentIndex];
    newArray[currentIndex] = newArray[randomIndex];
    newArray[randomIndex] = temporaryValue;
  }

  return newArray;
};

// SETUP

const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");

let width = 800;
let height = 500;

canvas.width = width;
canvas.height = height;

let resizeCanvas = () => {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width - 100;
  canvas.height = height - 104;
  ctx.font = "20px myFont";
};

resizeCanvas();

const soundArray = loadSounds(15);

let score = 0;
let gameFrame = 0;

let densityModulo = 150;
let feedbackModulo = 1;

// MOUSE INTERACTIVITY

// get canvas position so we can use it to scale coordinates
// .getBoundingClientRect measures current size and position of canvas element relative to parent

let canvasPosition = canvas.getBoundingClientRect();

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
});

canvas.addEventListener("mouseup", () => {
  mouse.click = false;
});

// PLAYER/AVATAR

const playerImg = makeImg("player");

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

// OBJECT HANDLING

const objectLoader = [
  "bear",
  "bijo",
  "folder",
  "hero",
  "humberg",
  "kamakiri",
  "master",
  "milk",
  "pencil",
  "ramensoup",
  "shows",
  "tomato",
  "tyun",
  "usagi",
  "yakyu",
];

const objectArray = [];

let shuffledArray = shuffle(objectLoader);
console.log(shuffledArray.length);

function handleObjects() {
  if (gameFrame % densityModulo == 0) {
    //every 50 frames..

    if (shuffledArray.length < 1) {
      shuffledArray = shuffledArray = shuffle(objectLoader);
    } else {
      shuffledArray.pop();
    }

    let input = shuffledArray[shuffledArray.length - 1];

    switch (input) {
      case "bear":
        const bearImg = makeImg("bear");
        objectArray.push(
          new ObjectCloud(40, 5, "bear", 50, 50, bearImg, 30, 30, 1.2, 1.2, 1)
        );
        break;
      case "folder":
        const folderImg = makeImg("folder");
        objectArray.push(
          new ObjectCloud(
            40,
            1,
            "folder",
            182,
            179,
            folderImg,
            35,
            38,
            0.8,
            0.8,
            1
          )
        );
        break;
      case "hero":
        const heroImg = makeImg("hero");
        objectArray.push(
          new ObjectCloud(40, 1, "hero", 32, 70, heroImg, 20, 35, 1, 1, 1)
        );
        break;
      case "humberg":
        const humbergImg = makeImg("humberg");
        objectArray.push(
          new ObjectCloud(
            40,
            1,
            "humberg",
            60,
            32,
            humbergImg,
            32,
            20,
            1.2,
            1.2,
            1
          )
        );
        break;
      case "kamakiri":
        const kamakiriImg = makeImg("kamakiri");
        objectArray.push(
          new ObjectCloud(
            40,
            1,
            "kamakiri",
            43,
            40,
            kamakiriImg,
            32,
            35,
            1.7,
            1.7,
            1
          )
        );
        break;
      case "master":
        const masterImg = makeImg("master");
        objectArray.push(
          new ObjectCloud(
            40,
            5,
            "master",
            36,
            56,
            masterImg,
            25,
            40,
            1.4,
            1.4,
            1
          )
        );
        break;
      case "milk":
        const milkImg = makeImg("milk");
        objectArray.push(
          new ObjectCloud(40, 5, "milk", 19, 35, milkImg, 20, 35, 2, 2, 1)
        );
        break;
      case "pencil":
        const pencilImg = makeImg("pencil");
        objectArray.push(
          new ObjectCloud(
            40,
            5,
            "pencil",
            27,
            10,
            pencilImg,
            32,
            15,
            2.5,
            2.5,
            1
          )
        );
        break;
      case "ramensoup":
        const ramensoupImg = makeImg("ramensoup");
        objectArray.push(
          new ObjectCloud(
            40,
            5,
            "ramensoup",
            32,
            32,
            ramensoupImg,
            35,
            35,
            2.2,
            2.2,
            1
          )
        );
        break;
      case "shows":
        const showsImg = makeImg("shows");
        objectArray.push(
          new ObjectCloud(40, 5, "shows", 45, 46, showsImg, 35, 32, 1.5, 1.5, 1)
        );
        break;
      case "tomato":
        const tomatoImg = makeImg("tomato");
        objectArray.push(
          new ObjectCloud(
            40,
            5,
            "tomato",
            18,
            16,
            tomatoImg,
            30,
            30,
            3.5,
            3.5,
            1
          )
        );
        break;
      case "tyun":
        const tyunImg = makeImg("tyun");
        objectArray.push(
          new ObjectCloud(40, 5, "tyun", 32, 31, tyunImg, 32, 32, 2, 2, 1)
        );
        break;
      case "usagi":
        const usagiImg = makeImg("usagi");
        objectArray.push(
          new ObjectCloud(40, 5, "usagi", 36, 38, usagiImg, 35, 38, 2, 2, 1)
        );
        break;
      case "yakyu":
        const yakyuImg = makeImg("yakyu");
        objectArray.push(
          new ObjectCloud(40, 5, "yakyu", 60, 60, yakyuImg, 30, 30, 1, 1, 1)
        );
        break;
      case "bijo":
        const bijoImg = makeImg("bijo");
        objectArray.push(
          new ObjectCloud(40, 5, "bijo", 30, 60, bijoImg, 30, 40, 1.5, 1.5, 1)
        );
        break;
      default:
      // code
    }
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
        // this line allows us to set the score only once per bubble, even though multiple collisions will continue to be registered
        if (!objectArray[i].counted) {
          if (objectArray[i].sound == "milk") {
            soundArray[0].play();
          } else if (objectArray[i].sound == "folder") {
            soundArray[1].play();
          } else if (objectArray[i].sound == "bear") {
            soundArray[2].play();
          } else if (objectArray[i].sound == "bijo") {
            soundArray[3].play();
          } else if (objectArray[i].sound == "hero") {
            soundArray[4].play();
          } else if (objectArray[i].sound == "humberg") {
            soundArray[5].play();
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
  if (gameFrame % feedbackModulo === 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas as part of render loop
  }
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

const folderImg = makeImg("folder");

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

const makeImage = (imagename) => {};

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

/*

defaults

radius = 40
speed = 5;
sound = 'imagename'
spriteWidth = 32
spriteHeight = 33
imgVar = heroIMG (variable)
xadjust = 30
yadjust = 30
xScale = 1.5
yScale = 1.5
scaleMultipler = 1

*/

class ObjectCloud {
  constructor(
    radius,
    speedMultiplier,
    sound,
    spriteWidth,
    spriteHeight,
    imgVar,
    xAdjust,
    yAdjust,
    xScale,
    yScale,
    scaleMultiplier
  ) {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 100;
    this.radius = radius * scaleMultiplier;
    this.speed = Math.random() * speedMultiplier + 1;
    this.distance;
    this.counted = false;
    this.sound = sound; //Math.random() <= 0.5 ? "sound1" : "sound2";
    // ternary operator, if value produced by Math.random is less than 0.5, assign 'sound1' else assign 'sound2'
    this.frameX = 0;
    this.frameY = 0;
    this.frame = 0;
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
    this.imgVar = imgVar;
    this.xAdjust = xAdjust;
    this.yAdjust = yAdjust;
    this.xScale = xScale;
    this.yScale = yScale;
    this.scaleMultiplier = scaleMultiplier;
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
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();

    ctx.drawImage(
      this.imgVar,
      this.frameX * this.spriteWidth, //
      this.frameY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.x - this.xAdjust, // adjust here to align item with collision area
      this.y - this.yAdjust, // and here (i.e. - 60)
      this.spriteWidth * this.xScale * this.scaleMultiplier, // scale here if needed (i.e. this.spriteWidth/4)
      this.spriteHeight * this.yScale * this.scaleMultiplier
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
