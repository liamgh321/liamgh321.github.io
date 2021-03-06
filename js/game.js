//sets up the three.js scene
var scene = new THREE.Scene();
scene.background = new THREE.Color(0x85a5ff);
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.z = 650;
camera.position.y = 500;
camera.rotation.x = -0.3;
//camera.rotation.x = 100;

//sets up the renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//adds an event listener so that when the window is resized the scene resized with it
window.addEventListener('resize', function()
{
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

//VARIABLES
var not_allowed = [];
var moveUp = false;
var moveLeft;
var moveRight = false;
var moveDown = false;

//controls = new THREE.OrbitControls(camera, renderer.domElement); //sets up the three.js orbit controls

//SETTING UP A LIGHT
//  creates a directional light
const light = new THREE.DirectionalLight( 0xffffff, 5.0);
//  positions the light
var lightX = 100;
var lightY = 1000;
light.position.set(lightX, lightY);
//  adds light to scene
scene.add(light);


//SHAPES
//adds a small box that helps me visualize where my light is coming from
var sun_mat = new THREE.MeshBasicMaterial( {color: 0xffff00} );
var sun_mesh = new THREE.CubeGeometry(50, 50, 50);
var sun = new THREE.Mesh(sun_mesh, sun_mat);
sun.position.set(lightX, lightY);
scene.add(sun);


//scenery used to help players realize they are moving
/*var geometry = new THREE.CubeGeometry(50,50,50);
var material = new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } );

for ( var i = 0; i < 100; i ++ ) 
{
    var mesh = new THREE.Mesh( geometry, material );
    mesh.position.x = Math.random() * 5000 - 2500;
    mesh.position.y = 0;
    mesh.position.z = Math.random() * 5000 - 2500;
    mesh.updateMatrix();
    mesh.matrixAutoUpdate = false;
    scene.add( mesh );
}*/

//collide cube
var cube_mat = new THREE.MeshStandardMaterial( {color: 0xff0000} );
var cube_mesh = new THREE.CubeGeometry(100, 100, 100);
var cube = new THREE.Mesh(cube_mesh, cube_mat);
cube.position.set(500, 50, 0);
scene.add(cube);

not_allowed.push(cube);

//ground
var ground_mat = new THREE.MeshStandardMaterial( {color: 0x00ff00} );
var ground_mesh = new THREE.CubeGeometry(10000, 10, 10000);
var ground = new THREE.Mesh(ground_mesh, ground_mat);
ground.position.set(0, -30, 0);
scene.add(ground);

//marker
var marker_mat = new THREE.MeshStandardMaterial( {color: 0x000000, wireframe: true} );
var marker_mesh = new THREE.CubeGeometry(359, 380, 196);
var marker = new THREE.Mesh(marker_mesh, marker_mat);
scene.add(marker);

//body/torso
var body_mat = new THREE.MeshStandardMaterial( {color: 0xc70000} );
var body_mesh = new THREE.SphereGeometry(100);   
var body = new THREE.Mesh(body_mesh, body_mat);

//head
var head_mat = new THREE.MeshStandardMaterial( {color: 0xf2e2b6} ); //material for head
var head_mesh = new THREE.SphereGeometry(50, 0, 0); //mesh for head
var head = new THREE.Mesh(head_mesh, head_mat);
head.position.set(0, 140, 0);

// right hand
var hand_mat =  new THREE.MeshStandardMaterial( {color: 0xf2e2b6} ); //this is the material for the hands
var hand_mesh = new THREE.SphereGeometry(30, 0, 0); //this is the mesh for the hands
var right_hand = new THREE.Mesh(hand_mesh, hand_mat);
right_hand.position.set(-150, 0,0);

// left hand, check right hand for material and mesh
var left_hand = new THREE.Mesh(hand_mesh, hand_mat);
left_hand.position.set(150, 0, 0);

//right leg
var leg_mat = new THREE.MeshStandardMaterial( {color: 0x0044ff} ); //material for legs
var leg_mesh = new THREE.SphereGeometry(40, 0, 0); //mesh for legs
var right_leg = new THREE.Mesh(leg_mesh, leg_mat);
right_leg.position.set(60, -140, 0);

//left leg
var left_leg = new THREE.Mesh(leg_mesh, leg_mat);
left_leg.position.set(-60, -140, 0);
//scene.add(left_leg);

//groups all the shapes for the avatar together
group = new THREE.Object3D();
group.add(body);
group.add(head);
group.add(right_hand);
group.add(left_hand);
group.add(right_leg);
group.add(left_leg);
scene.add(group); //adds them all to the scene
group.position.y += 150;

//enables keyboard controls
document.addEventListener('keydown', function(event)
{
    var code = event.keyCode;

    var speed = 10;
    if(code == 37 || code == 65)
    { // left
        group.position.x -= speed;
        camera.position.x -= speed;
        //marker.position.x -= speed;

        group.rotation.set(0, -1.5, 0)

        moveLeft = true;
    }
    if (code == 38 || code == 87)
    { // up
        group.position.z -= speed;
        camera.position.z -= speed;
        //marker.position.z -= speed;

        group.rotation.set(0, 0, 0)

        moveUp = true;
    }
    if (code == 39 || code == 68) 
    { // right
        group.position.x += speed;
        camera.position.x += speed;
        //marker.position.x += speed;

        group.rotation.set(0, 1.5, 0)

        moveRight = true;
    }
    if (code == 40 || code == 83) 
    { // down
        group.position.z += speed;
        camera.position.z += speed;
        //marker.position.z += speed;
        
        group.rotation.set(0, 0, 0)

        moveDown = true;
    }


    //if the player is hitting a non-allowed area
    if (detectCollisions())
    {
        if (moveLeft == true)
        {
            marker.position.x += speed;
            marker.position.Y += 50;
        }
        /*if (moveRight)
        {
            group.position.x -= speed;
        }
        if(moveUp)
        {  
            group.position.z += speed;
        }
        if ()
        {
            group.position.z -= speed;
        }*/
    }
});


//figures out if the player moved into a collidable object
function detectCollisions() 
{
    var vector = new THREE.Vector3(0, -1, 0);
    var ray = new THREE.Ray(marker.position, vector);
    var intersects = ray.intersectObjects(not_allowed);
    if (intersects.length > 0) 
    {
        return true;
    }
    return false;
  }

//game logic
var update = function ()
{
    sun.rotation.y += 0.01;
    sun.rotation.x += 0.01;
    marker.position.x = group.position.x;
    marker.position.y = group.position.y;
    marker.position.z= group.position.z;
    marker.rotation.y = group.rotation.y;

   //console.log(not_allowed);
};

//draw scene
var render = function ()
{
    renderer.render(scene, camera);
};

//run GameLoop (update, render, repeat)
var GameLoop = function (now)
{
    requestAnimationFrame(GameLoop);

    update();
    render();
};

GameLoop();