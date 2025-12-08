<template>
  <div class="tab-bar">
    <div 
      v-for="item in items" 
      :key="item.path" 
      class="tab-item"
      @click="navigate(item.path)"
    >
      <component 
        :is="item.icon" 
        :size="24" 
        :stroke-width="isActive(item.path) ? 2.5 : 1.5"
        :color="isActive(item.path) ? '#000' : '#8e8e8e'"
      />
      <span 
        class="tab-label" 
        :class="{ active: isActive(item.path) }"
      >
        {{ item.label }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const props = defineProps({
  items: Array 
})

const router = useRouter()
const route = useRoute()

const isActive = (path) => route.path.includes(path)

const navigate = (path) => {
  router.push(path)
}
</script>

<style scoped>
.tab-bar {
  /* 增加高度，给内容更多呼吸空间 */
  height: 65px; 
  border-top: 1px solid #efefef;
  
  display: flex;
  justify-content: space-around;
  /* 关键：使用 center 垂直居中，去掉之前的 padding-bottom */
  align-items: center; 
  
  background: #fff;
  box-sizing: border-box;
}

.tab-item {
  flex: 1;
  height: 100%; /* 占满高度以便点击 */
  display: flex;
  flex-direction: column;
  /* 内容在每一项里也居中 */
  justify-content: center; 
  align-items: center;
  
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  gap: 4px; /* 图标和文字的间距 */
}

.tab-label {
  font-size: 10px;
  color: #8e8e8e;
  font-weight: 500;
  transition: color 0.2s;
  /* 防止文字行高导致的额外偏移 */
  line-height: 1; 
}

.tab-label.active {
  color: #000;
  font-weight: 600;
}
</style>