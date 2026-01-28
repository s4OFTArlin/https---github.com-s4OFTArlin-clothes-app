<template>
  <div class="page-container">
    <div class="sticky-header">
      <div class="header">
        <div class="search-bar">
          <Search :size="18" color="#999" />
          <input type="text" class="search-input" placeholder="搜索好物 / 品牌" />
        </div>
        <Bell :size="24" color="#333" />
      </div>

      <div class="tools-grid">
        <div class="tool-card">
          <div class="icon-box pink"><ClipboardList :size="24" color="#d81b60" /></div>
          <span>我的订单</span>
        </div>
        <div class="tool-card">
          <div class="icon-box yellow"><ShoppingCart :size="24" color="#f57f17" /></div>
          <span>购物车</span>
        </div>
        <div class="tool-card" @click="router.push('/user/mall/service')">
          <div class="icon-box blue"><Headphones :size="24" color="#1976d2" /></div>
          <span>官方客服</span>
        </div>
      </div>

      <div class="section-title">
        <h3>热销推荐</h3>
        <span class="more-btn" @click="showCategory = true">全部分类 <ChevronRight :size="14" /></span>
      </div>
    </div>

    <div class="content-scroll">
      <div class="items-grid">
        <div class="item-card" v-for="(item, index) in productList" :key="index">
          <div class="img-container">
            <img :src="item.img" class="product-img" alt="product" loading="lazy" />
          </div>
          <div class="item-info">
            <div class="brand-row">
              <span class="brand">{{ item.brand }}</span>
            </div>
            <div class="price-row">
              <span class="price">{{ item.price }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div class="drawer-overlay" v-if="showCategory" @click="showCategory = false">
        <div class="category-drawer" @click.stop>
          <div class="drawer-header">
            <h3>商城分类</h3>
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
          <div class="drawer-footer">YICIYUAN MALL</div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Bell, ClipboardList, ShoppingCart, Headphones, ChevronRight, X, ShoppingBag, Crown, Shirt, Scissors, Footprints, Watch } from 'lucide-vue-next'

const router = useRouter()
const showCategory = ref(false)
const currentCat = ref('全部商品')

// 验证过的稳定图片链接，已更换第7张图片
const productImages = [
  'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&w=500&q=80', // 白T
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&w=500&q=80', // 红鞋
  'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&w=500&q=80', // 包包
  'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&w=500&q=80', // 夹克
  'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&w=500&q=80', // 衬衫
  'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&w=500&q=80', // 运动鞋
  'https://images.unsplash.com/photo-1521335629791-ce4aec67dd15?auto=format&w=500&q=80', // 已更换：时尚草帽/配饰
  'https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?auto=format&w=500&q=80', // 连衣裙
]

const productList = ref(Array.from({ length: 8 }).map((_, i) => ({
  img: productImages[i % productImages.length],
  brand: ['Acne Studios', 'Nike', 'Jacquemus', 'Zara', 'COS', 'New Balance', 'Stussy', 'Ganni'][i],
  price: '¥ ' + (199 + i * 50)
})))

const categories = [ 
  { name: '全部商品', count: 2048, icon: ShoppingBag }, 
  { name: '当季新品', count: 56, icon: Crown }, 
  { name: '潮流上装', count: 890, icon: Shirt }, 
  { name: '百搭下装', count: 640, icon: Scissors }, 
  { name: '鞋靴专区', count: 320, icon: Footprints }, 
  { name: '时尚配饰', count: 142, icon: Watch } 
]

const selectCategory = (name) => { 
  currentCat.value = name; 
  showCategory.value = false 
}
</script>

<style scoped>
.page-container { 
  display: flex; 
  flex-direction: column; 
  height: 100vh; 
  background-color: #ffffff; 
  overflow: hidden; 
}

.sticky-header {
  padding: 20px 20px 10px 20px;
  background: #fff;
  z-index: 10;
  flex-shrink: 0;
}

.header { display: flex; gap: 15px; align-items: center; margin-bottom: 20px; }
.search-bar { 
  flex: 1; 
  background: #f5f5f5; 
  height: 40px; 
  border-radius: 20px; 
  display: flex; 
  align-items: center; 
  padding: 0 15px; 
  gap: 10px; 
}
.search-input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  color: #333;
  width: 100%;
}
.search-input::placeholder { color: #aaa; }

.tools-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 20px; }
.tool-card { 
  background: #fff; 
  border: 1px solid #f0f0f0; 
  border-radius: 16px; 
  padding: 12px 5px; 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  justify-content: center; 
  gap: 8px; 
  box-shadow: 0 4px 10px rgba(0,0,0,0.02); 
  cursor: pointer; 
  transition: transform 0.1s;
}
.tool-card:active { transform: scale(0.96); background: #f9f9f9; }

.icon-box { width: 42px; height: 42px; border-radius: 14px; display: flex; align-items: center; justify-content: center; }
.icon-box.pink { background: #fce4ec; }
.icon-box.yellow { background: #fff8e1; }
.icon-box.blue { background: #e3f2fd; }
.tool-card span { font-weight: 600; font-size: 12px; color: #333; }

.section-title { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.section-title h3 { margin: 0; font-size: 18px; font-weight: 700; color: #000; }
.more-btn { font-size: 13px; color: #666; display: flex; align-items: center; cursor: pointer; }

.content-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 0 20px 100px 20px; 
  -webkit-overflow-scrolling: touch;
}

.items-grid { 
  display: grid; 
  grid-template-columns: 1fr 1fr; 
  gap: 15px; 
}

.item-card { 
  background: #fff; 
  border-radius: 12px; 
  overflow: hidden; 
  border: 1px solid #f2f2f2;
  display: flex;
  flex-direction: column;
}

.img-container { 
  width: 100%;
  height: 180px; 
  overflow: hidden;
  background-color: #fafafa;
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover; 
  display: block;
}

.item-info { 
  padding: 12px; 
  display: flex; 
  justify-content: space-between;
  align-items: center;
}

.brand { 
  color: #888; 
  font-size: 11px; 
  font-weight: 500; 
  text-transform: uppercase; 
  letter-spacing: 0.5px; 
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  line-clamp: 1; 
  overflow: hidden;
}
.price { font-weight: 800; color: #000; font-size: 14px; flex-shrink: 0; }

.drawer-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.4); backdrop-filter: blur(2px); z-index: 200; }
.category-drawer { width: 75%; height: 100%; background: #fff; padding: 30px 20px; box-sizing: border-box; display: flex; flex-direction: column; animation: slideIn 0.3s ease-out; border-radius: 0 24px 24px 0; }
@keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }
.drawer-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
.category-list { flex: 1; display: flex; flex-direction: column; gap: 15px; }
.cat-item { display: flex; align-items: center; padding: 15px 20px; border-radius: 16px; background: #f9f9f9; color: #666; cursor: pointer; transition: all 0.2s; }
.cat-name { margin-left: 15px; font-size: 16px; font-weight: 600; flex: 1; text-align: left; }
.cat-item.active { background: #fce4ec; color: #c2185b; }
.drawer-footer { text-align: center; color: #eee; font-size: 12px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; }
</style>