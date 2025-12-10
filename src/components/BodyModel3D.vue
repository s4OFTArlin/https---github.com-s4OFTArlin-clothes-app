<template>
  <div class="model-container" ref="container">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-mask">
      <div class="spinner"></div>
      <p>模型加载中 {{ progress }}%</p>
    </div>
    
    <!-- 数据浮层 -->
    <div class="data-overlay" v-show="!loading">
      <div class="tag top-left">H: {{ params.height }}cm</div>
      <div class="tag top-right">W: {{ params.weight }}kg</div>
      <div class="tag bottom-center">
        三围: {{ params.bust }} / {{ params.waist }} / {{ params.hips }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, toRefs } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const props = defineProps({
  params: {
    type: Object,
    required: true,
    default: () => ({ height: 165, weight: 50, bust: 85, waist: 60, hips: 90 })
  }
})

const { params } = toRefs(props)
const container = ref(null)
const loading = ref(true)
const progress = ref(0)

// Three.js 变量
let scene, camera, renderer, controls, animationId
let modelRoot
// 存储骨骼引用
let bones = {
  root: null,  // 整体
  spine: null, // 腰
  chest: null, // 胸
  hips: null,  // 臀
  legs: [],
  arms: []
}

// ⚠️ 模型地址：这里使用 Three.js 官方示例模型作为演示
// 实际开发中，请把你的 .glb 文件放在 public 文件夹下，例如 '/models/female.glb'
const MODEL_URL = 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/Xbot.glb'

const initThree = () => {
  const width = container.value.clientWidth
  const height = container.value.clientHeight

  // 1. 场景
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf5f5f5)
  // 添加雾化效果，让脚部与背景融合
  scene.fog = new THREE.Fog(0xf5f5f5, 3, 10)

  // 2. 相机
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
  camera.position.set(0, 1.2, 3.5) // 调整相机位置平视模型

  // 3. 渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.shadowMap.enabled = true // 开启阴影
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.2
  container.value.appendChild(renderer.domElement)

  // 4. 控制器 (允许用户旋转查看)
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.target.set(0, 1, 0) // 旋转中心在腰部
  controls.enablePan = false
  controls.minDistance = 2
  controls.maxDistance = 5

  // 5. 灯光 (影棚光照)
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6)
  scene.add(hemiLight)

  const dirLight = new THREE.DirectionalLight(0xffffff, 1)
  dirLight.position.set(3, 5, 5)
  dirLight.castShadow = true
  scene.add(dirLight)
  
  // 补光
  const backLight = new THREE.DirectionalLight(0xffc1e3, 0.5) // 粉色背光
  backLight.position.set(-3, 2, -3)
  scene.add(backLight)

  // 6. 地面网格 (可选)
  const grid = new THREE.GridHelper(10, 10, 0x000000, 0x000000)
  grid.material.opacity = 0.1
  grid.material.transparent = true
  scene.add(grid)

  // 7. 加载模型
  loadModel()
}

const loadModel = () => {
  const loader = new GLTFLoader()
  
  loader.load(MODEL_URL, (gltf) => {
    modelRoot = gltf.scene
    
    // 遍历模型，寻找骨骼并修改材质
    modelRoot.traverse((object) => {
      if (object.isMesh) {
        object.castShadow = true
        object.receiveShadow = true
        // 替换为好看的时尚材质
        object.material = new THREE.MeshPhysicalMaterial({
          color: 0xffffff, // 纯白素模
          metalness: 0.2,
          roughness: 0.5,
          clearcoat: 0.1
        })
      }
      
      // ⚠️ 关键：寻找骨骼节点
      // Mixamo 标准骨骼命名，如果你用其他模型，需要打印 object.name 看看叫什么
      if (object.isBone) {
        const name = object.name
        if (name.includes('Hips')) bones.hips = object
        if (name.includes('Spine')) bones.spine = object // 腰
        if (name.includes('Spine2') || name.includes('Chest')) bones.chest = object // 胸
        
        // 简单的根节点控制
        if (name === 'mixamorigHips' || name === 'Hips') bones.root = object
      }
    })

    scene.add(modelRoot)
    loading.value = false
    
    // 初始化形态
    updateBodyShape()
    animate()

  }, (xhr) => {
    progress.value = Math.round((xhr.loaded / xhr.total) * 100)
  }, (error) => {
    console.error('模型加载失败', error)
    loading.value = false
  })
}

// 核心：根据参数缩放骨骼
const updateBodyShape = () => {
  if (!bones.hips) return // 模型还没加载好

  // 基准值
  const BASE = { h: 165, w: 50, b: 85, wst: 60, hip: 90 }
  const p = params.value

  // 1. 身高 (整体 Y 轴缩放)
  const hScale = p.height / BASE.h
  // 注意：整体缩放通常操作最外层 Group，或者根骨骼
  if (modelRoot) modelRoot.scale.set(hScale, hScale, hScale)

  // 2. 体重 (影响整体横向宽度)
  const wScale = Math.sqrt(p.weight / BASE.w)
  
  // 3. 局部部位变形 (叠加体重影响)
  
  // --- 胸围 (Bust) ---
  if (bones.chest) {
    const bRatio = (p.bust / BASE.b) * wScale
    // 只放缩 X(宽) 和 Z(厚)，不放缩 Y(长)
    bones.chest.scale.set(bRatio, 1, bRatio * 1.1) 
  }

  // --- 腰围 (Waist) ---
  if (bones.spine) {
    const wstRatio = (p.waist / BASE.wst) * wScale
    bones.spine.scale.set(wstRatio, 1, wstRatio)
  }

  // --- 臀围 (Hips) ---
  if (bones.hips) {
    const hipRatio = (p.hips / BASE.hip) * wScale
    // 臀部放缩稍微收敛一点，否则会穿模
    bones.hips.scale.set(hipRatio, 1, hipRatio) 
  }
}

watch(params, () => updateBodyShape(), { deep: true })

const animate = () => {
  animationId = requestAnimationFrame(animate)
  if (controls) controls.update()
  renderer.render(scene, camera)
}

onMounted(() => {
  if (container.value) initThree()
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
  background-color: #f5f5f5;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 20px;
}

.loading-mask {
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  color: #ff80ab;
}
.spinner {
  width: 30px; height: 30px;
  border: 3px solid #eee;
  border-top-color: #ff80ab;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}
@keyframes spin { to { transform: rotate(360deg); } }

.data-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  pointer-events: none;
}

.tag {
  position: absolute;
  background: rgba(255, 255, 255, 0.7);
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 11px;
  color: #333;
  font-weight: 600;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255,255,255,0.5);
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}
.top-left { top: 20px; left: 20px; }
.top-right { top: 20px; right: 20px; }
.bottom-center { bottom: 20px; left: 50%; transform: translateX(-50%); background: #ff80ab; color: #fff; border: none; }
</style>