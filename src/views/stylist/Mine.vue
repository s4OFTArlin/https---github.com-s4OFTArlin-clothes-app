<template>
  <div class="page-container">
    <!-- 1. 个人信息大卡片 (保持不变) -->
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
        <button class="edit-btn" @click="openProfileEdit">
          <Settings :size="18" color="#666" />
        </button>
      </div>
      <div class="account-actions">
        <button class="action-item" @click="logout">
          <LogOut :size="16" style="margin-right: 6px"/> 退出登录
        </button>
      </div>
    </div>

    <!-- 2. 作品与草稿管理区 -->
    <div class="works-section">
      <div class="tab-header">
        <span :class="{ active: currentTab === 'works' }" @click="currentTab = 'works'">
          我的作品 ({{ worksList.length }})
        </span>
        <span :class="{ active: currentTab === 'drafts' }" @click="currentTab = 'drafts'">
          草稿箱 ({{ draftsList.length }})
        </span>
      </div>

      <div class="works-grid">
        <!-- 新建按钮：直接打开编辑表单 -->
        <div class="work-item add-item" @click="openEditModal('add')">
          <Plus :size="24" color="#ccc" />
          <span>新建{{ currentTab === 'works' ? '作品' : '草稿' }}</span>
        </div>

        <!-- 列表循环：点击打开详情查看 -->
        <div 
          class="work-item" 
          v-for="item in currentList" 
          :key="item.id"
          @click="openDetailModal(item)"
          :style="{ background: item.color }"
        >
          <span class="work-title">{{ item.title }}</span>
        </div>
      </div>
    </div>

    <!-- ================== 弹窗区域 ================== -->

    <!-- A. 作品详情弹窗 (View Mode) -->
    <Teleport to="body">
      <div class="modal-overlay" v-if="isDetailOpen" @click.self="isDetailOpen = false">
        <div class="detail-card">
          <!-- 顶部操作栏 -->
          <div class="detail-header">
            <button class="icon-btn" @click="isDetailOpen = false"><X :size="24" /></button>
            <div class="actions">
              <button class="icon-btn" @click="handleEditFromDetail"><Edit3 :size="20" /></button>
              <button class="icon-btn danger" @click="handleDeleteFromDetail"><Trash2 :size="20" /></button>
            </div>
          </div>

          <!-- 内容展示 -->
          <div class="detail-content">
            <!-- 模拟大图 -->
            <div class="big-cover" :style="{ background: currentViewItem.color }">
              <span>{{ currentViewItem.title }}</span>
            </div>

            <!-- 描述信息 -->
            <div class="info-block">
              <h3>搭配理念</h3>
              <p class="desc-text">{{ currentViewItem.desc || '暂无描述...' }}</p>
            </div>

            <!-- 包含单品 -->
            <div class="info-block">
              <h3>包含单品</h3>
              <div class="items-wrap">
                <span class="item-tag" v-for="tag in currentViewItem.items" :key="tag">
                  {{ tag }}
                </span>
                <span v-if="!currentViewItem.items?.length" class="empty-tip">未添加单品信息</span>
              </div>
            </div>

            <!-- 发布时间 -->
            <div class="meta-info">发布于 {{ currentViewItem.date }}</div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- B. 编辑/新建表单弹窗 (Edit Mode) -->
    <Teleport to="body">
      <div class="modal-overlay" v-if="isEditOpen" @click.self="isEditOpen = false">
        <div class="modal-card">
          <h3>{{ modalMode === 'add' ? '新建内容' : '编辑内容' }}</h3>
          
          <div class="input-group">
            <label>标题</label>
            <input type="text" v-model="tempItem.title" class="modal-input" placeholder="请输入标题">
          </div>

          <div class="input-group">
            <label>搭配描述</label>
            <textarea v-model="tempItem.desc" class="modal-input textarea" placeholder="写下你的搭配灵感..."></textarea>
          </div>

          <div class="input-group">
            <label>包含单品 (用空格分隔)</label>
            <input type="text" v-model="tempItem.itemsStr" class="modal-input" placeholder="例如：白衬衫 牛仔裤 帆布鞋">
          </div>

          <div class="input-group">
            <label>封面色调</label>
            <div class="color-picker">
              <div v-for="color in presetColors" :key="color"
                class="color-dot" :style="{ background: color }"
                :class="{ selected: tempItem.color === color }"
                @click="tempItem.color = color"></div>
            </div>
          </div>

          <div class="modal-actions">
            <button class="cancel-btn" @click="isEditOpen = false">取消</button>
            <button class="save-btn" @click="saveItem">保存</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- C. 个人资料编辑弹窗 (保持原有) -->
    <Teleport to="body">
      <div class="modal-overlay" v-if="isProfileEditing" @click.self="isProfileEditing = false">
        <div class="modal-card">
          <h3>编辑资料</h3>
          <div class="edit-avatar-area" @click="triggerFileInput">
            <div class="preview-circle" :style="tempUser.avatar ? { backgroundImage: `url(${tempUser.avatar})` } : {}">
               <span v-if="!tempUser.avatar">{{ tempUser.name[0] }}</span>
               <div class="camera-mask"><Camera :size="24" color="#fff" /></div>
            </div>
            <p class="tip">点击更换头像</p>
            <input type="file" ref="fileInput" accept="image/*" style="display: none" @change="handleFileChange">
          </div>
          <div class="input-group">
            <label>昵称</label>
            <input type="text" v-model="tempUser.name" class="modal-input">
          </div>
          <div class="modal-actions">
            <button class="cancel-btn" @click="isProfileEditing = false">取消</button>
            <button class="save-btn" @click="saveProfile">保存</button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Settings, LogOut, Camera, Plus, Edit2, X, Trash2, Edit3 } from 'lucide-vue-next'

const router = useRouter()

// --- 1. 用户信息逻辑 ---
const userInfo = reactive({ name: '首席搭配师', id: '882039', avatar: '' })
const isProfileEditing = ref(false)
const tempUser = reactive({ name: '', avatar: '' })
const fileInput = ref(null)

const openProfileEdit = () => {
  tempUser.name = userInfo.name
  tempUser.avatar = userInfo.avatar
  isProfileEditing.value = true
}
const triggerFileInput = () => fileInput.value.click()
const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (file) tempUser.avatar = URL.createObjectURL(file)
}
const saveProfile = () => {
  if (!tempUser.name.trim()) return alert('请输入昵称')
  userInfo.name = tempUser.name
  userInfo.avatar = tempUser.avatar
  isProfileEditing.value = false
}
const logout = () => router.push('/')


// --- 2. 作品 & 草稿箱 数据 ---
const currentTab = ref('works')
const worksList = ref([
  { id: 1, title: '春季通勤指南', color: '#ffccbc', desc: '专为职场新人设计的春日穿搭，主打干练与舒适。', items: ['西装外套', '白色内搭', '直筒裤'], date: '2024-03-20' },
  { id: 2, title: '复古丹宁风', color: '#b3e5fc', desc: '经典的牛仔元素叠加，回到80年代。', items: ['牛仔夹克', '阔腿裤'], date: '2024-03-18' },
  { id: 3, title: '极简黑白灰', color: '#cfd8dc', desc: 'Less is more，永不过时的配色。', items: ['黑色毛衣', '灰色半裙'], date: '2024-03-15' },
])
const draftsList = ref([
  { id: 101, title: '未命名草稿 1', color: '#e1bee7', desc: '', items: [], date: '2024-03-22' }
])
const currentList = computed(() => currentTab.value === 'works' ? worksList.value : draftsList.value)

// --- 3. 详情查看逻辑 (View Detail) ---
const isDetailOpen = ref(false)
const currentViewItem = ref({})

const openDetailModal = (item) => {
  currentViewItem.value = item
  isDetailOpen.value = true
}

const handleEditFromDetail = () => {
  // 从详情页跳转到编辑页
  isDetailOpen.value = false
  openEditModal('edit', currentViewItem.value)
}

const handleDeleteFromDetail = () => {
  if (!confirm('确定要删除吗？此操作无法撤销。')) return
  const targetList = currentTab.value === 'works' ? worksList : draftsList
  const index = targetList.value.findIndex(i => i.id === currentViewItem.value.id)
  if (index !== -1) targetList.value.splice(index, 1)
  isDetailOpen.value = false
}

// --- 4. 编辑/新建逻辑 (Edit Form) ---
const isEditOpen = ref(false)
const modalMode = ref('add')
const tempItem = reactive({ id: null, title: '', color: '', desc: '', itemsStr: '' })
const presetColors = ['#ffccbc', '#ffecb3', '#c8e6c9', '#b3e5fc', '#e1bee7', '#cfd8dc', '#262626']

const openEditModal = (mode, item = null) => {
  modalMode.value = mode
  if (mode === 'add') {
    tempItem.id = Date.now()
    tempItem.title = ''
    tempItem.desc = ''
    tempItem.itemsStr = ''
    tempItem.color = presetColors[Math.floor(Math.random() * 5)]
  } else {
    tempItem.id = item.id
    tempItem.title = item.title
    tempItem.desc = item.desc
    // 将数组转为字符串显示在输入框
    tempItem.itemsStr = item.items ? item.items.join(' ') : ''
    tempItem.color = item.color
  }
  isEditOpen.value = true
}

const saveItem = () => {
  if (!tempItem.title.trim()) return alert('请输入标题')
  
  const newItem = {
    id: tempItem.id,
    title: tempItem.title,
    desc: tempItem.desc,
    color: tempItem.color,
    // 将字符串转回数组
    items: tempItem.itemsStr.split(' ').filter(s => s.trim() !== ''),
    date: new Date().toISOString().split('T')[0]
  }

  const targetList = currentTab.value === 'works' ? worksList : draftsList
  
  if (modalMode.value === 'add') {
    targetList.value.unshift(newItem)
  } else {
    const index = targetList.value.findIndex(i => i.id === tempItem.id)
    if (index !== -1) targetList.value[index] = newItem
  }
  isEditOpen.value = false
  
  // 如果是从详情页进来的编辑，保存后可以重新打开详情页查看更新（可选）
  // openDetailModal(newItem) 
}
</script>

<style scoped>
.page-container { background-color: #fafafa; }

/* 个人信息卡片 (Style Resused) */
.profile-card { background: #fff; margin: 20px; padding: 25px; border-radius: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
.profile-top { display: flex; align-items: center; margin-bottom: 25px; }
.avatar-large { width: 70px; height: 70px; background-color: #d1f2eb; color: #00695c; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 24px; margin-right: 15px; background-size: cover; background-position: center; }
.info-text { flex: 1; }
.username { font-size: 20px; margin: 0 0 5px 0; }
.user-id { color: #999; font-size: 12px; }
.edit-btn { background: transparent; border: 1px solid #eee; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; }
.account-actions { border-top: 1px dashed #eee; padding-top: 15px; }
.action-item { background: #f9f9f9; border: none; width: 100%; padding: 12px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 13px; color: #666; font-weight: 600; cursor: pointer; }

/* 作品列表区 */
.works-section { background: #fff; border-radius: 30px 30px 0 0; padding: 20px; min-height: 400px; box-shadow: 0 -5px 20px rgba(0,0,0,0.02); display: flex; flex-direction: column; }
.tab-header { display: flex; gap: 30px; margin-bottom: 20px; padding-left: 10px; border-bottom: 1px solid #f0f0f0; padding-bottom: 10px; }
.tab-header span { font-size: 15px; color: #999; cursor: pointer; transition: all 0.2s; }
.tab-header span.active { color: #000; font-weight: bold; position: relative; font-size: 16px; }
.tab-header span.active::after { content: ''; position: absolute; bottom: -11px; left: 50%; transform: translateX(-50%); width: 20px; height: 3px; background: #000; border-radius: 2px; }
.works-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.work-item { aspect-ratio: 1; border-radius: 12px; display: flex; align-items: center; justify-content: center; position: relative; cursor: pointer; overflow: hidden; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
.work-item .work-title { color: #fff; font-size: 12px; font-weight: 600; text-align: center; padding: 5px; text-shadow: 0 1px 2px rgba(0,0,0,0.2); }
.work-item.add-item { background: #fff; border: 2px dashed #ddd; box-shadow: none; flex-direction: column; gap: 5px; color: #999; }
.add-item span { font-size: 10px; }

/* 通用弹窗层 */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(5px); z-index: 999; display: flex; align-items: center; justify-content: center; }

/* === 详情弹窗样式 === */
.detail-card { background: #fff; width: 85%; max-width: 360px; max-height: 80vh; border-radius: 24px; display: flex; flex-direction: column; overflow: hidden; animation: popIn 0.3s ease; }
.detail-header { padding: 15px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f5f5f5; }
.detail-header .actions { display: flex; gap: 10px; }
.icon-btn { border: none; background: #f5f5f5; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; }
.icon-btn.danger { background: #ffebee; color: #d32f2f; }
.detail-content { overflow-y: auto; padding-bottom: 20px; }
.big-cover { height: 250px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #fff; font-weight: bold; text-shadow: 0 2px 10px rgba(0,0,0,0.1); }
.info-block { padding: 20px 20px 0 20px; }
.info-block h3 { margin: 0 0 10px 0; font-size: 16px; font-weight: bold; }
.desc-text { font-size: 14px; color: #666; line-height: 1.6; }
.items-wrap { display: flex; flex-wrap: wrap; gap: 8px; }
.item-tag { background: #f5f5f5; padding: 6px 12px; border-radius: 8px; font-size: 13px; color: #333; }
.empty-tip { font-size: 12px; color: #ccc; font-style: italic; }
.meta-info { padding: 20px; color: #ccc; font-size: 12px; text-align: center; }

/* === 编辑弹窗样式 === */
.modal-card { background: #fff; width: 80%; max-width: 320px; padding: 25px; border-radius: 24px; animation: popIn 0.3s ease; }
@keyframes popIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
.modal-card h3 { text-align: center; margin-bottom: 20px; font-size: 18px; margin-top: 0; }
.input-group { margin-bottom: 15px; }
.input-group label { display: block; font-size: 12px; color: #666; margin-bottom: 8px; font-weight: 600; }
.modal-input { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 12px; font-size: 14px; outline: none; box-sizing: border-box; }
.modal-input.textarea { height: 80px; resize: none; font-family: inherit; }
.color-picker { display: flex; gap: 10px; flex-wrap: wrap; }
.color-dot { width: 30px; height: 30px; border-radius: 50%; cursor: pointer; border: 2px solid transparent; transition: transform 0.2s; }
.color-dot.selected { border-color: #000; transform: scale(1.1); }
.modal-actions { display: flex; gap: 10px; margin-top: 20px; }
.cancel-btn { flex: 1; padding: 12px; background: #f5f5f5; border: none; border-radius: 12px; color: #666; font-weight: 600; cursor: pointer; }
.save-btn { flex: 1.5; padding: 12px; background: #000; border: none; border-radius: 12px; color: #fff; font-weight: 600; cursor: pointer; }

/* 个人资料部分样式 (省略重复部分，已内联) */
.edit-avatar-area { display: flex; flex-direction: column; align-items: center; margin-bottom: 20px; cursor: pointer; }
.preview-circle { width: 80px; height: 80px; border-radius: 50%; background-color: #d1f2eb; color: #00695c; display: flex; align-items: center; justify-content: center; font-size: 28px; position: relative; overflow: hidden; background-size: cover; }
.camera-mask { position: absolute; inset: 0; background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; opacity: 0; }
.preview-circle:hover .camera-mask { opacity: 1; }
.tip { font-size: 12px; color: #999; margin-top: 5px; }
</style>