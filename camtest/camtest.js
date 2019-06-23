// import * as ml5 from 'ml5';
// import * as THREE from 'three';

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const poseNet = ml5.poseNet(video, modelReady);
let poses = [];

poseNet.on('pose', gotPoses);

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
 navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
   video.srcObject = stream;
   video.play();
 });
}

function drawCameraIntoCanvas() {
 ctx.drawImage(video, 0, 0, 640, 480);
 drawKeypoints();
 drawSkeleton();
 window.requestAnimationFrame(drawCameraIntoCanvas);
}
drawCameraIntoCanvas();

function gotPoses(results) {
 poses = results;
}

function modelReady() {
 console.log('model ready');
}

function drawKeypoints() {
 for (let i = 0; i < poses.length; i++) {
   for (let j = 0; j < poses[i].pose.keypoints.length; j++) {
     let keypoint = poses[i].pose.keypoints[j];

     if (keypoint.score > 0.2) {
       ctx.beginPath();
       ctx.arc(keypoint.position.x, keypoint.position.y, 10, 0, 2 * Math.PI);
       ctx.stroke();
     }
   }
 }
}

// A function to draw the skeletons
function drawSkeleton() {
 for (let i = 0; i < poses.length; i++) {
   for (let j = 0; j < poses[i].skeleton.length; j++) {
     let partA = poses[i].skeleton[j][0];
     let partB = poses[i].skeleton[j][1];
     ctx.beginPath();
     ctx.moveTo(partA.position.x, partA.position.y);
     ctx.lineTo(partB.position.x, partB.position.y);
     ctx.stroke();
   }
 }
}