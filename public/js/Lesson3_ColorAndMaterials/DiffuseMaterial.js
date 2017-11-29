/**
 * Created by shrem on 7/17/17.
 */
////////////////////////////////////////////////////////////////////////////////
// Diffuse material exercise
////////////////////////////////////////////////////////////////////////////////
/*global THREE, window, document*/
function lesson3_DiffuseMaterial(){
var camera, scene, renderer;
var cameraControls, effectController;
var clock = new THREE.Clock();
var ambientLight, light;
var gridX = false;
var gridY = false;
var gridZ = false;
var axes = false;
var ground = false;


function init() {
  var canvasWidth = 846;
  var canvasHeight = 494;
  var canvasRatio = canvasWidth / canvasHeight;

  // CAMERA

  camera = new THREE.PerspectiveCamera( 45, canvasRatio, 1, 80000 );
  camera.position.set( -300, 300, 2000 );
  camera.lookAt(0,0,0);
  // LIGHTS

  ambientLight = new THREE.AmbientLight( 0xffffff );

  light = new THREE.DirectionalLight( 0xffffff, 0.7 );
  light.position.set( -800, 900, 300 );

  // RENDERER
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( canvasWidth, canvasHeight );
  renderer.setClearColor( 0xAAAAAA, 1.0 );

  renderer.gammaInput = true;
  renderer.gammaOutput = true;

  // CONTROLS
  cameraControls = new THREE.OrbitControls( camera, renderer.domElement );
  cameraControls.target.set(0, 0, 0);

}

function createBall() {
  // Do not change the color itself, change the material and use the ambient and diffuse components.
  var material = new THREE.MeshLambertMaterial( { color: 0x80FC66} );
  // var material = new THREE.MeshBasicMaterial( { color: 0x80FC66, shading: THREE.FlatShading } );
  var sphere = new THREE.Mesh( new THREE.SphereGeometry( 400, 64, 32 ), material );

  var newRed = material.color.r * 0.4;
  var newGreen = material.color.g * 0.4;
  var newBlue = material.color.b * 0.4;
  // material.ambient.setRGB(newRed, newGreen, newBlue );
  return sphere;
}

function fillScene() {
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog( 0x808080, 2000, 4000 );
  scene.add( camera );

  // LIGHTS
  scene.add( ambientLight );
  scene.add( light );

  var ball = createBall();
  scene.add( ball );



  if (ground) {
    Coordinates.drawGround(scene, {size:1000});
  }
  if (gridX) {
    // Coordinates.drawGrid({size:1000,scale:0.01});
    var size = 1000;
    var divisions = 10;

    var gridHelper = new THREE.GridHelper( size, divisions );
    scene.add( gridHelper );
  }
  if (gridY) {
    // Coordinates.drawGrid({size:1000,scale:0.01, orientation:"y"});
    var size = 1000;
    var divisions = 10;

    var gridHelper = new THREE.GridHelper( size, divisions );
    gridHelper.rotation.z = - Math.PI / 2;
    scene.add( gridHelper );


  }
  if (gridZ) {
    // Coordinates.drawGrid({size:1000,scale:0.01, orientation:"z"});
    var size = 1000;
    var divisions = 10;

    var gridHelper = new THREE.GridHelper( size, divisions );
    gridHelper.rotation.x = - Math.PI / 2;
    scene.add( gridHelper );
  }

  if (axes) {
    // var axisHelper = new THREE.AxisHelper( 300);
    // axisHelper.position.set( 0, 0, 0 );
    // scene.add( axisHelper );
    Coordinates.drawAllAxes(scene, {axisLength:700,axisRadius:2,axisTess:50});
  }

  //Coordinates.drawGround({size:1000});
  //Coordinates.drawGrid({size:1000,scale:0.01});
  //Coordinates.drawAllAxes({axisLength:500,axisRadius:1,axisTess:4});
}

function addToDOM() {
  var container = document.getElementById('container');
  var canvas = container.getElementsByTagName('canvas');
  if (canvas.length>0) {
    container.removeChild(canvas[0]);
  }
  container.appendChild( renderer.domElement );
}

function animate() {

  window.requestAnimationFrame( animate );
  render();

}

function render() {
  var delta = clock.getDelta();
  cameraControls.update(delta);
  if ( effectController.newGridX !== gridX || effectController.newGridY !== gridY || effectController.newGridZ !== gridZ || effectController.newGround !== ground || effectController.newAxes !== axes)
  {
    gridX = effectController.newGridX;
    gridY = effectController.newGridY;
    gridZ = effectController.newGridZ;
    ground = effectController.newGround;
    axes = effectController.newAxes;

    fillScene();
  }

  renderer.render( scene, camera );

}

  function setupGui() {

    effectController = {

      newGridX: gridX,
      newGridY: gridY,
      newGridZ: gridZ,
      newGround: ground,
      newAxes: axes,

      dummy: function() {
      }
    };

    var gui = new dat.GUI();
    gui.add(effectController, "newGridX").name("Show XZ grid");
    gui.add( effectController, "newGridY" ).name("Show YZ grid");
    gui.add( effectController, "newGridZ" ).name("Show XY grid");
    gui.add( effectController, "newGround" ).name("Show ground");
    gui.add( effectController, "newAxes" ).name("Show axes");
  }


  init();
  setupGui();
  fillScene();
  addToDOM();
  animate();
}
