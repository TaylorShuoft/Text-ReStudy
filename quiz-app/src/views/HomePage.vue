<template>
  <div class="home">
    <div class="header">
      <h1>题目汇总</h1>
      <span class="progress-bar">
        <div class="progress" :style="{ width: progress + '%' }"></div>
      </span>
      <p>{{ completedQuestions }} / {{ totalQuestions }} 题已完成</p>
    </div>
    
    <div class="plan">
      <div class="plan-item">
        <h2>需要学习</h2>
        <p class="question-count">{{ newQuestions }} 题</p>
      </div>
      <div class="plan-item">
        <h2>需要复习</h2>
        <p class="question-count">{{ reviewQuestions }} 题</p>
      </div>
    </div>

    <button class="start-button" @click="$router.push('/quiz')">开始刷题吧！</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      totalQuestions: 100,   // 总题目数
      completedQuestions: 25, // 已完成的题目数（示例）
      newQuestions: 40,      // 需要学习的题目数
      reviewQuestions: 10,    // 需要复习的题目数
    };
  },
  computed: {
    progress() {
      return (this.completedQuestions / this.totalQuestions) * 100; // 进度计算
    },
  },
};
</script>

<style scoped>
.home {
  padding: 20px;
  text-align: center;
}

.header {
  margin-bottom: 20px;
}

.progress-bar {
  background-color: #eee;
  border-radius: 5px;
  height: 10px;
  position: relative;
  margin: 10px 0;
}

.progress {
  background-color: #4caf50;
  height: 100%;
  border-radius: 5px;
}

.plan {
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
}

.plan-item {
  flex: 1;
  text-align: center;
}

.question-count {
  font-size: 24px;
  font-weight: bold;
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
</style>
