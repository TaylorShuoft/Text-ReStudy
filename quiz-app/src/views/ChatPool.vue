<template>
    <div class="chat-pool">
      <h1 class="chat-title">聊天池</h1>
      <div class="chat-container">
        <div class="chat-list">
          <div v-for="(msg, idx) in messages" :key="msg._id || idx" class="chat-msg">
            <span class="user">{{ msg.nickname }}：</span>
            <span class="text">{{ msg.text }}</span>
          </div>
        </div>
      </div>
      <div class="chat-input-bar">
        <input v-model="input" class="chat-input" placeholder="说点什么..." @keyup.enter="sendMsg" />
        <button class="send-btn" @click="sendMsg">发送</button>
      </div>
      <BottomNav v-if="isMobile" />
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue'
  import BottomNav from '@/components/BottomNav.vue'
  export default {
    name: 'ChatPool',
    components: { BottomNav },
    setup() {
      const isMobile = ref(false)
      const checkIfMobile = () => {
        const userAgent = navigator.userAgent.toLowerCase()
        return /mobile|android|iphone|ipad|phone/i.test(userAgent)
      }
      onMounted(() => {
        isMobile.value = checkIfMobile()
        fetchMessages()
      })
      const messages = ref([])
      const input = ref('')
      const loading = ref(false)
      function getToken() {
        return localStorage.getItem('token') || ''
      }
      async function fetchMessages() {
        try {
          const res = await fetch('/api/messages', {
            headers: { Authorization: 'Bearer ' + getToken() }
          })
          if (res.ok) {
            messages.value = await res.json()
          }
        } catch (err) {
          console.error('获取消息失败', err)
        }
      }
      async function sendMsg() {
        if (!input.value.trim()) return
        loading.value = true
        try {
          const res = await fetch('/api/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + getToken()
            },
            body: JSON.stringify({ text: input.value })
          })
          if (res.ok) {
            input.value = ''
            await fetchMessages()
          }
        } finally {
          loading.value = false
        }
      }
      setInterval(fetchMessages, 5000)
      return { isMobile, messages, input, sendMsg, loading }
    }
  }
  </script>
  
  <style scoped>
  .chat-pool {
    padding: 20px 0 80px 0;
    max-width: 500px;
    margin: 0 auto;
    min-height: 100vh;
    background: #f7f8fa;
    display: flex;
    flex-direction: column;
  }
  
  .chat-title {
    text-align: right;
    margin-right: 20px;
    font-size: 24px;
    color: #333;
    margin-bottom: 10px;
  }
  
  .chat-container {
    flex: 1;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: #fff;
    margin: 0 16px 10px 16px;
    overflow: hidden;
  }
  
  .chat-list {
    flex: 1;
    padding: 10px 16px;
    overflow-y: auto;
    margin-bottom: 0;
  }
  
  .chat-msg {
    margin-bottom: 10px;
    font-size: 15px;
    color: #333;
  }
  
  .user {
    color: #2196F3;
    font-weight: bold;
  }
  
  .chat-input-bar {
    display: flex;
    padding: 10px 16px;
    background: #fff;
    border-top: 1px solid #eee;
    position: fixed;
    left: 0;
    bottom: 70px;
    width: 100vw;
    max-width: 500px;
    box-sizing: border-box;
  }
  
  .chat-input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 15px;
    outline: none;
  }
  
  .send-btn {
    margin-left: 8px;
    background: #2196F3;
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 0 18px;
    font-size: 15px;
    cursor: pointer;
    transition: background 0.2s;
  }
  
  .send-btn:hover {
    background: #1769aa;
  }
  </style>