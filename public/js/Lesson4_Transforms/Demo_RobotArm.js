////////////////////////////////////////////////////////////////////////////////

/*global THREE, Coordinates, document, window, dat*/
function lesson4_Demo_RobotArm() {
  var camera, scene, renderer;
  var cameraControls, effectController;
  var clock = new THREE.Clock();
  var gridX = true;
  var gridY = false;
  var gridZ = false;
  var axes = true;
  var ground = true;
  var arm, forearm;

  function fillScene() {
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x808080, 2000, 4000);

    // LIGHTS
    var ambientLight = new THREE.AmbientLight(0x222222);

    var light = new THREE.DirectionalLight(0xffffff, 1.0);
    light.position.set(200, 400, 500);

    var light2 = new THREE.DirectionalLight(0xffffff, 1.0);
    light2.position.set(-500, 250, -200);

    scene.add(ambientLight);
    scene.add(light);
    scene.add(light2);

    if (ground) {
      Coordinates.drawGround(scene, {size: 10000});
    }
    if (gridX) {
      Coordinates.drawGrid(scene, {size: 10000, scale: 0.01});
    }
    if (gridY) {
      Coordinates.drawGrid(scene, {size: 10000, scale: 0.01, orientation: "y"});
    }
    if (gridZ) {
      Coordinates.drawGrid(scene, {size: 10000, scale: 0.01, orientation: "z"});
    }
    if (axes) {
      Coordinates.drawAllAxes(scene, {axisLength: 200, axisRadius: 1, axisTess: 50});
    }

    var robotBaseMaterial = new THREE.MeshPhongMaterial({color: 0x6E23BB, specular: 0x6E23BB, shininess: 20});
    var robotForearmMaterial = new THREE.MeshPhongMaterial({color: 0xF4C154, specular: 0xF4C154, shininess: 100});
    var robotUpperArmMaterial = new THREE.MeshPhongMaterial({color: 0x95E4FB, specular: 0x95E4FB, shininess: 100});

    var torus = new THREE.Mesh(
      new THREE.TorusGeometry(22, 15, 32, 32), robotBaseMaterial);
    torus.rotation.x = 90 * Math.PI / 180;
    scene.add(torus);

    forearm = new THREE.Object3D();
    var faLength = 80;

    createRobotExtender(forearm, faLength, robotForearmMaterial);

    arm = new THREE.Object3D();
    var uaLength = 120;

    createRobotCrane(arm, uaLength, robotUpperArmMaterial);

    // Move the forearm itself to the end of the upper arm.
    forearm.position.y = uaLength;
    arm.add(forearm);

    scene.add(arm);
  }

  function createRobotExtender(part, length, material) {
    var cylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(22, 22, 6, 32), material);
    part.add(cylinder);

    var i;
    for (i = 0; i < 4; i++) {
      var box = new THREE.Mesh(
        new THREE.CubeGeometry(4, length, 4), material);
      box.position.x = (i < 2) ? -8 : 8;
      box.position.y = length / 2;
      box.position.z = (i % 2) ? -8 : 8;
      part.add(box);
    }

    cylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(15, 15, 40, 32), material);
    cylinder.rotation.x = 90 * Math.PI / 180;
    cylinder.position.y = length;
    part.add(cylinder);
  }

  function createRobotCrane(part, length, material) {
    var box = new THREE.Mesh(
      new THREE.CubeGeometry(18, length, 18), material);
    box.position.y = length / 2;
    part.add(box);

    var sphere = new THREE.Mesh(
      new THREE.SphereGeometry(20, 32, 16), material);
    // place sphere at end of arm
    sphere.position.y = length;
    part.add(sphere);
  }

  function init() {
    var canvasWidth = window.innerWidth;
    var canvasHeight = window.innerHeight;
    var canvasRatio = canvasWidth / canvasHeight;

    // RENDERER
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setClearColor(0xAAAAAA, 1.0);

    var container = document.getElementById('container');
    container.appendChild(renderer.domElement);

    // CAMERA
    camera = new THREE.PerspectiveCamera(30, canvasRatio, 1, 10000);
    camera.position.set(-510, 240, 100);
    // CONTROLS
    cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
    cameraControls.target.set(0, 100, 0);

    fillScene();

  }

  function animate() {
    window.requestAnimationFrame(animate);
    render();
  }

  function render() {
    var delta = clock.getDelta();
    cameraControls.update(delta);

    if (effectController.newGridX !== gridX || effectController.newGridY !== gridY || effectController.newGridZ !== gridZ || effectController.newGround !== ground || effectController.newAxes !== axes) {
      gridX = effectController.newGridX;
      gridY = effectController.newGridY;
      gridZ = effectController.newGridZ;
      ground = effectController.newGround;
      axes = effectController.newAxes;

      fillScene();
    }

    arm.rotation.y = effectController.uy * Math.PI / 180;	// yaw
    arm.rotation.z = effectController.uz * Math.PI / 180;	// roll

    forearm.rotation.y = effectController.fy * Math.PI / 180;	// yaw
    forearm.rotation.z = effectController.fz * Math.PI / 180;	// roll

    renderer.render(scene, camera);
  }


  function setupGui() {

    effectController = {

      newGridX: gridX,
      newGridY: gridY,
      newGridZ: gridZ,
      newGround: ground,
      newAxes: axes,

      uy: 70.0,
      uz: -15.0,

      fy: 10.0,
      fz: 60.0
    };

    var gui = new dat.GUI();
    var h = gui.addFolder("Grid display");
    h.add(effectController, "newGridX").name("Show XZ grid");
    h.add(effectController, "newGridY").name("Show YZ grid");
    h.add(effectController, "newGridZ").name("Show XY grid");
    h.add(effectController, "newGround").name("Show ground");
    h.add(effectController, "newAxes").name("Show axes");
    h = gui.addFolder("Arm angles");
    h.add(effectController, "uy", -180.0, 180.0, 0.025).name("Upper arm y");
    h.add(effectController, "uz", -45.0, 45.0, 0.025).name("Upper arm z");
    h.add(effectController, "fy", -180.0, 180.0, 0.025).name("Forearm y");
    h.add(effectController, "fz", -120.0, 120.0, 0.025).name("Forearm z");
  }

  init();
  setupGui();
  animate();
}