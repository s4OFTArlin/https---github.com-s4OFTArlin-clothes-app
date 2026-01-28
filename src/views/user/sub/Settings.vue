<template>
  <div class="settings-page">
    <div class="header">
      <div class="back-btn" @click="$router.back()">
        <ChevronLeft :size="24" color="#333" />
      </div>
      <h2>账号设置</h2>
      <div style="width: 24px"></div>
    </div>

    <div class="scroll-body">
      <div class="setting-section">
        <div class="menu-item vip-card" @click="$router.push('/user/vip')">
          <div class="left">
            <div class="vip-icon">VIP</div>
            <span class="menu-label bold">会员充值</span>
          </div>
          <div class="right">
            <span class="tip-text">开启专属穿搭顾问</span>
            <ChevronRight :size="18" color="#ccc" />
          </div>
        </div>
      </div>

      <div class="setting-section">
        <div class="menu-item">
          <span class="menu-label">个性化穿搭偏好</span>
          <ChevronRight :size="18" color="#ccc" />
        </div>
        <div class="menu-item">
          <span class="menu-label">隐私设置</span>
          <ChevronRight :size="18" color="#ccc" />
        </div>
        <div class="menu-item">
          <span class="menu-label">实名认证</span>
          <ChevronRight :size="18" color="#ccc" />
        </div>
      </div>

      <div class="setting-section">
        <div class="menu-item">
          <span class="menu-label">关于时尚灵感</span>
          <ChevronRight :size="18" color="#ccc" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
</script>

<style scoped>
/* 使用 fixed 和高 z-index 确保覆盖底部导航栏 */
.settings-page { 
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #f8f8f8; 
  z-index: 999; 
  display: flex;
  flex-direction: column;
}

.header { 
  flex-shrink: 0;
  display: flex; 
  align-items: center; 
  justify-content: space-between; 
  padding: 45px 15px 15px; 
  background: #fff; 
}
.header h2 { font-size: 17px; margin: 0; font-weight: 600; }
.back-btn { cursor: pointer; }

.scroll-body {
  flex: 1;
  overflow-y: auto;
}

.setting-section { background: #fff; margin-top: 12px; }
.menu-item { display: flex; align-items: center; justify-content: space-between; padding: 18px 15px; border-bottom: 1px solid #f9f9f9; }
.menu-label { font-size: 15px; color: #333; }
.bold { font-weight: 700; }

.vip-card { background: #fff9fa; }
.vip-icon { background: #ff4081; color: #fff; font-size: 10px; padding: 2px 6px; border-radius: 4px; margin-right: 8px; font-weight: 800; }
.left { display: flex; align-items: center; }
.right { display: flex; align-items: center; }
.tip-text { font-size: 12px; color: #ff80ab; margin-right: 5px; }
</style>