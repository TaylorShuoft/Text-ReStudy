import { createRouter, createWebHistory } from 'vue-router'; // 导入 Vue 3 路由模块
import Quiz from './components/Quiz.vue'; 
import Home from './views/HomePage.vue'; 
import Files from './views/FilesPage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home // 首页
  },
  {
    path: '/quiz',
    name: 'Quiz',
    component: Quiz // 刷题页
  }
  ,
  {
    path: '/files',
    name: 'Files',
    component: Files // 文件页
  }
];

// 使用 createRouter 创建路由器
const router = createRouter({
  history: createWebHistory(), // 使用 createWebHistory 代替 mode: 'history'
  routes
});

export default router;
