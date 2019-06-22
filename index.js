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

let player = { height: 1.8, speed: -0.5 };

let walls = []
let newWalls = []
let cameraSpeed = 1

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
  flipHorizontal: true,
  minConfidence: .5,
};

let poseNet = ml5.poseNet(video, options, modelReady);

//three.js code
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);

// singleHole.fetchWall().forEach(piece => scene.add(piece));

// Create a basic perspective camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);


function createWalls  (num) {
  let distance = 50
  console.log(distance, 'BEFORE FOR LOOP')
  for (let i = 0; i < num; i++) {
    let number = Math.floor(Math.random() * 20) + 1
    number *= Math.floor(Math.random() * 2) === 1 ? 1 : -1
    let newWall = new SingleHole(number)
    walls.push(newWall)
    walls[i].fetchWall().forEach(piece => {
      piece.position.z += distance
      scene.add(piece)
      console.log(piece.position.z, 'POSITION Z')
      });
      distance += 100
  }
  newWalls = walls
  console.log(distance)
}
createWalls(10)

function moreWalls ( num ) {
  for (let i = 0; i < num; i++) {
    let number = Math.floor(Math.random() * 20) + 1
    number *= Math.floor(Math.random() * 2) === 1 ? 1 : -1
    let newWall = new SingleHole(number)
    walls.push(newWall)
    walls[i].fetchWall().forEach(piece => {
      piece.position.z += 1000
      scene.add(piece)
      console.log(piece.position.z, 'POSITION Z')
      });
  }
  cameraSpeed += .2
}

// camera.position.y += 20
camera.position.set(0, 10, 0);
camera.rotation.y = Math.PI

const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setClearColor('#2E2B40');

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

// let halfMouthObj = new THREE.Mesh( halfMouth, material );

let light = new THREE.PointLight(0xffff00);
light.position.set(-10, 0, 10);

function createHemisphereLight() {
  return new THREE.HemisphereLight(0x303f9f, 0x000000, 1);
}

// creates floor planes

// let drawnFloor 
let floor
let startFloor = 500

function createFloor() {
let floorLength = 1000
floor = new THREE.Mesh(
  new THREE.PlaneGeometry(50, floorLength, 100, 100),
  // wireframe tests for plane geometry which side is the right side
  new THREE.MeshBasicMaterial({ color: 0x38761d, wireframe: true })
);
// floor.position.z += currentFloor
floor.position.z += startFloor
floor.rotation.x -= Math.PI / 2;

scene.add(floor);
startFloor += floorLength
// console.log(floor)
}
createFloor()

// puts the floor along the x-axis


// Render Loop
const changeXYPosition = (obj, shape) => {
  obj.changeX = obj.x - obj.lastXPosition;
  obj.changeY = obj.y - obj.lastYPosition;

  shape.position.x += obj.changeX * 0.2;
  shape.position.y += -(obj.changeY * 0.2);

// Render Loop
let lastXPosition = 100;
let lastYPosition = 100;
let changeX = 1;
let changeY = 1;

const changeYXPosition = (faceObj, shape) => {
  changeX = faceObj.x - lastXPosition;
  changeY = faceObj.y - lastYPosition;

  shape.position.x += changeX * 0.2;
  shape.position.y += -(changeY * 0.2);
  // camera.lastXPosition = faceObj.x;
  lastYPosition = faceObj.y;
};

// let light = new THREE.DirectionalLight(0xffffff, 5.0)

// light.position.set(10, 10, 10)
  //collision 301
//   obj.lastXPosition = obj.x;
//   obj.lastYPosition = obj.y;
// };

// const changeHeadPosition = (obj, shape, body) => {
//   obj.changeX = obj.x - body.lastXPosition;
//   // obj.changeY = obj.y - body.lastYPosition;

//   shape.position.x += obj.changeX * 0.2;
//   // shape.position.y += -(obj.changeY * 0.2);

//   obj.lastXPosition = obj.x;
//   obj.lastYPosition = obj.y;
// };

// const render = function(aNose, shape) {
  // changeYXPosition(aNose, shape);
  // changeYXPosition(bodyParts.body, body);

  // camera.position.z -= 1;
  // box.position.z -= 1;

// scene.add(light)

let counter = 0
const render = function() {
  requestAnimationFrame( render )
  // if (counter === 0) {
  //   console.log(floor)
  //   counter++
  // }
  camera.position.z += cameraSpeed;
  box.position.z += cameraSpeed;
  // console.log(floor.geometry.parameters.height)


  if (camera.position.z > startFloor - 800){  
    console.log(camera.position.z , startFloor - 800, 'IF STATEMENT')
    createFloor()
    moreWalls(10)
    
  }
  
  if (keyboard[65]) {
    camera.position.x -=
      Math.sin(camera.rotation.y - Math.PI / 2) * player.speed;
    camera.position.z -=
      Math.cos(camera.rotation.y - Math.PI / 2) * player.speed;
  }

  //D key move right
  if (keyboard[68]) {
    camera.position.x +=
      Math.sin(camera.rotation.y - Math.PI / 2) * player.speed;
    camera.position.z +=
      Math.cos(camera.rotation.y - Math.PI / 2) * player.speed;
  }

  //W key move forwad
  if (keyboard[87]) {
    camera.position.x += Math.sin(camera.rotation.y) * player.speed;
    camera.position.z += Math.cos(camera.rotation.y) * player.speed;
  }

  //S Key move backwards
  if (keyboard[83]) {
    camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
    camera.position.z -= Math.cos(camera.rotation.y) * player.speed;
  }

  // Left Arrow rotate left
  if (keyboard[37]) {
    camera.rotation.y += Math.PI * 0.01;
  }
  // Right Arrow rotate right
  if (keyboard[39]) {
    camera.rotation.y -= Math.PI * 0.01;
  }

  // walls[0].checkCollision(box);

  renderer.render(scene, camera);
};
render()

let bodyParts = {
  nose: { lastXPosition: 100, lastYPosition: 100, changeX: 1, changeY: 1 },
  // leftShoulder: {},
  // rightShoulder: {},
  // leftHip: {},
  // rightHip: {},
  body: { lastXPosition: 100, lastYPosition: 100, changeX: 1, changeY: 1 },
};

//  createBody = () => {

// }

let geometry = new THREE.SphereGeometry(4);
let material = new THREE.MeshPhongMaterial({ color: '0x2194ce' });
let head = new THREE.Mesh(geometry, material);
// head.position.y += 10;
head.position.z += 65;

let bodyGeometry = new THREE.BoxGeometry(4, 8);
let body = new THREE.Mesh(bodyGeometry, material);
body.position.y += 10;
body.position.z += 65;

scene.add(light, head, body, createHemisphereLight());

poseNet.on('pose', function(results) {
  let poses = results;
  // console.log(bodyParts.body);
  updatePoses(poses, bodyParts);

  // console.log(bodyParts.nose.x && bodyParts.nose.y);

  // if (bodyParts.nose.x && bodyParts.nose.y) {
  //   console.log(bodyParts.nose, 'NOSE PARTS');
  //   changeHeadPosition(bodyParts.nose, head);

  //   render(bodyParts.nose, head);
  // }

  if (bodyParts.body.x && bodyParts.body.y) {
    changeXYPosition(bodyParts.body, body);
    changeXYPosition(bodyParts.nose, head);
    render(bodyParts.body, body);
  }
});

function modelReady() {
  console.log('model Loaded');
}

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight

  camera.updateProjectionMatrix()
})

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
}

function keyUp(event) {
  keyboard[event.keyCode] = false;
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);
