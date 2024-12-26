import { createRouter, createWebHistory } from 'vue-router'; // 导入 Vue 3 路由模块
import Quiz from './components/Quiz.vue'; 
import Home from './views/HomePage.vue'; 
import Files from './views/FilesPage.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/quiz',
      name: 'Quiz',
      component: Quiz,
    },
    {
      path: '/files',
      name: 'Files',
      component: Files,
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.name === 'Quiz') {
    // 如果用户尝试访问 Quiz 页面且是从外部刷新页面（from 为 undefined 或者 from.name 为 undefined），则重定向到首页
    if (from.name === undefined) {
      next('/');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;