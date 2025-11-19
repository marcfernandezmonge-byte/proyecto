  import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.module.js';
  import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.155.0/examples/jsm/loaders/GLTFLoader.js';

  const container = document.getElementById('threeD-container');
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0f1c2e);

  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(0, 2, 5);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 10, 7.5);
  scene.add(directionalLight);

  const loader = new GLTFLoader();
  loader.load('Modelos3D/coche.glb', function (gltf) {
    const model = gltf.scene;
    model.scale.set(1.5, 1.5, 1.5);
    scene.add(model);
  }, undefined, function (error) {
    console.error('Error al cargar el modelo:', error);
  });

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();