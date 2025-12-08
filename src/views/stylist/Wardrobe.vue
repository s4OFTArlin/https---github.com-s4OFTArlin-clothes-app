<template>
  <div class="page-container">
    <!-- 1. 顶部搜索 -->
    <div class="search-bar-box">
      <Search :size="18" color="#999" />
      <input type="text" placeholder="搜索单品 / 品牌 / 风格" class="search-input">
    </div>

    <!-- 2. 功能入口 (这里是跳转的关键) -->
    <div class="tools-grid">
      <!-- 跳转我的收藏 -->
      <div class="tool-card" @click="goToFavorites">
        <div class="icon-box pink"><Heart :size="20" color="#e91e63" /></div>
        <span>我的收藏</span>
      </div>
      
      <!-- 跳转历史足迹 -->
      <div class="tool-card" @click="goToHistory">
        <div class="icon-box blue"><History :size="20" color="#2196f3" /></div>
        <span>历史足迹</span>
      </div>
    </div>

    <!-- 3. 推荐标题 & 查看全部入口 -->
    <div class="section-title">
      <h3>单品推荐</h3>
      <span class="more-btn" @click="showCategory = true">
        查看分类 <ChevronRight :size="14" />
      </span>
    </div>

    <!-- 4. 推荐瀑布流 -->
    <div class="items-grid">
      <div class="item-card" v-for="i in 6" :key="i">
        <div class="img-placeholder">Item {{ i }}</div>
        <div class="item-info">
          <span class="brand">Brand {{ i }}</span>
          <span class="price">¥{{ 100 * i + 99 }}</span>
        </div>
      </div>
    </div>

    <!-- 5. 分类侧边栏 -->
    <Teleport to="body">
      <div class="drawer-overlay" v-if="showCategory" @click="showCategory = false">
        <div class="category-drawer" @click.stop>
          <div class="drawer-header">
            <h3>全部分类</h3>
            <X :size="24" color="#ccc" @click="showCategory = false" />
          </div>
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
          <div class="drawer-footer">Style Category</div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref } from 'vue'
// ⬇️⬇️⬇️ 关键：必须引入 useRouter ⬇️⬇️⬇️
import { useRouter } from 'vue-router'
import { 
  Search, Heart, History, ChevronRight, X, 
  Shirt, Scissors, Footprints, Briefcase, Watch, Layers
} from 'lucide-vue-next'

// ⬇️⬇️⬇️ 关键：必须实例化 router ⬇️⬇️⬇️
const router = useRouter()

const showCategory = ref(false)
const currentCat = ref('全部单品')

const categories = [
  { name: '全部单品', count: 128, icon: Layers },
  { name: '时尚上装', count: 45, icon: Shirt },
  { name: '潮流下装', count: 32, icon: Scissors },
  { name: '精选鞋履', count: 20, icon: Footprints },
  { name: '品牌包袋', count: 15, icon: Briefcase },
  { name: '精致配饰', count: 16, icon: Watch },
]

const selectCategory = (name) => {
  currentCat.value = name
}

// 定义跳转函数，比直接写在模板里更安全
const goToFavorites = () => {
  console.log('跳转到收藏页...') // 用于调试
  router.push('/stylist/wardrobe/favorites')
}

const goToHistory = () => {
  console.log('跳转到足迹页...') // 用于调试
  router.push('/stylist/wardrobe/history')
}
</script>

<style scoped>
/* 保持样式不变，可以直接复制之前的，或者保留你现有的样式 */
.page-container { padding: 20px; background-color: #ffffff; }
.search-bar-box { background: #f5f5f5; border-radius: 25px; padding: 12px 20px; display: flex; align-items: center; gap: 10px; margin-bottom: 25px; }
.search-input { border: none; background: transparent; outline: none; flex: 1; }
.tools-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 30px; }
.tool-card { background: #fff; border: 1px solid #f0f0f0; border-radius: 16px; padding: 15px; display: flex; align-items: center; gap: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.02); cursor: pointer; transition: transform 0.1s; }
.tool-card:active { transform: scale(0.98); background: #f9f9f9; } /* 添加按压反馈 */
.icon-box { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
.icon-box.pink { background: #fce4ec; }
.icon-box.blue { background: #e3f2fd; }
.tool-card span { font-weight: 600; font-size: 14px; color: #333; }
.section-title { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
.more-btn { font-size: 13px; color: #666; display: flex; align-items: center; cursor: pointer; }
.items-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; padding-bottom: 80px; }
.item-card { background: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #f5f5f5; }
.img-placeholder { height: 160px; background: #fafafa; display: flex; align-items: center; justify-content: center; color: #ddd; }
.item-info { padding: 10px; display: flex; justify-content: space-between; font-size: 12px; }
.brand { font-weight: 600; }
.drawer-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.4); backdrop-filter: blur(2px); z-index: 200; display: flex; justify-content: flex-start; }
.category-drawer { width: 75%; height: 100%; background: #fff; padding: 30px 20px; box-sizing: border-box; display: flex; flex-direction: column; animation: slideIn 0.3s ease-out; border-radius: 0 24px 24px 0; }
@keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }
.drawer-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
.category-list { flex: 1; display: flex; flex-direction: column; gap: 15px; }
.cat-item { display: flex; align-items: center; padding: 15px 20px; border-radius: 16px; background: #f9f9f9; color: #666; cursor: pointer; transition: all 0.2s; justify-content: flex-start; }
.cat-name { margin-left: 15px; font-size: 16px; font-weight: 600; flex: 1; text-align: left; }
.cat-item.active { background: #a7ffeb; color: #00695c; box-shadow: 0 4px 10px rgba(167, 255, 235, 0.5); }
.cat-item.active .cat-count { color: #004d40; opacity: 0.6; }
.drawer-footer { text-align: center; color: #eee; font-size: 12px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; }
</style>