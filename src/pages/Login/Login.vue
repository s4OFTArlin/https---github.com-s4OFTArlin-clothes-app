<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToStylistHome = () => {
  router.push('/stylist')
}

const goToUserHome = () => {
  router.push('/user')
}
</script>

<template>
  <div class="login-container">
    <h1>欢迎来到衣次元小程序</h1>
    <p>请选择您的身份：</p>
    
    <div class="button-group">
      <button @click="goToStylistHome" class="stylist-btn">
        搭配师
      </button>
      
      <button @click="goToUserHome" class="user-btn">
        用户
      </button>
    </div>
  </div>
</template>

<style scoped>
@import './login.css';
</style>