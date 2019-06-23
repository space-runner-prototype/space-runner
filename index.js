/* eslint-disable complexity */
import * as ml5 from 'ml5';
import * as THREE from 'three';
import updatePoses from './threeJs/updatePoses';
import SingleHole from './Walls/singleHole';

//new compile?

let keyboard = {};
let modelLoaded = false

//Manage walls
// const singleHole = new SingleHole();
// let walls = [singleHole];

let player = { height: 1.8, speed: -0.5 };

let wallsPath = [];
let wallsPool = [];
let cameraSpeed = .5;
let cameraNoSpeed = 0

let video = document.createElement('video');
let vidDiv = document.getElementById('video');

video.setAttribute('width', 200);
video.setAttribute('height', 200);
video.autoplay = true;
// vidDiv.appendChild(video)

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
// scene.overrideMaterial = new THREE.MeshToonMaterial()
scene.background = new THREE.Color(0xf0f0f0);

// singleHole.fetchWall().forEach(piece => scene.add(piece));

// Create a basic perspective camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

function createWalls(num) {
  let distance = 50;
  for (let i = 0; i < num; i++) {
    let number = Math.floor(Math.random() * 20) + 1;
    number *= Math.floor(Math.random()* 2) === 1 ? 1 : -1;
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
    number *= Math.floor(Math.random()* 2) === 1 ? 1 : -1;
    let newWall = new SingleHole(number);
    
    wallsPool.push(newWall);
 
    wallsPool[i].fetchWall().forEach(piece => {
      piece.position.z = lastWallDistance;
      
      scene.add(piece);
    });
    lastWallDistance += 100;
  }
 
  wallsPath.length = 0;
  wallsPath = [
    wallsPath[wallsPath.length - 3],
    wallsPath[wallsPath.length - 2],
    wallsPath[wallsPath.length - 1],
    ...wallsPool,
  ];
  wallsPool.length = 0;
 
  cameraSpeed += 0.2;
 }

// camera.position.y += 20
camera.position.set(0, 10, -15);
camera.rotation.y = Math.PI;

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
let floor;
let startFloor = 500;

function createFloor() {
  let floorLength = 1000;
  floor = new THREE.Mesh(
    new THREE.PlaneGeometry(50, floorLength, 100, 100),
    // wireframe tests for plane geometry which side is the right side
    new THREE.MeshBasicMaterial({ color: 0x38761d, wireframe: true })
  );
  // floor.position.z += currentFloor
  floor.position.z += startFloor;
  floor.rotation.x -= Math.PI / 2;

  scene.add(floor);
  startFloor += floorLength;
  // console.log(floor)
  // floor.checkCollision(camera)
}
createFloor();

// MENU
// let menuMaterial = new THREE.MeshBasicMaterial({ wireframe:true})
// let menuPlane = new THREE.PlaneGeometry(20, 20)
// let menu = new THREE.Mesh(menuPlane, menuMaterial)
// menu.position.z = 20
// menu.position.y += 10
// scene.add(menu)

// let domMenu = document.createElement('div')
// let cssMenu = CSS3DObject(domMenu)

// cssMenu.position = menu.position
// cssMenu.rotation = menu.rotation

// cssScene.add(cssMenu)

// puts the floor along the x-axis

// Render Loop
const changeXYPosition = (obj, shape) => {
  obj.changeX = obj.x - obj.lastXPosition;
  obj.changeY = obj.y - obj.lastYPosition;

  shape.position.x -= obj.changeX * 0.2;
  camera.position.x -= obj.changeX * 0.2;
  shape.position.y += -(obj.changeY * 0.2);
  obj.lastXPosition = obj.x;
  obj.lastYPosition = obj.y;
};

// const changeHeadPosition = (obj, shape, body) => {
//   obj.changeX = obj.x - body.lastXPosition;
//   // obj.changeY = obj.y - body.lastYPosition;

//   shape.position.x += obj.changeX * 0.2;
//   // shape.position.y += -(obj.changeY * 0.2);

//   obj.lastXPosition = obj.x;
//   obj.lastYPosition = obj.y;
// };

let counter = 0;
const init = function() {
  requestAnimationFrame(init);
  // if (counter === 0) {
  //   console.log(floor)
  //   counter++
  // }
  camera.position.z += cameraSpeed;
  head.position.z += cameraSpeed;
  // console.log(floor.geometry.parameters.height)

  if (camera.position.z > startFloor - 800) {
    console.log(camera.position.z, startFloor - 800, 'IF STATEMENT');
    createFloor();
    moreWalls(10);
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

  if (keyboard[32]) {
    [cameraSpeed, cameraNoSpeed] = [cameraNoSpeed, cameraSpeed]
  }

  // walls[0].checkCollision(box);

  renderer.render(scene, camera);
};

let bodyParts = {
  nose: { lastXPosition: 100, lastYPosition: 100, changeX: 1, changeY: 1 },
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

//  createBody = () => {

// }

let geometry = new THREE.SphereGeometry(4);
let material = new THREE.MeshPhongMaterial({ color: '0x2194ce' });
let head = new THREE.Mesh(geometry, material);

// head.position.z += 65;

let bodyGeometry = new THREE.BoxGeometry(4, 8);
let body = new THREE.Mesh(bodyGeometry, material);
body.position.y += 10;

// body.position.z += 65;
// head.position.y = body.position.y

//left arm test
let bones = [];
const leftShoulder = new THREE.Bone();
const leftElbow = new THREE.Bone();
const leftWrist = new THREE.Bone();

leftShoulder.add(leftElbow);
leftElbow.add(leftWrist);

bones.push(leftShoulder, leftElbow, leftWrist);

leftShoulder.position.z += 65;
leftElbow.position.z += 65;
leftWrist.position.z += 65;

const leftArm = new THREE.Skeleton(bones);

scene.add(light, createHemisphereLight());
// body.rotation.x = Math.PI

poseNet.on('pose', function(results) {
  let poses = results;
  // console.log(bodyParts.body);
  updatePoses(poses, bodyParts);

  // console.log(bodyParts.nose.x && bodyParts.nose.y);

  if (bodyParts.nose.x && bodyParts.nose.y) {
    // console.log(bodyParts.nose, 'NOSE PARTS');
    changeXYPosition(bodyParts.nose, head);

    // render(bodyParts.nose, head);
  }

  // if (bodyParts.body.x && bodyParts.body.y) {
  //   changeXYPosition(bodyParts.body, body);
    // changeXYPosition(bodyParts.nose, head);
    // render(bodyParts.body, body);
  // }
});

function modelReady() {
  modelLoaded = true
  console.log('model Loaded');
}

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
}

function keyUp(event) {
  keyboard[event.keyCode] = false;
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

document
  .getElementById('play-button')
  .addEventListener('click', function(event) {
    // if (modelLoaded) {
    event.preventDefault();
    document.getElementById('menu').style.display = 'none';
    init()
    // }
  });

// document.getElementById('camera-test').addEventListener('click', function(event){
//   event.preventDefault()

// })


var loader = new THREE.FontLoader();

loader.load( '/fonts/droid_sans_bold.typeface.json', function ( font ) {

	const text = new THREE.TextGeometry( 'Hello three.js!', {
		font: font,
		size: 80,
		height: 5,
		curveSegments: 12,
		bevelEnabled: true,
		bevelThickness: 10,
		bevelSize: 8,
		bevelOffset: 0,
		bevelSegments: 5
  } );
  
  const textMaterial = new THREE.MeshLambertMaterial(
    {color: 0x2299E8, specular: 0x000000}
  )
  
  const name = new THREE.Mesh(text, textMaterial)
  scene.add(name)

} );





