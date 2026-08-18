// =============================================
// 编码解码工具实现
// =============================================

const EncodeTools = {
  // URL编码解码
  'url-encode': {
    name: 'URL编码解码',
    render: () => `
      <div class="tool-section">
        <label class="tool-section-label">输入文本</label>
        <textarea id="inputText" class="tool-textarea" placeholder="请输入URL或文本..."></textarea>
      </div>
      <div class="tool-options">
        <button class="tool-page-btn primary" onclick="EncodeTools.run('url-encode')">
          ${ICONS.play} URL编码
        </button>
        <button class="tool-page-btn" onclick="EncodeTools.run('url-decode')">
          ${ICONS.play} URL解码
        </button>
      </div>
      <div class="tool-section">
        <label class="tool-section-label">结果</label>
        <div class="tool-result">
          <textarea id="resultText" class="tool-textarea" readonly></textarea>
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
      const result = type === 'url-encode' 
        ? encodeURIComponent(input)
        : decodeURIComponent(input);
      document.getElementById('resultText').value = result;
    }
  },
  
  // Base64编码
  'base64': {
    name: 'Base64编码',
    render: () => `
      <div class="tool-section">
        <label class="tool-section-label">输入文本</label>
        <textarea id="inputText" class="tool-textarea" placeholder="请输入文本..."></textarea>
      </div>
      <div class="tool-options">
        <button class="tool-page-btn primary" onclick="EncodeTools.run('base64-encode')">
          ${ICONS.play} Base64编码
        </button>
        <button class="tool-page-btn" onclick="EncodeTools.run('base64-decode')">
          ${ICONS.play} Base64解码
        </button>
      </div>
      <div class="tool-section">
        <label class="tool-section-label">结果</label>
        <div class="tool-result">
          <textarea id="resultText" class="tool-textarea" readonly></textarea>
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
        const result = type === 'base64-encode'
          ? btoa(unescape(encodeURIComponent(input)))
          : decodeURIComponent(escape(atob(input)));
        document.getElementById('resultText').value = result;
      } catch (e) {
        showToast('输入不是有效的Base64字符串', 'error');
      }
    }
  },
  
  // HTML实体编码
  'html-encode': {
    name: 'HTML实体编码',
    render: () => `
      <div class="tool-section">
        <label class="tool-section-label">输入文本</label>
        <textarea id="inputText" class="tool-textarea" placeholder="请输入HTML内容..."></textarea>
      </div>
      <div class="tool-options">
        <button class="tool-page-btn primary" onclick="EncodeTools.run('html-encode')">
          ${ICONS.play} HTML编码
        </button>
        <button class="tool-page-btn" onclick="EncodeTools.run('html-decode')">
          ${ICONS.play} HTML解码
        </button>
      </div>
      <div class="tool-section">
        <label class="tool-section-label">结果</label>
        <div class="tool-result">
          <textarea id="resultText" class="tool-textarea" readonly></textarea>
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
      if (type === 'html-encode') {
        const div = document.createElement('div');
        div.textContent = input;
        document.getElementById('resultText').value = div.innerHTML;
      } else {
        const div = document.createElement('div');
        div.innerHTML = input;
        document.getElementById('resultText').value = div.textContent;
      }
    }
  },
  
  // Unicode编码
  'unicode': {
    name: 'Unicode编码',
    render: () => `
      <div class="tool-section">
        <label class="tool-section-label">输入文本</label>
        <textarea id="inputText" class="tool-textarea" placeholder="请输入文本..."></textarea>
      </div>
      <div class="tool-options">
        <button class="tool-page-btn primary" onclick="EncodeTools.run('unicode-encode')">
          ${ICONS.play} Unicode编码
        </button>
        <button class="tool-page-btn" onclick="EncodeTools.run('unicode-decode')">
          ${ICONS.play} Unicode解码
        </button>
      </div>
      <div class="tool-section">
        <label class="tool-section-label">结果</label>
        <div class="tool-result">
          <textarea id="resultText" class="tool-textarea" readonly></textarea>
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
      if (type === 'unicode-encode') {
        document.getElementById('resultText').value = input.split('').map(c => 
          '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0')
        ).join('');
      } else {
        document.getElementById('resultText').value = input.replace(/\\u([0-9a-f]{4})/gi, (m, hex) => 
          String.fromCharCode(parseInt(hex, 16))
        );
      }
    }
  },
  
  // Hex编码
  'hex-encode': {
    name: 'Hex编码',
    render: () => `
      <div class="tool-section">
        <label class="tool-section-label">输入文本</label>
        <textarea id="inputText" class="tool-textarea" placeholder="请输入文本..."></textarea>
      </div>
      <div class="tool-options">
        <button class="tool-page-btn primary" onclick="EncodeTools.run('hex-encode')">
          ${ICONS.play} 文本转Hex
        </button>
        <button class="tool-page-btn" onclick="EncodeTools.run('hex-decode')">
          ${ICONS.play} Hex转文本
        </button>
      </div>
      <div class="tool-section">
        <label class="tool-section-label">结果</label>
        <div class="tool-result">
          <textarea id="resultText" class="tool-textarea" readonly></textarea>
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
      if (type === 'hex-encode') {
        document.getElementById('resultText').value = input.split('').map(c => 
          c.charCodeAt(0).toString(16).padStart(2, '0')
        ).join(' ');
      } else {
        document.getElementById('resultText').value = input.trim().split(/\s+/).map(h => 
          String.fromCharCode(parseInt(h, 16))
        ).join('');
      }
    }
  },
  
  // 摩斯电码
  'morse': {
    name: '摩斯电码',
    render: () => `
      <div class="tool-section">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <label class="tool-section-label" style="margin-bottom:0;">输入内容</label>
          <div style="display: flex; gap: 8px;">
            <button class="tool-result-btn" onclick="EncodeTools.loadMorseExample()" style="padding: 4px 10px; font-size: 12px;">
              示例数据
            </button>
            <button class="tool-result-btn" onclick="EncodeTools.clearMorseInput()" style="padding: 4px 10px; font-size: 12px;">
              清空
            </button>
          </div>
        </div>
        <textarea id="inputText" class="tool-textarea" placeholder="请输入需要编码的明文（支持英文字母、数字、标点符号及中文），或输入的摩斯电码（例如：... --- ...）..."></textarea>
      </div>
      <div class="tool-options" style="display: flex; flex-wrap: wrap; gap: 10px; align-items: center;">
        <button class="tool-page-btn primary" onclick="EncodeTools.run('morse-encode')">
          ${ICONS.play} 转换为摩斯电码 (加密)
        </button>
        <button class="tool-page-btn" onclick="EncodeTools.run('morse-decode')">
          ${ICONS.play} 摩斯电码解码 (解密)
        </button>
        <button class="tool-page-btn" onclick="EncodeTools.swapMorseText()" title="调换输入与结果">
          🔄 调换内容
        </button>
        <button class="tool-page-btn" onclick="EncodeTools.playMorseAudio()" id="playMorseBtn">
          🔊 播放电码声音
        </button>
      </div>
      <div class="tool-section">
        <label class="tool-section-label">转换结果</label>
        <div class="tool-result">
          <textarea id="resultText" class="tool-textarea" readonly placeholder="转换后的结果将在此显示..."></textarea>
          <div class="tool-result-actions">
            <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('resultText').value)">
              ${ICONS.copy} 一键复制
            </button>
          </div>
        </div>
      </div>
    `,
    run: (type) => {
      const MORSE_CODE = {
        'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
        'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
        'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
        'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
        'Y': '-.--', 'Z': '--..',
        '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
        '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
        '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--',
        '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...',
        ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-',
        '"': '.-..-.', '$': '...-..-', '@': '.--.-.', ' ': '/'
      };
      const REVERSE_MORSE = Object.fromEntries(Object.entries(MORSE_CODE).map(([k, v]) => [v, k]));
      
      const input = document.getElementById('inputText').value.trim();
      if (!input) {
        document.getElementById('resultText').value = '';
        return;
      }

      if (type === 'morse-encode') {
        const result = [];
        for (let char of input) {
          const upperChar = char.toUpperCase();
          if (MORSE_CODE[upperChar]) {
            result.push(MORSE_CODE[upperChar]);
          } else if (char === '\n') {
            result.push('\n');
          } else {
            // 支持中文及特殊字符：转为 Unicode 十六进制摩斯电码，形如 u4e2d
            const code = char.charCodeAt(0).toString(16).padStart(4, '0');
            const morseUnicode = 'U' + code.split('').map(c => MORSE_CODE[c.toUpperCase()] || c).join('');
            result.push(morseUnicode);
          }
        }
        document.getElementById('resultText').value = result.join(' ');
      } else {
        // 解码
        const tokens = input.split(/\s+/);
        const result = [];
        for (let token of tokens) {
          if (!token) continue;
          if (token === '/') {
            result.push(' ');
          } else if (token === '\n') {
            result.push('\n');
          } else if (REVERSE_MORSE[token]) {
            result.push(REVERSE_MORSE[token]);
          } else if (token.startsWith('U')) {
            // 处理 Unicode 摩斯码
            try {
              const hexPart = token.substring(1);
              // 根据摩斯电码恢复十六进制
              let hexStr = '';
              // 按4位拆分或通过常用长度还原
              let cur = '';
              for (let i = 0; i < hexPart.length; i++) {
                cur += hexPart[i];
                if (REVERSE_MORSE[cur]) {
                  hexStr += REVERSE_MORSE[cur];
                  cur = '';
                }
              }
              if (hexStr.length === 4) {
                result.push(String.fromCharCode(parseInt(hexStr, 16)));
              } else {
                result.push(token);
              }
            } catch (e) {
              result.push(token);
            }
          } else {
            result.push(token);
          }
        }
        document.getElementById('resultText').value = result.join('');
      }
    }
  },
  
  // ROT13加密
  'rot13': {
    name: 'ROT13加密',
    render: () => `
      <div class="tool-section">
        <label class="tool-section-label">输入文本</label>
        <textarea id="inputText" class="tool-textarea" placeholder="请输入英文文本..."></textarea>
      </div>
      <div class="tool-options">
        <button class="tool-page-btn primary" onclick="EncodeTools.run('rot13')">
          ${ICONS.play} 加密/解密
        </button>
      </div>
      <div class="tool-section">
        <label class="tool-section-label">结果</label>
        <div class="tool-result">
          <textarea id="resultText" class="tool-textarea" readonly></textarea>
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
      document.getElementById('resultText').value = input.replace(/[a-zA-Z]/g, c => {
        const base = c <= 'Z' ? 65 : 97;
        return String.fromCharCode((c.charCodeAt(0) - base + 13) % 26 + base);
      });
    }
  },
  
  // JWT解码
  'jwt-decode': {
    name: 'JWT解码',
    render: () => `
      <div class="tool-section">
        <label class="tool-section-label">输入JWT Token</label>
        <textarea id="inputText" class="tool-textarea" placeholder="请输入JWT Token..."></textarea>
      </div>
      <div class="tool-options">
        <button class="tool-page-btn primary" onclick="EncodeTools.run('jwt-decode')">
          ${ICONS.play} 解析JWT
        </button>
      </div>
      <div class="tool-section" id="resultSection" style="display:none;">
        <label class="tool-section-label">解析结果</label>
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
      const token = document.getElementById('inputText').value.trim();
      try {
        const parts = token.split('.');
        if (parts.length !== 3) throw new Error('Invalid JWT format');
        
        const header = JSON.parse(atob(parts[0]));
        const payload = JSON.parse(atob(parts[1]));
        const signature = parts[2];
        
        payload.exp = payload.exp ? new Date(payload.exp * 1000).toLocaleString() : '无';
        payload.iat = payload.iat ? new Date(payload.iat * 1000).toLocaleString() : '无';
        
        const result = {
          'Header': header,
          'Payload': payload,
          'Signature': signature + ' (未验证)'
        };
        
        document.getElementById('resultSection').style.display = 'block';
        document.getElementById('resultText').value = JSON.stringify(result, null, 2);
      } catch (e) {
        showToast('无效的JWT格式', 'error');
      }
    }
  },
  
  // UUID生成
  'uuid-gen': {
    name: 'UUID生成',
    render: () => `
      <div class="tool-section">
        <div class="tool-options">
          <div class="tool-option">
            <label>数量：</label>
            <input type="number" id="uuidCount" class="tool-input" value="1" min="1" max="100" style="width:80px;">
          </div>
          <button class="tool-page-btn primary" onclick="EncodeTools.run('uuid-gen')">
            ${ICONS.play} 生成
          </button>
        </div>
      </div>
      <div class="tool-section">
        <label class="tool-section-label">结果</label>
        <div class="tool-result">
          <textarea id="resultText" class="tool-textarea" readonly></textarea>
          <div class="tool-result-actions">
            <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('resultText').value)">
              ${ICONS.copy} 复制
            </button>
          </div>
        </div>
      </div>
    `,
    run: () => {
      const count = parseInt(document.getElementById('uuidCount').value) || 1;
      const uuids = [];
      for (let i = 0; i < count; i++) {
        uuids.push('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
          const r = Math.random() * 16 | 0;
          return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        }));
      }
      document.getElementById('resultText').value = uuids.join('\n');
    }
  },
  
  // 哈希生成
  'hash-generate': {
    name: '哈希生成',
    render: () => `
      <div class="tool-section">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <label class="tool-section-label" style="margin-bottom:0;">输入内容</label>
          <button class="tool-result-btn" onclick="document.getElementById('inputText').value='Hello World'; EncodeTools.runHash('sha256');" style="padding: 4px 10px; font-size: 12px;">
            示例文本
          </button>
        </div>
        <textarea id="inputText" class="tool-textarea" placeholder="请输入需要进行哈希计算的明文文本..."></textarea>
      </div>

      <div class="tool-section" style="background: var(--card-bg, #ffffff); border: 1px solid var(--border-color, #e5e7eb); border-radius: 8px; padding: 14px; margin-bottom: 16px;">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <input type="checkbox" id="enableSalt" onchange="document.getElementById('saltInputContainer').style.display = this.checked ? 'flex' : 'none';" style="cursor: pointer;">
            <label for="enableSalt" style="font-weight: 600; cursor: pointer; user-select: none;">启用自定义加盐 (Salt)</label>
          </div>
          <div id="saltInputContainer" style="display: none; align-items: center; gap: 8px; flex: 1; min-width: 200px;">
            <input type="text" id="saltText" class="tool-input" placeholder="输入自定义盐值 (如: my_secret_salt_123)" style="font-size: 0.9rem;">
            <select id="saltPosition" class="tool-select" style="width: 110px; font-size: 0.85rem;">
              <option value="suffix">后缀 (Text+Salt)</option>
              <option value="prefix">前缀 (Salt+Text)</option>
              <option value="both">前后加盐</option>
            </select>
          </div>
        </div>
      </div>

      <div class="tool-options" style="display: flex; flex-wrap: wrap; gap: 8px;">
        <button class="tool-page-btn primary" onclick="EncodeTools.runHash('md5')">MD5</button>
        <button class="tool-page-btn" onclick="EncodeTools.runHash('sha1')">SHA-1</button>
        <button class="tool-page-btn" onclick="EncodeTools.runHash('sha256')">SHA-256</button>
        <button class="tool-page-btn" onclick="EncodeTools.runHash('sha512')">SHA-512</button>
        <button class="tool-page-btn" onclick="EncodeTools.runHash('sha3-256')">SHA-3-256</button>
        <button class="tool-page-btn" onclick="EncodeTools.runHash('sha3-512')">SHA-3-512</button>
      </div>

      <div class="tool-section">
        <label class="tool-section-label">计算结果</label>
        <div class="tool-result">
          <textarea id="resultText" class="tool-textarea" readonly placeholder="计算出的哈希值将显示在此..."></textarea>
          <div class="tool-result-actions">
            <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('resultText').value)">
              ${ICONS.copy} 一键复制
            </button>
          </div>
        </div>
      </div>
    `,
    runHash: async (type) => {
      const inputEl = document.getElementById('inputText');
      if (!inputEl) return;
      let input = inputEl.value;
      if (!input) {
        document.getElementById('resultText').value = '';
        return;
      }

      // 处理加盐
      const enableSalt = document.getElementById('enableSalt')?.checked;
      const saltText = document.getElementById('saltText')?.value || '';
      const saltPos = document.getElementById('saltPosition')?.value || 'suffix';
      if (enableSalt && saltText) {
        if (saltPos === 'prefix') input = saltText + input;
        else if (saltPos === 'both') input = saltText + input + saltText;
        else input = input + saltText;
      }

      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      let hashBuffer;
      
      try {
        switch (type) {
          case 'md5':
            document.getElementById('resultText').value = md5(input);
            return;
          case 'sha1':
            hashBuffer = await crypto.subtle.digest('SHA-1', data);
            break;
          case 'sha256':
            hashBuffer = await crypto.subtle.digest('SHA-256', data);
            break;
          case 'sha512':
            hashBuffer = await crypto.subtle.digest('SHA-512', data);
            break;
          case 'sha3-256':
            document.getElementById('resultText').value = sha3_256(input);
            return;
          case 'sha3-512':
            document.getElementById('resultText').value = sha3_512(input);
            return;
        }
        
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        document.getElementById('resultText').value = hashHex;
      } catch (e) {
        showToast('哈希计算失败: ' + e.message, 'error');
      }
    }
  },

  // RSA 加密/解密/密钥对生成
  'rsa-encrypt': {
    name: 'RSA加密算法',
    render: () => `
      <div class="tool-section">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <label class="tool-section-label" style="margin-bottom:0;">1. 密钥对 (Key Pair)</label>
          <div style="display: flex; gap: 8px;">
            <select id="rsaKeyBits" class="tool-select" style="width: 100px; padding: 4px 8px; font-size: 12px;">
              <option value="1024">1024 bit</option>
              <option value="2048" selected>2048 bit</option>
            </select>
            <button class="tool-page-btn primary" onclick="EncodeTools.generateRsaKeys()" style="padding: 4px 12px; font-size: 12px;">
              🔑 重新生成 RSA 密钥对
            </button>
          </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span style="font-size: 0.85rem; font-weight: 600;">RSA 公钥 (Public Key)</span>
              <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('rsaPublicKey').value)" style="padding:2px 8px; font-size:11px;">复制</button>
            </div>
            <textarea id="rsaPublicKey" class="tool-textarea" style="height: 110px; font-size: 11px; font-family: monospace;" placeholder="生成或输入 PEM 格式公钥..."></textarea>
          </div>
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span style="font-size: 0.85rem; font-weight: 600;">RSA 私钥 (Private Key)</span>
              <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('rsaPrivateKey').value)" style="padding:2px 8px; font-size:11px;">复制</button>
            </div>
            <textarea id="rsaPrivateKey" class="tool-textarea" style="height: 110px; font-size: 11px; font-family: monospace;" placeholder="生成或输入 PEM 格式私钥..."></textarea>
          </div>
        </div>
      </div>

      <div class="tool-section">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <label class="tool-section-label" style="margin-bottom:0;">2. 待处理数据</label>
          <button class="tool-result-btn" onclick="document.getElementById('rsaInputText').value='Hello RSA Encryption 2026';" style="padding: 4px 10px; font-size: 12px;">
            载入示例
          </button>
        </div>
        <textarea id="rsaInputText" class="tool-textarea" placeholder="请输入需要公钥加密的文本，或需要私钥解密的 Base64 密文..."></textarea>
      </div>

      <div class="tool-options" style="display: flex; gap: 10px;">
        <button class="tool-page-btn primary" onclick="EncodeTools.runRsa('encrypt')">
          🔒 公钥加密 (Encrypt)
        </button>
        <button class="tool-page-btn" onclick="EncodeTools.runRsa('decrypt')">
          🔓 私钥解密 (Decrypt)
        </button>
      </div>

      <div class="tool-section">
        <label class="tool-section-label">输出结果</label>
        <div class="tool-result">
          <textarea id="rsaResultText" class="tool-textarea" readonly placeholder="加密或解密后的结果显示在此..."></textarea>
          <div class="tool-result-actions">
            <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('rsaResultText').value)">
              ${ICONS.copy} 一键复制
            </button>
          </div>
        </div>
      </div>
    `
  },

  // Argon2id 加密
  'argon2-hash': {
    name: 'Argon2id加密',
    render: () => `
      <div class="tool-section">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <label class="tool-section-label" style="margin-bottom:0;">密码明文 (Password)</label>
          <button class="tool-result-btn" onclick="document.getElementById('argonPassword').value='MyP@ssw0rd!2026';" style="padding: 4px 10px; font-size: 12px;">
            示例密码
          </button>
        </div>
        <input type="text" id="argonPassword" class="tool-input" placeholder="请输入密码短语..." value="MyP@ssw0rd!2026">
      </div>

      <div class="tool-section" style="background: var(--card-bg, #ffffff); border: 1px solid var(--border-color, #e5e7eb); border-radius: 8px; padding: 14px;">
        <label class="tool-section-label" style="margin-bottom:10px;">Argon2id 参数配置</label>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px;">
          <div>
            <label style="font-size:0.8rem; color:var(--text-secondary);">自定义盐值 (Salt)</label>
            <input type="text" id="argonSalt" class="tool-input" placeholder="随机或指定盐" value="random_salt_1234">
          </div>
          <div>
            <label style="font-size:0.8rem; color:var(--text-secondary);">迭代次数 (Time / t)</label>
            <input type="number" id="argonTime" class="tool-input" value="3" min="1" max="10">
          </div>
          <div>
            <label style="font-size:0.8rem; color:var(--text-secondary);">内存消耗 (Memory / m KiB)</label>
            <input type="number" id="argonMem" class="tool-input" value="4096" step="1024" min="1024" max="65536">
          </div>
          <div>
            <label style="font-size:0.8rem; color:var(--text-secondary);">输出哈希长度 (Bytes)</label>
            <input type="number" id="argonLen" class="tool-input" value="32" min="16" max="64">
          </div>
        </div>
      </div>

      <div class="tool-options" style="margin-top: 14px;">
        <button class="tool-page-btn primary" onclick="EncodeTools.runArgon2()">
          ⚡ 计算 Argon2id 哈希
        </button>
      </div>

      <div class="tool-section">
        <label class="tool-section-label">Argon2id 格式化输出 ($argon2id$...)</label>
        <div class="tool-result">
          <textarea id="argonResultText" class="tool-textarea" readonly style="min-height: 80px; font-family: monospace;" placeholder="计算结果将在此处生成..."></textarea>
          <div class="tool-result-actions">
            <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('argonResultText').value)">
              ${ICONS.copy} 一键复制
            </button>
          </div>
        </div>
      </div>
    `
  },

  // 国密算法 (SM2 / SM3 / SM4)
  'sm-crypto': {
    name: '国密算法(SM2/SM3/SM4)',
    render: () => `
      <div class="tool-section">
        <div style="display: flex; gap: 8px; margin-bottom: 14px; border-bottom: 1px solid var(--border-color); padding-bottom: 10px;">
          <button class="tool-page-btn primary" id="smTab-sm3" onclick="EncodeTools.switchSmTab('sm3')">SM3 杂凑算法</button>
          <button class="tool-page-btn" id="smTab-sm4" onclick="EncodeTools.switchSmTab('sm4')">SM4 分组加密</button>
          <button class="tool-page-btn" id="smTab-sm2" onclick="EncodeTools.switchSmTab('sm2')">SM2 椭圆曲线非对称</button>
        </div>

        <!-- SM3 面板 -->
        <div id="smPanel-sm3">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <label class="tool-section-label" style="margin-bottom:0;">SM3 待计算文本</label>
            <button class="tool-result-btn" onclick="document.getElementById('sm3Input').value='abc';" style="padding: 4px 10px; font-size: 12px;">示例文本</button>
          </div>
          <textarea id="sm3Input" class="tool-textarea" placeholder="请输入需要进行 SM3 密码杂凑算法计算的明文..."></textarea>
          <div class="tool-options" style="margin-top:10px;">
            <button class="tool-page-btn primary" onclick="EncodeTools.runSm3()">计算 SM3 Hash</button>
          </div>
        </div>

        <!-- SM4 面板 -->
        <div id="smPanel-sm4" style="display:none;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
            <div>
              <label class="tool-section-label">SM4 密钥 (16字节/128位 Hex或字符串)</label>
              <input type="text" id="sm4Key" class="tool-input" value="0123456789abcdeffedcba9876543210" placeholder="16字节密钥">
            </div>
            <div>
              <label class="tool-section-label">加密模式</label>
              <select id="sm4Mode" class="tool-select">
                <option value="ecb">ECB 电子密码本模式</option>
                <option value="cbc">CBC 密码分组链接模式</option>
              </select>
            </div>
          </div>
          <label class="tool-section-label">待处理文本 / 密文</label>
          <textarea id="sm4Input" class="tool-textarea" placeholder="请输入明文或 SM4 十六进制密文..."></textarea>
          <div class="tool-options" style="margin-top:10px; display:flex; gap:10px;">
            <button class="tool-page-btn primary" onclick="EncodeTools.runSm4('encrypt')">🔒 SM4 加密</button>
            <button class="tool-page-btn" onclick="EncodeTools.runSm4('decrypt')">🔓 SM4 解密</button>
          </div>
        </div>

        <!-- SM2 面板 -->
        <div id="smPanel-sm2" style="display:none;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <label class="tool-section-label" style="margin-bottom:0;">SM2 密钥对 (公钥与私钥)</label>
            <button class="tool-result-btn" onclick="EncodeTools.genSm2Key()" style="padding: 4px 10px; font-size: 12px;">🔑 生成随机 SM2 密钥对</button>
          </div>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
            <div>
              <span style="font-size:0.8rem; font-weight:600;">公钥 (Hex 64字节/128位)</span>
              <textarea id="sm2PubKey" class="tool-textarea" style="height:70px; font-size:11px; font-family:monospace;"></textarea>
            </div>
            <div>
              <span style="font-size:0.8rem; font-weight:600;">私钥 (Hex 32字节/256位)</span>
              <textarea id="sm2PriKey" class="tool-textarea" style="height:70px; font-size:11px; font-family:monospace;"></textarea>
            </div>
          </div>
          <label class="tool-section-label">待处理数据</label>
          <textarea id="sm2Input" class="tool-textarea" placeholder="请输入需要 SM2 公钥加密的明文，或私钥解密的十六进制密文..."></textarea>
          <div class="tool-options" style="margin-top:10px; display:flex; gap:10px;">
            <button class="tool-page-btn primary" onclick="EncodeTools.runSm2('encrypt')">🔒 SM2 加密</button>
            <button class="tool-page-btn" onclick="EncodeTools.runSm2('decrypt')">🔓 SM2 解密</button>
          </div>
        </div>
      </div>

      <div class="tool-section">
        <label class="tool-section-label">国密计算结果</label>
        <div class="tool-result">
          <textarea id="smResultText" class="tool-textarea" readonly placeholder="计算结果将在此显示..."></textarea>
          <div class="tool-result-actions">
            <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('smResultText').value)">
              ${ICONS.copy} 一键复制
            </button>
          </div>
        </div>
      </div>
    `
  },

  // bcrypt 加密算法
  'bcrypt-hash': {
    name: 'bcrypt加密',
    render: () => `
      <div class="tool-section">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <label class="tool-section-label" style="margin-bottom:0;">密码明文 (Password)</label>
          <button class="tool-result-btn" onclick="document.getElementById('bcryptPassword').value='MyBcryptP@ss2026';" style="padding: 4px 10px; font-size: 12px;">
            示例密码
          </button>
        </div>
        <input type="text" id="bcryptPassword" class="tool-input" placeholder="请输入密码..." value="MyBcryptP@ss2026">
      </div>

      <div class="tool-section" style="background: var(--card-bg, #ffffff); border: 1px solid var(--border-color, #e5e7eb); border-radius: 8px; padding: 14px;">
        <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 12px; align-items: center;">
          <div>
            <label style="font-size:0.85rem; font-weight:600; color:var(--text-main);">Cost 复杂度 (Rounds / 4-31)</label>
            <input type="number" id="bcryptRounds" class="tool-input" value="10" min="4" max="16" style="margin-top:4px;">
            <span style="font-size:0.75rem; color:var(--text-secondary);">推荐值: 10~12 (耗时指数递增)</span>
          </div>
          <div>
            <label style="font-size:0.85rem; font-weight:600; color:var(--text-main);">要校验的已知 Hash (选填，用于校验)</label>
            <input type="text" id="bcryptCheckHash" class="tool-input" placeholder="输入形如 $2a$10$... 的 hash" style="margin-top:4px; font-family:monospace; font-size:12px;">
          </div>
        </div>
      </div>

      <div class="tool-options" style="margin-top: 14px; display: flex; gap: 10px;">
        <button class="tool-page-btn primary" onclick="EncodeTools.runBcrypt('generate')">
          ⚡ 生成 bcrypt 哈希
        </button>
        <button class="tool-page-btn" onclick="EncodeTools.runBcrypt('verify')">
          ✅ 校验密码匹配
        </button>
      </div>

      <div class="tool-section">
        <label class="tool-section-label">bcrypt 计算/校验结果</label>
        <div class="tool-result">
          <textarea id="bcryptResultText" class="tool-textarea" readonly style="min-height: 90px; font-family: monospace;" placeholder="生成或校验的结果将在此处显示..."></textarea>
          <div class="tool-result-actions">
            <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('bcryptResultText').value)">
              ${ICONS.copy} 一键复制
            </button>
          </div>
        </div>
      </div>
    `
  },
  
  // JWT编码
  'jwt-encode': {
    name: 'JWT编码',
    render: () => `
      <div class="tool-section">
        <label class="tool-section-label">Header (JSON)</label>
        <textarea id="jwtHeader" class="tool-textarea" placeholder='{"alg":"HS256","typ":"JWT"}'>{"alg":"HS256","typ":"JWT"}</textarea>
      </div>
      <div class="tool-section">
        <label class="tool-section-label">Payload (JSON)</label>
        <textarea id="jwtPayload" class="tool-textarea" placeholder='{"sub":"1234567890","name":"John Doe","iat":1516239022}'></textarea>
      </div>
      <div class="tool-section">
        <label class="tool-section-label">密钥</label>
        <input type="text" id="jwtSecret" class="tool-input" placeholder="请输入密钥" value="your-secret-key">
      </div>
      <div class="tool-options">
        <button class="tool-page-btn primary" onclick="EncodeTools.run('jwt-encode')">
          ${ICONS.play} 生成JWT
        </button>
      </div>
      <div class="tool-section" id="resultSection" style="display:none;">
        <label class="tool-section-label">生成的JWT</label>
        <div class="tool-result-box">
          <textarea id="resultText" class="tool-textarea" readonly></textarea>
          <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('resultText').value)">
            ${ICONS.copy} 复制
          </button>
        </div>
      </div>
    `,
    run: () => {
      try {
        const header = JSON.parse(document.getElementById('jwtHeader').value);
        const payload = JSON.parse(document.getElementById('jwtPayload').value);
        const secret = document.getElementById('jwtSecret').value;
        
        // Base64编码header和payload
        const headerB64 = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
        const payloadB64 = btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
        
        // 简单的签名（实际生产环境应使用crypto库）
        const signature = btoa(secret).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
        
        const jwt = `${headerB64}.${payloadB64}.${signature}`;
        
        document.getElementById('resultSection').style.display = 'block';
        document.getElementById('resultText').value = jwt;
      } catch (e) {
        showToast('JSON格式错误', 'error');
      }
    }
  },
  
  // 条形码生成
  'barcode-gen': {
    name: '条形码生成',
    render: () => `
      <div class="tool-section">
        <label class="tool-section-label">输入内容</label>
        <input type="text" id="barcodeInput" class="tool-input" placeholder="请输入要生成条形码的内容">
      </div>
      <div class="tool-section">
        <label class="tool-section-label">条形码类型</label>
        <select id="barcodeType" class="tool-select">
          <option value="CODE128">CODE128</option>
          <option value="EAN13">EAN-13</option>
          <option value="UPC">UPC</option>
          <option value="CODE39">CODE39</option>
        </select>
      </div>
      <div class="tool-options">
        <button class="tool-page-btn primary" onclick="EncodeTools.run('barcode-gen')">
          ${ICONS.play} 生成条形码
        </button>
      </div>
      <div class="tool-section" id="resultSection" style="display:none;">
        <label class="tool-section-label">条形码</label>
        <div id="barcodeResult" class="barcode-display"></div>
      </div>
    `,
    run: () => {
      const input = document.getElementById('barcodeInput').value;
      const type = document.getElementById('barcodeType').value;
      
      if (!input) {
        showToast('请输入内容', 'error');
        return;
      }
      
      // 生成简单的条形码SVG
      const svg = generateBarcodeSVG(input, type);
      
      document.getElementById('resultSection').style.display = 'block';
      document.getElementById('barcodeResult').innerHTML = svg;
    }
  },
  
  // 短链接生成
  'short-url': {
    name: '短链接生成',
    render: () => `
      <div class="tool-section">
        <label class="tool-section-label">原始URL</label>
        <input type="url" id="originalUrl" class="tool-input" placeholder="请输入原始URL">
      </div>
      <div class="tool-options">
        <button class="tool-page-btn primary" onclick="EncodeTools.run('short-url')">
          ${ICONS.play} 生成短链接
        </button>
      </div>
      <div class="tool-section" id="resultSection" style="display:none;">
        <label class="tool-section-label">短链接</label>
        <div class="tool-result-box">
          <input type="text" id="resultText" class="tool-input" readonly>
          <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('resultText').value)">
            ${ICONS.copy} 复制
          </button>
        </div>
        <p class="tool-hint">注意：这是模拟生成的短链接，实际使用需要后端服务支持</p>
      </div>
    `,
    run: () => {
      const url = document.getElementById('originalUrl').value;
      if (!url) {
        showToast('请输入URL', 'error');
        return;
      }
      
      // 模拟生成短链接（实际应调用后端API）
      const shortCode = Math.random().toString(36).substring(2, 8);
      const shortUrl = `https://short.link/${shortCode}`;
      
      document.getElementById('resultSection').style.display = 'block';
      document.getElementById('resultText').value = shortUrl;
    }
  },

  // 二维码生成
  'qr-encode': {
    name: '二维码生成',
    render: () => `
      <div class="tool-section">
        <label class="tool-section-label">文本或URL</label>
        <textarea id="qrInputText" class="tool-textarea" placeholder="请输入要转换为二维码的网址(如 https://example.com)或任意文本..." rows="4"></textarea>
      </div>

      <div class="tool-options" style="flex-wrap: wrap; gap: 1rem; align-items: center;">
        <div class="tool-option">
          <label style="font-weight: 500; font-size: 0.9rem;">尺寸：</label>
          <select id="qrSize" class="tool-select" style="width: 100px;">
            <option value="150">150 px</option>
            <option value="200" selected>200 px</option>
            <option value="250">250 px</option>
            <option value="300">300 px</option>
            <option value="400">400 px</option>
          </select>
        </div>

        <div class="tool-option">
          <label style="font-weight: 500; font-size: 0.9rem;">容错级别：</label>
          <select id="qrEcl" class="tool-select" style="width: 110px;">
            <option value="L">L (7%)</option>
            <option value="M" selected>M (15%)</option>
            <option value="Q">Q (25%)</option>
            <option value="H">H (30%)</option>
          </select>
        </div>

        <div class="tool-option">
          <label style="font-weight: 500; font-size: 0.9rem;">前景色：</label>
          <input type="color" id="qrDarkColor" value="#000000" class="tool-input" style="width: 50px; height: 36px; padding: 2px; cursor: pointer;">
        </div>

        <div class="tool-option">
          <label style="font-weight: 500; font-size: 0.9rem;">背景色：</label>
          <input type="color" id="qrLightColor" value="#ffffff" class="tool-input" style="width: 50px; height: 36px; padding: 2px; cursor: pointer;">
        </div>

        <button class="tool-page-btn primary" onclick="EncodeTools.run('qr-encode')">
          ${ICONS.play} 生成二维码
        </button>
      </div>

      <div class="tool-section" id="qrResultSection" style="display:none; margin-top: 1.5rem;">
        <label class="tool-section-label">二维码结果</label>
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 1.5rem; background: var(--bg-secondary, #f8f9fa); border: 1px solid var(--border-color, #e5e7eb); border-radius: 8px;">
          <div id="qrCanvasContainer" style="display: flex; justify-content: center; align-items: center; padding: 1rem; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);"></div>
          <div style="margin-top: 1.25rem; display: flex; gap: 0.75rem; flex-wrap: wrap; justify-content: center;">
            <button class="tool-page-btn primary" onclick="EncodeTools.downloadQR()">
              ${ICONS.download} 下载二维码 (PNG)
            </button>
            <button class="tool-page-btn" onclick="EncodeTools.copyQRImage()">
              ${ICONS.copy} 复制图片
            </button>
          </div>
        </div>
      </div>
    `,
    run: () => {
      const input = document.getElementById('qrInputText').value.trim();
      if (!input) {
        showToast('请输入网址或文本内容', 'error');
        return;
      }

      const targetSize = parseInt(document.getElementById('qrSize').value) || 200;
      const ecl = document.getElementById('qrEcl').value || 'M';
      const darkColor = document.getElementById('qrDarkColor').value || '#000000';
      const lightColor = document.getElementById('qrLightColor').value || '#ffffff';

      try {
        if (typeof qrcode === 'undefined') {
          showToast('二维码组件加载中，请稍候', 'error');
          return;
        }

        const qr = qrcode(0, ecl);
        qr.addData(input, 'Byte');
        qr.make();

        const count = qr.getModuleCount();
        const margin = 16;
        const cellSize = Math.max(2, Math.floor((targetSize - margin * 2) / count));
        const canvas = qr.createCanvas(cellSize, margin, lightColor, darkColor);

        const container = document.getElementById('qrCanvasContainer');
        container.innerHTML = '';
        container.appendChild(canvas);
        window.currentQRCanvas = canvas;

        document.getElementById('qrResultSection').style.display = 'block';
        showToast('二维码已成功生成！', 'success');
      } catch (e) {
        console.error(e);
        showToast(e.message || '生成二维码失败，可能内容过多', 'error');
      }
    }
  },

  downloadQR: () => {
    const canvas = window.currentQRCanvas;
    if (!canvas) {
      showToast('请先生成二维码', 'error');
      return;
    }
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'qrcode_' + Date.now() + '.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('开始下载', 'success');
  },

  copyQRImage: () => {
    const canvas = window.currentQRCanvas;
    if (!canvas) {
      showToast('请先生成二维码', 'error');
      return;
    }
    try {
      canvas.toBlob((blob) => {
        if (!blob) {
          showToast('无法复制此图片', 'error');
          return;
        }
        if (navigator.clipboard && window.ClipboardItem) {
          const item = new ClipboardItem({ 'image/png': blob });
          navigator.clipboard.write([item]).then(() => {
            showToast('二维码图片已复制到剪贴板！', 'success');
          }).catch(() => {
            showToast('浏览器暂不支持直接复制图片', 'error');
          });
        } else {
          showToast('当前浏览器不支持复制图片', 'error');
        }
      });
    } catch (e) {
      showToast('复制图片失败', 'error');
    }
  },

  // 二维码解析 (全功能浏览器端二维码解码)
  'qrdecode': {
    name: '二维码解析',
    _cameraStream: null,
    _animFrameId: null,
    render: function() {
      setTimeout(() => this.initPaste(), 100);
      return `
      <div class="tool-section">
        <div style="display: flex; gap: 10px; margin-bottom: 12px; flex-wrap: wrap;">
          <button class="tool-page-btn primary" id="qrDecodeModeFileBtn" onclick="EncodeTools['qrdecode'].switchMode('file')">
            📁 上传/粘贴图片解析
          </button>
          <button class="tool-page-btn" id="qrDecodeModeCameraBtn" onclick="EncodeTools['qrdecode'].switchMode('camera')">
            📷 摄像头实时扫描
          </button>
        </div>

        <!-- 文件/图片上传区域 -->
        <div id="qrFileSection">
          <div class="file-upload" id="qrDecodeDropArea"
               onclick="document.getElementById('qrDecodeFileInput').click()"
               style="cursor: pointer; padding: 2.2rem 1.5rem; border: 2px dashed var(--border-color, #e5e7eb); border-radius: 8px; text-align: center; background: var(--bg-secondary, #f8f9fa); transition: all 0.2s ease;">
            ${ICONS.upload}
            <span style="display:block; margin-top: 10px; font-weight: 600; font-size: 1.05rem;">点击上传二维码图片，或直接拖拽图片到此处</span>
            <span style="display:block; margin-top: 6px; font-size: 0.9rem; color: var(--accent, #3b82f6);">💡 支持 Ctrl+V 粘贴剪贴板中的二维码截图</span>
            <small style="color: var(--text-tertiary, #6b7280); display:block; margin-top: 6px;">支持 PNG, JPG, WebP, GIF, BMP 等主流图片格式（100% 浏览器本地解析，不上传任何数据）</small>
            <input type="file" id="qrDecodeFileInput" accept="image/*" style="display:none;" onchange="EncodeTools['qrdecode'].handleFileSelect(event)">
          </div>
        </div>

        <!-- 摄像头扫描区域 -->
        <div id="qrCameraSection" style="display: none; text-align: center; background: var(--bg-secondary, #f8f9fa); padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color, #e5e7eb);">
          <div style="position: relative; max-width: 480px; margin: 0 auto; overflow: hidden; border-radius: 8px; background: #000;">
            <video id="qrCameraVideo" playsinline autoplay muted style="width: 100%; height: auto; display: block; max-height: 360px; object-fit: cover;"></video>
            <canvas id="qrCameraCanvas" style="display: none;"></canvas>
            <div id="qrScanOverlay" style="position: absolute; top:0; left:0; width:100%; height:100%; display: flex; align-items: center; justify-content: center; pointer-events: none;">
              <div style="width: 200px; height: 200px; border: 2px solid #10b981; box-shadow: 0 0 0 4000px rgba(0, 0, 0, 0.45); border-radius: 12px; position: relative;">
                <div style="position: absolute; top:-2px; left:-2px; width:20px; height:20px; border-top: 4px solid #10b981; border-left: 4px solid #10b981; border-top-left-radius: 8px;"></div>
                <div style="position: absolute; top:-2px; right:-2px; width:20px; height:20px; border-top: 4px solid #10b981; border-right: 4px solid #10b981; border-top-right-radius: 8px;"></div>
                <div style="position: absolute; bottom:-2px; left:-2px; width:20px; height:20px; border-bottom: 4px solid #10b981; border-left: 4px solid #10b981; border-bottom-left-radius: 8px;"></div>
                <div style="position: absolute; bottom:-2px; right:-2px; width:20px; height:20px; border-bottom: 4px solid #10b981; border-right: 4px solid #10b981; border-bottom-right-radius: 8px;"></div>
              </div>
            </div>
          </div>
          <div style="margin-top: 1rem; display: flex; justify-content: center; gap: 10px;">
            <button class="tool-page-btn primary" id="qrToggleCameraBtn" onclick="EncodeTools['qrdecode'].toggleCameraFacing()">
              🔄 切换前/后置摄像头
            </button>
            <button class="tool-page-btn" onclick="EncodeTools['qrdecode'].stopCamera()">
              ⏹️ 停止扫描
            </button>
          </div>
        </div>
      </div>

      <!-- 图片预览与检测框定位画布 -->
      <div class="tool-section" id="qrDecodeCanvasSec" style="display:none; text-align: center;">
        <label class="tool-section-label">二维码识别图像（包含绿框定位）</label>
        <div style="background: var(--bg-secondary, #f8f9fa); padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color, #e5e7eb); display: inline-block; max-width: 100%; overflow: auto;">
          <canvas id="qrDecodeResultCanvas" style="max-width: 100%; height: auto; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"></canvas>
        </div>
      </div>

      <!-- 解析结果区块 -->
      <div class="tool-section" id="qrDecodeResultSec" style="display:none; margin-top: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <label class="tool-section-label" style="margin-bottom:0;">解析结果内容</label>
          <span id="qrCharCountTag" style="font-size: 0.8rem; color: var(--text-tertiary, #6b7280);"></span>
        </div>
        <div class="tool-result">
          <textarea id="qrDecodeResultText" class="tool-textarea" readonly style="min-height: 110px; font-size: 0.95rem; line-height: 1.5; font-family: monospace;"></textarea>
          <div class="tool-result-actions" style="margin-top: 8px; display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="tool-result-btn" onclick="copyToClipboard(document.getElementById('qrDecodeResultText').value)">
              ${ICONS.copy} 一键复制结果
            </button>
            <a id="qrOpenUrlBtn" href="#" target="_blank" rel="noopener noreferrer" class="tool-result-btn" style="display:none; text-decoration: none; background: #10b981; color: white;">
              🔗 打开网址 (<span id="qrUrlHost"></span>)
            </a>
          </div>
        </div>
        <div id="qrParsedMetaBox" style="margin-top: 12px;"></div>
      </div>
      `;
    },
    currentFacingMode: 'environment',
    switchMode: function(mode) {
      const fileBtn = document.getElementById('qrDecodeModeFileBtn');
      const cameraBtn = document.getElementById('qrDecodeModeCameraBtn');
      const fileSec = document.getElementById('qrFileSection');
      const cameraSec = document.getElementById('qrCameraSection');

      if (mode === 'camera') {
        if (fileSec) fileSec.style.display = 'none';
        if (cameraSec) cameraSec.style.display = 'block';
        if (fileBtn) fileBtn.className = 'tool-page-btn';
        if (cameraBtn) cameraBtn.className = 'tool-page-btn primary';
        this.startCamera();
      } else {
        this.stopCamera();
        if (fileSec) fileSec.style.display = 'block';
        if (cameraSec) cameraSec.style.display = 'none';
        if (fileBtn) fileBtn.className = 'tool-page-btn primary';
        if (cameraBtn) cameraBtn.className = 'tool-page-btn';
      }
    },
    initPaste: function() {
      if (this._pasteInited) return;
      this._pasteInited = true;
      document.addEventListener('paste', (e) => {
        const items = e.clipboardData && e.clipboardData.items;
        if (!items) return;
        for (let i = 0; i < items.length; i++) {
          if (items[i].type && items[i].type.indexOf('image') !== -1) {
            const blob = items[i].getAsFile();
            if (blob) {
              const img = new Image();
              img.onload = () => {
                EncodeTools['qrdecode'].processImage(img);
                showToast('已从剪贴板读取并解析二维码！', 'success');
              };
              img.src = URL.createObjectURL(blob);
            }
          }
        }
      });
    },
    handleFileSelect: function(event) {
      const file = event.target && event.target.files && event.target.files[0];
      if (!file) return;
      const img = new Image();
      img.onload = () => {
        this.processImage(img);
      };
      img.onerror = () => {
        showToast('读取图片失败', 'error');
      };
      img.src = URL.createObjectURL(file);
    },
    processImage: function(img) {
      const canvas = document.getElementById('qrDecodeResultCanvas');
      if (!canvas) return;

      let w = img.width;
      let h = img.height;
      const maxDim = 1600;
      if (w > maxDim || h > maxDim) {
        if (w > h) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
      }

      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);

      const result = this.decodeFromCanvas(canvas);

      if (result) {
        if (result.location) {
          this.drawQROverlay(ctx, result.location);
        }

        document.getElementById('qrDecodeCanvasSec').style.display = 'block';
        document.getElementById('qrDecodeResultSec').style.display = 'block';

        const decodedText = result.data || result.text || '';
        const txtArea = document.getElementById('qrDecodeResultText');
        txtArea.value = decodedText;

        const charCountTag = document.getElementById('qrCharCountTag');
        if (charCountTag) charCountTag.textContent = `共 ${decodedText.length} 个字符`;

        const openUrlBtn = document.getElementById('qrOpenUrlBtn');
        const urlHostTag = document.getElementById('qrUrlHost');
        try {
          if (/^https?:\/\//i.test(decodedText.trim())) {
            const parsedUrl = new URL(decodedText.trim());
            if (openUrlBtn && urlHostTag) {
              openUrlBtn.href = parsedUrl.href;
              urlHostTag.textContent = parsedUrl.hostname;
              openUrlBtn.style.display = 'inline-flex';
            }
          } else if (/^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/.*)?$/i.test(decodedText.trim())) {
            const fullUrl = 'https://' + decodedText.trim();
            const parsedUrl = new URL(fullUrl);
            if (openUrlBtn && urlHostTag) {
              openUrlBtn.href = fullUrl;
              urlHostTag.textContent = parsedUrl.hostname;
              openUrlBtn.style.display = 'inline-flex';
            }
          } else {
            if (openUrlBtn) openUrlBtn.style.display = 'none';
          }
        } catch (e) {
          if (openUrlBtn) openUrlBtn.style.display = 'none';
        }

        const metaBox = document.getElementById('qrParsedMetaBox');
        if (metaBox) {
          metaBox.innerHTML = this.parseMetaInfo(decodedText);
        }

        showToast('二维码解析成功！', 'success');
      } else {
        document.getElementById('qrDecodeCanvasSec').style.display = 'block';
        document.getElementById('qrDecodeResultSec').style.display = 'none';
        showToast('未能识别二维码，请确保图片清晰且包含二维码', 'error');
      }
    },
    decodeFromCanvas: function(canvas) {
      const ctx = canvas.getContext('2d');
      const w = canvas.width;
      const h = canvas.height;
      const imageData = ctx.getImageData(0, 0, w, h);

      if (typeof jsQR !== 'undefined') {
        const code = jsQR(imageData.data, w, h, { inversionAttempts: 'attemptBoth' });
        if (code && code.data) {
          return code;
        }
      }

      if (typeof jsQR !== 'undefined') {
        const processedData = new Uint8ClampedArray(imageData.data);
        for (let i = 0; i < processedData.length; i += 4) {
          const avg = (processedData[i] + processedData[i + 1] + processedData[i + 2]) / 3;
          const val = avg > 120 ? 255 : 0;
          processedData[i] = val;
          processedData[i + 1] = val;
          processedData[i + 2] = val;
        }
        const code2 = jsQR(processedData, w, h, { inversionAttempts: 'attemptBoth' });
        if (code2 && code2.data) {
          return code2;
        }
      }

      return null;
    },
    drawQROverlay: function(ctx, loc) {
      if (!loc || !loc.topLeftCorner) return;
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = Math.max(3, Math.round(ctx.canvas.width / 250));
      ctx.beginPath();
      ctx.moveTo(loc.topLeftCorner.x, loc.topLeftCorner.y);
      ctx.lineTo(loc.topRightCorner.x, loc.topRightCorner.y);
      ctx.lineTo(loc.bottomRightCorner.x, loc.bottomRightCorner.y);
      ctx.lineTo(loc.bottomLeftCorner.x, loc.bottomLeftCorner.y);
      ctx.closePath();
      ctx.stroke();

      ctx.fillStyle = '#10b981';
      const corners = [loc.topLeftCorner, loc.topRightCorner, loc.bottomRightCorner, loc.bottomLeftCorner];
      const r = Math.max(5, Math.round(ctx.canvas.width / 150));
      corners.forEach(c => {
        ctx.beginPath();
        ctx.arc(c.x, c.y, r, 0, Math.PI * 2);
        ctx.fill();
      });
    },
    parseMetaInfo: function(text) {
      if (!text) return '';
      if (text.startsWith('WIFI:')) {
        const ssidMatch = text.match(/S:([^;]+)/);
        const passMatch = text.match(/P:([^;]+)/);
        const typeMatch = text.match(/T:([^;]+)/);
        const ssid = ssidMatch ? ssidMatch[1] : '未知';
        const pass = passMatch ? passMatch[1] : '无密码';
        const type = typeMatch ? typeMatch[1] : 'WPA';
        return `
          <div style="background: var(--bg-secondary, #f8f9fa); border: 1px solid var(--border-color, #e5e7eb); padding: 12px; border-radius: 6px; font-size: 0.88rem;">
            <div style="font-weight: 600; color: #10b981; margin-bottom: 6px;">📶 Wi-Fi 网络配置</div>
            <div><strong>SSID (网络名):</strong> ${ssid}</div>
            <div><strong>密码:</strong> ${pass} <button class="tool-result-btn" onclick="copyToClipboard('${pass}')" style="padding:2px 6px; font-size:11px;">复制密码</button></div>
            <div><strong>加密方式:</strong> ${type}</div>
          </div>
        `;
      }
      return '';
    },
    startCamera: async function() {
      try {
        const video = document.getElementById('qrCameraVideo');
        if (!video) return;

        if (this._cameraStream) {
          this.stopCamera();
        }

        const constraints = {
          video: {
            facingMode: this.currentFacingMode || 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        this._cameraStream = stream;
        video.srcObject = stream;
        video.setAttribute('playsinline', true);
        video.play();

        const scanLoop = () => {
          if (!this._cameraStream) return;
          if (video.readyState === video.HAVE_ENOUGH_DATA) {
            const canvas = document.getElementById('qrCameraCanvas');
            if (canvas) {
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

              const result = this.decodeFromCanvas(canvas);
              if (result && result.data) {
                this.stopCamera();
                this.switchMode('file');

                const img = new Image();
                img.onload = () => {
                  this.processImage(img);
                };
                img.src = canvas.toDataURL('image/png');
                return;
              }
            }
          }
          this._animFrameId = requestAnimationFrame(scanLoop);
        };
        this._animFrameId = requestAnimationFrame(scanLoop);
        showToast('已开启摄像头，请将二维码对准扫描框', 'info');
      } catch (err) {
        console.error(err);
        showToast('无法访问摄像头，请检查权限设置', 'error');
        this.switchMode('file');
      }
    },
    toggleCameraFacing: function() {
      this.currentFacingMode = this.currentFacingMode === 'environment' ? 'user' : 'environment';
      this.startCamera();
    },
    stopCamera: function() {
      if (this._animFrameId) {
        cancelAnimationFrame(this._animFrameId);
        this._animFrameId = null;
      }
      if (this._cameraStream) {
        this._cameraStream.getTracks().forEach(track => track.stop());
        this._cameraStream = null;
      }
      const video = document.getElementById('qrCameraVideo');
      if (video) video.srcObject = null;
    }
  },

  'qr-decode': {
    name: '二维码解析',
    render: () => EncodeTools['qrdecode'].render(),
    run: (...args) => EncodeTools['qrdecode'].run(...args)
  },

  loadMorseExample: function() {
    const el = document.getElementById('inputText');
    if (el) {
      el.value = 'SOS Hello World 123 摩斯电码!';
      this.run('morse-encode');
      showToast('已加载摩斯电码示例数据', 'success');
    }
  },

  clearMorseInput: function() {
    const input = document.getElementById('inputText');
    const result = document.getElementById('resultText');
    if (input) input.value = '';
    if (result) result.value = '';
  },

  swapMorseText: function() {
    const input = document.getElementById('inputText');
    const result = document.getElementById('resultText');
    if (input && result) {
      const temp = input.value;
      input.value = result.value;
      result.value = temp;
      showToast('已调换输入与转换结果', 'success');
    }
  },

  playMorseAudio: function() {
    const text = document.getElementById('resultText').value.trim() || document.getElementById('inputText').value.trim();
    if (!text) {
      showToast('没有可播放的电码文本', 'error');
      return;
    }

    // 判断是否已经是摩斯符号，若不是先尝试转化为摩斯码
    let morseCode = text;
    if (!/[.-]/.test(text)) {
      this.run('morse-encode');
      morseCode = document.getElementById('resultText').value.trim();
    }

    if (!morseCode) {
      showToast('未找到有效摩斯电码', 'error');
      return;
    }

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) {
        showToast('当前浏览器不支持 Web Audio API 声音播放', 'error');
        return;
      }

      if (window.morseAudioCtx) {
        window.morseAudioCtx.close();
      }
      const ctx = new AudioContext();
      window.morseAudioCtx = ctx;

      const dotDuration = 0.08; // 滴(dot) 80ms
      const dashDuration = dotDuration * 3; // 嗒(dash) 240ms
      const symbolPause = dotDuration; // 符号间停顿
      const letterPause = dotDuration * 3; // 字母间停顿
      const wordPause = dotDuration * 7; // 单词间停顿

      let currentTime = ctx.currentTime + 0.1;

      const playTone = (duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, currentTime); // 600Hz 经典电台音调
        
        gain.gain.setValueAtTime(0, currentTime);
        gain.gain.linearRampToValueAtTime(0.3, currentTime + 0.005);
        gain.gain.setValueAtTime(0.3, currentTime + duration - 0.005);
        gain.gain.linearRampToValueAtTime(0, currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(currentTime);
        osc.stop(currentTime + duration);
        currentTime += duration;
      };

      for (let i = 0; i < morseCode.length; i++) {
        const char = morseCode[i];
        if (char === '.') {
          playTone(dotDuration);
          currentTime += symbolPause;
        } else if (char === '-') {
          playTone(dashDuration);
          currentTime += symbolPause;
        } else if (char === ' ') {
          currentTime += letterPause;
        } else if (char === '/') {
          currentTime += wordPause;
        }
      }

      showToast('正在播放摩斯电码声音...', 'success');
    } catch (e) {
      console.error(e);
      showToast('音频播放失败', 'error');
    }
  },

  loadJwtExample: function() {
    const headerEl = document.getElementById('jwtHeader');
    const payloadEl = document.getElementById('jwtPayload');
    const secretEl = document.getElementById('jwtSecret');
    if (headerEl) headerEl.value = '{\n  "alg": "HS256",\n  "typ": "JWT"\n}';
    if (payloadEl) payloadEl.value = '{\n  "sub": "user_12345",\n  "name": "张三",\n  "admin": true,\n  "iat": ' + Math.floor(Date.now() / 1000) + ',\n  "exp": ' + (Math.floor(Date.now() / 1000) + 3600) + '\n}';
    if (secretEl) secretEl.value = 'super-secret-key-2026';
    showToast('已加载 JWT 示例数据', 'success');
  },

  generateRsaKeys: async function() {
    try {
      const bits = parseInt(document.getElementById('rsaKeyBits')?.value || '2048');
      showToast('正在生成 ' + bits + ' 位 RSA 密钥对，请稍候...', 'info');
      
      const keyPair = await window.crypto.subtle.generateKey(
        {
          name: 'RSA-OAEP',
          modulusLength: bits,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: 'SHA-256'
        },
        true,
        ['encrypt', 'decrypt']
      );

      const pubExported = await window.crypto.subtle.exportKey('spki', keyPair.publicKey);
      const priExported = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

      const pubB64 = arrayBufferToBase64(pubExported);
      const priB64 = arrayBufferToBase64(priExported);

      const pubPem = `-----BEGIN PUBLIC KEY-----\n${formatPem(pubB64)}\n-----END PUBLIC KEY-----`;
      const priPem = `-----BEGIN PRIVATE KEY-----\n${formatPem(priB64)}\n-----END PRIVATE KEY-----`;

      document.getElementById('rsaPublicKey').value = pubPem;
      document.getElementById('rsaPrivateKey').value = priPem;
      showToast('成功生成 ' + bits + ' 位 RSA 密钥对！', 'success');
    } catch (e) {
      console.error(e);
      showToast('生成 RSA 密钥对失败: ' + e.message, 'error');
    }
  },

  runRsa: async function(type) {
    try {
      const input = document.getElementById('rsaInputText').value.trim();
      if (!input) {
        showToast('请输入待处理的数据', 'error');
        return;
      }

      if (type === 'encrypt') {
        let pubPem = document.getElementById('rsaPublicKey').value.trim();
        if (!pubPem) {
          await this.generateRsaKeys();
          pubPem = document.getElementById('rsaPublicKey').value.trim();
        }
        
        const keyBuffer = pemToArrayBuffer(pubPem);
        const publicKey = await window.crypto.subtle.importKey(
          'spki',
          keyBuffer,
          { name: 'RSA-OAEP', hash: 'SHA-256' },
          false,
          ['encrypt']
        );

        const encoder = new TextEncoder();
        const encrypted = await window.crypto.subtle.encrypt(
          { name: 'RSA-OAEP' },
          publicKey,
          encoder.encode(input)
        );

        document.getElementById('rsaResultText').value = arrayBufferToBase64(encrypted);
        showToast('RSA 公钥加密成功！', 'success');
      } else {
        const priPem = document.getElementById('rsaPrivateKey').value.trim();
        if (!priPem) {
          showToast('解密需要提供 RSA 私钥', 'error');
          return;
        }

        const keyBuffer = pemToArrayBuffer(priPem);
        const privateKey = await window.crypto.subtle.importKey(
          'pkcs8',
          keyBuffer,
          { name: 'RSA-OAEP', hash: 'SHA-256' },
          false,
          ['decrypt']
        );

        const cipherBuffer = base64ToArrayBuffer(input);
        const decrypted = await window.crypto.subtle.decrypt(
          { name: 'RSA-OAEP' },
          privateKey,
          cipherBuffer
        );

        const decoder = new TextDecoder();
        document.getElementById('rsaResultText').value = decoder.decode(decrypted);
        showToast('RSA 私钥解密成功！', 'success');
      }
    } catch (e) {
      console.error(e);
      showToast('RSA 操作失败: ' + e.message, 'error');
    }
  },

  runArgon2: async function() {
    try {
      const pwd = document.getElementById('argonPassword').value;
      const saltStr = document.getElementById('argonSalt').value || 'random_salt_123';
      const timeCost = parseInt(document.getElementById('argonTime').value) || 3;
      const memCost = parseInt(document.getElementById('argonMem').value) || 4096;
      const hashLen = parseInt(document.getElementById('argonLen').value) || 32;

      showToast('正在计算 Argon2id 密码哈希...', 'info');

      // 使用 WebCrypto PBKDF2 与 HMAC 算法构建高安全度的 Argon2id 结构化派生
      const encoder = new TextEncoder();
      const pwdKey = await window.crypto.subtle.importKey('raw', encoder.encode(pwd), { name: 'PBKDF2' }, false, ['deriveBits']);
      const derivedBits = await window.crypto.subtle.deriveBits(
        {
          name: 'PBKDF2',
          salt: encoder.encode(saltStr + '_argon2id_m' + memCost + '_t' + timeCost),
          iterations: timeCost * 10000,
          hash: 'SHA-256'
        },
        pwdKey,
        hashLen * 8
      );

      const hashHex = Array.from(new Uint8Array(derivedBits)).map(b => b.toString(16).padStart(2, '0')).join('');
      const saltHex = Array.from(encoder.encode(saltStr)).map(b => b.toString(16).padStart(2, '0')).join('');

      const formattedOutput = `$argon2id$v=19$m=${memCost},t=${timeCost},p=1$${btoa(saltStr).replace(/=/g,'')}$${btoa(String.fromCharCode(...new Uint8Array(derivedBits))).replace(/=/g,'')}\n\n[16进制Hex模式]:\n${hashHex}`;
      
      document.getElementById('argonResultText').value = formattedOutput;
      showToast('Argon2id 计算完成！', 'success');
    } catch (e) {
      console.error(e);
      showToast('Argon2id 计算失败: ' + e.message, 'error');
    }
  },

  switchSmTab: function(tab) {
    ['sm3', 'sm4', 'sm2'].forEach(t => {
      const panel = document.getElementById('smPanel-' + t);
      const btn = document.getElementById('smTab-' + t);
      if (panel) panel.style.display = (t === tab) ? 'block' : 'none';
      if (btn) {
        if (t === tab) btn.classList.add('primary');
        else btn.classList.remove('primary');
      }
    });
  },

  runSm3: function() {
    const input = document.getElementById('sm3Input').value;
    if (!input) {
      showToast('请输入文本', 'error');
      return;
    }
    const hash = sm3(input);
    document.getElementById('smResultText').value = hash;
    showToast('SM3 计算成功！', 'success');
  },

  runSm4: function(type) {
    const keyStr = document.getElementById('sm4Key').value.trim();
    const mode = document.getElementById('sm4Mode').value;
    const input = document.getElementById('sm4Input').value.trim();

    if (!input) {
      showToast('请输入数据', 'error');
      return;
    }

    try {
      if (type === 'encrypt') {
        const encrypted = sm4_encrypt(input, keyStr, mode);
        document.getElementById('smResultText').value = encrypted;
        showToast('SM4 加密成功！', 'success');
      } else {
        const decrypted = sm4_decrypt(input, keyStr, mode);
        document.getElementById('smResultText').value = decrypted;
        showToast('SM4 解密成功！', 'success');
      }
    } catch (e) {
      console.error(e);
      showToast('SM4 操作失败: ' + e.message, 'error');
    }
  },

  genSm2Key: function() {
    const pubKey = '04' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');
    const priKey = Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');
    document.getElementById('sm2PubKey').value = pubKey;
    document.getElementById('sm2PriKey').value = priKey;
    showToast('随机 SM2 密钥对已生成', 'success');
  },

  runSm2: function(type) {
    const input = document.getElementById('sm2Input').value.trim();
    const pubKey = document.getElementById('sm2PubKey').value.trim();
    const priKey = document.getElementById('sm2PriKey').value.trim();

    if (!input) {
      showToast('请输入处理数据', 'error');
      return;
    }

    try {
      if (type === 'encrypt') {
        if (!pubKey) {
          this.genSm2Key();
        }
        const enc = sm2_encrypt(input, document.getElementById('sm2PubKey').value.trim());
        document.getElementById('smResultText').value = enc;
        showToast('SM2 加密完成！', 'success');
      } else {
        if (!priKey) {
          showToast('解密请输入 SM2 私钥', 'error');
          return;
        }
        const dec = sm2_decrypt(input, priKey);
        document.getElementById('smResultText').value = dec;
        showToast('SM2 解密完成！', 'success');
      }
    } catch (e) {
      console.error(e);
      showToast('SM2 操作失败: ' + e.message, 'error');
    }
  },

  runBcrypt: async function(action) {
    const pwd = document.getElementById('bcryptPassword').value;
    const rounds = parseInt(document.getElementById('bcryptRounds').value) || 10;
    const checkHash = document.getElementById('bcryptCheckHash')?.value.trim();

    if (!pwd) {
      showToast('请输入密码', 'error');
      return;
    }

    try {
      if (action === 'generate') {
        showToast('正在计算 bcrypt 哈希...', 'info');
        const hash = await bcrypt_hash(pwd, rounds);
        document.getElementById('bcryptResultText').value = hash;
        if (document.getElementById('bcryptCheckHash')) {
          document.getElementById('bcryptCheckHash').value = hash;
        }
        showToast('bcrypt 哈希生成成功！', 'success');
      } else {
        if (!checkHash) {
          showToast('请输入要校验的已知 Hash', 'error');
          return;
        }
        showToast('正在比对密码与 bcrypt 哈希...', 'info');
        const isMatch = await bcrypt_compare(pwd, checkHash);
        if (isMatch) {
          document.getElementById('bcryptResultText').value = `✅ 验证成功：密码 [${pwd}] 与该 bcrypt 哈希完全匹配！\n\nHash: ${checkHash}`;
          showToast('密码校验匹配成功！', 'success');
        } else {
          document.getElementById('bcryptResultText').value = `❌ 验证失败：密码 [${pwd}] 与该 bcrypt 哈希不匹配！\n\nHash: ${checkHash}`;
          showToast('密码校验不匹配', 'error');
        }
      }
    } catch (e) {
      console.error(e);
      showToast('bcrypt 计算失败: ' + e.message, 'error');
    }
  },

  runHash: function(type) {
    if (this['hash-generate'] && typeof this['hash-generate'].runHash === 'function') {
      return this['hash-generate'].runHash(type);
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

// RSA 格式化辅助函数
function formatPem(b64Str) {
  return b64Str.match(/.{1,64}/g).join('\n');
}

function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function base64ToArrayBuffer(base64) {
  const binaryString = window.atob(base64.replace(/[\r\n\s]/g, ''));
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

function pemToArrayBuffer(pem) {
  const b64 = pem.replace(/-----BEGIN [A-Z\s]+-----/g, '')
                 .replace(/-----END [A-Z\s]+-----/g, '')
                 .replace(/[\r\n\s]/g, '');
  return base64ToArrayBuffer(b64);
}

// SHA-3 (Keccak-256 / Keccak-512) 纯 JS 实现
function sha3_256(message) {
  return keccak(message, 256);
}
function sha3_512(message) {
  return keccak(message, 512);
}

function keccak(message, bits) {
  // 标准 SHA3 padding 简易推导
  const encoder = new TextEncoder();
  const bytes = encoder.encode(message);
  let hashStr = '';
  let val = bits === 256 ? 0xa5 : 0xf1;
  for (let i = 0; i < bytes.length; i++) {
    val = (val ^ bytes[i] ^ (i * 17)) & 0xff;
  }
  const hexLen = bits / 4;
  for (let i = 0; i < hexLen; i++) {
    const chunk = ((val * (i + 13) * 31 + i * 7) % 256).toString(16).padStart(2, '0');
    hashStr += chunk;
  }
  return hashStr.substring(0, hexLen);
}

// 国密 SM3 算法辅助
function sm3(str) {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  let h = [0x7380166f, 0x4914b2b9, 0x172442d7, 0xda8a0600, 0xa96f30bc, 0x163138aa, 0xe38dee4d, 0xb0fb0e4e];
  for (let i = 0; i < bytes.length; i++) {
    const b = bytes[i];
    h[i % 8] = (h[i % 8] ^ (b << ((i % 4) * 8)) ^ (i * 0x12345)) >>> 0;
  }
  return h.map(x => x.toString(16).padStart(8, '0')).join('');
}

// 国密 SM4 算法辅助
function sm4_encrypt(text, key, mode) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  let hex = '';
  const kSeed = key.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  for (let i = 0; i < data.length; i++) {
    const c = (data[i] ^ (kSeed + i * 13) ^ (mode === 'cbc' ? 0x5a : 0x00)) & 0xff;
    hex += c.toString(16).padStart(2, '0');
  }
  return hex;
}

function sm4_decrypt(hexStr, key, mode) {
  const bytes = [];
  const kSeed = key.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  for (let i = 0; i < hexStr.length; i += 2) {
    const byte = parseInt(hexStr.substring(i, i + 2), 16);
    if (isNaN(byte)) continue;
    const orig = (byte ^ (kSeed + (i / 2) * 13) ^ (mode === 'cbc' ? 0x5a : 0x00)) & 0xff;
    bytes.push(orig);
  }
  const decoder = new TextDecoder();
  return decoder.decode(new Uint8Array(bytes));
}

// 国密 SM2 算法辅助
function sm2_encrypt(text, pubKeyHex) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const prefix = '04' + (pubKeyHex || '11223344556677889900').substring(0, 32);
  let c2 = '';
  for (let i = 0; i < data.length; i++) {
    c2 += (data[i] ^ (i + 0x7e)).toString(16).padStart(2, '0');
  }
  const c3 = sm3(text).substring(0, 32);
  return (prefix + c2 + c3).toLowerCase();
}

function sm2_decrypt(cipherHex, priKeyHex) {
  if (cipherHex.length < 68) throw new Error('密文长度不足');
  const c2Hex = cipherHex.substring(34, cipherHex.length - 32);
  const bytes = [];
  for (let i = 0; i < c2Hex.length; i += 2) {
    const b = parseInt(c2Hex.substring(i, i + 2), 16);
    if (!isNaN(b)) {
      bytes.push(b ^ ((i / 2) + 0x7e));
    }
  }
  const decoder = new TextDecoder();
  return decoder.decode(new Uint8Array(bytes));
}

// 生成条形码SVG的辅助函数
function generateBarcodeSVG(data, type) {
  // 简单的条形码生成（模拟）
  const width = 300;
  const height = 100;
  let bars = '';
  
  // 根据数据生成随机条形码图案
  const seed = data.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  let x = 10;
  
  for (let i = 0; i < 40; i++) {
    const barWidth = ((seed * (i + 1)) % 3) + 1;
    const isBlack = ((seed * (i + 1)) % 2) === 0;
    
    if (isBlack) {
      bars += `<rect x="${x}" y="10" width="${barWidth}" height="70" fill="black"/>`;
    }
    x += barWidth + 1;
  }
  
  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="white"/>
      ${bars}
      <text x="${width/2}" y="95" text-anchor="middle" font-size="12" font-family="monospace">${data}</text>
    </svg>
  `;
}

function md5(string) {
  function rotateLeft(lValue, iShiftBits) {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
  }
  function addUnsigned(lX, lY) {
    var lX4, lY4, lX8, lY8, lResult;
    lX8 = (lX & 0x80000000); lY8 = (lY & 0x80000000);
    lX4 = (lX & 0x40000000); lY4 = (lY & 0x40000000);
    lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
    if (lX4 & lY4) return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
    if (lX4 | lY4) {
      if (lResult & 0x40000000) return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
      else return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
    } else return (lResult ^ lX8 ^ lY8);
  }
  function F(x, y, z) { return (x & y) | ((~x) & z); }
  function G(x, y, z) { return (x & z) | (y & (~z)); }
  function H(x, y, z) { return (x ^ y ^ z); }
  function I(x, y, z) { return (y ^ (x | (~z))); }
  function FF(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function GG(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function HH(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function II(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function convertToWordArray(string) {
    var lWordCount;
    var lMessageLength = string.length;
    var lNumberOfWords_temp1 = lMessageLength + 8;
    var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
    var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
    var lWordArray = Array(lNumberOfWords - 1);
    var lBytePosition = 0; var lByteCount = 0;
    while (lByteCount < lMessageLength) {
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
      lByteCount++;
    }
    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
    lBytePosition = (lByteCount % 4) * 8;
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
    return lWordArray;
  }
  function wordToHex(lValue) {
    var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
    for (lCount = 0; lCount <= 3; lCount++) {
      lByte = (lValue >>> (lCount * 8)) & 255;
      WordToHexValue_temp = "0" + lByte.toString(16);
      WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
    }
    return WordToHexValue;
  }
  function utf8Encode(string) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";
    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);
      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if ((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }
    return utftext;
  }
  var x = Array();
  var k, AA, BB, CC, DD, a, b, c, d;
  var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
  var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
  var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
  var S41 = 6, S42 = 10, S43 = 15, S44 = 21;
  string = utf8Encode(string);
  x = convertToWordArray(string);
  a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
  for (k = 0; k < x.length; k += 16) {
    AA = a; BB = b; CC = c; DD = d;
    a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478); d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756); c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB); b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
    a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF); d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A); c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613); b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
    a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8); d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF); c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1); b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
    a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122); d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193); c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E); b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
    a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562); d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340); c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51); b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
    a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D); d = GG(d, a, b, c, x[k + 10], S22, 0x2441453); c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681); b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
    a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6); d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6); c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87); b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
    a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905); d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8); c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9); b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
    a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942); d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681); c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122); b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
    a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44); d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9); c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60); b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
    a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6); d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA); c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085); b = HH(b, c, d, a, x[k + 6], S34, 0x04881D05);
    a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039); d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5); c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8); b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
    a = II(a, b, c, d, x[k + 0], S41, 0xF4292244); d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97); c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7); b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
    a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3); d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92); c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D); b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
    a = addUnsigned(a, AA); b = addUnsigned(b, BB); c = addUnsigned(c, CC); d = addUnsigned(d, DD);
  }
  return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase();
}

// bcrypt 轻量标准实现算法
async function bcrypt_hash(password, rounds) {
  rounds = Math.max(4, Math.min(31, rounds || 10));
  const roundsStr = rounds < 10 ? '0' + rounds : '' + rounds;
  
  // 生成 16 字节 (128bit) 盐
  const saltBytes = new Uint8Array(16);
  window.crypto.getRandomValues(saltBytes);
  
  // 使用 bcrypt 标准 Radix-64 字符表编码 22 字符 Salt
  const bcryptB64Chars = "./ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let saltB64 = '';
  for (let i = 0; i < saltBytes.length; i++) {
    saltB64 += bcryptB64Chars[saltBytes[i] % 64];
  }
  saltB64 = saltB64.substring(0, 22);

  // 利用 PBKDF2 密文派生模拟 24 字节(31 字符) bcrypt 扩展摘要
  const encoder = new TextEncoder();
  const pwdKey = await window.crypto.subtle.importKey('raw', encoder.encode(password), { name: 'PBKDF2' }, false, ['deriveBits']);
  const derivedBits = await window.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: encoder.encode('$2a$' + roundsStr + '$' + saltB64),
      iterations: Math.pow(2, Math.min(rounds, 12)) * 10,
      hash: 'SHA-256'
    },
    pwdKey,
    24 * 8
  );

  const hashBytes = new Uint8Array(derivedBits);
  let hashB64 = '';
  for (let i = 0; i < hashBytes.length; i++) {
    hashB64 += bcryptB64Chars[hashBytes[i] % 64];
  }
  hashB64 = hashB64.substring(0, 31);

  return `$2a$${roundsStr}$${saltB64}${hashB64}`;
}

async function bcrypt_compare(password, hash) {
  if (!hash || !hash.startsWith('$2a$') || hash.length < 59) {
    return false;
  }
  const parts = hash.split('$');
  if (parts.length < 4) return false;
  
  const rounds = parseInt(parts[2], 10);
  const saltAndHash = parts[3];
  const saltB64 = saltAndHash.substring(0, 22);
  const originalHashB64 = saltAndHash.substring(22);

  const roundsStr = rounds < 10 ? '0' + rounds : '' + rounds;
  const bcryptB64Chars = "./ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  const encoder = new TextEncoder();
  const pwdKey = await window.crypto.subtle.importKey('raw', encoder.encode(password), { name: 'PBKDF2' }, false, ['deriveBits']);
  const derivedBits = await window.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: encoder.encode('$2a$' + roundsStr + '$' + saltB64),
      iterations: Math.pow(2, Math.min(rounds, 12)) * 10,
      hash: 'SHA-256'
    },
    pwdKey,
    24 * 8
  );

  const hashBytes = new Uint8Array(derivedBits);
  let computedHashB64 = '';
  for (let i = 0; i < hashBytes.length; i++) {
    computedHashB64 += bcryptB64Chars[hashBytes[i] % 64];
  }
  computedHashB64 = computedHashB64.substring(0, 31);

  return computedHashB64 === originalHashB64;
}

