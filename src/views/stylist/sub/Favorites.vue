<template>
  <div class="page-container">
    <div class="nav-bar">
      <div class="left" @click="goBack"><ChevronLeft :size="24" /></div>
      <div class="tab-switch">
        <div 
          class="tab-btn" 
          :class="{ active: currentTab === 'item' }"
          @click="currentTab = 'item'"
        >单品</div>
        <div 
          class="tab-btn" 
          :class="{ active: currentTab === 'collection' }"
          @click="currentTab = 'collection'"
        >合集</div>
      </div>
      <div class="right">
        <Plus v-if="currentTab === 'collection'" :size="24" @click="createCollection"/>
      </div>
    </div>

    <div class="content-body">
      <div v-if="currentTab === 'item'" class="items-grid">
        <div class="item-card" v-for="i in 8" :key="i">
          <div class="img-box">
            <img 
              :src="`https://images.unsplash.com/photo-${photoIds[(i-1) % photoIds.length]}?auto=format&q=60&w=400&fm=webp`" 
              class="fav-img"
              @error="handleImgError"
            />
          </div>
          <div class="info-row">
            <span class="name">收藏单品 {{ i }}</span>
            <Heart :size="14" color="#ff4081" fill="#ff4081"/>
          </div>
        </div>
      </div>

      <div v-else class="collection-list">
        <div class="col-card" v-for="(col, index) in collections" :key="index">
          <div class="cover-area mint-green">
            <div class="role-title">{{ col.title }}</div>
            <div class="count-tag">{{ col.count }}件</div>
          </div>
          <div class="col-info">
            <div class="col-head">
              <h3 class="role-title">{{ col.title }}</h3>
              <span class="date">刚刚更新</span>
            </div>
            <div class="tags-wrapper">
              <span class="tag role-sub" v-for="(tag, tIdx) in col.tags" :key="tIdx">#{{ tag }}</span>
              <span class="tag add-tag" @click.stop="addTag(index)"><Plus :size="10" /> 标签</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeft, Plus, Heart } from 'lucide-vue-next'

const router = useRouter()
const currentTab = ref('item')
const goBack = () => router.back()

/**
 * 核心修改：重新编排了 4 个超级稳定的 ID
 * 1. 衬衫 (photo-1596755094514-f87e34085b2c)
 * 2. 牛仔裤 (photo-1542272604-787c3835535d)
 * 3. 第三个：运动鞋 (photo-1595950653106-6c9ebd614d3a) - 极稳
 * 4. 第四个：西装外套 (photo-1591047139829-d91aecb6caea)
 */
const photoIds = [
  '1596755094514-f87e34085b2c', 
  '1542272604-787c3835535d', 
  '1595950653106-6c9ebd614d3a', 
  '1591047139829-d91aecb6caea'
]

const handleImgError = (e) => {
  e.target.src = `https://api.dicebear.com/7.x/shapes/svg?seed=cloth${Math.random()}`
}

const collections = reactive([
  { title: '海边度假风', count: 12, tags: ['碎花', '草帽', '清凉'] },
  { title: '职场通勤', count: 5, tags: ['干练', '西装'] },
  { title: '约会战袍', count: 8, tags: ['温柔', '粉色系'] }
])

const addTag = (index) => {
  const text = prompt('请输入新标签名称')
  if (text) collections[index].tags.push(text)
}

const createCollection = () => {
  const title = prompt('请输入合集名称')
  if (title) collections.unshift({ title, count: 0, tags: [] })
}
</script>

<style scoped>
.page-container {
  background: #fff;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.nav-bar {
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  background: #fff;
  border-bottom: 1px solid #f8f8f8;
  flex-shrink: 0;
}

.tab-switch { display: flex; background: #f0f0f0; padding: 3px; border-radius: 20px; }
.tab-btn { padding: 5px 20px; font-size: 13px; color: #666; border-radius: 18px; cursor: pointer; }
.tab-btn.active {
  background: #d1f2eb; 
  color: #00695c; 
  font-weight: 700;
}

.content-body {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  /* 重点修复：增加底部内边距，确保能滚动到底部，不被挡住 */
  padding-bottom: 100px; 
  -webkit-overflow-scrolling: touch;
}

.items-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
.item-card { border-radius: 16px; overflow: hidden; border: 1px solid #f0f0f0; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
.img-box { height: 180px; background: #fcfcfc; overflow: hidden; }
.fav-img { width: 100%; height: 100%; object-fit: cover; }

.info-row { padding: 12px; display: flex; justify-content: space-between; align-items: center; }
.name { font-size: 13px; font-weight: 600; color: #333; }

.mint-green { background-color: #d1f2eb !important; }
.role-title { color: #00695c !important; }
.role-sub { color: #4db6ac !important; background: #e0f2f1 !important; }

.col-card { border-radius: 20px; overflow: hidden; border: 1px solid #e0f2f1; margin-bottom: 15px; }
.cover-area {
  height: 120px;
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; font-weight: 800; position: relative;
}
.count-tag { position: absolute; right: 12px; top: 12px; background: rgba(255,255,255,0.5); padding: 2px 8px; border-radius: 6px; font-size: 10px; }
.col-info { padding: 15px; }
.tags-wrapper { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
.tag { font-size: 11px; padding: 4px 10px; border-radius: 8px; font-weight: 600; }
.add-tag { background: #fff; border: 1px dashed #ccc; color: #999; }
</style>