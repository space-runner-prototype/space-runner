import * as THREE from 'three';

const holeWidth = 10;
const wallDimension = 50;

export default class SingleHole {
  constructor(holeLocation = 0, holeHeight = 20) {
    //left side

    let col1Geometry = new THREE.BoxGeometry(
      (wallDimension - holeWidth) / 2 + holeLocation,
      wallDimension
    );
    let col1Material = new THREE.MeshStandardMaterial({
      color: 0x883322,
      wireframe: false,
      side: THREE.DoubleSide,
    });
    this.col1 = new THREE.Mesh(col1Geometry, col1Material);

    //right side
    let col2Geometry = new THREE.BoxGeometry(
      (wallDimension - holeWidth) / 2 - holeLocation,
      wallDimension
    );
    let col2Material = new THREE.MeshStandardMaterial({
      color: 0x883322,
      wireframe: true,
      side: THREE.DoubleSide,
    });
    this.col2 = new THREE.Mesh(col2Geometry, col2Material);

    //top block
    let col3Geometry = new THREE.BoxGeometry(
      holeWidth,
      wallDimension - holeHeight
    );
    let col3Material = new THREE.MeshStandardMaterial({
      color: 0x883322,
      wireframe: true,
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
    if (
      this.col1.position.x + 10 >
      box.position.x - box.geometry.parameters.width / 2
    ) {
      console.log('HITTTT1', this.col1.position.x);
    }

    if (
      this.col2.position.x - 10 <
      box.position.x + box.geometry.parameters.width / 2
    ) {
      console.log('HITTTT2', this.col2.position.x);
    }

    if (
      this.col3.position.y - 10 <
      box.position.y + box.geometry.parameters.width / 2
    ) {
      console.log('HITTTT3', this.col2.position.x);
    }
  }
}

// export default MiddleHole