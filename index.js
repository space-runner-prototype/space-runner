/* eslint-disable complexity */
import * as ml5 from 'ml5';
import * as THREE from 'three';
import loopThroughPoses from './threeJs/nose';
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

// let video = document.createElement('video');
// let vidDiv = document.getElementById('video');

// video.setAttribute('width', 200);
// video.setAttribute('height', 200);
// video.autoplay = true;
// vidDiv.appendChild(video);

// get the users webcam stream to render in the video
// navigator.mediaDevices
//   .getUserMedia({ video: true, audio: false })
//   .then(function(stream) {
//     video.srcObject = stream;
//     // video.hiddend();
//   })
//   .catch(function(err) {
//     console.log('An error occurred! ' + err);
//   });

// let options = {
//   flipHorizontal: true,
//   minConfidence: .5,
// };

// let poseNet = ml5.poseNet(video, options, modelReady);

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

// let geometry = new THREE.BoxGeometry(8, 8);

// let material = new THREE.MeshPhongMaterial({ color: '0x2194ce' });

// let box = new THREE.Mesh(geometry, material);
// let halfMouthObj = new THREE.Mesh( halfMouth, material );

// let light = new THREE.PointLight(0xffff00);
// light.position.set(-10, 0, 10);

// function createHemisphereLight() {
//   return new THREE.HemisphereLight(0x303f9f, 0x000000, 1);

// creates floor planes

// let drawnFloor 
let floor
let startFloor = 500

function createFloor() {
let floorLength = 1000
floor = new THREE.Mesh(
  new THREE.PlaneGeometry(50, floorLength, 100, 100),
  // wireframe tests for plane geometry which side is the right side
  new THREE.MeshBasicMaterial({ color: 0x883333, wireframe: true })
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


// box.position.y += 10;

// scene.add(light, box, createHemisphereLight());

// Render Loop
// let lastXPosition = 100;
// let lastYPosition = 100;
// let changeX = 1;
// let changeY = 1;

// const changeYXPosition = (faceObj, shape) => {
//   changeX = faceObj.x - lastXPosition;
//   changeY = faceObj.y - lastYPosition;

//   shape.position.x += changeX * 0.2;
//   shape.position.y += -(changeY * 0.2);
//   // camera.lastXPosition = faceObj.x;
//   lastYPosition = faceObj.y;
// };

let counter = 0
const render = function() {
  requestAnimationFrame( render )
  // if (counter === 0) {
  //   console.log(floor)
  //   counter++
  // }
  camera.position.z += cameraSpeed;
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

// let nose = {};
// let rightEye = {};
// let leftEye = {};

// poseNet.on('pose', function(results) {
//   let poses = results;
//   loopThroughPoses(poses, nose, rightEye, leftEye);
//   let estimatedNose = {
//     x: nose.x,
//     y: nose.y,
//   };

//   camera.position.x = nose.x;
//   camera.position.y = nose.y;

//   if (estimatedNose.x && estimatedNose.y) {
//     render(estimatedNose, box);
//   }
// });

// function modelReady() {
//   console.log('model Loaded');
// }

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
