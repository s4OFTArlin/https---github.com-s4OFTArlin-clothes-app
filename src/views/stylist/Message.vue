<template>
  <div class="page-container">
    <div class="header">
      <h2>服务订单</h2>
      <p>Service Requests</p>
    </div>

    <!-- 订单列表 -->
    <div class="order-list">
      <div class="order-card" v-for="item in orders" :key="item.id">
        <!-- 卡片头部 -->
        <div class="card-top">
          <div class="user-info">
            <div class="avatar" :style="{ background: item.bg }">{{ item.name[0] }}</div>
            <div class="text">
              <span class="name">{{ item.name }}</span>
              <span class="time">{{ item.time }}</span>
            </div>
          </div>
          <span class="status-tag" :class="{ done: item.status === '已接单' }">
            {{ item.status }}
          </span>
        </div>

        <!-- 简略描述 -->
        <div class="card-body">
          <div class="req-title">
            <Sparkles :size="16" color="#f59e0b" style="margin-right:4px"/>
            {{ item.type }}
          </div>
          <p class="req-desc">{{ item.desc }}</p>
        </div>

        <!-- 底部按钮 -->
        <div class="card-actions" v-if="item.status === '待接单'">
          <button class="action-btn decline">忽略</button>
          <!-- 点击触发弹窗 -->
          <button class="action-btn accept" @click="openDetail(item)">立即接单</button>
        </div>
      </div>
    </div>

    <!-- 详情弹窗 (Modal) -->
    <!-- 使用 Teleport 确保弹窗覆盖全屏，包括 TabBar -->
    <Teleport to="body">
      <div class="modal-overlay" v-if="showModal" @click.self="closeDetail">
        <div class="modal-card">
          <div class="modal-header">
            <h3>需求详情</h3>
            <X :size="24" color="#999" @click="closeDetail" style="cursor:pointer"/>
          </div>

          <!-- 用户基础信息 -->
          <div class="detail-user">
            <div class="avatar-large" :style="{ background: currentOrder.bg }">
              {{ currentOrder.name ? currentOrder.name[0] : '' }}
            </div>
            <div>
              <div class="d-name">{{ currentOrder.name }}</div>
              <div class="d-type">{{ currentOrder.type }}</div>
            </div>
          </div>

          <!-- 身体参数网格 -->
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

          <!-- 详细需求描述 -->
          <div class="desc-box">
            <h4>具体诉求</h4>
            <p>{{ currentOrder.fullDesc }}</p>
          </div>

          <!-- 底部确认操作 -->
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

// 模拟数据
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
    fullDesc: '略...',
    bodyData: { height: '158cm', weight: '50kg', shape: '苹果型', skin: '白皙' }
  },
])

// 打开弹窗
const openDetail = (item) => {
  currentOrder.value = item
  showModal.value = true
}

// 关闭弹窗
const closeDetail = () => {
  showModal.value = false
}

// 确认接单
const confirmOrder = () => {
  const index = orders.value.findIndex(o => o.id === currentOrder.value.id)
  if (index !== -1) {
    orders.value[index].status = '已接单'
  }
  showModal.value = false
}
</script>

<style scoped>
.page-container {
  padding: 20px;
  background-color: #fafafa;
  /* ⚠️ 关键修改：删除了 min-height: 100vh; */
  /* 让它自动适应 Flex 布局，底部栏就会回来了 */
}

.header { margin-bottom: 20px; }
.header h2 { font-size: 24px; margin-bottom: 4px; }
.header p { font-size: 12px; color: #999; letter-spacing: 1px; }

/* 列表样式 */
.order-list { display: flex; flex-direction: column; gap: 20px; padding-bottom: 20px; }
.order-card { background: #fff; border-radius: 20px; padding: 20px; box-shadow: 0 5px 20px rgba(0,0,0,0.05); }

.card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px dashed #eee; }
.user-info { display: flex; align-items: center; gap: 10px; }
.avatar { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #fff; font-size: 14px; }
.text { display: flex; flex-direction: column; }
.name { font-weight: bold; font-size: 14px; }
.time { font-size: 11px; color: #aaa; }

.status-tag { font-size: 11px; background: #fff3e0; color: #f57c00; padding: 4px 8px; border-radius: 10px; font-weight: 600; }
.status-tag.done { background: #e8f5e9; color: #2e7d32; }

.req-title { display: flex; align-items: center; font-weight: 600; font-size: 15px; margin-bottom: 8px; color: #333; }
.req-desc { font-size: 13px; color: #666; line-height: 1.5; margin-bottom: 20px; }

.card-actions { display: flex; gap: 10px; }
.action-btn { flex: 1; padding: 10px 0; border-radius: 12px; font-size: 13px; border: none; font-weight: 600; cursor: pointer; }
.decline { background: #f5f5f5; color: #999; }
.accept { background: #000; color: #fff; transition: opacity 0.2s; }
.accept:active { opacity: 0.8; }

/* --- 弹窗样式 --- */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  z-index: 9999; /* 确保在最顶层 */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
  box-sizing: border-box;
}

.modal-card {
  background: #fff;
  width: 100%;
  max-width: 340px;
  border-radius: 24px;
  padding: 25px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
  animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes popIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.modal-header h3 { margin: 0; font-size: 18px; }

.detail-user { display: flex; align-items: center; gap: 15px; margin-bottom: 25px; }
.avatar-large { width: 50px; height: 50px; border-radius: 50%; color: #fff; font-weight: bold; font-size: 20px; display: flex; align-items: center; justify-content: center; }
.d-name { font-weight: bold; font-size: 16px; }
.d-type { font-size: 12px; color: #666; background: #f5f5f5; padding: 2px 6px; border-radius: 4px; display: inline-block; margin-top: 4px; }

.param-box { background: #f9f9f9; border-radius: 16px; padding: 15px; margin-bottom: 20px; }
.param-box h4, .desc-box h4 { margin: 0 0 10px 0; font-size: 14px; color: #333; }
.param-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.p-item { display: flex; flex-direction: column; }
.label { font-size: 11px; color: #999; }
.val { font-size: 14px; font-weight: 600; color: #333; }

.desc-box { margin-bottom: 30px; }
.desc-box p { font-size: 13px; color: #666; line-height: 1.6; margin: 0; text-align: justify; }

.modal-actions { display: flex; gap: 15px; }
.cancel-btn { flex: 1; padding: 12px; border-radius: 12px; border: 1px solid #ddd; background: #fff; color: #666; font-weight: 600; cursor: pointer; }
.confirm-btn { flex: 1.5; padding: 12px; border-radius: 12px; border: none; background: #a7ffeb; color: #00695c; font-weight: 600; cursor: pointer; }
</style>