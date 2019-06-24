/* eslint-disable complexity */
import * as ml5 from 'ml5';
import * as THREE from 'three';
import updatePoses from './threeJs/updatePoses';
import SingleHole from './Walls/singleHole';

let keyboard = {};
let modelLoaded = false
let statsLoaded = false

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
const scene = new THREE.Scene();

// scene.overrideMaterial = new THREE.MeshToonMaterial()
// scene.background = new THREE.Color(0x000000);
// let loader = new THREE.CubeTextureLoader()
// loader.setPath('Milkway')

// let textureCube = loader.load([
// 'dark-s_nx.jpg', 'dark-s_ny.jpg',
// 'dark-s_nz.jpg', 'dark-s_px.jpg',
// 'dark-s_py.jpg', 'dark-s_pz.jpg'
// ])

// let spaceMaterial = new THREE.MeshBasicMaterial({envMap: textureCube})
// scene.background = spaceMaterial

// singleHole.fetchWall().forEach(piece => scene.add(piece));

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

  cameraSpeed += 0.2;
}

// camera.position.y += 20
camera.position.set(0, 10, -35);
camera.rotation.y = Math.PI;

const renderer = new THREE.WebGLRenderer({ antialias: true ,});
// alpha: true
renderer.setClearColor(0x000000, 0);


renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);


let light = new THREE.PointLight(0xffffff);

// let drawnFloor
let floor;
let startFloor = 500;

function createFloor() {
  let floorLength = 1000;
  floor = new THREE.Mesh(
    new THREE.PlaneGeometry(50, floorLength, 100, 100),
    new THREE.MeshBasicMaterial({ color: 0x38761d, wireframe: true })
  );
  // floor.position.z += currentFloor
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

  shape.position.x -= obj.changeX * 0.2;
  camera.position.x -= obj.changeX * 0.2;
  shape.position.y += -(obj.changeY * 0.2);
  obj.lastXPosition = obj.x;
  obj.lastYPosition = obj.y;
};

// const changeJointPosition = (obj, shape, line, vertex) => {
//   obj.changeX = obj.x - obj.lastXPosition;
//   obj.changeY = obj.y - obj.lastYPosition;

//   shape.position.x += obj.changeX * 0.2;
//   shape.position.y += -(obj.changeY * 0.2);

//   line.geometry.vertices[vertex].x = shape.position.x;
//   line.geometry.vertices[vertex].y = shape.position.y;
//   line.geometry.verticesNeedUpdate = true;

//   obj.lastXPosition = obj.x;
//   obj.lastYPosition = obj.y;
// };

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

const init = function() {
  requestAnimationFrame(init);

  //Check Collision
  if (camera.position.z <= 0) {
    wallsPath[0].checkCollision(head);
  }

  if (camera.position.z + 10 >= wallCount * 100 + level * 1000) {
    if (wallCount === 10) {
      wallsPath[0].checkCollision(head);
    } else {
      wallsPath[wallCount].checkCollision(head);
    }
  }


  camera.position.z += cameraSpeed;
  // head.position.z += cameraSpeed;
  // console.log(floor.geometry.parameters.height)

  // distance.innerHTML = camera.position.z

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
    // statsLoaded = !statsLoaded

}

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

let geometry = new THREE.SphereGeometry(4);
let material = new THREE.MeshPhongMaterial({ color: '0x2194ce' });
let head = new THREE.Mesh(geometry, material);
head.position.y += 10;
// head.position.z += 65;

let bodyGeometry = new THREE.BoxGeometry(4, 8);
let body = new THREE.Mesh(bodyGeometry, material);
body.position.y += 10;
// body.position.z += 65;

//left arm test
// let bones = [];
// const leftShoulder = new THREE.Bone();
// const leftElbow = new THREE.Bone();
// const leftWrist = new THREE.Bone();

// leftShoulder.add(leftElbow);
// leftElbow.add(leftWrist);

// bones.push(leftShoulder, leftElbow, leftWrist);

// leftShoulder.position.z += 65;
// leftElbow.position.z += 65;
// leftWrist.position.z += 65;

// const leftArm = new THREE.Skeleton(bones);

scene.add(light);
// body.rotation.x = Math.PI

poseNet.on('pose', function(results) {
  let poses = results;
  updatePoses(poses, bodyParts);


  if (bodyParts.nose.x && bodyParts.nose.y) {
    changeXYPosition(bodyParts.nose, head);
  }

  // if (bodyParts.body.x && bodyParts.body.y) {
    // changeXYPosition(bodyParts.nose, head);
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


function keyDown(event) {
  keyboard[event.keyCode] = true;
}

function keyUp(event) {
  keyboard[event.keyCode] = false;
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);




document.body.onkeyup = function(e) {
    if (modelLoaded) {
      if (e.keyCode === 13) {
        window.location = './camtest/camtest.html'
      }

      if (e.keyCode === 32) {
      document.getElementById('menu').style.display = 'none';
      init()
      }

    }

    if(keyboard[18]) {
      window.confirm(`Level: ${level} Wall Count: ${wallCount + level * 10} Distance: ${Math.floor(camera.position.z) + 35}`)
    }
}





