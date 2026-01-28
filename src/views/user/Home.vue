<template>
  <div class="page-container">
    <div class="header-fixed">
      <div class="search-bar">
        <div class="search-inner">
          <Search :size="18" class="search-icon" color="#999" />
          <input type="text" placeholder="寻找你的专属穿搭灵感..." />
        </div>
      </div>

      <div class="nav-categories">
        <div 
          v-for="tab in tabs" 
          :key="tab" 
          class="nav-item" 
          :class="{ active: currentTab === tab }"
          @click="currentTab = tab"
        >
          {{ tab }}
        </div>
      </div>
    </div>

    <div class="content-scroll">
      <div class="waterfall-container">
        <div 
          class="post-card" 
          v-for="(post, index) in posts" 
          :key="index"
          @click="goToDetail(post)"
        >
          <div class="post-img-wrapper">
            <img :src="post.img" class="post-img" alt="ootd" loading="lazy" />
          </div>
          <div class="post-info">
            <p class="post-title">{{ post.title }}</p>
            <div class="post-user">
              <img 
                :src="post.avatar" 
                class="u-avatar" 
                @error="(e) => e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${post.user}&backgroundColor=d1f2eb&textColor=00695c`"
              />
              <span class="u-name">{{ post.user }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom-spacing"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from 'lucide-vue-next'

const router = useRouter()
const currentTab = ref('全部')
const tabs = ['全部', '甜美风', '多巴胺', '极简主义', '美式复古', '新中式']

// 替换为更稳定的头像占位源
const posts = [
  { 
    img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&q=80&w=500', 
    title: '春日多巴胺穿搭，唤醒活力心情', 
    user: '首席搭配师_Ann', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ann' 
  },
  { 
    img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&q=80&w=500', 
    title: '极简白衬衫：永不过时的优雅', 
    user: '穿搭博主_Momo', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Momo' 
  },
  { 
    img: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&q=80&w=500', 
    title: '美式街头随拍：宽松卫衣的魅力', 
    user: '时尚达人_Jack', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack' 
  },
  { 
    img: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&q=80&w=500', 
    title: '法式浪漫碎花裙：夏日约会首选', 
    user: '甜心酱', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Honey' 
  },
  { 
    img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&q=80&w=500', 
    title: '新中式改良旗袍：传统与现代的碰撞', 
    user: '古风韵味', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Classic' 
  },
  { 
    img: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&q=80&w=500', 
    title: '复古配饰：让穿搭瞬间提升质感', 
    user: '饰品控', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Acc' 
  }
]

const goToDetail = (post) => {
  router.push({
    path: '/user/post/1',
    query: { img: post.img, title: post.title, user: post.user, avatar: post.avatar }
  })
}
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #fcfcfc;
  overflow: hidden;
}

.header-fixed {
  background: #fff;
  z-index: 100;
  flex-shrink: 0;
}

.search-bar {
  padding: 25px 20px 10px 20px;
}

.search-inner {
  display: flex;
  align-items: center;
  background: #f5f5f5;
  padding: 10px 16px;
  border-radius: 20px;
}

.search-inner input {
  background: transparent;
  border: none;
  margin-left: 8px;
  flex: 1;
  outline: none;
  font-size: 14px;
}

.nav-categories {
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  padding: 5px 20px 12px 20px;
  background: #fff;
}
.nav-categories::-webkit-scrollbar { display: none; }

.nav-item {
  margin-right: 25px;
  font-size: 15px;
  color: #888;
  flex-shrink: 0;
  padding-bottom: 4px;
  transition: all 0.2s;
  cursor: pointer;
}

.nav-item.active {
  color: #ff4081;
  font-weight: bold;
  border-bottom: 2px solid #ff4081;
}

.content-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 10px 18px;
  -webkit-overflow-scrolling: touch;
}

.waterfall-container {
  column-count: 2;
  column-gap: 14px;
  width: 100%;
}

.post-card {
  break-inside: avoid;
  margin-bottom: 14px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  display: flex;
  flex-direction: column;
}

.post-img {
  width: 100%;
  height: auto;
  display: block;
}

.post-info {
  padding: 10px;
}

.post-title {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
  line-height: 1.5;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-user {
  display: flex;
  align-items: center;
  gap: 6px;
}

.u-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #f0f0f0;
  object-fit: cover;
}

.u-name {
  font-size: 11px;
  color: #999;
}

.bottom-spacing {
  height: 80px;
}
</style>