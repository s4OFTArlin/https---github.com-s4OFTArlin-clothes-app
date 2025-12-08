<template>
  <div class="login-container">
    <!-- 1. 顶部 Logo / 标题区域 -->
    <div class="header-section">
      <!-- 歪歪的 Logo 盒子 -->
      <div class="logo-box">
        <span class="logo-text">衣</span>
        <!-- 装饰：Logo 上的小皇冠 -->
        <Crown :size="24" color="#ffd700" class="logo-deco" />
      </div>
      <h1 class="app-name">衣次元</h1>
      <p class="app-desc">你的卡通穿搭宇宙</p>
    </div>

    <!-- 2. 身份选择区域 -->
    <div class="select-section">
      
      <!-- 搭配师入口：薄荷绿 -->
      <div class="role-card mint-green" @click="handleLogin('stylist')">
        <!-- 卡通图标贴纸组 -->
        <div class="sticker-group">
          <div class="main-circle">
            <Palette :size="28" color="#00897b" stroke-width="2.5" />
          </div>
          <!-- 装饰小图标：闪烁星星 -->
          <div class="mini-badge star">
            <Sparkles :size="14" color="#fff" fill="#fdd835" />
          </div>
        </div>
        
        <div class="card-info">
          <span class="role-title">我是搭配师</span>
          <span class="role-sub">创造潮流风尚</span>
        </div>
        
        <div class="arrow-icon">
          <ChevronRight :size="24" color="#00897b" />
        </div>
      </div>

      <!-- 用户入口：淡粉色 -->
      <div class="role-card pale-pink" @click="handleLogin('user')">
        <!-- 卡通图标贴纸组 -->
        <div class="sticker-group">
          <div class="main-circle">
            <ShoppingBag :size="28" color="#d81b60" stroke-width="2.5" />
          </div>
          <!-- 装饰小图标：爱心 -->
          <div class="mini-badge heart">
            <Heart :size="14" color="#fff" fill="#ff4081" />
          </div>
        </div>

        <div class="card-info">
          <span class="role-title">我是用户</span>
          <span class="role-sub">发现美好穿搭</span>
        </div>
        
        <div class="arrow-icon">
          <ChevronRight :size="24" color="#d81b60" />
        </div>
      </div>

    </div>

    <!-- 3. 底部版权 -->
    <div class="footer-section">
      <p>© 2024 YICIYUAN APP</p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
// 引入更多装饰图标
import { Palette, ShoppingBag, ChevronRight, Sparkles, Heart, Crown } from 'lucide-vue-next'

const router = useRouter()

const handleLogin = (role) => {
  // 跳转到我们在上一步创建的统一登录页
  router.push(`/login?role=${role}`)
}
</script>

<style scoped>
/* 全屏容器 */
.login-container {
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  padding: 40px 30px;
  box-sizing: border-box;
}

/* 顶部区域 */
.header-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.logo-box {
  width: 70px;
  height: 70px;
  background-color: #262626;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(-8deg); /* 卡通歪斜感 */
  box-shadow: 4px 4px 0px rgba(0,0,0,0.1);
  margin-bottom: 20px;
  position: relative;
}

.logo-text {
  color: #fff;
  font-size: 36px;
  font-weight: bold;
}

/* Logo 上的小皇冠装饰 */
.logo-deco {
  position: absolute;
  top: -15px;
  right: -10px;
  transform: rotate(15deg);
  filter: drop-shadow(2px 2px 0px rgba(0,0,0,0.2));
}

.app-name {
  font-size: 32px;
  color: #333;
  margin: 0 0 10px 0;
  letter-spacing: 2px;
  font-family: 'Arial Rounded MT Bold', sans-serif;
}

.app-desc {
  font-size: 14px;
  color: #aaa;
  margin: 0;
}

/* 按钮区域 */
.select-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 60px;
}

/* 卡片通用样式 */
.role-card {
  height: 90px;
  border-radius: 24px; /* 大圆角 */
  display: flex;
  align-items: center;
  padding: 0 20px;
  cursor: pointer;
  transition: transform 0.1s, opacity 0.2s;
  position: relative;
  overflow: visible; /* 允许装饰物超出边界 */
}

.role-card:active {
  transform: scale(0.97);
  opacity: 0.9;
}

/* --- 配色方案 --- */
.mint-green { background-color: #d1f2eb; }
.mint-green .role-title { color: #00695c; }
.mint-green .role-sub   { color: #4db6ac; }

.pale-pink { background-color: #fce4ec; }
.pale-pink .role-title { color: #880e4f; }
.pale-pink .role-sub   { color: #f06292; }

/* --- 卡通贴纸图标组 --- */
.sticker-group {
  position: relative;
  width: 55px;
  height: 55px;
  margin-right: 15px;
}

.main-circle {
  width: 48px;
  height: 48px;
  background-color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

/* 装饰小徽章 (星星/爱心) */
.mini-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  border: 2px solid #fff; /* 白色描边，制造贴纸叠加感 */
  box-shadow: 2px 2px 5px rgba(0,0,0,0.1);
  animation: bounce 2s infinite; /* 增加一点动感 */
}

.mini-badge.star { background: #fbc02d; }
.mini-badge.heart { background: #ff4081; }

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

/* 文字区域 */
.card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.role-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 4px;
}

.role-sub {
  font-size: 12px;
}

.arrow-icon {
  opacity: 0.5;
}

.footer-section {
  text-align: center;
  font-size: 12px;
  color: #ddd;
}
</style>