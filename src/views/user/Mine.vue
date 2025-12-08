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
        
        <div class="edit-icon" @click="openEdit">
          <Edit3 :size="20" color="#fff" />
        </div>
      </div>
      
      <div class="data-row">
        <div class="d-item"><strong>12</strong><span>关注</span></div>
        <div class="d-item"><strong>5</strong><span>收藏</span></div>
        <div class="d-item"><strong>2</strong><span>足迹</span></div>
      </div>
    </div>

    <!-- 2. 身材资料库 -->
    <div class="section-header">
      <h3>身材资料库</h3>
      <span class="manage-btn">管理</span>
    </div>

    <div class="body-data-scroll">
      <div class="data-card active">
        <div class="card-tag">当前使用</div>
        <h4>日常数据</h4>
        <div class="params">
          <div class="p-row"><span>身高</span> 165 cm</div>
          <div class="p-row"><span>体重</span> 48 kg</div>
          <div class="p-row"><span>三围</span> 84/62/88</div>
        </div>
      </div>
      <div class="add-card">
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

    <!-- 4. 编辑弹窗 -->
    <Teleport to="body">
      <div class="modal-overlay" v-if="isEditing" @click.self="isEditing = false">
        <div class="modal-card">
          <h3>修改个人信息</h3>
          
          <div class="edit-avatar-area" @click="triggerFileInput">
            <div class="preview-circle" 
                 :style="tempUser.avatar ? { backgroundImage: `url(${tempUser.avatar})` } : {}">
               <span v-if="!tempUser.avatar">{{ tempUser.name[0] }}</span>
               <div class="camera-mask">
                 <Camera :size="24" color="#fff" />
               </div>
            </div>
            <p class="tip">更换头像</p>
            <input type="file" ref="fileInput" accept="image/*" style="display: none" @change="handleFileChange">
          </div>

          <div class="input-group">
            <label>昵称</label>
            <input type="text" v-model="tempUser.name" class="modal-input">
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
import { Settings, Plus, ChevronRight, Edit3, Camera } from 'lucide-vue-next'

const router = useRouter()
const isEditing = ref(false)
const fileInput = ref(null)

const userInfo = reactive({
  name: '时尚探索者',
  id: '10086',
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
  if (!tempUser.name.trim()) return
  userInfo.name = tempUser.name
  userInfo.avatar = tempUser.avatar
  isEditing.value = false
}

const logout = () => router.push('/')
</script>

<style scoped>
/* ⚠️ 关键修改：删除了 min-height: 100%; */
.page-container { background: #fafafa; padding-bottom: 20px; }

/* 账号卡片 */
.account-card {
  margin: 20px;
  background: linear-gradient(135deg, #ff80ab 0%, #ff4081 100%);
  border-radius: 24px;
  padding: 25px;
  color: #fff;
  box-shadow: 0 10px 20px rgba(255, 64, 129, 0.3);
}
.user-row { display: flex; align-items: center; gap: 15px; margin-bottom: 25px; }

/* 头像样式 */
.avatar { 
  width: 60px; height: 60px; 
  background: rgba(255,255,255,0.2); 
  border: 2px solid rgba(255,255,255,0.5); 
  border-radius: 50%; 
  display: flex; align-items: center; justify-content: center; 
  font-size: 24px; font-weight: bold;
  background-size: cover; background-position: center;
}

.info { flex: 1; }
.name { margin: 0; font-size: 18px; }
.id { margin: 0; font-size: 12px; opacity: 0.8; }
.edit-icon { opacity: 0.8; cursor: pointer; padding: 5px; }

.data-row { display: flex; justify-content: space-around; }
.d-item { display: flex; flex-direction: column; align-items: center; }
.d-item strong { font-size: 18px; }
.d-item span { font-size: 11px; opacity: 0.8; }

/* 身材资料库 */
.section-header { padding: 0 20px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
.section-header h3 { margin: 0; font-size: 16px; }
.manage-btn { font-size: 12px; color: #999; }
.body-data-scroll { display: flex; gap: 15px; padding: 0 20px 20px 20px; overflow-x: auto; }
.body-data-scroll::-webkit-scrollbar { display: none; }
.data-card { min-width: 140px; background: #fff; border-radius: 16px; padding: 20px; position: relative; border: 1px solid #eee; box-shadow: 0 4px 10px rgba(0,0,0,0.03); }
.data-card.active { border: 1px solid #ff80ab; background: #fff0f5; }
.card-tag { position: absolute; top: 0; right: 0; background: #ff80ab; color: #fff; font-size: 10px; padding: 2px 8px; border-radius: 0 16px 0 8px; }
.data-card h4 { margin: 0 0 15px 0; font-size: 14px; }
.params { font-size: 12px; color: #666; display: flex; flex-direction: column; gap: 6px; }
.p-row { display: flex; justify-content: space-between; width: 100%; }
.add-card { min-width: 140px; border-radius: 16px; border: 2px dashed #ddd; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #ccc; gap: 10px; cursor: pointer; }

/* 菜单 */
.menu-list { background: #fff; margin: 0 20px; border-radius: 16px; padding: 10px; }
.menu-item { padding: 15px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f9f9f9; cursor: pointer; font-size: 14px; }
.menu-item:last-child { border-bottom: none; }
.danger { color: #ff4081; }

/* 弹窗样式 */
.modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); backdrop-filter: blur(5px); z-index: 999; display: flex; align-items: center; justify-content: center; }
.modal-card { background: #fff; width: 80%; max-width: 320px; padding: 25px; border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); animation: popIn 0.3s ease; }
@keyframes popIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }

.modal-card h3 { text-align: center; margin-bottom: 25px; font-size: 18px; }
.edit-avatar-area { display: flex; flex-direction: column; align-items: center; margin-bottom: 25px; cursor: pointer; }
.preview-circle { width: 80px; height: 80px; border-radius: 50%; background-color: #ffd1dc; color: #880e4f; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: bold; position: relative; overflow: hidden; background-size: cover; background-position: center; }
.camera-mask { position: absolute; inset: 0; background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s; }
.preview-circle:hover .camera-mask { opacity: 1; }
.tip { font-size: 12px; color: #999; margin-top: 10px; }
.input-group { margin-bottom: 30px; }
.input-group label { display: block; font-size: 12px; color: #666; margin-bottom: 8px; font-weight: 600; }
.modal-input { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 12px; font-size: 14px; outline: none; box-sizing: border-box; }
.modal-input:focus { border-color: #ff80ab; }
.modal-actions { display: flex; gap: 15px; }
.cancel-btn { flex: 1; padding: 12px; background: #f5f5f5; border: none; border-radius: 12px; color: #666; font-weight: 600; cursor: pointer; }
.save-btn { flex: 1; padding: 12px; background: #ff80ab; border: none; border-radius: 12px; color: #fff; font-weight: 600; cursor: pointer; }
</style>