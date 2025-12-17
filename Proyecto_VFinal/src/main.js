// Importamos Three.js y loaders
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

// Seleccionamos el contenedor
const container = document.getElementById("threeD-container");

// Creamos la escena
const scene = new THREE.Scene();

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
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputEncoding = THREE.sRGBEncoding;
container.appendChild(renderer.domElement);

// Controles
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minPolarAngle = Math.PI / 4;
controls.maxPolarAngle = Math.PI / 2;
controls.minDistance = 10;
controls.maxDistance = 40;

// Luz
const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
scene.add(light);

// Loader GLTF
const loader = new GLTFLoader();

// Loader HDRI
const rgbeLoader = new RGBELoader();

// Rutas HDRI por color (sin /public/)
const fondosHDR = {
  azul: '/images/minedump_flats_4k.hdr',
  rojo: '/images/fondo.exr',
  verde: '/images/minedump_flats_4k.hdr'
};

// Función para cambiar el fondo HDRI
function cambiarHDRI(ruta) {
  rgbeLoader.load(
    ruta,
    (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.background = texture;
      scene.environment = texture;
    },
    undefined,
    (err) => {
      console.error("Error cargando HDRI:", err);
    }
  );
}

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
  A: 0,
  B: 1499.99,
};

// Variables de estado
let colorSeleccionado = "azul";
let ruedaSeleccionada = "A";
let modeloActual = null;

// Función para cargar el modelo correcto
function cargarModelo(color, rueda) {
  const ruta = `/models/coche_${color}_${rueda}.glb`;

  if (modeloActual) {
    scene.remove(modeloActual);
  }

  loader.load(
    ruta,
    (gltf) => {
      modeloActual = gltf.scene;
      scene.add(modeloActual);
    },
    undefined,
    (error) => {
      console.error("Error cargando modelo:", error);
    }
  );
}

// =====================
// ACTUALIZAR PRECIO Y CONTRIBUCIÓN
// =====================
function actualizarPrecio() {
  const total = precioBase + preciosColores[colorSeleccionado] + preciosRuedas[ruedaSeleccionada];

  const valorFooter = document.querySelector(".footer-financiero .dato .valor");
  valorFooter.textContent = total.toLocaleString("es-ES", { style: "currency", currency: "EUR" });

  const contribucion = total * 0.01;
  const contribucionFooter = document.querySelectorAll(".footer-financiero .dato .valor")[1];
  contribucionFooter.textContent = contribucion.toLocaleString("es-ES", { style: "currency", currency: "EUR" }) + "/año";
}

// Carga inicial
cargarModelo(colorSeleccionado, ruedaSeleccionada);
actualizarPrecio();
cambiarHDRI(fondosHDR.azul);

// Eventos de botones de color
document.querySelector(".color1").addEventListener("click", () => {
  colorSeleccionado = "azul";
  cargarModelo(colorSeleccionado, ruedaSeleccionada);
  actualizarPrecio();
  document.body.style.background = getComputedStyle(document.documentElement).getPropertyValue("--fondo-azul");
  cambiarHDRI(fondosHDR.azul);
});

document.querySelector(".color2").addEventListener("click", () => {
  colorSeleccionado = "rojo";
  cargarModelo(colorSeleccionado, ruedaSeleccionada);
  actualizarPrecio();
  document.body.style.background = getComputedStyle(document.documentElement).getPropertyValue("--fondo-rojo");
  cambiarHDRI(fondosHDR.rojo);
});

document.querySelector(".color3").addEventListener("click", () => {
  colorSeleccionado = "verde";
  cargarModelo(colorSeleccionado, ruedaSeleccionada);
  actualizarPrecio();
  document.body.style.background = getComputedStyle(document.documentElement).getPropertyValue("--fondo-verde");
  cambiarHDRI(fondosHDR.verde);
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
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Resize
window.addEventListener("resize", () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});
