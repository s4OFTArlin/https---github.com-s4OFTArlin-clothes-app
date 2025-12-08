<template>
  <div class="page-container">
    <!-- 1. 个人信息大卡片 -->
    <div class="profile-card">
      <div class="profile-top">
        <div class="avatar-large" 
             :style="userInfo.avatar ? { backgroundImage: `url(${userInfo.avatar})` } : {}">
          <span v-if="!userInfo.avatar">{{ userInfo.name[0] }}</span>
        </div>
        
        <div class="info-text">
          <h2 class="username">{{ userInfo.name }}</h2>
          <p class="user-id">ID: {{ userInfo.id }}</p>
        </div>
        
        <button class="edit-btn" @click="openEdit">
          <Settings :size="18" color="#666" />
        </button>
      </div>
      
      <div class="account-actions">
        <button class="action-item" @click="logout">
          <LogOut :size="16" style="margin-right: 6px"/> 
          退出登录
        </button>
      </div>
    </div>

    <!-- 2. 个人作品集 -->
    <div class="works-section">
      <div class="tab-header">
        <span class="active">我的作品</span>
        <span>草稿箱</span>
      </div>
      <div class="works-grid">
        <div class="work-item" v-for="n in 9" :key="n">
          <div class="work-img">Work {{ n }}</div>
        </div>
      </div>
    </div>

    <!-- 3. 编辑资料弹窗 -->
    <Teleport to="body">
      <div class="modal-overlay" v-if="isEditing" @click.self="isEditing = false">
        <div class="modal-card">
          <h3>编辑资料</h3>
          
          <div class="edit-avatar-area" @click="triggerFileInput">
            <div class="preview-circle" 
                 :style="tempUser.avatar ? { backgroundImage: `url(${tempUser.avatar})` } : {}">
               <span v-if="!tempUser.avatar">{{ tempUser.name[0] }}</span>
               <div class="camera-mask">
                 <Camera :size="24" color="#fff" />
               </div>
            </div>
            <p class="tip">点击更换头像</p>
            <input type="file" ref="fileInput" accept="image/*" style="display: none" @change="handleFileChange">
          </div>

          <div class="input-group">
            <label>昵称</label>
            <input type="text" v-model="tempUser.name" class="modal-input" placeholder="请输入昵称">
          </div>

          <div class="modal-actions">
            <button class="cancel-btn" @click="isEditing = false">取消</button>
            <button class="save-btn" @click="saveProfile">保存</button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Settings, LogOut, Camera } from 'lucide-vue-next'

const router = useRouter()
const isEditing = ref(false)
const fileInput = ref(null)

const userInfo = reactive({
  name: '首席搭配师',
  id: '882039',
  avatar: '' 
})

const tempUser = reactive({
  name: '',
  avatar: ''
})

const openEdit = () => {
  tempUser.name = userInfo.name
  tempUser.avatar = userInfo.avatar
  isEditing.value = true
}

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    tempUser.avatar = URL.createObjectURL(file)
  }
}

const saveProfile = () => {
  if (!tempUser.name.trim()) return alert('昵称不能为空')
  userInfo.name = tempUser.name
  userInfo.avatar = tempUser.avatar
  isEditing.value = false
}

const logout = () => {
  router.push('/')
}
</script>

<style scoped>
/* ⚠️ 关键修改：删除了 min-height: 100%; */
.page-container { 
  background-color: #fafafa; 
  /* 只需要背景色即可，高度由父级 flex 自动控制 */
}

/* 卡片样式 */
.profile-card { background: #fff; margin: 20px; padding: 25px; border-radius: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
.profile-top { display: flex; align-items: center; margin-bottom: 25px; }

.avatar-large {
  width: 70px; height: 70px;
  background-color: #d1f2eb; color: #00695c; 
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-weight: bold; font-size: 24px;
  margin-right: 15px;
  background-size: cover; background-position: center; 
}

.info-text { flex: 1; }
.username { font-size: 20px; margin: 0 0 5px 0; }
.user-id { color: #999; font-size: 12px; }

.edit-btn { background: transparent; border: 1px solid #eee; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; }

.account-actions { border-top: 1px dashed #eee; padding-top: 15px; }
.action-item { background: #f9f9f9; border: none; width: 100%; padding: 12px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 13px; color: #666; font-weight: 600; cursor: pointer; }

/* 作品集 */
.works-section { background: #fff; border-radius: 30px 30px 0 0; padding: 20px; min-height: 300px; box-shadow: 0 -5px 20px rgba(0,0,0,0.02); }
.tab-header { display: flex; gap: 30px; margin-bottom: 20px; padding-left: 10px; }
.tab-header span { font-size: 16px; color: #999; cursor: pointer; }
.tab-header span.active { color: #000; font-weight: bold; position: relative; }
.works-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; }
.work-item { aspect-ratio: 1; background: #eee; display: flex; align-items: center; justify-content: center; color: #aaa; font-size: 12px; }

/* 弹窗样式 */
.modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); backdrop-filter: blur(5px); z-index: 999; display: flex; align-items: center; justify-content: center; }
.modal-card { background: #fff; width: 80%; max-width: 320px; padding: 25px; border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); animation: popIn 0.3s ease; }
@keyframes popIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }

.modal-card h3 { text-align: center; margin-bottom: 25px; font-size: 18px; }
.edit-avatar-area { display: flex; flex-direction: column; align-items: center; margin-bottom: 25px; cursor: pointer; }
.preview-circle { width: 80px; height: 80px; border-radius: 50%; background-color: #d1f2eb; color: #00695c; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: bold; position: relative; overflow: hidden; background-size: cover; background-position: center; }
.camera-mask { position: absolute; inset: 0; background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s; }
.preview-circle:hover .camera-mask { opacity: 1; }
.tip { font-size: 12px; color: #999; margin-top: 10px; }
.input-group { margin-bottom: 30px; }
.input-group label { display: block; font-size: 12px; color: #666; margin-bottom: 8px; font-weight: 600; }
.modal-input { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 12px; font-size: 14px; outline: none; box-sizing: border-box; }
.modal-input:focus { border-color: #000; }
.modal-actions { display: flex; gap: 15px; }
.cancel-btn { flex: 1; padding: 12px; background: #f5f5f5; border: none; border-radius: 12px; color: #666; font-weight: 600; cursor: pointer; }
.save-btn { flex: 1; padding: 12px; background: #000; border: none; border-radius: 12px; color: #fff; font-weight: 600; cursor: pointer; }
</style>