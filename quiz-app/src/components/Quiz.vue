<template>
  <div class="quiz">
    <!-- 左上角返回按钮 -->
    <button class="back-button" @click="goHome">返回首页</button>

    <!-- 当前题目 -->
    <h1>{{ subject }}答题页</h1>

    <div v-if="currentQuestion">
      <h2>{{ questionType }}题 ({{ currentQuestion.id }})</h2>
      <p>{{ currentQuestion.text }}</p>

      <!-- 答案选项及左右导航按钮 -->
      <div class="options-container">
        <!-- 左侧导航按钮 -->
        <button class="nav-button left" @click="previousQuestion">←</button>

        <!-- 答案选项 -->
        <div class="options">
          <button
            v-for="(option, index) in currentOptions"
            :key="index"
            class="option-button"
            :class="{
              correct: selectedAnswer === option && isCorrect,
              incorrect: selectedAnswer === option && !isCorrect
            }"
            @click="selectAnswer(option)"
          >
            {{ option }}
          </button>
        </div>

        <!-- 右侧导航按钮 -->
        <button class="nav-button right" @click="nextQuestion">→</button>
      </div>

      <!-- 显示正确答案 -->
      <p v-if="showCorrectAnswer" class="correct-answer">
        正确答案是：{{ currentQuestion.answer }}
      </p>
    </div>

    <!-- 没有更多题目时 -->
    <div v-else>
      <h2>恭喜你，已经完成所有题目！</h2>
      <button class="restart-button" @click="restartQuiz">重新开始</button>
    </div>

    <!-- 答题卡组件 -->
    <select-quiz
      :groupedQuestions="groupedQuestions"
      :currentQuestionIndex="currentQuestionIndex"
      :answers="answers"
      @navigate="navigateToQuestion"
    />
  </div>
</template>
<script>
// 导入 JSON 数据
import quizData from "@/assets/quiz.json";
// 导入答题卡组件
import SelectQuiz from "@/components/select_quiz.vue";

export default {
  name: "QuizPage",
  components: {
    SelectQuiz,
  },
  data() {
    return {
      subject: "", // 当前科目
      questions: [], // 当前科目的所有题目
      currentQuestionIndex: 0, // 当前题目索引
      selectedAnswer: null, // 用户选择的答案
      isCorrect: false, // 答案是否正确
      showCorrectAnswer: false, // 是否显示正确答案
      answers: [], // 答题状态数组：'correct', 'incorrect', 'unanswered'
    };
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex];
    },
    questionType() {
      if (!this.currentQuestion) return "";
      return this.currentQuestion.options.length > 2 ? "选择" : "判断";
    },
    currentOptions() {
      if (!this.currentQuestion) return [];
      return this.currentQuestion.options || [];
    },
    groupedQuestions() {
      const groups = {};
      this.questions.forEach((question, index) => {
        const type = question.type || "其他";
        if (!groups[type]) {
          groups[type] = [];
        }
        groups[type].push({ ...question, globalIndex: index }); // 添加全局索引
      });
      return groups;
    },
  },
  created() {
    this.subject = this.$route.query.subject;
    if (quizData[this.subject]) {
      const subjectData = quizData[this.subject];
      this.questions = [
        ...(subjectData["单选题"] || []).map(q => ({ ...q, type: "单选题" })),
        ...(subjectData["判断题"] || []).map(q => ({ ...q, type: "判断题" })),
        ...(subjectData["填空题"] || []).map(q => ({ ...q, type: "填空题" }))
      ];
      this.answers = Array(this.questions.length).fill("unanswered");
    }
  },

methods: {
  goHome() {
    this.$router.push("/"); // 返回首页
  },
  selectAnswer(option) {
    this.selectedAnswer = option;
    this.isCorrect = option === this.currentQuestion.answer;
    if (this.isCorrect) {
      this.answers[this.currentQuestionIndex] = "correct";
      setTimeout(() => {
        this.nextQuestion();
      }, 500);
    } else {
      this.answers[this.currentQuestionIndex] = "incorrect";
      this.showCorrectAnswer = true;
    }
  },
  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.resetState();
    } else {
      this.showNextAlert();
    }
  },
  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.resetState();
    } else {
      this.showPreviousAlert();
    }
  },
  navigateToQuestion(index) {
    this.currentQuestionIndex = index;
    this.resetState();
  },
  resetState() {
    this.selectedAnswer = null;
    this.isCorrect = false;
    this.showCorrectAnswer = false;
  },
  restartQuiz() {
    this.currentQuestionIndex = 0;
    this.answers = Array(this.questions.length).fill("unanswered");
    this.resetState();
  },
  showPreviousAlert() {
    alert("无法后退");
  },
  showNextAlert() {
    alert("已经是最后一题");
  },
},
};
</script>
<style scoped>
.quiz {
  padding: 20px;
  text-align: center;
  font-family: Arial, sans-serif;
  position: relative;
}

.back-button {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
}

.back-button:hover {
  background-color: #0056b3;
}

.options-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
}

.nav-button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 18px;
  cursor: pointer;
}

.nav-button:hover {
  background-color: #0056b3;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: 0 20px;
}

.option-button {
  background-color: #f0f0f0;
  border: none;
  border-radius: 12px;
  padding: 15px 20px;
  font-size: 16px;
  width: 100%;
  max-width: 400px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
 
}


.option-button.correct {
  background-color: #007bff;
  color: white;
}

.option-button.incorrect {
  background-color: #f44336;
  color: white;
}

.correct-answer {
  margin-top: 20px;
  color: #f44336;
  font-size: 18px;
}

.restart-button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.restart-button:hover {
  background-color: #0056b3;
}
</style>
