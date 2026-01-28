<template>
  <div class="page-container">
    <div class="search-bar-box">
      <Search :size="18" color="#999" />
      <input type="text" placeholder="搜索单品 / 品牌 / 风格" class="search-input">
    </div>

    <div class="scroll-content">
      <div class="tools-grid">
        <div class="tool-card" @click="goToFavorites">
          <div class="icon-box pink"><Heart :size="20" color="#e91e63" /></div>
          <span>我的收藏</span>
        </div>
        <div class="tool-card" @click="goToHistory">
          <div class="icon-box blue"><History :size="20" color="#2196f3" /></div>
          <span>历史足迹</span>
        </div>
      </div>

      <div class="section-title">
        <h3>单品推荐</h3>
        <span class="more-btn" @click="showCategory = true">查看分类 <ChevronRight :size="14" /></span>
      </div>

      <div class="items-grid">
        <div class="item-card" v-for="(item, index) in wardrobeItems" :key="index">
          <div class="img-container">
            <img 
              :src="item.img" 
              class="item-img" 
              loading="lazy"
              @error="handleImgError"
            >
          </div>
          <div class="item-info">
            <div class="info-left">
              <span class="brand">{{ item.name }}</span>
            </div>
            <span class="price">¥{{ item.price }}</span>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div class="drawer-overlay" v-if="showCategory" @click="showCategory = false">
        <div class="category-drawer" @click.stop>
          <div class="drawer-header">
            <h3>全部分类</h3>
            <X :size="24" color="#ccc" @click="showCategory = false" style="cursor:pointer" />
          </div>
          <div class="category-list">
            <div 
              class="cat-item" 
              v-for="(cat, index) in categories" 
              :key="index" 
              :class="{ 'mint-active': currentCat === cat.name }" 
              @click="selectCategory(cat.name)"
            >
              <component :is="cat.icon" :size="20" stroke-width="1.5"/>
              <span class="cat-name">{{ cat.name }}</span>
              <span class="cat-count">{{ cat.count }}</span>
            </div>
          </div>
          <div class="drawer-footer">STYLE ARCHIVE</div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Heart, History, ChevronRight, X, Shirt, Scissors, Footprints, Briefcase, Watch, Layers } from 'lucide-vue-next'

const router = useRouter()
const showCategory = ref(false)
const currentCat = ref('全部单品')

const wardrobeImages = [
  'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&q=60&w=400&fm=webp', // 1. 衬衫
  'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&q=60&w=400&fm=webp', // 2. 直筒牛仔裤 (稳定版)
  'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&q=60&w=400&fm=webp', // 3. 鞋子
  'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&q=60&w=400&fm=webp', // 4. 夹克
  'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&q=60&w=400&fm=webp', // 5. 黑T
  'https://images.unsplash.com/photo-1584917663903-b9399f839d7b?auto=format&q=60&w=400&fm=webp'  // 6. 手提托特包 (极稳 ID)
]
const wardrobeItems = ref(Array.from({ length: 12 }).map((_, i) => ({
  img: wardrobeImages[i % wardrobeImages.length],
  name: ['简约白衬衫', '直筒牛仔裤', '复古球鞋', '工装夹克', '修身打底', '手提托特包'][i % 6],
  price: 299 + i * 50
})))

const handleImgError = (e) => {
  e.target.src = `https://api.dicebear.com/7.x/shapes/svg?seed=${Math.random()}`
}

const categories = [ 
  { name: '全部单品', count: 128, icon: Layers }, 
  { name: '时尚上装', count: 45, icon: Shirt }, 
  { name: '潮流下装', count: 32, icon: Scissors }, 
  { name: '精选鞋履', count: 20, icon: Footprints }, 
  { name: '品牌包袋', count: 15, icon: Briefcase }, 
  { name: '精致配饰', count: 16, icon: Watch } 
]

const selectCategory = (name) => { currentCat.value = name }
const goToFavorites = () => { router.push('/stylist/wardrobe/favorites') }
const goToHistory = () => { router.push('/stylist/wardrobe/history') }
</script>

<style scoped>
/* 核心滚动修复：容器高度占满视口，禁用外层滚动 */
.page-container { 
  height: 100vh; 
  display: flex;
  flex-direction: column;
  background-color: #ffffff; 
  overflow: hidden; 
  box-sizing: border-box;
}

/* 顶部搜索栏不滚动 */
.search-bar-box { 
  margin: 20px 20px 10px 20px;
  background: #f5f5f5; 
  border-radius: 12px; 
  padding: 12px 15px; 
  display: flex; 
  align-items: center; 
  gap: 10px; 
  flex-shrink: 0;
}
.search-input { border: none; background: transparent; outline: none; flex: 1; font-size: 14px; }

/* 关键：内部滚动区域 */
.scroll-content {
  flex: 1;
  overflow-y: auto;
  padding: 10px 20px 120px 20px; /* 底部留够TabBar空间 */
  -webkit-overflow-scrolling: touch;
}

.tools-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px; }
.tool-card { 
  background: #fff; 
  border: 1px solid #f2f2f2; 
  border-radius: 16px; 
  padding: 15px; 
  display: flex; 
  align-items: center; 
  gap: 12px; 
}

.icon-box { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
.icon-box.pink { background: #fce4ec; }
.icon-box.blue { background: #e3f2fd; }
.tool-card span { font-weight: 700; font-size: 14px; color: #333; }

.section-title { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
.section-title h3 { font-size: 18px; font-weight: 800; margin: 0; }
.more-btn { font-size: 13px; color: #666; display: flex; align-items: center; }

.items-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
.item-card { background: #fff; border-radius: 16px; overflow: hidden; border: 1px solid #f5f5f5; }
.img-container { height: 170px; background: #fafafa; }
.item-img { width: 100%; height: 100%; object-fit: cover; }
.item-info { padding: 12px; display: flex; justify-content: space-between; align-items: center; }
.brand { font-weight: 700; font-size: 13px; color: #333; }
.price { color: #ff4081; font-weight: 800; font-size: 14px; }

/* 侧边分类栏 Mint Green 风格 */
.drawer-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(2px); z-index: 999; }
.category-drawer { 
  width: 280px; height: 100%; background: #fff; padding: 40px 20px; 
  display: flex; flex-direction: column; border-radius: 0 24px 24px 0;
  animation: slideIn 0.3s ease-out;
}
@keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }

.cat-item { 
  display: flex; align-items: center; padding: 15px 20px; border-radius: 16px; 
  background: #f9f9f9; color: #666; margin-bottom: 12px; cursor: pointer; transition: 0.2s;
}

/* 重点：Mint Green 高亮样式 */
.cat-item.mint-active { 
  background-color: #d1f2eb !important; /* 薄荷绿背景 */
  color: #00695c !important; /* 深绿色文字 */
  box-shadow: 0 4px 12px rgba(209, 242, 235, 0.6);
  font-weight: 700;
}

.cat-name { margin-left: 15px; font-size: 16px; flex: 1; }
.cat-count { font-size: 12px; opacity: 0.6; }

.drawer-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
.drawer-footer { text-align: center; color: #eee; font-size: 12px; font-weight: 900; letter-spacing: 2px; margin-top: auto; }
</style>