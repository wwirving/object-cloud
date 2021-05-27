// sound setup

// prevent scrolling

document.body.ontouchmove = (e) => {
  e.preventDefault();
};

const theme = new Howl({
  src: "./ambience/objectcld.start.mp3",
  volume: 0.5,
  loop: true,
});

const ambience = new Howl({
  src: "./ambience/ambience1.mp3",
  volume: 0.6,
  loop: true,
});

const end = new Howl({ src: "./ambience/end.mp3", volume: 0.9 });

ambience.play();

const tuna = new Tuna(Howler.ctx);

const delay = new tuna.PingPongDelay({
  wetLevel: 0.5, //0 to 1
  feedback: 0.3, //0 to 1
  delayTimeLeft: 200, //1 to 10000 (milliseconds)
  delayTimeRight: 400, //1 to 10000 (milliseconds)
});

const convolver = new tuna.Convolver({
  highCut: 22050, //20 to 22050
  lowCut: 20, //20 to 22050
  dryLevel: 0.5, //0 to 1+
  wetLevel: 1, //0 to 1+
  level: 1, //0 to 1+, adjusts total output of both wet and dry
  impulse: "./ambience/impulse.wav", //the path to your impulse response
  bypass: 0,
});

Howler.addEffect(delay);
Howler.addEffect(convolver);

// GLOBAL FUNCTIONS AND VARIABLES

import { shuffleArr, getRandom, loadSounds, makeImg } from "./functions.js";

let score = 0;
let gameFrame = 0;
let gameEnded = false;
let gameStarted = false;

let densityModulo = 20;
let feedbackModulo = 1;

const intro = document.querySelector(".intro");
const modal = document.querySelector(".modal-bg");
const screen = document.querySelector(".viewer");
const finalScore = document.querySelector("#final-score");
const replay = document.querySelector("#replay");

// CANVAS SETUP

const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");

const resizeCanvas = () => {
  let width = window.innerWidth;
  let height = window.innerHeight;
  canvas.width = width - 10;
  canvas.height = height - 14;
  ctx.font = "20px canvasFont";
};

resizeCanvas();

// MOUSE INTERACTIVITY

// .getBoundingClientRect measures current size and position of canvas element relative to parent (body)

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

// PLAYER/AVATAR CLASS

const playerImg = makeImg("player");

class Player {
  constructor() {
    this.x = canvas.width / 2; //start coordinates
    this.y = canvas.height / 2;
    this.radius = 48;
    this.angle = 0;
    this.frameX = 0;
    this.frameY = 0;
    this.frame = 0;
    this.spriteWidth = 0;
    this.spriteHeight = 0;
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
      //ctx.stroke();
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
      this.x - 60, // adjust here to align item with collision area
      this.y - 60, // and here (i.e. - 60)
      this.spriteWidth * 0.6, // scale here if needed (i.e. this.spriteWidth/4)
      this.spriteHeight * 0.6
    );
  }
}

// OBJECT CLOUD CLASS

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
    //ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
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

const soundArray = loadSounds(15);

const objectArray = [];

let shuffledArray = shuffleArr(objectLoader);

const handleObjects = () => {
  if (gameFrame % densityModulo == 0 && gameStarted === true) {
    //every 50 frames..

    if (shuffledArray.length < 1) {
      shuffledArray = shuffledArray = shuffleArr(objectLoader);
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
    // call update and draw methods for each object in the array
    objectArray[i].update();
    objectArray[i].draw();
  }

  // when y position > 0 then delete object. 0 - this.radius * 2 ensures full bubbles has passed

  for (let i = 0; i < objectArray.length; i++) {
    if (objectArray[i].y < 0 - objectArray[i].radius * 2) {
      objectArray.splice(i, 1);
    }

    if (objectArray[i]) {
      if (
        objectArray[i].distance < objectArray[i].radius + player.radius &&
        gameStarted == true
      ) {
        // this line allows us to set the score only once per bubble, even though multiple collisions will continue to be registered
        if (!objectArray[i].counted) {
          if (objectArray[i].sound == "yakyu") {
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
          } else if (objectArray[i].sound == "kamakiri") {
            soundArray[6].play();
          } else if (objectArray[i].sound == "master") {
            soundArray[7].play();
          } else if (objectArray[i].sound == "milk") {
            soundArray[8].play();
          } else if (objectArray[i].sound == "pencil") {
            soundArray[9].play();
          } else if (objectArray[i].sound == "ramensoup") {
            soundArray[10].play();
          } else if (objectArray[i].sound == "shows") {
            soundArray[11].play();
          } else if (objectArray[i].sound == "tomato") {
            soundArray[12].play();
          } else if (objectArray[i].sound == "tyun") {
            soundArray[13].play();
          } else if (objectArray[i].sound == "usagi") {
            soundArray[14].play();
          }

          if (gameStarted === true) {
            score--;

            if (densityModulo > 1) {
              densityModulo--;
            }
            feedbackModulo++;

            if (densityModulo % 0 == 0) {
              delay.delayTimeLeft += 10;
            } else {
              delay.delayTimeRight += 10;
            }

            objectArray[i].counted = true;
            objectArray.splice(i, 1); //by calling splice, we remove i element from the array upon collision (1 just means only this one)
          }
        }
      }
    }
  }
};

//  GAME HANDLING

const startGame = () => {
  gameStarted = false;
  theme.play();
  convolver.automate("dryLevel", 0.5, 7500, 0);
  score = 100;
  gameFrame = 0;
  console.log(canvas.width);
  // densityModulo = (canvas.width / 100) * 1.78890876565;
  // if (densityModulo > 20) {
  //   densityModulo = 20;
  // }

  if (canvas.width <= 350) {
    densityModulo = 75;
  } else if (canvas.width >= 351 && canvas.width <= 680) {
    densityModulo = 50;
  } else {
    densityModulo = 25;
  }
  console.log(densityModulo);
  feedbackModulo = 1;
  screen.style.filter = "none";
  setTimeout(() => {
    intro.classList.add("intro-active");
    setTimeout(() => {
      gameStarted = true;
      gameEnded = false;
      delay.delayTimeLeft = 200;
      delay.delayTimeRight = 400;
      delay.wetLevel = 0.5;
      convolver.automate("wetLevel", 1, 15000, 0);
      delay.automate("feedback", 0.3, 1500, 0);
      convolver.dryLevel = 0.5;
      player.spriteWidth = 182;
      player.spriteHeight = 179;
    }, 3000);
  }, 8000);
};

startGame();

replay.addEventListener("click", () => {
  delay.automate("feedback", 0, 1500, 0);
  delay.automate("wetLevel", 0, 1500, 0);
  convolver.automate("wetLevel", 0, 1500, 0);
  delay.automate("delayTimeLeft", 200, 1500, 0);
  delay.automate("delayTimeRight", 400, 1500, 0);
  modal.classList.remove("bg-active");
  gameStarted = false;
  setTimeout(() => {
    startGame();
  }, 3000);
});

const endGame = () => {
  theme.stop();
  end.play();
  convolver.dryLevel = 0;
  //delay.feedback = 0.8;
  player.spriteHeight = 0;
  player.spriteWidth = 0;
  gameEnded = true;
  modal.classList.add("bg-active");
  screen.style.filter = "blur(6px)";
  finalScore.innerText = `${gameFrame}`;
};

// ANIMATION LOOP

const animate = () => {
  if (gameFrame % feedbackModulo === 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas as part of render loop
  }
  player.update();
  player.draw();
  handleObjects();
  ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
  ctx.fillText("♡ " + score, canvas.width * 0.02, canvas.height * 0.05);
  ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
  ctx.fillText("→ " + gameFrame, canvas.width * 0.02, canvas.height * 0.1);
  if (gameStarted === true && gameEnded === false) {
    gameFrame++; // increase game frame as game continues
  }
  requestAnimationFrame(animate);
  if (score < 0 && gameEnded === false) {
    endGame();
  }
};

// resizing, call to action

window.addEventListener("resize", () => {
  resizeCanvas();
});

resizeCanvas();

const player = new Player();

animate();
