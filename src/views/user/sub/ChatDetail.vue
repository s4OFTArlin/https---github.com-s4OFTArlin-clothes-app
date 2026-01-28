<template>
  <div class="chat-detail-page">
    <div class="nav-bar">
      <div class="left-action" @click="router.back()">
        <ChevronLeft :size="24" />
      </div>
      <div class="chat-title">
        <span class="main-name">{{ targetName }}</span>
        <span class="status"><i class="online-dot"></i> 在线答疑</span>
      </div>
      <div class="right-action">
        <MoreHorizontal :size="24" />
      </div>
    </div>

    <div class="chat-content" ref="chatBox">
      <div class="time-divider">下午 14:02</div>
      
      <div 
        v-for="msg in messages" 
        :key="msg.id" 
        :class="['message-row', msg.role === 'user' ? 'is-me' : 'is-other']"
      >
        <div class="avatar">
          {{ msg.role === 'user' ? 'U' : 'Ann' }}
        </div>
        
        <div v-if="msg.type === 'text'" class="bubble">
          {{ msg.text }}
        </div>

        <div v-else-if="msg.type === 'service-card'" class="bubble service-card" @click="openServiceModal">
          <div class="card-header">
            <Settings2 :size="16" color="#ff4081" />
            <span>系统推荐</span>
          </div>
          <div class="card-body">
            <h4>点击选择服务套餐</h4>
            <p>为您匹配最合适的搭配咨询方案</p>
          </div>
          <div class="card-footer">立即选择</div>
        </div>
      </div>
    </div>

    <div class="footer-input-bar">
      <div class="input-wrapper">
        <Plus :size="22" color="#999" />
        <input 
          v-model="inputText" 
          type="text" 
          placeholder="咨询搭配建议..." 
          @keyup.enter="handleSendMessage"
        />
        <Smile :size="22" color="#999" />
      </div>
      <button 
        class="send-btn-action" 
        @click="handleSendMessage"
        :disabled="!inputText.trim()"
      >
        发送
      </button>
    </div>

    <Teleport to="body">
      <div class="modal-overlay" v-if="showServiceModal" @click.self="showServiceModal = false">
        <div class="service-modal">
          <div class="modal-header">
            <h3>选择咨询套餐</h3>
            <p>点击选项进行预览，确认后发送</p>
          </div>
          
          <div class="options-list">
            <div 
              v-for="(pkg, index) in pricePackages" 
              :key="index" 
              class="option-item"
              :class="{ 'is-selected': tempSelectedIndex === index }"
              @click="tempSelectedIndex = index"
            >
              <div class="opt-main">
                <span class="opt-title">{{ pkg.title }}</span>
                <span class="opt-desc">{{ pkg.desc }}</span>
              </div>
              <div class="opt-price">
                <span class="unit">￥</span>{{ pkg.price }}
              </div>
              <div class="select-check" v-if="tempSelectedIndex === index">
                <Check :size="12" color="#fff" strokeWidth="4" />
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-cancel" @click="showServiceModal = false">取消</button>
            <button 
              class="btn-confirm" 
              :disabled="tempSelectedIndex === null"
              @click="confirmFinalSelection"
            >
              确定选择
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ChevronLeft, MoreHorizontal, Plus, Smile, Settings2, Check } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const chatBox = ref(null)

const targetName = ref(route.query.name || '搭配师')
const inputText = ref('')
const showServiceModal = ref(false)
const tempSelectedIndex = ref(null) // 记录弹窗内选中的索引

// 初始消息
const messages = ref([
  { id: 1, role: 'other', type: 'text', text: `您好！我是您的私人顾问 ${targetName.value}，请问有什么可以帮您？` }
])

// 套餐策略
const pricePackages = [
  { title: '基础入门', desc: '三次搭配一次修改', price: '6.9 起', text: '我想购买：三次搭配一次修改（6.9元）' },
  { title: '进阶超值', desc: '五次搭配二次修改', price: '12.9 起', text: '我想购买：五次搭配二次修改（12.9元）' },
  { title: '专业全能', desc: '七次搭配四次修改', price: '18.9 起', text: '我想购买：七次搭配四次修改（18.9元）' }
]

const scrollToEnd = () => {
  nextTick(() => {
    if (chatBox.value) chatBox.value.scrollTop = chatBox.value.scrollHeight
  })
}

const openServiceModal = () => {
  tempSelectedIndex.value = null // 每次打开重置选择
  showServiceModal.value = true
}

// 确认最终选择
const confirmFinalSelection = () => {
  if (tempSelectedIndex.value === null) return
  const pkg = pricePackages[tempSelectedIndex.value]
  showServiceModal.value = false
  
  // 1. 用户自动发送选择
  handleSendMessage(pkg.text)
  
  // 2. 模拟顾问回复
  setTimeout(() => {
    messages.value.push({
      id: Date.now() + 2,
      role: 'other',
      type: 'text',
      text: `收到！已为您锁定套餐。请点击首页“身材资料”上传您的最新全身照，我将为您开始量身设计。`
    })
    scrollToEnd()
  }, 1000)
}

const handleSendMessage = (customText = null) => {
  const content = typeof customText === 'string' ? customText : inputText.value.trim()
  if (!content) return

  messages.value.push({
    id: Date.now(),
    role: 'user',
    type: 'text',
    text: content
  })
  if (typeof customText !== 'string') inputText.value = ''
  scrollToEnd()
}

onMounted(() => {
  scrollToEnd()
  // 1秒后自动弹出推荐卡片
  setTimeout(() => {
    messages.value.push({ id: Date.now(), role: 'other', type: 'service-card' })
    scrollToEnd()
  }, 1000)
})
</script>

<style scoped>
/* 页面基础布局 */
.chat-detail-page { display: flex; flex-direction: column; height: 100vh; background: #f8f8f8; position: fixed; inset: 0; z-index: 1000; }

/* 导航栏 */
.nav-bar { height: 54px; background: #fff; display: flex; align-items: center; justify-content: space-between; padding: 0 15px; border-bottom: 1px solid #eee; flex-shrink: 0; }
.chat-title { text-align: center; }
.main-name { font-size: 16px; font-weight: 700; display: block; }
.status { font-size: 10px; color: #ff4081; display: flex; align-items: center; justify-content: center; gap: 3px; }
.online-dot { width: 6px; height: 6px; background: #ff4081; border-radius: 50%; }

/* 聊天内容区 */
.chat-content { flex: 1; overflow-y: auto; padding: 20px 15px; display: flex; flex-direction: column; gap: 20px; }
.time-divider { text-align: center; color: #ccc; font-size: 12px; }

/* 气泡通用 */
.message-row { display: flex; gap: 10px; max-width: 85%; }
.message-row.is-other { align-self: flex-start; }
.message-row.is-me { align-self: flex-end; flex-direction: row-reverse; }

.avatar { width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold; flex-shrink: 0; }
.is-other .avatar { background: #a7ffeb; color: #00695c; }
.is-me .avatar { background: #ff80ab; color: #fff; }

.bubble { padding: 12px 14px; border-radius: 14px; font-size: 14px; line-height: 1.4; box-shadow: 0 2px 5px rgba(0,0,0,0.02); }
.is-other .bubble { background: #fff; color: #333; border-top-left-radius: 2px; }
.is-me .bubble { background: #ff4081; color: #fff; border-top-right-radius: 2px; }

/* 系统推荐卡片样式 */
.service-card { cursor: pointer; border: 1px solid #ffecf2 !important; width: 220px; padding: 0 !important; overflow: hidden; background: #fff !important; }
.card-header { background: #fff5f8; padding: 8px 12px; display: flex; align-items: center; gap: 6px; font-size: 12px; color: #ff4081; font-weight: 600; border-bottom: 1px solid #ffecf2; }
.card-body { padding: 12px; }
.card-body h4 { margin: 0; font-size: 15px; color: #333; }
.card-body p { margin: 4px 0 0; font-size: 12px; color: #999; }
.card-footer { border-top: 1px solid #f5f5f5; padding: 8px; text-align: center; color: #ff4081; font-size: 13px; font-weight: 600; }

/* 底部输入框 */
.footer-input-bar { background: #fff; border-top: 1px solid #eee; padding: 10px 12px; padding-bottom: calc(10px + env(safe-area-inset-bottom)); display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.input-wrapper { flex: 1; background: #f2f2f2; border-radius: 20px; display: flex; align-items: center; padding: 0 12px; gap: 8px; }
.input-wrapper input { flex: 1; height: 38px; border: none; background: transparent; outline: none; font-size: 14px; }
.send-btn-action { background: #ff4081; color: #fff; border: none; padding: 8px 16px; border-radius: 18px; font-size: 14px; font-weight: 600; }

/* 弹窗 Overlay */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: flex-end; z-index: 2001; }
.service-modal { background: #fff; width: 100%; border-radius: 20px 20px 0 0; padding: 20px; animation: slideUp 0.3s ease-out; }
.modal-header { text-align: center; margin-bottom: 20px; }
.modal-header h3 { margin: 0; font-size: 17px; }
.modal-header p { font-size: 12px; color: #999; margin-top: 4px; }

/* 套餐列表及选中态 */
.options-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 25px; }
.option-item { 
  background: #f9f9f9; padding: 15px; border-radius: 12px; 
  display: flex; justify-content: space-between; align-items: center; 
  border: 2px solid transparent; transition: 0.2s; position: relative;
}
.option-item.is-selected { background: #fff; border-color: #ff4081; }
.opt-main { display: flex; flex-direction: column; gap: 2px; }
.opt-title { font-size: 15px; font-weight: 700; color: #333; }
.opt-desc { font-size: 11px; color: #666; }
.opt-price { color: #ff4081; font-size: 19px; font-weight: 800; }
.select-check { 
  position: absolute; top: -6px; right: -6px; background: #ff4081; 
  width: 18px; height: 18px; border-radius: 50%; display: flex; 
  align-items: center; justify-content: center; border: 2px solid #fff; 
}

/* 弹窗底部按钮 */
.modal-footer { display: flex; gap: 10px; }
.btn-cancel { flex: 1; padding: 14px; border-radius: 25px; border: none; background: #f5f5f5; color: #666; font-weight: 600; }
.btn-confirm { flex: 2; padding: 14px; border-radius: 25px; border: none; background: #1a1a1a; color: #e0c080; font-weight: 700; }
.btn-confirm:disabled { opacity: 0.3; }

@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
</style>