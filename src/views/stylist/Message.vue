<template>
  <div class="page-container">
    <div class="header">
      <h2>服务订单</h2>
      <p>Service Requests</p>
    </div>

    <div class="order-list">
      <div class="order-card" v-for="item in orders" :key="item.id">
        <div class="card-top">
          <div class="user-info">
            <img 
              :src="`https://api.dicebear.com/7.x/notionists/svg?seed=${item.name}`" 
              class="avatar-img" 
              :style="{ background: item.bg }"
            />
            <div class="text">
              <span class="name">{{ item.name }}</span>
              <span class="time">{{ item.time }}</span>
            </div>
          </div>
          <span class="status-tag" :class="{ done: item.status === '已接单' }">
            {{ item.status }}
          </span>
        </div>

        <div class="card-body">
          <div class="req-title">
            <Sparkles :size="16" color="#f59e0b" style="margin-right:4px"/>
            {{ item.type }}
          </div>
          <p class="req-desc">{{ item.desc }}</p>
        </div>

        <div class="card-actions" v-if="item.status === '待接单'">
          <button class="action-btn decline">忽略</button>
          <button class="action-btn accept" @click="openDetail(item)">立即接单</button>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div class="modal-overlay" v-if="showModal" @click.self="closeDetail">
        <div class="modal-card">
          <div class="modal-header">
            <h3>需求详情</h3>
            <X :size="24" color="#999" @click="closeDetail" style="cursor:pointer"/>
          </div>

          <div class="detail-user">
            <img 
              :src="`https://api.dicebear.com/7.x/notionists/svg?seed=${currentOrder.name}`" 
              class="avatar-large-img" 
              :style="{ background: currentOrder.bg }"
            />
            <div>
              <div class="d-name">{{ currentOrder.name }}</div>
              <div class="d-type">{{ currentOrder.type }}</div>
            </div>
          </div>

          <div class="param-box">
            <h4>身体档案</h4>
            <div class="param-grid" v-if="currentOrder.bodyData">
              <div class="p-item">
                <span class="label">身高</span>
                <span class="val">{{ currentOrder.bodyData.height }}</span>
              </div>
              <div class="p-item">
                <span class="label">体重</span>
                <span class="val">{{ currentOrder.bodyData.weight }}</span>
              </div>
              <div class="p-item">
                <span class="label">体型</span>
                <span class="val">{{ currentOrder.bodyData.shape }}</span>
              </div>
              <div class="p-item">
                <span class="label">肤色</span>
                <span class="val">{{ currentOrder.bodyData.skin }}</span>
              </div>
            </div>
          </div>

          <div class="desc-box">
            <h4>具体诉求</h4>
            <p>{{ currentOrder.fullDesc }}</p>
          </div>

          <div class="modal-actions">
            <button class="cancel-btn" @click="closeDetail">再想想</button>
            <button class="confirm-btn" @click="confirmOrder">确认接单</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { Sparkles, X } from 'lucide-vue-next'
import { ref } from 'vue'

const showModal = ref(false)
const currentOrder = ref({})

const orders = ref([
  { 
    id: 1, 
    name: '小糯米', 
    bg: '#ffd1dc', 
    time: '10分钟前', 
    type: '初次约会穿搭', 
    status: '待接单',
    desc: '想要温柔一点的风格，去咖啡店...', 
    fullDesc: '周末要去一家复古咖啡厅约会，对方是设计师。希望能显得温柔但不失个性，最好是裙装，不要太暴露，要方便行动。预算在500元以内。',
    bodyData: { height: '162cm', weight: '48kg', shape: '梨形身材', skin: '黄一白' }
  },
  { 
    id: 2, 
    name: 'CoolGirl', 
    bg: '#a7ffeb', 
    time: '1小时前', 
    type: '音乐节OOTD', 
    status: '待接单',
    desc: '想要酷一点，显高，晚上会有点冷...',
    fullDesc: '草莓音乐节，想要辣妹风！但是晚上户外会降温，需要考虑保暖层。喜欢黑色和银色，希望显腿长。',
    bodyData: { height: '168cm', weight: '52kg', shape: 'H型身材', skin: '小麦色' }
  },
  { 
    id: 3, 
    name: '职场小白', 
    bg: '#e1bee7', 
    time: '2小时前', 
    type: '周一例会', 
    status: '已接单',
    desc: '老板比较严肃，想要职业又不老气的搭配。',
    fullDesc: '目前公司氛围较为保守，需要体现专业度，但不想穿得像传统业务员。',
    bodyData: { height: '158cm', weight: '50kg', shape: '苹果型', skin: '白皙' }
  },
  { 
    id: 4, 
    name: '健身达人', 
    bg: '#bbdefb', 
    time: '3小时前', 
    type: '运动时尚感', 
    status: '待接单',
    desc: '想穿出那种不经意的运动风。',
    fullDesc: '下周有个户外的飞盘活动，想穿得专业又好拍。',
    bodyData: { height: '172cm', weight: '55kg', shape: '倒三角', skin: '健康色' }
  }
])

const openDetail = (item) => {
  currentOrder.value = item
  showModal.value = true
}

const closeDetail = () => {
  showModal.value = false
}

const confirmOrder = () => {
  const index = orders.value.findIndex(o => o.id === currentOrder.value.id)
  if (index !== -1) {
    orders.value[index].status = '已接单'
  }
  showModal.value = false
}
</script>

<style scoped>
/* 核心修复：移除 fixed，确保页面高度随内容增长 */
.page-container {
  width: 100%;
  min-height: 100vh; 
  background-color: #fafafa;
  padding: 20px;
  /* 增加底部内边距，确保内容不被 TabBar 遮挡 */
  padding-bottom: 120px; 
  box-sizing: border-box;
  overflow-y: auto; 
  -webkit-overflow-scrolling: touch; /* 增强 iOS 滚动流畅度 */
}

.header { margin-bottom: 20px; }
.header h2 { font-size: 24px; margin-bottom: 4px; font-weight: 800; }
.header p { font-size: 12px; color: #999; letter-spacing: 1px; text-transform: uppercase; }

/* 列表样式 */
.order-list { 
  display: flex; 
  flex-direction: column; 
  gap: 20px; 
}
.order-card { 
  background: #fff; 
  border-radius: 20px; 
  padding: 20px; 
  box-shadow: 0 5px 20px rgba(0,0,0,0.03); 
  border: 1px solid #f0f0f0; 
}

.card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px dashed #eee; }
.user-info { display: flex; align-items: center; gap: 12px; }
.avatar-img { width: 44px; height: 44px; border-radius: 12px; object-fit: cover; }

.text { display: flex; flex-direction: column; }
.name { font-weight: bold; font-size: 15px; color: #333; }
.time { font-size: 11px; color: #aaa; margin-top: 2px; }

.status-tag { font-size: 11px; background: #fff3e0; color: #f57c00; padding: 4px 10px; border-radius: 8px; font-weight: 700; }
.status-tag.done { background: #e8f5e9; color: #2e7d32; }

.req-title { display: flex; align-items: center; font-weight: 700; font-size: 16px; margin-bottom: 8px; color: #1a1a1a; }
.req-desc { font-size: 13px; color: #777; line-height: 1.5; margin-bottom: 20px; }

.card-actions { display: flex; gap: 10px; }
.action-btn { flex: 1; padding: 12px 0; border-radius: 14px; font-size: 14px; border: none; font-weight: 700; cursor: pointer; }
.decline { background: #f5f5f5; color: #999; }
.accept { background: #1a1a1a; color: #fff; }

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.modal-card {
  background: #fff;
  width: 100%;
  max-width: 360px;
  border-radius: 28px;
  padding: 30px;
  animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
@keyframes popIn {
  from { transform: translateY(20px) scale(0.9); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
}
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
.modal-header h3 { margin: 0; font-size: 20px; font-weight: 800; }
.detail-user { display: flex; align-items: center; gap: 15px; margin-bottom: 25px; }
.avatar-large-img { width: 56px; height: 56px; border-radius: 16px; object-fit: cover; }
.d-name { font-weight: 800; font-size: 18px; color: #1a1a1a; }
.d-type { font-size: 12px; color: #f57c00; background: #fff3e0; padding: 3px 8px; border-radius: 6px; display: inline-block; margin-top: 5px; font-weight: 600; }
.param-box { background: #f8f8f8; border-radius: 20px; padding: 18px; margin-bottom: 20px; border: 1px solid #f0f0f0; }
.param-box h4 { margin: 0 0 12px 0; font-size: 14px; color: #1a1a1a; font-weight: 700; }
.param-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.p-item { display: flex; flex-direction: column; }
.label { font-size: 11px; color: #999; margin-bottom: 2px; }
.val { font-size: 14px; font-weight: 700; color: #333; }
.desc-box { margin-bottom: 30px; }
.desc-box h4 { margin: 0 0 12px 0; font-size: 14px; font-weight: 700; }
.desc-box p { font-size: 14px; color: #555; line-height: 1.6; margin: 0; }
.modal-actions { display: flex; gap: 12px; }
.cancel-btn { flex: 1; padding: 14px; border-radius: 16px; border: 1px solid #eee; background: #fff; color: #666; font-weight: 700; }
.confirm-btn { flex: 2; padding: 14px; border-radius: 16px; border: none; background: #a7ffeb; color: #00695c; font-weight: 700; }
</style>