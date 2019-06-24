/* eslint-disable max-statements */
/* eslint-disable complexity */
import * as ml5 from 'ml5';
import * as THREE from 'three';
import updatePoses from './threeJs/updatePoses';
import SingleHole from './Walls/singleHole';
//new compile?

let keyboard = {};

//Manage walls
// const singleHole = new SingleHole();
// let walls = [singleHole];

let player = { height: 1.8, speed: -3 };

let wallsPath = [];
let wallsPool = [];
let cameraSpeed = 1;

let video = document.createElement('video');
let vidDiv = document.getElementById('video');

video.setAttribute('width', 200);
video.setAttribute('height', 200);
video.autoplay = true;
// vidDiv.appendChild(video);

// get the users webcam stream to render in the video
navigator.mediaDevices
  .getUserMedia({ video: true, audio: false })
  .then(function(stream) {
    video.srcObject = stream;
    // video.hiddend();
  })
  .catch(function(err) {
    console.log('An error occurred! ' + err);
  });

let options = {
  flipHorizontal: false,
  minConfidence: 0.5,
};

let poseNet = ml5.poseNet(video, options, modelReady);

const keyboardMovement = keyPress => {
  if (keyPress === keyboard[65]) {
    camera.position.x -=
      Math.sin(camera.rotation.y - Math.PI / 2) * player.speed;
    camera.position.z -=
      Math.cos(camera.rotation.y - Math.PI / 2) * player.speed;
  }

  //D key move right
  if (keyPress === keyboard[68]) {
    camera.position.x +=
      Math.sin(camera.rotation.y - Math.PI / 2) * player.speed;
    camera.position.z +=
      Math.cos(camera.rotation.y - Math.PI / 2) * player.speed;
  }

  //W key move forwad
  if (keyPress === keyboard[87]) {
    camera.position.x += Math.sin(camera.rotation.y) * player.speed;
    camera.position.z += Math.cos(camera.rotation.y) * player.speed;
  }

  //S Key move backwards
  if (keyPress === keyboard[83]) {
    camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
    camera.position.z -= Math.cos(camera.rotation.y) * player.speed;
  }

  // Left Arrow rotate left
  if (keyPress === keyboard[37]) {
    camera.rotation.y += Math.PI * 0.01;
  }
  // Right Arrow rotate right
  if (keyPress === keyboard[39]) {
    camera.rotation.y -= Math.PI * 0.01;
  }
};

//three.js code
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);

// Create a basic perspective camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

function createWalls(num) {
  let distance = 0;
  for (let i = 0; i < num; i++) {
    let number = Math.floor(Math.random() * 20) + 1;
    number *= Math.floor(Math.random() * 2) === 1 ? 1 : -1;
    let newWall = new SingleHole(number);
    wallsPath.push(newWall);
    wallsPath[i].fetchWall().forEach(piece => {
      piece.position.z += distance;
      scene.add(piece);
    });
    distance += 100;
  }
}
createWalls(10);

function moreWalls(num) {
  let lastWallDistance = wallsPath[wallsPath.length - 1].col1.position.z + 100;
  for (let i = 0; i < num; i++) {
    let number = Math.floor(Math.random() * 20) + 1;
    number *= Math.floor(Math.random() * 2) === 1 ? 1 : -1;
    let newWall = new SingleHole(number);

    wallsPool.push(newWall);

    wallsPool[i].fetchWall().forEach(piece => {
      piece.position.z = lastWallDistance;
      scene.add(piece);
    });
    lastWallDistance += 100;
  }

  wallsPath = [...wallsPath, ...wallsPool];
  wallsPool.length = 0;
  console.log(wallsPath, 'WALLSPATH');

  cameraSpeed += 0.2;
}

// camera.position.y += 20
camera.position.set(0, 10, -35);
camera.rotation.y = Math.PI;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor('#2E2B40');
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let light = new THREE.PointLight(0xffff00);
light.position.set(-10, 0, 10);

function createHemisphereLight() {
  return new THREE.HemisphereLight(0x303f9f, 0x000000, 1);
}

// creates floor planes

let floor;
let startFloor = 500;

function createFloor() {
  let floorLength = 1000;
  floor = new THREE.Mesh(
    new THREE.PlaneGeometry(50, floorLength, 100, 100),
    // wireframe tests for plane geometry which side is the right side
    new THREE.MeshBasicMaterial({ color: 0x38761d, wireframe: true })
  );
  floor.position.z += startFloor;
  floor.rotation.x -= Math.PI / 2;

  scene.add(floor);
  startFloor += floorLength;
}
createFloor();

// Render Loop
const changeXYPosition = (obj, shape) => {
  obj.changeX = obj.x - obj.lastXPosition;
  obj.changeY = obj.y - obj.lastYPosition;

  shape.position.x += obj.changeX * 0.2;
  shape.position.y += -(obj.changeY * 0.2);
  obj.lastXPosition = obj.x;
  obj.lastYPosition = obj.y;
};

const changeJointPosition = (obj, shape, line, vertex) => {
  obj.changeX = obj.x - obj.lastXPosition;
  obj.changeY = obj.y - obj.lastYPosition;

  shape.position.x += obj.changeX * 0.2;
  shape.position.y += -(obj.changeY * 0.2);

  line.geometry.vertices[vertex].x = shape.position.x;
  line.geometry.vertices[vertex].y = shape.position.y;
  line.geometry.verticesNeedUpdate = true;

  obj.lastXPosition = obj.x;
  obj.lastYPosition = obj.y;
};

let wallCount = 1;
let level = 0;

const generatePath = () => {
  createFloor();
  moreWalls(10);
};

const nextLevel = () => {
  level++;
  wallCount = 0;
  wallsPath = wallsPath.slice(10);
};

const render = function() {
  requestAnimationFrame(render);

  //Check Collision

  if (camera.position.z <= 0) {
    console.log('checking initial collision');

    wallsPath[0].checkCollision(head);
  }
  if (camera.position.z + 10 >= wallCount * 100 + level * 1000) {
    console.log('checking collision');
    if (wallCount === 10) {
      wallsPath[0].checkCollision(head);
    } else {
      wallsPath[wallCount].checkCollision(head);
    }
  }

  // camera.position.z += cameraSpeed;
  // head.position.z += cameraSpeed;

  //For testing: locks head to middle
  // head.position.z = camera.position.z;

  // console.log(
  //   camera.position.z,
  //   'Z',
  //   camera.position.x,
  //   'X',
  //   wallCount,
  //   'WALLCOUNT'
  // );

  //Makes more walls when close to the end of current path
  if (camera.position.z > startFloor - 800) {
    generatePath();
  }

  //Keeps count of current wall position
  if (camera.position.z / 100 - level * 10 > wallCount) {
    wallCount++;
    console.log(wallCount, 'INCREASED WALL COUNT');
  }

  //Updates current level and normalizes wall position
  if (camera.position.z > 1000 * (level + 1)) {
    console.log('NEXT LEVEL!!!');
    nextLevel();
  }

  renderer.render(scene, camera);
};

let bodyParts = {
  nose: { lastXPosition: 100, lastYPosition: 100, changeX: 1, changeY: 1 },

  //Left Arm
  leftShoulder: {
    lastXPosition: 100,
    lastYPosition: 100,
    changeX: 1,
    changeY: 1,
  },
  leftElbow: { lastXPosition: 100, lastYPosition: 100, changeX: 1, changeY: 1 },
  leftWrist: { lastXPosition: 100, lastYPosition: 100, changeX: 1, changeY: 1 },
  // rightShoulder: {},
  // leftHip: {},
  // rightHip: {},
  body: { lastXPosition: 100, lastYPosition: 100, changeX: 1, changeY: 1 },
};

let geometry = new THREE.SphereGeometry(4);
let material = new THREE.MeshPhongMaterial({ color: '0x2194ce' });
let head = new THREE.Mesh(geometry, material);
head.position.y += 10;
// head.position.z += 65;

let bodyGeometry = new THREE.BoxGeometry(4, 8);
let body = new THREE.Mesh(bodyGeometry, material);
body.position.y += 10;
// body.position.z += 65;

const leftArmGeometry = new THREE.SphereGeometry(0.5);
const leftShoulder = new THREE.Mesh(leftArmGeometry, material);
// leftShoulder.position.z += 65;
leftShoulder.position.y += 13;
leftShoulder.position.x += 8;

const leftElbow = new THREE.Mesh(leftArmGeometry, material);
// leftShoulder.position.z += 65;
leftElbow.position.y += 13;
leftElbow.position.x += 10;

const leftWrist = new THREE.Mesh(leftArmGeometry, material);
// leftShoulder.position.z += 65;
leftWrist.position.y += 13;
leftWrist.position.x += 12;

var leftArm = new THREE.Geometry();
leftArm.vertices.push(
  new THREE.Vector3(leftShoulder.position.x, leftShoulder.position.y, 0)
);
leftArm.vertices.push(
  new THREE.Vector3(leftElbow.position.x, leftElbow.position.y, 0)
);
leftArm.vertices.push(
  new THREE.Vector3(leftWrist.position.x, leftWrist.position.y, 0)
);

const limbMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
const leftArmBone = new THREE.Line(leftArm, limbMaterial);

scene.add(leftArmBone);

function modelReady() {
  console.log('model Loaded');
}

scene.add(
  light,
  head,
  body,
  leftShoulder,
  leftElbow,
  leftWrist,
  createHemisphereLight()
);

poseNet.on('pose', function(results) {
  let poses = results;
  // console.log(bodyParts.body);
  updatePoses(poses, bodyParts);

  // Update left arm
  // if (
  //   bodyParts.leftShoulder.x &&
  //   bodyParts.leftShoulder.y &&
  //   bodyParts.leftElbow.x &&
  //   bodyParts.leftElbow.y &&
  //   bodyParts.leftWrist.x &&
  //   bodyParts.leftWrist.y
  // ) {
  //   changeJointPosition(bodyParts.leftShoulder, leftShoulder, leftArmBone, 0);
  //   changeJointPosition(bodyParts.leftElbow, leftElbow, leftArmBone, 1);
  //   changeJointPosition(bodyParts.leftWrist, leftWrist, leftArmBone, 2);
  // }

  if (bodyParts.nose.x && bodyParts.nose.y) {
    changeXYPosition(bodyParts.nose, head);
  }

  // if (bodyParts.body.x && bodyParts.body.y) {
  //   changeXYPosition(bodyParts.body, body);
  // }
});

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();
});

//Solid wall for test
// let wallGeometry = new THREE.BoxGeometry(50, 50);
// let wallMaterial = new THREE.MeshStandardMaterial({
//   color: 0x883322,
//   wireframe: true,
//   side: THREE.DoubleSide,
// });
// let wall = new THREE.Mesh(wallGeometry, wallMaterial);

//Box for test
// let boxGeometry = new THREE.BoxGeometry(8, 8);
// let boxMaterial = new THREE.MeshStandardMaterial({
//   color: 0xffffff,
//   wireframe: false,
// });
// let box = new THREE.Mesh(boxGeometry);
// box.material.color.setHex(0x00ff00)

function keyDown(event) {
  keyboard[event.keyCode] = true;
  keyboardMovement(keyboard[event.keyCode]);
}

function keyUp(event) {
  keyboard[event.keyCode] = false;
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

// document
//   .getElementById('play_button')
//   .addEventListener('click', function(event) {
//     event.preventDefault();
//     playGame();
//   });

// function playGame() {
//   // event.preventDefault()
//   document.getElementById('menu').style.display = 'none';
//   render();
// }

render();
