<template>
  <div class="page-container">
    <div class="sticky-header">
      <div class="search-row">
        <div class="search-input-box">
          <Search :size="16" color="#999" />
          <input type="text" placeholder="搜索穿搭灵感 / 风格" />
        </div>
      </div>
      <div class="tab-switch">
        <span :class="{ active: currentTab === 'discover' }" @click="currentTab = 'discover'">发现</span>
        <span :class="{ active: currentTab === 'following' }" @click="currentTab = 'following'">关注</span>
      </div>
    </div>

    <div class="content-feed">
      <!-- A. 发现页 (瀑布流) -->
      <div v-if="currentTab === 'discover'" class="grid-feed">
        <div class="feed-card" v-for="(item, index) in discoverList" :key="item.id" @click="goToPost(item.id)">
          <div class="img-box" :style="{ backgroundImage: `url(${item.imgUrl})`, height: index % 2 === 0 ? '220px' : '170px' }"></div>
          <div class="card-info">
            <span class="desc">{{ item.desc }}</span>
            <div class="interactive">
              <div class="icon-num" @click.stop="toggleLike(item)">
                <Heart :size="14" :class="{ 'pop-anim': item.isLiked }" :color="item.isLiked ? '#ff4081' : '#999'" :fill="item.isLiked ? '#ff4081' : 'none'" /> 
                <span :class="{ 'red-text': item.isLiked }">{{ item.likes }}</span>
              </div>
              <div class="user-mini">
                <div class="mini-avatar" :style="{ backgroundImage: `url(${item.avatarUrl})` }"></div>
                <span>{{ item.user }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- B. 关注页 (列表流) -->
      <div v-else class="list-feed">
        <div class="feed-row" v-for="item in followingList" :key="item.id" @click="goToPost(item.id)">
          <div class="avatar-row" @click.stop="goToProfile(item.userId)">
            <div class="avatar" :style="{ backgroundImage: `url(${item.avatarUrl})` }"></div>
            <div class="user-text">
              <span class="name">{{ item.userName }}</span>
              <span class="time">2小时前 · 上海</span>
            </div>
            <button class="more-btn" @click.stop><MoreHorizontal :size="16" /></button>
          </div>
          <div class="big-img" :style="{ backgroundImage: `url(${item.imgUrl})` }"></div>
          <div class="post-text"><strong>{{ item.userName }}</strong> {{ item.desc }}</div>
          <div class="actions" @click.stop>
            <div class="left-icons">
              <div class="action-btn" @click="toggleLike(item)">
                <Heart :size="24" :class="{ 'pop-anim': item.isLiked }" :color="item.isLiked ? '#ff4081' : '#333'" :fill="item.isLiked ? '#ff4081' : 'none'" />
              </div>
              <MessageCircle :size="24" class="action-icon" />
              <Send :size="24" class="action-icon" />
            </div>
            <Bookmark :size="24" class="action-icon" />
          </div>
          <div class="likes-count">{{ item.likes }} 次赞</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Heart, MessageCircle, MoreHorizontal, Send, Bookmark } from 'lucide-vue-next'

const router = useRouter()
const currentTab = ref('discover')

// === 1. 精选图片库 (Unsplash 高清源) ===
const fashionImages = [
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600', // 浅色穿搭
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600', // 街拍
  'https://images.unsplash.com/photo-1529139574466-a302c27e3844?w=600', // 复古
  'https://images.unsplash.com/photo-1550614000-4b9519e02d48?w=600', // 室内
  'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600', // 男装/中性
  'https://images.unsplash.com/photo-1605763240004-7e93b172d754?w=600', // 裙装
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600', // 艺术感
  'https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=600', // 酷飒
]

const avatarImages = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200', // 女1
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200', // 男1
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200', // 女2
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200', // 男2
]

// === 2. 数据生成 ===
const discoverList = ref(Array.from({ length: 8 }).map((_, i) => ({
  id: i,
  imgUrl: fashionImages[i % fashionImages.length], // 循环取图
  avatarUrl: avatarImages[i % avatarImages.length],
  desc: [
    '早春温柔系穿搭，约会必备✨',
    '极简黑白灰，高级感拿捏了🖤',
    '法式复古风，在这个咖啡馆拍照绝美☕️',
    '今日份甜酷辣妹，西装配短裙😎',
    '休闲运动风，舒适又好看👟',
    '职场通勤OOTD，干练不失优雅💼',
    '海边度假怎么穿？这条裙子绝了🌊',
    '美式复古街头，滑板女孩🛹'
  ][i],
  likes: 100 + i * 15,
  isLiked: false,
  user: `User_${100+i}`
})))

const followingList = ref(Array.from({ length: 4 }).map((_, i) => ({
  id: 100 + i,
  userId: i,
  userName: i === 0 ? '首席搭配师_Ann' : `时尚博主_${i}`,
  imgUrl: fashionImages[(i + 4) % fashionImages.length], // 错开取图
  avatarUrl: avatarImages[(i + 2) % avatarImages.length],
  desc: '今日穿搭分享：面料非常舒服，剪裁也很显瘦，推荐给大家！ #OOTD #每日穿搭',
  likes: 1208 + i * 50,
  isLiked: false
})))

const toggleLike = (item) => { item.isLiked = !item.isLiked; item.isLiked ? item.likes++ : item.likes-- }
const goToPost = (id) => router.push(`/user/post/${id}`)
const goToProfile = (id) => router.push(`/user/profile/${id}`)
</script>

<style scoped>
/* 保持原有样式不变，仅确保 background-size: cover 存在 */
.page-container { background: #fff; height: 100%; display: flex; flex-direction: column; padding:0}
.sticky-header { position: sticky; top: 0; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); z-index: 10; padding: 30px 30px 10px 30px; border-bottom: 1px solid #f0f0f0; }
.search-input-box { background: #f5f5f5; border-radius: 20px; padding: 8px 12px; display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.search-input-box input { border: none; background: transparent; outline: none; font-size: 14px; width: 100%; color: #333; }
.tab-switch { display: flex; gap: 30px; padding-bottom: 8px; padding-left: 5px; }
.tab-switch span { font-size: 15px; color: #999; font-weight: 600; cursor: pointer; position: relative; padding-bottom: 6px; transition: all 0.2s; }
.tab-switch span.active { color: #000; font-size: 16px; }
.tab-switch span.active::after { content: ''; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 16px; height: 3px; background: #ff80ab; border-radius: 2px; }
.content-feed { padding: 10px 25px 25px 25px; }
.grid-feed { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.feed-card { border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.03); background: #fff; border: 1px solid #f9f9f9; cursor: pointer; transition: transform 0.1s; }
.feed-card:active { transform: scale(0.98); }
.img-box { background: #eee; background-position: center; background-size: cover; }
.card-info { padding: 10px; }
.desc { font-size: 13px; display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 8px; line-height: 1.4; }
.interactive { display: flex; align-items: center; justify-content: space-between; color: #999; font-size: 11px; }
.icon-num { display: flex; align-items: center; gap: 4px; cursor: pointer; transition: transform 0.1s; }
.icon-num:active { transform: scale(0.9); }
.red-text { color: #ff4081; font-weight: bold; transition: color 0.3s; }
.user-mini { display: flex; align-items: center; gap: 4px; }
.mini-avatar { width: 16px; height: 16px; border-radius: 50%; background-color: #ccc; background-position: center; background-size: cover; }
.list-feed { display: flex; flex-direction: column; gap: 30px; padding: 10px 10px 10px 10px; }
.feed-row { padding-bottom: 15px; border-bottom: 1px solid #f9f9f9; cursor: pointer; }
.avatar-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.avatar { width: 36px; height: 36px; border-radius: 50%; background-color: #f0f0f0; background-position: center; background-size: cover; }
.user-text { display: flex; flex-direction: column; flex: 1; }
.name { font-size: 14px; font-weight: 600; }
.time { font-size: 11px; color: #999; }
.more-btn { background: none; border: none; color: #ccc; padding: 5px; }
.big-img { width: 100%; aspect-ratio: 4/5; background-color: #eee; border-radius: 12px; margin-bottom: 12px; background-position: center; background-size: cover; }
.post-text { font-size: 14px; line-height: 1.5; margin-bottom: 12px; display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.actions { display: flex; justify-content: space-between; margin-bottom: 8px; }
.left-icons { display: flex; gap: 15px; }
.action-icon { stroke-width: 1.5; color: #333; }
.action-btn { cursor: pointer; display: flex; align-items: center; } 
.likes-count { font-size: 12px; font-weight: 600; color: #333; }
.pop-anim { animation: heart-bounce 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
@keyframes heart-bounce { 0% { transform: scale(1); } 50% { transform: scale(1.3); } 100% { transform: scale(1); } }
</style>