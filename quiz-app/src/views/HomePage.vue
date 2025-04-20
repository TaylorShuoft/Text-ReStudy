<template>
  <div class="home">
    <!-- 页面标题 -->
    <div v-if="isMobile" class="header">
      <h1>考试题库</h1>
    </div>

    <!-- 手机端显示的内容 -->
    <div v-if="isMobile">
      <!-- 选择科目按钮 -->
      <div v-if="!isSubjectSelected && !showSubjects">
        <button class="start-button" @click="showSubjects = true">
          选填答题
        </button>
      </div>

      <!-- 计算器按钮 -->
<div v-if="!showSubjects && !isSubjectSelected" class="calculator-button">
  <button class="calc-button" @click="goToCalculator">
    计算器
  </button>
</div>
      <!-- 文档下载按钮 -->
      <div v-if="!showSubjects && !isSubjectSelected" class="files-download">
        <button class="download-button" @click="goToFilesPage">
          资料下载
        </button>
      </div>

      <!-- 科目选择界面 -->
      <div v-if="showSubjects && !isSubjectSelected" class="subject-list">
        <h2>请选择科目</h2>
        <div
          v-for="(categories, subject) in quizData"
          :key="subject"
          class="subject"
        >
          <button
            class="subject-button"
            @click="selectSubject(subject)"
          >
            {{ subject }}
          </button>
        </div>
      </div>

      <!-- 开始答题按钮 -->
      <div v-if="isSubjectSelected">
        <p>已选择科目：<strong>{{ selectedSubject }}</strong></p>
        <button class="start-button" @click="startQuiz">
          开始答题吧！
        </button>
      </div>
    </div>

    <!-- 电脑端提示 -->
    <div v-else class="desktop-warning">
      <h1>请用手机打开本页面</h1>
    </div>

    <!-- 公告牌 -->
    <div v-if="!showSubjects && !isSubjectSelected" class="announcement-board">
      <div class="announcement-header">
        <h2>公告牌</h2>
        <div class="nav-buttons">
          <button @click="showAnnouncement('updates')" :class="{ active: currentAnnouncement === 'updates' }">更新</button>
          <button @click="showAnnouncement('alerts')" :class="{ active: currentAnnouncement === 'alerts' }">提示</button>
          <button @click="showAnnouncement('previews')" :class="{ active: currentAnnouncement === 'previews' }">预告</button>
        </div>
      </div>
      <div class="announcement-content">
        <ul v-if="currentAnnouncement === 'updates'">
          <li v-for="(update, index) in updates" :key="index">
            {{ update.date }} - {{ update.description }}
          </li>
        </ul>
        <ul v-if="currentAnnouncement === 'alerts'">
          <li v-for="(alert, index) in alerts" :key="index">
            {{ alert.date }} - {{ alert.description }}
          </li>
        </ul>
        <ul v-if="currentAnnouncement === 'previews'">
          <li v-for="(preview, index) in previews" :key="index">
            {{ preview.date }} - {{ preview.description }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
// 导入题库数据
import quizData from "@/assets/quiz.json";

export default {
  data() {
    return {
      quizData: {}, // 存储题库数据
      showSubjects: false, // 控制是否显示科目选择界面
      isSubjectSelected: false, // 是否已经选择了科目
      selectedSubject: "", // 已选择的科目
      isMobile: false, // 判断是否为手机端
      updates: [
      { date: '2025-4-13', description: '更新！jsp！' },
  
        
      ],
      alerts: [
        { date: '2024-12-27', description: '提示！老师没透题😢！' },
      ],
      previews: [
        { date: '2024-12-28', description: '没办法了，老师没透题😢！' },
      ],
      currentAnnouncement: 'updates', // 控制当前显示的公告类型
    };
  },
  created() {
    // 加载题库数据
    this.quizData = quizData;

    // 判断是否为手机端
    this.isMobile = this.checkIfMobile();

    // 如果是电脑端则锁定鼠标指针
    if (!this.isMobile) {
      document.body.style.cursor = "not-allowed";
    }
  },
  methods: {
    checkIfMobile() {
      const userAgent = navigator.userAgent.toLowerCase();
      return /mobile|android|iphone|ipad|phone/i.test(userAgent);
    },
    selectSubject(subject) {
      this.selectedSubject = subject; // 保存选择的科目
      this.isSubjectSelected = true; // 标记科目已选择
      this.showSubjects = false; // 隐藏科目选择界面
      this.showUpdateLog = false; // 隐藏更新日志
    },
    startQuiz() {
      // 跳转到刷题页面，并传递选择的科目
      this.$router.push({ path: "/quiz", query: { subject: this.selectedSubject } });
    },
    goToFilesPage() {
      // 跳转到文件下载页面
      this.$router.push("/files");
    },
    goToCalculator() {
  // 跳转到计算器页面
  this.$router.push("/counter");
},
    showAnnouncement(type) {
      this.currentAnnouncement = type;
    },
  },
};
</script>
<style scoped>
/* 全局容器 */
.home {
  padding: 20px;
  text-align: center;
  font-family: 'Segoe UI', 'PingFang SC', Arial, sans-serif;
  background: linear-gradient(135deg, #f0f4f8 0%, #e1e7ef 100%);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 页面标题 */
.header h1 {
  font-size: 28px;
  color: #2c3e50;
  margin-bottom: 20px;
  font-weight: 600;
  letter-spacing: 1px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 科目选择界面 */
.subject-list {
  margin: 20px 0;
  padding: 20px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  max-width: 90%;
  animation: fadeIn 0.5s ease-in;
}

.subject-list h2 {
  font-size: 22px;
  color: #34495e;
  margin-bottom: 15px;
  font-weight: 500;
}

.subject {
  margin: 12px 0;
}

.subject-button {
  background: linear-gradient(45deg, #3498db, #2980b9);
  color: #fff;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  width: 220px;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.subject-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  background: linear-gradient(45deg, #2980b9, #3498db);
}

.subject-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 开始答题按钮 */
.start-button {
  background: linear-gradient(45deg, #1abc9c, #16a085);
  color: #fff;
  padding: 16px 36px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  margin: 20px 0;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.start-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  background: linear-gradient(45deg, #16a085, #1abc9c);
}

.start-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 资料下载按钮 */
.download-button {
  background: linear-gradient(45deg, #f39c12, #e67e22);
  color: #fff;
  padding: 16px 36px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  margin: 20px 0;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.download-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  background: linear-gradient(45deg, #e67e22, #f39c12);
}

.download-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 电脑端警告 */
.desktop-warning {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  color: #fff;
  font-size: 28px;
  font-weight: 600;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* 公告牌 */
.announcement-board {
  margin: 40px auto;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  max-width: 90%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  animation: slideIn 0.5s ease-out;
}

.announcement-header {
  background: linear-gradient(45deg, #2ecc71, #27ae60);
  color: #fff;
  padding: 12px 16px;
  border-radius: 8px 8px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.announcement-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
}

.nav-buttons {
  display: flex;
  gap: 8px;
}

.nav-buttons button {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s, transform 0.2s;
}

.nav-buttons button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.nav-buttons button.active {
  background: #fff;
  color: #27ae60;
  font-weight: 600;
}

.announcement-content {
  padding: 16px;
  background: #f9fbfc;
  border-radius: 0 0 8px 8px;
}

.announcement-content ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.announcement-content li {
  margin-bottom: 12px;
  font-size: 15px;
  color: #34495e;
  display: flex;
  align-items: center;
  gap: 8px;
}

.announcement-content li::before {
  content: '•';
  color: #2ecc71;
  font-size: 18px;
}
/* 计算器按钮 */
.calc-button {
  background: linear-gradient(45deg, #9b59b6, #8e44ad);
  color: #fff;
  padding: 16px 36px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  margin: 20px 0;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.calc-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  background: linear-gradient(45deg, #8e44ad, #9b59b6);
}

.calc-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 备案信息 */
.icp-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  margin-top: 0;
  padding: 12px;
  text-align: center;
  font-size: 12px;
  color: #7f8c8d;
  border-top: 1px solid #dfe6e9;
}
.icp-footer a {
  color: #7f8c8d;
  text-decoration: none;
  transition: color 0.3s;
}

.icp-footer a:hover {
  color: #3498db;
}

/* 文本样式 */
p {
  font-size: 16px;
  color: #34495e;
  margin-bottom: 20px;
}

/* 动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 响应式适配 */
@media (max-width: 768px) {
  .home {
    padding: 15px;
  }

  .header h1 {
    font-size: 24px;
  }

  .subject-button {
    width: 100%;
    max-width: 300px;
  }

  .start-button,
  .download-button {
    padding: 14px 32px;
    font-size: 16px;
  }

  .announcement-board {
    margin: 30px auto;
    padding: 15px;
  }

  .announcement-header h2 {
    font-size: 18px;
  }

  .nav-buttons button {
    padding: 6px 10px;
    font-size: 13px;
  }
}
</style>