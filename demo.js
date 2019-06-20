let far = 2000
let scene = new THREE.Scene()
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, far)
let player = {height: 1.8, speed: -.1}

let keyboard = {}

// creates floor plane
let floor = new THREE.Mesh(
    new THREE.PlaneGeometry(window.innerWidth,window.innerHeight,100,100),
    // wireframe tests for plane geometry which side is the right side
    new THREE.MeshBasicMaterial({color:  0x883333, wireframe: true})
)

// puts the floor along the x-axis
floor.rotation.x -= Math.PI / 2
scene.add(floor)

let planeGeometry = new THREE.PlaneGeometry(1, 60)
let planeMaterial = new THREE.MeshBasicMaterial({color: 0x00ffff, wireframe: false})
let plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.rotation.y = Math.PI / 2
scene.add(plane)

// camera.position.set(0, player.height, -5)ss
// camera.lookAt(new THREE.Vector3(0, player.height, 0))

// renderer with transparent backdrop
let renderer = new THREE.WebGLRenderer({alpha: true})

// enable shadow
// renderer.shadowMap.enabled = true
// renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)

let wallGeometry = new THREE.BoxGeometry(50, 50,)
let wallMaterial = new THREE.MeshStandardMaterial({color: 0x883322, wireframe:true, side: THREE.DoubleSide})
let wall = new THREE.Mesh(wallGeometry, wallMaterial)

let boxGeometry = new THREE.BoxGeometry(8, 8)
let boxMaterial = new THREE.MeshStandardMaterial({color: 0xffffff, wireframe:false})
let box = new THREE.Mesh(boxGeometry)
// box.material.color.setHex(0x00ff00)

let col1Geometry = new THREE.BoxGeometry(20, 50)
let col1Material = new THREE.MeshStandardMaterial({color: 0x883322, wireframe:false, side: THREE.DoubleSide})
let col1 = new THREE.Mesh(col1Geometry, col1Material)

let col2Geometry = new THREE.BoxGeometry(20, 50)
let col2Material = new THREE.MeshStandardMaterial({color: 0x883322, wireframe:true, side: THREE.DoubleSide})
let col2 = new THREE.Mesh(col2Geometry, col2Material)

let col3Geometry = new THREE.BoxGeometry(10, 20)
let col3Material = new THREE.MeshStandardMaterial({color: 0x883322, wireframe:true, side: THREE.DoubleSide})
let col3 = new THREE.Mesh(col3Geometry, col3Material)


// wall.position.y += 20
// wall.position.z += 5

// col1.rotation.z = Math.PI
box.position.y += 10
col1.position.z += 10
col1.position.y += 25
col2.position.y += 25
col2.position.z += 10
col2.position.x += 30
col3.position.y += 10
col3.position.z += 10
col3.position.x += 15
col3.position.y += 30
plane.position.z += 10
plane.position.x += 10

// scene.add(wall)
scene.add(box)
scene.add(col1)
scene.add(col2)
scene.add(col3)

camera.position.z = 20;
camera.position.y = 20
camera.position.x = 20
// camera.position.x = -3

let counter = 0


function animate() {
    requestAnimationFrame( animate );
    // wall.rotation.x += 0.01;
    // wall.rotation.y += 0.01;
    // console.log(wall.position)
//    console.log("FLOOR", floor.position)
    far += 1
    // camera.position.z -= 1
    // camera.updateProjectionMatrix()
    // W KEY move foward

    if (counter === 0) {
    console.log(wall)
    counter++
    }

    if (keyboard[87]) { 
        camera.position.x += Math.sin(camera.rotation.y) * player.speed
        camera.position.z += Math.cos(camera.rotation.y) * player.speed
    }
    // S KEY move backward
    if (keyboard[83]) {
        camera.position.x -= Math.sin(camera.rotation.y) * player.speed
        camera.position.z -= Math.cos(camera.rotation.y) * player.speed
    }
    // W key strafe left
    if (keyboard[65]) {
        camera.position.x -= Math.sin(camera.rotation.y - Math.PI/2) * player.speed
        camera.position.z -= Math.cos(camera.rotation.y - Math.PI/2) * player.speed
    }
    // D key strafe right
    if (keyboard[68]) {
        camera.position.x += Math.sin(camera.rotation.y - Math.PI/2) * player.speed
        camera.position.z += Math.cos(camera.rotation.y - Math.PI/2) * player.speed
    }

    // Left Arrow rotate left
    if (keyboard[37]) {
        camera.rotation.y += Math.PI * 0.01
    }
    // Right Arrow rotate right
    if (keyboard[39]) {
        camera.rotation.y -= Math.PI * 0.01
    }

    // numpad 4 (100)
    // numpad 5 (101)
    // numpad 6 (102)
    // numpad 8 (104)

    if (keyboard[104]) {
        box.position.x += Math.sin(box.rotation.y) * -.1
        box.position.z += Math.cos(box.rotation.y) * -.1
    }

    if (keyboard[101]) {
        box.position.x -= Math.sin(box.rotation.y) * -.1
        box.position.z -= Math.cos(box.rotation.y) * -.1
    }

    if (keyboard[100]) {
        box.position.x -= Math.sin(box.rotation.y - Math.PI/2) * -.1
        box.position.z -= Math.cos(box.rotation.y - Math.PI/2) * -.1
    }

    if (keyboard[102]) {
        box.position.x += Math.sin(box.rotation.y - Math.PI/2) * -.1
        box.position.z += Math.cos(box.rotation.y - Math.PI/2) * -.1
    }

    if (keyboard[99]) {
        box.position.x += Math.sin(box.rotation.y) * -.1
        box.position.y += Math.cos(box.rotation.y) * -.1
    }

    if (keyboard[98]) {
        box.position.x -= Math.sin(box.rotation.y) * -.1
        box.position.y -= Math.cos(box.rotation.y) * -.1
    }
    console.log("BOX POSITION", box.position)
    // box.position.z > col1.position.z -1 &&
    console.log('BOX3', col3.position)
if (col1.position.x  + 10 > box.position.x - box.geometry.parameters.width /2 ){
    console.log("HITTTT1", col1.position.x)
    
}
        
if (col2.position.x  - 10 < box.position.x + box.geometry.parameters.width /2 ){
    
    console.log("HITTTT2", col2.position.x)
    }


    if (col3.position.y -10 < box.position.y + box.geometry.parameters.width /2 ){
    
        console.log("HITTTT3", col2.position.x)
        }

	renderer.render( scene, camera );
}
animate();

function keyDown(event) {
    keyboard[event.keyCode] = true
    
//     for (var vertexIndex = 0; vertexIndex < box.geometry.vertices.length; vertexIndex++)
// {       
//     var localVertex = box.geometry.vertices[vertexIndex].clone();
//     var globalVertex = box.matrix.multiplyVector3(localVertex);
//     var directionVector = globalVertex.subSelf( box.position );

//     var ray = new THREE.Ray( box.position, directionVector.clone().normalize() );
//     var collisionResults = ray.intersectObjects( collidableMeshList );
//     if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) 
//     {
//         console.log("HITTTTTTTT")
//     }
// }
}

function keyUp(event) {
    keyboard[event.keyCode] = false
}


window.addEventListener('keydown', keyDown)
window.addEventListener('keyup', keyUp)



// var scene = new THREE.Scene();
// var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// var renderer = new THREE.WebGLRenderer();
// renderer.setSize( window.innerWidth, window.innerHeight );
// document.body.appendChild( renderer.domElement );

// var geometry = new THREE.BoxGeometry( 1, 1, 1 );
// var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// var cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

// camera.position.z = 5;
