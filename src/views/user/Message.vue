<template>
  <div class="page-container">
    <div class="header">
      <h2>消息中心</h2>
      <div class="badge">2条未读</div>
    </div>

    <div class="msg-list">
      
      <!-- 1. 搭配师对话 (可点击跳转) -->
      <div class="msg-item active" @click="openChat('专属搭配师_Lin')">
        <div class="avatar-wrap">
          <div class="avatar stylist">STY</div>
          <div class="online-dot"></div>
        </div>
        <div class="msg-content">
          <div class="msg-top">
            <span class="username">专属搭配师_Lin</span>
            <span class="time">刚刚</span>
          </div>
          <p class="last-msg">亲，这边根据您的身材数据推荐了两套...</p>
        </div>
      </div>

      <!-- 2. 系统消息 (不可跳转或做简单处理) -->
      <div class="msg-item system-item">
        <div class="avatar-wrap">
          <div class="avatar system">SYS</div>
        </div>
        <div class="msg-content">
          <div class="msg-top">
            <span class="username">衣次元小助手</span>
            <span class="time">昨天</span>
          </div>
          <p class="last-msg">您的订单已发货，请注意查收。</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const openChat = (name) => {
  // 跳转并带上名字参数
  router.push(`/user/message/chat?name=${name}`)
}
</script>

<style scoped>
.page-container { background: #fff; padding: 20px; }

.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
.badge { font-size: 12px; background: #ff80ab; color: #fff; padding: 4px 10px; border-radius: 10px; }

.msg-list { display: flex; flex-direction: column; gap: 20px; }

.msg-item { 
  display: flex; gap: 15px; align-items: center; 
  padding: 15px; border-radius: 16px; 
  transition: background 0.2s; 
  cursor: pointer; /* 变为手型 */
}

/* 按压反馈 */
.msg-item:active, .msg-item.active { background: #f9f9f9; }

/* 系统消息稍微淡一点，区分开 */
.system-item { opacity: 0.8; }

.avatar-wrap { position: relative; }
.avatar { width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; font-size: 14px; }
.avatar.stylist { background: #a7ffeb; color: #00695c; }
.avatar.system { background: #eee; color: #666; }
.online-dot { width: 12px; height: 12px; background: #4caf50; border: 2px solid #fff; border-radius: 50%; position: absolute; bottom: 0; right: 0; }

.msg-content { flex: 1; }
.msg-top { display: flex; justify-content: space-between; margin-bottom: 5px; }
.username { font-weight: 600; font-size: 15px; }
.time { color: #ccc; font-size: 12px; }
.last-msg { color: #888; font-size: 13px; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px; }
</style>