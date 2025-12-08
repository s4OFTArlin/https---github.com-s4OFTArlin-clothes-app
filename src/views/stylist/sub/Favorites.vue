<template>
  <div class="page-container">
    <!-- 1. 顶部导航栏 (带返回按钮) -->
    <div class="nav-bar">
      <div class="left" @click="goBack">
        <ChevronLeft :size="24" />
      </div>
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
        <!-- 仅在合集模式显示新建按钮 -->
        <Plus v-if="currentTab === 'collection'" :size="24" @click="createCollection"/>
      </div>
    </div>

    <!-- 2. 内容区域 -->
    <div class="content-body">
      
      <!-- === Tab A: 单品模式 (瀑布流) === -->
      <div v-if="currentTab === 'item'" class="items-grid">
        <div class="item-card" v-for="i in 8" :key="i">
          <div class="img-box">Item {{ i }}</div>
          <div class="info-row">
            <span class="name">收藏单品 {{ i }}</span>
            <Heart :size="14" color="#ff4081" fill="#ff4081"/>
          </div>
        </div>
      </div>

      <!-- === Tab B: 合集模式 (卡片流) === -->
      <div v-else class="collection-list">
        <div class="col-card" v-for="(col, index) in collections" :key="index">
          <!-- 封面区 -->
          <div class="cover-area">
            <div class="cover-text">{{ col.title }}</div>
            <div class="count-tag">{{ col.count }}件</div>
          </div>
          
          <!-- 信息区 -->
          <div class="col-info">
            <div class="col-head">
              <h3>{{ col.title }}</h3>
              <span class="date">刚刚更新</span>
            </div>
            
            <!-- 自定义标签区 -->
            <div class="tags-wrapper">
              <span class="tag" v-for="(tag, tIdx) in col.tags" :key="tIdx">#{{ tag }}</span>
              <!-- 添加标签按钮 -->
              <span class="tag add-tag" @click.stop="addTag(index)">
                <Plus :size="10" /> 标签
              </span>
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
const currentTab = ref('item') // item | collection

const goBack = () => router.back()

// 模拟合集数据
const collections = reactive([
  { title: '海边度假风', count: 12, tags: ['碎花', '草帽', '清凉'] },
  { title: '职场通勤', count: 5, tags: ['干练', '西装'] },
  { title: '约会战袍', count: 8, tags: ['温柔', '粉色系'] }
])

// 功能：添加自定义标签
const addTag = (index) => {
  const text = prompt('请输入新标签名称')
  if (text) {
    collections[index].tags.push(text)
  }
}

// 功能：新建合集
const createCollection = () => {
  const title = prompt('请输入合集名称')
  if (title) {
    collections.unshift({ title, count: 0, tags: [] })
  }
}
</script>

<style scoped>
.page-container {
  background: #fff;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 顶部导航 */
.nav-bar {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  background: #fff;
  border-bottom: 1px solid #f5f5f5;
  position: sticky; top: 0; z-index: 10;
}

.tab-switch {
  display: flex;
  background: #f0f0f0;
  padding: 3px;
  border-radius: 20px;
}
.tab-btn {
  padding: 5px 20px;
  font-size: 13px;
  color: #666;
  border-radius: 18px;
  cursor: pointer;
}
.tab-btn.active {
  background: #fff;
  color: #000;
  font-weight: 600;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.content-body {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
}

/* 单品样式 */
.items-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
.item-card { border-radius: 12px; overflow: hidden; border: 1px solid #f9f9f9; }
.img-box { height: 160px; background: #fafafa; display: flex; align-items: center; justify-content: center; color: #ddd; }
.info-row { padding: 8px; display: flex; justify-content: space-between; align-items: center; font-size: 12px; }

/* 合集样式 */
.collection-list { display: flex; flex-direction: column; gap: 20px; }
.col-card { border-radius: 16px; overflow: hidden; border: 1px solid #eee; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }

.cover-area {
  height: 140px;
  background: linear-gradient(135deg, #a7ffeb 0%, #80cbc4 100%); /* 薄荷绿渐变 */
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; color: #004d40; font-weight: bold;
  position: relative;
}
.count-tag { position: absolute; right: 10px; bottom: 10px; background: rgba(0,0,0,0.1); color: #004d40; font-size: 10px; padding: 4px 8px; border-radius: 4px; backdrop-filter: blur(5px); }

.col-info { padding: 15px; }
.col-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.col-head h3 { margin: 0; font-size: 16px; }
.date { font-size: 12px; color: #ccc; }

.tags-wrapper { display: flex; flex-wrap: wrap; gap: 8px; }
.tag { font-size: 11px; background: #f5f5f5; color: #666; padding: 4px 8px; border-radius: 6px; }
.tag.add-tag { background: #fff; border: 1px dashed #ccc; cursor: pointer; display: flex; align-items: center; gap: 2px; color: #999; }
</style>