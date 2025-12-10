<template>
  <div class="page-container">
    <!-- 1. 顶部导航 -->
    <div class="nav-bar">
      <div class="left" @click="goBack">
        <ChevronLeft :size="24" />
      </div>
      <div class="title-area">
        <div class="main-title">{{ targetName }}</div>
        <div class="sub-title">
          <div class="dot"></div> 在线
        </div>
      </div>
      <div class="right">
        <MoreHorizontal :size="24" />
      </div>
    </div>

    <!-- 2. 聊天内容区 -->
    <div class="chat-area" ref="chatBox">
      <div class="time-stamp">上午 10:23</div>

      <!-- 历史消息模拟 -->
      <div class="msg-row left">
        <div class="avatar stylist">STY</div>
        <div class="bubble">
          <p>亲，根据您的身材数据（梨形身材），这边给您推荐了两套春季穿搭，稍后发给您看看哦~ 👗</p>
        </div>
      </div>

      <!-- 动态消息渲染 -->
      <div 
        class="msg-row" 
        v-for="msg in messages" 
        :key="msg.id"
        :class="msg.role === 'user' ? 'right' : 'left'"
      >
        <!-- 头像判断 -->
        <div v-if="msg.role === 'other'" class="avatar stylist">STY</div>
        <div v-else class="avatar user">U</div>
        
        <!-- 气泡 -->
        <div class="bubble">
          {{ msg.text }}
        </div>
      </div>
    </div>

    <!-- 3. 底部输入区 -->
    <div class="input-area">
      <button class="tool-btn"><Image :size="24" color="#999" /></button>
      <input 
        type="text" 
        v-model="inputText" 
        placeholder="发送消息..." 
        @keydown.enter="sendMessage"
      >
      <button class="send-btn" @click="sendMessage" :disabled="!inputText.trim()">
        <Send :size="18" color="#fff" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ChevronLeft, MoreHorizontal, Image, Send } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const chatBox = ref(null)

// 获取路由参数中的名字
const targetName = ref(route.query.name || '搭配师')

const inputText = ref('')
const messages = ref([])

const goBack = () => router.back()

const scrollToBottom = () => {
  nextTick(() => {
    if (chatBox.value) chatBox.value.scrollTop = chatBox.value.scrollHeight
  })
}

const sendMessage = () => {
  const text = inputText.value.trim()
  if (!text) return

  // 1. 用户发送
  messages.value.push({ id: Date.now(), role: 'user', text })
  inputText.value = ''
  scrollToBottom()

  // 2. 模拟搭配师回复
  setTimeout(() => {
    messages.value.push({
      id: Date.now() + 1,
      role: 'other',
      text: `收到！关于"${text}"的问题，我这就去衣橱帮您挑选合适的单品，请稍等哈~`
    })
    scrollToBottom()
  }, 1200)
}
</script>

<style scoped>
.page-container { background: #f5f5f5; height: 100%; display: flex; flex-direction: column; }

/* 导航栏 */
.nav-bar { height: 50px; display: flex; align-items: center; justify-content: space-between; padding: 0 15px; background: #fff; border-bottom: 1px solid #eee; flex-shrink: 0; }
.title-area { text-align: center; }
.main-title { font-size: 16px; font-weight: 600; }
.sub-title { font-size: 10px; color: #4caf50; display: flex; align-items: center; justify-content: center; gap: 4px; }
.dot { width: 6px; height: 6px; background: #4caf50; border-radius: 50%; }

/* 聊天区 */
.chat-area { flex: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 20px; }
.time-stamp { text-align: center; font-size: 12px; color: #ccc; margin-bottom: 10px; }

.msg-row { display: flex; gap: 10px; max-width: 85%; }
.msg-row.left { align-self: flex-start; }
.msg-row.right { align-self: flex-end; flex-direction: row-reverse; }

.avatar { width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; flex-shrink: 0; }
/* 搭配师头像：薄荷绿 */
.avatar.stylist { background: #a7ffeb; color: #00695c; border: 1px solid #b2dfdb; }
/* 用户头像：粉色 */
.avatar.user { background: #ff80ab; color: #fff; }

.bubble { padding: 10px 14px; border-radius: 12px; font-size: 14px; line-height: 1.5; position: relative; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }

/* 对方气泡（左） */
.msg-row.left .bubble { background: #fff; color: #333; border-top-left-radius: 2px; }
/* 我方气泡（右） */
.msg-row.right .bubble { background: #ff80ab; color: #fff; border-top-right-radius: 2px; }

/* 输入区 */
.input-area { background: #fff; padding: 8px 10px; display: flex; align-items: center; gap: 10px; border-top: 1px solid #eee; flex-shrink: 0; margin-bottom: 0; }
.tool-btn { background: none; border: none; padding: 0; cursor: pointer; }
.input-area input { flex: 1; background: #f5f5f5; border: none; border-radius: 20px; height: 36px; padding: 0 15px; outline: none; font-size: 14px; }
.send-btn { width: 36px; height: 36px; border-radius: 50%; background: #ff80ab; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: opacity 0.2s; }
.send-btn:disabled { background: #eee; cursor: not-allowed; }
</style>