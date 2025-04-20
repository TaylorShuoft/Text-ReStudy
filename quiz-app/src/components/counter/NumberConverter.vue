<template>
    <div class="section">
      <h3>数字转换</h3>
      <div class="input-group">
        <label>输入数字 (支持二进制/十进制/十六进制):</label>
        <input v-model="numberInput" placeholder="如: 1010, 42, 0x2A" />
      </div>
      <div class="input-group">
        <label>转换类型:</label>
        <select v-model="conversionType">
          <option value="bin2dec">二进制 → 十进制</option>
          <option value="bin2hex">二进制 → 十六进制</option>
          <option value="dec2bin">十进制 → 二进制</option>
          <option value="dec2hex">十进制 → 十六进制</option>
          <option value="hex2bin">十六进制 → 二进制</option>
          <option value="hex2dec">十六进制 → 十进制</option>
        </select>
      </div>
      <button @click="calculateConversion">计算</button>
      <div v-if="conversionResult" class="result">
        <h4>结果:</h4>
        <p>{{ conversionResult }}</p>
        <h4>解题过程:</h4>
        <pre>{{ conversionSteps }}</pre>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'NumberConverter',
    data() {
      return {
        numberInput: '',
        conversionType: 'bin2dec',
        conversionResult: '',
        conversionSteps: ''
      };
    },
    methods: {
      calculateConversion() {
        try {
          let num = this.numberInput.trim();
          let result, steps = [];
          let value;
          if (num.startsWith('0x')) {
            value = parseInt(num, 16);
            steps.push(`输入: ${num} (十六进制)`);
          } else if (/^[01]+$/.test(num)) {
            value = parseInt(num, 2);
            steps.push(`输入: ${num} (二进制)`);
          } else if (/^-?\d+$/.test(num)) {
            value = parseInt(num, 10);
            steps.push(`输入: ${num} (十进制)`);
          } else {
            throw new Error('无效的输入格式');
          }
  
          switch (this.conversionType) {
            case 'bin2dec':
              if (!/^[01]+$/.test(num)) throw new Error('请输入二进制数');
              result = value.toString(10);
              steps.push(`计算过程: ${num} = ${value}`);
              break;
            case 'bin2hex':
              if (!/^[01]+$/.test(num)) throw new Error('请输入二进制数');
              result = value.toString(16).toUpperCase();
              steps.push(`1. 二进制 ${num} = 十进制 ${value}`);
              steps.push(`2. 十进制 ${value} = 十六进制 ${result}`);
              break;
            case 'dec2bin':
              if (!/^-?\d+$/.test(num)) throw new Error('请输入十进制数');
              result = Math.abs(value).toString(2);
              steps.push(`计算过程: ${value} = ${result} (二进制)`);
              break;
            case 'dec2hex':
              if (!/^-?\d+$/.test(num)) throw new Error('请输入十进制数');
              result = Math.abs(value).toString(16).toUpperCase();
              steps.push(`计算过程: ${value} = ${result} (十六进制)`);
              break;
            case 'hex2bin':
              if (!num.startsWith('0x')) throw new Error('请输入十六进制数');
              result = value.toString(2);
              steps.push(`1. 十六进制 ${num} = 十进制 ${value}`);
              steps.push(`2. 十进制 ${value} = 二进制 ${result}`);
              break;
            case 'hex2dec':
              if (!num.startsWith('0x')) throw new Error('请输入十六进制数');
              result = value.toString(10);
              steps.push(`计算过程: ${num} = ${result} (十进制)`);
              break;
          }
  
          this.conversionResult = result;
          this.conversionSteps = steps.join('\n');
        } catch (error) {
          this.conversionResult = '错误: ' + error.message;
          this.conversionSteps = '';
        }
      }
    }
  };
  </script>