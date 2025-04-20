<template>
    <div class="counter-page">
      <h2 class="page-title">计算机组成原理计算题解答</h2>
  
      <!-- 计算类型选择 -->
      <div class="calculator-selector">
        <label class="selector-label">选择计算类型:</label>
        <select v-model="selectedCalculator" class="selector">
          <option value="" disabled>请选择...</option>
          <option value="float">浮点数加减乘除运算</option>
          <option value="fixed">定点小数加减乘运算</option>
          <option value="number">数字转换</option>
          <option value="complement">补码计算</option>
        </select>
      </div>
  
      <!-- 动态渲染子组件 -->
      <div v-if="selectedCalculator" class="calculator-container">
        <FloatCalculator v-if="selectedCalculator === 'float'" />
        <FixedCalculator v-if="selectedCalculator === 'fixed'" />
        <NumberConverter v-if="selectedCalculator === 'number'" />
        <ComplementCalculator v-if="selectedCalculator === 'complement'" />
      </div>
    </div>
  </template>
  
  <script>
  import FloatCalculator from '../components/counter/FloatCalculator.vue';
  import FixedCalculator from '../components/counter/FixedCalculator.vue';
  import NumberConverter from '../components/counter/NumberConverter.vue';
  import ComplementCalculator from '../components/counter/ComplementCalculator.vue';
  
  export default {
    name: 'CounterPage',
    components: {
      FloatCalculator,
      FixedCalculator,
      NumberConverter,
      ComplementCalculator
    },
    data() {
      return {
        selectedCalculator: ''
      };
    }
  };
  </script>
  
  <style scoped>
  /* 页面整体样式 */
  .counter-page {
    padding: 20px 15px;
    max-width: 100%;
    margin: 0 auto;
    background: #e6f0fa; /* 浅蓝色背景，匹配截图 */
    min-height: 100vh;
    box-sizing: border-box;
  }
  
  /* 页面标题 */
  .page-title {
    font-size: 20px;
    font-weight: 700;
    color: #2c3e50;
    text-align: center;
    margin-bottom: 20px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    position: relative;
  }
  
  .page-title::after {
    content: '';
    display: block;
    width: 40px;
    height: 3px;
    background: #007bff;
    margin: 8px auto;
    border-radius: 1.5px;
  }
  
  /* 计算类型选择器 */
  .calculator-selector {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .selector-label {
    font-size: 14px;
    font-weight: 500;
    color: #2c3e50;
    margin-bottom: 8px;
  }
  
  .selector {
    padding: 14px;
    border: 1px solid #d1d9e6;
    border-radius: 12px;
    font-size: 16px;
    color: #34495e;
    background-color: #ffffff;
    width: 100%;
    max-width: 320px;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-image: url('data:image/svg+xml;utf8,<svg fill="%2334495e" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>');
    background-repeat: no-repeat;
    background-position: right 10px center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .selector:focus {
    outline: none;
    border-color: #007bff;
  }
  
  /* 子组件容器 */
  .calculator-container {
    animation: fadeIn 0.5s ease-in-out;
  }
  
  /* 卡片式布局 */
  .section {
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin-bottom: 20px;
  }
  
  .section h3 {
    font-size: 16px;
    color: #34495e;
    margin-bottom: 15px;
    font-weight: 600;
    border-left: 3px solid #007bff;
    padding-left: 8px;
  }
  
  /* 输入组 */
  .input-group {
    margin-bottom: 30px;
  }
  
  label {
    display: block;
    margin-bottom: 6px;
    font-size: 14px;
    font-weight: 500;
    color: #2c3e50;
  }
  
  input,
  select {
    width: 100%;
    padding: 14px 16px;
    border: 1px solid #d1d9e6;
    border-radius: 12px;
    font-size: 16px;
    color: #34495e;
    background-color: #ffffff;
    box-sizing: border-box;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  input:focus,
  select:focus {
    outline: none;
    border-color: #007bff;
  }
  
  /* 按钮样式 */
  button {
    display: block;
    width: 100%;
    padding: 16px;
    background: linear-gradient(45deg, #4a90e2, #007bff);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 18px;
    font-weight: 500;
    transition: transform 0.1s, background 0.3s;
    touch-action: manipulation;
  }
  
  button:active {
    transform: scale(0.98);
    background: linear-gradient(45deg, #007bff, #4a90e2);
  }
  
  /* 结果展示 */
  .result {
    margin-top: 15px;
    padding: 10px; /* 紧凑布局 */
    background-color: #f8f9fa;
    border-radius: 8px;
    border-left: none; /* 移除左侧边框，匹配截图 */
  }
  
  .result h4 {
    font-size: 14px;
    color: #34495e;
    margin-bottom: 6px;
    font-weight: 600;
  }
  
  .result p {
    font-size: 14px;
    color: #2c3e50;
    margin-bottom: 8px;
  }
  
  pre {
    white-space: pre-wrap;
    background-color: transparent; /* 无背景，匹配截图 */
    padding: 0; /* 移除内边距 */
    border-radius: 0;
    font-size: 12px;
    color: #2c3e50;
    line-height: 1.5;
    border-left: none; /* 移除边框 */
  }
  
  /* 淡入动画 */
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
  
  /* 响应式调整 */
  @media (min-width: 768px) {
    .counter-page {
      padding: 30px 20px;
      max-width: 600px;
    }
  
    .page-title {
      font-size: 24px;
    }
  
    .selector-label {
      font-size: 16px;
    }
  
    .selector {
      font-size: 16px;
      max-width: 400px;
    }
  
    .section {
      padding: 25px;
    }
  
    .section h3 {
      font-size: 18px;
    }
  
    label {
      font-size: 16px;
    }
  
    input,
    select {
      font-size: 16px;
    }
  
    button {
      font-size: 18px;
    }
  
    .result h4 {
      font-size: 16px;
    }
  
    .result p {
      font-size: 16px;
    }
  
    pre {
      font-size: 14px;
    }
  }
  </style>