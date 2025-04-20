<template>
    <div class="section">
      <h3>补码计算</h3>
      <div class="input-group">
        <label>输入十进制数 (支持负数):</label>
        <input v-model="complementInput" placeholder="如: -42, 42" />
      </div>
      <div class="input-group">
        <label>位数:</label>
        <select v-model="bitLength">
          <option value="8">8位</option>
          <option value="16">16位</option>
          <option value="32">32位</option>
        </select>
      </div>
      <button @click="calculateComplement">计算</button>
      <div v-if="complementResult" class="result">
        <h4>结果:</h4>
        <p>{{ complementResult }}</p>
        <h4>解题过程:</h4>
        <pre>{{ complementSteps }}</pre>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ComplementCalculator',
    data() {
      return {
        complementInput: '',
        bitLength: '8',
        complementResult: '',
        complementSteps: ''
      };
    },
    methods: {
      calculateComplement() {
        try {
          let num = parseInt(this.complementInput);
          if (isNaN(num)) throw new Error('请输入有效的十进制数');
          
          let steps = [];
          let bitLen = parseInt(this.bitLength);
          steps.push(`输入: ${num} (十进制), 位数: ${bitLen}`);
  
          let result;
          if (num >= 0) {
            result = num.toString(2).padStart(bitLen, '0');
            steps.push(`正数补码: 直接转换为二进制并补齐位数`);
            steps.push(`${num} = ${result}`);
          } else {
            let absNum = Math.abs(num);
            let binary = absNum.toString(2).padStart(bitLen, '0');
            steps.push(`1. 取绝对值: ${absNum} = ${binary}`);
            
            let inverted = binary.split('')
              .map(bit => bit === '0' ? '1' : '0')
              .join('');
            steps.push(`2. 按位取反: ${inverted}`);
            
            let carry = 1;
            let resultArray = inverted.split('').reverse();
            for (let i = 0; i < resultArray.length; i++) {
              if (carry === 0) break;
              if (resultArray[i] === '0') {
                resultArray[i] = '1';
                carry = 0;
              } else {
                resultArray[i] = '0';
              }
            }
            result = resultArray.reverse().join('');
            steps.push(`3. 加1: ${result}`);
          }
  
          this.complementResult = result;
          this.complementSteps = steps.join('\n');
        } catch (error) {
          this.complementResult = '错误: ' + error.message;
          this.complementSteps = '';
        }
      }
    }
  };
  </script>