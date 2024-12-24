<template>
  <div class="quiz">
    <h1>答题页</h1>
    
    <div class="question">
      <h2>选择题</h2>
      <p>{{ choiceQuestion.text }}</p>
      <div class="options">
        <div v-for="option in choiceQuestion.options" :key="option">
          <input
            type="radio"
            :value="option"
            v-model="selectedChoiceAnswer"
            :name="'choice-' + choiceQuestion.id"
          />
          {{ option }}
        </div>
      </div>
      <p>选择的答案: {{ selectedChoiceAnswer }}</p>
    </div>

    <div class="question">
      <h2>判断题</h2>
      <p>{{ trueFalseQuestion.text }}</p>
      <div class="options">
        <div>
          <input
            type="radio"
            value="正确"
            v-model="selectedTrueFalseAnswer"
            :name="'truefalse-' + trueFalseQuestion.id"
          />
          正确
        </div>
        <div>
          <input
            type="radio"
            value="错误"
            v-model="selectedTrueFalseAnswer"
            :name="'truefalse-' + trueFalseQuestion.id"
          />
          错误
        </div>
      </div>
      <p>选择的答案: {{ selectedTrueFalseAnswer }}</p>
    </div>

    <button class="submit-button" @click="submitAnswers">提交答案</button>
  </div>
</template>

<script>
export default {
  name: 'QuizPage',
  data() {
    return {
      choiceQuestion: {
        id: 1,
        text: 'JavaScript 是一种类型安全的语言吗？',
        options: ['是', '否']
      },
      trueFalseQuestion: {
        id: 2,
        text: 'Vue.js 是一个后端框架？'
      },
      selectedChoiceAnswer: '',
      selectedTrueFalseAnswer: ''
    };
  },
  methods: {
    submitAnswers() {
      // 这里可以实现提交答案的逻辑
      console.log('选择题答案:', this.selectedChoiceAnswer);
      console.log('判断题答案:', this.selectedTrueFalseAnswer);
    }
  }
};
</script>

<style scoped>
.quiz {
  padding: 20px;
}

.question {
  margin-bottom: 20px;
}

.options {
  margin: 10px 0;
}

.submit-button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #0056b3;
}
</style>
