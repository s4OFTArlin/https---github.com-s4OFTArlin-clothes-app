<template>
  <div class="page-wrapper">
    <div class="nav-bar">
      <div class="left" @click="router.back()">
        <ChevronLeft :size="24" />
      </div>
      <div class="title-area">
        <div class="main-title">官方客服</div>
        <div class="sub-title">
          <div class="dot"></div> 在线中
        </div>
      </div>
      <div class="right">
        <MoreHorizontal :size="24" />
      </div>
    </div>

    <div class="chat-area" ref="chatBox">
      <div class="time-stamp">今天 上午 10:23</div>
      
      <div class="msg-row left">
        <div class="avatar service">衣</div>
        <div class="bubble">
          <p>亲爱的用户您好 👋，我是衣次元官方助理。您可以咨询关于订单、物流或退换货的问题。</p>
        </div>
      </div>

      <div 
        class="msg-row" 
        v-for="msg in messages" 
        :key="msg.id"
        :class="msg.role === 'user' ? 'right' : 'left'"
      >
        <div v-if="msg.role === 'service'" class="avatar service">衣</div>
        <div v-else class="avatar user">U</div>
        
        <div class="bubble">
          {{ msg.text }}
        </div>
      </div>
      <div class="safe-area-inset"></div>
    </div>

    <div class="input-fixed-footer">
      <div class="input-container">
        <PlusCircle :size="22" color="#666" />
        <input 
          type="text" 
          v-model="inputText" 
          placeholder="描述您的问题..." 
          @keyup.enter="handleSendMessage"
        >
        <Smile :size="22" color="#666" />
      </div>
      <button 
        class="send-btn-black" 
        @click="handleSendMessage" 
        :disabled="!inputText.trim()"
      >
        发送
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeft, MoreHorizontal, PlusCircle, Smile } from 'lucide-vue-next'

const router = useRouter()
const inputText = ref('')
const chatBox = ref(null)

const messages = ref([
  { id: 1, role: 'service', text: '您可以输入关键词查询：\n1. 订单发货进度\n2. 退换货流程\n3. 尺码咨询' }
])

const serviceReplies = [
  "收到，正在为您查询后台数据，请稍等。",
  "如需办理退换货，请确保吊牌未拆除且不影响二次销售。",
  "当前的物流由于天气原因可能稍有延迟，请您谅解。",
  "客服已收到您的消息，稍后将由人工专员为您接入。"
]

const scrollToBottom = () => {
  nextTick(() => {
    if (chatBox.value) chatBox.value.scrollTop = chatBox.value.scrollHeight
  })
}

const handleSendMessage = () => {
  const text = inputText.value.trim()
  if (!text) return

  messages.value.push({ id: Date.now(), role: 'user', text: text })
  inputText.value = ''
  scrollToBottom()

  setTimeout(() => {
    const randomIdx = Math.floor(Math.random() * serviceReplies.length)
    messages.value.push({ id: Date.now() + 1, role: 'service', text: serviceReplies[randomIdx] })
    scrollToBottom()
  }, 800)
}

onMounted(() => scrollToBottom())
</script>

<style scoped>
/* 整个容器使用 fixed 铺满全屏，盖住下方的导航栏 */
.page-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #f8f8f8;
  z-index: 999; /* 关键：确保层级高于底部导航栏 */
  display: flex;
  flex-direction: column;
}

.nav-bar {
  height: 54px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  border-bottom: 1px solid #eee;
  flex-shrink: 0;
}

.main-title { font-size: 16px; font-weight: 700; color: #000; }
.sub-title { font-size: 10px; color: #4caf50; display: flex; align-items: center; gap: 4px; }
.dot { width: 6px; height: 6px; background: #4caf50; border-radius: 50%; }

.chat-area {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.msg-row { display: flex; gap: 10px; max-width: 85%; }
.msg-row.left { align-self: flex-start; }
.msg-row.right { align-self: flex-end; flex-direction: row-reverse; }

.avatar {
  width: 36px; height: 36px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; font-weight: bold; flex-shrink: 0;
}
.avatar.service { background: #000; color: #fff; }
.avatar.user { background: #ddd; color: #333; }

.bubble {
  padding: 12px 14px; border-radius: 12px;
  font-size: 14px; line-height: 1.5;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}
.msg-row.left .bubble { background: #fff; color: #333; border-top-left-radius: 2px; }
.msg-row.right .bubble { background: #000; color: #fff; border-top-right-radius: 2px; }

/* 底部输入框强制固定 */
.input-fixed-footer {
  background: #fff;
  padding: 10px 15px;
  padding-bottom: calc(10px + env(safe-area-inset-bottom));
  display: flex;
  align-items: center;
  gap: 10px;
  border-top: 1px solid #eee;
}

.input-container {
  flex: 1; background: #f5f5f5; border-radius: 20px;
  height: 40px; display: flex; align-items: center;
  padding: 0 12px; gap: 8px;
}

.input-container input {
  flex: 1; background: transparent; border: none;
  outline: none; font-size: 14px;
}

.send-btn-black {
  background: #000; color: #fff; border: none;
  padding: 0 18px; height: 36px; border-radius: 18px;
  font-size: 14px; font-weight: 600;
}

.send-btn-black:disabled { background: #ccc; }

.safe-area-inset { height: 20px; }
</style>