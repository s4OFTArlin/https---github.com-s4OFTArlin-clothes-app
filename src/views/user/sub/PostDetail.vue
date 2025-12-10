<template>
  <div class="page-container">
    <!-- 顶部导航 -->
    <div class="nav-bar">
      <div class="left" @click="goBack"><ChevronLeft :size="24" /></div>
      <div class="title">帖子详情</div>
      <div class="right"><Share :size="20" /></div>
    </div>

    <div class="content-scroll">
      <!-- 1. 作者信息栏 (点击跳转主页) -->
      <div class="author-row" @click="goToProfile">
        <div class="avatar stylist">STY</div>
        <div class="info">
          <span class="name">首席搭配师_Ann</span>
          <span class="loc">上海 · 新天地</span>
        </div>
        <button class="follow-btn">关注</button>
      </div>

      <!-- 2. 图片与文案 -->
      <div class="post-image">
        OOTD 展示图
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
          <span class="bold">首席搭配师_Ann</span> 
          今日份甜酷辣妹穿搭，黑色西装配牛仔裙，绝绝子！#OOTD #每日穿搭
        </div>
        <div class="date">2小时前</div>
      </div>

      <!-- 3. 评论区 -->
      <div class="comments-section">
        <div class="comment-row" v-for="i in 5" :key="i">
          <div class="c-avatar">U</div>
          <div class="c-content">
            <span class="c-name">用户_{{ i }}</span>
            <span class="c-text">这一套链接有吗？太好看了！</span>
          </div>
          <Heart :size="14" color="#ccc" />
        </div>
      </div>
    </div>

    <!-- 底部输入框 -->
    <div class="bottom-input">
      <input type="text" placeholder="说点什么...">
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ChevronLeft, Share, Heart, MessageCircle, Send, Bookmark } from 'lucide-vue-next'

const router = useRouter()
const goBack = () => router.back()

// 跳转到对方主页
const goToProfile = () => {
  router.push('/user/profile/1') // 模拟 ID 为 1
}
</script>

<style scoped>
.page-container { background: #fff; height: 100%; display: flex; flex-direction: column; }
.nav-bar { height: 50px; display: flex; align-items: center; justify-content: space-between; padding: 0 15px; border-bottom: 1px solid #f5f5f5; flex-shrink: 0; }
.title { font-weight: 600; font-size: 16px; }

.content-scroll { flex: 1; overflow-y: auto; }

.author-row { display: flex; align-items: center; padding: 10px 15px; cursor: pointer; }
.avatar { width: 36px; height: 36px; background: #a7ffeb; color: #00695c; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; margin-right: 10px; }
.info { flex: 1; display: flex; flex-direction: column; }
.name { font-weight: 600; font-size: 14px; }
.loc { font-size: 10px; color: #999; }
.follow-btn { border: 1px solid #ddd; background: #fff; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 600; }

.post-image { height: 400px; background: #eee; display: flex; align-items: center; justify-content: center; color: #999; font-size: 20px; }
.post-meta { padding: 10px 15px; border-bottom: 1px solid #f9f9f9; }
.actions { display: flex; justify-content: space-between; margin-bottom: 10px; }
.left-icons { display: flex; gap: 15px; }
.likes { font-weight: bold; font-size: 14px; margin-bottom: 6px; }
.caption { font-size: 14px; line-height: 1.4; margin-bottom: 6px; }
.bold { font-weight: 600; margin-right: 5px; }
.date { font-size: 10px; color: #999; }

.comments-section { padding: 15px; }
.comment-row { display: flex; align-items: flex-start; margin-bottom: 15px; }
.c-avatar { width: 24px; height: 24px; background: #ff80ab; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; margin-right: 10px; }
.c-content { flex: 1; font-size: 13px; }
.c-name { font-weight: 600; margin-right: 5px; font-size: 12px; color: #666; }

.bottom-input { padding: 10px 15px; border-top: 1px solid #eee; display: flex; align-items: center; }
.bottom-input input { width: 100%; background: #f5f5f5; border: none; height: 36px; border-radius: 18px; padding: 0 15px; outline: none; font-size: 14px; }
</style>