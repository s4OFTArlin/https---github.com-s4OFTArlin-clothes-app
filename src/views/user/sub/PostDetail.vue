<template>
  <div class="page-container">
    <div class="nav-bar">
      <div class="left" @click="goBack"><ChevronLeft :size="24" /></div>
      <div class="title">帖子详情</div>
      <div class="right"><Share :size="20" /></div>
    </div>

    <div class="content-scroll">
      <div class="author-row" @click="goToProfile">
        <div class="avatar-container">
          <img 
            v-if="postData.avatar"
            :src="postData.avatar" 
            class="author-avatar" 
            @error="(e) => e.target.style.display='none'"
          />
          <div class="static-avatar-placeholder">
            {{ postData.user ? postData.user.charAt(0).toUpperCase() : 'S' }}
          </div>
        </div>
        
        <div class="info">
          <span class="name">{{ postData.user }}</span>
          <span class="loc">上海 · 新天地</span>
        </div>
        <button class="follow-btn" @click.stop="handleFollow">关注</button>
      </div>

      <div class="post-image-container">
        <img :src="postData.img" class="main-img" alt="OOTD" />
      </div>

      <div class="post-meta">
        <div class="actions">
          <div class="left-icons">
            <Heart :size="24" />
            <MessageCircle :size="24" />
            <Send :size="24" />
          </div>
          <Bookmark :size="24" />
        </div>
        <div class="likes">1,208 次赞</div>
        <div class="caption">
          <span class="bold">{{ postData.user }}</span> 
          {{ postData.title }}。今日份穿搭分享！#OOTD
        </div>
        <div class="date">2小时前</div>
      </div>

      <div class="comments-section">
        <div class="comment-row" v-for="i in 3" :key="i">
          <div class="c-avatar-static">U{{ i }}</div>
          <div class="c-content">
            <span class="c-name">用户_{{ i }}</span>
            <span class="c-text">这一套链接有吗？太好看啦！</span>
          </div>
          <Heart :size="14" color="#ccc" />
        </div>
      </div>
    </div>

    <div class="bottom-input">
      <input type="text" placeholder="说点什么...">
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ChevronLeft, Share, Heart, MessageCircle, Send, Bookmark } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

const postData = reactive({
  img: '',
  title: '',
  user: '',
  avatar: ''
})

onMounted(() => {
  // 确保从上一页传来的数据能正确挂载
  postData.img = route.query.img || ''
  postData.title = route.query.title || '穿搭分享'
  postData.user = route.query.user || '搭配师'
  postData.avatar = route.query.avatar || ''
})

const goBack = () => router.back()

// 核心跳转函数：跳转到用户个人主页
const goToProfile = () => {
  console.log('正在跳转到个人主页...')
  router.push('/user/profile/1')
}

// 防止点击“关注”按钮也触发跳转详情
const handleFollow = () => {
  alert('关注成功！')
}
</script>

<style scoped>
/* 样式保持刚才修正后的精简版，确保间距正确 */
.page-container { background: #fff; height: 100vh; display: flex; flex-direction: column; overflow: hidden; position: relative;}
.nav-bar { height: 50px; display: flex; align-items: center; justify-content: space-between; padding: 0 15px; border-bottom: 1px solid #f5f5f5; flex-shrink: 0; }
.title { font-weight: 600; font-size: 16px; }

.content-scroll { flex: 1; overflow-y: auto; padding-bottom: 100px; }

.author-row { 
  display: flex; 
  align-items: center; 
  padding: 10px 15px;
  cursor: pointer; /* 增加手型标识 */
}

.avatar-container {
  width: 36px;
  height: 36px;
  position: relative;
  margin-right: 12px;
  flex-shrink: 0;
}

.author-avatar { 
  width: 100%; 
  height: 100%; 
  border-radius: 50%; 
  object-fit: cover; 
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2; 
}

.static-avatar-placeholder {
  width: 100%; 
  height: 100%; 
  background: #d1f2eb; 
  color: #00695c; 
  border-radius: 50%; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  font-weight: bold; 
  font-size: 14px; 
}

.info { flex: 1; display: flex; flex-direction: column; }
.name { font-weight: 600; font-size: 14px; }
.loc { font-size: 10px; color: #999; }

.follow-btn { 
  border: 1px solid #ff4081; 
  background: #fff; 
  color: #ff4081; 
  padding: 4px 12px; 
  border-radius: 15px; 
  font-size: 12px; 
  font-weight: 600;
  position: relative;
  z-index: 10; /* 确保按钮在点击层级最上方 */
}

.post-image-container { width: 100%; background: #f9f9f9; }
.main-img { width: 100%; display: block; object-fit: contain; }

.post-meta { padding: 15px; border-bottom: 1px solid #f9f9f9; }
.actions { display: flex; justify-content: space-between; margin-bottom: 12px; }
.left-icons { display: flex; gap: 20px; }
.likes { font-weight: bold; font-size: 14px; margin-bottom: 8px; }
.caption { font-size: 14px; line-height: 1.5; color: #333; }
.bold { font-weight: 600; margin-right: 5px; }
.date { font-size: 11px; color: #999; margin-top: 8px; }

.comments-section { padding: 15px; }
.comment-row { display: flex; align-items: flex-start; margin-bottom: 20px; }
.c-avatar-static { 
  width: 28px; height: 28px; background: #e0f2f1; color: #00897b; 
  border-radius: 50%; display: flex; align-items: center; 
  justify-content: center; font-size: 10px; margin-right: 10px; 
  flex-shrink: 0; font-weight: bold;
}

.bottom-input { 
  position: fixed; bottom: 0; width: 100%; 
  padding: 10px 15px; background: #fff; 
  border-top: 1px solid #eee; z-index: 100;
}
.bottom-input input { width: 100%; background: #f5f5f5; border: none; height: 40px; border-radius: 20px; padding: 0 15px; outline: none; }
</style>