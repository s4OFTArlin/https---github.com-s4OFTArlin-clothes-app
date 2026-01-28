<script>
import { ref } from 'vue'

// 【核心修改】：将数据定义在 script setup 外部
// 这样组件销毁再回来时，不会重新执行初始化，unreadCount 依然是 0
const persistentChats = ref([
  {
    id: 1,
    name: '衣次元小助手',
    avatarText: '助',
    type: 'assistant',
    lastMsg: '您的春季穿搭指南已更新！',
    time: '14:20',
    unreadCount: 3 
  },
  {
    id: 2,
    name: '搭配师 Ann',
    avatarText: 'Ann',
    type: 'stylist',
    lastMsg: '建议尝试一下美拉德色系~',
    time: '昨天',
    unreadCount: 1 
  }
])
</script>

<script setup>
import { useRouter } from 'vue-router'
import { CheckCheck } from 'lucide-vue-next'

const router = useRouter()
const chats = persistentChats // 引用外部持久化的数据

const goToChat = (chat) => {
  // 1. 修改持久化数据中的未读数
  chat.unreadCount = 0

  // 2. 跳转
  router.push({
    path: '/user/message/chat',
    query: { name: chat.name }
  })
}
</script>

<template>
  <div class="message-container">
    <div class="header">
      <h2>消息中心</h2>
      <div class="header-icons">
        <CheckCheck :size="20" color="#666" />
      </div>
    </div>

    <div class="chat-list">
      <div 
        v-for="chat in chats" 
        :key="chat.id" 
        class="chat-item" 
        @click="goToChat(chat)"
      >
        <div :class="['avatar', chat.type]">
          {{ chat.avatarText }}
          <div v-if="chat.unreadCount > 0" class="unread-badge">
            {{ chat.unreadCount }}
          </div>
        </div>
        
        <div class="chat-info">
          <div class="top-row">
            <span class="name">{{ chat.name }}</span>
            <span class="time">{{ chat.time }}</span>
          </div>
          <div class="last-msg">{{ chat.lastMsg }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.message-container { height: 100vh; background: #fff; display: flex; flex-direction: column; }
.header { padding: 20px 15px 10px; display: flex; justify-content: space-between; align-items: center; }
.header h2 { font-size: 22px; font-weight: 800; margin: 0; }
.chat-list { flex: 1; overflow-y: auto; }

.chat-item { 
  display: flex; padding: 15px; gap: 12px; align-items: center; 
  cursor: pointer; transition: background 0.2s;
}
.chat-item:active { background: #fff5f8; }

.avatar {
  width: 54px; height: 54px; border-radius: 18px;
  display: flex; align-items: center; justify-content: center;
  font-weight: bold; font-size: 15px; position: relative; flex-shrink: 0;
}
.avatar.assistant { background: #e3f2fd; color: #1976d2; }
.avatar.stylist { background: #ff80ab; color: #fff; }

.unread-badge {
  position: absolute; top: -5px; right: -5px;
  background: #ff4081; color: white;
  font-size: 11px; min-width: 18px; height: 18px;
  padding: 0 5px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  border: 2px solid #fff;
}

.chat-info { flex: 1; border-bottom: 1px solid #f9f9f9; padding-bottom: 12px; overflow: hidden; }
.top-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
.name { font-weight: 600; font-size: 16px; color: #222; }
.time { font-size: 12px; color: #ccc; }
.last-msg { font-size: 13px; color: #999; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
</style>