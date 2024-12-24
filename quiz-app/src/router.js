import Vue from 'vue';
import Router from 'vue-router';
import Quiz from './components/Quiz.vue'; 
import Home from './views/HomePage.vue'; 

Vue.use(Router);

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
];

const router = new Router({
  mode: 'history', 
  routes
});

export default router;
