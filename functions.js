export const shuffleArr = (array) => {
  const newArray = [...array];
  var currentIndex = newArray.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffleArr...
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

export const getRandom = (upperLimit) => {
  const arrayNum = [...Array(upperLimit)].map((_, i) => i);

  const ranNums = shuffleArr(arrayNum);

  return ranNums;
};

export const loadSounds = (length) => {
  const soundArray = new Array(length);

  for (let i = 0; i < soundArray.length; i++) {
    const relPath = "./sounds/";
    const fileType = ".mp3";
    const srcLink = `${relPath}${i}${fileType}`;
    soundArray[i] = new Howl({
      src: [`${srcLink}`],
      volume: 0.2,
    });
  }

  return soundArray;
};

export const makeImg = (name) => {
  const img = new Image();
  const path = "./images/";
  const fileType = ".png";
  const imgStr = `${path}${name}${fileType}`;
  img.src = imgStr;
  return img;
};
