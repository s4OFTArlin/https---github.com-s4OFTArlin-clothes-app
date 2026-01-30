<template>
  <div class="model-container" ref="container">
    <div v-if="loading" class="loading-mask">
      <div class="spinner"></div>
      <p>{{ loadingText }}</p>
    </div>
    
    <div class="data-overlay" v-show="!loading">
      <div class="tag top-left">身高: {{ params.height }}cm</div>
      <div class="tag top-right">体重: {{ params.weight }}kg</div>
      <div class="tag bottom-center">
        三围: {{ params.bust }} / {{ params.waist }} / {{ params.hips }}
      </div>
    </div>

    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const props = defineProps({
  params: {
    type: Object,
    required: true
  }
})

const container = ref(null)
const canvasRef = ref(null)
const loading = ref(true)
const loadingText = ref('加载 3D 引擎...')

let scene, camera, renderer, controls, animationId
let humanModel = null

const MODEL_NAME = 'human_base.glb';

const initThree = () => {
  const width = container.value.clientWidth
  const height = container.value.clientHeight

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xffffff) 

  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
  camera.position.set(0, 1.2, 3.5) 

  renderer = new THREE.WebGLRenderer({ 
    canvas: canvasRef.value, 
    antialias: true, 
    alpha: true 
  })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  
  scene.add(new THREE.AmbientLight(0xffffff, 0.9))
  const mainLight = new THREE.DirectionalLight(0xffffff, 0.6)
  mainLight.position.set(5, 10, 7)
  scene.add(mainLight)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.target.set(0, 1, 0)
  
  loadModelStandard();
}

/**
 * 核心逻辑：使用 XHR 兼容模式加载
 * 弃用 fetch，因为 App 不支持 file:// 协议的 fetch
 */
const loadModelStandard = () => {
  loadingText.value = "正在读取模型文件...";
  const loader = new GLTFLoader();
  
  // 针对 HBuilder 打包环境的相对路径处理
  // 这里必须使用相对路径，确保在打包后的 www 目录下能找到
  const modelUrl = `./${MODEL_NAME}`;

  // 使用 XMLHttpRequest 替代 Fetch，以支持本地 file 协议
  const xhr = new XMLHttpRequest();
  xhr.open('GET', modelUrl, true);
  xhr.responseType = 'blob'; // 关键：以 Blob 格式读取本地文件

  xhr.onload = function() {
    if (this.status === 200 || this.status === 0) {
      const blob = this.response;
      const url = URL.createObjectURL(blob); // 将本地文件转为 Blob URL
      
      loader.load(url, (gltf) => {
        humanModel = gltf.scene;
        humanModel.traverse((child) => {
          if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({
              color: 0xeeeeee,
              roughness: 0.4,
              metalness: 0.1
            });
          }
        });
        scene.add(humanModel);
        loading.value = false;
        updateBodyShape();
        animate();
        // 释放内存
        URL.revokeObjectURL(url);
      }, undefined, (error) => {
        console.error("GLTF 解析失败", error);
        loadingText.value = "模型解析失败";
      });
    }
  };

  xhr.onerror = () => {
    loadingText.value = "读取失败，请确认模型已放在 public 根目录";
    console.error("文件请求错误");
  };

  xhr.send();
}

const updateBodyShape = () => {
  if (!humanModel) return
  const BASE = { h: 165, b: 85, w: 60, hip: 90 }
  const p = props.params

  const heightScale = p.height / BASE.h
  const widthScale = (p.bust / BASE.b + p.hips / BASE.hip) / 2
  const depthScale = p.waist / BASE.w

  humanModel.scale.set(widthScale, heightScale, depthScale)
  humanModel.position.y = 0 
  if (renderer && scene && camera) renderer.render(scene, camera)
}

watch(() => props.params, () => {
  updateBodyShape()
}, { deep: true })

const animate = () => {
  animationId = requestAnimationFrame(animate)
  if (controls) controls.update()
  renderer.render(scene, camera)
}

onMounted(() => {
  initThree()
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', onResize)
  if (renderer) renderer.dispose()
})

const onResize = () => {
  if (!container.value) return
  const width = container.value.clientWidth
  const height = container.value.clientHeight
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}
</script>

<style scoped>
.model-container {
  width: 100%;
  height: 400px;
  position: relative;
  background-color: #ffffff;
  border-radius: 0 0 20px 20px;
  overflow: hidden;
}
.loading-mask {
  position: absolute; inset: 0; background: #ffffff;
  display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 10;
}
.spinner {
  width: 30px; height: 30px; border: 3px solid #f3f3f3;
  border-top-color: #ff4081; border-radius: 50%;
  animation: spin 1s linear infinite; margin-bottom: 10px;
}
@keyframes spin { to { transform: rotate(360deg); } }
.data-overlay { position: absolute; inset: 0; pointer-events: none; }
.tag {
  position: absolute; background: rgba(255, 255, 255, 0.8);
  padding: 4px 10px; border-radius: 12px; font-size: 10px; color: #666;
  border: 1px solid rgba(0,0,0,0.05);
}
.top-left { top: 15px; left: 15px; }
.top-right { top: 15px; right: 15px; }
.bottom-center { 
  bottom: 15px; left: 50%; transform: translateX(-50%); 
  background: #ff4081; color: #fff; font-weight: bold;
}
</style>