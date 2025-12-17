// Importamos Three.js y GLTFLoader desde CDN
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

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

// =====================
// PRECIOS
// =====================
let precioBase = 120260.00;

const preciosColores = {
  azul: 0,
  rojo: 399.99,
  verde: 599.99,
};

const preciosRuedas = {
  A: 0,       // urbana
  B: 1499.99, // todoterreno
};

// Variables de estado
let colorSeleccionado = "azul"; 
let ruedaSeleccionada = "A";    
let modeloActual = null;

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

// =====================
// ACTUALIZAR PRECIO Y CONTRIBUCIÓN
// =====================
function actualizarPrecio() {
  const total = precioBase + preciosColores[colorSeleccionado] + preciosRuedas[ruedaSeleccionada];
  
  // Actualizar presupuesto estimado
  const valorFooter = document.querySelector(".footer-financiero .dato .valor");
  valorFooter.textContent = total.toLocaleString("es-ES", { style: "currency", currency: "EUR" });

  // Calcular contribución anual (1% del total)
  const contribucion = total * 0.01;
  const contribucionFooter = document.querySelectorAll(".footer-financiero .dato .valor")[1];
  contribucionFooter.textContent = contribucion.toLocaleString("es-ES", { style: "currency", currency: "EUR" }) + "/año";
}

// Carga inicial
cargarModelo(colorSeleccionado, ruedaSeleccionada);
actualizarPrecio();

// Eventos de botones de color
document.querySelector(".color1").addEventListener("click", () => {
  colorSeleccionado = "azul";
  cargarModelo(colorSeleccionado, ruedaSeleccionada);
  actualizarPrecio();
  document.body.style.background = getComputedStyle(document.documentElement) .getPropertyValue("--fondo-azul");
});
document.querySelector(".color2").addEventListener("click", () => {
  colorSeleccionado = "rojo";
  cargarModelo(colorSeleccionado, ruedaSeleccionada);
  actualizarPrecio();
  document.body.style.background = getComputedStyle(document.documentElement) .getPropertyValue("--fondo-rojo");
});
document.querySelector(".color3").addEventListener("click", () => {
  colorSeleccionado = "verde";
  cargarModelo(colorSeleccionado, ruedaSeleccionada);
  actualizarPrecio();
  document.body.style.background = getComputedStyle(document.documentElement) .getPropertyValue("--fondo-verde");
});

// Eventos de botones de rueda
document.querySelector(".rueda1").addEventListener("click", () => {
  ruedaSeleccionada = "A";
  cargarModelo(colorSeleccionado, ruedaSeleccionada);
  actualizarPrecio();
});
document.querySelector(".rueda2").addEventListener("click", () => {
  ruedaSeleccionada = "B";
  cargarModelo(colorSeleccionado, ruedaSeleccionada);
  actualizarPrecio();
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
