<template>
  <div class="vip-page">
    <div class="header">
      <div class="back-btn" @click="$router.back()">
        <ChevronLeft :size="24" color="#fff" />
      </div>
      <h2>会员中心</h2>
      <div style="width: 24px"></div>
    </div>

    <div class="scroll-content">
      <div class="user-display">
        <div class="u-info-inner">
          <div class="u-name">{{ userInfo.name }}</div>
          <div class="u-id">ID: {{ userInfo.id }}</div>
        </div>
        <div class="u-status">当前余额：¥0.00</div>
      </div>

      <div class="vip-banner">
        <div class="card-content">
          <div class="crown-tag">PREMIUM</div>
          <h3>尊享会员 · 权益全开</h3>
          <ul class="benefit-list">
            <li>• 3D 身材模型深度分析</li>
            <li>• 专属 AI 穿搭顾问 24h 在线</li>
          </ul>
        </div>
      </div>

      <div class="content-box">
        <div class="section-title">
          <h4>选择充值金额</h4>
          <span class="sub-tip">多充多送，立享优惠</span>
        </div>

        <div class="price-container">
          <div class="row">
            <div 
              v-for="(item, index) in rechargePlans.slice(0, 3)" 
              :key="index"
              class="price-item"
              :class="{ active: selectedPlan === index }"
              @click="selectPlan(index)"
            >
              <div v-if="item.bonus > 0" class="bonus-tag">送{{ item.bonus }}</div>
              <span class="price-val">¥{{ item.amount }}</span>
              <span class="desc">实得{{ item.amount + item.bonus }}</span>
            </div>
          </div>

          <div class="row">
            <div 
              class="price-item"
              :class="{ active: selectedPlan === 3 }"
              @click="selectPlan(3)"
            >
              <div class="bonus-tag">送{{ rechargePlans[3].bonus }}</div>
              <span class="price-val">¥{{ rechargePlans[3].amount }}</span>
              <span class="desc">实得{{ rechargePlans[3].amount + rechargePlans[3].bonus }}</span>
            </div>

            <div 
              class="price-item custom-item"
              :class="{ active: selectedPlan === 'custom' }"
              @click="selectPlan('custom')"
            >
              <span class="price-val" v-if="selectedPlan !== 'custom'">其他</span>
              <div class="custom-input-wrap" v-else>
                <input type="number" v-model="customAmount" placeholder="0" autoFocus @blur="handleBlur" />
              </div>
              <span class="desc">自定义</span>
            </div>
          </div>
        </div>

        <button class="pay-btn" @click="handlePay">
          立即充值 ¥{{ currentTotal }}
        </button>
        
        <p class="agreement">充值即视为同意《会员充值服务协议》</p>
      </div>
      <div class="bottom-spacing"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ChevronLeft } from 'lucide-vue-next'

const userInfo = reactive({ name: '时尚探索者', id: '10086' })
const rechargePlans = [
  { amount: 20, bonus: 1 },
  { amount: 50, bonus: 3 },
  { amount: 100, bonus: 8 },
  { amount: 200, bonus: 20 }
]

const selectedPlan = ref(0)
const customAmount = ref(null)
const currentTotal = computed(() => {
  if (selectedPlan.value === 'custom') return customAmount.value || 0
  return rechargePlans[selectedPlan.value].amount
})

const selectPlan = (index) => { selectedPlan.value = index }
const handleBlur = () => { if (selectedPlan.value === 'custom' && !customAmount.value) selectedPlan.value = 0 }
const handlePay = () => { alert(`支付成功：¥${currentTotal.value}`) }
</script>

<style scoped>
/* 同样使用 fixed 全屏覆盖，确保不显示底部 TabBar */
.vip-page { 
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  display: flex; 
  flex-direction: column; 
  background: #fff; 
}

.header { flex-shrink: 0; display: flex; align-items: center; justify-content: space-between; padding: 45px 15px 15px; background: #1a1a1a; color: #fff; }
.header h2 { font-size: 17px; margin: 0; }
.back-btn { cursor: pointer; }

.scroll-content { flex: 1; overflow-y: auto; background: #fff; }

.user-display { background: #1a1a1a; padding: 0 20px 20px; display: flex; justify-content: space-between; align-items: flex-end; color: #fff; }
.u-name { font-size: 18px; font-weight: 700; }
.u-id { font-size: 12px; opacity: 0.5; }
.u-status { font-size: 13px; color: #e0c080; }

.vip-banner { margin: 15px 20px; padding: 15px 20px; background: linear-gradient(135deg, #444, #111); border-radius: 16px; color: #e0c080; }
.crown-tag { font-size: 9px; background: #e0c080; color: #111; padding: 1px 5px; border-radius: 4px; margin-bottom: 8px; width: fit-content; }
.vip-banner h3 { margin: 0; font-size: 18px; }
.benefit-list { margin-top: 10px; padding: 0; list-style: none; }
.benefit-list li { font-size: 12px; opacity: 0.8; margin-bottom: 3px; }

.content-box { padding: 15px 20px; }
.section-title { margin-bottom: 15px; }
.section-title h4 { margin: 0; font-size: 15px; }

.price-container { display: flex; flex-direction: column; gap: 12px; }
.row { display: flex; justify-content: center; gap: 10px; }

.price-item { 
  flex: 1;
  max-width: 105px;
  border: 1.5px solid #f0f0f0; border-radius: 12px; 
  padding: 12px 5px;
  display: flex; flex-direction: column; align-items: center; 
  position: relative; background: #fafafa;
}
.price-item.active { border-color: #ff4081; background: #fff0f5; }
.bonus-tag { position: absolute; top: -8px; right: -4px; background: #ff4081; color: #fff; font-size: 9px; padding: 1px 6px; border-radius: 8px 8px 8px 0; }
.price-val { font-size: 18px; font-weight: 800; color: #333; }
.active .price-val { color: #ff4081; }
.desc { font-size: 10px; color: #999; margin-top: 2px; }

.custom-input-wrap input { width: 40px; border: none; background: transparent; outline: none; font-size: 16px; font-weight: 800; color: #ff4081; text-align: center; }

.pay-btn { width: 100%; background: #1a1a1a; color: #e0c080; border: none; padding: 16px; border-radius: 30px; font-weight: 700; margin-top: 30px; font-size: 16px; }
.agreement { text-align: center; font-size: 11px; color: #bbb; margin-top: 15px; }
.bottom-spacing { height: 30px; }
</style>