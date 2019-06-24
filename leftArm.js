//left arm test
let leftArmBone = new THREE.CylinderBufferGeometry(5, 5, 5, 5, 15, 5, 30);

let position = leftArmBone.attributes.position;

let vertex = new THREE.Vector3();

let skinIndices = [];
let skinWeights = [];
let sizing = 1;

for (let i = 0; i < position.count; i++) {
  vertex.fromBufferAttribute(position, i);

  // compute skinIndex and skinWeight based on some configuration data

  var y = vertex.y + sizing.halfHeight;

  var skinIndex = Math.floor(y / sizing.segmentHeight);
  var skinWeight = (y % sizing.segmentHeight) / sizing.segmentHeight;

  skinIndices.push(skinIndex, skinIndex + 1, 0, 0);
  skinWeights.push(1 - skinWeight, skinWeight, 0, 0);
}

leftArmBone.addAttribute(
  'skinIndex',
  new THREE.Uint16BufferAttribute(skinIndices, 4)
);
leftArmBone.addAttribute(
  'skinWeight',
  new THREE.Float32BufferAttribute(skinWeights, 4)
);

let laMesh = new THREE.SkinnedMesh(leftArmBone, material);
