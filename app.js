let door;
let camera;
let scene;
let renderer;
let light;

let handle;
let bolts;

let handleDOM;

let dragState = false;
let dragPos = 0;
let currentMarginLeft = 0;

function init() {
    door = document.querySelector('.door');
    handleDOM = document.querySelector('.handle');
    scene =  new THREE.Scene();

    const fov = 35;
    const aspect = door.clientWidth / door.clientHeight;
    const near = 0.1;
    const far = 500;

    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 0.5, 28);

    const ambient = new THREE.AmbientLight(0xaaaaaa, 4);
    scene.add(ambient);

    light = new THREE.DirectionalLight(`hsl(0, 0%, 90%)`, 6);
    light.position.set(10, 2, 5);
    scene.add(light);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(door.clientWidth, door.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    door.appendChild(renderer.domElement);

    let loader = new THREE.GLTFLoader();
    loader.load('./3D/open.glb', function(gltf) {
        scene.add(gltf.scene);
        handle = gltf.scene.children[0];
        bolts = gltf.scene.children[1];
        animate();
    });
}

function animate () {
    camera.aspect = door.clientWidth / door.clientHeight;
    camera.updateProjectionMatrix();

    handle.position.x = -(door.clientWidth / 90);
    bolts.position.x = -(door.clientWidth / 90);
    
    renderer.setSize(door.clientWidth, door.clientHeight);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

init();

handleDOM.addEventListener('mousedown', e => {
    console.log(e);
    dragPos = e.clientX;
    dragState = true;
    return;
});

window.addEventListener('mouseup', e => {
    if (dragState) {
        dragState = false;
        currentMarginLeft = +(door.style.marginLeft.replace('px', ''));
    }
    return;
});

window.addEventListener('mousemove', e => {
    if (dragState) {
        if ((currentMarginLeft + e.clientX - dragPos) >= 0 && 
            (currentMarginLeft + e.clientX - dragPos) < door.clientWidth - 100) {
            door.style.marginLeft = (currentMarginLeft + e.clientX - dragPos) + 'px';

            bolts.rotation.y = -(e.clientX - dragPos) / 50;
        }
    }
    return;
});

