<template>
  <div class="model-container" ref="container">
    <div v-if="loading" class="loading-mask">
      <div class="spinner"></div>
      <p>{{ loadingText }}</p>
    </div>
    
    <div class="data-overlay" v-show="!loading">
      <div class="tag top-left">身高: {{ params.height }}cm</div>
      <div class="tag top-right">体重: {{ params.weight }}kg</div>
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
  params: Object,
  gender: String 
})

const container = ref(null)
const canvasRef = ref(null)
const loading = ref(true)
const loadingText = ref('加载中...')

let scene, camera, renderer, controls, animationId
let humanModel = null 

watch(() => props.gender, () => { loadModel() })
watch(() => props.params, () => { updateBodyShape() }, { deep: true })

const initThree = () => {
  if (!container.value) return
  const width = container.value.clientWidth
  const height = container.value.clientHeight
  
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xffffff)

  camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 10000)
  camera.position.set(0, 1.2, 3.5)

  renderer = new THREE.WebGLRenderer({ 
    canvas: canvasRef.value, 
    antialias: true, 
    alpha: true,
    preserveDrawingBuffer: true
  })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  scene.add(new THREE.AmbientLight(0xffffff, 1.2))
  const light = new THREE.DirectionalLight(0xffffff, 0.8)
  light.position.set(5, 10, 7)
  scene.add(light)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  
  loadModel()
}

// 核心：用最原始的 XHR 强制读取本地文件，避开 Fetch API 报错
const manualLoad = (url, onSuccess, onError) => {
  const xhr = new XMLHttpRequest()
  xhr.open('GET', url, true)
  xhr.responseType = 'arraybuffer'
  xhr.onload = function() {
    if (this.status === 200 || this.status === 0) {
      onSuccess(this.response)
    } else {
      onError('File not found')
    }
  }
  xhr.onerror = onError
  xhr.send()
}

const loadModel = () => {
  loading.value = true
  const isMale = props.gender === 'male'
  const fileName = isMale ? 'human_male.glb' : 'human_base.glb'
  const modelUrl = './' + fileName

  if (humanModel) {
    scene.remove(humanModel)
    humanModel = null
  }

  // 调用 XHR 加载
  manualLoad(modelUrl, (buffer) => {
    const loader = new GLTFLoader()
    loader.parse(buffer, '', (gltf) => {
      humanModel = gltf.scene

      // --- 暴力对齐逻辑 (保留你最初的所有逻辑) ---
      humanModel.updateMatrixWorld(true)
      const box = new THREE.Box3().setFromObject(humanModel)
      const size = box.getSize(new THREE.Vector3())

      if (isMale) {
        const targetH = 1.8
        const s = targetH / (size.y || 1)
        humanModel.scale.set(s, s, s)
        const newBox = new THREE.Box3().setFromObject(humanModel)
        const newCenter = newBox.getCenter(new THREE.Vector3())
        humanModel.position.x = -newCenter.x
        humanModel.position.z = -newCenter.z
        humanModel.position.y = -newBox.min.y
      } else {
        humanModel.position.set(0, 0, 0)
        humanModel.scale.set(1, 1, 1)
      }

      humanModel.traverse(child => {
        if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({ 
            color: 0xeeeeee, 
            side: THREE.DoubleSide 
          })
        }
      })

      scene.add(humanModel)
      const finalBox = new THREE.Box3().setFromObject(humanModel)
      const targetY = finalBox.getSize(new THREE.Vector3()).y / 2
      controls.target.set(0, targetY, 0)
      camera.position.set(0, targetY, 3.5)
      controls.update()

      loading.value = false
      updateBodyShape()
      animate()
    }, (err) => {
      loadingText.value = "模型解析失败"
    })
  }, (err) => {
    loadingText.value = "模型文件读取失败"
  })
}

const updateBodyShape = () => {
  if (!humanModel) return
  const isMale = props.gender === 'male'
  const BASE = isMale ? { h: 175, b: 95, w: 80, hip: 95 } : { h: 165, b: 85, w: 60, hip: 90 }
  const p = props.params
  const hScale = p.height / BASE.h
  const wScale = (p.bust / BASE.b + p.hips / BASE.hip) / 2
  const dScale = p.waist / BASE.w

  if (isMale) {
    const targetH = 1.8
    const currentSizeY = new THREE.Box3().setFromObject(humanModel).getSize(new THREE.Vector3()).y
    const ratio = targetH / (currentSizeY / humanModel.scale.y)
    humanModel.scale.set(ratio * wScale, ratio * hScale, ratio * dScale)
  } else {
    humanModel.scale.set(wScale, hScale, dScale)
  }
}

const animate = () => {
  animationId = requestAnimationFrame(animate)
  if (controls) controls.update()
  if (renderer && scene && camera) renderer.render(scene, camera)
}

onMounted(() => { initThree() })

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId)
  if (renderer) renderer.dispose()
})
</script>

<style scoped>
.model-container { width: 100%; height: 400px; position: relative; background: #fff; overflow: hidden; }
.loading-mask { position: absolute; inset: 0; background: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 10; }
.spinner { width: 30px; height: 30px; border: 3px solid #f3f3f3; border-top-color: #ff4081; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 10px; }
@keyframes spin { to { transform: rotate(360deg); } }
.data-overlay { position: absolute; inset: 0; pointer-events: none; }
.tag { position: absolute; background: rgba(255, 64, 129, 0.1); padding: 4px 10px; border-radius: 12px; font-size: 10px; color: #ff4081; border: 1px solid rgba(255, 64, 129, 0.2); }
.top-left { top: 15px; left: 15px; }
.top-right { top: 15px; right: 15px; }
</style>