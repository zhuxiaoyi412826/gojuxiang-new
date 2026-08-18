// =============================================
// 文本处理与加密解密工具实现
// =============================================

const TextTools = {
  // 1. 字数统计
  'word-count': {
    name: '字数统计',
    render: () => `
      <div class="tool-section">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <label class="tool-section-label" style="margin-bottom:0;">输入文本</label>
          <div style="display: flex; gap: 8px;">
            <button class="tool-result-btn" onclick="TextTools.loadWordCountSample()" style="padding: 4px 10px; font-size: 12px;">📄 载入范文</button>
            <button class="tool-result-btn" onclick="document.getElementById('wordCountInput').value=''; TextTools.calcWordCount();" style="padding: 4px 10px; font-size: 12px;">🗑️ 清空内容</button>
          </div>
        </div>
        <textarea id="wordCountInput" class="tool-textarea" placeholder="在此输入或粘贴需要统计的文本内容..." rows="8" oninput="TextTools.calcWordCount()"></textarea>
      </div>

      <div class="tool-section">
        <label class="tool-section-label">详细统计指标</label>
        <div class="stats-grid" id="statsResultGrid">
          <div class="stat-item"><div class="stat-value" id="statChars">0</div><div class="stat-label">总字符数 (含空格)</div></div>
          <div class="stat-item"><div class="stat-value" id="statCharsNoSpace">0</div><div class="stat-label">字符数 (不含空格)</div></div>
          <div class="stat-item"><div class="stat-value" id="statChinese">0</div><div class="stat-label">中文字符 / 汉字</div></div>
          <div class="stat-item"><div class="stat-value" id="statPunctuation">0</div><div class="stat-label">中文标点符号</div></div>
          <div class="stat-item"><div class="stat-value" id="statEnglishWords">0</div><div class="stat-label">英文单词数</div></div>
          <div class="stat-item"><div class="stat-value" id="statLetters">0</div><div class="stat-label">英文字母 (大/小)</div></div>
          <div class="stat-item"><div class="stat-value" id="statNumbers">0</div><div class="stat-label">数字个数</div></div>
          <div class="stat-item"><div class="stat-value" id="statSpaces">0</div><div class="stat-label">空格与空白符</div></div>
          <div class="stat-item"><div class="stat-value" id="statLines">0</div><div class="stat-label">总行数 / 非空行</div></div>
          <div class="stat-item"><div class="stat-value" id="statParagraphs">0</div><div class="stat-label">段落数</div></div>
          <div class="stat-item"><div class="stat-value" id="statReadTime">0 分钟</div><div class="stat-label">预估阅读耗时</div></div>
          <div class="stat-item"><div class="stat-value" id="statSpeakTime">0 分钟</div><div class="stat-label">预估朗读耗时</div></div>
          <div class="stat-item"><div class="stat-value" id="statBytes">0 B</div><div class="stat-label">UTF-8 内存占用</div></div>
        </div>
      </div>
    `,
    run: () => TextTools.calcWordCount()
  },

  loadWordCountSample: function() {
    const text = `人工智能（Artificial Intelligence，简称 AI）是计算机科学的一个分支，它企图了解智能的实质，并生产出一种新的能以与人类智能相似的方式做出反应的智能机器。

In 2026, web developer toolkits have become essential for engineers worldwide! They save thousands of hours every single day by automating encoding, string processing, and data cryptography.

统计数据点包含：123456789 个节点，效率比提升 350%！欢迎试用我们的在线综合工具箱。`;
    const input = document.getElementById('wordCountInput');
    if (input) {
      input.value = text;
      this.calcWordCount();
      showToast('已载入测试范文', 'success');
    }
  },

  calcWordCount: function() {
    const el = document.getElementById('wordCountInput');
    if (!el) return;
    const text = el.value;

    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, '').length;
    const chineseMatch = text.match(/[\u4e00-\u9fa5]/g) || [];
    const chineseCount = chineseMatch.length;

    // 中文标点
    const punctMatch = text.match(/[\u3000-\u303f\uff00-\uffef]/g) || [];
    const punctuationCount = punctMatch.length;

    // 英文单词
    const wordsMatch = text.trim() ? (text.match(/[a-zA-Z0-9_]+/g) || []) : [];
    const englishWords = wordsMatch.length;

    // 英文字母
    const lettersMatch = text.match(/[a-zA-Z]/g) || [];
    const lettersCount = lettersMatch.length;

    // 数字
    const numbersMatch = text.match(/[0-9]/g) || [];
    const numbersCount = numbersMatch.length;

    // 空白符
    const spacesMatch = text.match(/\s/g) || [];
    const spacesCount = spacesMatch.length;

    // 行数
    const lines = text ? text.split('\n') : [];
    const totalLines = lines.length;
    const nonCountLines = lines.filter(l => l.trim().length > 0).length;

    // 段落数
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(p => p.trim()).length : 0;

    // 预估耗时 (中文300字/分，英文200词/分)
    const readMinutes = Math.max(1, Math.ceil(chineseCount / 300 + englishWords / 200));
    const speakMinutes = Math.max(1, Math.ceil(chineseCount / 200 + englishWords / 130));

    // UTF-8 字节
    const bytes = new TextEncoder().encode(text).length;
    let bytesFormatted = bytes + ' B';
    if (bytes >= 1024 * 1024) {
      bytesFormatted = (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    } else if (bytes >= 1024) {
      bytesFormatted = (bytes / 1024).toFixed(1) + ' KB';
    }

    document.getElementById('statChars').textContent = chars.toLocaleString();
    document.getElementById('statCharsNoSpace').textContent = charsNoSpace.toLocaleString();
    document.getElementById('statChinese').textContent = chineseCount.toLocaleString();
    document.getElementById('statPunctuation').textContent = punctuationCount.toLocaleString();
    document.getElementById('statEnglishWords').textContent = englishWords.toLocaleString();
    document.getElementById('statLetters').textContent = lettersCount.toLocaleString();
    document.getElementById('statNumbers').textContent = numbersCount.toLocaleString();
    document.getElementById('statSpaces').textContent = spacesCount.toLocaleString();
    document.getElementById('statLines').textContent = `${totalLines} / ${nonCountLines}`;
    document.getElementById('statParagraphs').textContent = paragraphs.toLocaleString();
    document.getElementById('statReadTime').textContent = text ? `约 ${readMinutes} 分钟` : '0 分钟';
    document.getElementById('statSpeakTime').textContent = text ? `约 ${speakMinutes} 分钟` : '0 分钟';
    document.getElementById('statBytes').textContent = bytesFormatted;
  },


  // 2. 文本对比
  'text-diff': {
    name: '文本对比',
    render: () => `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
        <div class="tool-section" style="margin-bottom:0;">
          <label class="tool-section-label">原文本 (Text A)</label>
          <textarea id="textA" class="tool-textarea" placeholder="输入第一段原始文本..." rows="6"></textarea>
        </div>
        <div class="tool-section" style="margin-bottom:0;">
          <label class="tool-section-label">对比文本 (Text B)</label>
          <textarea id="textB" class="tool-textarea" placeholder="输入第二段修改后的文本..." rows="6"></textarea>
        </div>
      </div>

      <div class="tool-options" style="background: var(--card-bg, #ffffff); border: 1px solid var(--border-color, #e5e7eb); border-radius: 8px; padding: 10px 14px; margin-bottom: 14px;">
        <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
          <label class="tool-option"><input type="checkbox" id="diffIgnoreCase"> 忽略大小写</label>
          <label class="tool-option"><input type="checkbox" id="diffIgnoreSpace" checked> 忽略首尾多余空格</label>
          <button class="tool-result-btn" onclick="TextTools.loadDiffSample()">📄 载入示例数据</button>
          <button class="tool-result-btn" onclick="TextTools.swapDiffTexts()">🔄 交换文本A/B</button>
        </div>
      </div>

      <div class="tool-options">
        <button class="tool-page-btn primary" onclick="TextTools.run('text-diff')">
          ${ICONS.play} 比较文本差异
        </button>
      </div>

      <div class="tool-section" id="diffResultSection" style="display:none; margin-top: 14px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <label class="tool-section-label" style="margin-bottom:0;">对比差异报告</label>
          <div id="diffSummaryBadge" style="font-size:0.82rem; padding: 2px 8px; border-radius: 12px; background: #e0f2fe; color: #0369a1; font-weight: 600;"></div>
        </div>
        <div id="diffVisualContainer" style="background: var(--bg-secondary, #f8f9fa); border: 1px solid var(--border-color, #e5e7eb); border-radius: 8px; padding: 12px; font-family: monospace; font-size: 13px; max-height: 400px; overflow-y: auto; line-height: 1.6;"></div>
      </div>
    `,
    run: () => {
      let a = document.getElementById('textA').value;
      let b = document.getElementById('textB').value;
      const ignoreCase = document.getElementById('diffIgnoreCase').checked;
      const ignoreSpace = document.getElementById('diffIgnoreSpace').checked;

      const linesA = a.split('\n');
      const linesB = b.split('\n');
      const maxLen = Math.max(linesA.length, linesB.length);

      let diffHtml = '';
      let diffCount = 0;

      for (let i = 0; i < maxLen; i++) {
        let lineA = linesA[i] !== undefined ? linesA[i] : null;
        let lineB = linesB[i] !== undefined ? linesB[i] : null;

        let compA = lineA || '';
        let compB = lineB || '';

        if (ignoreSpace) {
          compA = compA.trim();
          compB = compB.trim();
        }
        if (ignoreCase) {
          compA = compA.toLowerCase();
          compB = compB.toLowerCase();
        }

        const lineNum = (i + 1).toString().padStart(3, ' ');

        if (lineA === null) {
          // 只在 B 中存在
          diffCount++;
          diffHtml += `<div style="background-color: #dcfce7; color: #15803d; padding: 2px 8px; border-radius: 3px; margin: 2px 0;"><strong>+ [行 ${lineNum}]</strong> ${escapeHtml(lineB)}</div>`;
        } else if (lineB === null) {
          // 只在 A 中存在
          diffCount++;
          diffHtml += `<div style="background-color: #fee2e2; color: #b91c1c; padding: 2px 8px; border-radius: 3px; margin: 2px 0;"><strong>- [行 ${lineNum}]</strong> ${escapeHtml(lineA)}</div>`;
        } else if (compA !== compB) {
          diffCount++;
          diffHtml += `
            <div style="background-color: #fef3c7; border-left: 3px solid #f59e0b; padding: 4px 8px; margin: 4px 0; border-radius: 3px;">
              <div style="color: #b91c1c;"><strong>- A 行${lineNum}:</strong> ${escapeHtml(lineA)}</div>
              <div style="color: #15803d;"><strong>+ B 行${lineNum}:</strong> ${escapeHtml(lineB)}</div>
            </div>
          `;
        } else {
          diffHtml += `<div style="color: #6b7280; padding: 1px 8px;">&nbsp;&nbsp; [行 ${lineNum}] ${escapeHtml(lineA)}</div>`;
        }
      }

      const resSection = document.getElementById('diffResultSection');
      const visualBox = document.getElementById('diffVisualContainer');
      const badge = document.getElementById('diffSummaryBadge');

      resSection.style.display = 'block';
      visualBox.innerHTML = diffHtml || '<div style="color:#10b981; text-align:center; padding: 20px;">🎉 两段文本完全相同！</div>';

      if (diffCount === 0) {
        badge.style.background = '#d1fae5';
        badge.style.color = '#047857';
        badge.textContent = '两段文本完全无差异';
      } else {
        badge.style.background = '#fef3c7';
        badge.style.color = '#b45309';
        badge.textContent = `检测到 ${diffCount} 处行差异`;
      }
    }
  },

  loadDiffSample: function() {
    document.getElementById('textA').value = `Project Name: Developer Toolbox
Version: 1.0.0
Features:
- JSON Validator
- Text Encryption
- Base64 Encode`;
    document.getElementById('textB').value = `Project Name: Developer Toolbox Pro
Version: 1.1.0
Features:
- JSON Validator & Formatter
- Text Encryption & Cryptography
- Base64 Encode/Decode
- Token Counter`;
    this['text-diff'].run();
  },

  swapDiffTexts: function() {
    const a = document.getElementById('textA').value;
    document.getElementById('textA').value = document.getElementById('textB').value;
    document.getElementById('textB').value = a;
    this['text-diff'].run();
  },


  // 3. 行排序
  'line-sort': {
    name: '行排序',
    render: () => `
      <div class="tool-section">
        <label class="tool-section-label">输入多行文本</label>
        <textarea id="sortInputText" class="tool-textarea" placeholder="在此输入需要排序的列表（每行一条数据）..." rows="6"></textarea>
      </div>

      <div class="tool-options" style="background: var(--card-bg, #ffffff); border: 1px solid var(--border-color, #e5e7eb); border-radius: 8px; padding: 10px 14px;">
        <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
          <div style="display: flex; gap: 12px; align-items: center;">
            <label style="font-weight: 600; font-size: 0.85rem;">排序规则：</label>
            <label class="tool-option"><input type="radio" name="sortRule" value="asc" checked> 字母升序 (A-Z)</label>
            <label class="tool-option"><input type="radio" name="sortRule" value="desc"> 字母降序 (Z-A)</label>
            <label class="tool-option"><input type="radio" name="sortRule" value="numeric"> 按数字大小</label>
            <label class="tool-option"><input type="radio" name="sortRule" value="length"> 按行字符长度</label>
          </div>
          <div style="display: flex; gap: 12px; align-items: center; margin-top: 4px;">
            <label class="tool-option"><input type="checkbox" id="sortRemoveDup" checked> 顺带去重</label>
            <label class="tool-option"><input type="checkbox" id="sortTrim"> 清理首尾空格</label>
            <label class="tool-option"><input type="checkbox" id="sortIgnoreEmpty" checked> 过滤空白行</label>
          </div>
        </div>
      </div>

      <div class="tool-options" style="margin-top: 10px; display: flex; gap: 8px;">
        <button class="tool-page-btn primary" onclick="TextTools.run('line-sort')">
          ⚡ 立即排序
        </button>
        <button class="tool-result-btn" onclick="TextTools.loadSortSample()">📄 载入示例</button>
      </div>

      <div class="tool-section" style="margin-top: 14px;">
        <label class="tool-section-label">排序结果</label>
        <div class="tool-result">
          <textarea id="sortResultText" class="tool-textarea" readonly rows="6" placeholder="排序后的结果将在此显示..."></textarea>
          <div class="tool-result-actions">
            <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('sortResultText').value)">
              ${ICONS.copy} 一键复制
            </button>
          </div>
        </div>
      </div>
    `,
    run: () => {
      const text = document.getElementById('sortInputText').value;
      let lines = text.split('\n');

      const rule = document.querySelector('input[name="sortRule"]:checked')?.value || 'asc';
      const removeDup = document.getElementById('sortRemoveDup').checked;
      const trim = document.getElementById('sortTrim').checked;
      const ignoreEmpty = document.getElementById('sortIgnoreEmpty').checked;

      if (trim) {
        lines = lines.map(l => l.trim());
      }
      if (ignoreEmpty) {
        lines = lines.filter(l => l.length > 0);
      }
      if (removeDup) {
        lines = [...new Set(lines)];
      }

      lines.sort((a, b) => {
        if (rule === 'asc') return a.localeCompare(b, 'zh-CN');
        if (rule === 'desc') return b.localeCompare(a, 'zh-CN');
        if (rule === 'numeric') {
          const numA = parseFloat(a.replace(/[^0-9.-]/g, '')) || 0;
          const numB = parseFloat(b.replace(/[^0-9.-]/g, '')) || 0;
          return numA - numB;
        }
        if (rule === 'length') return a.length - b.length;
        return 0;
      });

      document.getElementById('sortResultText').value = lines.join('\n');
      showToast(`已完成 ${lines.length} 行排序`, 'success');
    }
  },

  loadSortSample: function() {
    document.getElementById('sortInputText').value = `Banana
100
Apple
20
Cherry
5
Banana
Date
1`;
    this['line-sort'].run();
  },


  // 4. 行去重
  'line-dedup': {
    name: '行去重',
    render: () => `
      <div class="tool-section">
        <label class="tool-section-label">输入文本</label>
        <textarea id="dedupInputText" class="tool-textarea" placeholder="输入可能包含重复行的文本..." rows="6"></textarea>
      </div>

      <div class="tool-options" style="background: var(--card-bg, #ffffff); border: 1px solid var(--border-color, #e5e7eb); border-radius: 8px; padding: 10px 14px;">
        <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
          <label class="tool-option"><input type="checkbox" id="dedupCaseSensitive" checked> 区分大小写</label>
          <label class="tool-option"><input type="checkbox" id="dedupTrim" checked> 忽略首尾空格</label>
          <label class="tool-option"><input type="checkbox" id="dedupRemoveEmpty" checked> 移除空白行</label>
          <button class="tool-result-btn" onclick="TextTools.loadDedupSample()">📄 载入重复示例</button>
        </div>
      </div>

      <div class="tool-options" style="margin-top: 10px;">
        <button class="tool-page-btn primary" onclick="TextTools.run('line-dedup')">
          ⚡ 立即行去重
        </button>
      </div>

      <div class="tool-section" style="margin-top: 14px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <label class="tool-section-label" style="margin-bottom:0;">去重结果</label>
          <span id="dedupBadge" style="font-size:0.82rem; color:var(--text-secondary);"></span>
        </div>
        <div class="tool-result">
          <textarea id="dedupResultText" class="tool-textarea" readonly rows="6" placeholder="去重后的文本将在此显示..."></textarea>
          <div class="tool-result-actions">
            <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('dedupResultText').value)">
              ${ICONS.copy} 一键复制
            </button>
          </div>
        </div>
      </div>
    `,
    run: () => {
      const text = document.getElementById('dedupInputText').value;
      const caseSensitive = document.getElementById('dedupCaseSensitive').checked;
      const trim = document.getElementById('dedupTrim').checked;
      const removeEmpty = document.getElementById('dedupRemoveEmpty').checked;

      let lines = text.split('\n');
      const totalOriginal = lines.length;

      const seen = new Set();
      const result = [];

      for (let rawLine of lines) {
        let processed = trim ? rawLine.trim() : rawLine;
        if (removeEmpty && processed.length === 0) continue;

        let key = caseSensitive ? processed : processed.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          result.push(processed);
        }
      }

      const removedCount = totalOriginal - result.length;
      document.getElementById('dedupResultText').value = result.join('\n');
      document.getElementById('dedupBadge').textContent = `原始 ${totalOriginal} 行 | 去重后 ${result.length} 行 | 清除 ${removedCount} 个重复项`;
      showToast(`去重完成，移除了 ${removedCount} 项`, 'success');
    }
  },

  loadDedupSample: function() {
    document.getElementById('dedupInputText').value = `hello@example.com
user@domain.com
hello@example.com
HELLO@EXAMPLE.COM
admin@website.org

user@domain.com`;
    this['line-dedup'].run();
  },


  // 5. 查找替换
  'text-find-replace': {
    name: '查找替换',
    render: () => `
      <div class="tool-section">
        <label class="tool-section-label">待处理文本</label>
        <textarea id="frInputText" class="tool-textarea" placeholder="输入要查找和替换的文本内容..." rows="5"></textarea>
      </div>

      <div class="tool-section" style="background: var(--card-bg, #ffffff); border: 1px solid var(--border-color, #e5e7eb); border-radius: 8px; padding: 12px 14px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 10px;">
          <div>
            <label style="font-size:0.85rem; font-weight:600;">查找内容 (Find)</label>
            <input type="text" id="frFindText" class="tool-input" placeholder="输入要查找的文本或正则表达式" style="margin-top:4px;">
          </div>
          <div>
            <label style="font-size:0.85rem; font-weight:600;">替换为 (Replace)</label>
            <input type="text" id="frReplaceText" class="tool-input" placeholder="替换后的内容 (可为空)" style="margin-top:4px;">
          </div>
        </div>

        <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
          <label class="tool-option"><input type="checkbox" id="frUseCase"> 区分大小写</label>
          <label class="tool-option"><input type="checkbox" id="frUseRegex"> 正则表达式</label>
          <label class="tool-option"><input type="checkbox" id="frGlobal" checked> 全局替换</label>
        </div>
      </div>

      <div class="tool-section" style="margin-top: 10px;">
        <label style="font-size:0.85rem; font-weight:600; color:var(--text-secondary);">快捷清洗预设：</label>
        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 6px;">
          <button type="button" class="tool-result-btn" onclick="TextTools.frPreset('cleanEmptyLines')">🧹 清理空行</button>
          <button type="button" class="tool-result-btn" onclick="TextTools.frPreset('trimLines')">✂️ 裁切行首尾空格</button>
          <button type="button" class="tool-result-btn" onclick="TextTools.frPreset('mergeSpaces')">🔤 合并连续空格</button>
          <button type="button" class="tool-result-btn" onclick="TextTools.frPreset('extractEmail')">📧 提取 Email</button>
          <button type="button" class="tool-result-btn" onclick="TextTools.frPreset('extractUrls')">🌐 提取 URL</button>
        </div>
      </div>

      <div class="tool-options" style="margin-top: 10px;">
        <button class="tool-page-btn primary" onclick="TextTools.run('text-find-replace')">
          ⚡ 执行替换
        </button>
      </div>

      <div class="tool-section" style="margin-top: 14px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <label class="tool-section-label" style="margin-bottom:0;">结果</label>
          <span id="frBadge" style="font-size:0.82rem; color:var(--text-secondary);"></span>
        </div>
        <div class="tool-result">
          <textarea id="frResultText" class="tool-textarea" readonly rows="5" placeholder="替换后的结果将在此显示..."></textarea>
          <div class="tool-result-actions">
            <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('frResultText').value)">
              ${ICONS.copy} 一键复制
            </button>
          </div>
        </div>
      </div>
    `,
    run: () => {
      let text = document.getElementById('frInputText').value;
      const find = document.getElementById('frFindText').value;
      const replace = document.getElementById('frReplaceText').value;
      const useCase = document.getElementById('frUseCase').checked;
      const useRegex = document.getElementById('frUseRegex').checked;
      const isGlobal = document.getElementById('frGlobal').checked;

      if (!find && !useRegex) {
        showToast('请输入要查找的内容', 'error');
        return;
      }

      try {
        let count = 0;
        let flags = (isGlobal ? 'g' : '') + (useCase ? '' : 'i');

        if (useRegex) {
          const regex = new RegExp(find, flags);
          const matches = text.match(regex);
          count = matches ? matches.length : 0;
          text = text.replace(regex, replace);
        } else {
          const escaped = find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(escaped, flags);
          const matches = text.match(regex);
          count = matches ? matches.length : 0;
          text = text.replace(regex, replace);
        }

        document.getElementById('frResultText').value = text;
        document.getElementById('frBadge').textContent = `已成功替换 ${count} 处匹配`;
        showToast(`替换完成，替换了 ${count} 处`, 'success');
      } catch (e) {
        showToast('正则表达式语法错误: ' + e.message, 'error');
      }
    }
  },

  frPreset: function(type) {
    const inputEl = document.getElementById('frInputText');
    const resultEl = document.getElementById('frResultText');
    if (!inputEl) return;
    let text = inputEl.value;

    if (!text) {
      showToast('请先输入文本', 'error');
      return;
    }

    if (type === 'cleanEmptyLines') {
      const res = text.split('\n').filter(l => l.trim().length > 0).join('\n');
      resultEl.value = res;
      showToast('已清理所有空白行', 'success');
    } else if (type === 'trimLines') {
      const res = text.split('\n').map(l => l.trim()).join('\n');
      resultEl.value = res;
      showToast('已裁切每行首尾空格', 'success');
    } else if (type === 'mergeSpaces') {
      const res = text.replace(/[ \t]+/g, ' ');
      resultEl.value = res;
      showToast('已合并连续空格', 'success');
    } else if (type === 'extractEmail') {
      const emails = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
      resultEl.value = [...new Set(emails)].join('\n');
      showToast(`已提取 ${emails.length} 个邮箱地址`, 'success');
    } else if (type === 'extractUrls') {
      const urls = text.match(/https?:\/\/[^\s<"']+/g) || [];
      resultEl.value = [...new Set(urls)].join('\n');
      showToast(`已提取 ${urls.length} 个 URL 网址`, 'success');
    }
  },


  // 6. 缩进转换
  'text-indent': {
    name: '缩进转换',
    render: () => `
      <div class="tool-section">
        <label class="tool-section-label">代码/文本</label>
        <textarea id="indentInputText" class="tool-textarea" placeholder="粘贴需要转换缩进的代码..." rows="6"></textarea>
      </div>

      <div class="tool-options" style="background: var(--card-bg, #ffffff); border: 1px solid var(--border-color, #e5e7eb); border-radius: 8px; padding: 10px 14px;">
        <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
          <div style="display: flex; gap: 6px; align-items: center;">
            <label style="font-weight:600; font-size:0.85rem;">缩进空格数：</label>
            <input type="number" id="indentSize" class="tool-input" value="2" min="1" max="8" style="width:60px;">
          </div>
          <button class="tool-result-btn" onclick="TextTools.runIndent('tabToSpace')">Tab 转换成空格</button>
          <button class="tool-result-btn" onclick="TextTools.runIndent('spaceToTab')">空格转换成 Tab</button>
          <button class="tool-result-btn" onclick="TextTools.runIndent('addIndent')">增加一级缩进 (+1)</button>
          <button class="tool-result-btn" onclick="TextTools.runIndent('removeIndent')">减少一级缩进 (-1)</button>
          <button class="tool-result-btn" onclick="TextTools.runIndent('trimTrailing')">清除行尾空白</button>
        </div>
      </div>

      <div class="tool-section" style="margin-top: 14px;">
        <label class="tool-section-label">转换结果</label>
        <div class="tool-result">
          <textarea id="indentResultText" class="tool-textarea" readonly rows="6" placeholder="缩进转换后的代码将在此显示..."></textarea>
          <div class="tool-result-actions">
            <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('indentResultText').value)">
              ${ICONS.copy} 一键复制
            </button>
          </div>
        </div>
      </div>
    `,
    runIndent: (type) => {
      const text = document.getElementById('indentInputText').value;
      const size = parseInt(document.getElementById('indentSize').value) || 2;
      const spaces = ' '.repeat(size);

      let result = text;
      if (type === 'tabToSpace') {
        result = text.replace(/\t/g, spaces);
      } else if (type === 'spaceToTab') {
        const regex = new RegExp(spaces, 'g');
        result = text.replace(regex, '\t');
      } else if (type === 'addIndent') {
        result = text.split('\n').map(l => l ? spaces + l : l).join('\n');
      } else if (type === 'removeIndent') {
        const regex = new RegExp(`^ {1,${size}}`);
        result = text.split('\n').map(l => l.replace(regex, '').replace(/^\t/, '')).join('\n');
      } else if (type === 'trimTrailing') {
        result = text.split('\n').map(l => l.replace(/[ \t]+$/, '')).join('\n');
      }

      document.getElementById('indentResultText').value = result;
      showToast('缩进转换处理完成', 'success');
    }
  },


  // 7. 大小写转换
  'text-case': {
    name: '大小写转换',
    render: () => `
      <div class="tool-section">
        <label class="tool-section-label">输入文本</label>
        <textarea id="caseInputText" class="tool-textarea" placeholder="输入英文或多语言文本..." rows="6"></textarea>
      </div>

      <div class="tool-options" style="display: flex; gap: 8px; flex-wrap: wrap;">
        <button class="tool-page-btn" onclick="TextTools.runCase('upper')">全部大写 (UPPER)</button>
        <button class="tool-page-btn" onclick="TextTools.runCase('lower')">全部小写 (lower)</button>
        <button class="tool-page-btn" onclick="TextTools.runCase('title')">词首大写 (Title Case)</button>
        <button class="tool-page-btn" onclick="TextTools.runCase('sentence')">句首大写 (Sentence)</button>
        <button class="tool-page-btn" onclick="TextTools.runCase('toggle')">大小写反转 (tOGGLE)</button>
        <button class="tool-page-btn" onclick="TextTools.runCase('alternate')">交替大小写 (aLtErNaTe)</button>
        <button class="tool-page-btn" onclick="TextTools.runCase('fullToHalf')">全角转半角</button>
        <button class="tool-page-btn" onclick="TextTools.runCase('halfToFull')">半角转全角</button>
      </div>

      <div class="tool-section" style="margin-top: 14px;">
        <label class="tool-section-label">转换结果</label>
        <div class="tool-result">
          <textarea id="caseResultText" class="tool-textarea" readonly rows="6" placeholder="转换后的结果将在此显示..."></textarea>
          <div class="tool-result-actions">
            <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('caseResultText').value)">
              ${ICONS.copy} 一键复制
            </button>
          </div>
        </div>
      </div>
    `,
    runCase: (type) => {
      const text = document.getElementById('caseInputText').value;
      let result = '';

      switch (type) {
        case 'upper':
          result = text.toUpperCase();
          break;
        case 'lower':
          result = text.toLowerCase();
          break;
        case 'title':
          result = text.replace(/\b\w+/g, word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
          break;
        case 'sentence':
          result = text.toLowerCase().replace(/(^\s*|[.!?]\s*)([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase());
          break;
        case 'toggle':
          result = text.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('');
          break;
        case 'alternate':
          result = text.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('');
          break;
        case 'fullToHalf':
          result = text.replace(/[\uff01-\uff5e]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0xfee0)).replace(/\u3000/g, ' ');
          break;
        case 'halfToFull':
          result = text.replace(/[\u0021-\u007e]/g, ch => String.fromCharCode(ch.charCodeAt(0) + 0xfee0)).replace(/ /g, '\u3000');
          break;
      }

      document.getElementById('caseResultText').value = result;
      showToast('转换成功', 'success');
    }
  },


  // 8. 行号处理
  'text-lines': {
    name: '行号处理',
    render: () => `
      <div class="tool-section">
        <label class="tool-section-label">输入文本</label>
        <textarea id="linesInputText" class="tool-textarea" placeholder="在此输入需要添加或移除行号的文本..." rows="6"></textarea>
      </div>

      <div class="tool-options" style="background: var(--card-bg, #ffffff); border: 1px solid var(--border-color, #e5e7eb); border-radius: 8px; padding: 10px 14px;">
        <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
          <div>
            <label style="font-size:0.85rem; font-weight:600;">起始数字：</label>
            <input type="number" id="lineStartNum" class="tool-input" value="1" style="width:65px;">
          </div>
          <div>
            <label style="font-size:0.85rem; font-weight:600;">分隔符：</label>
            <input type="text" id="lineDelimiter" class="tool-input" value=". " style="width:60px;">
          </div>
          <div>
            <label style="font-size:0.85rem; font-weight:600;">前零补齐位数：</label>
            <select id="lineZeroPad" class="tool-select">
              <option value="0" selected>自动 / 不补位</option>
              <option value="2">2 位 (01)</option>
              <option value="3">3 位 (001)</option>
              <option value="4">4 位 (0001)</option>
            </select>
          </div>
        </div>
      </div>

      <div class="tool-options" style="margin-top: 10px; display: flex; gap: 10px;">
        <button class="tool-page-btn primary" onclick="TextTools.runLines('add')">
          ➕ 添加行号
        </button>
        <button class="tool-page-btn" onclick="TextTools.runLines('remove')">
          ➖ 移除已有行号
        </button>
      </div>

      <div class="tool-section" style="margin-top: 14px;">
        <label class="tool-section-label">处理结果</label>
        <div class="tool-result">
          <textarea id="linesResultText" class="tool-textarea" readonly rows="6" placeholder="处理后的结果将在此显示..."></textarea>
          <div class="tool-result-actions">
            <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('linesResultText').value)">
              ${ICONS.copy} 一键复制
            </button>
          </div>
        </div>
      </div>
    `,
    runLines: (type) => {
      const text = document.getElementById('linesInputText').value;
      const startNum = parseInt(document.getElementById('lineStartNum').value) || 1;
      const delimiter = document.getElementById('lineDelimiter').value;
      const zeroPad = parseInt(document.getElementById('lineZeroPad').value) || 0;

      const lines = text.split('\n');

      if (type === 'add') {
        const total = lines.length + startNum - 1;
        const autoWidth = zeroPad > 0 ? zeroPad : String(total).length;

        const result = lines.map((l, i) => {
          const numStr = String(i + startNum).padStart(autoWidth, '0');
          return `${numStr}${delimiter}${l}`;
        }).join('\n');

        document.getElementById('linesResultText').value = result;
        showToast(`已为 ${lines.length} 行添加行号`, 'success');
      } else {
        const result = lines.map(l => l.replace(/^\s*\d+[\s.:)\-\|]\s*/, '')).join('\n');
        document.getElementById('linesResultText').value = result;
        showToast('已移除现有行号', 'success');
      }
    }
  },


  // 9. 行合并
  'text-join': {
    name: '行合并',
    render: () => `
      <div class="tool-section">
        <label class="tool-section-label">输入文本 (每行一项)</label>
        <textarea id="joinInputText" class="tool-textarea" placeholder="输入要合并的多行文本..." rows="6"></textarea>
      </div>

      <div class="tool-options" style="background: var(--card-bg, #ffffff); border: 1px solid var(--border-color, #e5e7eb); border-radius: 8px; padding: 10px 14px;">
        <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
          <label style="font-size:0.85rem; font-weight:600;">自定义连接符：</label>
          <input type="text" id="joinChar" class="tool-input" value="," style="width:80px;">

          <span style="color:var(--text-secondary); font-size:0.8rem;">快捷预设：</span>
          <button class="tool-result-btn" onclick="document.getElementById('joinChar').value=',';">逗号 ,</button>
          <button class="tool-result-btn" onclick="document.getElementById('joinChar').value=';';">分号 ;</button>
          <button class="tool-result-btn" onclick="document.getElementById('joinChar').value=' ';">空格</button>
          <button class="tool-result-btn" onclick="document.getElementById('joinChar').value='|';">管道符 |</button>
        </div>

        <div style="display: flex; gap: 16px; margin-top: 8px; align-items: center;">
          <label class="tool-option"><input type="checkbox" id="joinIgnoreEmpty" checked> 忽略空白行</label>
          <label class="tool-option"><input type="checkbox" id="joinTrim" checked> 裁切各项首尾空格</label>
          <label class="tool-option"><input type="checkbox" id="joinSqlQuote"> 为每项添加单引号 'val'</label>
        </div>
      </div>

      <div class="tool-options" style="margin-top: 10px;">
        <button class="tool-page-btn primary" onclick="TextTools.run('text-join')">
          ⚡ 立即合并
        </button>
      </div>

      <div class="tool-section" style="margin-top: 14px;">
        <label class="tool-section-label">合并结果</label>
        <div class="tool-result">
          <textarea id="joinResultText" class="tool-textarea" readonly rows="4" placeholder="合并后的单行文本将在此显示..."></textarea>
          <div class="tool-result-actions">
            <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('joinResultText').value)">
              ${ICONS.copy} 一键复制
            </button>
          </div>
        </div>
      </div>
    `,
    run: () => {
      const text = document.getElementById('joinInputText').value;
      const char = document.getElementById('joinChar').value;
      const ignoreEmpty = document.getElementById('joinIgnoreEmpty').checked;
      const trim = document.getElementById('joinTrim').checked;
      const sqlQuote = document.getElementById('joinSqlQuote').checked;

      let lines = text.split('\n');
      if (trim) lines = lines.map(l => l.trim());
      if (ignoreEmpty) lines = lines.filter(l => l.length > 0);
      if (sqlQuote) lines = lines.map(l => `'${l.replace(/'/g, "''")}'`);

      document.getElementById('joinResultText').value = lines.join(char);
      showToast(`已成功合并 ${lines.length} 行`, 'success');
    }
  },


  // 10. 文本分割
  'text-split': {
    name: '文本分割',
    render: () => `
      <div class="tool-section">
        <label class="tool-section-label">输入文本</label>
        <textarea id="splitInputText" class="tool-textarea" placeholder="输入需要拆分/分割的单行或多行文本..." rows="6"></textarea>
      </div>

      <div class="tool-section" style="background: var(--card-bg, #ffffff); border: 1px solid var(--border-color, #e5e7eb); border-radius: 8px; padding: 10px 14px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 8px;">
          <div>
            <label style="font-size:0.85rem; font-weight:600;">分割依据模式：</label>
            <select id="splitMode" class="tool-select" style="margin-top:4px; width:100%;">
              <option value="char" selected>按分隔符分割 (如逗号/分号)</option>
              <option value="chunkLines">按固定行数拆分 (每 N 行成块)</option>
              <option value="chunkLen">按字符长度拆分 (每 N 字符)</option>
            </select>
          </div>
          <div>
            <label style="font-size:0.85rem; font-weight:600;">分隔符 / 数值 N：</label>
            <input type="text" id="splitParam" class="tool-input" value="," style="margin-top:4px;">
          </div>
        </div>

        <div style="display: flex; gap: 16px; align-items: center;">
          <label class="tool-option"><input type="checkbox" id="splitIgnoreEmpty" checked> 过滤空白元素</label>
          <label class="tool-option"><input type="checkbox" id="splitTrim" checked> 自动去除元素首尾空格</label>
        </div>
      </div>

      <div class="tool-options" style="margin-top: 10px;">
        <button class="tool-page-btn primary" onclick="TextTools.run('text-split')">
          ⚡ 立即分割
        </button>
      </div>

      <div class="tool-section" style="margin-top: 14px;">
        <label class="tool-section-label">分割结果 (按行排列)</label>
        <div class="tool-result">
          <textarea id="splitResultText" class="tool-textarea" readonly rows="6" placeholder="分割后的结果将在此显示..."></textarea>
          <div class="tool-result-actions">
            <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('splitResultText').value)">
              ${ICONS.copy} 一键复制
            </button>
          </div>
        </div>
      </div>
    `,
    run: () => {
      const text = document.getElementById('splitInputText').value;
      const mode = document.getElementById('splitMode').value;
      const param = document.getElementById('splitParam').value;
      const ignoreEmpty = document.getElementById('splitIgnoreEmpty').checked;
      const trim = document.getElementById('splitTrim').checked;

      if (!text) {
        showToast('请输入文本', 'error');
        return;
      }

      let result = [];
      if (mode === 'char') {
        if (!param) {
          showToast('请输入分隔符', 'error');
          return;
        }
        result = text.split(param);
      } else if (mode === 'chunkLines') {
        const n = parseInt(param) || 1;
        const lines = text.split('\n');
        for (let i = 0; i < lines.length; i += n) {
          result.push(lines.slice(i, i + n).join('\n'));
        }
      } else if (mode === 'chunkLen') {
        const n = parseInt(param) || 10;
        for (let i = 0; i < text.length; i += n) {
          result.push(text.substring(i, i + n));
        }
      }

      if (trim) result = result.map(s => s.trim());
      if (ignoreEmpty) result = result.filter(s => s.length > 0);

      document.getElementById('splitResultText').value = result.join('\n---\n');
      showToast(`已分割成 ${result.length} 项`, 'success');
    }
  },


  // 11. Markdown 预览
  'markdown-preview': {
    name: 'Markdown预览',
    render: () => `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
        <div class="tool-section" style="margin-bottom:0;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <label class="tool-section-label" style="margin-bottom:0;">Markdown 源码</label>
            <button class="tool-result-btn" onclick="TextTools.loadMdSample()" style="padding:3px 8px; font-size:12px;">📄 载入范文</button>
          </div>
          <textarea id="mdInputText" class="tool-textarea" placeholder="输入 Markdown 文本..." rows="12" oninput="TextTools.renderMd()"></textarea>
        </div>

        <div class="tool-section" style="margin-bottom:0;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <label class="tool-section-label" style="margin-bottom:0;">HTML 实时渲染视图</label>
            <button class="tool-result-btn" onclick="TextTools.copyMdHtml()" style="padding:3px 8px; font-size:12px;">📋 复制 HTML</button>
          </div>
          <div id="mdRenderBox" style="background: var(--card-bg, #ffffff); border: 1px solid var(--border-color, #e5e7eb); border-radius: 8px; padding: 14px; height: 310px; overflow-y: auto; font-size: 14px; line-height: 1.6; color: var(--text-main);"></div>
        </div>
      </div>
    `,
    run: () => TextTools.renderMd()
  },

  loadMdSample: function() {
    const sample = `# 🚀 在线开发者工具箱

这是一份 **Markdown 实时渲染测试范文**。支持多种常用的格式解析：

## 1. 列表与样式
* 支持 **粗体文本** 和 *斜体文本* 以及 ~~删除线~~
* 简单的 \`行内代码\` 与代码块
* [点击访问 AI Studio](https://ai.studio)

## 2. 引用与代码块
> 精巧的 UI 设计与流畅的互动交互，是打造优雅产品的基础。

\`\`\`javascript
function calculateSum(a, b) {
  return a + b;
}
console.log("Sum:", calculateSum(10, 20));
\`\`\`

---
*欢迎开始编辑！*`;
    const el = document.getElementById('mdInputText');
    if (el) {
      el.value = sample;
      this.renderMd();
    }
  },

  renderMd: function() {
    const el = document.getElementById('mdInputText');
    const box = document.getElementById('mdRenderBox');
    if (!el || !box) return;

    const md = el.value;
    if (!md) {
      box.innerHTML = '<span style="color:var(--text-secondary);">等待输入 Markdown...</span>';
      return;
    }

    let html = escapeHtml(md);

    // 代码块
    html = html.replace(/```([\s\S]*?)```/g, (m, p1) => `<pre style="background:#1e293b; color:#f8fafc; padding:10px; border-radius:6px; overflow-x:auto;"><code>${p1}</code></pre>`);
    // 行内代码
    html = html.replace(/`([^`]+)`/g, '<code style="background:#f1f5f9; color:#0f172a; padding:2px 5px; border-radius:4px; font-family:monospace;">$1</code>');
    // 标题
    html = html.replace(/^###### (.*$)/gim, '<h6 style="font-size:0.9rem; font-weight:700; margin:10px 0 4px;">$1</h6>');
    html = html.replace(/^##### (.*$)/gim, '<h5 style="font-size:1.0rem; font-weight:700; margin:10px 0 4px;">$1</h5>');
    html = html.replace(/^#### (.*$)/gim, '<h4 style="font-size:1.1rem; font-weight:700; margin:12px 0 4px;">$1</h4>');
    html = html.replace(/^### (.*$)/gim, '<h3 style="font-size:1.2rem; font-weight:700; margin:14px 0 6px;">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 style="font-size:1.35rem; font-weight:700; margin:16px 0 8px; border-bottom:1px solid #e2e8f0; padding-bottom:4px;">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 style="font-size:1.6rem; font-weight:800; margin:18px 0 10px; border-bottom:2px solid #3b82f6; padding-bottom:6px;">$1</h1>');
    // 引用
    html = html.replace(/^&gt; (.*$)/gim, '<blockquote style="border-left:4px solid #3b82f6; background:#eff6ff; padding:6px 12px; margin:8px 0; color:#1e40af;">$1</blockquote>');
    // 分割线
    html = html.replace(/^---$/gim, '<hr style="border:none; border-top:1px dashed #cbd5e1; margin:16px 0;">');
    // 强调
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/~~(.*?)~~/g, '<del>$1</del>');
    // 链接
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color:#2563eb; text-decoration:underline;">$1</a>');
    // 列表项
    html = html.replace(/^\* (.*$)/gim, '<li style="margin-left:20px;">$1</li>');
    html = html.replace(/^- (.*$)/gim, '<li style="margin-left:20px;">$1</li>');
    // 换行
    html = html.replace(/\n/g, '<br>');

    box.innerHTML = html;
  },

  copyMdHtml: function() {
    const box = document.getElementById('mdRenderBox');
    if (box) {
      copyToClipboard(box.innerHTML);
    }
  },


  // 12. 驼峰命名转换
  'camel-case': {
    name: '驼峰命名转换',
    render: () => `
      <div class="tool-section">
        <label class="tool-section-label">输入任意命名或短语</label>
        <input type="text" id="camelInputText" class="tool-input" placeholder="输入变量名/短语 (例: user_first_name 或 user-profile-card 或 UserAvatar)..." oninput="TextTools.calcCamelCase()">
      </div>

      <div class="tool-section" style="margin-top: 14px;">
        <label class="tool-section-label">全格式派生结果</label>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div style="background:var(--card-bg, #fff); border:1px solid var(--border-color,#e5e7eb); padding:10px; border-radius:6px;">
            <div style="font-size:0.78rem; font-weight:700; color:var(--text-secondary);">小驼峰 (camelCase)</div>
            <div style="display:flex; gap:6px; margin-top:4px;">
              <input type="text" id="resCamel" class="tool-input" readonly style="font-family:monospace;">
              <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('resCamel').value)">复制</button>
            </div>
          </div>

          <div style="background:var(--card-bg, #fff); border:1px solid var(--border-color,#e5e7eb); padding:10px; border-radius:6px;">
            <div style="font-size:0.78rem; font-weight:700; color:var(--text-secondary);">大驼峰 (PascalCase)</div>
            <div style="display:flex; gap:6px; margin-top:4px;">
              <input type="text" id="resPascal" class="tool-input" readonly style="font-family:monospace;">
              <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('resPascal').value)">复制</button>
            </div>
          </div>

          <div style="background:var(--card-bg, #fff); border:1px solid var(--border-color,#e5e7eb); padding:10px; border-radius:6px;">
            <div style="font-size:0.78rem; font-weight:700; color:var(--text-secondary);">下划线/蛇形 (snake_case)</div>
            <div style="display:flex; gap:6px; margin-top:4px;">
              <input type="text" id="resSnake" class="tool-input" readonly style="font-family:monospace;">
              <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('resSnake').value)">复制</button>
            </div>
          </div>

          <div style="background:var(--card-bg, #fff); border:1px solid var(--border-color,#e5e7eb); padding:10px; border-radius:6px;">
            <div style="font-size:0.78rem; font-weight:700; color:var(--text-secondary);">常量大写 (CONSTANT_CASE)</div>
            <div style="display:flex; gap:6px; margin-top:4px;">
              <input type="text" id="resConstant" class="tool-input" readonly style="font-family:monospace;">
              <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('resConstant').value)">复制</button>
            </div>
          </div>

          <div style="background:var(--card-bg, #fff); border:1px solid var(--border-color,#e5e7eb); padding:10px; border-radius:6px;">
            <div style="font-size:0.78rem; font-weight:700; color:var(--text-secondary);">中划线/脊柱 (kebab-case)</div>
            <div style="display:flex; gap:6px; margin-top:4px;">
              <input type="text" id="resKebab" class="tool-input" readonly style="font-family:monospace;">
              <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('resKebab').value)">复制</button>
            </div>
          </div>

          <div style="background:var(--card-bg, #fff); border:1px solid var(--border-color,#e5e7eb); padding:10px; border-radius:6px;">
            <div style="font-size:0.78rem; font-weight:700; color:var(--text-secondary);">点连接 (dot.case)</div>
            <div style="display:flex; gap:6px; margin-top:4px;">
              <input type="text" id="resDot" class="tool-input" readonly style="font-family:monospace;">
              <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('resDot').value)">复制</button>
            </div>
          </div>
        </div>
      </div>
    `,
    run: () => TextTools.calcCamelCase()
  },

  calcCamelCase: function() {
    const text = document.getElementById('camelInputText')?.value.trim() || '';
    if (!text) {
      ['resCamel', 'resPascal', 'resSnake', 'resConstant', 'resKebab', 'resDot'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
      return;
    }

    // 将任何输入拆分为词列表 (Words)
    const words = text
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[-_.\s]+/g, ' ')
      .trim()
      .split(' ')
      .filter(w => w.length > 0);

    const camel = words.map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
    const pascal = words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
    const snake = words.map(w => w.toLowerCase()).join('_');
    const constant = words.map(w => w.toUpperCase()).join('_');
    const kebab = words.map(w => w.toLowerCase()).join('-');
    const dot = words.map(w => w.toLowerCase()).join('.');

    document.getElementById('resCamel').value = camel;
    document.getElementById('resPascal').value = pascal;
    document.getElementById('resSnake').value = snake;
    document.getElementById('resConstant').value = constant;
    document.getElementById('resKebab').value = kebab;
    document.getElementById('resDot').value = dot;
  },


  // 13. 段落去重
  'paragraph-dedup': {
    name: '段落去重',
    render: () => `
      <div class="tool-section">
        <label class="tool-section-label">输入长文本/文章</label>
        <textarea id="paraInputText" class="tool-textarea" placeholder="在此输入包含多个段落的文章或列表..." rows="7"></textarea>
      </div>

      <div class="tool-options" style="background: var(--card-bg, #ffffff); border: 1px solid var(--border-color, #e5e7eb); border-radius: 8px; padding: 10px 14px;">
        <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
          <div>
            <label style="font-size:0.85rem; font-weight:600;">段落分隔标准：</label>
            <select id="paraSplitMode" class="tool-select">
              <option value="double" selected>双换行 (空行分隔标准段落)</option>
              <option value="single">单换行 (每行视为独立段落)</option>
            </select>
          </div>
          <label class="tool-option"><input type="checkbox" id="paraTrim" checked> 忽略段落首尾空白</label>
          <label class="tool-option"><input type="checkbox" id="paraIgnoreCase"> 忽略大小写</label>
        </div>
      </div>

      <div class="tool-options" style="margin-top: 10px;">
        <button class="tool-page-btn primary" onclick="TextTools.run('paragraph-dedup')">
          ⚡ 智能段落去重
        </button>
      </div>

      <div class="tool-section" style="margin-top: 14px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <label class="tool-section-label" style="margin-bottom:0;">结果</label>
          <span id="paraBadge" style="font-size:0.82rem; color:var(--text-secondary);"></span>
        </div>
        <div class="tool-result">
          <textarea id="paraResultText" class="tool-textarea" readonly rows="7" placeholder="去重后的文章段落将在此显示..."></textarea>
          <div class="tool-result-actions">
            <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('paraResultText').value)">
              ${ICONS.copy} 一键复制
            </button>
          </div>
        </div>
      </div>
    `,
    run: () => {
      const text = document.getElementById('paraInputText').value;
      const mode = document.getElementById('paraSplitMode').value;
      const trim = document.getElementById('paraTrim').checked;
      const ignoreCase = document.getElementById('paraIgnoreCase').checked;

      let rawParagraphs = mode === 'double' ? text.split(/\n\s*\n/) : text.split('\n');
      const totalRaw = rawParagraphs.length;

      const seen = new Set();
      const unique = [];

      for (let p of rawParagraphs) {
        let processed = trim ? p.trim() : p;
        if (!processed) continue;

        let key = ignoreCase ? processed.toLowerCase() : processed;
        if (!seen.has(key)) {
          seen.add(key);
          unique.push(processed);
        }
      }

      const joinChar = mode === 'double' ? '\n\n' : '\n';
      document.getElementById('paraResultText').value = unique.join(joinChar);
      document.getElementById('paraBadge').textContent = `原始 ${totalRaw} 段 | 去重后 ${unique.length} 段 | 剔除 ${totalRaw - unique.length} 段`;
      showToast(`已完成段落去重，剩余 ${unique.length} 段`, 'success');
    }
  },


  // 14. Token 统计
  'token-count': {
    name: 'Token 统计',
    render: () => `
      <div class="tool-section">
        <label class="tool-section-label">输入文本 / Prompt</label>
        <textarea id="tokenInputText" class="tool-textarea" placeholder="在此输入需要统计 Token 数量的文本或提示词..." rows="8" oninput="TextTools.calculateTokens()"></textarea>
      </div>

      <div class="tool-options" style="flex-wrap: wrap; gap: 1rem; align-items: center; margin-bottom: 1.5rem;">
        <div class="tool-option">
          <label style="font-weight: 500; font-size: 0.9rem;">Model / 分词算法预设：</label>
          <select id="tokenModel" class="tool-select" onchange="TextTools.calculateTokens()" style="min-width: 180px;">
            <option value="gpt-4o" selected>GPT-4o / GPT-4o-mini (o200k_base)</option>
            <option value="gpt-4">GPT-4 / GPT-3.5-turbo (cl100k_base)</option>
            <option value="claude-3">Claude 3.5 / 3.0 (Anthropic BPE)</option>
            <option value="deepseek">DeepSeek V3 / R1 (Byte-level BPE)</option>
            <option value="gemini">Gemini 1.5 Pro / Flash</option>
            <option value="llama3">Llama 3 / 3.1 / Qwen 2.5</option>
          </select>
        </div>

        <button class="tool-page-btn primary" onclick="TextTools.calculateTokens()">
          ${ICONS.play} 重新计算
        </button>
        <button class="tool-page-btn" onclick="document.getElementById('tokenInputText').value=''; TextTools.calculateTokens()">
          清空文本
        </button>
      </div>

      <div class="tool-section" id="tokenResultSection">
        <label class="tool-section-label">Token 统计指标</label>
        <div class="stats-grid" id="tokenStatsGrid">
          <div class="stat-item"><div class="stat-value" id="statTokenEst">0</div><div class="stat-label">预估 Token 数量</div></div>
          <div class="stat-item"><div class="stat-value" id="statCharCount">0</div><div class="stat-label">总字符数</div></div>
          <div class="stat-item"><div class="stat-value" id="statChineseCount">0</div><div class="stat-label">中文字数</div></div>
          <div class="stat-item"><div class="stat-value" id="statEnglishWords">0</div><div class="stat-label">英文单词数</div></div>
          <div class="stat-item"><div class="stat-value" id="statLinesCount">0</div><div class="stat-label">总行数</div></div>
          <div class="stat-item"><div class="stat-value" id="statCostUsd">$0.0000</div><div class="stat-label">预估输入费用 (Input USD)</div></div>
        </div>
      </div>
    `,
    run: () => {
      TextTools.calculateTokens();
    }
  },

  calculateTokens: () => {
    const textEl = document.getElementById('tokenInputText');
    if (!textEl) return;
    const text = textEl.value;
    const model = document.getElementById('tokenModel') ? document.getElementById('tokenModel').value : 'gpt-4o';

    const charCount = text.length;
    const chineseMatch = text.match(/[\u4e00-\u9fa5]/g) || [];
    const chineseCount = chineseMatch.length;
    const englishWords = text.trim() ? (text.match(/[a-zA-Z0-9_]+/g) || []).length : 0;
    const nonChineseChars = charCount - chineseCount;
    const linesCount = text ? text.split('\n').length : 0;

    let tokenEstimate = 0;
    let costPerKTokens = 0.0025;

    if (!text) {
      tokenEstimate = 0;
    } else {
      switch (model) {
        case 'gpt-4o':
          tokenEstimate = Math.ceil(chineseCount * 0.65 + englishWords * 1.25 + (nonChineseChars - (text.match(/[a-zA-Z0-9_]/g) || []).length) * 0.5);
          costPerKTokens = 0.0025;
          break;
        case 'gpt-4':
          tokenEstimate = Math.ceil(chineseCount * 1.6 + englishWords * 1.3 + (nonChineseChars - (text.match(/[a-zA-Z0-9_]/g) || []).length) * 0.5);
          costPerKTokens = 0.005;
          break;
        case 'claude-3':
          tokenEstimate = Math.ceil(chineseCount * 0.8 + englishWords * 1.25 + (nonChineseChars - (text.match(/[a-zA-Z0-9_]/g) || []).length) * 0.4);
          costPerKTokens = 0.003;
          break;
        case 'deepseek':
          tokenEstimate = Math.ceil(chineseCount * 0.6 + englishWords * 1.2 + (nonChineseChars - (text.match(/[a-zA-Z0-9_]/g) || []).length) * 0.4);
          costPerKTokens = 0.00027;
          break;
        case 'gemini':
          tokenEstimate = Math.ceil(chineseCount * 0.75 + englishWords * 1.25 + (nonChineseChars - (text.match(/[a-zA-Z0-9_]/g) || []).length) * 0.4);
          costPerKTokens = 0.00125;
          break;
        case 'llama3':
          tokenEstimate = Math.ceil(chineseCount * 0.8 + englishWords * 1.2 + (nonChineseChars - (text.match(/[a-zA-Z0-9_]/g) || []).length) * 0.4);
          costPerKTokens = 0.0002;
          break;
        default:
          tokenEstimate = Math.ceil(chineseCount * 1.0 + englishWords * 1.3);
      }
    }

    if (tokenEstimate < 0) tokenEstimate = 0;
    const estCost = ((tokenEstimate / 1000) * costPerKTokens).toFixed(6);

    document.getElementById('statTokenEst').textContent = tokenEstimate.toLocaleString();
    document.getElementById('statCharCount').textContent = charCount.toLocaleString();
    document.getElementById('statChineseCount').textContent = chineseCount.toLocaleString();
    document.getElementById('statEnglishWords').textContent = englishWords.toLocaleString();
    document.getElementById('statLinesCount').textContent = linesCount.toLocaleString();
    document.getElementById('statCostUsd').textContent = `$${estCost}`;
  },


  // 15. 文本加密解密 (移动至加密解密分类，但保持功能完整)
  'text-encrypt': {
    name: '文本加密解密',
    render: () => `
      <div class="tool-section">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <label class="tool-section-label" style="margin-bottom:0;">待处理文本 (Plaintext / Ciphertext)</label>
          <div style="display: flex; gap: 8px;">
            <button class="tool-result-btn" onclick="TextTools.loadEncryptSample()" style="padding: 4px 10px; font-size: 12px;">📄 载入示例明文</button>
            <button class="tool-result-btn" onclick="TextTools.swapEncryptText()" style="padding: 4px 10px; font-size: 12px;">🔄 交换输入与输出</button>
          </div>
        </div>
        <textarea id="encryptInputText" class="tool-textarea" placeholder="在此输入需要加密或解密的文本..." style="min-height: 120px;"></textarea>
      </div>

      <div class="tool-section" style="background: var(--card-bg, #ffffff); border: 1px solid var(--border-color, #e5e7eb); border-radius: 8px; padding: 14px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; align-items: center;">
          <div>
            <label style="font-size:0.85rem; font-weight:600; color:var(--text-main);">加密算法 (Algorithm)</label>
            <select id="encryptAlgo" class="tool-select" style="margin-top:4px; width:100%;">
              <option value="AES-GCM" selected>AES-256-GCM (高强度工业级)</option>
              <option value="AES-CBC">AES-256-CBC (标准分组密码)</option>
              <option value="RC4">RC4 (轻量流加密)</option>
              <option value="XOR">XOR + Salt (高强度加盐异或)</option>
            </select>
          </div>
          <div>
            <label style="font-size:0.85rem; font-weight:600; color:var(--text-main);">输出编码 (Encoding)</label>
            <select id="encryptOutputFormat" class="tool-select" style="margin-top:4px; width:100%;">
              <option value="base64" selected>Base64 (推荐)</option>
              <option value="hex">Hex (16进制)</option>
            </select>
          </div>
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <label style="font-size:0.85rem; font-weight:600; color:var(--text-main);">密钥 (Secret Key)</label>
              <div style="display:flex; gap:4px;">
                <button type="button" onclick="TextTools.genKey(16)" style="background:none; border:none; color:var(--primary-color, #3b82f6); font-size:11px; cursor:pointer; text-decoration:underline;">随机16位</button>
                <button type="button" onclick="TextTools.genKey(32)" style="background:none; border:none; color:var(--primary-color, #3b82f6); font-size:11px; cursor:pointer; text-decoration:underline;">随机32位</button>
              </div>
            </div>
            <input type="text" id="encryptKey" class="tool-input" placeholder="请输入密码/密钥..." value="MySecretPass2026" style="margin-top:4px;">
          </div>
        </div>
      </div>

      <div class="tool-options" style="margin-top: 14px; display: flex; gap: 10px;">
        <button class="tool-page-btn primary" onclick="TextTools.encrypt()">
          🔒 立即加密
        </button>
        <button class="tool-page-btn" onclick="TextTools.decrypt()">
          🔓 立即解密
        </button>
      </div>

      <div class="tool-section" style="margin-top: 14px;">
        <label class="tool-section-label">处理结果 (Result)</label>
        <div class="tool-result">
          <textarea id="encryptResultText" class="tool-textarea" readonly style="min-height: 110px; font-family: monospace;" placeholder="加密或解密的结果将在此显示..."></textarea>
          <div class="tool-result-actions">
            <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('encryptResultText').value)">
              ${ICONS.copy} 一键复制
            </button>
          </div>
        </div>
      </div>
    `,
    encrypt: async () => {
      const text = document.getElementById('encryptInputText').value;
      const key = document.getElementById('encryptKey').value;
      const algo = document.getElementById('encryptAlgo').value;
      const format = document.getElementById('encryptOutputFormat').value;

      if (!text) {
        showToast('请输入待加密的文本', 'error');
        return;
      }
      if (!key) {
        showToast('请输入密钥', 'error');
        return;
      }

      try {
        let resultBytes;

        if (algo === 'AES-GCM' || algo === 'AES-CBC') {
          resultBytes = await aesEncryptSubtle(text, key, algo);
        } else if (algo === 'RC4') {
          resultBytes = rc4Transform(text, key);
        } else {
          resultBytes = xorTransform(text, key);
        }

        let outputStr = '';
        if (format === 'hex') {
          outputStr = Array.from(resultBytes).map(b => b.toString(16).padStart(2, '0')).join('');
        } else {
          outputStr = uint8ToBase64(resultBytes);
        }

        document.getElementById('encryptResultText').value = outputStr;
        showToast(`${algo} 加密成功！`, 'success');
      } catch (e) {
        console.error(e);
        showToast('加密失败: ' + e.message, 'error');
      }
    },

    decrypt: async () => {
      const ciphertext = document.getElementById('encryptInputText').value.trim();
      const key = document.getElementById('encryptKey').value;
      const algo = document.getElementById('encryptAlgo').value;
      const format = document.getElementById('encryptOutputFormat').value;

      if (!ciphertext) {
        showToast('请输入密文', 'error');
        return;
      }
      if (!key) {
        showToast('请输入密钥', 'error');
        return;
      }

      try {
        let cipherBytes;
        if (format === 'hex') {
          cipherBytes = hexToUint8(ciphertext);
        } else {
          cipherBytes = base64ToUint8(ciphertext);
        }

        let plaintext = '';
        if (algo === 'AES-GCM' || algo === 'AES-CBC') {
          plaintext = await aesDecryptSubtle(cipherBytes, key, algo);
        } else if (algo === 'RC4') {
          plaintext = rc4DecryptTransform(cipherBytes, key);
        } else {
          plaintext = xorDecryptTransform(cipherBytes, key);
        }

        document.getElementById('encryptResultText').value = plaintext;
        showToast(`${algo} 解密成功！`, 'success');
      } catch (e) {
        console.error(e);
        showToast('解密失败，请检查密钥、算法或密文是否正确', 'error');
      }
    }
  },

  loadEncryptSample: function() {
    const text = 'Hello AI Studio 2026! 这是高度机密的对称加密测试消息，包含中文与字符：!@#$%^&*()';
    document.getElementById('encryptInputText').value = text;
    showToast('已载入测试明文', 'info');
  },

  swapEncryptText: function() {
    const resultVal = document.getElementById('encryptResultText').value;
    if (!resultVal) return;
    document.getElementById('encryptInputText').value = resultVal;
    document.getElementById('encryptResultText').value = '';
    showToast('已交换输入与结果', 'info');
  },

  genKey: function(len) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let res = '';
    for (let i = 0; i < len; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    document.getElementById('encryptKey').value = res;
    showToast(`已生成 ${len} 位随机密钥`, 'success');
  },

  encrypt: function() {
    if (this['text-encrypt'] && typeof this['text-encrypt'].encrypt === 'function') {
      return this['text-encrypt'].encrypt();
    }
  },

  decrypt: function() {
    if (this['text-encrypt'] && typeof this['text-encrypt'].decrypt === 'function') {
      return this['text-encrypt'].decrypt();
    }
  },

  // 在线翻译 (原 translate-card)
  'translate-card': {
    name: '在线翻译',
    render: () => `
      <div class="tool-section">
        <div class="tool-controls" style="margin-bottom:1rem;flex-wrap:wrap;gap:0.75rem;">
          <div class="tool-control-group">
            <label>翻译方向:</label>
            <select id="translateMode" style="padding:0.4rem 0.6rem;border-radius:6px;border:1px solid var(--border-color);background:var(--bg-secondary);color:var(--text-primary);">
              <option value="auto">🌐 自动检测语言</option>
              <option value="en2zh">🔤 英文 ➔ 中文</option>
              <option value="zh2en">🀄 中文 ➔ 英文</option>
            </select>
          </div>

          <button class="tool-btn secondary" onclick="TextTools['translate-card'].swapLang()">🔄 切换方向</button>

          <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-left:auto;">
            <button class="tool-result-btn" onclick="TextTools['translate-card'].loadSample('quote')" style="padding:4px 8px;font-size:12px;">💬 励志名言</button>
            <button class="tool-result-btn" onclick="TextTools['translate-card'].loadSample('tech')" style="padding:4px 8px;font-size:12px;">💻 科技短句</button>
            <button class="tool-result-btn" onclick="TextTools['translate-card'].loadSample('business')" style="padding:4px 8px;font-size:12px;">✉️ 商务沟通</button>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;" class="translate-boxes-grid">
          <!-- 输入框 -->
          <div style="display:flex;flex-direction:column;gap:0.5rem;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <label class="tool-section-label" style="margin-bottom:0;font-weight:600;">输入待翻译文本</label>
              <button class="tool-result-btn" onclick="TextTools['translate-card'].clearAll()" style="padding:2px 6px;font-size:12px;">🗑️ 清空</button>
            </div>
            <textarea id="translateInputText" class="tool-textarea" style="height:160px;resize:vertical;" placeholder="在此输入需要翻译的英文短句、段落或中文文本... (支持 Ctrl + Enter 快捷翻译)" oninput="TextTools['translate-card'].updateCharCount()" onkeydown="if((event.ctrlKey||event.metaKey)&&event.key==='Enter'){TextTools['translate-card'].translate();event.preventDefault();}"></textarea>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:0.25rem;">
              <span style="font-size:0.8rem;color:var(--text-tertiary);" id="translateCharCounter">字符数: 0</span>
              <button class="tool-btn primary" id="translateBtn" onclick="TextTools['translate-card'].translate()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;margin-right:4px;"><path d="M5 8l6 6M4 14l6-6 2 2M2 5h12M7 2v3M22 22l-5-10-5 10M14 18h6"/></svg>
                开始翻译
              </button>
            </div>
          </div>

          <!-- 翻译结果输入框 -->
          <div style="display:flex;flex-direction:column;gap:0.5rem;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <label class="tool-section-label" style="margin-bottom:0;font-weight:600;">翻译结果</label>
              <div style="display:flex;gap:0.35rem;">
                <button class="tool-result-btn" onclick="TextTools['translate-card'].speakCurrent('target')" title="朗读译文" style="padding:2px 8px;font-size:12px;">🔊 朗读</button>
                <button class="tool-result-btn primary" onclick="TextTools['translate-card'].copyTranslation()" style="padding:2px 8px;font-size:12px;font-weight:600;">📋 一键复制</button>
              </div>
            </div>
            <textarea id="translateOutputText" class="tool-textarea" style="height:160px;resize:vertical;background:var(--bg-secondary);" placeholder="翻译结果将实时显示在此输入框中..." readonly></textarea>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:0.25rem;">
              <span style="font-size:0.8rem;color:var(--text-tertiary);" id="translateStatusText">等待翻译</span>
              <button class="tool-btn secondary" onclick="TextTools['translate-card'].copyTranslation()">
                📋 一键复制译文
              </button>
            </div>
          </div>
        </div>

        <!-- 详细信息扩展 (如词汇与语法说明) -->
        <div id="translateExtraInfoBox" style="display:none;margin-top:1.25rem;padding:1rem;background:var(--bg-secondary);border-radius:8px;border:1px solid var(--border-color);">
          <div style="font-size:0.85rem;font-weight:600;margin-bottom:0.5rem;color:var(--text-primary);">📌 重点词汇与解析</div>
          <div id="translateExtraKeywords" style="font-size:0.82rem;color:var(--text-secondary);display:flex;flex-wrap:wrap;gap:0.75rem;"></div>
          <div id="translateExtraNotes" style="font-size:0.82rem;color:var(--text-tertiary);margin-top:0.5rem;font-style:italic;"></div>
        </div>
      </div>
    `,
    
    currentData: null,

    updateCharCount() {
      const val = document.getElementById('translateInputText')?.value || '';
      const counter = document.getElementById('translateCharCounter');
      if (counter) counter.innerText = `字符数: ${val.length}`;
    },

    clearAll() {
      const input = document.getElementById('translateInputText');
      const output = document.getElementById('translateOutputText');
      const extra = document.getElementById('translateExtraInfoBox');
      const status = document.getElementById('translateStatusText');
      if (input) input.value = '';
      if (output) output.value = '';
      if (extra) extra.style.display = 'none';
      if (status) status.innerText = '等待翻译';
      this.currentData = null;
      this.updateCharCount();
      showToast('已清空内容', 'info');
    },

    swapLang() {
      const select = document.getElementById('translateMode');
      if (!select) return;
      if (select.value === 'en2zh') select.value = 'zh2en';
      else if (select.value === 'zh2en') select.value = 'en2zh';
      else select.value = 'en2zh';
      showToast('已切换翻译方向', 'info');
    },

    loadSample(type) {
      const input = document.getElementById('translateInputText');
      const mode = document.getElementById('translateMode');
      if (!input) return;

      if (type === 'quote') {
        input.value = "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle.";
        if (mode) mode.value = 'en2zh';
      } else if (type === 'tech') {
        input.value = "Artificial intelligence and cloud computing are empowering modern software developers to build applications at unprecedented speeds.";
        if (mode) mode.value = 'en2zh';
      } else if (type === 'business') {
        input.value = "非常感谢您在项目评审会议上的宝贵建议，我们已针对系统性能和用户体验进行了全面优化。";
        if (mode) mode.value = 'zh2en';
      }
      this.updateCharCount();
      showToast('已载入示例文本', 'info');
    },

    async translate() {
      const input = document.getElementById('translateInputText');
      if (!input || !input.value.trim()) {
        showToast('请输入需要翻译的文本内容', 'info');
        return;
      }

      const text = input.value.trim();
      const mode = document.getElementById('translateMode')?.value || 'auto';
      const btn = document.getElementById('translateBtn');
      const output = document.getElementById('translateOutputText');
      const status = document.getElementById('translateStatusText');

      if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<span class="loading-spinner" style="width:14px;height:14px;border-width:2px;display:inline-block;vertical-align:middle;margin-right:6px;"></span> 翻译中...`;
      }
      if (output) {
        output.value = '正在翻译中，请稍候...';
      }
      if (status) {
        status.innerText = '翻译中...';
      }

      try {
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, mode })
        });

        if (!response.ok) {
          throw new Error(`HTTP Error ${response.status}`);
        }

        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }

        this.currentData = {
          sourceText: text,
          translatedText: data.translatedText || '',
          sourceLang: data.sourceLang || 'en',
          targetLang: data.targetLang || 'zh',
          phonetic: data.phonetic || '',
          keywords: data.keywords || [],
          notes: data.notes || '',
          provider: data.provider || 'AI Engine'
        };

        if (output) {
          output.value = this.currentData.translatedText;
        }

        if (status) {
          status.innerText = `引擎: ${this.currentData.provider}`;
        }

        // Render extra info if available
        const extraBox = document.getElementById('translateExtraInfoBox');
        const extraKw = document.getElementById('translateExtraKeywords');
        const extraNotes = document.getElementById('translateExtraNotes');

        if (extraBox && (data.keywords?.length > 0 || data.notes)) {
          if (extraKw && data.keywords?.length > 0) {
            extraKw.innerHTML = data.keywords.map(k => `
              <span style="background:var(--bg-primary);padding:3px 8px;border-radius:4px;border:1px solid var(--border-color);">
                <strong>${escapeHtml(k.word)}</strong>: ${escapeHtml(k.meaning)}
              </span>
            `).join('');
          } else if (extraKw) {
            extraKw.innerHTML = '';
          }

          if (extraNotes && data.notes) {
            extraNotes.innerText = '💡 提示: ' + data.notes;
          } else if (extraNotes) {
            extraNotes.innerText = '';
          }

          extraBox.style.display = 'block';
        } else if (extraBox) {
          extraBox.style.display = 'none';
        }

        showToast('翻译成功！', 'success');
      } catch (err) {
        console.error('Translation error:', err);
        if (output) output.value = '翻译失败：' + err.message;
        showToast('翻译异常：' + err.message, 'error');
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;margin-right:4px;"><path d="M5 8l6 6M4 14l6-6 2 2M2 5h12M7 2v3M22 22l-5-10-5 10M14 18h6"/></svg> 开始翻译`;
        }
      }
    },

    speakCurrent(type) {
      if (!this.currentData && type === 'target') {
        const outVal = document.getElementById('translateOutputText')?.value;
        if (!outVal || outVal.startsWith('正在翻译') || outVal.startsWith('翻译失败')) {
          showToast('暂无译文可供朗读', 'info');
          return;
        }
      }

      if (!('speechSynthesis' in window)) {
        showToast('您的浏览器不支持语音朗读', 'info');
        return;
      }

      window.speechSynthesis.cancel();
      const text = type === 'source' ? (this.currentData?.sourceText || document.getElementById('translateInputText')?.value) : (this.currentData?.translatedText || document.getElementById('translateOutputText')?.value);
      if (!text) return;

      const lang = type === 'source' ? (this.currentData?.sourceLang === 'zh' ? 'zh-CN' : 'en-US') : (this.currentData?.targetLang === 'zh' ? 'zh-CN' : 'en-US');

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.95;

      window.speechSynthesis.speak(utterance);
      showToast(`正在播放朗读...`, 'info');
    },

    copyTranslation() {
      const output = document.getElementById('translateOutputText');
      if (!output || !output.value || output.value.startsWith('正在翻译') || output.value.startsWith('翻译失败')) {
        showToast('暂无译文可供复制', 'info');
        return;
      }
      copyToClipboard(output.value);
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


// -------------------------------------------------------------
// 加解密辅助函数 (AES / RC4 / XOR / Base64 / Hex)
// -------------------------------------------------------------

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
}

async function aesEncryptSubtle(text, password, mode) {
  const encoder = new TextEncoder();
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const ivLen = mode === 'AES-GCM' ? 12 : 16;
  const iv = window.crypto.getRandomValues(new Uint8Array(ivLen));

  const keyMaterial = await window.crypto.subtle.importKey(
    'raw', encoder.encode(password), { name: 'PBKDF2' }, false, ['deriveKey']
  );

  const key = await window.crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 50000, hash: 'SHA-256' },
    keyMaterial,
    { name: mode, length: 256 },
    false,
    ['encrypt']
  );

  const encryptedBuf = await window.crypto.subtle.encrypt(
    { name: mode, iv },
    key,
    encoder.encode(text)
  );

  const combined = new Uint8Array(salt.length + iv.length + encryptedBuf.byteLength);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(encryptedBuf), salt.length + iv.length);

  return combined;
}

async function aesDecryptSubtle(combinedBytes, password, mode) {
  const ivLen = mode === 'AES-GCM' ? 12 : 16;
  if (combinedBytes.length < 16 + ivLen + 1) {
    throw new Error('密文数据过短');
  }

  const salt = combinedBytes.slice(0, 16);
  const iv = combinedBytes.slice(16, 16 + ivLen);
  const data = combinedBytes.slice(16 + ivLen);

  const encoder = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw', encoder.encode(password), { name: 'PBKDF2' }, false, ['deriveKey']
  );

  const key = await window.crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 50000, hash: 'SHA-256' },
    keyMaterial,
    { name: mode, length: 256 },
    false,
    ['decrypt']
  );

  const decryptedBuf = await window.crypto.subtle.decrypt(
    { name: mode, iv },
    key,
    data
  );

  return new TextDecoder().decode(decryptedBuf);
}

function rc4Transform(text, keyStr) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const key = encoder.encode(keyStr);

  const S = new Uint8Array(256);
  for (let i = 0; i < 256; i++) S[i] = i;

  let j = 0;
  for (let i = 0; i < 256; i++) {
    j = (j + S[i] + key[i % key.length]) % 256;
    let temp = S[i]; S[i] = S[j]; S[j] = temp;
  }

  let i = 0; j = 0;
  const result = new Uint8Array(data.length);
  for (let k = 0; k < data.length; k++) {
    i = (i + 1) % 256;
    j = (j + S[i]) % 256;
    let temp = S[i]; S[i] = S[j]; S[j] = temp;
    let K = S[(S[i] + S[j]) % 256];
    result[k] = data[k] ^ K;
  }
  return result;
}

function rc4DecryptTransform(bytes, keyStr) {
  const encoder = new TextEncoder();
  const key = encoder.encode(keyStr);

  const S = new Uint8Array(256);
  for (let i = 0; i < 256; i++) S[i] = i;

  let j = 0;
  for (let i = 0; i < 256; i++) {
    j = (j + S[i] + key[i % key.length]) % 256;
    let temp = S[i]; S[i] = S[j]; S[j] = temp;
  }

  let i = 0; j = 0;
  const result = new Uint8Array(bytes.length);
  for (let k = 0; k < bytes.length; k++) {
    i = (i + 1) % 256;
    j = (j + S[i]) % 256;
    let temp = S[i]; S[i] = S[j]; S[j] = temp;
    let K = S[(S[i] + S[j]) % 256];
    result[k] = bytes[k] ^ K;
  }
  return new TextDecoder().decode(result);
}

function xorTransform(text, keyStr) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const key = encoder.encode(keyStr);
  const result = new Uint8Array(data.length);

  for (let i = 0; i < data.length; i++) {
    result[i] = data[i] ^ key[i % key.length] ^ ((i * 13) & 0xff);
  }
  return result;
}

function xorDecryptTransform(bytes, keyStr) {
  const encoder = new TextEncoder();
  const key = encoder.encode(keyStr);
  const result = new Uint8Array(bytes.length);

  for (let i = 0; i < bytes.length; i++) {
    result[i] = bytes[i] ^ key[i % key.length] ^ ((i * 13) & 0xff);
  }
  return new TextDecoder().decode(result);
}

function uint8ToBase64(bytes) {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function base64ToUint8(b64Str) {
  const binary = window.atob(b64Str.replace(/[\r\n\s]/g, ''));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function hexToUint8(hexStr) {
  const clean = hexStr.replace(/[^0-9a-fA-F]/g, '');
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < clean.length; i += 2) {
    bytes[i / 2] = parseInt(clean.substring(i, i + 2), 16);
  }
  return bytes;
}
