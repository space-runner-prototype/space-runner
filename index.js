/* eslint-disable complexity */
import * as ml5 from 'ml5';
import * as THREE from 'three';
import loopThroughPoses from './threeJs/nose';

let keyboard = {};
let player = { height: 1.8, speed: -0.5 };

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
  minConfidence: 0.5,
};

let poseNet = ml5.poseNet(video, options, modelReady);

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

camera.position.set(30, 10, 300);
// camera.lookAt(scene.position);

const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setClearColor('#2E2B40');

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

let geometry = new THREE.BoxGeometry(8, 8);

let material = new THREE.MeshPhongMaterial({ color: '0x2194ce' });

let box = new THREE.Mesh(geometry, material);
// let halfMouthObj = new THREE.Mesh( halfMouth, material );

let light = new THREE.PointLight(0xffff00);
light.position.set(-10, 0, 10);

function createHemisphereLight() {
  return new THREE.HemisphereLight(0x303f9f, 0x000000, 1);
}
var loader = new THREE.TextureLoader();
var groundTexture = loader.load(
  'https://img.freepik.com/free-photo/white-marble-texture-with-natural-pattern-for-background-or-design-art-work_24076-186.jpg?size=338&ext=jpg'
);
groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.set(25, 25);
groundTexture.anisotropy = 16;

// creates floor plane
let floor = new THREE.Mesh(
  new THREE.PlaneGeometry(window.innerWidth, window.innerHeight, 100, 100),
  // wireframe tests for plane geometry which side is the right side
  new THREE.MeshBasicMaterial({ color: 0x883333, wireframe: true })
);

// puts the floor along the x-axis
floor.rotation.x -= Math.PI / 2;
scene.add(floor);

box.position.y += 10;

scene.add(light, box, createHemisphereLight());

// Render Loop
let lastXPosition = 100;
let lastYPosition = 100;
let changeX = 1;
let changeY = 1;

const changeYXPosition = (faceObj, shape, leftEyeShape, rightEyeShape) => {
  changeX = faceObj.x - lastXPosition;
  changeY = faceObj.y - lastYPosition;

  shape.position.x += changeX * 0.2;
  shape.position.y += -(changeY * 0.2);

  lastXPosition = faceObj.x;
  lastYPosition = faceObj.y;
};

const render = function(aNose, shape) {
  changeYXPosition(aNose, shape);

  camera.position.z -= 1;

  if (keyboard[87]) {
    camera.position.x += Math.sin(camera.rotation.y) * player.speed;
    camera.position.z += Math.cos(camera.rotation.y) * player.speed;
  }
  // S KEY move backward
  if (keyboard[83]) {
    camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
    camera.position.z -= Math.cos(camera.rotation.y) * player.speed;
  }
  // W key strafe left
  if (keyboard[65]) {
    camera.position.x -=
      Math.sin(camera.rotation.y - Math.PI / 2) * player.speed;
    camera.position.z -=
      Math.cos(camera.rotation.y - Math.PI / 2) * player.speed;
  }
  // D key strafe right
  if (keyboard[68]) {
    camera.position.x +=
      Math.sin(camera.rotation.y - Math.PI / 2) * player.speed;
    camera.position.z +=
      Math.cos(camera.rotation.y - Math.PI / 2) * player.speed;
  }

  // Left Arrow rotate left
  if (keyboard[37]) {
    camera.rotation.y += Math.PI * 0.01;
  }
  // Right Arrow rotate right
  if (keyboard[39]) {
    camera.rotation.y -= Math.PI * 0.01;
  }

  if (
    col1.position.x + 10 >
    box.position.x - box.geometry.parameters.width / 2
  ) {
    console.log('HITTTT1', col1.position.x);
  }

  if (
    col2.position.x - 10 <
    box.position.x + box.geometry.parameters.width / 2
  ) {
    console.log('HITTTT2', col2.position.x);
  }

  if (
    col3.position.y - 10 <
    box.position.y + box.geometry.parameters.width / 2
  ) {
    console.log('HITTTT3', col2.position.x);
  }

  renderer.render(scene, camera);
};

let nose = {};
let rightEye = {};
let leftEye = {};

poseNet.on('pose', function(results) {
  let poses = results;
  loopThroughPoses(poses, nose, rightEye, leftEye);
  let estimatedNose = {
    x: nose.x,
    y: nose.y,
  };
  if (estimatedNose.x && estimatedNose.y) {
    render(estimatedNose, box);
  }
});

function modelReady() {
  console.log('model Loaded');
}

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / 2 / (window.innerHeight / 2);
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
  //  video.setAttribute('width', window.innerWidth/2);
  //  video.setAttribute('height', window.innerWidth/2);
}

//
//
//
//

let wallGeometry = new THREE.BoxGeometry(50, 50);
let wallMaterial = new THREE.MeshStandardMaterial({
  color: 0x883322,
  wireframe: true,
  side: THREE.DoubleSide,
});
let wall = new THREE.Mesh(wallGeometry, wallMaterial);

// let boxGeometry = new THREE.BoxGeometry(8, 8);
// let boxMaterial = new THREE.MeshStandardMaterial({
//   color: 0xffffff,
//   wireframe: false,
// });
// let box = new THREE.Mesh(boxGeometry);
// box.material.color.setHex(0x00ff00)

let col1Geometry = new THREE.BoxGeometry(20, 50);
let col1Material = new THREE.MeshStandardMaterial({
  color: 0x883322,
  wireframe: false,
  side: THREE.DoubleSide,
});
let col1 = new THREE.Mesh(col1Geometry, col1Material);

let col2Geometry = new THREE.BoxGeometry(20, 50);
let col2Material = new THREE.MeshStandardMaterial({
  color: 0x883322,
  wireframe: true,
  side: THREE.DoubleSide,
});
let col2 = new THREE.Mesh(col2Geometry, col2Material);

let col3Geometry = new THREE.BoxGeometry(10, 20);
let col3Material = new THREE.MeshStandardMaterial({
  color: 0x883322,
  wireframe: true,
  side: THREE.DoubleSide,
});
let col3 = new THREE.Mesh(col3Geometry, col3Material);

col1.position.z += 10;
col1.position.y += 25;
col2.position.y += 25;
col2.position.z += 10;
col2.position.x += 30;
col3.position.y += 10;
col3.position.z += 10;
col3.position.x += 15;
col3.position.y += 30;

// scene.add(box);
scene.add(col1);
scene.add(col2);
scene.add(col3);

function keyDown(event) {
  keyboard[event.keyCode] = true;
}

function keyUp(event) {
  keyboard[event.keyCode] = false;
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);
