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
      imgVar,
      this.frameX * this.spriteWidth, //
      this.frameY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.x - xAdjust, // adjust here to align item with collision area
      this.y - yAdjust, // and here (i.e. - 60)
      this.spriteWidth * 1.2 * scaleMultiplier, // scale here if needed (i.e. this.spriteWidth/4)
      this.spriteHeight * 1.2 * scaleMultiplier
    );
  }
}

const objectArray = [];

let input = "bear";

switch (input) {
  case "bear":
    const bearImg = makeImg("folder");
    objectArray.push(
      new ObjectCloud(50, 5, "bear", 50, 50, bearImg, 40, 50, 1.5, 1.5, 1)
    );
    break;
  case "folder":
    //code
    break;
  case "hero":
    //code
    break;
  case "humberg":
    //code
    break;
  case "kamakiri":
    //code
    break;
  case "master":
    //code
    break;
  case "milk":
    //code
    break;
  case "pencil":
    //code
    break;
  case "player":
    //code
    break;
  case "ramensoup":
    //code
    break;
  case "shows":
    //code
    break;
  case "tomato":
    //code
    break;
  case "tyun":
    //code
    break;
  case "usagi":
    //code
    break;
  case "yakyu":
    //code
    break;
  case "bijo":
    //code
    break;
  default:
  // code
}

console.log(objectArray);
