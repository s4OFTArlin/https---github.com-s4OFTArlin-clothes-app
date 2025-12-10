<template>
  <div class="page-container">
    <!-- 1. 顶部导航 -->
    <div class="nav-bar">
      <div class="left" @click="goBack">
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

    <!-- 2. 消息列表区 -->
    <div class="chat-area" ref="chatBox">
      <div class="time-stamp">上午 10:23</div>
      
      <!-- 欢迎语 -->
      <div class="msg-row left">
        <div class="avatar service">衣</div>
        <div class="bubble">
          <p>亲爱的用户您好 👋，我是衣次元智能助手，请问有什么可以帮您？</p>
        </div>
      </div>

      <!-- 动态消息列表 -->
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
    </div>

    <!-- 3. 底部输入区 -->
    <div class="input-area">
      <button class="tool-btn"><PlusCircle :size="24" color="#999" /></button>
      <input 
        type="text" 
        v-model="inputText" 
        placeholder="想咨询什么问题..." 
        @keydown.enter="sendMessage"
      >
      <button class="send-btn" @click="sendMessage" :disabled="!inputText.trim()">
        <Send :size="20" color="#fff" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeft, MoreHorizontal, PlusCircle, Send } from 'lucide-vue-next'

const router = useRouter()
const goBack = () => router.back()

const inputText = ref('')
const chatBox = ref(null)

const messages = ref([
  { id: 1, role: 'service', text: '您可以查询：\n1. 订单发货进度\n2. 退换货流程\n3. 尺码咨询' }
])

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (chatBox.value) {
      chatBox.value.scrollTop = chatBox.value.scrollHeight
    }
  })
}

// 发送消息
const sendMessage = () => {
  const text = inputText.value.trim()
  if (!text) return

  // 1. 添加用户消息
  messages.value.push({
    id: Date.now(),
    role: 'user',
    text: text
  })
  inputText.value = ''
  scrollToBottom()

  // 2. 模拟自动回复
  setTimeout(() => {
    messages.value.push({
      id: Date.now() + 1,
      role: 'service',
      text: '收到您的反馈！人工客服正忙，我们会尽快处理您的问题：“' + text + '”'
    })
    scrollToBottom()
  }, 1000)
}
</script>

<style scoped>
.page-container {
  background: #f5f5f5;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 顶部导航 */
.nav-bar {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  background: #fff;
  border-bottom: 1px solid #eee;
  flex-shrink: 0;
}
.title-area { text-align: center; }
.main-title { font-size: 16px; font-weight: 600; }
.sub-title { font-size: 10px; color: #4caf50; display: flex; align-items: center; justify-content: center; gap: 4px; }
.dot { width: 6px; height: 6px; background: #4caf50; border-radius: 50%; }

/* 聊天区域 */
.chat-area {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.time-stamp { text-align: center; font-size: 12px; color: #ccc; margin-bottom: 10px; }

.msg-row { display: flex; gap: 10px; max-width: 80%; }
.msg-row.left { align-self: flex-start; }
.msg-row.right { align-self: flex-end; flex-direction: row-reverse; }

.avatar {
  width: 36px; height: 36px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; font-weight: bold;
  flex-shrink: 0;
}
.avatar.service { background: #fff; color: #333; border: 1px solid #ddd; }
.avatar.user { background: #ff80ab; color: #fff; }

.bubble {
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-wrap; /* 支持换行 */
  position: relative;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.msg-row.left .bubble {
  background: #fff;
  color: #333;
  border-top-left-radius: 2px;
}

.msg-row.right .bubble {
  background: #ff80ab; /* 用户粉色主题 */
  color: #fff;
  border-top-right-radius: 2px;
}

/* 底部输入框 */
.input-area {
  background: #fff;
  min-height: 50px;
  padding: 8px 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-top: 1px solid #eee;
  flex-shrink: 0;
}
.tool-btn { background: none; border: none; padding: 0; cursor: pointer; }
.input-area input {
  flex: 1;
  background: #f5f5f5;
  border: none;
  border-radius: 20px;
  height: 36px;
  padding: 0 15px;
  outline: none;
  font-size: 14px;
}
.send-btn {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: #ff80ab;
  border: none;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: opacity 0.2s;
}
.send-btn:disabled { background: #eee; cursor: not-allowed; }
</style>