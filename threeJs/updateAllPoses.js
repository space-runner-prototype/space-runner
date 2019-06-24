/* eslint-disable max-statements */
/* eslint-disable complexity */
function loopThroughAllPoses(poses, bodyParts) {
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
export default loopThroughAllPoses;
