// Importamos Three.js y GLTFLoader desde CDN
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// Seleccionamos el contenedor
const container = document.getElementById("threeD-container");

// Creamos la escena
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);

// Cámara
const camera = new THREE.PerspectiveCamera(
  75,
  container.clientWidth / container.clientHeight,
  0.1,
  1000
);
camera.position.set(0, 2, 5);

// Renderizador
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Luz
const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
scene.add(light);

// Loader GLTF
const loader = new GLTFLoader();
loader.load(
  "/models/coche.glb", // <-- ruta correcta en Vite
  function (gltf) {
    scene.add(gltf.scene);
  },
  undefined,
  function (error) {
    console.error("Error cargando modelo:", error);
  }
);

// Animación
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// Resize
window.addEventListener("resize", () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});
