<template>
  <div class="user-profile">
    <div class="profile-header">
      <img class="avatar" src="https://img.icons8.com/ios-filled/100/000000/user-male-circle.png" alt="头像" />
      <h2>{{ nickname }}</h2>
      <p>{{ email }}</p>
    </div>
    <div class="profile-info">
      <h3>个人信息</h3>
      <ul>
        <li><strong>昵称：</strong>{{ nickname }}</li>
        <li><strong>邮箱：</strong>{{ email }}</li>
        <li><strong>注册时间：</strong>{{ registerDate }}</li>
      </ul>
    </div>
  </div>
  <BottomNav v-if="isMobile" />
</template>

<script>
import { ref, onMounted } from 'vue'
import BottomNav from '@/components/BottomNav.vue'
export default {
  name: 'UserProfile',
  components: { BottomNav },
  setup() {
    const isMobile = ref(false)
    const username = ref('')
    const createdAt = ref('')
    const checkIfMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      return /mobile|android|iphone|ipad|phone/i.test(userAgent)
    }
    function getToken() {
      return localStorage.getItem('token') || ''
    }
    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/user', {
          headers: { Authorization: 'Bearer ' + getToken() }
        })
        if (res.ok) {
          const data = await res.json()
          username.value = data.username
          createdAt.value = data.createdAt
        }
      } catch (err) {
        console.error('获取用户信息失败', err)
      }
    }
    onMounted(() => {
      isMobile.value = checkIfMobile()
      fetchUser()
    })
    return {
      isMobile,
      username,
      createdAt
    }
  }
}
</script>
<style scoped>
.user-profile {
  padding: 30px 10px;
  max-width: 400px;
  margin: 0 auto;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  text-align: center;
}
.profile-header {
  margin-bottom: 20px;
}
.avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  margin-bottom: 10px;
  border: 2px solid #3498db;
}
h2 {
  margin: 0 0 8px 0;
  font-size: 24px;
  color: #2c3e50;
}
p {
  color: #888;
  margin: 0 0 10px 0;
}
.profile-info {
  text-align: left;
  margin-top: 20px;
}
.profile-info h3 {
  font-size: 18px;
  color: #3498db;
  margin-bottom: 10px;
}
.profile-info ul {
  list-style: none;
  padding: 0;
}
.profile-info li {
  font-size: 16px;
  margin-bottom: 8px;
  color: #34495e;
}
</style> 