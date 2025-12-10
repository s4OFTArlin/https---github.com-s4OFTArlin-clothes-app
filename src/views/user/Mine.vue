<template>
  <div class="page-container">
    <!-- 1. 账号信息卡片 -->
    <div class="account-card">
      <div class="user-row">
        <div class="avatar" 
             :style="userInfo.avatar ? { backgroundImage: `url(${userInfo.avatar})` } : {}">
          <span v-if="!userInfo.avatar">{{ userInfo.name[0] }}</span>
        </div>
        <div class="info">
          <h2 class="name">{{ userInfo.name }}</h2>
          <p class="id">ID: {{ userInfo.id }}</p>
        </div>
        <div class="edit-icon" @click="openUserEdit">
          <Edit3 :size="20" color="#fff" />
        </div>
      </div>
      <div class="data-row">
        <div class="d-item"><strong>12</strong><span>关注</span></div>
        <div class="d-item"><strong>5</strong><span>收藏</span></div>
        <div class="d-item"><strong>2</strong><span>足迹</span></div>
      </div>
    </div>

    <!-- 2. 身材资料库区域 -->
    <div class="section-header">
      <h3>身材资料库</h3>
      <span class="manage-btn">3D 可视化</span>
    </div>

    <!-- ⬇️⬇️⬇️ 新增：3D 模型展示组件 ⬇️⬇️⬇️ -->
    <!-- 将当前激活的档案数据传给 3D 组件 -->
    <BodyModel3D :params="currentActiveProfile" />
    <!-- ⬆️⬆️⬆️ 结束 ⬆️⬆️⬆️ -->

    <div class="body-data-scroll">
      <div 
        class="data-card" 
        v-for="(item, index) in bodyProfiles" 
        :key="item.id"
        :class="{ active: item.isActive }"
        @click="setActiveProfile(index)"
      >
        <div v-if="item.isActive" class="card-tag">当前展示</div>
        <div class="card-top">
          <h4>{{ item.name }}</h4>
          <button class="icon-btn-mini" @click.stop="openBodyEdit('edit', item)">
            <Edit2 :size="14" color="#999" />
          </button>
        </div>
        <div class="params">
          <div class="p-row"><span>身高</span> {{ item.height }} cm</div>
          <div class="p-row"><span>体重</span> {{ item.weight }} kg</div>
          <div class="p-row">
            <span>三围</span> {{ item.bust }}/{{ item.waist }}/{{ item.hips }}
          </div>
        </div>
      </div>

      <div class="add-card" @click="openBodyEdit('add')">
        <Plus :size="32" color="#ccc" />
        <span>新建档案</span>
      </div>
    </div>

    <!-- 3. 常用菜单 -->
    <div class="menu-list">
      <div class="menu-item">
        <span>账号安全</span>
        <ChevronRight :size="16" color="#ccc" />
      </div>
      <div class="menu-item" @click="logout">
        <span class="danger">退出登录</span>
      </div>
    </div>

    <!-- 弹窗：编辑个人信息 -->
    <Teleport to="body">
      <div class="modal-overlay" v-if="isUserEditing" @click.self="isUserEditing = false">
        <div class="modal-card">
          <h3>修改个人信息</h3>
          <div class="edit-avatar-area" @click="triggerFileInput">
            <div class="preview-circle" :style="tempUser.avatar ? { backgroundImage: `url(${tempUser.avatar})` } : {}">
               <span v-if="!tempUser.avatar">{{ tempUser.name[0] }}</span>
               <div class="camera-mask"><Camera :size="24" color="#fff" /></div>
            </div>
            <p class="tip">更换头像</p>
            <input type="file" ref="fileInput" accept="image/*" style="display: none" @change="handleFileChange">
          </div>
          <div class="input-group">
            <label>昵称</label>
            <input type="text" v-model="tempUser.name" class="modal-input">
          </div>
          <div class="modal-actions">
            <button class="cancel-btn" @click="isUserEditing = false">取消</button>
            <button class="save-btn" @click="saveUser">保存</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 弹窗：编辑身材档案 (调整了 input 的类型为 number) -->
    <Teleport to="body">
      <div class="modal-overlay" v-if="isBodyEditing" @click.self="isBodyEditing = false">
        <div class="modal-card">
          <h3>{{ bodyModalMode === 'add' ? '新建档案' : '编辑档案' }}</h3>
          
          <div class="input-group">
            <label>档案名称</label>
            <input type="text" v-model="tempBody.name" class="modal-input">
          </div>

          <div class="flex-row">
            <div class="input-group half">
              <label>身高 (cm)</label>
              <!-- 加上 .number 修饰符，确保是数字类型 -->
              <input type="number" v-model.number="tempBody.height" class="modal-input">
            </div>
            <div class="input-group half">
              <label>体重 (kg)</label>
              <input type="number" v-model.number="tempBody.weight" class="modal-input">
            </div>
          </div>

          <div class="input-group">
            <label>三围 (胸 / 腰 / 臀)</label>
            <div class="bwh-inputs">
              <input type="number" v-model.number="tempBody.bust" placeholder="胸" class="modal-input small">
              <input type="number" v-model.number="tempBody.waist" placeholder="腰" class="modal-input small">
              <input type="number" v-model.number="tempBody.hips" placeholder="臀" class="modal-input small">
            </div>
          </div>

          <div class="modal-actions">
            <button v-if="bodyModalMode === 'edit'" class="delete-btn" @click="deleteBodyProfile">删除</button>
            <button class="cancel-btn" @click="isBodyEditing = false">取消</button>
            <button class="save-btn" @click="saveBodyProfile">更新模型</button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Settings, Plus, ChevronRight, Edit3, Camera, Edit2 } from 'lucide-vue-next'
// 引入新组件
import BodyModel3D from '../../components/BodyModel3D.vue'

const router = useRouter()
const logout = () => router.push('/')

// 用户信息
const userInfo = reactive({ name: '时尚探索者', id: '10086', avatar: '' })
const isUserEditing = ref(false)
const tempUser = reactive({ name: '', avatar: '' })
const fileInput = ref(null)

const openUserEdit = () => {
  tempUser.name = userInfo.name
  tempUser.avatar = userInfo.avatar
  isUserEditing.value = true
}
const triggerFileInput = () => fileInput.value.click()
const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (file) tempUser.avatar = URL.createObjectURL(file)
}
const saveUser = () => {
  if (!tempUser.name.trim()) return
  userInfo.name = tempUser.name
  userInfo.avatar = tempUser.avatar
  isUserEditing.value = false
}

// 身材档案
const bodyProfiles = ref([
  { id: 1, name: '日常数据', height: 165, weight: 50, bust: 85, waist: 60, hips: 90, isActive: true },
  { id: 2, name: '模特数据', height: 175, weight: 52, bust: 88, waist: 58, hips: 88, isActive: false },
])

// 计算属性：获取当前激活的档案，传给 3D 模型
const currentActiveProfile = computed(() => {
  return bodyProfiles.value.find(p => p.isActive) || bodyProfiles.value[0]
})

const isBodyEditing = ref(false)
const bodyModalMode = ref('add')
const tempBody = reactive({ id: null, name: '', height: 0, weight: 0, bust: 0, waist: 0, hips: 0 })

const setActiveProfile = (index) => {
  bodyProfiles.value.forEach((p, i) => p.isActive = (i === index))
}

const openBodyEdit = (mode, item = null) => {
  bodyModalMode.value = mode
  if (mode === 'add') {
    tempBody.id = Date.now()
    tempBody.name = ''
    tempBody.height = 165
    tempBody.weight = 50
    tempBody.bust = 85
    tempBody.waist = 60
    tempBody.hips = 90
  } else {
    Object.assign(tempBody, item)
  }
  isBodyEditing.value = true
}

const saveBodyProfile = () => {
  if (!tempBody.name) return alert('请输入名称')
  if (bodyModalMode.value === 'add') {
    bodyProfiles.value.push({ ...tempBody, isActive: false })
  } else {
    const index = bodyProfiles.value.findIndex(p => p.id === tempBody.id)
    if (index !== -1) {
      const wasActive = bodyProfiles.value[index].isActive
      bodyProfiles.value[index] = { ...tempBody, isActive: wasActive }
    }
  }
  isBodyEditing.value = false
}

const deleteBodyProfile = () => {
  if (bodyProfiles.value.length <= 1) return alert('请至少保留一个')
  if (!confirm('确定删除吗？')) return
  const index = bodyProfiles.value.findIndex(p => p.id === tempBody.id)
  if (index !== -1) {
    bodyProfiles.value.splice(index, 1)
    if (bodyProfiles.value.length > 0) bodyProfiles.value[0].isActive = true
  }
  isBodyEditing.value = false
}
</script>

<style scoped>
.page-container { background: #fafafa; padding-bottom: 20px; }
.account-card { margin: 20px; background: linear-gradient(135deg, #ff80ab 0%, #ff4081 100%); border-radius: 24px; padding: 25px; color: #fff; box-shadow: 0 10px 20px rgba(255, 64, 129, 0.3); }
.user-row { display: flex; align-items: center; gap: 15px; margin-bottom: 25px; }
.avatar { width: 60px; height: 60px; background: rgba(255,255,255,0.2); border: 2px solid rgba(255,255,255,0.5); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; background-size: cover; background-position: center; }
.info { flex: 1; }
.name { margin: 0; font-size: 18px; }
.id { margin: 0; font-size: 12px; opacity: 0.8; }
.edit-icon { opacity: 0.8; cursor: pointer; padding: 5px; }
.data-row { display: flex; justify-content: space-around; }
.d-item { display: flex; flex-direction: column; align-items: center; }
.d-item strong { font-size: 18px; }
.d-item span { font-size: 11px; opacity: 0.8; }

.section-header { padding: 0 20px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
.section-header h3 { margin: 0; font-size: 16px; }
.manage-btn { font-size: 12px; color: #999; }

.body-data-scroll { display: flex; gap: 15px; padding: 0 20px 20px 20px; overflow-x: auto; }
.body-data-scroll::-webkit-scrollbar { display: none; }
.data-card { min-width: 150px; background: #fff; border-radius: 16px; padding: 15px; position: relative; border: 1px solid #eee; box-shadow: 0 4px 10px rgba(0,0,0,0.03); transition: all 0.2s; cursor: pointer; }
.data-card.active { border: 1px solid #ff80ab; background: #fff0f5; }
.card-tag { position: absolute; top: 0; right: 0; background: #ff80ab; color: #fff; font-size: 10px; padding: 2px 8px; border-radius: 0 16px 0 8px; }
.card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding-right: 20px; }
.card-top h4 { margin: 0; font-size: 14px; color: #333; }
.icon-btn-mini { border: none; background: none; padding: 5px; cursor: pointer; }
.params { font-size: 12px; color: #666; display: flex; flex-direction: column; gap: 6px; }
.p-row { display: flex; justify-content: space-between; width: 100%; border-bottom: 1px dashed #f5f5f5; padding-bottom: 2px; }
.add-card { min-width: 140px; border-radius: 16px; border: 2px dashed #ddd; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #ccc; gap: 10px; cursor: pointer; }

.menu-list { background: #fff; margin: 0 20px; border-radius: 16px; padding: 10px; }
.menu-item { padding: 15px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f9f9f9; cursor: pointer; font-size: 14px; }
.menu-item:last-child { border-bottom: none; }
.danger { color: #ff4081; }

.modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); backdrop-filter: blur(5px); z-index: 999; display: flex; align-items: center; justify-content: center; }
.modal-card { background: #fff; width: 80%; max-width: 320px; padding: 25px; border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); animation: popIn 0.3s ease; }
@keyframes popIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
.modal-card h3 { text-align: center; margin-bottom: 25px; font-size: 18px; margin-top: 0; }
.input-group { margin-bottom: 20px; }
.input-group label { display: block; font-size: 12px; color: #666; margin-bottom: 8px; font-weight: 600; }
.modal-input { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 12px; font-size: 14px; outline: none; box-sizing: border-box; }
.modal-input:focus { border-color: #ff80ab; }
.flex-row { display: flex; gap: 10px; }
.half { flex: 1; }
.bwh-inputs { display: flex; gap: 8px; }
.modal-input.small { padding: 8px; text-align: center; }
.modal-actions { display: flex; gap: 10px; margin-top: 10px; }
.cancel-btn { flex: 1; padding: 12px; background: #f5f5f5; border: none; border-radius: 12px; color: #666; font-weight: 600; cursor: pointer; }
.save-btn { flex: 1.5; padding: 12px; background: #ff80ab; border: none; border-radius: 12px; color: #fff; font-weight: 600; cursor: pointer; }
.delete-btn { flex: 0.8; padding: 12px; background: #ffebee; border: none; border-radius: 12px; color: #d32f2f; font-weight: 600; cursor: pointer; }

.edit-avatar-area { display: flex; flex-direction: column; align-items: center; margin-bottom: 25px; cursor: pointer; }
.preview-circle { width: 80px; height: 80px; border-radius: 50%; background-color: #ffd1dc; color: #880e4f; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: bold; position: relative; overflow: hidden; background-size: cover; background-position: center; }
.camera-mask { position: absolute; inset: 0; background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s; }
.preview-circle:hover .camera-mask { opacity: 1; }
.tip { font-size: 12px; color: #999; margin-top: 10px; }
</style>