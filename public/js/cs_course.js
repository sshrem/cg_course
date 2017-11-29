/**
 * Created by shrem on 7/14/17.
 */

function createScene(){
  lesson4_MakeAFlower();
  // lesson4_RobotHand();
  // lesson4_ExtendedRobotArm();
  // lesson4_Demo_RobotArm();
  // lesson4_TwoClockHands();
  // lesson4_BuildASnowman();
  // lesson4_Demo_EulerAngles();
  // lesson3_DemoLambert();
  // lesson3_MaterialDemo();
  // theDrinkingBird();
  // lessson3_ShinyBird();
  // lesson3_DiffuseMaterial();
  // Lesson3_VertexAttributes();
  // createSceneHelper(lesson4_12);
  // lesson2_PolygonCreator();
  // lesson2_PolygonLocation();
  // buildAStairway();
}

//Draw a Square
function lesson4_12(scene, camera, renderer){
  var material = new THREE.MeshBasicMaterial( { color: 0xff0000, side: THREE.DoubleSide } );

  var geometry = new THREE.Geometry();
  geometry.vertices.push( new THREE.Vector3( 5, 10, 0 ) );  // vertex 0
  geometry.vertices.push( new THREE.Vector3( 5, 5, 0 ) );   // vertex 1
  geometry.vertices.push( new THREE.Vector3( 10, 5, 0 ) );  // vertex 2
  geometry.vertices.push( new THREE.Vector3( 10, 10, 0 ) );  // vertex 3

  geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );  // make a triangle
  geometry.faces.push( new THREE.Face3( 0, 2, 3 ) );  // make a triangle

  var mesh = new THREE.Mesh( geometry, material );  // create an object

  scene.add( mesh );

  camera.position.set(0, 0, 30);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
}

function createSceneHelper(f){
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
  document.body.appendChild(renderer.domElement);

  f(scene, camera, renderer);

  renderer.render( scene, camera );
}

function drawLines(scene, camera, renderer){
  camera.position.set(0, 0, 100);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  //create a blue LineBasicMaterial
  var material = new THREE.LineBasicMaterial({ color: 0x0000ff });
  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3(-10, 0, 0));
  geometry.vertices.push(new THREE.Vector3(0, 10, 0));
  geometry.vertices.push(new THREE.Vector3(10, 0, 0));
  var line = new THREE.Line(geometry, material);
  scene.add(line);
}

function createCube() {
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
  document.body.appendChild(renderer.domElement);

  var geometry = new THREE.BoxGeometry(1, 1, 1);
  var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
  var cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  camera.position.z = 5;
  function animate() {
    requestAnimationFrame( animate );
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render( scene, camera );
  }

  animate();
}


