import * as THREE from 'three';

let holeWidth = 10
const wallDimension = 50;

export default class SingleHole {
  // hole location range -20 to 20
  constructor(holeLocation = 0, holeHeight = 20) {
    //right side
    holeWidth = Math.ceil(Math.random()*5) + 10
    // console.log(holeWidth)
    let col1Geometry = new THREE.BoxGeometry(
      (wallDimension - holeWidth) / 2 + holeLocation,
      wallDimension
    );
    let col1Material = new THREE.MeshToonMaterial({
      color: getRandomColor(),
      wireframe: false,
      side: THREE.DoubleSide,
    });
    this.col1 = new THREE.Mesh(col1Geometry, col1Material);

    //left side
    let col2Geometry = new THREE.BoxGeometry(
      (wallDimension - holeWidth) / 2 - holeLocation,
      wallDimension
    );
    let col2Material = new THREE.MeshToonMaterial({
      color: getRandomColor(),
      wireframe: false,
      side: THREE.DoubleSide,
    });
    this.col2 = new THREE.Mesh(col2Geometry, col2Material);

    //top block
    let col3Geometry = new THREE.BoxGeometry(
      holeWidth,
      wallDimension - holeHeight
    );
    let col3Material = new THREE.MeshToonMaterial({
      color: getRandomColor(),
      wireframe: false,
      side: THREE.DoubleSide,
    });
    this.col3 = new THREE.Mesh(col3Geometry, col3Material);

    this.col1.position.x -=
      (wallDimension - this.col2.geometry.parameters.width) / 2 - holeLocation;
    this.col1.position.y += wallDimension / 2;

    this.col2.position.x +=
      (wallDimension - this.col1.geometry.parameters.width) / 2 + holeLocation;
    this.col2.position.y += wallDimension / 2;

    this.col3.position.x += holeLocation;
    this.col3.position.y +=
      this.col3.geometry.parameters.height / 2 + holeHeight;
  }

  fetchWall() {
    return [this.col1, this.col2, this.col3];
  }

  checkCollision(box) {
    // console.log(this.col1.position, 'COL1', this.col2.position, 'cOL2');
    let boxLocation = box.position.x;

    if (
      wallDimension / 2 + 2 * this.col1.position.x > boxLocation &&
      -wallDimension / 2 < boxLocation
    ) {
      console.log('HITTTT1', this.col1.position.x);
    }

    if (
      wallDimension / 2 - 2 * this.col2.position.x > boxLocation &&
      wallDimension / 2 > boxLocation
    ) {
      console.log('HITTTT2', this.col2.position.x);
      
    }

    if (this.holeHeight < box.position.y) {
      console.log('HITTTT3', this.col3.position.x);

    }
  }
}

function getRandomColor() {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  if (color !== '#ffffff') {
    return color;
  }
}
