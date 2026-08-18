// =============================================
// 开发工具实现
// =============================================

const DevTools = {
  loadJsonExample: () => DevTools.loadExample(),
  loadExample: () => {
    const example = {
      "appName": "在线实用工具箱",
      "version": "1.0.0",
      "description": "高效便捷的在线开发者与日常实用工具",
      "author": {
        "name": "DevTeam",
        "email": "dev@example.com"
      },
      "tools": [
        "JSON 格式化与格式转换",
        "LLM / 大模型 Token 统计",
        "二维码生成与下载",
        "文本对比与排版去重"
      ],
      "settings": {
        "theme": "light",
        "fontSize": 14,
        "indentSize": 4,
        "autoSave": true
      },
      "active": true
    };
    const input = document.getElementById('inputText');
    if (input) {
      input.value = JSON.stringify(example, null, 4);
      showToast('已加载示例 JSON', 'info');
      DevTools.run('json-format');
    }
  },

  clearJsonInput: () => DevTools.clearInput(),
  clearInput: () => {
    const input = document.getElementById('inputText');
    const resultText = document.getElementById('resultText');
    const errorSection = document.getElementById('errorSection');
    const jsonTree = document.getElementById('jsonTree');
    const jsonStats = document.getElementById('jsonStats');

    if (input) input.value = '';
    if (resultText) {
      resultText.value = '';
      resultText.style.display = 'block';
    }
    if (jsonTree) {
      jsonTree.innerHTML = '';
      jsonTree.style.display = 'none';
    }
    if (jsonStats) {
      jsonStats.innerHTML = '';
      jsonStats.style.display = 'none';
    }
    if (errorSection) errorSection.style.display = 'none';

    showToast('内容已清空', 'info');
  },

  importJsonFile: () => {
    const fileInput = document.getElementById('jsonFileInput');
    if (fileInput) fileInput.click();
  },

  handleJsonFileImport: (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const input = document.getElementById('inputText');
      if (input) {
        input.value = e.target.result;
        showToast('JSON 文件导入成功', 'success');
        DevTools.run('json-format');
      }
    };
    reader.onerror = () => showToast('文件读取失败', 'error');
    reader.readAsText(file);
    event.target.value = '';
  },

  exportJsonFile: () => {
    const contentEl = document.getElementById('resultText');
    const content = contentEl ? contentEl.value.trim() : '';
    if (!content) {
      showToast('没有可导出的 JSON 结果内容', 'error');
      return;
    }
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted_' + Date.now() + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('文件导出成功', 'success');
  },

  loadSqlExample: () => {
    const exampleSql = `-- 示例 SQL 查询语句
SELECT 
    u.id AS user_id,
    u.username,
    u.email,
    count(o.id) AS total_orders,
    sum(o.amount) AS total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.status = 'active'
    AND u.created_at >= '2024-01-01'
GROUP BY u.id, u.username, u.email
HAVING count(o.id) > 2
ORDER BY total_spent DESC
LIMIT 50;`;
    const input = document.getElementById('inputText');
    if (input) {
      input.value = exampleSql;
      showToast('已加载示例 SQL 语句', 'info');
      DevTools.run('sql-format');
    }
  },

  clearSqlInput: () => {
    const input = document.getElementById('inputText');
    const resultText = document.getElementById('resultText');
    if (input) input.value = '';
    if (resultText) resultText.value = '';
    showToast('内容已清空', 'info');
  },

  importSqlFile: () => {
    const fileInput = document.getElementById('sqlFileInput');
    if (fileInput) fileInput.click();
  },

  handleSqlFileImport: (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const input = document.getElementById('inputText');
      if (input) {
        input.value = e.target.result;
        showToast('SQL 文件导入成功', 'success');
        DevTools.run('sql-format');
      }
    };
    reader.onerror = () => showToast('读取 SQL 文件失败', 'error');
    reader.readAsText(file);
    event.target.value = '';
  },

  exportSqlFile: () => {
    const contentEl = document.getElementById('resultText');
    const content = contentEl ? contentEl.value.trim() : '';
    if (!content) {
      showToast('没有可导出的 SQL 结果', 'error');
      return;
    }
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'query_' + Date.now() + '.sql';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('SQL 文件导出成功', 'success');
  },

  formatSqlText: (sql, options = {}) => {
    if (!sql || !sql.trim()) return '';

    const caseMode = options.caseMode || 'upper';
    let indentStr = '  ';
    if (options.indentMode === '4') indentStr = '    ';
    else if (options.indentMode === 'tab') indentStr = '\t';

    const placeholders = [];
    let cleanSql = sql.replace(/('[^'\\]*(?:\\.[^'\\]*)*'|"[^"\\]*(?:\\.[^"\\]*)*"|--[^\n]*|\/\*[\s\S]*?\*\/)/g, (match) => {
      const idx = placeholders.length;
      placeholders.push(match);
      return `___SQL_TOKEN_${idx}___`;
    });

    const majorClauses = [
      'UNION ALL', 'UNION',
      'LEFT OUTER JOIN', 'RIGHT OUTER JOIN', 'FULL OUTER JOIN',
      'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'FULL JOIN', 'CROSS JOIN', 'JOIN',
      'INSERT INTO', 'DELETE FROM', 'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE',
      'SELECT', 'FROM', 'WHERE', 'GROUP BY', 'HAVING', 'ORDER BY',
      'LIMIT', 'OFFSET', 'VALUES', 'SET', 'UPDATE', 'WITH', 'ON', 'AND', 'OR', 'WHEN', 'ELSE', 'END'
    ];

    const keywords = [
      'SELECT', 'FROM', 'WHERE', 'GROUP', 'BY', 'HAVING', 'ORDER', 'LIMIT', 'OFFSET',
      'JOIN', 'LEFT', 'RIGHT', 'INNER', 'FULL', 'OUTER', 'CROSS', 'ON', 'AS', 'IN', 'IS', 'NOT', 'NULL',
      'AND', 'OR', 'LIKE', 'BETWEEN', 'EXISTS', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE',
      'CREATE', 'TABLE', 'ALTER', 'DROP', 'UNION', 'ALL', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
      'ASC', 'DESC', 'WITH', 'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'DEFAULT', 'CONSTRAINT',
      'DISTINCT', 'COUNT', 'SUM', 'AVG', 'MAX', 'MIN', 'CAST', 'COALESCE', 'OVER', 'PARTITION'
    ];

    const adjustCase = (word) => {
      if (caseMode === 'upper') return word.toUpperCase();
      if (caseMode === 'lower') return word.toLowerCase();
      return word;
    };

    cleanSql = cleanSql.replace(/\s+/g, ' ');

    majorClauses.forEach(clause => {
      const regex = new RegExp(`\\b${clause.replace(/ /g, '\\s+')}\\b`, 'gi');
      cleanSql = cleanSql.replace(regex, (match) => `\n${adjustCase(match)}`);
    });

    if (caseMode !== 'preserve') {
      keywords.forEach(kw => {
        const regex = new RegExp(`\\b${kw}\\b`, 'gi');
        cleanSql = cleanSql.replace(regex, (match) => adjustCase(match));
      });
    }

    const rawLines = cleanSql.split('\n').map(l => l.trim()).filter(Boolean);
    let formattedLines = [];
    let currentIndent = 0;

    const subIndentClauses = ['AND', 'OR', 'WHEN', 'ELSE', 'THEN', 'ON'];

    rawLines.forEach((line) => {
      const upperLine = line.toUpperCase();

      let lineIndent = currentIndent;
      const startsWithSub = subIndentClauses.some(sub => upperLine.startsWith(sub + ' ') || upperLine === sub);
      if (startsWithSub) {
        lineIndent = Math.max(1, currentIndent + 1);
      } else if (upperLine.startsWith('FROM') || upperLine.startsWith('WHERE') || upperLine.startsWith('GROUP BY') || upperLine.startsWith('HAVING') || upperLine.startsWith('ORDER BY') || upperLine.startsWith('LIMIT') || upperLine.startsWith('UNION')) {
        currentIndent = 0;
        lineIndent = 0;
      } else if (upperLine.startsWith('SELECT') || upperLine.startsWith('INSERT') || upperLine.startsWith('UPDATE') || upperLine.startsWith('DELETE') || upperLine.startsWith('CREATE') || upperLine.startsWith('WITH')) {
        currentIndent = 0;
        lineIndent = 0;
      } else if (upperLine.includes('JOIN')) {
        lineIndent = 1;
      }

      formattedLines.push(indentStr.repeat(lineIndent) + line);
    });

    let result = formattedLines.join('\n');
    result = result.replace(/___SQL_TOKEN_(\d+)___/g, (_, idx) => placeholders[parseInt(idx)]);

    return result;
  },

  minifySqlText: (sql) => {
    if (!sql || !sql.trim()) return '';

    const placeholders = [];
    let cleanSql = sql.replace(/('[^'\\]*(?:\\.[^'\\]*)*'|"[^"\\]*(?:\\.[^"\\]*)*")/g, (match) => {
      const idx = placeholders.length;
      placeholders.push(match);
      return `___SQL_TOKEN_${idx}___`;
    });

    cleanSql = cleanSql.replace(/--[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
    cleanSql = cleanSql.replace(/\s+/g, ' ').trim();
    cleanSql = cleanSql.replace(/___SQL_TOKEN_(\d+)___/g, (_, idx) => placeholders[parseInt(idx)]);

    return cleanSql;
  },

  escapeHtml: (str) => {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  },

  runTimestamp: (type) => {
    if (DevTools.timestamp && typeof DevTools.timestamp.runTimestamp === 'function') {
      return DevTools.timestamp.runTimestamp(type);
    }
  },

  rgbToHsl: (r, g, b) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
  },

  rgbToHsv: (r, g, b) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, v = max;
    const d = max - min;
    s = max === 0 ? 0 : d / max;
    if (max === min) {
      h = 0;
    } else {
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(v * 100)];
  },

  regexPresets: {
    phone: {
      name: '手机号码',
      pattern: '^1[3-9]\\d{9}$',
      flags: 'm',
      sample: '13812345678\n19987654321\n12345678901\n15000000000',
      desc: '匹配中国大陆 11 位手机号码（13/14/15/16/17/18/19 开头）'
    },
    email: {
      name: '电子邮箱',
      pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
      flags: 'm',
      sample: 'user.name@domain.com\ntest_123@sub.example.co.cn\ninvalid-email@\nhello@world',
      desc: '标准 Email 格式校验（包含账号、@ 符号、域名及后缀）'
    },
    password: {
      name: '密码强度',
      pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};\':"\\\\|,.<>\\/?]).{8,32}$',
      flags: 'm',
      sample: 'StrongP@ssw0rd2026\nweakpass\n12345678\nNoSymbol123\nAdmin#2026!',
      desc: '强密码强度校验：必须包含大写字母、小写字母、数字及特殊符号，且长度为 8-32 位'
    },
    username: {
      name: '用户名',
      pattern: '^[a-zA-Z0-9_]{3,20}$',
      flags: 'm',
      sample: 'admin_123\ndevUser2026\na#b\nusr\nvalid_user_99\nuser@name',
      desc: '用户名校验：只允许英文字母、数字和下划线，不能含有特殊符号，长度 3-20 位'
    },
    idcard: {
      name: '身份证号码',
      pattern: '^(^[1-9]\\d{5}(18|19|20)\\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$)|(^[1-9]\\d{5}\\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\\d{3}$)$',
      flags: 'm',
      sample: '110101199003072345\n320102800101123\n11010119900229234X\n123456',
      desc: '中国身份证号码：15位旧版及18位新版（含末位校验码 X/x）格式校验'
    },
    url: {
      name: '网址 URL',
      pattern: '^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&\\/\\/=]*)$',
      flags: 'm',
      sample: 'https://www.example.com/path?query=123\nhttp://github.com/aistudio\nftp://files.com\ninvalid_url',
      desc: '网址 URL 格式校验：支持 http 与 https 协议及路径与查询参数'
    },
    ip: {
      name: 'IP 地址',
      pattern: '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
      flags: 'm',
      sample: '192.168.1.1\n10.0.0.255\n256.100.0.1\n127.0.0.1',
      desc: 'IPv4 地址格式校验：0.0.0.0 到 255.255.255.255'
    },
    postal: {
      name: '邮政编码',
      pattern: '^[1-9]\\d{5}$',
      flags: 'm',
      sample: '100000\n200000\n012345\n1000',
      desc: '中国大陆邮政编码校验：6位数字且首位不为 0'
    },
    chinese: {
      name: '中文字符',
      pattern: '[\\u4e00-\\u9fa5]+',
      flags: 'g',
      sample: 'Hello 世界！Welcome 欢迎使用在线正则表达式工具。',
      desc: '匹配连续的汉字中文字符'
    },
    date: {
      name: '日期 YYYY-MM-DD',
      pattern: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$',
      flags: 'm',
      sample: '2026-08-10\n2024-02-29\n2023-13-01\n2026/08/10',
      desc: 'ISO 标准日期格式 YYYY-MM-DD 格式校验'
    },
    number: {
      name: '数值/小数',
      pattern: '^-?\\d+(\\.\\d+)?$',
      flags: 'm',
      sample: '123\n-45.67\n0.001\nabc123',
      desc: '整数或带小数点的正负数值校验'
    }
  },

  copyRegexPresetPattern: (key, event) => {
    if (event) event.stopPropagation();
    const preset = DevTools.regexPresets[key];
    if (!preset) return;
    copyToClipboard(preset.pattern);
    showToast(`已复制 ${preset.name} 正则表达式`, 'success');
  },

  applyRegexPreset: (key) => {
    const preset = DevTools.regexPresets[key];
    if (!preset) return;

    const regexInput = document.getElementById('regexInput');
    const inputText = document.getElementById('inputText');
    if (regexInput) regexInput.value = preset.pattern;
    if (inputText) inputText.value = preset.sample;

    const flags = preset.flags || 'g';
    const flagG = document.getElementById('regexGlobal');
    const flagI = document.getElementById('regexIgnoreCase');
    const flagM = document.getElementById('regexMultiline');
    const flagS = document.getElementById('regexDotAll');

    if (flagG) flagG.checked = flags.includes('g');
    if (flagI) flagI.checked = flags.includes('i');
    if (flagM) flagM.checked = flags.includes('m');
    if (flagS) flagS.checked = flags.includes('s');

    const descEl = document.getElementById('regexPresetDesc');
    if (descEl && preset.desc) {
      descEl.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
          <div>
            <strong>${preset.name}</strong> —— ${preset.desc}
            <div style="margin-top: 4px; font-family: monospace; color: var(--accent); font-weight: 600; font-size: 0.88rem; word-break: break-all;">
              /${preset.pattern}/${preset.flags || ''}
            </div>
          </div>
          <button class="tool-result-btn" onclick="DevTools.copyRegexPresetPattern('${key}', event)" style="font-size: 12px; padding: 4px 10px; display: inline-flex; align-items: center; gap: 4px;">
            ${ICONS.copy} 一键复制该表达式
          </button>
        </div>
      `;
      descEl.style.display = 'block';
    }

    DevTools.testRegex();
    showToast(`已套用预设：${preset.name}`, 'info');
  },

  testRegex: () => {
    const patternEl = document.getElementById('regexInput');
    const textEl = document.getElementById('inputText');
    if (!patternEl || !textEl) return;

    const pattern = patternEl.value;
    const text = textEl.value;

    const isG = document.getElementById('regexGlobal') ? document.getElementById('regexGlobal').checked : true;
    const isI = document.getElementById('regexIgnoreCase') ? document.getElementById('regexIgnoreCase').checked : false;
    const isM = document.getElementById('regexMultiline') ? document.getElementById('regexMultiline').checked : false;
    const isS = document.getElementById('regexDotAll') ? document.getElementById('regexDotAll').checked : false;

    let flags = (isG ? 'g' : '') + (isI ? 'i' : '') + (isM ? 'm' : '') + (isS ? 's' : '');

    const statusEl = document.getElementById('regexStatusBadge');
    const resultsSection = document.getElementById('regexResultsSection');
    const resultsSummary = document.getElementById('regexResultsSummary');
    const matchDetailList = document.getElementById('regexMatchDetailList');
    const highlightBox = document.getElementById('regexHighlightBox');

    if (!pattern) {
      if (statusEl) {
        statusEl.innerHTML = `<span style="color:var(--text-tertiary);">请输入正则表达式进行检测</span>`;
      }
      if (resultsSection) resultsSection.style.display = 'none';
      patternEl.style.borderColor = 'var(--border-color)';
      return;
    }

    let regex;
    try {
      regex = new RegExp(pattern, flags);
      patternEl.style.borderColor = 'var(--success, #10b981)';
      if (statusEl) {
        statusEl.innerHTML = `<span style="color: var(--success, #10b981); font-weight: 600;">✅ 正则表达式语法正确  <code style="background:var(--bg-secondary); padding:2px 6px; border-radius:4px; font-size:12px; font-family:monospace;">/${pattern}/${flags}</code></span>`;
      }
    } catch (e) {
      patternEl.style.borderColor = '#ef4444';
      if (statusEl) {
        statusEl.innerHTML = `<span style="color: #ef4444; font-weight: 600;">❌ 语法错误: ${DevTools.escapeHtml(e.message)}</span>`;
      }
      if (resultsSection) resultsSection.style.display = 'block';
      if (resultsSummary) resultsSummary.innerHTML = `<span style="color: #ef4444;">语法校验失败，请检查语法结构（例如未闭合的括号或非法字符）。</span>`;
      if (matchDetailList) matchDetailList.innerHTML = '';
      if (highlightBox) highlightBox.innerHTML = DevTools.escapeHtml(text).replace(/\n/g, '<br>');
      return;
    }

    if (resultsSection) resultsSection.style.display = 'block';

    if (!text) {
      if (resultsSummary) resultsSummary.innerHTML = `<span style="color:var(--text-tertiary);">请输入待测试文本查看匹配情况</span>`;
      if (matchDetailList) matchDetailList.innerHTML = '';
      if (highlightBox) highlightBox.innerHTML = '';
      return;
    }

    // 执行匹配
    let matches = [];
    try {
      if (flags.includes('g')) {
        matches = [...text.matchAll(regex)];
      } else {
        const m = regex.exec(text);
        if (m) matches = [m];
      }
    } catch (err) {
      if (resultsSummary) resultsSummary.innerHTML = `<span style="color: #ef4444;">匹配异常: ${DevTools.escapeHtml(err.message)}</span>`;
      return;
    }

    if (matches.length === 0) {
      if (resultsSummary) {
        resultsSummary.innerHTML = `<span style="color: #f59e0b; font-weight: 500;">未检测到匹配项（找到 0 个匹配）</span>`;
      }
      if (matchDetailList) matchDetailList.innerHTML = `<div style="padding: 1rem; color: var(--text-tertiary); font-size: 0.9rem;">未查找到符合该正则表达式的字符序列</div>`;
      if (highlightBox) highlightBox.innerHTML = DevTools.escapeHtml(text).replace(/\n/g, '<br>');
      return;
    }

    if (resultsSummary) {
      resultsSummary.innerHTML = `<span style="color: var(--success, #10b981); font-weight: 600;">共找到 ${matches.length} 个匹配项</span>`;
    }

    // 渲染匹配高亮 preview
    let highlightHtml = '';
    let lastIndex = 0;

    matches.forEach((m, idx) => {
      const matchText = m[0];
      const matchIndex = m.index;

      if (matchIndex >= lastIndex) {
        highlightHtml += DevTools.escapeHtml(text.slice(lastIndex, matchIndex));
        highlightHtml += `<mark style="background: rgba(99, 102, 241, 0.25); color: var(--accent, #6366f1); border-bottom: 2px solid var(--accent, #6366f1); padding: 1px 3px; border-radius: 3px; font-weight: bold;" title="匹配 #${idx + 1} (位置: ${matchIndex})">${DevTools.escapeHtml(matchText)}</mark>`;
        lastIndex = matchIndex + (matchText.length || 1);
      }
    });
    if (lastIndex < text.length) {
      highlightHtml += DevTools.escapeHtml(text.slice(lastIndex));
    }

    if (highlightBox) {
      highlightBox.innerHTML = highlightHtml.replace(/\n/g, '<br>');
    }

    // 渲染匹配明细与捕获组
    if (matchDetailList) {
      const detailItems = matches.map((m, i) => {
        const matchStr = m[0];
        const startIndex = m.index;
        const endIndex = startIndex + matchStr.length;
        const groups = m.slice(1);

        let groupHtml = '';
        if (groups.length > 0) {
          groupHtml = `<div style="margin-top: 6px; font-size: 0.85rem; color: var(--text-secondary);">
            <strong>捕获组 (Capture Groups):</strong>
            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 4px;">
              ${groups.map((g, gi) => `
                <span style="background: var(--bg-secondary); border: 1px solid var(--border-color); padding: 2px 8px; border-radius: 4px; font-family: monospace;">
                  $${gi + 1}: <span style="color: var(--accent); font-weight: 600;">${g !== undefined ? DevTools.escapeHtml(g) : '<em>undefined</em>'}</span>
                </span>
              `).join('')}
            </div>
          </div>`;
        }

        return `
          <div style="padding: 10px 14px; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; margin-bottom: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
              <div>
                <span style="display: inline-block; background: var(--accent); color: #fff; border-radius: 12px; padding: 2px 8px; font-size: 0.75rem; font-weight: bold; margin-right: 8px;">匹配 #${i + 1}</span>
                <code style="font-size: 0.95rem; font-weight: 600; color: var(--text-primary); background: var(--card-bg); padding: 2px 6px; border-radius: 4px; font-family: monospace;">${DevTools.escapeHtml(matchStr)}</code>
              </div>
              <span style="font-size: 0.8rem; color: var(--text-tertiary);">索引位置: ${startIndex} - ${endIndex} (${matchStr.length} 字符)</span>
            </div>
            ${groupHtml}
          </div>
        `;
      }).join('');

      matchDetailList.innerHTML = detailItems;
    }
  },

  copyRegexPattern: () => {
    const pattern = document.getElementById('regexInput') ? document.getElementById('regexInput').value : '';
    const isG = document.getElementById('regexGlobal') ? document.getElementById('regexGlobal').checked : true;
    const isI = document.getElementById('regexIgnoreCase') ? document.getElementById('regexIgnoreCase').checked : false;
    const isM = document.getElementById('regexMultiline') ? document.getElementById('regexMultiline').checked : false;
    const isS = document.getElementById('regexDotAll') ? document.getElementById('regexDotAll').checked : false;

    const flags = (isG ? 'g' : '') + (isI ? 'i' : '') + (isM ? 'm' : '') + (isS ? 's' : '');
    const fullRegex = `/${pattern}/${flags}`;

    copyToClipboard(fullRegex);
    showToast(`已复制正则表达式: ${fullRegex}`, 'success');
  },

  sortObjectKeys: (obj) => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(DevTools.sortObjectKeys);
    return Object.keys(obj).sort().reduce((result, key) => {
      result[key] = DevTools.sortObjectKeys(obj[key]);
      return result;
    }, {});
  },

  getJsonErrorLine: (input, message) => {
    const match = message.match(/position (\d+)/);
    if (match) {
      const pos = parseInt(match[1]);
      const lines = input.substring(0, pos).split('\n');
      return {
        line: lines.length,
        column: lines[lines.length - 1].length + 1
      };
    }
    return null;
  },

  renderJsonTree: (obj, level = 0) => {
    const indent = '  '.repeat(level);
    if (obj === null) return `<span class="json-null">null</span>`;
    if (typeof obj === 'string') return `<span class="json-string">"${obj}"</span>`;
    if (typeof obj === 'number') return `<span class="json-number">${obj}</span>`;
    if (typeof obj === 'boolean') return `<span class="json-boolean">${obj}</span>`;
    
    if (Array.isArray(obj)) {
      if (obj.length === 0) return '[]';
      const items = obj.map((item, i) => 
        `<div class="json-tree-item">${indent}  <span class="json-index">[${i}]</span>: ${DevTools.renderJsonTree(item, level + 1)}</div>`
      ).join('');
      return `<div class="json-tree-array">[\n${items}\n${indent}]</div>`;
    }
    
    if (typeof obj === 'object') {
      const keys = Object.keys(obj);
      if (keys.length === 0) return '{}';
      const items = keys.map(key => 
        `<div class="json-tree-item">${indent}  <span class="json-key">"${key}"</span>: ${DevTools.renderJsonTree(obj[key], level + 1)}</div>`
      ).join('');
      return `<div class="json-tree-object">{\n${items}\n${indent}}</div>`;
    }
    return String(obj);
  },

  jsonToCsv: (obj) => {
    if (!Array.isArray(obj) || obj.length === 0) {
      return '错误：JSON 必须是非空对象数组 (Array of Objects)';
    }
    const headers = Object.keys(obj[0]);
    const rows = obj.map(item => 
      headers.map(h => {
        const val = item[h];
        if (val === null || val === undefined) return '';
        if (typeof val === 'string' && val.includes(',')) return `"${val}"`;
        return String(val);
      }).join(',')
    );
    return [headers.join(','), ...rows].join('\n');
  },

  jsonToXml: (obj, rootName = 'root') => {
    const toXml = (obj, name) => {
      if (obj === null || obj === undefined) return `<${name}/>`;
      if (typeof obj !== 'object') return `<${name}>${obj}</${name}>`;
      if (Array.isArray(obj)) {
        return obj.map(item => toXml(item, name)).join('\n');
      }
      const children = Object.keys(obj).map(key => toXml(obj[key], key)).join('\n');
      return `<${name}>\n${children}\n</${name}>`;
    };
    return `<?xml version="1.0" encoding="UTF-8"?>\n${toXml(obj, rootName)}`;
  },

  analyzeJsonStats: (obj) => {
    const stats = {
      objects: 0,
      arrays: 0,
      strings: 0,
      numbers: 0,
      booleans: 0,
      nulls: 0,
      totalKeys: 0,
      maxDepth: 0
    };
    
    const countStats = (item, depth = 0) => {
      if (depth > stats.maxDepth) stats.maxDepth = depth;
      
      if (item === null) {
        stats.nulls++;
      } else if (Array.isArray(item)) {
        stats.arrays++;
        item.forEach(child => countStats(child, depth + 1));
      } else if (typeof item === 'object') {
        stats.objects++;
        stats.totalKeys += Object.keys(item).length;
        Object.values(item).forEach(child => countStats(child, depth + 1));
      } else if (typeof item === 'string') {
        stats.strings++;
      } else if (typeof item === 'number') {
        stats.numbers++;
      } else if (typeof item === 'boolean') {
        stats.booleans++;
      }
    };
    
    countStats(obj);
    
    return `
      <div class="json-stats-content">
        <h4 style="margin-bottom: 12px; color: var(--text-primary);">JSON 结构统计分析</h4>
        <div class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px;">
          <div class="stat-card" style="background: var(--bg-secondary); padding: 12px; border-radius: 8px; text-align: center;">
            <div class="stat-value" style="font-size: 24px; font-weight: bold; color: #6366f1;">${stats.objects}</div>
            <div class="stat-label" style="font-size: 12px; color: var(--text-secondary);">对象</div>
          </div>
          <div class="stat-card" style="background: var(--bg-secondary); padding: 12px; border-radius: 8px; text-align: center;">
            <div class="stat-value" style="font-size: 24px; font-weight: bold; color: #8b5cf6;">${stats.arrays}</div>
            <div class="stat-label" style="font-size: 12px; color: var(--text-secondary);">数组</div>
          </div>
          <div class="stat-card" style="background: var(--bg-secondary); padding: 12px; border-radius: 8px; text-align: center;">
            <div class="stat-value" style="font-size: 24px; font-weight: bold; color: #10b981;">${stats.strings}</div>
            <div class="stat-label" style="font-size: 12px; color: var(--text-secondary);">字符串</div>
          </div>
          <div class="stat-card" style="background: var(--bg-secondary); padding: 12px; border-radius: 8px; text-align: center;">
            <div class="stat-value" style="font-size: 24px; font-weight: bold; color: #f59e0b;">${stats.numbers}</div>
            <div class="stat-label" style="font-size: 12px; color: var(--text-secondary);">数字</div>
          </div>
          <div class="stat-card" style="background: var(--bg-secondary); padding: 12px; border-radius: 8px; text-align: center;">
            <div class="stat-value" style="font-size: 24px; font-weight: bold; color: #3b82f6;">${stats.booleans}</div>
            <div class="stat-label" style="font-size: 12px; color: var(--text-secondary);">布尔值</div>
          </div>
          <div class="stat-card" style="background: var(--bg-secondary); padding: 12px; border-radius: 8px; text-align: center;">
            <div class="stat-value" style="font-size: 24px; font-weight: bold; color: #ef4444;">${stats.nulls}</div>
            <div class="stat-label" style="font-size: 12px; color: var(--text-secondary);">Null</div>
          </div>
          <div class="stat-card" style="background: var(--bg-secondary); padding: 12px; border-radius: 8px; text-align: center;">
            <div class="stat-value" style="font-size: 24px; font-weight: bold; color: #6366f1;">${stats.totalKeys}</div>
            <div class="stat-label" style="font-size: 12px; color: var(--text-secondary);">总键数</div>
          </div>
          <div class="stat-card" style="background: var(--bg-secondary); padding: 12px; border-radius: 8px; text-align: center;">
            <div class="stat-value" style="font-size: 24px; font-weight: bold; color: #8b5cf6;">${stats.maxDepth}</div>
            <div class="stat-label" style="font-size: 12px; color: var(--text-secondary);">最大深度</div>
          </div>
        </div>
      </div>
    `;
  },

  // JSON格式化（增强版）
  'json-format': {
    name: 'JSON格式化',
    render: () => `
      <div class="tool-section">
        <label class="tool-section-label">输入 JSON</label>
        <textarea id="inputText" class="tool-textarea" placeholder='{"name": "张三", "age": 25, "items": ["a", "b"]}' style="min-height:260px; font-family: monospace; line-height: 1.5;"></textarea>
        <div class="tool-actions" style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap;">
          <button class="tool-page-btn" onclick="DevTools.loadJsonExample()" style="font-size:12px;padding:6px 12px;">
            ${ICONS.play} 加载示例
          </button>
          <button class="tool-page-btn" onclick="DevTools.clearJsonInput()" style="font-size:12px;padding:6px 12px;">
            ${ICONS.copy} 清空
          </button>
          <button class="tool-page-btn" onclick="DevTools.importJsonFile()" style="font-size:12px;padding:6px 12px;">
            ${ICONS.copy} 导入文件
          </button>
          <input type="file" id="jsonFileInput" accept=".json" style="display:none;" onchange="DevTools.handleJsonFileImport(event)">
        </div>
      </div>
      <div class="tool-options">
        <div class="tool-option">
          <label>缩进：</label>
          <select id="indentSize" class="tool-input" style="width:80px;">
            <option value="2">2空格</option>
            <option value="4" selected>4空格</option>
            <option value="tab">Tab</option>
          </select>
        </div>
        <div class="tool-option">
          <label style="cursor:pointer; display:flex; align-items:center; gap:4px;">
            <input type="checkbox" id="sortKeys"> 排序键
          </label>
        </div>
        <button class="tool-page-btn primary" onclick="DevTools.run('json-format')">
          ${ICONS.play} 格式化
        </button>
        <button class="tool-page-btn" onclick="DevTools.run('json-minify')">
          ${ICONS.play} 压缩
        </button>
        <button class="tool-page-btn" onclick="DevTools.run('json-tree')">
          ${ICONS.play} 树形视图
        </button>
        <button class="tool-page-btn" onclick="DevTools.run('json-stats')">
          ${ICONS.play} 统计分析
        </button>
      </div>
      <div class="tool-section">
        <label class="tool-section-label">格式化 / 转换结果</label>
        <div class="tool-result">
          <textarea id="resultText" class="tool-textarea tool-result-textarea" readonly placeholder="格式化或转换后的 JSON 结果将在此处显示..." style="min-height:360px; font-family: monospace; line-height: 1.5;"></textarea>
          <div id="jsonTree" class="json-tree" style="display:none; padding:1rem; background:var(--input-bg); border:1px solid var(--border-color); border-radius:8px; min-height:360px; overflow:auto; font-family:monospace;"></div>
          <div id="jsonStats" class="json-stats" style="display:none; padding:1rem; background:var(--input-bg); border:1px solid var(--border-color); border-radius:8px; min-height:280px;"></div>
          <div class="tool-result-actions" style="margin-top:10px; display:flex; gap:8px; flex-wrap:wrap;">
            <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('resultText').value)">
              ${ICONS.copy} 复制结果
            </button>
            <button class="tool-result-btn" onclick="DevTools.exportJsonFile()">
              ${ICONS.copy} 导出文件
            </button>
            <button class="tool-result-btn" onclick="DevTools.run('json-to-csv')">
              ${ICONS.play} 转 CSV
            </button>
            <button class="tool-result-btn" onclick="DevTools.run('json-to-xml')">
              ${ICONS.play} 转 XML
            </button>
          </div>
        </div>
      </div>
      <div class="tool-section" id="errorSection" style="display:none;">
        <div class="empty-state" id="errorResult" style="padding: 1rem;"></div>
      </div>
    `,
    run: (type) => {
      const input = document.getElementById('inputText').value.trim();
      const errorSection = document.getElementById('errorSection');
      const errorResult = document.getElementById('errorResult');
      const resultText = document.getElementById('resultText');
      const jsonTree = document.getElementById('jsonTree');
      const jsonStats = document.getElementById('jsonStats');
      
      errorSection.style.display = 'none';
      resultText.style.display = 'block';
      jsonTree.style.display = 'none';
      jsonStats.style.display = 'none';
      
      if (!input) {
        showToast('请输入 JSON 内容', 'error');
        return;
      }
      
      try {
        const parsed = JSON.parse(input);
        
        switch (type) {
          case 'json-format': {
            const indentSize = document.getElementById('indentSize').value;
            const sortKeys = document.getElementById('sortKeys').checked;
            const indent = indentSize === 'tab' ? '\t' : parseInt(indentSize);
            
            let result;
            if (sortKeys) {
              const sorted = DevTools.sortObjectKeys(parsed);
              result = JSON.stringify(sorted, null, indent);
            } else {
              result = JSON.stringify(parsed, null, indent);
            }
            resultText.value = result;
            break;
          }
          case 'json-minify':
            resultText.value = JSON.stringify(parsed);
            break;
          case 'json-tree':
            resultText.style.display = 'none';
            jsonTree.style.display = 'block';
            jsonTree.innerHTML = DevTools.renderJsonTree(parsed);
            break;
          case 'json-stats':
            resultText.style.display = 'none';
            jsonStats.style.display = 'block';
            jsonStats.innerHTML = DevTools.analyzeJsonStats(parsed);
            break;
          case 'json-to-csv':
            resultText.value = DevTools.jsonToCsv(parsed);
            break;
          case 'json-to-xml':
            resultText.value = DevTools.jsonToXml(parsed);
            break;
        }
      } catch (e) {
        errorSection.style.display = 'block';
        resultText.style.display = 'none';
        const lineInfo = DevTools.getJsonErrorLine(input, e.message);
        errorResult.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" width="48" height="48">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <h3 style="color: #ef4444; margin-top:8px;">JSON 格式错误</h3>
          <p style="color: #666; margin-top:4px;">${e.message}</p>
          ${lineInfo ? `<p style="color: #999; font-size: 12px; margin-top:4px;">错误位置：第 ${lineInfo.line} 行，第 ${lineInfo.column} 列</p>` : ''}
        `;
      }
    }
  },
  
  // JSON验证
  'json-validate': {
    name: 'JSON验证',
    render: () => `
      <div class="tool-section">
        <label class="tool-section-label">输入JSON</label>
        <textarea id="inputText" class="tool-textarea" placeholder='{"key": "value"}'></textarea>
      </div>
      <div class="tool-options">
        <button class="tool-page-btn primary" onclick="DevTools.run('json-validate')">
          ${ICONS.play} 验证
        </button>
      </div>
      <div class="tool-section" id="resultSection" style="display:none;">
        <div class="empty-state" id="validateResult" style="padding: 1rem;"></div>
      </div>
    `,
    run: () => {
      const input = document.getElementById('inputText').value;
      const resultEl = document.getElementById('resultSection');
      const validateEl = document.getElementById('validateResult');
      
      resultEl.style.display = 'block';
      try {
        JSON.parse(input);
        validateEl.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" width="48" height="48">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <h3 style="color: #10b981;">JSON格式有效</h3>
        `;
      } catch (e) {
        validateEl.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" width="48" height="48">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          <h3 style="color: #ef4444;">JSON格式错误</h3>
          <p>${e.message}</p>
        `;
      }
    }
  },
  
  // JSON转TypeScript
  'json-to-ts': {
    name: 'JSON转TypeScript',
    render: () => `
      <div class="tool-section">
        <label class="tool-section-label">输入JSON</label>
        <textarea id="inputText" class="tool-textarea" placeholder='{"name": "张三", "age": 25, "items": ["a", "b"]}'></textarea>
      </div>
      <div class="tool-options">
        <div class="tool-option">
          <label>根类型名：</label>
          <input type="text" id="rootName" class="tool-input" value="Root" style="width:100px;">
        </div>
        <button class="tool-page-btn primary" onclick="DevTools.run('json-to-ts')">
          ${ICONS.play} 转换
        </button>
      </div>
      <div class="tool-section">
        <label class="tool-section-label">TypeScript类型</label>
        <div class="tool-result">
          <textarea id="resultText" class="tool-textarea tool-result-textarea" readonly></textarea>
          <div class="tool-result-actions">
            <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('resultText').value)">
              ${ICONS.copy} 复制
            </button>
          </div>
        </div>
      </div>
    `,
    run: () => {
      const input = document.getElementById('inputText').value;
      const rootName = document.getElementById('rootName').value || 'Root';
      
      try {
        const json = JSON.parse(input);
        const types = [];
        const usedNames = new Set();
        
        const getTypeName = (value, name) => {
          if (value === null) return 'null';
          if (Array.isArray(value)) {
            if (value.length === 0) return 'any[]';
            const itemType = getTypeName(value[0], name + 'Item');
            return `${itemType}[]`;
          }
          switch (typeof value) {
            case 'string': return 'string';
            case 'number': return Number.isInteger(value) ? 'number' : 'number';
            case 'boolean': return 'boolean';
            case 'object': {
              const typeName = name.charAt(0).toUpperCase() + name.slice(1);
              generateInterface(value, typeName);
              return typeName;
            }
            default: return 'any';
          }
        };
        
        const generateInterface = (obj, name) => {
          if (usedNames.has(name)) return;
          usedNames.add(name);
          
          const props = Object.keys(obj).map(key => {
            const value = obj[key];
            const type = getTypeName(value, key);
            const optional = value === null ? '?' : '';
            const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
            return `  ${safeKey}${optional}: ${type};`;
          }).join('\n');
          
          types.push(`interface ${name} {\n${props}\n}`);
        };
        
        generateInterface(json, rootName);
        document.getElementById('resultText').value = types.join('\n\n');
      } catch (e) {
        showToast('无效的JSON格式', 'error');
      }
    }
  },
  
  // XML格式化
  'xml-format': {
    name: 'XML格式化',
    render: () => `
      <div class="tool-section">
        <label class="tool-section-label">输入XML</label>
        <textarea id="inputText" class="tool-textarea" placeholder="<root><item>value</item></root>"></textarea>
      </div>
      <div class="tool-options">
        <button class="tool-page-btn primary" onclick="DevTools.run('xml-format')">
          ${ICONS.play} 格式化
        </button>
        <button class="tool-page-btn" onclick="DevTools.run('xml-minify')">
          ${ICONS.play} 压缩
        </button>
      </div>
      <div class="tool-section">
        <label class="tool-section-label">结果</label>
        <div class="tool-result">
          <textarea id="resultText" class="tool-textarea tool-result-textarea" readonly></textarea>
          <div class="tool-result-actions">
            <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('resultText').value)">
              ${ICONS.copy} 复制
            </button>
          </div>
        </div>
      </div>
    `,
    run: (type) => {
      const input = document.getElementById('inputText').value;
      try {
        if (type === 'xml-format') {
          let formatted = '';
          let indent = 0;
          input.replace(/>\s*</g, '><').split(/(<[^>]+>)/g).forEach(node => {
            if (!node.trim()) return;
            if (node.match(/^<\/\w/)) indent--;
            formatted += '  '.repeat(Math.max(0, indent)) + node.trim() + '\n';
            if (node.match(/^<\w[^>]*[^\/]>$/)) indent++;
          });
          document.getElementById('resultText').value = formatted.trim();
        } else {
          document.getElementById('resultText').value = input.replace(/>\s+</g, '><').trim();
        }
      } catch (e) {
        showToast('无效的XML格式', 'error');
      }
    }
  },
  
  // SQL格式化
  'sql-format': {
    name: 'SQL格式化',
    render: () => `
      <div class="tool-section">
        <label class="tool-section-label">输入 SQL 语句</label>
        <textarea id="inputText" class="tool-textarea" placeholder="SELECT u.id, u.username, count(o.id) as total_orders FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.status = 'active' GROUP BY u.id, u.username HAVING count(o.id) > 5 ORDER BY total_orders DESC LIMIT 20;" style="min-height: 240px; font-family: monospace; line-height: 1.5;"></textarea>
        <div class="tool-actions" style="margin-top: 8px; display: flex; gap: 8px; flex-wrap: wrap;">
          <button class="tool-page-btn" onclick="DevTools.loadSqlExample()" style="font-size:12px; padding:6px 12px;">
            ${ICONS.play} 加载示例
          </button>
          <button class="tool-page-btn" onclick="DevTools.importSqlFile()" style="font-size:12px; padding:6px 12px;">
            ${ICONS.copy} 导入 SQL 文件
          </button>
          <input type="file" id="sqlFileInput" accept=".sql,.txt" style="display:none;" onchange="DevTools.handleSqlFileImport(event)">
          <button class="tool-page-btn" onclick="DevTools.clearSqlInput()" style="font-size:12px; padding:6px 12px;">
            清空
          </button>
        </div>
      </div>

      <div class="tool-options" style="flex-wrap: wrap; gap: 1rem; align-items: center; margin-bottom: 1rem;">
        <div class="tool-option">
          <label style="font-weight: 500; font-size: 0.9rem;">关键字风格：</label>
          <select id="sqlKeywordCase" class="tool-select" style="width: 140px;">
            <option value="upper" selected>大写 (UPPERCASE)</option>
            <option value="lower">小写 (lowercase)</option>
            <option value="preserve">保持原样</option>
          </select>
        </div>

        <div class="tool-option">
          <label style="font-weight: 500; font-size: 0.9rem;">缩进：</label>
          <select id="sqlIndent" class="tool-select" style="width: 100px;">
            <option value="2" selected>2 空格</option>
            <option value="4">4 空格</option>
            <option value="tab">Tab</option>
          </select>
        </div>

        <button class="tool-page-btn primary" onclick="DevTools.run('sql-format')">
          ${ICONS.play} 格式化 SQL
        </button>
        <button class="tool-page-btn" onclick="DevTools.run('sql-minify')">
          ${ICONS.play} 压缩 SQL (单行)
        </button>
      </div>

      <div class="tool-section">
        <label class="tool-section-label">格式化 / 处理结果</label>
        <div class="tool-result">
          <textarea id="resultText" class="tool-textarea tool-result-textarea" readonly placeholder="格式化或压缩后的 SQL 结果将在此处显示..." style="min-height: 340px; font-family: monospace; line-height: 1.5;"></textarea>
          <div class="tool-result-actions" style="margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('resultText').value)">
              ${ICONS.copy} 复制结果
            </button>
            <button class="tool-result-btn" onclick="DevTools.exportSqlFile()">
              ${ICONS.copy} 导出 SQL 文件
            </button>
          </div>
        </div>
      </div>
    `,
    run: (actionType) => {
      const inputEl = document.getElementById('inputText');
      const input = inputEl ? inputEl.value : '';
      if (!input.trim()) {
        showToast('请输入 SQL 语句', 'error');
        return;
      }

      if (actionType === 'sql-minify') {
        const minified = DevTools.minifySqlText(input);
        document.getElementById('resultText').value = minified;
        showToast('SQL 已压缩为单行', 'success');
        return;
      }

      const caseMode = document.getElementById('sqlKeywordCase') ? document.getElementById('sqlKeywordCase').value : 'upper';
      const indentMode = document.getElementById('sqlIndent') ? document.getElementById('sqlIndent').value : '2';

      const formatted = DevTools.formatSqlText(input, { caseMode, indentMode });
      document.getElementById('resultText').value = formatted;
      showToast('SQL 格式化成功', 'success');
    }
  },
  
  // 正则表达式
  'regex-tester': {
    name: '正则表达式',
    render: () => `
      <!-- 预设常规正则表达式快捷选择 -->
      <div class="tool-section" style="margin-bottom: 1.25rem;">
        <label class="tool-section-label" style="display: flex; justify-content: space-between; align-items: center;">
          <span>内置常规正则表达式预设</span>
          <span style="font-size: 0.8rem; color: var(--text-tertiary); font-weight: normal;">点击名称可套用测试，点击“复制”可一键提取表达式</span>
        </label>
        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px;">
          ${[
            { key: 'phone', icon: '📱', name: '手机号码' },
            { key: 'email', icon: '✉️', name: '电子邮箱' },
            { key: 'password', icon: '🔒', name: '密码强度' },
            { key: 'username', icon: '👤', name: '用户名' },
            { key: 'idcard', icon: '🪪', name: '身份证号码' },
            { key: 'url', icon: '🌐', name: '网址 URL' },
            { key: 'ip', icon: '💻', name: 'IP 地址' },
            { key: 'postal', icon: '📮', name: '邮政编码' },
            { key: 'chinese', icon: '🈲', name: '中文字符' },
            { key: 'date', icon: '📅', name: '日期 YYYY-MM-DD' },
            { key: 'number', icon: '🔢', name: '纯数字/数值' }
          ].map(p => `
            <div style="display: inline-flex; align-items: center; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 6px; overflow: hidden; font-size: 12px;">
              <button onclick="DevTools.applyRegexPreset('${p.key}')" style="background: transparent; border: none; padding: 5px 10px; cursor: pointer; color: var(--text-primary); font-size: 12px; display: flex; align-items: center; gap: 4px;" title="点击套用 ${p.name} 预设与测试数据">
                ${p.icon} ${p.name}
              </button>
              <button onclick="DevTools.copyRegexPresetPattern('${p.key}', event)" style="background: var(--card-bg); border: none; border-left: 1px solid var(--border-color); padding: 5px 8px; cursor: pointer; color: var(--accent); font-size: 11px; display: flex; align-items: center; gap: 2px;" title="一键复制 ${p.name} 正则表达式">
                ${ICONS.copy} 复制
              </button>
            </div>
          `).join('')}
        </div>
        <div id="regexPresetDesc" style="display:none; margin-top: 10px; padding: 10px 14px; background: var(--bg-secondary); border-left: 3px solid var(--accent); border-radius: 6px; font-size: 0.85rem; color: var(--text-secondary);"></div>
      </div>

      <!-- 正则表达式输入与标志说明 -->
      <div class="tool-section">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <label class="tool-section-label" style="margin-bottom:0;">正则表达式 (Regular Expression Pattern)</label>
          <div id="regexStatusBadge" style="font-size: 0.85rem;"></div>
        </div>
        <div style="display: flex; gap: 8px; align-items: center;">
          <span style="font-size: 1.2rem; font-family: monospace; color: var(--text-tertiary); font-weight: bold;">/</span>
          <input type="text" id="regexInput" class="tool-input" placeholder="输入正则表达式，例如：^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$" style="flex:1; font-family: monospace; font-size: 1rem;" oninput="DevTools.testRegex()">
          <span style="font-size: 1.2rem; font-family: monospace; color: var(--text-tertiary); font-weight: bold;">/</span>
        </div>
      </div>

      <!-- 修饰符 Flags 选框 -->
      <div class="tool-options" style="flex-wrap: wrap; gap: 1rem; align-items: center; margin-bottom: 1.25rem;">
        <div class="tool-option" style="display:flex; align-items:center; gap:4px; cursor:pointer;">
          <input type="checkbox" id="regexGlobal" checked onchange="DevTools.testRegex()">
          <label for="regexGlobal" style="cursor:pointer;" title="g: 全局查找匹配项">全局匹配 (g)</label>
        </div>
        <div class="tool-option" style="display:flex; align-items:center; gap:4px; cursor:pointer;">
          <input type="checkbox" id="regexIgnoreCase" onchange="DevTools.testRegex()">
          <label for="regexIgnoreCase" style="cursor:pointer;" title="i: 不区分英文字母大小写">忽略大小写 (i)</label>
        </div>
        <div class="tool-option" style="display:flex; align-items:center; gap:4px; cursor:pointer;">
          <input type="checkbox" id="regexMultiline" onchange="DevTools.testRegex()">
          <label for="regexMultiline" style="cursor:pointer;" title="m: ^ 和 $ 匹配每一行的开头和结尾">多行模式 (m)</label>
        </div>
        <div class="tool-option" style="display:flex; align-items:center; gap:4px; cursor:pointer;">
          <input type="checkbox" id="regexDotAll" onchange="DevTools.testRegex()">
          <label for="regexDotAll" style="cursor:pointer;" title="s: . 可匹配换行符 \n">单行点全匹配 (s)</label>
        </div>

        <div style="margin-left: auto; display: flex; gap: 8px;">
          <button class="tool-page-btn primary" onclick="DevTools.testRegex()">
            ${ICONS.play} 执行测试
          </button>
          <button class="tool-page-btn" onclick="DevTools.copyRegexPattern()">
            ${ICONS.copy} 复制正则模式
          </button>
        </div>
      </div>

      <!-- 测试文本输入与结果面板 -->
      <div class="tool-section">
        <label class="tool-section-label">待测试字符串内容</label>
        <textarea id="inputText" class="tool-textarea" placeholder="在此输入需要进行正则表达式比对测试的文本内容（可以多行）..." style="min-height: 140px; font-family: monospace; line-height: 1.5;" oninput="DevTools.testRegex()"></textarea>
      </div>

      <!-- 匹配结果及实时高亮视图 -->
      <div class="tool-section" id="regexResultsSection" style="display:none;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <label class="tool-section-label" style="margin-bottom: 0;">测试匹配分析结果</label>
          <div id="regexResultsSummary" style="font-size: 0.85rem;"></div>
        </div>

        <!-- 文本匹配可视化高亮面板 -->
        <div style="margin-bottom: 1rem;">
          <div style="font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 4px;">匹配文本高亮标识预览：</div>
          <div id="regexHighlightBox" style="padding: 12px; background: var(--input-bg, var(--bg-secondary)); border: 1px solid var(--border-color); border-radius: 8px; min-height: 60px; font-family: monospace; line-height: 1.6; word-break: break-all; white-space: pre-wrap;"></div>
        </div>

        <!-- 匹配明细列表与捕获组 -->
        <div>
          <div style="font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 6px;">匹配数据详细列表 (Match Details & Capture Groups)：</div>
          <div id="regexMatchDetailList"></div>
        </div>
      </div>

      <!-- 正则表达式如何使用与书写指南 -->
      <div class="tool-section" style="margin-top: 2rem; border-top: 1px dashed var(--border-color); padding-top: 1.25rem;">
        <details style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 12px 16px;">
          <summary style="font-weight: 600; cursor: pointer; color: var(--text-primary); font-size: 0.95rem;">
            📖 如何书写与正确使用正则表达式（常用语法速查指南）
          </summary>
          <div style="margin-top: 12px; font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px;">
              <div style="background: var(--card-bg); padding: 12px; border-radius: 6px; border: 1px solid var(--border-color);">
                <h5 style="color: var(--text-primary); margin-bottom: 6px; font-size: 0.9rem;">1. 字符匹配与定位符</h5>
                <ul style="list-style: none; padding: 0; margin: 0; font-family: monospace;">
                  <li><b style="color:var(--accent);">.</b> : 匹配除换行外的任意字符</li>
                  <li><b style="color:var(--accent);">\d</b> : 匹配任意数字 [0-9]</li>
                  <li><b style="color:var(--accent);">\D</b> : 匹配非数字字符 [^0-9]</li>
                  <li><b style="color:var(--accent);">\w</b> : 匹配字母/数字/下划线 [a-zA-Z0-9_]</li>
                  <li><b style="color:var(--accent);">\s</b> : 匹配空白字符 (空格/Tab/换行)</li>
                  <li><b style="color:var(--accent);">^</b> : 匹配字符串或行的开头</li>
                  <li><b style="color:var(--accent);">$</b> : 匹配字符串或行的结尾</li>
                  <li><b style="color:var(--accent);">\b</b> : 匹配单词边界</li>
                </ul>
              </div>

              <div style="background: var(--card-bg); padding: 12px; border-radius: 6px; border: 1px solid var(--border-color);">
                <h5 style="color: var(--text-primary); margin-bottom: 6px; font-size: 0.9rem;">2. 量词与重复次数</h5>
                <ul style="list-style: none; padding: 0; margin: 0; font-family: monospace;">
                  <li><b style="color:var(--accent);">*</b> : 重复 0 次或多次 ({0,})</li>
                  <li><b style="color:var(--accent);">+</b> : 重复 1 次或多次 ({1,})</li>
                  <li><b style="color:var(--accent);">?</b> : 重复 0 次或 1 次 ({0,1})</li>
                  <li><b style="color:var(--accent);">{n}</b> : 精确重复 n 次</li>
                  <li><b style="color:var(--accent);">{n,}</b> : 至少重复 n 次</li>
                  <li><b style="color:var(--accent);">{n,m}</b> : 重复 n 到 m 次</li>
                  <li><b style="color:var(--accent);">+? / *?</b> : 非贪婪匹配模式</li>
                </ul>
              </div>

              <div style="background: var(--card-bg); padding: 12px; border-radius: 6px; border: 1px solid var(--border-color);">
                <h5 style="color: var(--text-primary); margin-bottom: 6px; font-size: 0.9rem;">3. 分组与字符类</h5>
                <ul style="list-style: none; padding: 0; margin: 0; font-family: monospace;">
                  <li><b style="color:var(--accent);">[abc]</b> : 字符集中任意一个 (a或b或c)</li>
                  <li><b style="color:var(--accent); font-family: monospace;">[^abc]</b> : 不在字符集中的字符</li>
                  <li><b style="color:var(--accent);">(x)</b> : 捕获组并记住匹配项</li>
                  <li><b style="color:var(--accent);">(?:x)</b> : 非捕获组 (只匹配不记忆)</li>
                  <li><b style="color:var(--accent);">a|b</b> : 匹配 a 或匹配 b</li>
                </ul>
              </div>

              <div style="background: var(--card-bg); padding: 12px; border-radius: 6px; border: 1px solid var(--border-color);">
                <h5 style="color: var(--text-primary); margin-bottom: 6px; font-size: 0.9rem;">4. 断言 / 预查 (Lookaround)</h5>
                <ul style="list-style: none; padding: 0; margin: 0; font-family: monospace;">
                  <li><b style="color:var(--accent);">(?=p)</b> : 正向先行断言 (后面需符合 p)</li>
                  <li><b style="color:var(--accent);">(?!p)</b> : 负向先行断言 (后面不能是 p)</li>
                  <li><b style="color:var(--accent);">(?&lt;=p)</b> : 正向后行断言 (前面需是 p)</li>
                  <li><b style="color:var(--accent);">(?&lt;!p)</b> : 负向后行断言 (前面不能是 p)</li>
                </ul>
              </div>
            </div>
            <div style="margin-top: 10px; font-size: 0.82rem; color: var(--text-tertiary);">
              💡 提示：在 JavaScript 等编程语言中使用正则表达式时，如在字符串中书写，请注意对反斜杠进行转义（如 <code>\\d</code>）。
            </div>
          </div>
        </details>
      </div>
    `,
    run: () => {
      // 默认加载手机号码预设，并触发自动检测
      DevTools.applyRegexPreset('phone');
    }
  },
  
  // Cron生成器
  'cron-gen': {
    name: 'Cron生成器',
    render: () => `
      <div class="tool-section">
        <label class="tool-section-label">Cron表达式</label>
        <input type="text" id="cronInput" class="tool-input" value="* * * * *" placeholder="* * * * *">
      </div>
      <div class="tool-options">
        <button class="tool-page-btn" onclick="DevTools.run('cron-gen')">
          ${ICONS.refresh} 刷新
        </button>
      </div>
      <div class="tool-section">
        <label class="tool-section-label">下次执行时间</label>
        <div id="cronResults" style="padding: 1rem; background: var(--bg-secondary); border-radius: 8px;"></div>
      </div>
      <div class="tool-section">
        <p style="font-size: 0.85rem; color: var(--text-tertiary);">
          格式: 分 时 日 月 周<br>
          示例: 0 9 * * 1-5 (工作日早上9点)
        </p>
      </div>
    `,
    run: () => {
      const cron = document.getElementById('cronInput').value;
      const parts = cron.trim().split(/\s+/);
      
      if (parts.length !== 5) {
        showToast('Cron表达式需要5个字段', 'error');
        return;
      }
      
      const now = new Date();
      const results = [];
      
      // Simple next execution calculation
      for (let i = 0; i < 10; i++) {
        const next = new Date(now.getTime() + i * 60000);
        results.push(next.toLocaleString());
      }
      
      document.getElementById('cronResults').innerHTML = `
        <p style="margin-bottom: 0.5rem;">接下来的执行时间：</p>
        ${results.map(t => `<div style="padding: 0.25rem 0;">${t}</div>`).join('')}
      `;
    }
  },
  
  // 颜色转换
  'color-convert': {
    name: '颜色转换',
    render: () => `
      <div class="tool-section">
        <label class="tool-section-label">输入颜色</label>
        <div class="color-picker-group">
          <input type="color" id="colorPicker" class="color-picker" value="#3b82f6">
          <input type="text" id="colorInput" class="tool-input" value="#3b82f6" style="flex:1;">
        </div>
      </div>
      <div class="tool-options">
        <button class="tool-page-btn primary" onclick="DevTools.run('color-convert')">
          ${ICONS.play} 转换
        </button>
      </div>
      <div class="tool-section" id="resultSection" style="display:none;">
        <label class="tool-section-label">转换结果</label>
        <div class="stats-grid" id="colorResults"></div>
      </div>
    `,
    run: () => {
      let color = document.getElementById('colorInput').value;
      if (!color.startsWith('#')) color = '#' + color;
      
      const hex = color.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      
      const hsl = DevTools.rgbToHsl(r, g, b);
      const hsv = DevTools.rgbToHsv(r, g, b);
      
      document.getElementById('resultSection').style.display = 'block';
      document.getElementById('colorResults').innerHTML = `
        <div class="stat-item" style="cursor: pointer;" onclick="copyToClipboard('${color.toUpperCase()}')">
          <div class="stat-value" style="font-size: 1rem;">${color.toUpperCase()}</div>
          <div class="stat-label">HEX</div>
        </div>
        <div class="stat-item" style="cursor: pointer;" onclick="copyToClipboard('rgb(${r}, ${g}, ${b})')">
          <div class="stat-value" style="font-size: 1rem;">rgb(${r}, ${g}, ${b})</div>
          <div class="stat-label">RGB</div>
        </div>
        <div class="stat-item" style="cursor: pointer;" onclick="copyToClipboard('hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)')">
          <div class="stat-value" style="font-size: 1rem;">hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)</div>
          <div class="stat-label">HSL</div>
        </div>
        <div class="stat-item" style="cursor: pointer;" onclick="copyToClipboard('hsv(${hsv[0]}, ${hsv[1]}%, ${hsv[2]}%)')">
          <div class="stat-value" style="font-size: 1rem;">hsv(${hsv[0]}, ${hsv[1]}%, ${hsv[2]}%)</div>
          <div class="stat-label">HSV</div>
        </div>
      `;
    },
    rgbToHsl: (r, g, b) => {
      r /= 255; g /= 255; b /= 255;
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;
      if (max === min) {
        h = s = 0;
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
          case g: h = ((b - r) / d + 2) / 6; break;
          case b: h = ((r - g) / d + 4) / 6; break;
        }
      }
      return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
    },
    rgbToHsv: (r, g, b) => {
      r /= 255; g /= 255; b /= 255;
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h, s, v = max;
      const d = max - min;
      s = max === 0 ? 0 : d / max;
      if (max === min) {
        h = 0;
      } else {
        switch (max) {
          case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
          case g: h = ((b - r) / d + 2) / 6; break;
          case b: h = ((r - g) / d + 4) / 6; break;
        }
      }
      return [Math.round(h * 360), Math.round(s * 100), Math.round(v * 100)];
    }
  },
  
  // 时间戳转换
  'timestamp': {
    name: '时间戳转换',
    render: () => `
      <div class="tool-section">
        <label class="tool-section-label">时间戳（毫秒）</label>
        <input type="text" id="timestampInput" class="tool-input" placeholder="输入时间戳或日期">
      </div>
      <div class="tool-options">
        <button class="tool-page-btn" onclick="DevTools.runTimestamp('toDate')">
          ${ICONS.play} 时间戳→日期
        </button>
        <button class="tool-page-btn" onclick="DevTools.runTimestamp('toTimestamp')">
          ${ICONS.play} 日期→时间戳
        </button>
        <button class="tool-page-btn" onclick="DevTools.runTimestamp('now')">
          ${ICONS.play} 当前时间
        </button>
      </div>
      <div class="tool-section" id="resultSection" style="display:none;">
        <label class="tool-section-label">结果</label>
        <div class="stats-grid" id="timestampResults"></div>
      </div>
    `,
    runTimestamp: (type) => {
      const input = document.getElementById('timestampInput');
      let date;
      
      if (type === 'now') {
        date = new Date();
      } else if (type === 'toDate') {
        const ts = parseInt(input.value);
        date = new Date(isNaN(ts) ? input.value : ts);
      } else {
        date = new Date(input.value);
      }
      
      if (isNaN(date.getTime())) {
        showToast('无效的输入', 'error');
        return;
      }
      
      document.getElementById('resultSection').style.display = 'block';
      document.getElementById('timestampResults').innerHTML = `
        <div class="stat-item" style="cursor: pointer;" onclick="copyToClipboard('${date.getTime()}')">
          <div class="stat-value" style="font-size: 1rem;">${date.getTime()}</div>
          <div class="stat-label">毫秒时间戳</div>
        </div>
        <div class="stat-item" style="cursor: pointer;" onclick="copyToClipboard('${Math.floor(date.getTime() / 1000)}')">
          <div class="stat-value" style="font-size: 1rem;">${Math.floor(date.getTime() / 1000)}</div>
          <div class="stat-label">秒时间戳</div>
        </div>
        <div class="stat-item" style="cursor: pointer;" onclick="copyToClipboard('${date.toISOString()}')">
          <div class="stat-value" style="font-size: 0.9rem;">${date.toISOString()}</div>
          <div class="stat-label">ISO格式</div>
        </div>
        <div class="stat-item" style="cursor: pointer;" onclick="copyToClipboard('${date.toLocaleString()}')">
          <div class="stat-value" style="font-size: 0.9rem;">${date.toLocaleString()}</div>
          <div class="stat-label">本地时间</div>
        </div>
      `;
    }
  },
  
  // Cron测试
  'crontab-test': {
    name: 'Cron测试',
    render: () => `
      <div class="tool-section">
        <label class="tool-section-label">Cron表达式</label>
        <input type="text" id="cronInput" class="tool-input" value="0 * * * *" placeholder="* * * * *">
      </div>
      <div class="tool-options">
        <button class="tool-page-btn primary" onclick="DevTools.run('crontab-test')">
          ${ICONS.play} 测试
        </button>
      </div>
      <div class="tool-section" id="resultSection" style="display:none;">
        <label class="tool-section-label">执行时间</label>
        <div id="cronTestResults" style="padding: 1rem; background: var(--bg-secondary); border-radius: 8px;"></div>
      </div>
    `,
    run: () => {
      const cron = document.getElementById('cronInput').value;
      const results = [];
      const now = new Date();
      
      for (let i = 0; i < 5; i++) {
        const next = new Date(now.getTime() + i * 3600000);
        results.push(next.toLocaleString());
      }
      
      document.getElementById('resultSection').style.display = 'block';
      document.getElementById('cronTestResults').innerHTML = `
        <p style="margin-bottom: 0.5rem;">表达式: <code>${cron}</code></p>
        ${results.map(t => `<div style="padding: 0.25rem 0;">${t}</div>`).join('')}
      `;
    }
  },

  // 批量姓名生成器
  'name-generator': {
    name: '批量姓名生成器',
    render: () => `
      <div class="tool-section" style="padding: 0;">
        <iframe src="assets/批量姓名生成器.html" style="width: 100%; height: 800px; border: none; border-radius: 8px;"></iframe>
      </div>
    `,
    run: () => {}
  },
  
  // HTTP请求测试
  'http-test': {
    name: 'HTTP请求测试',
    render: () => `
      <div class="tool-section">
        <label class="tool-section-label">请求URL</label>
        <input type="url" id="httpUrl" class="tool-input" placeholder="https://api.example.com/data">
      </div>
      <div class="tool-section">
        <label class="tool-section-label">请求方法</label>
        <select id="httpMethod" class="tool-select">
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
      </div>
      <div class="tool-section">
        <label class="tool-section-label">请求头 (JSON)</label>
        <textarea id="httpHeaders" class="tool-textarea" placeholder='{"Content-Type": "application/json"}'></textarea>
      </div>
      <div class="tool-section">
        <label class="tool-section-label">请求体</label>
        <textarea id="httpBody" class="tool-textarea" placeholder='{"key": "value"}'></textarea>
      </div>
      <div class="tool-options">
        <button class="tool-page-btn primary" onclick="DevTools.run('http-test')">
          ${ICONS.play} 发送请求
        </button>
      </div>
      <div class="tool-section" id="resultSection" style="display:none;">
        <label class="tool-section-label">响应结果</label>
        <div class="tool-result-box">
          <textarea id="resultText" class="tool-textarea" readonly></textarea>
          <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('resultText').value)">
            ${ICONS.copy} 复制
          </button>
        </div>
        <p class="tool-hint">注意：由于浏览器安全限制，可能无法访问某些URL</p>
      </div>
    `,
    run: async () => {
      const url = document.getElementById('httpUrl').value;
      const method = document.getElementById('httpMethod').value;
      const headersText = document.getElementById('httpHeaders').value;
      const body = document.getElementById('httpBody').value;
      
      if (!url) {
        showToast('请输入URL', 'error');
        return;
      }
      
      try {
        const options = { method, mode: 'cors' };
        
        if (headersText) {
          options.headers = JSON.parse(headersText);
        }
        
        if (body && method !== 'GET') {
          options.body = body;
        }
        
        const response = await fetch(url, options);
        const data = await response.text();
        
        document.getElementById('resultSection').style.display = 'block';
        document.getElementById('resultText').value = `Status: ${response.status}\n\n${data}`;
      } catch (e) {
        showToast('请求失败: ' + e.message, 'error');
      }
    }
  },
  
  // 代码压缩
  'code-minify': {
    name: '代码压缩',
    render: () => `
      <div class="tool-section">
        <label class="tool-section-label">输入代码</label>
        <textarea id="inputText" class="tool-textarea" placeholder="请输入JS或CSS代码..." style="min-height: 200px;"></textarea>
      </div>
      <div class="tool-section">
        <label class="tool-section-label">代码类型</label>
        <select id="codeType" class="tool-select">
          <option value="js">JavaScript</option>
          <option value="css">CSS</option>
        </select>
      </div>
      <div class="tool-options">
        <button class="tool-page-btn primary" onclick="DevTools.run('code-minify')">
          ${ICONS.play} 压缩代码
        </button>
      </div>
      <div class="tool-section" id="resultSection" style="display:none;">
        <label class="tool-section-label">压缩结果</label>
        <div class="tool-result-box">
          <textarea id="resultText" class="tool-textarea" readonly></textarea>
          <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('resultText').value)">
            ${ICONS.copy} 复制
          </button>
        </div>
        <div class="stats-grid" id="statsResult"></div>
      </div>
    `,
    run: () => {
      const code = document.getElementById('inputText').value;
      const type = document.getElementById('codeType').value;
      
      if (!code) {
        showToast('请输入代码', 'error');
        return;
      }
      
      let minified = code;
      
      if (type === 'js') {
        // 简单的JS压缩
        minified = code
          .replace(/\/\/.*$/gm, '') // 移除单行注释
          .replace(/\/\*[\s\S]*?\*\//g, '') // 移除多行注释
          .replace(/\n\s*\n/g, '\n') // 移除空行
          .replace(/\s+/g, ' ') // 合并空白
          .replace(/\s*([{};:,])\s*/g, '$1') // 移除符号周围空格
          .trim();
      } else {
        // 简单的CSS压缩
        minified = code
          .replace(/\/\*[\s\S]*?\*\//g, '') // 移除注释
          .replace(/\n\s*\n/g, '\n') // 移除空行
          .replace(/\s+/g, ' ') // 合并空白
          .replace(/\s*([{}:;,])\s*/g, '$1') // 移除符号周围空格
          .trim();
      }
      
      document.getElementById('resultSection').style.display = 'block';
      document.getElementById('resultText').value = minified;
      
      // 显示压缩统计
      const originalSize = code.length;
      const minifiedSize = minified.length;
      const saved = ((originalSize - minifiedSize) / originalSize * 100).toFixed(1);
      
      document.getElementById('statsResult').innerHTML = `
        <div class="stat-item"><div class="stat-value">${originalSize}</div><div class="stat-label">原始大小</div></div>
        <div class="stat-item"><div class="stat-value">${minifiedSize}</div><div class="stat-label">压缩后</div></div>
        <div class="stat-item"><div class="stat-value">${saved}%</div><div class="stat-label">压缩率</div></div>
      `;
    }
  },
  
  // Git命令生成器
  'git-cmd': {
    name: 'Git命令生成器',
    render: () => `
      <div class="tool-section">
        <label class="tool-section-label">选择操作</label>
        <select id="gitAction" class="tool-select" onchange="DevTools.updateGitCmd()">
          <option value="init">初始化仓库</option>
          <option value="clone">克隆仓库</option>
          <option value="commit">提交代码</option>
          <option value="branch">创建分支</option>
          <option value="merge">合并分支</option>
          <option value="tag">打标签</option>
          <option value="log">查看日志</option>
          <option value="reset">重置代码</option>
        </select>
      </div>
      <div class="tool-section" id="gitParams"></div>
      <div class="tool-section" id="resultSection">
        <label class="tool-section-label">Git命令</label>
        <div class="tool-result-box">
          <input type="text" id="resultText" class="tool-input" readonly>
          <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('resultText').value)">
            ${ICONS.copy} 复制
          </button>
        </div>
      </div>
    `,
    updateGitCmd: () => {
      const action = document.getElementById('gitAction').value;
      const commands = {
        init: 'git init',
        clone: 'git clone <repository-url>',
        commit: 'git add .\ngit commit -m "<message>"',
        branch: 'git branch <branch-name>\ngit checkout <branch-name>',
        merge: 'git checkout main\ngit merge <branch-name>',
        tag: 'git tag -a v1.0 -m "<message>"\ngit push origin v1.0',
        log: 'git log --oneline --graph',
        reset: 'git reset --hard HEAD'
      };
      
      document.getElementById('resultText').value = commands[action] || '';
    },
    run: () => DevTools.updateGitCmd()
  },
  
  // Docker命令生成
  'docker-cmd': {
    name: 'Docker命令生成',
    render: () => `
      <div class="tool-section">
        <label class="tool-section-label">选择操作</label>
        <select id="dockerAction" class="tool-select" onchange="DevTools.updateDockerCmd()">
          <option value="run">运行容器</option>
          <option value="build">构建镜像</option>
          <option value="ps">查看容器</option>
          <option value="logs">查看日志</option>
          <option value="exec">进入容器</option>
          <option value="stop">停止容器</option>
          <option value="rm">删除容器</option>
          <option value="images">查看镜像</option>
        </select>
      </div>
      <div class="tool-section" id="dockerParams"></div>
      <div class="tool-section" id="resultSection">
        <label class="tool-section-label">Docker命令</label>
        <div class="tool-result-box">
          <input type="text" id="resultText" class="tool-input" readonly>
          <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('resultText').value)">
            ${ICONS.copy} 复制
          </button>
        </div>
      </div>
    `,
    updateDockerCmd: () => {
      const action = document.getElementById('dockerAction').value;
      const commands = {
        run: 'docker run -d --name <container-name> <image-name>',
        build: 'docker build -t <image-name> .',
        ps: 'docker ps -a',
        logs: 'docker logs -f <container-name>',
        exec: 'docker exec -it <container-name> /bin/bash',
        stop: 'docker stop <container-name>',
        rm: 'docker rm <container-name>',
        images: 'docker images'
      };
      
      document.getElementById('resultText').value = commands[action] || '';
    },
    run: () => DevTools.updateDockerCmd()
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
