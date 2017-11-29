/**
 * Created by shrem on 11/14/17.
 */
// function blog_meshMaterial() {
  var camera, scene, renderer;
  var cameraControls;

  var clock = new THREE.Clock();

  function fillScene() {
    scene = new THREE.Scene();

    // var pointLight = new THREE.PointLight( 0xFFFFFF, 2);
    // pointLight.position.set( 200, 250, 600 );
    // pointLight.castShadow = true;
    // scene.add( pointLight );

    var spotLight = new THREE.SpotLight( 0xFFFFFF, 2);
    spotLight.position.set( 200, 250, 600 );
    spotLight.target.position.set( 100, -50, 0 );
    spotLight.castShadow = true;
    scene.add( spotLight.target );
    scene.add( spotLight );
    //Set up shadow properties for the spotLight
    spotLight.shadow.mapSize.width = 512;  // default
    spotLight.shadow.mapSize.height = 512; // default
    spotLight.shadow.camera.near = 0.5;    // default
    spotLight.shadow.camera.far = 15000;     // default


    // var directionalLight = new THREE.DirectionalLight( 0xFFFFFF, 1 );
    // directionalLight.position.set( 100, 350, 250 );
    // directionalLight.castShadow = true;
    // scene.add( directionalLight );

    var ambientLight = new THREE.AmbientLight( 0x404040 );
    scene.add(ambientLight);

    // var helper = new THREE.CameraHelper( spotLight.shadow.camera );
    // scene.add( helper );

    // var faceMaterial = new THREE.MeshBasicMaterial( { color: 0x0087E6, opacity: 0.7, transparent: false , wireframe: false} );
    // var faceMaterial = new THREE.MeshLambertMaterial( { color: 0x0087E6, opacity: 0.7, transparent: false, wireframe: false} );
    // var faceMaterial = new THREE.MeshPhongMaterial( { color: 0x0087E6, opacity: 0.7, transparent: false, wireframe: false, shininess: 100 } );
    // var faceMaterial = new THREE.MeshStandardMaterial( { color: 0x0087E6, opacity: 0.7, transparent: false, wireframe: false} );
    // var faceMaterial = new THREE.MeshStandardMaterial( { color: 0x0087E6} );
    // var faceMaterial = new THREE.MeshBasicMaterial( { wireframe: true} );

    // var crateTxr = new THREE.TextureLoader().load('media/img/textures/crate.gif');
    var crateTxr = new THREE.TextureLoader().load('img/textures/ash_uvgrid01.jpg');
    // var crateTxr = new THREE.TextureLoader().load('media/img/textures/checkerBW512x512.jpg');
    // var crateTxr = new THREE.TextureLoader().load('media/img/textures/checker1024x1024.jpg');
    var faceMaterial = new THREE.MeshBasicMaterial( { map: crateTxr } );



    // front
    var torus = new THREE.Mesh(new THREE.TorusBufferGeometry(50,10, 16, 64), faceMaterial );
    torus.position.set(0, 50, 250);
    torus.rotation.x = -90 * Math.PI/180;
    castShadow(torus);
    scene.add( torus );

    // first row
    var cylinder2 = new THREE.Mesh(new THREE.CylinderGeometry( 50, 50, 100, 32 ), faceMaterial );
    cylinder2.position.set(300, 50, 0);
    castShadow(cylinder2);
    scene.add( cylinder2 );

    var cylinder = new THREE.Mesh(new THREE.CylinderGeometry( 0, 50, 100, 64 ), faceMaterial );
    cylinder.position.set(150, 50, 0);
    castShadow(cylinder);
    scene.add( cylinder );

    var cube = new THREE.Mesh(new THREE.CubeGeometry( 100, 100, 100 ), faceMaterial );
    cube.position.y = 50;
    castShadow(cube);
    scene.add( cube );

    var sphere = new THREE.Mesh(new THREE.SphereGeometry( 50, 32, 16 ), faceMaterial );
    sphere.position.set(-150, 50, 0);
    castShadow(sphere);
    scene.add( sphere );

    var octahedron2 = new THREE.Mesh(new THREE.OctahedronGeometry(50, 2), faceMaterial );
    octahedron2.position.set(-300, 50, 0);
    castShadow(octahedron2);
    scene.add( octahedron2 );

    // Second line
    var cone = new THREE.Mesh(new THREE.ConeGeometry( 50, 100, 3 ), faceMaterial );
    cone.position.set(450, 50, -350);
    cone.rotation.y = -45 * Math.PI/180;
    castShadow(cone);
    scene.add( cone );

    var cylinder3 = new THREE.Mesh(new THREE.CylinderGeometry( 0, 50, 100, 4 ), faceMaterial );
    cylinder3.position.set(250, 50, -350);
    cylinder3.rotation.y = -45 * Math.PI/180;
    castShadow(cylinder3);
    scene.add( cylinder3 );

    var dodecahedron = new THREE.Mesh(new THREE.DodecahedronGeometry(50), faceMaterial );
    dodecahedron.position.set(50, 50, -350);
    castShadow(dodecahedron);
    scene.add( dodecahedron );

    var icosahedron = new THREE.Mesh(new THREE.IcosahedronGeometry(50), faceMaterial );
    icosahedron.position.set(-150, 50, -350);
    castShadow(icosahedron);
    scene.add( icosahedron );

    var octahedron = new THREE.Mesh(new THREE.OctahedronGeometry(50), faceMaterial );
    octahedron.position.set(-350, 50, -350);
    castShadow(octahedron);
    scene.add( octahedron );

    // Create a plane that receives shadows (but does not cast them)
    var planeGeometry = new THREE.PlaneBufferGeometry( 10000, 10000, 32, 32 );
    var planeMaterial = new THREE.MeshLambertMaterial( { color: 0xb69a77, side: THREE.DoubleSide } );
    // var planeMaterial = new THREE.MeshStandardMaterial( { color: 0xb69a77, side: THREE.DoubleSide, roughness: 0.5 } );
    var plane = new THREE.Mesh( planeGeometry, planeMaterial );
    plane.receiveShadow = true;
    plane.rotation.x = - Math.PI / 2;
    plane.position.y = -1;
    scene.add( plane );
    // Coordinates.drawGround(scene, {size:10000, color:0xb69a77});
    // Coordinates.drawAllAxes(scene, {axisLength: 200, axisRadius: 1, axisTess: 50});
    // LIGHTS
  }

  function castShadow(obj){
    obj.traverse( function ( object ) {
      if ( object instanceof THREE.Mesh ) {
        object.castShadow = true;
        // object.receiveShadow = true;
      }
    } );
  }

  function init() {

    var canvasRatio = 4 / 3;
    var canvasWidth = 900;
    var canvasHeight = canvasWidth/ canvasRatio;
    // For grading the window is fixed in size; here's general code:
    //var canvasWidth = window.innerWidth;
    //var canvasHeight = window.innerHeight;
    // var canvasRatio = canvasWidth / canvasHeight;


    // RENDERER
    renderer = new THREE.WebGLRenderer( { antialias: true, preserveDrawingBuffer: true } );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.setSize(canvasWidth, canvasHeight);
    // // renderer.setClearColor( 0xAAAAAA, 1.0 );
    renderer.setClearColor( 0x66ccff, 1.0 );

    // CAMERA
    camera = new THREE.PerspectiveCamera( 75, canvasRatio, 0.1, 4000 );
    camera.position.set( -150, 400, 350 );
    // CONTROLS
    cameraControls = new THREE.OrbitControls(camera);
    cameraControls.target.set(-25, -50, 0);
    cameraControls.update();
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
    window.requestAnimationFrame(animate);
    render();
  }

  function render() {
    var delta = clock.getDelta();
    cameraControls.update(delta);

    // cameraControls.update();
    renderer.render(scene, camera);
  }

  init();
  fillScene();
  addToDOM();
  animate();

// }
