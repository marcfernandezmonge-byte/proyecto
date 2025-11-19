// Importamos Three.js y GLTFLoader desde CDN
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.155.0/examples/jsm/loaders/GLTFLoader.js";
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

// Cargamos un modelo GLTF (ejemplo: coche.glb en tu carpeta)
const loader = new GLTFLoader();
loader.load(
  "./Modelos3D/coche.glb", // <-- cambia esto por la ruta real de tu modelo
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

// Ajuste al redimensionar ventana
window.addEventListener("resize", () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});
