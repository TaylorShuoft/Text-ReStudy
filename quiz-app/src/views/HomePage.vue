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
    },
    startQuiz() {
      // 跳转到刷题页面，并传递选择的科目
      this.$router.push({ path: "/quiz", query: { subject: this.selectedSubject } });
    },
    goToFilesPage() {
      // 跳转到文件下载页面
      this.$router.push("/files");
    },
  },
};
</script>

<style scoped>
.home {
  padding: 20px;
  text-align: center;
  font-family: Arial, sans-serif;
}

.header {
  margin-bottom: 20px;
}

.header h1 {
  font-size: 24px;
  color: #333;
}

.subject-list {
  margin: 20px 0;
}

.subject-list h2 {
  margin-bottom: 10px;
  color: #007bff;
  font-size: 20px;
}

.subject {
  margin: 10px 0;
}

.subject-button {
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  width: 200px;
}

.subject-button:hover {
  background-color: #388e3c;
}

.start-button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
}

.start-button:hover {
  background-color: #0056b3;
}

.download-button {
  background-color: #ff9800;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
}

.download-button:hover {
  background-color: #e68900;
}

.desktop-warning {
  text-align: center;
  color: #ff0000;
  font-size: 20px;
  margin-top: 100px;
}

p {
  font-size: 16px;
  margin-bottom: 20px;
}
</style>
