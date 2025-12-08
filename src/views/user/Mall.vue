<template>
  <div class="page-container">
    <!-- 1. 顶部搜索 (与衣橱一致) -->
    <div class="search-bar-box">
      <Search :size="18" color="#999" />
      <input type="text" placeholder="搜索好物 / 品牌" class="search-input">
    </div>

    <!-- 2. 核心功能入口 (双列卡片布局) -->
    <!-- 商城核心功能：购物车 + 我的订单 -->
    <div class="tools-grid">
      <div class="tool-card">
        <div class="icon-box yellow">
          <ShoppingCart :size="20" color="#f57f17" />
        </div>
        <span>购物车</span>
      </div>
      <div class="tool-card">
        <div class="icon-box pink">
          <ClipboardList :size="20" color="#d81b60" />
        </div>
        <span>我的订单</span>
      </div>
    </div>

    <!-- 3. 推荐标题 & 分类入口 (侧边抽屉触发器) -->
    <div class="section-title">
      <h3>热销推荐</h3>
      <span class="more-btn" @click="showCategory = true">
        全部分类 <ChevronRight :size="14" />
      </span>
    </div>

    <!-- 4. 商品瀑布流 -->
    <div class="items-grid">
      <div class="item-card" v-for="i in 8" :key="i">
        <div class="img-placeholder">Sale {{ i }}</div>
        <div class="item-info">
          <span class="brand">Fashion Items</span>
          <span class="price">¥{{ 199 + i * 10 }}</span>
        </div>
      </div>
    </div>

    <!-- 5. 分类侧边栏抽屉 (Teleport 挂载) -->
    <Teleport to="body">
      <div class="drawer-overlay" v-if="showCategory" @click="showCategory = false">
        
        <div class="category-drawer" @click.stop>
          <div class="drawer-header">
            <h3>商城分类</h3>
            <X :size="24" color="#ccc" @click="showCategory = false" />
          </div>

          <!-- 左对齐、向下排列的列表 -->
          <div class="category-list">
            <div 
              class="cat-item" 
              v-for="(cat, index) in categories" 
              :key="index"
              :class="{ active: currentCat === cat.name }"
              @click="selectCategory(cat.name)"
            >
              <component :is="cat.icon" :size="20" stroke-width="1.5"/>
              <span class="cat-name">{{ cat.name }}</span>
              <span class="cat-count">({{ cat.count }})</span>
            </div>
          </div>

          <div class="drawer-footer">
            YICIYUAN MALL
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  Search, ShoppingCart, ClipboardList, ChevronRight, X,
  Shirt, Scissors, Footprints, Watch, ShoppingBag, Crown
} from 'lucide-vue-next'

const showCategory = ref(false)
const currentCat = ref('全部商品')

// 商城分类数据
const categories = [
  { name: '全部商品', count: 2048, icon: ShoppingBag },
  { name: '当季新品', count: 56, icon: Crown },
  { name: '潮流上装', count: 890, icon: Shirt },
  { name: '百搭下装', count: 640, icon: Scissors },
  { name: '鞋靴专区', count: 320, icon: Footprints },
  { name: '时尚配饰', count: 142, icon: Watch },
]

const selectCategory = (name) => {
  currentCat.value = name
  // showCategory.value = false // 可选：点击后自动关闭
}
</script>

<style scoped>
.page-container {
  padding: 20px;
  background-color: #ffffff;
}

/* --- 1. 搜索框样式 (复用衣橱样式) --- */
.search-bar-box {
  background: #f5f5f5;
  border-radius: 25px;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 25px;
}
.search-input { border: none; background: transparent; outline: none; flex: 1; font-size: 14px; }

/* --- 2. 功能卡片样式 (复用衣橱样式) --- */
.tools-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 30px; }
.tool-card { background: #fff; border: 1px solid #f0f0f0; border-radius: 16px; padding: 15px; display: flex; align-items: center; gap: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.02); }
.icon-box { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
/* 商城特有配色 */
.icon-box.yellow { background: #fff8e1; }
.icon-box.pink { background: #fce4ec; }
.tool-card span { font-weight: 600; font-size: 14px; color: #333; }

/* --- 3. 标题区样式 --- */
.section-title { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
.section-title h3 { margin: 0; font-size: 18px; font-weight: 700; }
.more-btn { font-size: 13px; color: #666; display: flex; align-items: center; cursor: pointer; }

/* --- 4. 瀑布流样式 --- */
.items-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; padding-bottom: 80px; }
.item-card { background: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #f5f5f5; }
.img-placeholder { height: 170px; background: #fafafa; display: flex; align-items: center; justify-content: center; color: #ddd; font-weight: bold; }
.item-info { padding: 10px; display: flex; justify-content: space-between; font-size: 13px; align-items: center;}
.brand { color: #666; font-size: 12px; }
.price { font-weight: 700; color: #000; }

/* --- 5. 侧边栏抽屉样式 (完全复用) --- */
.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(2px);
  z-index: 200;
  display: flex;
  justify-content: flex-start;
}

.category-drawer {
  width: 75%;
  height: 100%;
  background: #fff;
  padding: 30px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease-out;
  border-radius: 0 24px 24px 0;
}

@keyframes slideIn {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

.drawer-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
.drawer-header h3 { margin: 0; font-size: 22px; font-weight: 800; }

.category-list { flex: 1; display: flex; flex-direction: column; gap: 15px; }

.cat-item {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  border-radius: 16px;
  background: #f9f9f9;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
  justify-content: flex-start;
}

.cat-name { margin-left: 15px; font-size: 16px; font-weight: 600; flex: 1; text-align: left; }
.cat-count { font-size: 12px; color: #ccc; }

/* 选中状态：商城主题可以用淡粉色或保持统一 */
.cat-item.active {
  background: #fce4ec; /* 用户端淡粉色主题 */
  color: #c2185b;
  box-shadow: 0 4px 10px rgba(233, 30, 99, 0.2);
}
.cat-item.active .cat-count { color: #d81b60; opacity: 0.6; }

.drawer-footer { text-align: center; color: #eee; font-size: 12px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; }
</style>