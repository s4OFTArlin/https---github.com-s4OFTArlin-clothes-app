<template>
  <div class="promo-container">
    <div class="nav-header">
      <div class="back-btn" @click="$router.back()">
        <span class="chevron"></span>
      </div>
      <span class="nav-title">旧衣回收计划</span>
    </div>

    <div class="scroll-content">
      <div class="banner">
        <div class="banner-mask">
          <h2>让每一件衣服<br/>都有第二次生命</h2>
        </div>
      </div>

      <div class="stat-section">
        <div class="stat-card">
          <span class="num">3.6kg</span>
          <span class="label">减少碳排放/kg</span>
        </div>
        <div class="stat-card">
          <span class="num">6000L</span>
          <span class="label">节省用水量/件</span>
        </div>
      </div>

      <div class="article-section">
        <h3>为什么我们要回收旧衣？</h3>
        <p>全球每年产生超过 9000 万吨纺织废弃物。通过回收，我们可以将废旧纤维重新加工，或捐赠给有需要的人群，从而大幅降低时尚产业对环境的影响。</p>
      </div>

      <div class="step-section">
        <h3>只需三步，开启环保之旅</h3>
        <div class="steps-list">
          <div class="step-card">
            <div class="step-icon">01</div>
            <div class="step-info">
              <h4>在线预约</h4>
              <p>填写地址与衣物重量，系统匹配最优取件</p>
            </div>
          </div>
          <div class="step-card">
            <div class="step-icon">02</div>
            <div class="step-info">
              <h4>快递上门</h4>
              <p>专业人员免费取件，无需支付运费</p>
            </div>
          </div>
          <div class="step-card">
            <div class="step-icon">03</div>
            <div class="step-info">
              <h4>获得奖励</h4>
              <p>衣物入库后即可获得积分或环保勋章</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="footer-action">
      <button class="submit-btn" @click="handleReserve">
        立即预约免费上门回收
      </button>
    </div>
  </div>
</template>

<script setup>
const handleReserve = () => {
  // 这里可以添加点击交互
  console.log("进入预约流程");
};
</script>

<style scoped>
/* 强制消除全局边距干扰 */
.promo-container * {
  box-sizing: border-box;
}

.promo-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  background: #f8fbf9; 
  z-index: 999;
}

/* 导航头 */
.nav-header {
  height: 44px;
  display: flex;
  align-items: center;
  padding: 0 15px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.back-btn {
  width: 40px;
  height: 44px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.chevron::before {
  content: '';
  width: 10px;
  height: 10px;
  border-left: 2px solid #333;
  border-bottom: 2px solid #333;
  transform: rotate(45deg);
  display: block;
}

.nav-title {
  flex: 1;
  text-align: center;
  font-weight: 600;
  font-size: 16px;
  margin-right: 40px;
}

/* 滚动内容 */
.scroll-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 100px;
}

/* 顶部背景：改为清爽的森林绿渐变 */
.banner {
  height: 180px;
  background: linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%);
  position: relative;
}

.banner-mask {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  padding: 0 25px;
}

.banner-mask h2 {
  color: #fff;
  font-size: 24px;
  line-height: 1.4;
  margin: 0;
  font-weight: 600;
}

/* 数据卡片 */
.stat-section {
  display: flex;
  gap: 15px;
  padding: 0 15px;
  margin-top: -30px; /* 向上悬浮 */
  position: relative;
  z-index: 10;
}

.stat-card {
  flex: 1;
  background: #fff;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(46, 125, 50, 0.1);
  text-align: center;
}

.stat-card .num {
  font-size: 20px;
  font-weight: 800;
  color: #2e7d32;
  display: block;
}

.stat-card .label {
  font-size: 11px;
  color: #999;
  margin-top: 4px;
}

/* 文案区域 */
.article-section {
  padding: 40px 20px 10px;
}

.article-section h3 {
  font-size: 18px;
  margin-bottom: 12px;
  color: #333;
}

.article-section p {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

/* 步骤区域 */
.step-section {
  padding: 20px;
}

.step-section h3 {
  font-size: 18px;
  margin-bottom: 15px;
}

.step-card {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 12px;
  border: 1px solid #edf2ee;
}

.step-icon {
  width: 36px;
  height: 36px;
  background: #e8f5e9;
  color: #2e7d32;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  margin-right: 15px;
  flex-shrink: 0;
}

.step-info h4 {
  font-size: 15px;
  margin: 0 0 4px 0;
}

.step-info p {
  font-size: 12px;
  color: #999;
  margin: 0;
}

/* 底部按钮 */
.footer-action {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px 20px 30px;
  background: #fff;
  box-shadow: 0 -4px 12px rgba(0,0,0,0.05);
  z-index: 1000;
}

.submit-btn {
  width: 100%;
  height: 50px;
  background: #2e7d32;
  color: #fff;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(46, 125, 50, 0.2);
  cursor: pointer;
}

.submit-btn:active {
  transform: scale(0.98);
  opacity: 0.9;
}
</style>