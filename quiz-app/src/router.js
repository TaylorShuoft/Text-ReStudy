import { createRouter, createWebHistory } from 'vue-router'; // 导入 Vue 3 路由模块
import Quiz from './components/Quiz.vue'; 
import Home from './views/HomePage.vue'; 
import Files from './views/FilesPage.vue';
import calculator from './views/CalculatorPage.vue';

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
    {
      path: '/counter',
      name: 'Calculator',
      component: calculator,
    },
    
  ],
});

router.beforeEach((to, from, next) => {
  console.log('Navigating to:', to.name, 'From:', from.name);
  if (to.name === 'Quiz') {
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