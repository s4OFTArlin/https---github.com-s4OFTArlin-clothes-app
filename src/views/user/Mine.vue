<template>
  <div class="mine-wrapper">
    <div class="account-card">
      <div class="user-row">
        <div class="avatar" :style="userInfo.avatar ? { backgroundImage: `url(${userInfo.avatar})` } : {}">
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

    <div class="section-header">
      <h3>身材资料库</h3>
      <span class="manage-btn">3D 可视化</span>
    </div>

    <div class="gender-tab-container">
      <div class="gender-tab">
        <div 
          class="tab-item" 
          :class="{ active: currentGender === 'female' }" 
          @click="currentGender = 'female'"
        >女性</div>
        <div 
          class="tab-item" 
          :class="{ active: currentGender === 'male' }" 
          @click="currentGender = 'male'"
        >男性</div>
      </div>
    </div>

    <BodyModel3D 
      :params="currentActiveProfile" 
      :gender="currentGender"
    />

    <div class="body-data-scroll">
      <div 
        class="data-card" 
        v-for="(item, index) in filteredProfiles" 
        :key="item.id"
        :class="{ active: item.isActive }"
        @click="setActiveProfile(item.id)"
      >
        <div v-if="item.isActive" class="card-tag">当前展示</div>
        <div class="card-top">
          <h4>{{ item.name }}</h4>
          <div class="edit-pen-btn" @click.stop="openBodyEdit('edit', item)">
            <Edit2 :size="16" color="#999" />
          </div>
        </div>
        <div class="params-box">
          <div class="param-line">
            <span class="lbl">身高</span>
            <span class="val">{{ item.height }} cm</span>
          </div>
          <div class="param-line">
            <span class="lbl">体重</span>
            <span class="val">{{ item.weight }} kg</span>
          </div>
          <div class="param-line bwh-line">
            <span class="lbl">三围</span>
            <span class="val">{{ item.bust }}/{{ item.waist }}/{{ item.hips }}</span>
          </div>
        </div>
      </div>

      <div class="add-card" @click="openBodyEdit('add')">
        <Plus :size="32" color="#ccc" />
        <span class="add-text">新建档案</span>
      </div>
    </div>

    <div class="menu-group">
      <div class="menu-item" @click="router.push('/user/settings')">
        <span class="menu-label">账号安全与设置</span>
        <ChevronRight :size="18" color="#ccc" />
      </div>
      <div class="menu-item" @click="logout">
        <span class="menu-label danger">退出登录</span>
        <ChevronRight :size="18" color="#ccc" />
      </div>
    </div>

    <div class="tab-bar-spacing"></div>

    <Teleport to="body">
      <div class="modal-overlay" v-if="isUserEditing" @click.self="isUserEditing = false">
        <div class="modal-card modal-card-mini">
          <h3>修改昵称</h3>
          <div class="input-group">
            <input type="text" v-model="tempUser.name" class="modal-input" placeholder="输入新昵称">
          </div>
          <div class="modal-actions">
            <button class="save-btn" @click="saveUser">确认修改</button>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div class="modal-overlay" v-if="isBodyEditing" @click.self="isBodyEditing = false">
        <div class="modal-card modal-card-mini-body">
          <h3>{{ bodyModalMode === 'add' ? '新建档案' : '编辑数据' }}</h3>
          <div class="input-group">
            <label>档案名</label>
            <input type="text" v-model="tempBody.name" class="modal-input">
          </div>
          <div class="flex-row">
            <div class="input-group half">
              <label>身高</label>
              <input type="number" v-model.number="tempBody.height" class="modal-input">
            </div>
            <div class="input-group half">
              <label>体重</label>
              <input type="number" v-model.number="tempBody.weight" class="modal-input">
            </div>
          </div>
          <div class="input-group">
            <label>三围</label>
            <div class="bwh-inputs">
              <input type="number" v-model.number="tempBody.bust" class="modal-input small" placeholder="胸">
              <input type="number" v-model.number="tempBody.waist" class="modal-input small" placeholder="腰">
              <input type="number" v-model.number="tempBody.hips" class="modal-input small" placeholder="臀">
            </div>
          </div>
          <div class="modal-actions">
            <button class="save-btn" @click="saveBodyProfile">保存</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, ChevronRight, Edit3, Edit2 } from 'lucide-vue-next'
import BodyModel3D from '../../components/BodyModel3D.vue'

const router = useRouter()
const logout = () => router.push('/')

// 用户基础信息
const userInfo = reactive({ name: '时尚探索者', id: '10086', avatar: '' })
const isUserEditing = ref(false)
const tempUser = reactive({ name: '', avatar: '' })

const openUserEdit = () => {
  tempUser.name = userInfo.name
  isUserEditing.value = true
}
const saveUser = () => {
  if (!tempUser.name.trim()) return
  userInfo.name = tempUser.name
  isUserEditing.value = false
}

// --- 核心逻辑：性别与模型控制 ---
const currentGender = ref('female')

// 初始档案库，确保 male 类型档案存在
const bodyProfiles = ref([
  { id: 1, name: '日常数据', gender: 'female', height: 165, weight: 50, bust: 85, waist: 60, hips: 90, isActive: true },
  { id: 2, name: '模特数据', gender: 'female', height: 175, weight: 52, bust: 88, waist: 58, hips: 88, isActive: false },
  { id: 3, name: '男士基础', gender: 'male', height: 178, weight: 70, bust: 95, waist: 80, hips: 95, isActive: false },
])

// 过滤显示当前性别的档案
const filteredProfiles = computed(() => {
  return bodyProfiles.value.filter(p => p.gender === currentGender.value)
})

// 获取当前被选中的活动档案
const currentActiveProfile = computed(() => {
  const active = filteredProfiles.value.find(p => p.isActive)
  // 如果当前性别没选中任何一个，默认给第一个
  return active || filteredProfiles.value[0] || { height: 165, weight: 50, bust: 85, waist: 60, hips: 90 }
})

// 监听性别切换：自动激活该性别下的第一个档案，从而触发模型重载
watch(currentGender, (newGender) => {
  const profileToActive = bodyProfiles.value.find(p => p.gender === newGender)
  if (profileToActive) {
    setActiveProfile(profileToActive.id)
  }
})

// 档案编辑逻辑
const isBodyEditing = ref(false)
const bodyModalMode = ref('add')
const tempBody = reactive({ id: null, name: '', gender: 'female', height: 0, weight: 0, bust: 0, waist: 0, hips: 0 })

const setActiveProfile = (id) => {
  bodyProfiles.value.forEach((p) => {
    p.isActive = (p.id === id)
  })
}

const openBodyEdit = (mode, item = null) => {
  bodyModalMode.value = mode
  if (mode === 'add') {
    tempBody.id = Date.now()
    tempBody.name = ''
    tempBody.gender = currentGender.value // 新建档案跟随当前 Tab 性别
    tempBody.height = currentGender.value === 'male' ? 175 : 165
    tempBody.weight = currentGender.value === 'male' ? 70 : 50
    tempBody.bust = currentGender.value === 'male' ? 95 : 85
    tempBody.waist = currentGender.value === 'male' ? 80 : 60
    tempBody.hips = currentGender.value === 'male' ? 95 : 90
  } else {
    Object.assign(tempBody, item)
  }
  isBodyEditing.value = true
}

const saveBodyProfile = () => {
  if (!tempBody.name) return
  if (bodyModalMode.value === 'add') {
    bodyProfiles.value.push({ ...tempBody, isActive: false })
  } else {
    const index = bodyProfiles.value.findIndex(p => p.id === tempBody.id)
    if (index !== -1) {
      bodyProfiles.value[index] = { ...tempBody }
    }
  }
  bodyProfiles.value = [...bodyProfiles.value]
  isBodyEditing.value = false
}
</script>

<style scoped>
/* 保持原有样式不变 */
.mine-wrapper { background: #f8f8f8; height: 100vh; overflow-y: auto; display: block; padding-bottom: 20px; }
.account-card { margin: 20px; background: linear-gradient(135deg, #ff80ab 0%, #ff4081 100%); border-radius: 20px; padding: 25px; color: #fff; box-shadow: 0 8px 20px rgba(255, 64, 129, 0.2); }
.user-row { display: flex; align-items: center; gap: 15px; margin-bottom: 25px; }
.avatar { width: 64px; height: 64px; background: rgba(255,255,255,0.3); border: 2px solid #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 26px; font-weight: bold; background-size: cover; background-position: center; }
.name { margin: 0; font-size: 20px; font-weight: 700; }
.id { margin: 5px 0 0; font-size: 12px; opacity: 0.8; }
.data-row { display: flex; justify-content: space-around; }
.d-item { display: flex; flex-direction: column; align-items: center; }
.d-item strong { font-size: 18px; }
.d-item span { font-size: 12px; opacity: 0.8; margin-top: 4px; }

.gender-tab-container { display: flex; justify-content: center; margin-bottom: 10px; }
.gender-tab { 
  display: flex; background: #eee; border-radius: 20px; padding: 3px; width: 160px; 
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
}
.tab-item { 
  flex: 1; text-align: center; padding: 6px 0; font-size: 13px; color: #888; 
  border-radius: 18px; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer;
}
.tab-item.active { background: #ff4081; color: #fff; font-weight: bold; box-shadow: 0 4px 10px rgba(255, 64, 129, 0.3); }

.section-header { padding: 10px 20px; display: flex; justify-content: space-between; align-items: center; }
.section-header h3 { margin: 0; font-size: 17px; font-weight: 800; color: #222; }
.manage-btn { font-size: 12px; color: #ff4081; font-weight: 600; }

.body-data-scroll { display: flex; gap: 12px; padding: 15px 20px; overflow-x: auto; }
.body-data-scroll::-webkit-scrollbar { display: none; }

.data-card { 
  min-width: 170px; background: #fff5f8; border-radius: 16px; padding: 16px; 
  position: relative; border: 1px solid #ffecf2; box-sizing: border-box; 
  transition: transform 0.2s;
}
.data-card.active { border: 1.5px solid #ff4081; background: #fff0f5; transform: scale(1.02); }
.card-tag { position: absolute; top: 0; right: 0; background: #ff4081; color: #fff; font-size: 10px; padding: 2px 8px; border-radius: 0 16px 0 10px; }
.card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.card-top h4 { margin: 0; font-size: 14px; font-weight: 700; color: #333; }
.edit-pen-btn { cursor: pointer; padding: 4px; display: flex; align-items: center; justify-content: center; }

.params-box { display: flex; flex-direction: column; gap: 6px; }
.param-line { display: flex; justify-content: space-between; font-size: 12px; color: #777; padding-bottom: 4px; border-bottom: 1px dashed #ffdbe9; }
.param-line .val { font-weight: 700; color: #333; }
.bwh-line { border-bottom: none; }

.add-card { min-width: 150px; background: #fff; border-radius: 16px; border: 2px dashed #ddd; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; cursor: pointer; }
.add-text { font-size: 13px; color: #999; }

.menu-group { background: #fff; margin: 10px 20px; border-radius: 16px; overflow: hidden; }
.menu-item { padding: 16px 15px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f8f8f8; cursor: pointer; }
.menu-label { font-size: 15px; color: #333; }
.danger { color: #ff4081; font-weight: 700; }
.tab-bar-spacing { height: 90px; }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(2px); z-index: 2000; display: flex; align-items: center; justify-content: center; }
.modal-card-mini { background: #fff; width: 70%; max-width: 260px; padding: 20px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
.modal-card-mini h3 { font-size: 16px; text-align: center; margin-bottom: 15px; }
.modal-card-mini-body { background: #fff; width: 75%; max-width: 280px; padding: 20px; border-radius: 20px; }
.modal-card-mini-body h3 { font-size: 16px; text-align: center; margin-bottom: 15px; }

.input-group { margin-bottom: 12px; }
.input-group label { display: block; font-size: 11px; color: #999; margin-bottom: 4px; }
.modal-input { width: 100%; padding: 10px; border: 1px solid #f0f0f0; border-radius: 10px; background: #fbfbfb; outline: none; font-size: 14px; box-sizing: border-box; }
.flex-row { display: flex; gap: 8px; }
.half { flex: 1; }
.bwh-inputs { display: flex; gap: 5px; }
.modal-input.small { text-align: center; padding: 8px 2px; }
.save-btn { width: 100%; background: #ff4081; color: #fff; border: none; border-radius: 10px; font-weight: 700; padding: 10px; margin-top: 5px; cursor: pointer; }
</style>