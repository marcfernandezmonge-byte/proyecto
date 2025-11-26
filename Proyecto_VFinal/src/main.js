// Importamos Three.js y GLTFLoader desde CDN
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Seleccionamos el contenedor
const container = document.getElementById("threeD-container");

// Creamos la escena
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);
/*const rutaCocheAzulA ="";
const rutaCocheRojoA ="";
const rutaCocheVerdeA ="";
const rutaCocheAzulB ="";
const rutaCocheRojoB ="";
const rutaCocheVerdeB ="";
*/

// Cámara
const camera = new THREE.PerspectiveCamera(
  75,
  container.clientWidth / container.clientHeight,
  0.1,
  1000
);
camera.position.set(0, 8, 25);

// Renderizador
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

controls.minPolarAngle = Math.PI / 4;   // 45° arriba
controls.maxPolarAngle = Math.PI / 2;   // 90° horizontal

// Opcional: limita zoom
controls.minDistance = 10;
controls.maxDistance = 40;
// Luz
const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
scene.add(light);

// Loader GLTF
const loader = new GLTFLoader();

// Variables de estado
let colorSeleccionado = "azul"; // azul, rojo, verde
let ruedaSeleccionada = "A";    // A = urbana, B = todoterreno
let modeloActual ="/models/rutaCocheAzulA";

// Función para cargar el modelo correcto
function cargarModelo(color, rueda) {
  const ruta = `/models/coche_${color}_${rueda}.glb`;

  // Eliminar modelo anterior si existe
  if (modeloActual) {
    scene.remove(modeloActual);
  }

  loader.load(
    ruta,
    function (gltf) {
      modeloActual = gltf.scene;
      scene.add(modeloActual);
    },
    undefined,
    function (error) {
      console.error("Error cargando modelo:", error);
    }
  );
}

// Carga inicial
cargarModelo(colorSeleccionado, ruedaSeleccionada);

// Eventos de botones de color
document.querySelector(".color1").addEventListener("click", () => {
  colorSeleccionado = "azul";
  cargarModelo(colorSeleccionado, ruedaSeleccionada);
});
document.querySelector(".color2").addEventListener("click", () => {
  colorSeleccionado = "rojo";
  cargarModelo(colorSeleccionado, ruedaSeleccionada);
});
document.querySelector(".color3").addEventListener("click", () => {
  colorSeleccionado = "verde";
  cargarModelo(colorSeleccionado, ruedaSeleccionada);
});

// Eventos de botones de rueda
document.querySelector(".rueda1").addEventListener("click", () => {
  ruedaSeleccionada = "A";
  cargarModelo(colorSeleccionado, ruedaSeleccionada);
});
document.querySelector(".rueda2").addEventListener("click", () => {
  ruedaSeleccionada = "B";
  cargarModelo(colorSeleccionado, ruedaSeleccionada);
});

// Animación
function animate() {
  requestAnimationFrame(animate);
  controls.update(); // ← necesario para damping
  renderer.render(scene, camera);
}
animate();

// Resize
window.addEventListener("resize", () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});
