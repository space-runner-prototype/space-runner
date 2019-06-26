/* eslint-disable max-statements */
/* eslint-disable complexity */
import * as ml5 from 'ml5';
import * as THREE from 'three';
// import updateAllPoses from './threeJs/updateAllPoses';

let keyboard = {};

let player = { height: 1.8, speed: -3 };
let cameraSpeed = 0.5;

let video = document.createElement('video');
// let vidDiv = document.getElementById('video');

video.setAttribute('width', 200);
video.setAttribute('height', 200);
video.autoplay = true;
// vidDiv.appendChild(video);

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

const render = function() {
  requestAnimationFrame(render);

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

  //Right Arm
  rightShoulder: {
    lastXPosition: 100,
    lastYPosition: 100,
    changeX: 1,
    changeY: 1,
  },
  rightElbow: {
    lastXPosition: 100,
    lastYPosition: 100,
    changeX: 1,
    changeY: 1,
  },
  rightWrist: {
    lastXPosition: 100,
    lastYPosition: 100,
    changeX: 1,
    changeY: 1,
  },

  //Left leg
  leftHip: {
    lastXPosition: 100,
    lastYPosition: 100,
    changeX: 1,
    changeY: 1,
  },
  leftKnee: { lastXPosition: 100, lastYPosition: 100, changeX: 1, changeY: 1 },
  leftAnkle: { lastXPosition: 100, lastYPosition: 100, changeX: 1, changeY: 1 },

  //Right leg
  rightHip: {
    lastXPosition: 100,
    lastYPosition: 100,
    changeX: 1,
    changeY: 1,
  },
  rightKnee: { lastXPosition: 100, lastYPosition: 100, changeX: 1, changeY: 1 },
  rightAnkle: {
    lastXPosition: 100,
    lastYPosition: 100,
    changeX: 1,
    changeY: 1,
  },
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

//LEFT ARM
const jointGeometry = new THREE.SphereGeometry(0.5);
const leftShoulder = new THREE.Mesh(jointGeometry, material);
// leftShoulder.position.z += 65;
leftShoulder.position.y += 13;
leftShoulder.position.x += 8;

const leftElbow = new THREE.Mesh(jointGeometry, material);
// leftShoulder.position.z += 65;
leftElbow.position.y += 13;
leftElbow.position.x += 10;

const leftWrist = new THREE.Mesh(jointGeometry, material);
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

//RIGHT ARM
const rightShoulder = new THREE.Mesh(jointGeometry, material);
// rightShoulder.position.z += 65;
rightShoulder.position.y += 13;
rightShoulder.position.x -= 8;

const rightElbow = new THREE.Mesh(jointGeometry, material);
// rightShoulder.position.z += 65;
rightElbow.position.y += 13;
rightElbow.position.x -= 10;

const rightWrist = new THREE.Mesh(jointGeometry, material);
// rightShoulder.position.z += 65;
rightWrist.position.y += 13;
rightWrist.position.x -= 12;

var rightArm = new THREE.Geometry();
rightArm.vertices.push(
  new THREE.Vector3(rightShoulder.position.x, rightShoulder.position.y, 0)
);
rightArm.vertices.push(
  new THREE.Vector3(rightElbow.position.x, rightElbow.position.y, 0)
);
rightArm.vertices.push(
  new THREE.Vector3(rightWrist.position.x, rightWrist.position.y, 0)
);

const rightArmBone = new THREE.Line(rightArm, limbMaterial);

scene.add(rightArmBone);

//LEFT LEG
const leftHip = new THREE.Mesh(jointGeometry, material);
// leftShoulder.position.z += 65;
leftHip.position.y += 5;
leftHip.position.x += 8;

const leftKnee = new THREE.Mesh(jointGeometry, material);
// leftShoulder.position.z += 65;
leftKnee.position.y += 5;
leftKnee.position.x += 10;

const leftAnkle = new THREE.Mesh(jointGeometry, material);
// leftShoulder.position.z += 65;
leftAnkle.position.y += 5;
leftAnkle.position.x += 12;

var leftLeg = new THREE.Geometry();
leftLeg.vertices.push(
  new THREE.Vector3(leftHip.position.x, leftHip.position.y, 0)
);
leftLeg.vertices.push(
  new THREE.Vector3(leftKnee.position.x, leftKnee.position.y, 0)
);
leftLeg.vertices.push(
  new THREE.Vector3(leftAnkle.position.x, leftAnkle.position.y, 0)
);

const leftLegBone = new THREE.Line(leftLeg, limbMaterial);

scene.add(leftLegBone);

//RIGHT LEG
const rightHip = new THREE.Mesh(jointGeometry, material);
// rightShoulder.position.z += 65;
rightHip.position.y += 5;
rightHip.position.x -= 8;

const rightKnee = new THREE.Mesh(jointGeometry, material);
// rightShoulder.position.z += 65;
rightKnee.position.y += 5;
rightKnee.position.x -= 10;

const rightAnkle = new THREE.Mesh(jointGeometry, material);
// rightShoulder.position.z += 65;
rightAnkle.position.y += 5;
rightAnkle.position.x -= 12;

var rightLeg = new THREE.Geometry();
rightLeg.vertices.push(
  new THREE.Vector3(rightHip.position.x, rightHip.position.y, 0)
);
rightLeg.vertices.push(
  new THREE.Vector3(rightKnee.position.x, rightKnee.position.y, 0)
);
rightLeg.vertices.push(
  new THREE.Vector3(rightAnkle.position.x, rightAnkle.position.y, 0)
);

const rightLegBone = new THREE.Line(rightLeg, limbMaterial);

scene.add(rightLegBone);

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
  rightShoulder,
  rightElbow,
  rightWrist,
  leftHip,
  leftKnee,
  leftAnkle,
  rightHip,
  rightKnee,
  rightAnkle,
  createHemisphereLight()
);

poseNet.on('pose', function(results) {
  let poses = results;
  // console.log(bodyParts.body);
  updateAllPoses(poses, bodyParts);

  // Update left arm
  if (
    bodyParts.leftShoulder.x &&
    bodyParts.leftShoulder.y &&
    bodyParts.leftElbow.x &&
    bodyParts.leftElbow.y &&
    bodyParts.leftWrist.x &&
    bodyParts.leftWrist.y
  ) {
    changeJointPosition(bodyParts.leftShoulder, leftShoulder, leftArmBone, 0);
    changeJointPosition(bodyParts.leftElbow, leftElbow, leftArmBone, 1);
    changeJointPosition(bodyParts.leftWrist, leftWrist, leftArmBone, 2);
  }

  //Update right arm
  // if (
  //   bodyParts.rightShoulder.x &&
  //   bodyParts.rightShoulder.y &&
  //   bodyParts.rightElbow.x &&
  //   bodyParts.rightElbow.y &&
  //   bodyParts.rightWrist.x &&
  //   bodyParts.rightWrist.y
  // ) {
  //   changeJointPosition(bodyParts.rightShoulder, rightShoulder, rightArmBone, 0);
  //   changeJointPosition(bodyParts.rightElbow, rightElbow, rightArmBone, 1);
  //   changeJointPosition(bodyParts.rightWrist, rightWrist, rightArmBone, 2);
  // }

  // Update left leg
  // if (
  //   bodyParts.leftHip.x &&
  //   bodyParts.leftHip.y &&
  //   bodyParts.leftKnee.x &&
  //   bodyParts.leftKnee.y &&
  //   bodyParts.leftAnkle.x &&
  //   bodyParts.leftAnkle.y
  // ) {
  //   changeJointPosition(bodyParts.leftHip, leftHip, leftLegBone, 0);
  //   changeJointPosition(bodyParts.leftKnee, leftKnee, leftLegBone, 1);
  //   changeJointPosition(bodyParts.leftAnkle, leftAnkle, leftLegBone, 2);
  // }

  // Update right leg
  // if (
  //   bodyParts.rightHip.x &&
  //   bodyParts.rightHip.y &&
  //   bodyParts.rightKnee.x &&
  //   bodyParts.rightKnee.y &&
  //   bodyParts.rightAnkle.x &&
  //   bodyParts.rightAnkle.y
  // ) {
  //   changeJointPosition(bodyParts.rightHip, rightHip, rightLegBone, 0);
  //   changeJointPosition(bodyParts.rightKnee, rightKnee, rightLegBone, 1);
  //   changeJointPosition(bodyParts.rightAnkle, rightAnkle, rightLegBone, 2);
  // }

  if (bodyParts.nose.x && bodyParts.nose.y) {
    changeXYPosition(bodyParts.nose, head);
  }

  if (bodyParts.body.x && bodyParts.body.y) {
    changeXYPosition(bodyParts.body, body);
  }
});

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();
});

// Solid wall for test
let wallGeometry = new THREE.BoxGeometry(50, 50);
let wallMaterial = new THREE.MeshStandardMaterial({
  color: 0x883322,
  wireframe: true,
  side: THREE.DoubleSide,
});
let wall = new THREE.Mesh(wallGeometry, wallMaterial);
scene.add(wall);

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

render();

function updateAllPoses(poses, bodyParts) {
    poses.forEach(pose => {
      let noseData = pose.pose.keypoints[0];
      let leftShoulderData = pose.pose.keypoints[5];
      let rightShoulderData = pose.pose.keypoints[6];
      let leftHipData = pose.pose.keypoints[11];
      let rightHipData = pose.pose.keypoints[12];
  
      //Left arm test
      let leftElbowData = pose.pose.keypoints[7];
      let leftWristData = pose.pose.keypoints[9];
  
      if (leftElbowData.score > 0.2 && leftWristData.score > 0.2) {
        bodyParts.leftShoulder.x = leftShoulderData.position.x;
        bodyParts.leftShoulder.y = leftShoulderData.position.y;
        bodyParts.leftElbow.x = leftElbowData.position.x;
        bodyParts.leftElbow.y = leftElbowData.position.y;
        bodyParts.leftWrist.x = leftWristData.position.x;
        bodyParts.leftWrist.y = leftWristData.position.y;
      }
  
      //right arm test
      let rightElbowData = pose.pose.keypoints[8];
      let rightWristData = pose.pose.keypoints[10];
  
      if (rightElbowData.score > 0.2 && rightWristData.score > 0.2) {
        bodyParts.rightShoulder.x = rightShoulderData.position.x;
        bodyParts.rightShoulder.y = rightShoulderData.position.y;
        bodyParts.rightElbow.x = rightElbowData.position.x;
        bodyParts.rightElbow.y = rightElbowData.position.y;
        bodyParts.rightWrist.x = rightWristData.position.x;
        bodyParts.rightWrist.y = rightWristData.position.y;
      }
  
      //Left leg test
      let leftKneeData = pose.pose.keypoints[13];
      let leftAnkleData = pose.pose.keypoints[15];
  
      if (leftKneeData.score > 0.2 && leftAnkleData.score > 0.2) {
        bodyParts.leftHip.x = leftHipData.position.x;
        bodyParts.leftHip.y = leftHipData.position.y;
        bodyParts.leftKnee.x = leftKneeData.position.x;
        bodyParts.leftKnee.y = leftKneeData.position.y;
        bodyParts.leftAnkle.x = leftAnkleData.position.x;
        bodyParts.leftAnkle.y = leftAnkleData.position.y;
      }
  
      //Right leg test
      let rightKneeData = pose.pose.keypoints[13];
      let rightAnkleData = pose.pose.keypoints[15];
  
      if (rightKneeData.score > 0.2 && rightAnkleData.score > 0.2) {
        bodyParts.rightHip.x = rightHipData.position.x;
        bodyParts.rightHip.y = rightHipData.position.y;
        bodyParts.rightKnee.x = rightKneeData.position.x;
        bodyParts.rightKnee.y = rightKneeData.position.y;
        bodyParts.rightAnkle.x = rightAnkleData.position.x;
        bodyParts.rightAnkle.y = rightAnkleData.position.y;
      }
  
      //Calculate length of body
      let topEdge = Math.abs(
        (leftShoulderData.position.y + rightShoulderData.position.y) / 2
      );
      let bottomEdge = Math.abs(
        (leftHipData.position.y + rightHipData.position.y) / 2
      );
  
      //Calculate width of body
      let width = Math.abs(leftHipData.position.x - rightHipData.position.x);
  
      if (noseData.score > 0.2) {
        bodyParts.nose.x = noseData.position.x;
        bodyParts.nose.y = noseData.position.y;
      }
  
      //Calculate body midpoint
      if (
        leftShoulderData.score > 0.2 &&
        rightShoulderData.score > 0.2 &&
        leftHipData.score > 0.2 &&
        rightHipData.score > 0.2
      ) {
        topEdge = Math.abs(
          (leftShoulderData.position.y + rightShoulderData.position.y) / 2
        );
        bottomEdge = Math.abs(
          (leftHipData.position.y + rightHipData.position.y) / 2
        );
        width = Math.abs(leftHipData.position.x - rightHipData.position.x);
  
        bodyParts.body.length = topEdge - bottomEdge;
        bodyParts.body.width = width;
        bodyParts.body.x =
          (leftShoulderData.position.x +
            rightShoulderData.position.x +
            leftHipData.position.x +
            rightHipData.position.x) /
          4;
        bodyParts.body.y = (topEdge + bottomEdge) / 2;
      }
    });
  }