<template>
  <div class="bottom-nav">
    <div class="nav-item" :class="{active: current==='quiz'}" @click="goTo('quiz')">
      <svg width="36" height="36" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" fill="#2196F3"/><circle cx="19" cy="21" r="2" fill="#fff"/><circle cx="29" cy="21" r="2" fill="#fff"/><rect x="16" y="28" width="16" height="3" rx="1.5" fill="#fff"/></svg>
      <span>复习</span>
    </div>
    <div class="nav-item" :class="{active: current==='files'}" @click="goTo('files')">
      <svg width="36" height="36" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" fill="#222"/><rect x="16" y="18" width="16" height="12" rx="4" fill="#fff"/><rect x="20" y="26" width="8" height="2" rx="1" fill="#222"/></svg>
      <span>聊天池</span>
    </div>
    <div class="nav-item" :class="{active: current==='profile'}" @click="goTo('profile')">
      <svg width="36" height="36" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" fill="#222"/><path d="M24 18a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 12c-5.33 0-10 2.67-10 6v2h20v-2c0-3.33-4.67-6-10-6z" fill="#fff"/></svg>
      <span>个人主页</span>
    </div>
  </div>
</template>

<script>
import { useRouter, useRoute } from 'vue-router';
export default {
  name: 'BottomNav',
  setup() {
    const router = useRouter();
    const route = useRoute();
    // 判断当前高亮
    const pathMap = {
      quiz: '/quiz',
      files: '/chat',
      profile: '/profile',
    };
    let current = 'quiz';
    if (route.path.startsWith('/quiz')) current = 'quiz';
    else if (route.path.startsWith('/chat')) current = 'files';
    else if (route.path.startsWith('/profile')) current = 'profile';
    
    function goTo(key) {
      router.push(pathMap[key]);
    }
    return { goTo, current };
  }
};
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100vw;
  height: 70px;
  background: #fff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 -2px 12px rgba(0,0,0,0.08);
  z-index: 9999;
}
.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #222;
  font-size: 15px;
  cursor: pointer;
  flex: 1;
  user-select: none;
  transition: color 0.2s;
}
.nav-item svg {
  margin-bottom: 2px;
}
.nav-item span {
  margin-top: 2px;
}
.nav-item.active {
  color: #2196F3;
}
</style> 