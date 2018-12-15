// serial variables
let serial; // variable to hold an instance of the serialport library
let portName = '/dev/cu.usbmodem1421'; // fill in your serial port name here
let inData;
let currentReader;
let currentLetter;
let clearButton;
let submitButton;

// sound learn variables
let soundLib = [];

// english write variables
let alphArray = [];
let wordArray = [];
let currentWord = '';

// symbol write variables
let visualLib = [];
let imgArray = [];
let imgX;
let imgY;
let imgSize = 200;

// submit variables
let submitArray = [];
let submitX = 25;
let submitY = 25;
let submitSize = imgSize / 2;
let spaceImg;

// include space
let spaceToggle;

function preload() {
  // load symbol images and sound files
  let j = 65;
  for (let i = 0; i < 26; i++) {
    visualLib[i] = loadImage("letter" + char(j) + ".png");
    soundLib[i] = loadSound("sound" + char(j) + ".wav")
    j = j + 1;
  }

  spaceImg = loadImage("space.png")
}

function setup() {
  // Serial Setup
  serial = new p5.SerialPort(); // make a new instance of the serialport library
  serial.on('list', printList); // set a callback function for the serialport list event
  serial.on('connected', serverConnected); // callback for connecting to the server
  serial.on('open', portOpen); // callback for the port opening
  serial.on('data', serialEvent); // callback for when new data arrives
  serial.on('error', serialError); // callback for errors
  serial.on('close', portClose); // callback for the port closing
  serial.list(); // list the serial ports
  serial.open(portName); // open a serial port

  // Canvas Setup
  createCanvas(windowWidth, windowHeight);
  background(220);
  noStroke();
  textStyle(NORMAL);
  drawingContext.font = 'helvetica';

  // Make alphabet array
  for (let i = 65; i < 91; i++) {
    alphArray.push(char(i));
  }
}

function draw() {
  // learn
  if (currentReader == 0) {
    learnSection();
    currentReader = 2;
  }
  // write
  if (currentReader == 1) {
    background(220);
    spaceToggle = 0;  // include a space
    writeSection();
    currentReader = 2;
  }

  // clear/restart
  if (clearButton == 1) {
    background(220);
    //textSize(20);
    //text("To begin, scan a coin on the 'Learn' section of the board", width/2, 50)
    wordArray = [];
    imgArray = [];
  }

  // submit
  if (submitButton == 1) {
    background(220);
    submitX = 25;
    submitY = 25;
    if(spaceToggle == 0){
      imgArray.push(spaceImg);
      spaceToggle = 1;
    }
    for (let i = 0; i < imgArray.length; i++) {
      submitArray.push(imgArray[i]);
    }
    for (let i = 0; i < submitArray.length; i++) {
      image(submitArray[i], submitX, submitY, submitSize, submitSize);
      submitX = submitX + submitSize;
      if (submitX > width - 50) {
        submitY = submitY + submitSize;
        submitX = 25;
      }
    }
    wordArray = [];
    imgArray = [];
  }

}

function keyPressed() {
  // clear library
  if (keyCode === CONTROL) {
    submitArray = [];
  }
}


// My Functions
function learnSection() {
  for (let i = 0; i < 26; i++) {
    if (currentLetter == alphArray[i]) {
      soundLib[i].setVolume(0.3);
      soundLib[i].play();
    }
  }
}

function writeSection() {
  for (let i = 0; i < 26; i++) {
    if (currentLetter == alphArray[i]) {
      // text
      wordArray.push(alphArray[i]);
      currentWord = join(wordArray, " ");
      textAlign(CENTER);
      //textSize(80);
      textSize(150);
      text(currentWord, (width / 2) - (currentWord.length / 2), height / 2 + 300);
      //text(currentWord, (width / 2) - (currentWord.length / 2), windowHeight / 2 + 200)
      // img/symbols definted
      imgArray.push(visualLib[i]);
    }
  }
  // img/symbol display
  imgX = (width / 2) - ((imgArray.length * imgSize) / 2);
  //imgY = (height / 2) - (imgSize / 2);
  imgY = (windowHeight / 2) - (imgSize / 2);
  for (let i = 0; i < imgArray.length; i++) {
    image(imgArray[i], imgX, imgY, imgSize, imgSize);
    imgX = imgX + imgSize;
  }
}


// Serial Functions to respond to setup callbacks
function serialEvent() {
  inData = serial.readStringUntil("\r\n");
  //console.log(inData);
  if (inData) {
    currentReader = inData[0];
    currentLetter = inData[1];
    clearButton = inData[2];
    submitButton = inData[3];
  }
}

function printList(portList) {
  // portList is an array of serial port names
  for (let i = 0; i < portList.length; i++) {
    // Display the list the console:
    print(i + " " + portList[i]);
  }
}

function serverConnected() {
  print('connected to server.');
}

function portOpen() {
  print('the serial port opened.')
}

function serialError(err) {
  print('Something went wrong with the serial port. ' + err);
}

function portClose() {
  print('The serial port closed.');
}