import * as THREE from "https://esm.sh/three@0.160.0";
import { OrbitControls } from "https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://esm.sh/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";

// Get DOM elements
const container = document.getElementById("viewer");
const nameEl = document.getElementById("artifact-name");
const yearEl = document.getElementById("artifact-year");
const descEl = document.getElementById("artifact-desc");
const cards = document.querySelectorAll(".artifact-card");

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('lightblue');

// Camera
const camera = new THREE.PerspectiveCamera(
  60,
  1,
  0.1,
  1000
);
camera.position.set(0, 1, 0.5);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
//renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// Controls ✅
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const light = new THREE.DirectionalLight(0xffffff, 0.8);
light.position.set(3, 5, 2);
scene.add(light);


const loader = new GLTFLoader();
let model = null;

// Resize
/*function resizeRenderer() {
  const style = getComputedStyle(container);
  const width = container.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
  const height = container.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
  //const width = container.clientWidth;
  //const height = container.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}
*/

function resizeRenderer(containerEl) {
  const width = containerEl.clientWidth;
  const height = containerEl.clientHeight;

  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

resizeRenderer(container);

/*window.addEventListener("resize", resizeRenderer);
resizeRenderer();*/

window.addEventListener("resize", () => {
  const target = modal.classList.contains("hidden")
    ? container
    : modalViewer;

  resizeRenderer(target);
});

// Load model
/*let model;
const loader = new GLTFLoader();
loader.load(
  "3DModel.glb",
  (gltf) => {
    model = gltf.scene;
    scene.add(model);
  },
  undefined,
  (error) => console.error(error)
);*/

// Arrow key movement
const keys = {};
window.addEventListener("keydown", (e) => keys[e.key] = true);
window.addEventListener("keyup", (e) => keys[e.key] = false);

// Resize
/*window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});*/

// Animate
function animate() {
  requestAnimationFrame(animate);

  /*if (model) {
    const step = 0.05;
    if (keys["ArrowUp"]) model.position.z -= step;
    if (keys["ArrowDown"]) model.position.z += step;
    if (keys["ArrowLeft"]) model.position.x -= step;
    if (keys["ArrowRight"]) model.position.x += step;
  }*/

  controls.update();
  renderer.render(scene, camera);
}
animate();

// Handle artifact card clicks
cards.forEach(card => {
  card.addEventListener("click", () => {
    const modelPath = card.dataset.model;
    const name = card.dataset.name;
    const year = card.dataset.year;
    const desc = card.dataset.desc;

    container.classList.add("visible");
    resizeRenderer(container);

    // Update info
    nameEl.textContent = name;
    yearEl.textContent = year;
    descEl.textContent = desc;

    // Remove previous model
    if (model) scene.remove(model);

    // Load new model
    loader.load(
      modelPath,
      gltf => {
        model = gltf.scene;
        scene.add(model);
      },
      undefined,
      error => console.error(error)
    );
  });
});

//Modal Section
const expandBtn = document.getElementById("expandBtn");
const modal = document.getElementById("viewerModal");
const modalViewer = document.getElementById("modalViewer");
const normalViewer = document.getElementById("viewer");

expandBtn.addEventListener("click", () => {
  modal.classList.remove("hidden");
  modalViewer.appendChild(renderer.domElement);

  renderer.setSize(
    modalViewer.clientWidth,
    modalViewer.clientHeight
  );

  camera.aspect =
    modalViewer.clientWidth / modalViewer.clientHeight;
  camera.updateProjectionMatrix();
});

document.getElementById("closeModal").addEventListener("click", () => {
  modal.classList.add("hidden");
  normalViewer.appendChild(renderer.domElement);

  renderer.setSize(
    normalViewer.clientWidth,
    normalViewer.clientHeight
  );

  camera.aspect =
    normalViewer.clientWidth / normalViewer.clientHeight;
  camera.updateProjectionMatrix();
});
