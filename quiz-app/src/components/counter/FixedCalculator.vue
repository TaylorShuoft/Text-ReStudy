<template>
    <div class="section">
      <h3>定点小数加减乘运算</h3>
      <div class="input-group">
        <label>输入 x (格式: 2^位移 * 尾数，如 2^-011 * 0.110110):</label>
        <input v-model="fixedX" placeholder="如: 2^-011 * 0.110110" />
      </div>
      <div class="input-group">
        <label>输入 y (格式: 2^位移 * 尾数，如 2^-001 * -0.010101):</label>
        <input v-model="fixedY" placeholder="如: 2^-001 * -0.010101" />
      </div>
      <div class="input-group">
        <label>运算类型:</label>
        <select v-model="fixedOperation">
          <option value="add">加法 (+)</option>
          <option value="sub">减法 (-)</option>
          <option value="mul">乘法 (*)</option>
        </select>
      </div>
      <button @click="calculateFixedOperation">计算</button>
      <div v-if="fixedResult" class="result">
        <h4>结果:</h4>
        <p>{{ fixedResult }}</p>
        <h4>解题过程:</h4>
        <pre>{{ fixedSteps }}</pre>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'FixedCalculator',
    data() {
      return {
        fixedX: '',
        fixedY: '',
        fixedOperation: 'add',
        fixedResult: '',
        fixedSteps: ''
      };
    },
    methods: {
      parseFixedInput(input) {
        const regex = /2\^([-]?\d+)\s*\*\s*([-]?\d+\.\d+)/;
        const match = input.match(regex);
        if (!match) throw new Error('输入格式错误，应为 2^位移 * 尾数');
        
        const shift = parseInt(match[1], 10);
        const mantissa = parseFloat(match[2]);
        if (Math.abs(mantissa) >= 1) throw new Error('尾数必须在 (-1, 1) 范围内');
        
        const sign = mantissa < 0 ? 1 : 0;
        let absMantissa = Math.abs(mantissa);
        let mantissaBin = '';
        for (let i = 0; i < 6; i++) {
          absMantissa *= 2;
          const bit = Math.floor(absMantissa);
          mantissaBin += bit;
          absMantissa -= bit;
        }
        mantissaBin = `${sign ? '-' : ''}0.${mantissaBin}`;
        
        let trueValueBin = '0'.repeat(9);
        if (shift >= 0) {
          trueValueBin = '0'.repeat(9 - shift) + mantissaBin.replace('-', '').split('.')[1].slice(0, shift);
        }
        trueValueBin = `${sign ? '-' : ''}${trueValueBin}`;
        
        return { shift, mantissaBin, trueValueBin };
      },
      addFixedMantissa(mantissaX, mantissaY) {
        let mx = mantissaX;
        let my = mantissaY;
        let signX = mx[0] === '-' ? -1 : 1;
        let signY = my[0] === '-' ? -1 : 1;
        mx = mx.replace('-', '');
        my = my.replace('-', '');
        
        let mxVal = parseInt(mx, 2);
        let myVal = parseInt(my, 2);
        let result = signX * mxVal + signY * myVal;
        const sign = result < 0 ? '-' : '';
        result = Math.abs(result).toString(2).padStart(9, '0');
        return `${sign}${result}`;
      },
      multiplyFixedMantissa(mantissaX, mantissaY, shiftX, shiftY) {
        let mx = mantissaX.replace('-', '').split('.')[1];
        let my = mantissaY.replace('-', '').split('.')[1];
        let signX = mantissaX[0] === '-' ? -1 : 1;
        let signY = mantissaY[0] === '-' ? -1 : 1;
        
        let mxVal = parseInt(mx, 2) / 2**6;
        let myVal = parseInt(my, 2) / 2**6;
        let result = mxVal * myVal;
        const sign = (signX * signY) < 0 ? '-' : '';
        result = Math.abs(result);
        let bin = '';
        for (let i = 0; i < 12; i++) {
          result *= 2;
          const bit = Math.floor(result);
          bin += bit;
          result -= bit;
        }
        
        const totalShift = shiftX + shiftY;
        let trueValueBin = '0'.repeat(9);
        if (totalShift >= 0) {
          trueValueBin = '0'.repeat(9 - totalShift) + bin.slice(0, totalShift);
        }
        return `${sign}${trueValueBin}`;
      },
      calculateFixedOperation() {
        try {
          let steps = [];
          const x = this.parseFixedInput(this.fixedX);
          const y = this.parseFixedInput(this.fixedY);
          
          steps.push(`x: 位移 ${x.shift}, 尾数 ${x.mantissaBin}, 真值 ${x.trueValueBin}`);
          steps.push(`y: 位移 ${y.shift}, 尾数 ${y.mantissaBin}, 真值 ${y.trueValueBin}`);
          
          let result;
          if (this.fixedOperation === 'add' || this.fixedOperation === 'sub') {
            if (this.fixedOperation === 'add') {
              result = this.addFixedMantissa(x.trueValueBin, y.trueValueBin);
              steps.push(`加法：${x.trueValueBin} + ${y.trueValueBin} = ${result}`);
            } else {
              let negY = y.trueValueBin.startsWith('-') ? y.trueValueBin.replace('-', '') : `-${y.trueValueBin}`;
              result = this.addFixedMantissa(x.trueValueBin, negY);
              steps.push(`减法：${x.trueValueBin} + (${negY}) = ${result}`);
            }
          } else {
            result = this.multiplyFixedMantissa(x.mantissaBin, y.mantissaBin, x.shift, y.shift);
            steps.push(`乘法：尾数 ${x.mantissaBin} * ${y.mantissaBin}`);
            steps.push(`位移：${x.shift} + ${y.shift} = ${x.shift + y.shift}`);
            steps.push(`结果：${result}`);
          }
          
          this.fixedResult = result;
          this.fixedSteps = steps.join('\n');
        } catch (error) {
          this.fixedResult = '错误: ' + error.message;
          this.fixedSteps = '';
        }
      }
    }
  };
  </script>