// =============================================
// 生活实用工具实现
// =============================================

const LifeTools = {
  // 单位换算
  'unit-convert': {
    name: '单位换算',
    render: () => {
      setTimeout(() => {
        if (typeof LifeTools.updateUnitOptions === 'function') {
          LifeTools.updateUnitOptions();
          LifeTools.convertUnit();
        }
      }, 50);
      return `
      <div class="tool-section">
        <label class="tool-section-label">转换类型</label>
        <select id="unitType" class="tool-select" onchange="LifeTools.updateUnitOptions()">
          <option value="length">长度</option>
          <option value="weight">重量</option>
          <option value="temperature">温度</option>
          <option value="area">面积</option>
          <option value="volume">体积</option>
        </select>
      </div>
      <div class="tool-options" style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
        <div class="tool-option" style="display: flex; align-items: center; gap: 8px;">
          <label style="white-space: nowrap;">数值：</label>
          <input type="number" id="unitValue" class="tool-input" value="1" style="width:120px;" oninput="LifeTools.convertUnit()">
        </div>
        <select id="unitFrom" class="tool-select" style="min-width: 120px;" onchange="LifeTools.convertUnit()"></select>
        <span>→</span>
        <select id="unitTo" class="tool-select" style="min-width: 120px;" onchange="LifeTools.convertUnit()"></select>
        <button class="tool-page-btn primary" onclick="LifeTools.convertUnit()">
          ${ICONS.play} 转换
        </button>
      </div>
      <div class="tool-section" id="unitResult" style="display:none; margin-top: 1rem;">
        <label class="tool-section-label">转换结果</label>
        <div class="tool-result">
          <input type="text" id="unitOutput" class="tool-input" readonly style="font-size: 1.2rem; text-align: center; font-weight: bold;">
          <div class="tool-result-actions">
            <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('unitOutput').value)">
              ${ICONS.copy} 复制结果
            </button>
          </div>
        </div>
      </div>
    `;
    },
    units: {
      length: { m: 1, km: 0.001, cm: 100, mm: 1000, mile: 0.000621371, yard: 1.09361, foot: 3.28084, inch: 39.3701 },
      weight: { kg: 1, g: 1000, mg: 1000000, lb: 2.20462, oz: 35.274, ton: 0.001 },
      temperature: { c: 'c', f: 'f', k: 'k' },
      area: { m2: 1, km2: 0.000001, ha: 0.0001, acre: 0.000247105, ft2: 10.7639, yd2: 1.19599 },
      volume: { m3: 1, L: 1000, mL: 1000000, gal: 264.172, qt: 1056.69, pint: 2113.38 }
    },
    updateUnitOptions: function() {
      const typeEl = document.getElementById('unitType');
      if (!typeEl) return;
      const type = typeEl.value;
      const units = Object.keys(this.units[type]);
      const options = units.map(u => `<option value="${u}">${u}</option>`).join('');
      const fromEl = document.getElementById('unitFrom');
      const toEl = document.getElementById('unitTo');
      if (fromEl) fromEl.innerHTML = options;
      if (toEl) toEl.innerHTML = options;
      if (toEl && units.length > 1) toEl.selectedIndex = 1;
      this.convertUnit();
    },
    convertUnit: function() {
      const typeEl = document.getElementById('unitType');
      const valEl = document.getElementById('unitValue');
      const fromEl = document.getElementById('unitFrom');
      const toEl = document.getElementById('unitTo');
      const outEl = document.getElementById('unitOutput');
      const resEl = document.getElementById('unitResult');
      if (!typeEl || !valEl || !fromEl || !toEl || !outEl) return;

      const type = typeEl.value;
      const value = parseFloat(valEl.value) || 0;
      const from = fromEl.value;
      const to = toEl.value;
      
      if (type === 'temperature') {
        let result;
        if (from === 'c' && to === 'f') result = value * 9 / 5 + 32;
        else if (from === 'c' && to === 'k') result = value + 273.15;
        else if (from === 'f' && to === 'c') result = (value - 32) * 5 / 9;
        else if (from === 'f' && to === 'k') result = (value - 32) * 5 / 9 + 273.15;
        else if (from === 'k' && to === 'c') result = value - 273.15;
        else if (from === 'k' && to === 'f') result = (value - 273.15) * 9 / 5 + 32;
        else result = value;
        outEl.value = `${result.toFixed(4)} ${to}`;
      } else {
        const baseValue = value * (this.units[type][from] || 1);
        const result = baseValue / (this.units[type][to] || 1);
        outEl.value = `${result.toFixed(6)} ${to}`;
      }
      
      if (resEl) resEl.style.display = 'block';
    }
  },
  
  // 计算器
  'calculator': {
    name: '计算器',
    render: () => `
      <div class="tool-section">
        <input type="text" id="calcDisplay" class="tool-input" placeholder="0" readonly style="font-size: 1.8rem; text-align: right; padding: 1.2rem; font-family: monospace; font-weight: bold; background: var(--bg-secondary);">
      </div>
      <div class="tool-options" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.6rem; max-width: 400px; margin: 0 auto;">
        <button class="tool-page-btn" onclick="LifeTools.calcInput('(')">(</button>
        <button class="tool-page-btn" onclick="LifeTools.calcInput(')')">)</button>
        <button class="tool-page-btn" onclick="LifeTools.calcInput('%')">%</button>
        <button class="tool-page-btn" onclick="LifeTools.calcClear()" style="color: #ef4444; font-weight: bold;">C</button>
        <button class="tool-page-btn" onclick="LifeTools.calcInput('7')">7</button>
        <button class="tool-page-btn" onclick="LifeTools.calcInput('8')">8</button>
        <button class="tool-page-btn" onclick="LifeTools.calcInput('9')">9</button>
        <button class="tool-page-btn" onclick="LifeTools.calcInput('/')">÷</button>
        <button class="tool-page-btn" onclick="LifeTools.calcInput('4')">4</button>
        <button class="tool-page-btn" onclick="LifeTools.calcInput('5')">5</button>
        <button class="tool-page-btn" onclick="LifeTools.calcInput('6')">6</button>
        <button class="tool-page-btn" onclick="LifeTools.calcInput('*')">×</button>
        <button class="tool-page-btn" onclick="LifeTools.calcInput('1')">1</button>
        <button class="tool-page-btn" onclick="LifeTools.calcInput('2')">2</button>
        <button class="tool-page-btn" onclick="LifeTools.calcInput('3')">3</button>
        <button class="tool-page-btn" onclick="LifeTools.calcInput('-')">-</button>
        <button class="tool-page-btn" onclick="LifeTools.calcInput('0')">0</button>
        <button class="tool-page-btn" onclick="LifeTools.calcInput('.')">.</button>
        <button class="tool-page-btn" onclick="LifeTools.calcBackspace()">⌫</button>
        <button class="tool-page-btn primary" onclick="LifeTools.calcResult()" style="background: var(--accent, #3b82f6); color: #fff; font-weight: bold;">=</button>
      </div>
    `,
    calcInput: (val) => {
      const display = document.getElementById('calcDisplay');
      if (display) display.value += val;
    },
    calcClear: () => {
      const display = document.getElementById('calcDisplay');
      if (display) display.value = '';
    },
    calcBackspace: () => {
      const display = document.getElementById('calcDisplay');
      if (display) display.value = display.value.slice(0, -1);
    },
    calcResult: () => {
      const display = document.getElementById('calcDisplay');
      if (!display || !display.value) return;
      try {
        let expr = display.value.replace(/×/g, '*').replace(/÷/g, '/');
        // Handle percentage calculation
        expr = expr.replace(/(\d+(\.\d+)?)%/g, '($1/100)');
        const res = Function('"use strict";return (' + expr + ')')();
        if (typeof res === 'number') {
          if (!isFinite(res)) {
            display.value = '除数不能为0';
          } else {
            display.value = String(parseFloat(res.toFixed(10)));
          }
        } else {
          display.value = String(res);
        }
      } catch (e) {
        display.value = '计算错误';
      }
    }
  },
  
  // BMI计算
  'bmi': {
    name: 'BMI计算',
    render: () => {
      setTimeout(() => {
        if (typeof LifeTools.calculateBMI === 'function') {
          LifeTools.calculateBMI();
        }
      }, 50);
      return `
      <div class="tool-section">
        <label class="tool-section-label">身高 (cm)</label>
        <input type="number" id="bmiHeight" class="tool-input" placeholder="170" value="170" oninput="LifeTools.calculateBMI()">
      </div>
      <div class="tool-section">
        <label class="tool-section-label">体重 (kg)</label>
        <input type="number" id="bmiWeight" class="tool-input" placeholder="65" value="65" oninput="LifeTools.calculateBMI()">
      </div>
      <div class="tool-options">
        <button class="tool-page-btn primary" onclick="LifeTools.calculateBMI()">
          ${ICONS.play} 计算BMI
        </button>
      </div>
      <div class="tool-section" id="bmiResult" style="display:none; margin-top: 1rem;">
        <label class="tool-section-label">BMI 指数评估</label>
        <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.5rem; text-align: center;">
          <div id="bmiValue" style="font-size: 3.2rem; font-weight: bold; color: var(--accent);">--</div>
          <div id="bmiDesc" style="font-size: 1.2rem; font-weight: 600; margin-top: 0.5rem;"></div>
          <div id="bmiRangeNotice" style="font-size: 0.88rem; color: var(--text-tertiary); margin-top: 0.8rem;">
            健康标准参考：偏瘦 (&lt;18.5) | 正常 (18.5-23.9) | 超重 (24.0-27.9) | 肥胖 (&ge;28.0)
          </div>
        </div>
      </div>
    `;
    },
    calculateBMI: () => {
      const heightEl = document.getElementById('bmiHeight');
      const weightEl = document.getElementById('bmiWeight');
      const resEl = document.getElementById('bmiResult');
      const valEl = document.getElementById('bmiValue');
      const descEl = document.getElementById('bmiDesc');
      if (!heightEl || !weightEl || !valEl) return;

      const height = parseFloat(heightEl.value) / 100;
      const weight = parseFloat(weightEl.value);
      
      if (!height || !weight || height <= 0 || weight <= 0) {
        if (resEl) resEl.style.display = 'none';
        return;
      }
      
      const bmi = weight / (height * height);
      if (resEl) resEl.style.display = 'block';
      valEl.textContent = bmi.toFixed(1);
      
      let desc, color;
      if (bmi < 18.5) { desc = '体重过轻 (偏瘦)'; color = '#f59e0b'; }
      else if (bmi < 24) { desc = '体重正常 (健康)'; color = '#10b981'; }
      else if (bmi < 28) { desc = '体重过重 (超重)'; color = '#f59e0b'; }
      else { desc = '肥胖'; color = '#ef4444'; }
      
      if (descEl) descEl.innerHTML = `<span style="color: ${color}; font-weight: 600;">${desc}</span>`;
    }
  },
  
  // 密码生成
  'password-gen': {
    name: '密码生成',
    render: () => {
      setTimeout(() => {
        if (typeof LifeTools.generatePassword === 'function') {
          LifeTools.generatePassword();
        }
      }, 50);
      return `
      <div class="tool-section">
        <label class="tool-section-label">密码长度</label>
        <div class="range-group" style="display: flex; align-items: center; gap: 15px;">
          <input type="range" id="pwdLength" class="range-slider" min="6" max="32" value="16" style="flex: 1;" oninput="document.getElementById('pwdLengthValue').textContent = this.value; LifeTools.generatePassword();">
          <span class="range-value" id="pwdLengthValue" style="font-weight: bold; min-width: 30px;">16</span>
        </div>
      </div>
      <div class="tool-options" style="display: flex; gap: 15px; flex-wrap: wrap;">
        <div class="tool-option">
          <input type="checkbox" id="pwdUpper" checked onchange="LifeTools.generatePassword()">
          <label for="pwdUpper">大写字母 (A-Z)</label>
        </div>
        <div class="tool-option">
          <input type="checkbox" id="pwdLower" checked onchange="LifeTools.generatePassword()">
          <label for="pwdLower">小写字母 (a-z)</label>
        </div>
        <div class="tool-option">
          <input type="checkbox" id="pwdNumber" checked onchange="LifeTools.generatePassword()">
          <label for="pwdNumber">数字 (0-9)</label>
        </div>
        <div class="tool-option">
          <input type="checkbox" id="pwdSymbol" checked onchange="LifeTools.generatePassword()">
          <label for="pwdSymbol">特殊符号 (!@#$...)</label>
        </div>
      </div>
      <div class="tool-section" style="margin-top: 1rem;">
        <button class="tool-page-btn primary" onclick="LifeTools.generatePassword()">
          ${ICONS.play} 重新生成密码
        </button>
      </div>
      <div class="tool-section" id="pwdResult" style="display:none; margin-top: 1rem;">
        <label class="tool-section-label">生成的随机密码</label>
        <div class="tool-result">
          <input type="text" id="pwdOutput" class="tool-input" readonly style="font-family: monospace; font-size: 1.3rem; text-align: center; font-weight: bold; letter-spacing: 1px;">
          <div class="tool-result-actions">
            <button class="tool-result-btn" onclick="LifeTools.generatePassword()">
              ${ICONS.refresh} 刷新
            </button>
            <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('pwdOutput').value)">
              ${ICONS.copy} 复制密码
            </button>
          </div>
        </div>
      </div>
    `;
    },
    generatePassword: () => {
      const lenEl = document.getElementById('pwdLength');
      if (!lenEl) return;
      const length = parseInt(lenEl.value) || 16;
      let chars = '';
      if (document.getElementById('pwdUpper')?.checked) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (document.getElementById('pwdLower')?.checked) chars += 'abcdefghijklmnopqrstuvwxyz';
      if (document.getElementById('pwdNumber')?.checked) chars += '0123456789';
      if (document.getElementById('pwdSymbol')?.checked) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
      
      if (!chars) {
        showToast('请至少选择一种字符类型', 'error');
        return;
      }
      
      let password = '';
      for (let i = 0; i < length; i++) {
        password += chars[Math.floor(Math.random() * chars.length)];
      }
      
      const resEl = document.getElementById('pwdResult');
      const outEl = document.getElementById('pwdOutput');
      if (resEl) resEl.style.display = 'block';
      if (outEl) outEl.value = password;
    }
  },
  
  // 密码强度测试
  'password-test': {
    name: '密码强度',
    render: () => {
      setTimeout(() => {
        if (typeof LifeTools.testPassword === 'function') {
          LifeTools.testPassword();
        }
      }, 50);
      return `
      <div class="tool-section">
        <label class="tool-section-label">输入密码</label>
        <input type="text" id="testPwd" class="tool-input" placeholder="输入待测试密码..." value="P@ssw0rd2026!" oninput="LifeTools.testPassword()">
      </div>
      <div class="tool-section" style="margin-top: 1rem;">
        <label class="tool-section-label">强度评估分析</label>
        <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.2rem;">
          <div style="height: 10px; background: var(--bg-tertiary); border-radius: 5px; overflow: hidden; margin-bottom: 0.8rem;">
            <div id="pwdStrengthBar" style="height: 100%; width: 0; transition: all 0.3s; border-radius: 5px;"></div>
          </div>
          <div id="pwdStrengthText" style="text-align: center; font-weight: bold; font-size: 1.1rem;"></div>
          <div id="pwdTips" style="font-size: 0.9rem; color: var(--text-tertiary); margin-top: 0.6rem; text-align: center;"></div>
        </div>
      </div>
    `;
    },
    testPassword: () => {
      const pwdEl = document.getElementById('testPwd');
      const bar = document.getElementById('pwdStrengthBar');
      const text = document.getElementById('pwdStrengthText');
      const tips = document.getElementById('pwdTips');
      if (!pwdEl || !bar || !text || !tips) return;

      const pwd = pwdEl.value;
      
      if (!pwd) {
        bar.style.width = '0';
        bar.style.background = 'var(--bg-tertiary)';
        text.textContent = '请在上方输入密码';
        tips.innerHTML = '';
        return;
      }
      
      let score = 0;
      const issues = [];
      
      if (pwd.length >= 8) score += 20;
      else issues.push('密码长度增加至8位以上');
      
      if (/[a-z]/.test(pwd)) score += 15;
      else issues.push('包含小写字母');
      
      if (/[A-Z]/.test(pwd)) score += 15;
      else issues.push('包含大写字母');
      
      if (/[0-9]/.test(pwd)) score += 15;
      else issues.push('包含数字');
      
      if (/[^a-zA-Z0-9]/.test(pwd)) score += 20;
      else issues.push('包含特殊符号');
      
      if (pwd.length >= 12) score += 15;
      
      bar.style.width = score + '%';
      
      let color, label;
      if (score < 40) { color = '#ef4444'; label = '弱'; }
      else if (score < 70) { color = '#f59e0b'; label = '中等'; }
      else if (score < 90) { color = '#10b981'; label = '强'; }
      else { color = '#059669'; label = '极强'; }
      
      bar.style.background = color;
      text.innerHTML = `<span style="color: ${color};">${label}</span> (${score}分)`;
      tips.innerHTML = issues.length ? `建议：${issues.join('、')}` : '✨ 密码结构优秀，包含丰富字符类型！';
    }
  },
  
  // 随机抽签
  'random-pick': {
    name: '随机抽签',
    render: () => `
      <div class="tool-section">
        <label class="tool-section-label">输入候选项（每行一个）</label>
        <textarea id="pickOptions" class="tool-textarea" rows="6" placeholder="苹果&#10;香蕉&#10;橘子&#10;西瓜">火锅&#10;烧烤&#10;日料&#10;麻辣烫&#10;麦当劳&#10;小龙虾</textarea>
      </div>
      <div class="tool-options">
        <button class="tool-page-btn primary" onclick="LifeTools.doRandomPick()">
          ${ICONS.play} 随机抽取
        </button>
      </div>
      <div class="tool-section" id="pickResult" style="display:none; margin-top: 1rem;">
        <label class="tool-section-label">抽签结果</label>
        <div id="pickValue" style="font-size: 2.2rem; font-weight: bold; text-align: center; padding: 2rem; background: var(--bg-secondary); border: 2px dashed var(--accent, #3b82f6); border-radius: 12px; color: var(--accent);"></div>
      </div>
    `,
    doRandomPick: () => {
      const optEl = document.getElementById('pickOptions');
      if (!optEl) return;
      const options = optEl.value.split('\n').map(o => o.trim()).filter(Boolean);
      if (options.length < 2) {
        showToast('请至少输入 2 个不同的选项', 'error');
        return;
      }
      
      const resEl = document.getElementById('pickResult');
      const valEl = document.getElementById('pickValue');
      if (resEl) resEl.style.display = 'block';
      
      let count = 0;
      const interval = setInterval(() => {
        valEl.textContent = options[Math.floor(Math.random() * options.length)];
        count++;
        if (count > 15) {
          clearInterval(interval);
          const finalChoice = options[Math.floor(Math.random() * options.length)];
          valEl.textContent = '🎉 ' + finalChoice;
        }
      }, 50);
    }
  },
  
  // 日期计算
  'date-calc': {
    name: '日期计算',
    render: () => {
      setTimeout(() => {
        const today = new Date();
        const future = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
        const startEl = document.getElementById('startDate');
        const endEl = document.getElementById('endDate');
        if (startEl && !startEl.value) startEl.value = today.toISOString().slice(0, 10);
        if (endEl && !endEl.value) endEl.value = future.toISOString().slice(0, 10);
        if (typeof LifeTools.run === 'function') LifeTools.run('date-calc');
      }, 50);
      return `
      <div class="tool-section">
        <label class="tool-section-label">开始日期</label>
        <input type="date" id="startDate" class="tool-input" onchange="LifeTools.run('date-calc')">
      </div>
      <div class="tool-section">
        <label class="tool-section-label">结束日期</label>
        <input type="date" id="endDate" class="tool-input" onchange="LifeTools.run('date-calc')">
      </div>
      <div class="tool-options">
        <button class="tool-page-btn primary" onclick="LifeTools.run('date-calc')">
          ${ICONS.play} 计算相差天数
        </button>
      </div>
      <div class="tool-section" id="resultSection" style="display:none; margin-top: 1rem;">
        <label class="tool-section-label">计算结果</label>
        <div class="stats-grid" id="statsResult" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 12px; text-align: center;"></div>
      </div>
    `;
    },
    run: (toolId) => {
      if (toolId === 'date-calc') {
        const start = document.getElementById('startDate')?.value;
        const end = document.getElementById('endDate')?.value;
        
        if (!start || !end) {
          showToast('请选择开始和结束日期', 'error');
          return;
        }
        
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const diffWeeks = Math.floor(diffDays / 7);
        const diffMonths = Math.floor(diffDays / 30.4375);
        const diffYears = (diffDays / 365.25).toFixed(1);
        
        const resSec = document.getElementById('resultSection');
        const statsEl = document.getElementById('statsResult');
        if (resSec) resSec.style.display = 'block';
        if (statsEl) {
          statsEl.innerHTML = `
            <div class="stat-item" style="background: var(--bg-secondary); padding: 1rem; border-radius: 8px;"><div class="stat-value" style="font-size: 1.8rem; font-weight: bold; color: var(--accent);">${diffDays}</div><div class="stat-label">相差天数</div></div>
            <div class="stat-item" style="background: var(--bg-secondary); padding: 1rem; border-radius: 8px;"><div class="stat-value" style="font-size: 1.8rem; font-weight: bold; color: var(--accent);">${diffWeeks}</div><div class="stat-label">完整周数</div></div>
            <div class="stat-item" style="background: var(--bg-secondary); padding: 1rem; border-radius: 8px;"><div class="stat-value" style="font-size: 1.8rem; font-weight: bold; color: var(--accent);">${diffMonths}</div><div class="stat-label">折合月数</div></div>
            <div class="stat-item" style="background: var(--bg-secondary); padding: 1rem; border-radius: 8px;"><div class="stat-value" style="font-size: 1.8rem; font-weight: bold; color: var(--accent);">${diffYears}</div><div class="stat-label">折合年数</div></div>
          `;
        }
      } else if (toolId === 'anniversary') {
        const name = document.getElementById('anniversaryName')?.value || '纪念日';
        const date = document.getElementById('anniversaryDate')?.value;
        
        if (!date) {
          showToast('请选择纪念日日期', 'error');
          return;
        }
        
        const anniversary = new Date(date);
        const today = new Date();
        const diffTime = today - anniversary;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        const nextAnniversary = new Date(today.getFullYear(), anniversary.getMonth(), anniversary.getDate());
        if (nextAnniversary < today) {
          nextAnniversary.setFullYear(today.getFullYear() + 1);
        }
        const daysToNext = Math.ceil((nextAnniversary - today) / (1000 * 60 * 60 * 24));
        
        const resSec = document.getElementById('resultSection');
        const statsEl = document.getElementById('statsResult');
        if (resSec) resSec.style.display = 'block';
        if (statsEl) {
          statsEl.innerHTML = `
            <div class="stat-item" style="background: var(--bg-secondary); padding: 1rem; border-radius: 8px;"><div class="stat-value" style="font-size: 1.8rem; font-weight: bold; color: var(--accent);">${diffDays}</div><div class="stat-label">已跟TA走过 (天)</div></div>
            <div class="stat-item" style="background: var(--bg-secondary); padding: 1rem; border-radius: 8px;"><div class="stat-value" style="font-size: 1.8rem; font-weight: bold; color: var(--accent);">${Math.floor(diffDays / 365)}</div><div class="stat-label">相伴周年数</div></div>
            <div class="stat-item" style="background: var(--bg-secondary); padding: 1rem; border-radius: 8px;"><div class="stat-value" style="font-size: 1.8rem; font-weight: bold; color: var(--accent);">${daysToNext}</div><div class="stat-label">距离下个周年 (天)</div></div>
          `;
        }
      }
    }
  },
  
  // 纪念日计算
  'anniversary': {
    name: '纪念日计算',
    render: () => {
      setTimeout(() => {
        const nameEl = document.getElementById('anniversaryName');
        const dateEl = document.getElementById('anniversaryDate');
        if (nameEl && !nameEl.value) nameEl.value = '恋爱纪念日';
        if (dateEl && !dateEl.value) {
          const oneYearAgo = new Date();
          oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
          dateEl.value = oneYearAgo.toISOString().slice(0, 10);
        }
        if (typeof LifeTools.run === 'function') LifeTools.run('anniversary');
      }, 50);
      return `
      <div class="tool-section">
        <label class="tool-section-label">纪念日名称</label>
        <input type="text" id="anniversaryName" class="tool-input" placeholder="例如：恋爱纪念日 / 结婚纪念日" value="恋爱纪念日" oninput="LifeTools.run('anniversary')">
      </div>
      <div class="tool-section">
        <label class="tool-section-label">纪念日日期</label>
        <input type="date" id="anniversaryDate" class="tool-input" onchange="LifeTools.run('anniversary')">
      </div>
      <div class="tool-options">
        <button class="tool-page-btn primary" onclick="LifeTools.run('anniversary')">
          ${ICONS.play} 计算纪念日
        </button>
      </div>
      <div class="tool-section" id="resultSection" style="display:none; margin-top: 1rem;">
        <label class="tool-section-label">纪念日概览</label>
        <div class="stats-grid" id="statsResult" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 12px; text-align: center;"></div>
      </div>
    `;
    }
  },

  // 汇率换算
  'currency': {
    name: '汇率换算',
    render: () => {
      setTimeout(() => {
        if (LifeTools['currency'] && typeof LifeTools['currency'].calcCurrency === 'function') {
          LifeTools['currency'].calcCurrency();
        }
      }, 50);
      return `
      <div class="tool-section">
        <label class="tool-section-label">金额与币种选择</label>
        <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
          <input type="number" id="currAmount" class="tool-input" value="100" min="0" style="width: 140px;" oninput="LifeTools['currency'].calcCurrency()">
          <select id="currFrom" class="tool-select" style="width: 160px;" onchange="LifeTools['currency'].calcCurrency()">
            <option value="CNY" selected>CNY - 人民币</option>
            <option value="USD">USD - 美元</option>
            <option value="EUR">EUR - 欧元</option>
            <option value="JPY">JPY - 日元</option>
            <option value="GBP">GBP - 英镑</option>
            <option value="HKD">HKD - 港币</option>
            <option value="AUD">AUD - 澳元</option>
            <option value="CAD">CAD - 加元</option>
            <option value="SGD">SGD - 新加坡元</option>
            <option value="KRW">KRW - 韩元</option>
          </select>
          <button class="tool-page-btn" onclick="LifeTools['currency'].swapCurrency()">⇄ 切换</button>
          <select id="currTo" class="tool-select" style="width: 160px;" onchange="LifeTools['currency'].calcCurrency()">
            <option value="USD" selected>USD - 美元</option>
            <option value="CNY">CNY - 人民币</option>
            <option value="EUR">EUR - 欧元</option>
            <option value="JPY">JPY - 日元</option>
            <option value="GBP">GBP - 英镑</option>
            <option value="HKD">HKD - 港币</option>
            <option value="AUD">AUD - 澳元</option>
            <option value="CAD">CAD - 加元</option>
            <option value="SGD">SGD - 新加坡元</option>
            <option value="KRW">KRW - 韩元</option>
          </select>
        </div>
      </div>
      <div class="tool-section" style="margin-top: 1rem;">
        <label class="tool-section-label">换算结果</label>
        <div class="tool-result" style="padding: 1.2rem; text-align: center; background: var(--bg-secondary); border-radius: 8px;">
          <div id="currResultValue" style="font-size: 2rem; font-weight: bold; color: var(--accent);">14.08 USD</div>
          <div id="currRateDetail" style="font-size: 0.88rem; color: var(--text-tertiary); margin-top: 4px;">1 CNY ≈ 0.1408 USD</div>
        </div>
      </div>
      <div class="tool-section">
        <label class="tool-section-label">常用主要汇率对照参考 (基准金额)</label>
        <div id="currTableGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; margin-top: 8px;"></div>
      </div>
    `;
    },
    ratesUSD: { CNY: 7.10, USD: 1.0, EUR: 0.92, JPY: 155.2, GBP: 0.78, HKD: 7.82, AUD: 1.51, CAD: 1.36, SGD: 1.35, KRW: 1370.0 },
    swapCurrency: () => {
      const fromEl = document.getElementById('currFrom');
      const toEl = document.getElementById('currTo');
      if (!fromEl || !toEl) return;
      const from = fromEl.value;
      const to = toEl.value;
      fromEl.value = to;
      toEl.value = from;
      LifeTools['currency'].calcCurrency();
    },
    calcCurrency: () => {
      const amountEl = document.getElementById('currAmount');
      const fromEl = document.getElementById('currFrom');
      const toEl = document.getElementById('currTo');
      if (!amountEl || !fromEl || !toEl) return;

      const amount = parseFloat(amountEl.value) || 0;
      const from = fromEl.value;
      const to = toEl.value;
      const rates = LifeTools['currency'].ratesUSD;

      const usd = amount / (rates[from] || 1);
      const result = usd * (rates[to] || 1);
      const singleRate = (1 / (rates[from] || 1)) * (rates[to] || 1);

      const resEl = document.getElementById('currResultValue');
      const detEl = document.getElementById('currRateDetail');
      if (resEl) resEl.textContent = `${result.toFixed(2)} ${to}`;
      if (detEl) detEl.textContent = `1 ${from} ≈ ${singleRate.toFixed(4)} ${to}`;

      const grid = document.getElementById('currTableGrid');
      if (grid) {
        grid.innerHTML = Object.keys(rates).filter(c => c !== from).map(c => {
          const val = (amount / rates[from]) * rates[c];
          return `
            <div style="background: var(--card-bg); padding: 8px 12px; border: 1px solid var(--border-color); border-radius: 6px; font-size: 0.85rem;">
              <span style="color: var(--text-tertiary);">${c}</span>
              <strong style="display: block; font-size: 1rem; margin-top: 2px;">${val.toFixed(2)}</strong>
            </div>
          `;
        }).join('');
      }
    }
  },

  // 时区转换
  'timezone': {
    name: '时区转换',
    render: () => {
      setTimeout(() => {
        if (LifeTools['timezone'] && typeof LifeTools['timezone'].resetTzNow === 'function') {
          LifeTools['timezone'].resetTzNow();
        }
      }, 50);
      return `
      <div class="tool-section">
        <label class="tool-section-label">基准时间设定</label>
        <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
          <input type="datetime-local" id="tzInputDate" class="tool-input" style="width: 230px;" onchange="LifeTools['timezone'].updateWorldTimezone()">
          <button class="tool-page-btn" onclick="LifeTools['timezone'].resetTzNow()">使用当前系统时间</button>
        </div>
      </div>
      <div class="tool-section" style="margin-top: 1rem;">
        <label class="tool-section-label">全球主要城市时间列表</label>
        <div id="tzGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; margin-top: 8px;"></div>
      </div>
    `;
    },
    resetTzNow: () => {
      const input = document.getElementById('tzInputDate');
      if (!input) return;
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      input.value = now.toISOString().slice(0, 16);
      LifeTools['timezone'].updateWorldTimezone();
    },
    updateWorldTimezone: () => {
      const input = document.getElementById('tzInputDate');
      const val = input ? input.value : '';
      const baseDate = val ? new Date(val) : new Date();

      const cities = [
        { name: '北京 / 上海', zone: 'Asia/Shanghai', flag: '🇨🇳' },
        { name: '东京', zone: 'Asia/Tokyo', flag: '🇯🇵' },
        { name: '伦敦', zone: 'Europe/London', flag: '🇬🇧' },
        { name: '纽约', zone: 'America/New_York', flag: '🇺🇸' },
        { name: '旧金山 / 洛杉矶', zone: 'America/Los_Angeles', flag: '🇺🇸' },
        { name: '巴黎 / 柏林', zone: 'Europe/Paris', flag: '🇪🇺' },
        { name: '悉尼', zone: 'Australia/Sydney', flag: '🇦🇺' },
        { name: '新加坡', zone: 'Asia/Singapore', flag: '🇸🇬' },
        { name: '迪拜', zone: 'Asia/Dubai', flag: '🇦🇪' }
      ];

      const grid = document.getElementById('tzGrid');
      if (!grid) return;
      grid.innerHTML = cities.map(c => {
        let timeStr = '', dateStr = '';
        try {
          timeStr = baseDate.toLocaleTimeString('zh-CN', { timeZone: c.zone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
          dateStr = baseDate.toLocaleDateString('zh-CN', { timeZone: c.zone, month: 'short', day: 'numeric', weekday: 'short' });
        } catch(e) {
          timeStr = '--:--';
        }

        return `
          <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 12px 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span style="font-weight: 600; font-size: 0.92rem;">${c.flag} ${c.name}</span>
              <span style="font-size: 0.75rem; color: var(--text-tertiary);">${dateStr}</span>
            </div>
            <div style="font-size: 1.4rem; font-family: monospace; font-weight: bold; color: var(--accent);">${timeStr}</div>
          </div>
        `;
      }).join('');
    }
  },

  // 倒计时
  'countdown': {
    name: '倒计时',
    render: () => {
      setTimeout(() => {
        const cdTarget = document.getElementById('cdTarget');
        if (cdTarget && !cdTarget.value) {
          const nextYear = new Date().getFullYear() + 1;
          cdTarget.value = `${nextYear}-01-01T00:00`;
        }
        if (LifeTools['countdown'] && typeof LifeTools['countdown'].startCountdown === 'function') {
          LifeTools['countdown'].startCountdown();
        }
      }, 50);
      return `
      <div class="tool-section">
        <label class="tool-section-label">快捷预设目标</label>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button class="tool-page-btn" onclick="LifeTools['countdown'].setCountdownPreset('2027-01-01T00:00', '2027 元旦新年')">🎉 2027 元旦</button>
          <button class="tool-page-btn" onclick="LifeTools['countdown'].setCountdownPreset('2026-10-01T00:00', '🇨🇳 国庆节')">🇨🇳 国庆节</button>
          <button class="tool-page-btn" onclick="LifeTools['countdown'].setCountdownPreset('2026-10-24T00:00', '💻 程序员节')">💻 程序员节</button>
          <button class="tool-page-btn" onclick="LifeTools['countdown'].setCountdownPreset('2026-12-31T23:59', '🎆 2026 年末倒计时')">🎆 2026 年末</button>
        </div>
      </div>
      <div class="tool-section">
        <label class="tool-section-label">自定义倒计时目标</label>
        <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
          <input type="text" id="cdName" class="tool-input" placeholder="倒计时事件名称" value="2027 新年倒计时" style="width: 180px;">
          <input type="datetime-local" id="cdTarget" class="tool-input" style="width: 220px;">
          <button class="tool-page-btn primary" onclick="LifeTools['countdown'].startCountdown()">
            ${ICONS.play} 开启倒计时
          </button>
        </div>
      </div>
      <div class="tool-section" id="cdDisplaySection" style="margin-top: 1rem;">
        <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; padding: 2rem; text-align: center;">
          <h2 id="cdTitleDisplay" style="font-size: 1.4rem; margin-bottom: 1rem;">2027 新年倒计时</h2>
          <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;" id="cdBoxes">
            <div style="background: var(--card-bg); border: 1px solid var(--border-color); padding: 12px 20px; border-radius: 8px; min-width: 80px;">
              <span id="cdDays" style="font-size: 2.2rem; font-weight: bold; color: var(--accent); display: block;">00</span>
              <small style="color: var(--text-tertiary);">天</small>
            </div>
            <div style="background: var(--card-bg); border: 1px solid var(--border-color); padding: 12px 20px; border-radius: 8px; min-width: 80px;">
              <span id="cdHours" style="font-size: 2.2rem; font-weight: bold; color: var(--accent); display: block;">00</span>
              <small style="color: var(--text-tertiary);">时</small>
            </div>
            <div style="background: var(--card-bg); border: 1px solid var(--border-color); padding: 12px 20px; border-radius: 8px; min-width: 80px;">
              <span id="cdMins" style="font-size: 2.2rem; font-weight: bold; color: var(--accent); display: block;">00</span>
              <small style="color: var(--text-tertiary);">分</small>
            </div>
            <div style="background: var(--card-bg); border: 1px solid var(--border-color); padding: 12px 20px; border-radius: 8px; min-width: 80px;">
              <span id="cdSecs" style="font-size: 2.2rem; font-weight: bold; color: var(--accent); display: block;">00</span>
              <small style="color: var(--text-tertiary);">秒</small>
            </div>
          </div>
        </div>
      </div>
    `;
    },
    setCountdownPreset: (target, name) => {
      const tEl = document.getElementById('cdTarget');
      const nEl = document.getElementById('cdName');
      if (tEl) tEl.value = target;
      if (nEl) nEl.value = name;
      LifeTools['countdown'].startCountdown();
    },
    startCountdown: () => {
      const nameEl = document.getElementById('cdName');
      const targetEl = document.getElementById('cdTarget');
      const name = nameEl ? (nameEl.value || '目标事件') : '目标事件';
      const targetStr = targetEl ? targetEl.value : '';
      if (!targetStr) {
        showToast('请选择目标日期和时间', 'error');
        return;
      }
      const targetTime = new Date(targetStr).getTime();
      const titleEl = document.getElementById('cdTitleDisplay');
      if (titleEl) titleEl.textContent = name;

      if (LifeTools._cdInterval) clearInterval(LifeTools._cdInterval);

      const update = () => {
        const dEl = document.getElementById('cdDays');
        if (!dEl) return;
        const now = Date.now();
        const diff = targetTime - now;

        if (diff <= 0) {
          dEl.textContent = '00';
          document.getElementById('cdHours').textContent = '00';
          document.getElementById('cdMins').textContent = '00';
          document.getElementById('cdSecs').textContent = '00';
          if (LifeTools._cdInterval) clearInterval(LifeTools._cdInterval);
          return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);

        dEl.textContent = String(days).padStart(2, '0');
        document.getElementById('cdHours').textContent = String(hours).padStart(2, '0');
        document.getElementById('cdMins').textContent = String(mins).padStart(2, '0');
        document.getElementById('cdSecs').textContent = String(secs).padStart(2, '0');
      };

      update();
      LifeTools._cdInterval = setInterval(update, 1000);
    }
  },

  // 调色板
  'color-palette': {
    name: '调色板',
    render: () => {
      setTimeout(() => {
        if (LifeTools['color-palette'] && typeof LifeTools['color-palette'].generatePalette === 'function') {
          LifeTools['color-palette'].generatePalette();
        }
      }, 50);
      return `
      <div class="tool-section">
        <label class="tool-section-label">配色方案生成</label>
        <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
          <input type="color" id="paletteBaseColor" value="#3b82f6" style="width: 44px; height: 38px; padding: 2px; border-radius: 6px; cursor: pointer;" onchange="LifeTools['color-palette'].generatePalette()">
          <select id="paletteStyle" class="tool-select" style="width: 200px;" onchange="LifeTools['color-palette'].generatePalette()">
            <option value="monochromatic">单色渐变 (Monochromatic)</option>
            <option value="analogous">邻近色 (Analogous)</option>
            <option value="complementary">互补色 (Complementary)</option>
            <option value="triadic">三角色 (Triadic)</option>
            <option value="pastel">柔和马卡龙 (Pastel)</option>
          </select>
          <button class="tool-page-btn primary" onclick="LifeTools['color-palette'].generatePalette()">
            ${ICONS.play} 生成配色
          </button>
          <button class="tool-page-btn" onclick="LifeTools['color-palette'].randomPalette()">
            🎲 随机灵感
          </button>
        </div>
      </div>
      <div class="tool-section">
        <label class="tool-section-label">生成的调色板</label>
        <div id="paletteGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 12px; margin-top: 8px;"></div>
      </div>
    `;
    },
    randomPalette: () => {
      const randColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
      const baseEl = document.getElementById('paletteBaseColor');
      if (baseEl) baseEl.value = randColor;
      LifeTools['color-palette'].generatePalette();
    },
    generatePalette: () => {
      const baseEl = document.getElementById('paletteBaseColor');
      const styleEl = document.getElementById('paletteStyle');
      const gridEl = document.getElementById('paletteGrid');
      if (!baseEl || !gridEl) return;
      const hex = baseEl.value || '#3b82f6';
      
      const num = parseInt(hex.replace('#', ''), 16);
      const colors = [hex];
      for (let i = 1; i < 5; i++) {
        let shift = (num + i * 0x182736) % 0xffffff;
        colors.push('#' + shift.toString(16).padStart(6, '0'));
      }

      gridEl.innerHTML = colors.map(c => `
        <div style="background: ${c}; height: 90px; border-radius: 8px; display: flex; align-items: flex-end; padding: 8px; color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,0.6); font-weight: bold; font-family: monospace; cursor: pointer;" onclick="copyToClipboard('${c}')">
          ${c}
        </div>
      `).join('');
    }
  },

  // 大小写与数字转换器 (包含人民币大写与论文学术大小写)
  'case-converter': {
    name: '大小写与数字转换器',
    activeTab: 'number',
    render: () => {
      setTimeout(() => {
        if (LifeTools['case-converter']) {
          LifeTools['case-converter'].init();
        }
      }, 50);
      return `
        <div class="tool-section">
          <!-- 模式切换标签页 -->
          <div style="display: flex; gap: 8px; margin-bottom: 1.25rem; border-bottom: 2px solid var(--border-color); padding-bottom: 8px; flex-wrap: wrap;">
            <button id="caseTabNum" class="tool-page-btn primary" onclick="LifeTools['case-converter'].switchTab('number')" style="font-weight: 600;">
              💰 人民币 & 数字大写转换
            </button>
            <button id="caseTabText" class="tool-page-btn" onclick="LifeTools['case-converter'].switchTab('text')" style="font-weight: 600;">
              🎓 论文学术 & 英文大小写格式
            </button>
          </div>

          <!-- 面板 1: 数字 & 人民币大写转换 -->
          <div id="caseNumSection">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
              <label class="tool-section-label" style="margin-bottom: 0;">输入阿拉伯数字金额 / 数值</label>
              <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                <button class="tool-result-btn" onclick="LifeTools['case-converter'].setNumPreset('1234.56')">示例: 1234.56</button>
                <button class="tool-result-btn" onclick="LifeTools['case-converter'].setNumPreset('1000500.08')">示例: 百万金额</button>
                <button class="tool-result-btn" onclick="LifeTools['case-converter'].setNumPreset('9876543210.88')">示例: 百亿大额</button>
                <button class="tool-result-btn" onclick="LifeTools['case-converter'].clearNum()">🗑️ 清空</button>
              </div>
            </div>
            <input type="text" id="caseNumInput" class="tool-input" style="font-size: 1.2rem; font-weight: 700; height: 48px;" placeholder="请输入金额，如 1234.56 或 1,234,567.89" value="1234.56" oninput="LifeTools['case-converter'].convertNum()">

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-top: 1.25rem;">
              <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                  <span style="font-size: 0.85rem; font-weight: 700; color: var(--accent, #3b82f6);">💳 人民币大写金额 (标准财务格式)</span>
                  <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('resRmbCap').textContent)">复制</button>
                </div>
                <div id="resRmbCap" style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); word-break: break-all;">-</div>
              </div>

              <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                  <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-secondary);">🔢 中文大写数字 (财务大写)</span>
                  <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('resCnUpper').textContent)">复制</button>
                </div>
                <div id="resCnUpper" style="font-size: 1.1rem; font-weight: 600; color: var(--text-primary); word-break: break-all;">-</div>
              </div>

              <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                  <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-secondary);">🇨🇳 中文小写数字</span>
                  <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('resCnLower').textContent)">复制</button>
                </div>
                <div id="resCnLower" style="font-size: 1.1rem; font-weight: 600; color: var(--text-primary); word-break: break-all;">-</div>
              </div>

              <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                  <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-secondary);">💵 千分位格式化金额</span>
                  <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('resFormattedNum').textContent)">复制</button>
                </div>
                <div id="resFormattedNum" style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary); word-break: break-all;">-</div>
              </div>

              <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem; grid-column: 1 / -1;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                  <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-secondary);">🔠 英文金额表达 (English Amount Words)</span>
                  <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('resEngWords').textContent)">复制</button>
                </div>
                <div id="resEngWords" style="font-size: 1rem; font-weight: 600; color: var(--text-primary); word-break: break-all;">-</div>
              </div>
            </div>
          </div>

          <!-- 面板 2: 论文学术 & 英文大小写 -->
          <div id="caseTextSection" style="display: none;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
              <label class="tool-section-label" style="margin-bottom: 0;">输入英文文本 / 论文标题 / 变量名</label>
              <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                <button class="tool-result-btn" onclick="LifeTools['case-converter'].setTextPreset('title')">论文标题示例</button>
                <button class="tool-result-btn" onclick="LifeTools['case-converter'].setTextPreset('abstract')">论文摘要示例</button>
                <button class="tool-result-btn" onclick="LifeTools['case-converter'].setTextPreset('code')">变量命名示例</button>
                <button class="tool-result-btn" onclick="LifeTools['case-converter'].clearText()">🗑️ 清空</button>
              </div>
            </div>
            <textarea id="caseTextInput" class="tool-textarea" style="height: 90px; font-size: 0.95rem;" placeholder="请输入英文短语、论文标题或句子..." oninput="LifeTools['case-converter'].convertText()"></textarea>

            <div style="margin-top: 1rem; display: flex; flex-direction: column; gap: 0.75rem;">
              <!-- Title Case (APA/MLA 论文规范) -->
              <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.85rem 1rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.3rem;">
                  <div>
                    <span style="font-size: 0.85rem; font-weight: 700; color: var(--accent, #3b82f6);">🎓 Title Case (论文标题大写 - APA / MLA 规范)</span>
                    <span style="font-size: 0.75rem; color: var(--text-tertiary); margin-left: 8px;">自动保持介词/连词/冠词小写</span>
                  </div>
                  <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('resTitleCase').textContent)">复制</button>
                </div>
                <div id="resTitleCase" style="font-size: 1rem; font-weight: 600; color: var(--text-primary); word-break: break-all;">-</div>
              </div>

              <!-- Sentence Case -->
              <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.85rem 1rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.3rem;">
                  <div>
                    <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-secondary);">📄 Sentence case (论文摘要/正文句首大写)</span>
                  </div>
                  <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('resSentenceCase').textContent)">复制</button>
                </div>
                <div id="resSentenceCase" style="font-size: 1rem; font-weight: 600; color: var(--text-primary); word-break: break-all;">-</div>
              </div>

              <!-- Grid for other formats -->
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 0.75rem;">
                <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.75rem 1rem;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                    <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-secondary);">🔤 UPPERCASE (全大写)</span>
                    <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('resUpperCase').textContent)">复制</button>
                  </div>
                  <div id="resUpperCase" style="font-size: 0.95rem; font-weight: 600; color: var(--text-primary); word-break: break-all;">-</div>
                </div>

                <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.75rem 1rem;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                    <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-secondary);">🔡 lowercase (全小写)</span>
                    <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('resLowerCase').textContent)">复制</button>
                  </div>
                  <div id="resLowerCase" style="font-size: 0.95rem; font-weight: 600; color: var(--text-primary); word-break: break-all;">-</div>
                </div>

                <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.75rem 1rem;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                    <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-secondary);">🔠 Capitalize Each Word (首字母大写)</span>
                    <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('resCapWords').textContent)">复制</button>
                  </div>
                  <div id="resCapWords" style="font-size: 0.95rem; font-weight: 600; color: var(--text-primary); word-break: break-all;">-</div>
                </div>

                <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.75rem 1rem;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                    <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-secondary);">🐫 camelCase (小驼峰)</span>
                    <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('resCamelCase').textContent)">复制</button>
                  </div>
                  <div id="resCamelCase" style="font-size: 0.95rem; font-weight: 600; color: var(--text-primary); word-break: break-all;">-</div>
                </div>

                <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.75rem 1rem;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                    <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-secondary);">🐪 PascalCase (大驼峰)</span>
                    <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('resPascalCase').textContent)">复制</button>
                  </div>
                  <div id="resPascalCase" style="font-size: 0.95rem; font-weight: 600; color: var(--text-primary); word-break: break-all;">-</div>
                </div>

                <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.75rem 1rem;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                    <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-secondary);">🐍 snake_case (下划线)</span>
                    <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('resSnakeCase').textContent)">复制</button>
                  </div>
                  <div id="resSnakeCase" style="font-size: 0.95rem; font-weight: 600; color: var(--text-primary); word-break: break-all;">-</div>
                </div>

                <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.75rem 1rem;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                    <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-secondary);">🍢 kebab-case (短横线)</span>
                    <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('resKebabCase').textContent)">复制</button>
                  </div>
                  <div id="resKebabCase" style="font-size: 0.95rem; font-weight: 600; color: var(--text-primary); word-break: break-all;">-</div>
                </div>

                <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.75rem 1rem;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                    <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-secondary);">⚡ CONSTANT_CASE (常量大写)</span>
                    <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('resConstantCase').textContent)">复制</button>
                  </div>
                  <div id="resConstantCase" style="font-size: 0.95rem; font-weight: 600; color: var(--text-primary); word-break: break-all;">-</div>
                </div>

                <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.75rem 1rem;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                    <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-secondary);">🔄 Toggle Case (大小写反转)</span>
                    <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('resToggleCase').textContent)">复制</button>
                  </div>
                  <div id="resToggleCase" style="font-size: 0.95rem; font-weight: 600; color: var(--text-primary); word-break: break-all;">-</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    },
    init: function() {
      this.convertNum();
      this.setTextPreset('title');
    },
    switchTab: function(tab) {
      this.activeTab = tab;
      const numSec = document.getElementById('caseNumSection');
      const textSec = document.getElementById('caseTextSection');
      const btnNum = document.getElementById('caseTabNum');
      const btnText = document.getElementById('caseTabText');

      if (tab === 'number') {
        if (numSec) numSec.style.display = 'block';
        if (textSec) textSec.style.display = 'none';
        if (btnNum) { btnNum.className = 'tool-page-btn primary'; }
        if (btnText) { btnText.className = 'tool-page-btn'; }
        this.convertNum();
      } else {
        if (numSec) numSec.style.display = 'none';
        if (textSec) textSec.style.display = 'block';
        if (btnNum) { btnNum.className = 'tool-page-btn'; }
        if (btnText) { btnText.className = 'tool-page-btn primary'; }
        this.convertText();
      }
    },
    setNumPreset: function(val) {
      const inp = document.getElementById('caseNumInput');
      if (inp) {
        inp.value = val;
        this.convertNum();
      }
    },
    clearNum: function() {
      const inp = document.getElementById('caseNumInput');
      if (inp) {
        inp.value = '';
        this.convertNum();
      }
    },
    convertNum: function() {
      const inp = document.getElementById('caseNumInput');
      if (!inp) return;
      let valStr = inp.value.replace(/,/g, '').trim();

      const elRmbCap = document.getElementById('resRmbCap');
      const elCnUpper = document.getElementById('resCnUpper');
      const elCnLower = document.getElementById('resCnLower');
      const elFormatted = document.getElementById('resFormattedNum');
      const elEngWords = document.getElementById('resEngWords');

      if (!valStr || isNaN(parseFloat(valStr))) {
        if (elRmbCap) elRmbCap.textContent = '-';
        if (elCnUpper) elCnUpper.textContent = '-';
        if (elCnLower) elCnLower.textContent = '-';
        if (elFormatted) elFormatted.textContent = '-';
        if (elEngWords) elEngWords.textContent = '-';
        return;
      }

      let num = parseFloat(valStr);

      if (elRmbCap) elRmbCap.textContent = this.toRmbCapital(num);
      if (elCnUpper) elCnUpper.textContent = this.toChineseNumUpper(num);
      if (elCnLower) elCnLower.textContent = this.toChineseNumLower(num);
      if (elFormatted) elFormatted.textContent = '¥ ' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
      if (elEngWords) elEngWords.textContent = this.toEnglishWords(num);
    },
    toRmbCapital: function(num) {
      if (isNaN(num)) return '-';
      if (num === 0) return '零元整';
      let isNegative = num < 0;
      num = Math.abs(num);
      if (num >= 1e15) return '数值过大 (支持至千万亿)';

      const cnNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
      const cnIntRadice = ['', '拾', '佰', '仟'];
      const cnIntUnits = ['', '万', '亿', '兆'];
      const cnDecUnits = ['角', '分', '厘', '毫'];

      let parts = num.toFixed(4).split('.');
      let integerNum = parts[0];
      let decimalNum = parts[1];

      let chineseStr = '';

      if (parseInt(integerNum, 10) > 0) {
        let zeroCount = 0;
        let intLen = integerNum.length;
        for (let i = 0; i < intLen; i++) {
          let n = integerNum.substr(i, 1);
          let p = intLen - i - 1;
          let q = Math.floor(p / 4);
          let m = p % 4;
          if (n === '0') {
            zeroCount++;
          } else {
            if (zeroCount > 0) {
              chineseStr += cnNums[0];
            }
            zeroCount = 0;
            chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
          }
          if (m === 0 && zeroCount < 4) {
            chineseStr += cnIntUnits[q];
          }
        }
        chineseStr += '元';
      }

      let decStr = '';
      if (decimalNum !== '0000') {
        for (let i = 0; i < 4; i++) {
          let n = decimalNum.substr(i, 1);
          if (n !== '0') {
            decStr += cnNums[parseInt(n)] + cnDecUnits[i];
          }
        }
      }

      if (!chineseStr && !decStr) return '零元整';
      if (!chineseStr) chineseStr = '零元';
      if (!decStr) decStr = '整';

      return (isNegative ? '负' : '') + chineseStr + decStr;
    },
    numberToChineseUnits: function(intStr, digits) {
      const units = ['', '拾', '佰', '仟'];
      const bigUnits = ['', '万', '亿', '兆'];
      let zeroCount = 0;
      let res = '';
      let len = intStr.length;
      for (let i = 0; i < len; i++) {
        let n = intStr[i];
        let p = len - i - 1;
        let q = Math.floor(p / 4);
        let m = p % 4;
        if (n === '0') {
          zeroCount++;
        } else {
          if (zeroCount > 0) {
            res += digits[0];
          }
          zeroCount = 0;
          res += digits[parseInt(n)] + units[m];
        }
        if (m === 0 && zeroCount < 4) {
          res += bigUnits[q];
        }
      }
      return res;
    },
    toChineseNumUpper: function(num) {
      const digits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
      let isNeg = num < 0;
      let absNum = Math.abs(num);
      let parts = String(absNum).split('.');
      let intRes = this.numberToChineseUnits(parts[0], digits) || '零';
      let decRes = parts[1] ? '点' + parts[1].split('').map(d => digits[parseInt(d)] || d).join('') : '';
      return (isNeg ? '负' : '') + intRes + decRes;
    },
    toChineseNumLower: function(num) {
      const digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
      let isNeg = num < 0;
      let absNum = Math.abs(num);
      let parts = String(absNum).split('.');
      let intRes = this.numberToChineseUnits(parts[0], digits) || '零';
      let decRes = parts[1] ? '点' + parts[1].split('').map(d => digits[parseInt(d)] || d).join('') : '';
      return (isNeg ? '负' : '') + intRes + decRes;
    },
    toEnglishWords: function(num) {
      if (isNaN(num)) return '-';
      let isNeg = num < 0;
      let absVal = Math.abs(num);
      let parts = absVal.toFixed(2).split('.');
      let intVal = parseInt(parts[0], 10);
      let cents = parseInt(parts[1], 10);

      const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
      const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
      const scales = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];

      function convertGroup(n) {
        let str = '';
        if (n >= 100) {
          str += ones[Math.floor(n / 100)] + ' Hundred ';
          n %= 100;
        }
        if (n >= 20) {
          str += tens[Math.floor(n / 10)] + (n % 10 > 0 ? '-' + ones[n % 10] : '') + ' ';
        } else if (n > 0) {
          str += ones[n] + ' ';
        }
        return str.trim();
      }

      if (intVal === 0 && cents === 0) return 'Zero Dollars Only';

      let wordArr = [];
      let scaleIdx = 0;
      let tempInt = intVal;

      if (tempInt === 0) {
        wordArr.push('Zero');
      } else {
        while (tempInt > 0) {
          let grp = tempInt % 1000;
          if (grp > 0) {
            let grpStr = convertGroup(grp);
            if (scales[scaleIdx]) grpStr += ' ' + scales[scaleIdx];
            wordArr.unshift(grpStr);
          }
          tempInt = Math.floor(tempInt / 1000);
          scaleIdx++;
        }
      }

      let res = (isNeg ? 'Negative ' : '') + wordArr.join(' ') + ' Dollars';
      if (cents > 0) {
        res += ' and ' + cents + '/100';
      }
      return res + ' Only';
    },

    // 论文 & 文本大小写
    setTextPreset: function(type) {
      const inp = document.getElementById('caseTextInput');
      if (!inp) return;
      if (type === 'title') {
        inp.value = 'a comprehensive study on deep neural networks: an empirical evaluation for medical imaging';
      } else if (type === 'abstract') {
        inp.value = 'in this paper, we propose a novel deep learning model for image processing. experimental results demonstrate that our approach outperforms state-of-the-art baselines by a significant margin.';
      } else if (type === 'code') {
        inp.value = 'user profile request handler';
      }
      this.convertText();
    },
    clearText: function() {
      const inp = document.getElementById('caseTextInput');
      if (inp) {
        inp.value = '';
        this.convertText();
      }
    },
    convertText: function() {
      const inp = document.getElementById('caseTextInput');
      if (!inp) return;
      let txt = inp.value;

      const setEl = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val || '-';
      };

      if (!txt.trim()) {
        ['resTitleCase', 'resSentenceCase', 'resUpperCase', 'resLowerCase', 'resCapWords', 'resCamelCase', 'resPascalCase', 'resSnakeCase', 'resKebabCase', 'resConstantCase', 'resToggleCase'].forEach(id => setEl(id, '-'));
        return;
      }

      setEl('resTitleCase', this.toTitleCaseAPA(txt));
      setEl('resSentenceCase', this.toSentenceCase(txt));
      setEl('resUpperCase', txt.toUpperCase());
      setEl('resLowerCase', txt.toLowerCase());
      setEl('resCapWords', this.toCapitalizeWords(txt));
      setEl('resCamelCase', this.toCamelCase(txt));
      setEl('resPascalCase', this.toPascalCase(txt));
      setEl('resSnakeCase', this.toSnakeCase(txt));
      setEl('resKebabCase', this.toKebabCase(txt));
      setEl('resConstantCase', this.toSnakeCase(txt).toUpperCase());
      setEl('resToggleCase', this.toToggleCase(txt));
    },

    toTitleCaseAPA: function(str) {
      if (!str) return '';
      const minorWords = new Set(['a', 'an', 'the', 'and', 'but', 'or', 'nor', 'for', 'so', 'yet', 'at', 'by', 'for', 'from', 'in', 'into', 'of', 'on', 'to', 'with', 'off', 'out', 'up', 'over', 'as', 'via', 'per']);

      let words = str.split(/(\s+|[:\-\–\—])/);
      let isAfterColon = false;

      return words.map((w, idx) => {
        if (/^\s+$/.test(w) || /^[:\-\–\—]$/.test(w)) {
          if (w === ':') isAfterColon = true;
          return w;
        }

        let cleanWord = w.toLowerCase();
        let isFirst = idx === 0 || isAfterColon;
        let isLast = idx === words.length - 1;

        isAfterColon = false;

        if (!isFirst && !isLast && minorWords.has(cleanWord)) {
          return cleanWord;
        }
        return cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1);
      }).join('');
    },

    toSentenceCase: function(str) {
      if (!str) return '';
      return str.toLowerCase().replace(/(^\s*|[.!?]\s+|\n\s*)([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase());
    },

    toCapitalizeWords: function(str) {
      if (!str) return '';
      return str.replace(/\b[a-zA-Z]/g, letter => letter.toUpperCase());
    },

    toCamelCase: function(str) {
      if (!str) return '';
      let clean = str.replace(/[^a-zA-Z0-9]+/g, ' ').trim();
      let parts = clean.split(/\s+/);
      if (parts.length === 0) return '';
      return parts[0].toLowerCase() + parts.slice(1).map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join('');
    },

    toPascalCase: function(str) {
      if (!str) return '';
      let camel = this.toCamelCase(str);
      return camel.charAt(0).toUpperCase() + camel.slice(1);
    },

    toSnakeCase: function(str) {
      if (!str) return '';
      return str.trim()
        .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
        .replace(/[^a-zA-Z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .toLowerCase();
    },

    toKebabCase: function(str) {
      if (!str) return '';
      return str.trim()
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase();
    },

    toToggleCase: function(str) {
      if (!str) return '';
      return str.split('').map(c => {
        if (c === c.toUpperCase()) return c.toLowerCase();
        if (c === c.toLowerCase()) return c.toUpperCase();
        return c;
      }).join('');
    }
  },

  run: function(action, ...args) {
    if (this[action] && typeof this[action].run === 'function') {
      return this[action].run(action, ...args);
    }
    for (const key in this) {
      if (this[key] && typeof this[key].run === 'function' && key !== 'run') {
        if (action.startsWith(key) || key.startsWith(action.split('-')[0])) {
          return this[key].run(action, ...args);
        }
      }
    }
  }
};

const FunTools = {
  // 1. Emoji表情
  'emoji': {
    name: 'Emoji表情',
    render: () => {
      setTimeout(() => {
        const tab = document.querySelector('#emojiTabs .tab');
        if (typeof FunTools.switchEmojiTab === 'function') {
          FunTools.switchEmojiTab('smile', tab);
        }
      }, 50);
      return `
      <div class="tool-section">
        <label class="tool-section-label">分类选择</label>
        <div class="tabs" id="emojiTabs">
          <div class="tab active" onclick="FunTools.switchEmojiTab('smile', this)">表情</div>
          <div class="tab" onclick="FunTools.switchEmojiTab('hand', this)">手势</div>
          <div class="tab" onclick="FunTools.switchEmojiTab('animal', this)">动物</div>
          <div class="tab" onclick="FunTools.switchEmojiTab('food', this)">食物</div>
          <div class="tab" onclick="FunTools.switchEmojiTab('object', this)">物品</div>
          <div class="tab" onclick="FunTools.switchEmojiTab('symbol', this)">符号</div>
        </div>
        <div id="emojiGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(48px, 1fr)); gap: 0.5rem; padding: 1rem 0;"></div>
      </div>
    `;
    },
    emojiSets: {
      smile: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '🥸', '😎', '🤓', '🧐'],
      hand: ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁️', '👅', '👄'],
      animal: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟'],
      food: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '蛋', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🌭', '🍔', '🍟', '🍕'],
      object: ['⌚', '📱', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '💽', '💾', '💿', '📀', '📷', '📹', '🎥', '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '🧭', '⏱️', '⏲️', '⏰', '💡', '🔦', '🏮', '📔', '📕', '📖', '📗', '📘', '📙', '📚', '📓', '📒', '📃', '📜', '📄', '📰', '🗞️', '🏷️', '🔖', '🔑'],
      symbol: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳']
    },
    switchEmojiTab: (type, el) => {
      if (el) {
        document.querySelectorAll('#emojiTabs .tab').forEach(t => t.classList.remove('active'));
        el.classList.add('active');
      }
      
      const grid = document.getElementById('emojiGrid');
      if (!grid) return;

      const sets = (FunTools['emoji'] && FunTools['emoji'].emojiSets) || FunTools.emojiSets || {};
      const list = sets[type] || [];
      grid.innerHTML = list.map(emoji => `
        <div class="modal-list-item" style="text-align: center; cursor: pointer; padding: 0.5rem; font-size: 1.5rem; border-radius: 8px; transition: transform 0.15s;" onclick="copyToClipboard('${emoji}')" title="点击复制">
          ${emoji}
        </div>
      `).join('');
    }
  },

  // 2. 表情包生成
  'meme': {
    name: '表情包生成',
    render: () => {
      setTimeout(() => {
        if (typeof FunTools['meme'].drawMeme === 'function') {
          FunTools['meme'].drawMeme();
        }
      }, 50);
      return `
      <div class="tool-section">
        <label class="tool-section-label">文字与样式配置</label>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <input type="text" id="memeTopText" class="tool-input" placeholder="顶部文字 (例如：当代码一次编译通过时)" value="当代码一次编译通过时" oninput="FunTools['meme'].drawMeme()">
          <input type="text" id="memeBottomText" class="tool-input" placeholder="底部文字 (例如：不敢相信自己的眼睛)" value="不敢相信自己的眼睛" oninput="FunTools['meme'].drawMeme()">
          <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap; margin-top: 5px;">
            <label style="font-size: 0.9rem;">画布风格：</label>
            <select id="memeStyle" class="tool-select" style="min-width: 140px;" onchange="FunTools['meme'].drawMeme()">
              <option value="classic">经典暗色标语框</option>
              <option value="doge">🐶 柴犬表情包风格</option>
              <option value="bright">☀️ 亮彩活泼风格</option>
            </select>
            <label style="font-size: 0.9rem; margin-left: 10px;">文字大小：</label>
            <select id="memeFontSize" class="tool-select" style="min-width: 90px;" onchange="FunTools['meme'].drawMeme()">
              <option value="18">小 (18px)</option>
              <option value="22" selected>中 (22px)</option>
              <option value="28">大 (28px)</option>
            </select>
          </div>
        </div>
      </div>
      <div class="tool-section" style="margin-top: 1rem;">
        <label class="tool-section-label">预览与下载</label>
        <div style="text-align: center; background: var(--bg-secondary); padding: 1rem; border-radius: 12px; border: 1px solid var(--border-color);">
          <canvas id="memeCanvas" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"></canvas>
        </div>
        <div style="text-align: center; margin-top: 1rem;">
          <button class="tool-page-btn primary" onclick="FunTools['meme'].downloadMeme()">
            ${ICONS.download} 下载表情包图片
          </button>
        </div>
      </div>
    `;
    },
    drawMeme: () => {
      const canvas = document.getElementById('memeCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      const topText = (document.getElementById('memeTopText')?.value || '').trim();
      const bottomText = (document.getElementById('memeBottomText')?.value || '').trim();
      const style = document.getElementById('memeStyle')?.value || 'classic';
      const fontSize = parseInt(document.getElementById('memeFontSize')?.value) || 22;

      canvas.width = 440;
      canvas.height = 320;

      if (style === 'doge') {
        ctx.fillStyle = '#fef3c7';
        ctx.fillRect(0, 0, 440, 320);

        // Draw simple cute doge face representation
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(220, 160, 80, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(190, 145, 18, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(250, 145, 18, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#1e293b';
        ctx.beginPath(); ctx.arc(195, 145, 8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(245, 145, 8, 0, Math.PI * 2); ctx.fill();

        ctx.beginPath(); ctx.arc(220, 175, 10, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#d97706';
        ctx.font = `bold ${fontSize}px "Microsoft YaHei", sans-serif`;
        ctx.textAlign = 'center';
        if (topText) ctx.fillText(topText, 220, 50);
        if (bottomText) ctx.fillText(bottomText, 220, 285);
      } else if (style === 'bright') {
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(0, 0, 440, 320);

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(15, 15, 410, 290);

        ctx.fillStyle = '#1d4ed8';
        ctx.font = `bold ${fontSize}px "Microsoft YaHei", sans-serif`;
        ctx.textAlign = 'center';
        if (topText) ctx.fillText(topText, 220, 60);
        if (bottomText) ctx.fillText(bottomText, 220, 260);
      } else {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, 440, 320);

        ctx.fillStyle = '#1e293b';
        ctx.fillRect(20, 20, 400, 280);

        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.font = `bold ${fontSize}px "Microsoft YaHei", sans-serif`;
        ctx.textAlign = 'center';

        if (topText) {
          ctx.strokeText(topText, 220, 70);
          ctx.fillText(topText, 220, 70);
        }
        if (bottomText) {
          ctx.strokeText(bottomText, 220, 250);
          ctx.fillText(bottomText, 220, 250);
        }
      }
    },
    downloadMeme: () => {
      const canvas = document.getElementById('memeCanvas');
      if (canvas) {
        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = 'meme.png';
        a.click();
        showToast('表情包图片已开始下载！', 'success');
      }
    }
  },

  // 3. 缘分计算
  'love-calc': {
    name: '缘分计算',
    render: () => {
      setTimeout(() => {
        const n1 = document.getElementById('loveName1');
        const n2 = document.getElementById('loveName2');
        if (n1 && !n1.value) n1.value = '罗密欧';
        if (n2 && !n2.value) n2.value = '朱丽叶';
        if (typeof FunTools.calcLove === 'function') FunTools.calcLove();
      }, 50);
      return `
      <div class="tool-section">
        <label class="tool-section-label">双方姓名输入</label>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div>
            <label style="font-size: 0.85rem; color: var(--text-tertiary);">你的名字</label>
            <input type="text" id="loveName1" class="tool-input" placeholder="输入你的名字" value="罗密欧" oninput="FunTools.calcLove()">
          </div>
          <div>
            <label style="font-size: 0.85rem; color: var(--text-tertiary);">TA的名字</label>
            <input type="text" id="loveName2" class="tool-input" placeholder="输入TA的名字" value="朱丽叶" oninput="FunTools.calcLove()">
          </div>
        </div>
      </div>
      <div class="tool-options">
        <button class="tool-page-btn primary" onclick="FunTools.calcLove()">
          💕 重新测试缘分
        </button>
      </div>
      <div class="tool-section" id="loveResult" style="display:none; margin-top: 1rem;">
        <div style="text-align: center; padding: 1.8rem; background: var(--bg-secondary); border-radius: 12px; border: 1px solid var(--border-color);">
          <div id="loveHeart" style="font-size: 4rem; margin-bottom: 0.5rem; animation: pulse 1.5s infinite;">💕</div>
          <div id="lovePercent" style="font-size: 3.5rem; font-weight: bold; color: var(--accent);">0%</div>
          <div id="loveText" style="font-size: 1.25rem; font-weight: 600; margin-top: 0.8rem; color: var(--text-primary);"></div>
          
          <div id="loveMetrics" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 1.2rem; font-size: 0.88rem;">
            <div style="background: var(--card-bg); padding: 8px; border-radius: 8px;">沟通默契：<span id="m1" style="font-weight: bold; color: var(--accent);">88%</span></div>
            <div style="background: var(--card-bg); padding: 8px; border-radius: 8px;">三观契合：<span id="m2" style="font-weight: bold; color: var(--accent);">92%</span></div>
            <div style="background: var(--card-bg); padding: 8px; border-radius: 8px;">甜蜜指数：<span id="m3" style="font-weight: bold; color: var(--accent);">95%</span></div>
          </div>
        </div>
      </div>
    `;
    },
    calcLove: () => {
      const name1El = document.getElementById('loveName1');
      const name2El = document.getElementById('loveName2');
      const resEl = document.getElementById('loveResult');
      const pcEl = document.getElementById('lovePercent');
      const textEl = document.getElementById('loveText');
      if (!name1El || !name2El || !pcEl || !textEl) return;

      const name1 = name1El.value.trim() || '你';
      const name2 = name2El.value.trim() || 'TA';
      
      const hash = (name1 + name2).split('').reduce((a, b) => a + b.charCodeAt(0), 0);
      const percent = Math.floor((hash % 45) + 55); // Keep score fun & encouraging (55 - 99%)
      
      if (resEl) resEl.style.display = 'block';
      pcEl.textContent = percent + '%';
      
      let text;
      if (percent > 90) text = '✨ 天生一对，心有灵犀！';
      else if (percent > 80) text = '💖 很有缘分，彼此非常吸引！';
      else if (percent > 70) text = '🌟 相处融洽，值得用心守护！';
      else text = '🤝 互补默契，加深了解会更甜蜜！';
      
      textEl.textContent = `${name1} 和 ${name2} 的缘分指数：${text}`;

      const m1 = document.getElementById('m1');
      const m2 = document.getElementById('m2');
      const m3 = document.getElementById('m3');
      if (m1) m1.textContent = ((hash * 7) % 30 + 70) + '%';
      if (m2) m2.textContent = ((hash * 13) % 25 + 75) + '%';
      if (m3) m3.textContent = ((hash * 19) % 20 + 80) + '%';
    }
  },

  // 4. 掷骰子
  'dice': {
    name: '掷骰子',
    render: () => {
      setTimeout(() => {
        if (typeof FunTools.rollDice === 'function') {
          FunTools.rollDice();
        }
      }, 50);
      return `
      <div class="tool-section" style="text-align: center; padding: 1.5rem 1rem; background: var(--bg-secondary); border-radius: 12px; border: 1px solid var(--border-color);">
        <div style="display: flex; justify-content: center; align-items: center; gap: 15px; margin-bottom: 1rem;">
          <label style="font-size: 0.95rem;">骰子个数：</label>
          <select id="diceCount" class="tool-select" style="width: 100px;" onchange="FunTools.rollDice()">
            <option value="1">1 个</option>
            <option value="2" selected>2 个</option>
            <option value="3">3 个</option>
            <option value="6">6 个</option>
          </select>
        </div>
        <div id="diceDisplay" style="font-size: 4rem; display: flex; justify-content: center; gap: 15px; flex-wrap: wrap; margin: 1.2rem 0; min-height: 80px; align-items: center;">🎲</div>
        <div id="diceSum" style="font-size: 1.2rem; font-weight: bold; color: var(--accent); margin-bottom: 1.2rem;">点数总和：--</div>
        <button class="tool-page-btn primary" onclick="FunTools.rollDice()" style="font-size: 1.1rem; padding: 0.8rem 2rem;">
          🎲 掷骰子
        </button>
      </div>
      <div class="tool-section" id="diceHistory" style="display:none; margin-top: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <label class="tool-section-label">投掷历史记录</label>
          <button class="tool-result-btn" onclick="document.getElementById('diceResults').innerHTML=''; document.getElementById('diceHistory').style.display='none';">清空历史</button>
        </div>
        <div id="diceResults" style="display: flex; gap: 0.6rem; flex-wrap: wrap; margin-top: 8px;"></div>
      </div>
    `;
    },
    rollDice: () => {
      const countEl = document.getElementById('diceCount');
      const count = countEl ? parseInt(countEl.value) || 2 : 2;
      const diceFaces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

      let sum = 0;
      const rolls = [];
      const faceElements = [];

      for (let i = 0; i < count; i++) {
        const val = Math.floor(Math.random() * 6) + 1;
        sum += val;
        rolls.push(val);
        faceElements.push(`<span style="display: inline-block; animation: popIn 0.3s ease;">${diceFaces[val - 1]}</span>`);
      }

      const dispEl = document.getElementById('diceDisplay');
      const sumEl = document.getElementById('diceSum');
      if (dispEl) dispEl.innerHTML = faceElements.join('');
      if (sumEl) sumEl.textContent = `点数总和：${sum} 点 (${rolls.join(' + ')})`;

      const history = document.getElementById('diceHistory');
      const results = document.getElementById('diceResults');
      if (history) history.style.display = 'block';

      if (results) {
        const span = document.createElement('span');
        span.textContent = `${rolls.join(', ')} (共${sum}点)`;
        span.style.cssText = 'padding: 0.4rem 0.8rem; background: var(--bg-tertiary); border-radius: 6px; font-weight: bold; font-size: 0.88rem;';
        results.prepend(span);
        if (results.children.length > 10) results.removeChild(results.lastChild);
      }
    }
  },

  // 5. 抛硬币
  'flip-coin': {
    name: '抛硬币',
    render: () => {
      setTimeout(() => {
        if (typeof FunTools.flipCoin === 'function') {
          FunTools.flipCoin();
        }
      }, 50);
      return `
      <div class="tool-section" style="text-align: center; padding: 2rem 1rem; background: var(--bg-secondary); border-radius: 12px; border: 1px solid var(--border-color);">
        <div id="coinDisplay" style="font-size: 5rem; margin: 1rem 0; transition: transform 0.4s ease-out;">🪙</div>
        <div id="coinResultText" style="font-size: 1.5rem; font-weight: bold; color: var(--accent); margin-bottom: 1.2rem;">点击下方按钮抛硬币</div>
        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
          <button class="tool-page-btn primary" onclick="FunTools.flipCoin()" style="font-size: 1.1rem; padding: 0.8rem 2rem;">
            🪙 抛一次硬币
          </button>
          <button class="tool-page-btn" onclick="FunTools.flipCoinMulti(10)">
            ⚡ 连抛10次
          </button>
        </div>
      </div>
      <div class="tool-section" id="coinStats" style="margin-top: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <label class="tool-section-label" style="margin:0;">抛硬币统计数据</label>
          <button class="tool-result-btn" onclick="FunTools.resetCoinStats()">重置统计</button>
        </div>
        <div class="stats-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; text-align: center;">
          <div class="stat-item" style="background: var(--bg-secondary); padding: 1rem; border-radius: 8px;">
            <div class="stat-value" id="coinHeads" style="font-size: 1.8rem; font-weight: bold; color: var(--accent);">0</div>
            <div class="stat-label">👑 正面次数</div>
          </div>
          <div class="stat-item" style="background: var(--bg-secondary); padding: 1rem; border-radius: 8px;">
            <div class="stat-value" id="coinTails" style="font-size: 1.8rem; font-weight: bold; color: #f59e0b;">0</div>
            <div class="stat-label">🪙 反面次数</div>
          </div>
          <div class="stat-item" style="background: var(--bg-secondary); padding: 1rem; border-radius: 8px;">
            <div class="stat-value" id="coinRatio" style="font-size: 1.8rem; font-weight: bold; color: var(--text-primary);">0%</div>
            <div class="stat-label">正面比例</div>
          </div>
        </div>
      </div>
    `;
    },
    coinHeadsCount: 0,
    coinTailsCount: 0,
    flipCoin: () => {
      const isHeads = Math.random() < 0.5;
      const coinEl = document.getElementById('coinDisplay');
      const textEl = document.getElementById('coinResultText');

      if (coinEl) {
        coinEl.style.transform = 'rotateY(720deg)';
        setTimeout(() => { coinEl.style.transform = 'none'; }, 400);
        coinEl.textContent = isHeads ? '👑' : '🪙';
      }

      if (isHeads) FunTools.coinHeadsCount++;
      else FunTools.coinTailsCount++;

      if (textEl) {
        textEl.textContent = isHeads ? '🎉 结果：正面 (Heads)' : '🪙 结果：反面 (Tails)';
      }

      FunTools.updateCoinStatsUI();
    },
    flipCoinMulti: (times) => {
      for (let i = 0; i < times; i++) {
        if (Math.random() < 0.5) FunTools.coinHeadsCount++;
        else FunTools.coinTailsCount++;
      }
      const textEl = document.getElementById('coinResultText');
      if (textEl) {
        textEl.textContent = `⚡ 已连续抛掷 ${times} 次！`;
      }
      FunTools.updateCoinStatsUI();
    },
    updateCoinStatsUI: () => {
      const statsEl = document.getElementById('coinStatsText');
      if (statsEl) {
        const total = FunTools.coinHeadsCount + FunTools.coinTailsCount;
        const hPct = total ? Math.round((FunTools.coinHeadsCount / total) * 100) : 0;
        const tPct = total ? Math.round((FunTools.coinTailsCount / total) * 100) : 0;
        statsEl.textContent = `统计：正面 ${FunTools.coinHeadsCount} 次 (${hPct}%) | 反面 ${FunTools.coinTailsCount} 次 (${tPct}%) | 总计 ${total} 次`;
      }
    },
    resetCoinStats: () => {
      FunTools.coinHeadsCount = 0;
      FunTools.coinTailsCount = 0;
      const textEl = document.getElementById('coinResultText');
      if (textEl) textEl.textContent = '点击下方按钮开始抛硬币';
      FunTools.updateCoinStatsUI();
      showToast('统计数据已重置', 'info');
    }
  },

  // 6. 脑筋急转弯
  'riddle': {
    name: '脑筋急转弯',
    render: () => {
      setTimeout(() => {
        if (typeof FunTools.nextRiddle === 'function') {
          FunTools.nextRiddle();
        }
      }, 50);
      return `
      <div class="tool-section">
        <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.5rem; text-align: center;">
          <div style="font-size: 0.9rem; color: var(--text-tertiary); margin-bottom: 8px;">🧠 脑筋急转弯题目：</div>
          <h2 id="riddleQuestion" style="font-size: 1.4rem; color: var(--text-primary); margin: 0 0 1.5rem 0; min-height: 50px; display: flex; align-items: center; justify-content: center;">加载中...</h2>
          <div id="riddleAnswerBox" style="display: none; background: var(--card-bg); border: 2px dashed var(--accent); padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;">
            <div style="font-size: 0.85rem; color: var(--text-tertiary);">💡 答案揭晓：</div>
            <div id="riddleAnswer" style="font-size: 1.2rem; font-weight: bold; color: var(--accent); margin-top: 4px;"></div>
          </div>
          <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
            <button class="tool-page-btn" onclick="FunTools.toggleRiddleAnswer()">💡 查看答案</button>
            <button class="tool-page-btn primary" onclick="FunTools.nextRiddle()">🎲 换一题</button>
          </div>
        </div>
      </div>
      `;
    },
    riddlesList: [
      { q: "什么字大家看了都说没用？", a: "“无”字（无用）" },
      { q: "什么路不能走？", a: "电路、死路" },
      { q: "小白兔打架，打一成语？", a: "白打" },
      { q: "什么东西越洗越脏？", a: "水" },
      { q: "哪种比赛越往前跑越慢？", a: "划船比赛" },
      { q: "世界上什么东西比天还高？", a: "心（心比天高）" },
      { q: "小明知道答案，为什么还要问？", a: "他在考试/提问别人" },
      { q: "什么动物最容易摔倒？", a: "脚滑（狡猾）的狐狸" }
    ],
    currentIdx: 0,
    nextRiddle: () => {
      const list = FunTools['riddle'].riddlesList;
      FunTools['riddle'].currentIdx = Math.floor(Math.random() * list.length);
      const item = list[FunTools['riddle'].currentIdx];
      const qEl = document.getElementById('riddleQuestion');
      const ansBox = document.getElementById('riddleAnswerBox');
      const ansEl = document.getElementById('riddleAnswer');
      if (qEl) qEl.textContent = item.q;
      if (ansEl) ansEl.textContent = item.a;
      if (ansBox) ansBox.style.display = 'none';
    },
    toggleRiddleAnswer: () => {
      const ansBox = document.getElementById('riddleAnswerBox');
      if (ansBox) {
        ansBox.style.display = ansBox.style.display === 'none' ? 'block' : 'none';
      }
    }
  },

  // 7. 文字游戏 (成语接龙)
  'word-game': {
    name: '文字游戏',
    render: () => {
      return `
      <div class="tool-section">
        <label class="tool-section-label">成语接龙大挑战</label>
        <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.5rem; margin-bottom: 1rem; text-align: center;">
          <div style="font-size: 0.9rem; color: var(--text-tertiary);">当前上家成语：</div>
          <div id="wgCurrentIdiom" style="font-size: 2.2rem; font-weight: bold; color: var(--accent); margin: 8px 0;">一心一意</div>
          <div style="font-size: 0.95rem; color: var(--text-secondary);">你需要用首字为 <strong id="wgNextChar" style="color: #ef4444; font-size: 1.2rem;">意</strong> 接龙：</div>
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">
          <input type="text" id="wgInput" class="tool-input" placeholder="输入接龙成语 (如：意气风发)" onkeydown="if(event.key==='Enter') FunTools['word-game'].submitIdiom()">
          <button class="tool-page-btn primary" onclick="FunTools['word-game'].submitIdiom()" style="white-space: nowrap;">提交接龙</button>
        </div>
      </div>
      <div class="tool-section" style="margin-top: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <label class="tool-section-label" style="margin: 0;">接龙历史轨道</label>
          <button class="tool-result-btn" onclick="FunTools['word-game'].resetIdiomGame()">重新开始</button>
        </div>
        <div id="wgHistory" style="display: flex; flex-wrap: wrap; gap: 8px; background: var(--bg-secondary); padding: 12px; border-radius: 8px; min-height: 50px; align-items: center;">
          <span class="tool-card-tag" style="font-size: 0.95rem; padding: 4px 10px;">一心一意</span>
        </div>
      </div>
    `;
    },
    idiomsDict: [
      '一心一意', '意气风发', '发扬光大', '大吉大利', '利国利民', '民富国强', '强身健体',
      '体贴入微', '微乎其微', '微言大义', '义薄云天', '天长地久', '久别重逢', '逢凶化吉',
      '吉星高照', '照单全收', '收放自如', '如日中天', '天马行空', '空前绝后', '后生可畏'
    ],
    submitIdiom: () => {
      const inputEl = document.getElementById('wgInput');
      const val = (inputEl ? inputEl.value : '').trim();
      if (!val) {
        showToast('请输入接龙成语', 'error');
        return;
      }

      const currBox = document.getElementById('wgCurrentIdiom');
      const nextBox = document.getElementById('wgNextChar');
      const history = document.getElementById('wgHistory');
      if (!currBox || !nextBox) return;

      const currentTargetChar = nextBox.textContent;
      if (val.charAt(0) !== currentTargetChar) {
        showToast(`成语必须以“${currentTargetChar}”字开头哦！`, 'error');
        return;
      }

      currBox.textContent = val;
      const lastChar = val.slice(-1);
      nextBox.textContent = lastChar;
      if (history) {
        history.innerHTML += `<span class="tool-card-tag" style="font-size: 0.95rem; padding: 4px 10px;">${val}</span>`;
      }
      if (inputEl) inputEl.value = '';

      // AI Bot Auto Response
      const match = FunTools['word-game'].idiomsDict.find(item => item.charAt(0) === lastChar && item !== val);
      if (match) {
        setTimeout(() => {
          currBox.textContent = match + ' (🤖 AI接龙)';
          const botLast = match.slice(-1);
          nextBox.textContent = botLast;
          if (history) {
            history.innerHTML += `<span class="tool-card-tag" style="background: var(--accent); color: #fff; font-size: 0.95rem; padding: 4px 10px;">🤖 ${match}</span>`;
          }
          showToast(`AI已回应：${match}`, 'info');
        }, 600);
      } else {
        showToast('太棒了！AI被你的高深成语难倒了！🎉', 'success');
      }
    },
    resetIdiomGame: () => {
      const currBox = document.getElementById('wgCurrentIdiom');
      const nextBox = document.getElementById('wgNextChar');
      const history = document.getElementById('wgHistory');
      if (currBox) currBox.textContent = '一心一意';
      if (nextBox) nextBox.textContent = '意';
      if (history) history.innerHTML = '<span class="tool-card-tag" style="font-size: 0.95rem; padding: 4px 10px;">一心一意</span>';
      showToast('接龙游戏已重置', 'info');
    }
  },

  // 8. ASCII艺术字
  'ascii-art': {
    name: 'ASCII艺术字',
    render: () => {
      setTimeout(() => {
        if (typeof FunTools.generateASCII === 'function') {
          FunTools.generateASCII();
        }
      }, 50);
      return `
      <div class="tool-section">
        <label class="tool-section-label">输入英文文本与字体样式</label>
        <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
          <input type="text" id="asciiInput" class="tool-input" style="flex: 1; min-width: 200px;" placeholder="输入英文文本" value="TOOLBOX" oninput="FunTools.generateASCII()">
          <select id="asciiFont" class="tool-select" style="min-width: 120px;" onchange="FunTools.generateASCII()">
            <option value="block">Block 立体方块</option>
            <option value="banner">Banner 横幅</option>
          </select>
          <button class="tool-page-btn primary" onclick="FunTools.generateASCII()">
            ${ICONS.play} 生成艺术字
          </button>
        </div>
      </div>
      <div class="tool-section" style="margin-top: 1rem;">
        <label class="tool-section-label">ASCII 艺术字预览</label>
        <textarea id="asciiOutput" class="tool-textarea" readonly rows="8" style="font-family: monospace; font-size: 13px; line-height: 1.2; white-space: pre; word-break: normal; background: var(--bg-secondary); color: var(--accent); font-weight: bold; padding: 12px; border-radius: 8px;"></textarea>
        <div style="margin-top: 8px; text-align: right;">
          <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('asciiOutput').value)">
            ${ICONS.copy} 复制艺术字
          </button>
        </div>
      </div>
    `;
    },
    generateASCII: () => {
      const inputEl = document.getElementById('asciiInput');
      const fontEl = document.getElementById('asciiFont');
      const outEl = document.getElementById('asciiOutput');
      if (!inputEl || !outEl) return;

      const text = (inputEl.value || 'TOOLBOX').toUpperCase();
      const font = fontEl ? fontEl.value : 'block';

      const fonts = {
        block: {
          'A': [' ▄▀█ ', ' █▀█ ', ' ▀ ▀ '],
          'B': [' █▄█ ', ' █▄█ ', ' ▀▀▀ '],
          'C': [' ▄▀█ ', ' █   ', ' ▀▀▀ '],
          'D': [' █▀  ', ' █ █ ', ' ▀▀  '],
          'E': [' █▀▀ ', ' █▀▀ ', ' ▀▀▀ '],
          'F': [' █▀▀ ', ' █▀▀ ', ' ▀   '],
          'G': [' ▄▀█ ', ' █ █ ', ' ▀▀▀ '],
          'H': [' █ █ ', ' █▀█ ', ' ▀ ▀ '],
          'I': [' █ ', ' █ ', ' ▀ '],
          'J': [' █ ', ' █ ', ' ▀▀ '],
          'K': [' █ █ ', ' █▀  ', ' ▀ ▀ '],
          'L': [' █   ', ' █   ', ' ▀▀▀ '],
          'M': [' █▄█ ', ' █ █ ', ' ▀ ▀ '],
          'N': [' █▄█ ', ' █ █ ', ' ▀ ▀ '],
          'O': [' ▄▀█ ', ' █ █ ', ' ▀▀▀ '],
          'P': [' ▄▀█ ', ' █▀█ ', ' ▀ ▀ '],
          'Q': [' ▄▀█ ', ' █ █ ', ' ▀▄▀ '],
          'R': [' ▄▀█ ', ' █▀▄ ', ' ▀ ▀ '],
          'S': [' ▄▀█ ', ' ▀▀█ ', ' ▀▀▀ '],
          'T': [' ▀▀▀ ', '  █  ', '  ▀  '],
          'U': [' █ █ ', ' █ █ ', ' ▀▀▀ '],
          'V': [' █ █ ', ' █ █ ', ' ▀▄▀ '],
          'W': [' █ █ ', ' █▄█ ', ' ▄▀▄ '],
          'X': [' ▀▄▀ ', '  █  ', ' ▀▄▀ '],
          'Y': [' █▀█ ', '  █  ', '  ▀  '],
          'Z': [' ▄▀█ ', ' █▄█ ', ' ▀▀▀ '],
          '0': [' ▄▀█ ', ' █▄█ ', ' ▀▀▀ '],
          '1': ['  █  ', '  █  ', ' ▀▀▀ '],
          '2': [' ▄▀█ ', ' ▀▀█ ', ' ▀▀▀ '],
          '3': [' ▄▀█ ', ' ▀▀█ ', ' ▀▀▀ '],
          '4': [' █ █ ', ' ▀▀█ ', '   ▀ '],
          '5': [' ▄▀█ ', ' █▀▀ ', ' ▀▀▀ '],
          '6': [' ▄▀█ ', ' █▀▀ ', ' ▀▀▀ '],
          '7': [' ▀▀█ ', '  █  ', '  ▀  '],
          '8': [' ▄▀█ ', ' ▀▀█ ', ' ▀▀▀ '],
          '9': [' ▄▀█ ', ' ▀▀█ ', ' ▀▀  '],
          ' ': ['   ', '   ', '   ']
        },
        banner: {
          'A': ['  #####  ', ' #     # ', ' ####### ', ' #     # '],
          'B': [' ######  ', ' #####   ', ' #     # ', ' ######  '],
          'C': ['  #####  ', ' #       ', ' #       ', '  #####  '],
          'D': [' ######  ', ' #     # ', ' #     # ', ' ######  '],
          'E': [' ####### ', ' #####   ', ' #       ', ' ####### '],
          'F': [' ####### ', ' #####   ', ' #       ', ' #       '],
          'G': ['  #####  ', ' #  #### ', ' #     # ', '  #####  '],
          'H': [' #     # ', ' ####### ', ' #     # ', ' #     # '],
          'I': [' ####### ', '    #    ', '    #    ', ' ####### '],
          'J': [' ####### ', '    #    ', ' #  #    ', '  ##     '],
          'K': [' #    #  ', ' #####   ', ' #  #    ', ' #   ##  '],
          'L': [' #       ', ' #       ', ' #       ', ' ####### '],
          'M': [' #     # ', ' ##   ## ', ' # # # # ', ' #  #  # '],
          'N': [' #     # ', ' ##    # ', ' #  #  # ', ' #    ## '],
          'O': ['  #####  ', ' #     # ', ' #     # ', '  #####  '],
          'P': [' ######  ', ' #     # ', ' ######  ', ' #       '],
          'Q': ['  #####  ', ' #     # ', ' #   # # ', '  #### # '],
          'R': [' ######  ', ' #     # ', ' ######  ', ' #   #   '],
          'S': ['  #####  ', '  #####  ', '       # ', '  #####  '],
          'T': [' ####### ', '    #    ', '    #    ', '    #    '],
          'U': [' #     # ', ' #     # ', ' #     # ', '  #####  '],
          'V': [' #     # ', ' #     # ', '  #   #  ', '   # #   '],
          'W': [' #     # ', ' #  #  # ', ' ##   ## ', ' #     # '],
          'X': [' #     # ', '  #   #  ', '   # #   ', ' #     # '],
          'Y': [' #     # ', '  #   #  ', '    #    ', '    #    '],
          'Z': [' ####### ', '   #     ', '  #      ', ' ####### '],
          '0': ['  #####  ', ' #     # ', ' #     # ', '  #####  '],
          '1': ['   ##    ', '  # #    ', '    #    ', ' ####### '],
          '2': ['  #####  ', '       # ', '  #####  ', ' ####### '],
          '3': ['  #####  ', '     ##  ', '       # ', '  #####  '],
          '4': [' #    #  ', ' #    #  ', ' ####### ', '      #  '],
          '5': [' ####### ', ' #####   ', '       # ', '  #####  '],
          '6': ['  #####  ', ' #       ', ' ######  ', '  #####  '],
          '7': [' ####### ', '      #  ', '     #   ', '    #    '],
          '8': ['  #####  ', '  #####  ', ' #     # ', '  #####  '],
          '9': ['  #####  ', ' ######  ', '       # ', '  #####  '],
          ' ': ['   ', '   ', '   ', '   ']
        }
      };

      const charData = fonts[font] || fonts.block;
      const height = font === 'banner' ? 4 : 3;
      const lines = Array(height).fill('');

      for (const char of text) {
        const data = charData[char] || Array(height).fill('   ');
        for (let i = 0; i < height; i++) {
          lines[i] += (data[i] || '   ') + ' ';
        }
      }

      outEl.value = lines.join('\n');
    }
  },

  // 9. 虚拟身份
  'fake-person': {
    name: '虚拟身份',
    render: () => {
      setTimeout(() => {
        if (typeof FunTools['fake-person'].generateFakePerson === 'function') {
          FunTools['fake-person'].generateFakePerson();
        }
      }, 50);
      return `
      <div class="tool-section">
        <label class="tool-section-label">虚拟身份生成控制</label>
        <div style="display: flex; gap: 10px; align-items: center;">
          <button class="tool-page-btn primary" onclick="FunTools['fake-person'].generateFakePerson()">🎲 随机生成一个全新身份</button>
        </div>
      </div>
      <div class="tool-section" id="fpCardSection" style="margin-top: 1rem;">
        <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; margin-bottom: 1rem; flex-wrap: wrap; gap: 10px;">
            <div>
              <h2 id="fpName" style="font-size: 1.5rem; margin: 0; color: var(--accent);">张伟</h2>
              <span id="fpSub" style="color: var(--text-tertiary); font-size: 0.9rem;">男 | 28岁 | 双子座 | B型血</span>
            </div>
            <button class="tool-result-btn" onclick="FunTools['fake-person'].copyFakePerson()">复制全套资料</button>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; font-size: 0.95rem;" id="fpGrid">
            <div><strong>手机号码：</strong>13812345678</div>
            <div><strong>电子邮箱：</strong>user1234@example.com</div>
            <div><strong>身份证号：</strong>110101199501011234</div>
            <div><strong>居住地址：</strong>北京市朝阳区科技路88号</div>
            <div><strong>当前职业：</strong>高级软件工程师</div>
          </div>
        </div>
      </div>
    `;
    },
    generateFakePerson: () => {
      const names = ['张伟', '王芳', '李娜', '刘洋', '陈杰', '杨光', '赵敏', '黄宇', '周强', '吴秀兰'];
      const cities = ['北京市朝阳区科技路', '上海市浦东新区张江路', '广州市天河区珠江路', '深圳市南山区科技园', '杭州市西湖区文一路'];
      const jobs = ['高级软件工程师', '产品经理', 'UI/UX设计师', '数据分析师', '市场运营总监', '架构师'];
      const zodiacs = ['双子座', '狮子座', '天秤座', '射手座', '水瓶座', '白羊座'];
      const bloods = ['A型', 'B型', 'O型', 'AB型'];

      const name = names[Math.floor(Math.random() * names.length)];
      const city = cities[Math.floor(Math.random() * cities.length)] + Math.floor(Math.random() * 100 + 1) + '号';
      const job = jobs[Math.floor(Math.random() * jobs.length)];
      const zodiac = zodiacs[Math.floor(Math.random() * zodiacs.length)];
      const blood = bloods[Math.floor(Math.random() * bloods.length)];
      const age = Math.floor(Math.random() * 20 + 22);

      const phone = '138' + Math.floor(10000000 + Math.random() * 90000000);
      const email = 'user' + Math.floor(1000 + Math.random() * 9000) + '@example.com';
      const idCard = '110101' + (2026 - age) + '0512' + Math.floor(1000 + Math.random() * 9000);

      const nameEl = document.getElementById('fpName');
      const subEl = document.getElementById('fpSub');
      const gridEl = document.getElementById('fpGrid');

      if (nameEl) nameEl.textContent = name;
      if (subEl) subEl.textContent = '男 | ' + age + '岁 | ' + zodiac + ' | ' + blood + '血';
      if (gridEl) {
        gridEl.innerHTML = `
          <div><strong>手机号码：</strong>${phone}</div>
          <div><strong>电子邮箱：</strong>${email}</div>
          <div><strong>身份证号：</strong>${idCard}</div>
          <div><strong>居住地址：</strong>${city}</div>
          <div><strong>当前职业：</strong>${job}</div>
        `;
      }
    },
    copyFakePerson: () => {
      const name = document.getElementById('fpName')?.textContent || '';
      const sub = document.getElementById('fpSub')?.textContent || '';
      const info = document.getElementById('fpGrid')?.innerText || '';
      copyToClipboard(`【虚拟身份资料】\n姓名：${name}\n概要：${sub}\n${info}`);
    }
  },

  // 10. 星座运势
  'horoscope': {
    name: '星座运势',
    render: () => {
      setTimeout(() => {
        if (typeof FunTools['horoscope'].updateHoroscope === 'function') {
          FunTools['horoscope'].updateHoroscope();
        }
      }, 50);
      return `
      <div class="tool-section">
        <label class="tool-section-label">选择你的星座</label>
        <select id="horoSelect" class="tool-select" style="max-width: 260px;" onchange="FunTools['horoscope'].updateHoroscope()">
          <option value="白羊座">♈ 白羊座 (3.21-4.19)</option>
          <option value="金牛座">♉ 金牛座 (4.20-5.20)</option>
          <option value="双子座" selected>♊ 双子座 (5.21-6.21)</option>
          <option value="巨蟹座">♋ 巨蟹座 (6.22-7.22)</option>
          <option value="狮子座">♌ 狮子座 (7.23-8.22)</option>
          <option value="处女座">♍ 处女座 (8.23-9.22)</option>
          <option value="天秤座">♎ 天秤座 (9.23-10.23)</option>
          <option value="天蝎座">♏ 天蝎座 (10.24-11.22)</option>
          <option value="射手座">♐ 射手座 (11.23-12.21)</option>
          <option value="摩羯座">♑ 摩羯座 (12.22-1.19)</option>
          <option value="水瓶座">♒ 水瓶座 (1.20-2.18)</option>
          <option value="双鱼座">♓ 双鱼座 (2.19-3.20)</option>
        </select>
      </div>
      <div class="tool-section" id="horoResultSection" style="margin-top: 1rem;">
        <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.5rem;">
          <h2 id="horoTitle" style="color: var(--accent); margin-bottom: 1rem;">♊ 双子座今日运势</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; margin-bottom: 1rem;">
            <div style="background: var(--card-bg); padding: 8px 12px; border-radius: 6px;">综合运势：⭐⭐⭐⭐⭐</div>
            <div style="background: var(--card-bg); padding: 8px 12px; border-radius: 6px;">爱情运势：⭐⭐⭐⭐</div>
            <div style="background: var(--card-bg); padding: 8px 12px; border-radius: 6px;">事业财运：⭐⭐⭐⭐⭐</div>
          </div>
          <p id="horoDesc" style="color: var(--text-secondary); line-height: 1.6;">今天你的灵感爆棚，在工作和学习中容易展现出惊人的创意与沟通能力！适合开启新计划或与团队积极交流。</p>
        </div>
      </div>
    `;
    },
    updateHoroscope: () => {
      const selectEl = document.getElementById('horoSelect');
      const titleEl = document.getElementById('horoTitle');
      const descEl = document.getElementById('horoDesc');
      if (!selectEl || !titleEl) return;

      const val = selectEl.value;
      titleEl.textContent = `${val}今日运势解析`;

      const descs = {
        '白羊座': '今天干劲十足，面对挑战能迅速果断决策！宜勇敢表达想法。',
        '金牛座': '财运稳健，投资与理财规划有不错收益，适合制定长远计划。',
        '双子座': '灵感爆棚，沟通顺畅，团队合作能够带来意想不到的突破！',
        '巨蟹座': '情感细腻，适合与家人好友倾心交流，收获满满温馨。',
        '狮子座': '气场全开，个人魅力突出，适合主持项目或公开演讲！'
      };
      if (descEl) descEl.textContent = descs[val] || '今天整体运势顺畅，保持乐观积极的心态会有意外惊喜发生！';
    }
  },

  // 11. 随机笑话
  'random-joke': {
    name: '随机笑话',
    render: () => {
      setTimeout(() => {
        if (typeof FunTools['random-joke'].getJoke === 'function') {
          FunTools['random-joke'].getJoke();
        }
      }, 50);
      return `
      <div class="tool-options" style="display: flex; gap: 10px; align-items: center;">
        <button class="tool-page-btn primary" onclick="FunTools['random-joke'].getJoke()">
          🎲 随机换一个笑话
        </button>
      </div>
      <div class="tool-section" id="jokeSection" style="margin-top: 1rem;">
        <label class="tool-section-label">笑话内容</label>
        <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.5rem;">
          <p id="jokeText" style="font-size: 1.15rem; line-height: 1.7; color: var(--text-primary); margin: 0;"></p>
          <div style="margin-top: 1rem; text-align: right;">
            <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('jokeText').textContent)">
              ${ICONS.copy} 复制笑话
            </button>
          </div>
        </div>
      </div>
    `;
    },
    jokes: [
      "为什么程序员总是分不清万圣节和圣诞节？因为 Oct 31 == Dec 25！",
      "程序员最讨厌的两件事：1. 写文档 2. 别人不写文档。",
      "一个SQL语句走进酒吧，看到两张桌子(table)，于是问：我可以JOIN你们吗？",
      "代码写得好，下班下得早；代码写得烂，加班加到晚。",
      "为什么程序员总是把问题归咎于缓存？因为缓存总是背锅！",
      "有一天0遇到了8，0对8说：胖就胖吧，干嘛还系裤腰带！",
      "蜘蛛深情地看着蚊子：你这个吸血的鬼，我却为你网织情网！"
    ],
    getJoke: () => {
      const list = FunTools['random-joke'].jokes;
      const joke = list[Math.floor(Math.random() * list.length)];
      const textEl = document.getElementById('jokeText');
      if (textEl) textEl.textContent = joke;
    }
  },
  'daily-quote': {
    name: '每日一句',
    render: () => {
      setTimeout(() => {
        if (typeof FunTools['daily-quote'].getQuote === 'function') {
          FunTools['daily-quote'].getQuote();
        }
      }, 50);
      return `
      <div class="tool-options">
        <button class="tool-page-btn primary" onclick="FunTools['daily-quote'].getQuote()">
          ✨ 随机换一句金句
        </button>
      </div>
      <div class="tool-section" style="margin-top: 1rem;">
        <label class="tool-section-label">名言卡片</label>
        <div style="background: var(--bg-secondary); border-left: 4px solid var(--accent); border-radius: 8px; padding: 1.5rem;">
          <p id="quoteText" style="font-size: 1.2rem; font-style: italic; line-height: 1.7; color: var(--text-primary); margin: 0;"></p>
          <p id="quoteAuthor" style="font-size: 0.95rem; font-weight: bold; color: var(--accent); text-align: right; margin-top: 1rem; margin-bottom: 0;"></p>
          <div style="margin-top: 1rem; text-align: right;">
            <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('quoteText').textContent + ' ' + document.getElementById('quoteAuthor').textContent)">
              ${ICONS.copy} 复制金句
            </button>
          </div>
        </div>
      </div>
    `;
    },
    quotes: [
      { text: "“生活不是等待风暴过去，而是学会在雨中跳舞。”", author: "—— 维维安·格林" },
      { text: "“成功不是终点，失败也不是末日，重要的是继续前进的勇气。”", author: "—— 丘吉尔" },
      { text: "“代码是写给人看的，只是恰好能在机器上运行。”", author: "—— Harold Abelson" },
      { text: "“简单是终极的复杂。”", author: "—— 达芬奇" },
      { text: "“最好的时间是十年前，其次是现在。”", author: "—— 谚语" }
    ],
    getQuote: () => {
      const list = FunTools['daily-quote'].quotes;
      const item = list[Math.floor(Math.random() * list.length)];
      const tEl = document.getElementById('quoteText');
      const aEl = document.getElementById('quoteAuthor');
      if (tEl) tEl.textContent = item.text;
      if (aEl) aEl.textContent = item.author;
    }
  },

  // 13. 心理测试
  'psych-test': {
    name: '心理测试',
    render: () => {
      setTimeout(() => {
        if (typeof FunTools['psych-test'].startTest === 'function') {
          FunTools['psych-test'].startTest();
        }
      }, 50);
      return `
      <div class="tool-section">
        <label class="tool-section-label">趣味心理测试卡</label>
        <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.5rem;">
          <h3 id="psychQ" style="font-size: 1.2rem; margin-top: 0; margin-bottom: 1rem; color: var(--text-primary);">加载测试题中...</h3>
          <div id="psychOptions" style="display: flex; flex-direction: column; gap: 10px;"></div>
        </div>
      </div>
      <div class="tool-section" id="psychResult" style="display:none; margin-top: 1rem;">
        <label class="tool-section-label">测试结果报告</label>
        <div style="background: var(--bg-secondary); border: 2px dashed var(--accent); border-radius: 12px; padding: 1.5rem; text-align: center;">
          <h2 id="psychResultTitle" style="color: var(--accent); margin-top:0;"></h2>
          <p id="psychResultDesc" style="color: var(--text-secondary); line-height: 1.6;"></p>
          <button class="tool-page-btn primary" onclick="FunTools['psych-test'].startTest()" style="margin-top: 1rem;">重新测试</button>
        </div>
      </div>
    `;
    },
    questions: [
      {
        q: "当你遇到棘手难题时，你的第一反应通常是？",
        options: [
          { text: "A. 局势理性分析，制定解决步骤", resTitle: "🎯 沉稳理性型 (分析大师)", resDesc: "你拥有极强的逻辑思考能力与定力，遇事不慌，善于剥离情绪看到问题本质。" },
          { text: "B. 与信赖的朋友倾诉讨论", resTitle: "🤝 社交共情型 (温暖守护者)", resDesc: "你非常注重团队与人际纽带，拥有充沛的情感洞察力，深受亲友信赖。" },
          { text: "C. 凭直觉果断做出尝试", resTitle: "⚡ 勇敢开路型 (行动派)", resDesc: "你富有探索精神，执行力强，不畏惧未知与失败，往往是团队里的先锋！" }
        ]
      }
    ],
    startTest: () => {
      const q = FunTools['psych-test'].questions[0];
      const qEl = document.getElementById('psychQ');
      const optEl = document.getElementById('psychOptions');
      const resEl = document.getElementById('psychResult');

      if (resEl) resEl.style.display = 'none';
      if (qEl) qEl.textContent = '❓ ' + q.q;
      if (optEl) {
        optEl.innerHTML = q.options.map((opt, i) => `
          <button class="tool-page-btn" style="text-align: left; padding: 0.8rem 1rem;" onclick="FunTools['psych-test'].selectOption(${i})">${opt.text}</button>
        `).join('');
      }
    },
    selectOption: (idx) => {
      const q = FunTools['psych-test'].questions[0];
      const opt = q.options[idx];
      const resEl = document.getElementById('psychResult');
      const tEl = document.getElementById('psychResultTitle');
      const dEl = document.getElementById('psychResultDesc');

      if (resEl) resEl.style.display = 'block';
      if (tEl) tEl.textContent = opt.resTitle;
      if (dEl) dEl.textContent = opt.resDesc;
    }
  },

  // 14. 缘分计算
  'love-calc': {
    name: '缘分计算',
    render: () => `
      <div class="tool-section">
        <label class="tool-section-label">你的名字</label>
        <input type="text" id="loveName1" class="tool-input" placeholder="你的名字">
      </div>
      <div class="tool-section">
        <label class="tool-section-label">TA的名字</label>
        <input type="text" id="loveName2" class="tool-input" placeholder="TA的名字">
      </div>
      <div class="tool-options">
        <button class="tool-page-btn primary" onclick="FunTools.calcLove()">
          ${ICONS.play} 计算缘分
        </button>
      </div>
      <div class="tool-section" id="loveResult" style="display:none;">
        <div style="text-align: center; padding: 2rem;">
          <div id="loveHeart" style="font-size: 4rem; margin: 1rem 0;">💕</div>
          <div id="lovePercent" style="font-size: 3rem; font-weight: bold; color: var(--accent);">0%</div>
          <div id="loveText" style="font-size: 1.2rem; color: var(--text-secondary); margin-top: 1rem;"></div>
        </div>
      </div>
    `,
    calcLove: () => {
      const name1 = document.getElementById('loveName1').value || '你';
      const name2 = document.getElementById('loveName2').value || 'TA';
      
      const hash = (name1 + name2).split('').reduce((a, b) => a + b.charCodeAt(0), 0);
      const percent = Math.floor((hash % 100));
      
      document.getElementById('loveResult').style.display = 'block';
      document.getElementById('lovePercent').textContent = percent + '%';
      
      let text;
      if (percent > 80) text = '天生一对！';
      else if (percent > 60) text = '很有缘分！';
      else if (percent > 40) text = '还需努力！';
      else if (percent > 20) text = '加油哦！';
      else text = '再接再厉！';
      
      document.getElementById('loveText').textContent = `${name1} 和 ${name2} 的缘分指数：${text}`;
    }
  },

  run: function(action, ...args) {
    if (this[action] && typeof this[action].run === 'function') {
      return this[action].run(action, ...args);
    }
    for (const key in this) {
      if (this[key] && typeof this[key].run === 'function' && key !== 'run') {
        if (action.startsWith(key) || key.startsWith(action.split('-')[0])) {
          return this[key].run(action, ...args);
        }
      }
    }
  }
};

// 自动向全局 LifeTools 和 FunTools 导出子工具中的方法与属性
[LifeTools, FunTools].forEach(toolsObj => {
  if (!toolsObj) return;
  Object.keys(toolsObj).forEach(toolKey => {
    const subTool = toolsObj[toolKey];
    if (subTool && typeof subTool === 'object') {
      Object.keys(subTool).forEach(propName => {
        if (propName !== 'render' && propName !== 'run') {
          if (!toolsObj[propName]) {
            if (typeof subTool[propName] === 'function') {
              toolsObj[propName] = function(...args) {
                return subTool[propName].apply(subTool, args);
              };
            } else {
              toolsObj[propName] = subTool[propName];
            }
          }
        }
      });
    }
  });
});
