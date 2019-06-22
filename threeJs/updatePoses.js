function loopThroughPoses(poses, bodyParts) {
  poses.forEach(pose => {
    let noseData = pose.pose.keypoints[0];
    let leftShoulderData = pose.pose.keypoints[5];
    let rightShoulderData = pose.pose.keypoints[6];
    let leftHipData = pose.pose.keypoints[11];
    let rightHipData = pose.pose.keypoints[12];

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

    if (
      leftShoulderData.score > 0.2 &&
      rightShoulderData.score > 0.2 &&
      leftHipData.score > 0.2 &&
      rightHipData.score > 0.2
    ) {
      // bodyParts.leftShoulder.x = leftShoulderData.position.x;
      // bodyParts.leftShoulder.y = leftShoulderData.position.y;
      // bodyParts.rightShoulder.x = rightShoulderData.position.x;
      // bodyParts.rightShoulder.y = rightShoulderData.position.y;

      // bodyParts.lefttHip.x = leftHipData.position.x;
      // bodyParts.leftHip.y = leftHipData.position.y;
      // bodyParts.rightHip.x = rightHipData.position.x;
      // bodyParts.rightHip.y = rightHipData.position.y;

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

  // for (let i = 0; i < poses.length; i++) {
  //   // For each pose detected, loop through all the keypoints
  //   let pose = poses[i].pose;
  //   for (let j = 0; j < pose.keypoints.length; j++) {
  //     // A keypoint is an object describing a body part (like rightArm or leftShoulder)
  //     let keypoint = pose.keypoints[j];

  //     // Only draw an ellipse is the pose probability is bigger than 0.2
  //     if (keypoint.score > 0.2) {
  //       if (keypoint.part === 'nose') {
  //         nose.x = keypoint.position.x;
  //         nose.y = keypoint.position.y;
  //       }
  //     }
  //   }
  // }
}
export default loopThroughPoses;
