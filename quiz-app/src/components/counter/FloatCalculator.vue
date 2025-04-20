<template>
  <div class="section">
    <h3>浮点数加减乘除运算</h3>
    <div class="input-group">
      <label>输入 x (格式: 2^阶码 * 尾数):</label>
      <input v-model="floatX" placeholder="如: 2^001 * 0.11101" />
    </div>
    <div class="input-group">
      <label>输入 y (格式: 2^阶码 * 尾数):</label>
      <input v-model="floatY" placeholder="如: 2^010 * 0.10111" />
    </div>
    <div class="input-group">
      <label>运算类型:</label>
      <select v-model="floatOperation">
        <option value="add">加法 (+)</option>
        <option value="sub">减法 (-)</option>
        <option value="mul">乘法 (*)</option>
        <option value="div">除法 (/)</option>
      </select>
    </div>
    <button @click="calculateFloatOperation">计算</button>
    <div v-if="floatResult" class="result">
      <h4>结果:</h4>
      <p>{{ floatResult }}</p>
      <h4>解题过程:</h4>
      <pre>{{ floatSteps }}</pre>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FloatCalculator',
  data() {
    return {
      floatX: '',
      floatY: '',
      floatOperation: 'mul', // 默认选择乘法
      floatResult: '',
      floatSteps: ''
    };
  },
  methods: {
    parseFloatInput(input) {
      const regex = /2\^([-]?\d+)\s*\*\s*([-]?\d+\.\d+)/;
      const match = input.match(regex);
      if (!match) throw new Error('输入格式错误，应为 2^阶码 * 尾数');
      
      const exponent = parseInt(match[1], 10);
      const mantissa = parseFloat(match[2]);
      if (Math.abs(mantissa) >= 1 || mantissa === 0) throw new Error('尾数必须在 (-1, 1) 且不为0');
      
      const sign = mantissa < 0 ? 1 : 0;
      let absMantissa = Math.abs(mantissa);
      let mantissaBin = '';
      for (let i = 0; i < 6; i++) {
        absMantissa *= 2;
        const bit = Math.floor(absMantissa);
        mantissaBin += bit;
        absMantissa -= bit;
      }
      mantissaBin = `0.${mantissaBin}`;
      
      const expBin = this.decToComplement(exponent, 5);
      if (this.complementToDec(expBin) < -16 || this.complementToDec(expBin) > 15) {
        throw new Error('阶码超出范围 (-16 到 15)');
      }
      
      return { sign, exponent, expBin, mantissa, mantissaBin };
    },
    decToComplement(num, bits) {
      if (num >= 0) {
        return num.toString(2).padStart(bits, '0');
      } else {
        const absNum = Math.abs(num);
        let bin = absNum.toString(2).padStart(bits, '0');
        let inverted = bin.split('').map(bit => (bit === '0' ? '1' : '0')).join('');
        let resultArray = inverted.split('').reverse();
        let carry = 1;
        for (let i = 0; i < resultArray.length; i++) {
          if (carry === 0) break;
          if (resultArray[i] === '0') {
            resultArray[i] = '1';
            carry = 0;
          } else {
            resultArray[i] = '0';
          }
        }
        return resultArray.reverse().join('');
      }
    },
    complementToDec(bin) {
      if (bin[0] === '0') {
        return parseInt(bin, 2);
      } else {
        let inverted = bin.split('').map(bit => (bit === '0' ? '1' : '0')).join('');
        let resultArray = inverted.split('').reverse();
        let carry = 1;
        for (let i = 0; i < resultArray.length; i++) {
          if (carry === 0) break;
          if (resultArray[i] === '0') {
            resultArray[i] = '1';
            carry = 0;
          } else {
            resultArray[i] = '0';
          }
        }
        return -parseInt(resultArray.reverse().join(''), 2);
      }
    },
    multiplyMantissa(mantissaX, mantissaY, steps) {
      let mx = mantissaX.split('.');
      let my = mantissaY.split('.');
      let signX = mx[0] === '-' ? -1 : 1;
      let signY = my[0] === '-' ? -1 : 1;
      mx = mx[0].startsWith('-') ? mx[1] : mx[1];
      my = my[0].startsWith('-') ? my[1] : my[1];
      
      let mxVal = parseInt(mx, 2) / 2**6;
      let myVal = parseInt(my, 2) / 2**6;
      let result = mxVal * myVal;
      const sign = (signX * signY) < 0 ? '-' : '';
      result = Math.abs(result);
      
      let bin = '';
      let temp = result;
      for (let i = 0; i < 7; i++) {
        temp *= 2;
        const bit = Math.floor(temp);
        bin += bit;
        temp -= bit;
      }
      
      if (bin.length > 6) {
        const lastBit = bin[5];
        const roundBit = bin[6];
        const remaining = bin.slice(7);
        if (roundBit === '1' && (remaining.includes('1') || lastBit === '1')) {
          let rounded = (parseInt(bin.slice(0, 6), 2) + 1).toString(2).padStart(6, '0');
          bin = rounded;
          steps.push(`尾数舍入（向偶数舍入）：${sign}0.${bin.slice(0, 6)}（原值：${sign}0.${bin}）`);
        } else {
          steps.push(`尾数截断：${sign}0.${bin.slice(0, 6)}（原值：${sign}0.${bin}）`);
        }
        bin = bin.slice(0, 6);
      }
      
      steps.push(`尾数相乘（十进制值）：${mxVal} * ${myVal} = ${mxVal * myVal}`);
      return `${sign}0.${bin}`;
    },
    normalize(expBin, mantissaBin, steps) {
      let expVal = this.complementToDec(expBin);
      let mantissa = mantissaBin;
      
      if (mantissa === '0.000000' || mantissa === '-0.000000') {
        steps.push('尾数为0，直接返回0值');
        return { expBin: '00000', mantissaBin: '0.000000', steps };
      }
      
      let sign = mantissa.startsWith('-') ? '-' : '';
      mantissa = mantissa.replace('-', '');
      let shift = 0;
      
      if (mantissa.startsWith('1.')) {
        steps.push('尾数已规格化，无需调整');
        mantissa = `0.${mantissa.split('.')[1].slice(0, 6)}`;
      } else if (mantissa.startsWith('0.')) {
        let bits = mantissa.split('.')[1];
        while (bits[shift] === '0' && shift < bits.length) shift++;
        if (shift === bits.length) {
          steps.push('尾数全为0，返回0值');
          return { expBin: '00000', mantissaBin: '0.000000', steps };
        }
        mantissa = `1.${bits.slice(shift + 1)}000000`.slice(0, 8);
        expVal -= shift + 1;
        steps.push(`尾数左移 ${shift + 1} 位：${sign}${mantissa}`);
        steps.push(`阶码调整：${expVal} = ${this.decToComplement(expVal, 5)}`);
      } else {
        let bits = mantissa.split('.')[1];
        mantissa = `0.${bits.slice(0, 6)}`;
        steps.push(`尾数截断：${sign}${mantissa}`);
      }
      
      let newExpBin = this.decToComplement(expVal, 5);
      if (this.complementToDec(newExpBin) < -16 || this.complementToDec(newExpBin) > 15) {
        throw new Error('阶码溢出 (-16 到 15)');
      }
      
      return { expBin: newExpBin, mantissaBin: `${sign}${mantissa}`, steps };
    },
    calculateFloatOperation() {
      try {
        let steps = [];
        const x = this.parseFloatInput(this.floatX);
        const y = this.parseFloatInput(this.floatY);
        
        steps.push(`x: 阶码 ${x.exponent} (${x.expBin}), 尾数 ${x.mantissa} (${x.mantissaBin})`);
        steps.push(`y: 阶码 ${y.exponent} (${y.expBin}), 尾数 ${y.mantissa} (${y.mantissaBin})`);
        
        let expX = x.expBin;
        let expY = y.expBin;
        let mantissaX = x.mantissaBin;
        let mantissaY = y.mantissaBin;
        let resultExp, resultMantissa;
        
        if (this.floatOperation === 'mul') {
          let expXVal = this.complementToDec(expX);
          let expYVal = this.complementToDec(expY);
          let sumExp = expXVal + expYVal;
          resultExp = this.decToComplement(sumExp, 5);
          steps.push(`阶码相加：${expXVal} + ${expYVal} = ${sumExp} (${resultExp})`);
          
          resultMantissa = this.multiplyMantissa(mantissaX, mantissaY, steps);
          steps.push(`尾数相乘：${mantissaX} * ${mantissaY} = ${resultMantissa}`);
        } else {
          throw new Error('当前仅支持乘法运算');
        }
        
        const normalized = this.normalize(resultExp, resultMantissa, steps);
        steps.push(...normalized.steps);
        
        const finalExpVal = this.complementToDec(normalized.expBin);
        this.floatResult = `结果: 2^${finalExpVal} * ${parseFloat(normalized.mantissaBin)} ([E]补=${normalized.expBin}, [M]补=${normalized.mantissaBin})`;
        this.floatSteps = steps.join('\n');
      } catch (error) {
        this.floatResult = '错误: ' + error.message;
        this.floatSteps = '';
      }
    }
  }
};
</script>