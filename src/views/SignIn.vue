<template>
  <div class="login-container" :class="currentRole">
    <!-- 1. 顶部导航 -->
    <div class="nav-bar">
      <div class="back-btn" @click="goBack">
        <ChevronLeft :size="28" />
      </div>
    </div>

    <!-- 2. 欢迎标题 -->
    <div class="header-text">
      <h1>欢迎回来</h1>
      <p v-if="currentRole === 'stylist'">尊敬的搭配师，请登录您的工作台</p>
      <p v-else>登录以开启您的时尚之旅</p>
    </div>

    <!-- 3. 表单区域 -->
    <div class="form-area">
      <!-- 手机号 -->
      <div class="input-group">
        <div class="icon-slot">
          <Smartphone :size="20" />
        </div>
        <input type="tel" placeholder="请输入手机号" v-model="phone" maxlength="11" />
      </div>

      <!-- 验证码 (重点修复区域) -->
      <div class="input-group">
        <div class="icon-slot">
          <ShieldCheck :size="20" />
        </div>
        <input type="tel" placeholder="验证码" v-model="code" maxlength="6" />
        <button class="code-btn" :disabled="timer > 0" @click="sendCode">
          {{ timer > 0 ? `${timer}s后重试` : '获取验证码' }}
        </button>
      </div>

      <!-- 登录按钮 -->
      <button class="main-btn" @click="handleLogin">
        立即登录
        <ArrowRight :size="20" />
      </button>

      <!-- 协议勾选 -->
      <div class="agreement">
        <div class="checkbox" :class="{ checked: agreed }" @click="agreed = !agreed">
          <Check v-if="agreed" :size="12" color="#fff" />
        </div>
        <span>我已阅读并同意《服务条款》与《隐私协议》</span>
      </div>
    </div>

    <!-- 4. 第三方登录 -->
    <div class="social-login">
      <div class="divider">
        <span>其他方式登录</span>
      </div>
      <div class="social-icons">
        <div class="icon-circle wechat"><MessageCircle :size="24" color="#fff" /></div>
        <div class="icon-circle apple"><Aperture :size="24" color="#fff" /></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ChevronLeft, Smartphone, ShieldCheck, ArrowRight, Check, MessageCircle, Aperture } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const currentRole = computed(() => route.query.role || 'user')

const phone = ref('')
const code = ref('')
const timer = ref(0)
const agreed = ref(false)
let interval = null

const goBack = () => router.back()

const sendCode = () => {
  if (!phone.value) return alert('请输入手机号')
  timer.value = 60
  interval = setInterval(() => {
    timer.value--
    if (timer.value <= 0) clearInterval(interval)
  }, 1000)
  setTimeout(() => { code.value = '123456' }, 1000)
}

const handleLogin = () => {
  if (!phone.value || !code.value) return alert('请完善登录信息')
  if (!agreed.value) return alert('请先同意协议')
  if (currentRole.value === 'stylist') {
    router.push('/stylist')
  } else {
    router.push('/user')
  }
}

onUnmounted(() => clearInterval(interval))
</script>

<style scoped>
.login-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px 30px;
  background: #fff;
  transition: background 0.3s;
  box-sizing: border-box; /* 防止 padding 撑大 */
}

/* --- 配色方案 --- */
.login-container.stylist { background: linear-gradient(180deg, #e0f2f1 0%, #fff 40%); }
.login-container.stylist .main-btn { background: #00695c; box-shadow: 0 8px 20px rgba(0, 105, 92, 0.3); }
.login-container.stylist .code-btn { color: #00695c; }
.login-container.stylist .checkbox.checked { background: #00695c; border-color: #00695c; }
.login-container.stylist .icon-slot { color: #00695c; }

.login-container.user { background: linear-gradient(180deg, #fce4ec 0%, #fff 40%); }
.login-container.user .main-btn { background: #d81b60; box-shadow: 0 8px 20px rgba(216, 27, 96, 0.3); }
.login-container.user .code-btn { color: #d81b60; }
.login-container.user .checkbox.checked { background: #d81b60; border-color: #d81b60; }
.login-container.user .icon-slot { color: #d81b60; }

/* 导航 */
.nav-bar { height: 44px; display: flex; align-items: center; margin-bottom: 20px; }
.back-btn { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.6); cursor: pointer; }

/* 标题 */
.header-text { margin-bottom: 40px; }
.header-text h1 { font-size: 28px; margin: 0 0 10px 0; }
.header-text p { color: #666; margin: 0; font-size: 14px; }

/* 表单 */
.form-area { flex: 1; display: flex; flex-direction: column; gap: 20px; }

/* ⬇️⬇️⬇️ 关键修复部分 ⬇️⬇️⬇️ */
.input-group {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 16px;
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 15px; /* 稍微减小内边距 */
  transition: border 0.2s;
  overflow: hidden; /* 防止内容溢出 */
}
.input-group:focus-within { border-color: #ccc; }

.icon-slot { 
  margin-right: 10px; /* 减小图标间距 */
  display: flex; 
  align-items: center;
  flex-shrink: 0; /* 防止图标被压缩 */
}

.input-group input { 
  border: none; 
  outline: none; 
  font-size: 16px; 
  background: transparent; 
  height: 100%;
  
  /* ⚠️ 核心修复：允许输入框无限缩小，以便腾出空间给按钮 */
  flex: 1;
  min-width: 0; 
}

.code-btn { 
  background: none; 
  border: none; 
  font-weight: 600; 
  cursor: pointer; 
  white-space: nowrap; /* 禁止文字换行 */
  
  /* 样式调整 */
  padding-left: 10px; 
  border-left: 1px solid #eee; 
  height: 24px; 
  line-height: 24px;
  font-size: 13px; /* 稍微调小字号 */
  
  /* ⚠️ 核心修复：防止按钮被压缩 */
  flex-shrink: 0; 
}
/* ⬆️⬆️⬆️ 关键修复结束 ⬆️⬆️⬆️ */

.code-btn:disabled { color: #ccc; }

.main-btn {
  height: 60px;
  border-radius: 30px;
  border: none;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  margin-top: 10px;
}
.main-btn:active { transform: scale(0.98); opacity: 0.9; }

/* 协议 */
.agreement { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #999; justify-content: center; margin-top: 10px; }
.checkbox { width: 16px; height: 16px; border: 1px solid #ccc; border-radius: 4px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; flex-shrink: 0; }

/* 底部第三方 */
.social-login { margin-top: auto; padding-bottom: 20px; }
.divider { text-align: center; margin-bottom: 20px; position: relative; }
.divider span { background: #fff; padding: 0 10px; color: #ccc; font-size: 12px; position: relative; z-index: 1; }
.divider::after { content: ''; position: absolute; top: 50%; left: 0; width: 100%; height: 1px; background: #eee; }

.social-icons { display: flex; justify-content: center; gap: 30px; }
.icon-circle { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.2s; }
.icon-circle:active { transform: scale(0.9); }
.wechat { background: #07c160; box-shadow: 0 4px 10px rgba(7, 193, 96, 0.3); }
.apple { background: #000; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3); }
</style>