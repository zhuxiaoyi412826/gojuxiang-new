// =============================================
// 图片处理工具实现
// =============================================

const ImageTools = {
  // 顶部代理方法，处理 HTML 中的 ImageTools.xxx 调用
  handleFileUpload: function(event, type) {
    if (this['image-base64'] && typeof this['image-base64'].handleFileUpload === 'function') {
      return this['image-base64'].handleFileUpload(event, type);
    }
  },
  decodeBase64: function() {
    if (this['image-base64'] && typeof this['image-base64'].decodeBase64 === 'function') {
      return this['image-base64'].decodeBase64();
    }
  },
  loadSampleBase64: function() {
    if (this['image-base64'] && typeof this['image-base64'].loadSampleBase64 === 'function') {
      return this['image-base64'].loadSampleBase64();
    }
  },
  copyBase64Format: function(format) {
    if (this['image-base64'] && typeof this['image-base64'].copyBase64Format === 'function') {
      return this['image-base64'].copyBase64Format(format);
    }
  },
  handleResize: function(event) {
    if (this['image-resize'] && typeof this['image-resize'].handleResize === 'function') {
      return this['image-resize'].handleResize(event);
    }
  },
  doResize: function() {
    if (this['image-resize'] && typeof this['image-resize'].doResize === 'function') {
      return this['image-resize'].doResize();
    }
  },
  onResizeWidthChange: function(val) {
    if (this['image-resize'] && typeof this['image-resize'].onResizeWidthChange === 'function') {
      return this['image-resize'].onResizeWidthChange(val);
    }
  },
  onResizeHeightChange: function(val) {
    if (this['image-resize'] && typeof this['image-resize'].onResizeHeightChange === 'function') {
      return this['image-resize'].onResizeHeightChange(val);
    }
  },
  setResizePercent: function(pct) {
    if (this['image-resize'] && typeof this['image-resize'].setResizePercent === 'function') {
      return this['image-resize'].setResizePercent(pct);
    }
  },
  setResizePreset: function(w, h) {
    if (this['image-resize'] && typeof this['image-resize'].setResizePreset === 'function') {
      return this['image-resize'].setResizePreset(w, h);
    }
  },
  downloadResizedImage: function() {
    if (this['image-resize'] && typeof this['image-resize'].downloadResizedImage === 'function') {
      return this['image-resize'].downloadResizedImage();
    }
  },
  handleRotate: function(event) {
    if (this['image-rotate'] && typeof this['image-rotate'].handleRotate === 'function') {
      return this['image-rotate'].handleRotate(event);
    }
  },
  doRotate: function(angle) {
    if (this['image-rotate'] && typeof this['image-rotate'].doRotate === 'function') {
      return this['image-rotate'].doRotate(angle);
    }
  },
  doFlip: function(direction) {
    if (this['image-rotate'] && typeof this['image-rotate'].doFlip === 'function') {
      return this['image-rotate'].doFlip(direction);
    }
  },
  generatePlaceholder: function() {
    if (this['placeholder'] && typeof this['placeholder'].generatePlaceholder === 'function') {
      return this['placeholder'].generatePlaceholder();
    }
  },
  previewImage: function() {
    if (this['image-format'] && typeof this['image-format'].previewImage === 'function') {
      return this['image-format'].previewImage();
    }
  },
  convertFormat: function() {
    if (this['image-format'] && typeof this['image-format'].convertFormat === 'function') {
      return this['image-format'].convertFormat();
    }
  },
  previewWatermark: function(e) {
    if (this['image-watermark'] && typeof this['image-watermark'].previewWatermark === 'function') {
      return this['image-watermark'].previewWatermark(e);
    }
  },
  addWatermark: function() {
    if (this['image-watermark'] && typeof this['image-watermark'].addWatermark === 'function') {
      return this['image-watermark'].addWatermark();
    }
  },
  downloadWatermarked: function() {
    if (this['image-watermark'] && typeof this['image-watermark'].downloadWatermarked === 'function') {
      return this['image-watermark'].downloadWatermarked();
    }
  },
  switchWatermarkType: function(type) {
    if (this['image-watermark'] && typeof this['image-watermark'].switchWatermarkType === 'function') {
      return this['image-watermark'].switchWatermarkType(type);
    }
  },
  handleWatermarkLogoUpload: function(e) {
    if (this['image-watermark'] && typeof this['image-watermark'].handleWatermarkLogoUpload === 'function') {
      return this['image-watermark'].handleWatermarkLogoUpload(e);
    }
  },
  previewCrop: function(e) {
    if (this['image-crop'] && typeof this['image-crop'].previewCrop === 'function') {
      return this['image-crop'].previewCrop(e);
    }
  },
  cropImage: function() {
    if (this['image-crop'] && typeof this['image-crop'].cropImage === 'function') {
      return this['image-crop'].cropImage();
    }
  },
  downloadCropped: function() {
    if (this['image-crop'] && typeof this['image-crop'].downloadCropped === 'function') {
      return this['image-crop'].downloadCropped();
    }
  },
  setCropRatio: function(ratio, btn) {
    if (this['image-crop'] && typeof this['image-crop'].setCropRatio === 'function') {
      return this['image-crop'].setCropRatio(ratio, btn);
    }
  },
  updateCropFromInputs: function() {
    if (this['image-crop'] && typeof this['image-crop'].updateCropFromInputs === 'function') {
      return this['image-crop'].updateCropFromInputs();
    }
  },
  downloadImage: function(dataUrl) {
    if (dataUrl) {
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'image.png';
      a.click();
    } else if (this['image-format'] && typeof this['image-format'].downloadImage === 'function') {
      this['image-format'].downloadImage();
    }
  },

  // 图片Base64
  'image-base64': {
    name: '图片Base64',
    render: () => `
      <div class="tool-section">
        <label class="tool-section-label">图片编码为 Base64</label>
        <div class="file-upload" onclick="document.getElementById('base64ImageFile').click()">
          ${ICONS.upload}
          <span>点击或拖拽图片到此处上传</span>
          <small>支持 PNG, JPG, GIF, WebP, SVG, BMP</small>
          <input type="file" id="base64ImageFile" accept="image/*" onchange="ImageTools.handleFileUpload(event, 'encode')">
        </div>
        <div id="base64EncodeResult" style="display:none; margin-top: 1rem;">
          <div class="preview-item" style="margin-bottom: 1rem; align-items: flex-start; gap: 1rem;">
            <img id="base64PreviewImg" src="" alt="预览" style="max-height: 150px; border-radius: 8px; border: 1px solid var(--border-color);">
            <div id="base64MetaInfo" style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6;"></div>
          </div>
          <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem; flex-wrap: wrap;">
            <button class="tool-page-btn primary" onclick="ImageTools.copyBase64Format('dataUrl')">${ICONS.copy} 复制 Data URL</button>
            <button class="tool-page-btn" onclick="ImageTools.copyBase64Format('raw')">复制 Raw Base64</button>
            <button class="tool-page-btn" onclick="ImageTools.copyBase64Format('html')">复制 &lt;img&gt; 标签</button>
            <button class="tool-page-btn" onclick="ImageTools.copyBase64Format('css')">复制 CSS 背景</button>
          </div>
          <textarea id="base64Output" class="tool-textarea" style="height: 120px; font-family: monospace; font-size: 0.8rem;" readonly></textarea>
        </div>
      </div>

      <div class="tool-section" style="margin-top: 1.5rem; border-top: 1px dashed var(--border-color); padding-top: 1.5rem;">
        <label class="tool-section-label">Base64 解码为图片</label>
        <textarea id="base64Input" class="tool-textarea" style="height: 100px; font-family: monospace; font-size: 0.8rem;" placeholder="粘贴 Base64 文本 (例如: data:image/png;base64,iVBORw0KGgo...)"></textarea>
        <div style="margin-top: 0.75rem; display: flex; gap: 0.5rem;">
          <button class="tool-page-btn primary" onclick="ImageTools.decodeBase64()">
            ${ICONS.play} 解码为图片
          </button>
          <button class="tool-page-btn" onclick="ImageTools.loadSampleBase64()">
            示例 Base64
          </button>
        </div>
        <div class="image-preview" id="decodedPreview" style="margin-top: 1rem;"></div>
      </div>
    `,
    encodedData: null,
    handleFileUpload: function(event) {
      const file = (event.target && event.target.files && event.target.files[0]) || (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]);
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        const img = new Image();
        img.onload = () => {
          this.encodedData = {
            dataUrl: dataUrl,
            raw: dataUrl.split(',')[1] || '',
            mime: file.type || 'image/png',
            size: (file.size / 1024).toFixed(2) + ' KB',
            dimensions: `${img.width} x ${img.height} px`,
            fileName: file.name
          };

          const previewImg = document.getElementById('base64PreviewImg');
          const metaInfo = document.getElementById('base64MetaInfo');
          const resultSec = document.getElementById('base64EncodeResult');
          const outputText = document.getElementById('base64Output');

          if (previewImg) previewImg.src = dataUrl;
          if (metaInfo) {
            metaInfo.innerHTML = `
              <div><strong>文件名：</strong> ${file.name}</div>
              <div><strong>分辨率：</strong> ${img.width} x ${img.height} px</div>
              <div><strong>文件大小：</strong> ${this.encodedData.size}</div>
              <div><strong>格式：</strong> ${file.type || 'image/png'}</div>
            `;
          }
          if (outputText) outputText.value = dataUrl;
          if (resultSec) resultSec.style.display = 'block';
          showToast('图片编码成功', 'success');
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    },
    copyBase64Format: function(format) {
      if (!this.encodedData) {
        showToast('请先上传图片', 'error');
        return;
      }
      let textToCopy = '';
      if (format === 'dataUrl') textToCopy = this.encodedData.dataUrl;
      else if (format === 'raw') textToCopy = this.encodedData.raw;
      else if (format === 'html') textToCopy = `<img src="${this.encodedData.dataUrl}" alt="${this.encodedData.fileName}" />`;
      else if (format === 'css') textToCopy = `background-image: url("${this.encodedData.dataUrl}");`;

      if (textToCopy) {
        copyToClipboard(textToCopy);
      }
    },
    decodeBase64: function() {
      const inputEl = document.getElementById('base64Input');
      const input = inputEl ? inputEl.value.trim() : '';
      const preview = document.getElementById('decodedPreview');
      if (!input) {
        showToast('请输入 Base64 文本', 'error');
        return;
      }

      let dataUrl = input;
      if (!dataUrl.startsWith('data:image')) {
        dataUrl = 'data:image/png;base64,' + input;
      }

      const img = new Image();
      img.onload = () => {
        if (preview) {
          preview.innerHTML = `
            <div class="preview-item" style="flex-direction: column; align-items: flex-start; gap: 0.5rem; background: var(--bg-secondary); padding: 1rem; border-radius: 8px;">
              <img src="${dataUrl}" alt="解码图片" style="max-height: 200px; border-radius: 4px;">
              <div style="font-size: 0.85rem; color: var(--text-secondary);">尺寸: ${img.width} x ${img.height} px</div>
              <button class="tool-result-btn" onclick="ImageTools.downloadImage('${dataUrl}')" style="margin-top: 0.25rem;">
                ${ICONS.download} 下载解码图片
              </button>
            </div>
          `;
        }
        showToast('解码成功', 'success');
      };
      img.onerror = () => {
        showToast('无效的 Base64 图片数据', 'error');
      };
      img.src = dataUrl;
    },
    loadSampleBase64: function() {
      const sample = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAA3SURBVGhD7cExAQAAAMKg9U9tDC8gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgGcDDz4AAeAChgEAAAAASUVORK5CYII=';
      const inputEl = document.getElementById('base64Input');
      if (inputEl) inputEl.value = sample;
      this.decodeBase64();
    }
  },

  // 图片缩放
  'image-resize': {
    name: '图片缩放',
    _loadedImg: null,
    _origW: 0,
    _origH: 0,
    _origSize: '',
    _resizedDataUrl: null,
    render: () => `
      <div class="tool-section">
        <label class="tool-section-label">上传图片</label>
        <div class="file-upload" onclick="document.getElementById('resizeFile').click()">
          ${ICONS.upload}
          <span>点击或拖拽图片到此处</span>
          <input type="file" id="resizeFile" accept="image/*" onchange="ImageTools.handleResize(event)">
        </div>
        <div id="resizeOriginalInfo" style="display:none; margin-top: 1rem; padding: 0.75rem; background: var(--bg-secondary); border-radius: 8px;">
          <div style="display:flex; align-items:center; gap: 1rem;">
            <img id="resizePreviewThumb" src="" style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px;">
            <div id="resizeMetaText" style="font-size: 0.85rem; color: var(--text-secondary);"></div>
          </div>
        </div>
      </div>

      <div class="tool-section" id="resizeConfigSection" style="display:none;">
        <label class="tool-section-label">尺寸设置</label>

        <div style="margin-bottom: 0.75rem;">
          <small style="color: var(--text-tertiary); display: block; margin-bottom: 0.25rem;">按百分比缩放：</small>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            <button class="tool-page-btn" onclick="ImageTools.setResizePercent(25)">25%</button>
            <button class="tool-page-btn" onclick="ImageTools.setResizePercent(50)">50%</button>
            <button class="tool-page-btn" onclick="ImageTools.setResizePercent(75)">75%</button>
            <button class="tool-page-btn" onclick="ImageTools.setResizePercent(100)">100%</button>
            <button class="tool-page-btn" onclick="ImageTools.setResizePercent(150)">150%</button>
            <button class="tool-page-btn" onclick="ImageTools.setResizePercent(200)">200%</button>
          </div>
        </div>

        <div style="margin-bottom: 0.75rem;">
          <small style="color: var(--text-tertiary); display: block; margin-bottom: 0.25rem;">常见预设尺寸：</small>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            <button class="tool-page-btn" onclick="ImageTools.setResizePreset(200, 200)">头像 (200x200)</button>
            <button class="tool-page-btn" onclick="ImageTools.setResizePreset(900, 383)">公众号封面 (900x383)</button>
            <button class="tool-page-btn" onclick="ImageTools.setResizePreset(1200, 400)">Banner (1200x400)</button>
            <button class="tool-page-btn" onclick="ImageTools.setResizePreset(1280, 720)">720P (1280x720)</button>
            <button class="tool-page-btn" onclick="ImageTools.setResizePreset(1920, 1080)">1080P (1920x1080)</button>
          </div>
        </div>

        <div class="tool-options" style="display:flex; align-items:center; gap: 1rem; flex-wrap:wrap; margin-top: 1rem;">
          <div class="tool-option" style="display:flex; align-items:center; gap:0.25rem;">
            <label>宽度：</label>
            <input type="number" id="resizeWidth" class="tool-input" value="800" min="1" style="width:100px;" oninput="ImageTools.onResizeWidthChange(this.value)">
            <span>px</span>
          </div>
          <div class="tool-option" style="display:flex; align-items:center; gap:0.25rem;">
            <label>高度：</label>
            <input type="number" id="resizeHeight" class="tool-input" value="600" min="1" style="width:100px;" oninput="ImageTools.onResizeHeightChange(this.value)">
            <span>px</span>
          </div>
          <div class="tool-option" style="display:flex; align-items:center; gap:0.25rem;">
            <input type="checkbox" id="keepRatio" checked>
            <label for="keepRatio">保持宽高比例</label>
          </div>
          <button class="tool-page-btn primary" onclick="ImageTools.doResize()">
            ${ICONS.play} 执行缩放
          </button>
        </div>
      </div>

      <div class="tool-section" id="resizeResult" style="display:none; margin-top: 1.5rem;">
        <label class="tool-section-label">缩放结果</label>
        <div id="resizeResultInfo" style="margin-bottom: 0.5rem; font-size: 0.85rem; color: var(--text-secondary);"></div>
        <div class="image-preview" id="resizeOutput"></div>
      </div>
    `,
    handleResize: function(event) {
      const file = (event.target && event.target.files && event.target.files[0]);
      if (!file) return;

      const sizeStr = (file.size / 1024).toFixed(2) + ' KB';
      const img = new Image();
      img.onload = () => {
        this._loadedImg = img;
        this._origW = img.width;
        this._origH = img.height;
        this._origSize = sizeStr;

        document.getElementById('resizeWidth').value = img.width;
        document.getElementById('resizeHeight').value = img.height;
        document.getElementById('resizePreviewThumb').src = img.src;
        document.getElementById('resizeMetaText').innerHTML = `
          <strong>原始分辨率：</strong> ${img.width} x ${img.height} px<br>
          <strong>原始文件大小：</strong> ${sizeStr}
        `;
        document.getElementById('resizeOriginalInfo').style.display = 'block';
        document.getElementById('resizeConfigSection').style.display = 'block';
        document.getElementById('resizeResult').style.display = 'none';
        showToast('图片加载成功', 'success');
      };
      img.src = URL.createObjectURL(file);
    },
    onResizeWidthChange: function(val) {
      const w = parseInt(val);
      const keepRatio = document.getElementById('keepRatio').checked;
      if (keepRatio && this._origW > 0 && !isNaN(w) && w > 0) {
        const h = Math.round((w / this._origW) * this._origH);
        document.getElementById('resizeHeight').value = h;
      }
    },
    onResizeHeightChange: function(val) {
      const h = parseInt(val);
      const keepRatio = document.getElementById('keepRatio').checked;
      if (keepRatio && this._origH > 0 && !isNaN(h) && h > 0) {
        const w = Math.round((h / this._origH) * this._origW);
        document.getElementById('resizeWidth').value = w;
      }
    },
    setResizePercent: function(pct) {
      if (!this._origW || !this._origH) {
        showToast('请先上传图片', 'error');
        return;
      }
      const w = Math.round(this._origW * (pct / 100));
      const h = Math.round(this._origH * (pct / 100));
      document.getElementById('resizeWidth').value = w;
      document.getElementById('resizeHeight').value = h;
      showToast(`设置缩放比例为 ${pct}%`, 'info');
    },
    setResizePreset: function(w, h) {
      document.getElementById('keepRatio').checked = false;
      document.getElementById('resizeWidth').value = w;
      document.getElementById('resizeHeight').value = h;
      showToast(`已调整尺寸预设为 ${w}x${h}`, 'info');
    },
    doResize: function() {
      if (!this._loadedImg) {
        showToast('请先上传图片', 'error');
        return;
      }

      const width = parseInt(document.getElementById('resizeWidth').value);
      const height = parseInt(document.getElementById('resizeHeight').value);

      if (isNaN(width) || width <= 0 || isNaN(height) || height <= 0) {
        showToast('请输入有效宽高数字', 'error');
        return;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(this._loadedImg, 0, 0, width, height);

      const result = canvas.toDataURL('image/png');
      this._resizedDataUrl = result;

      // Estimate file size
      const head = 'data:image/png;base64,';
      const approxBytes = Math.round((result.length - head.length) * 3 / 4);
      const approxSizeKb = (approxBytes / 1024).toFixed(2) + ' KB';

      document.getElementById('resizeResult').style.display = 'block';
      document.getElementById('resizeResultInfo').innerHTML = `
        缩放后分辨率: <strong>${width} x ${height} px</strong> | 估算大小: <strong>${approxSizeKb}</strong>
      `;
      document.getElementById('resizeOutput').innerHTML = `
        <div class="preview-item" style="flex-direction: column; align-items: flex-start; gap: 0.5rem;">
          <img src="${result}" alt="缩放结果" style="max-height: 260px; border-radius: 6px; border: 1px solid var(--border-color);">
          <button class="tool-result-btn" onclick="ImageTools.downloadImage('${result}')">
            ${ICONS.download} 下载缩放图片 (${width}x${height})
          </button>
        </div>
      `;
      showToast('图片缩放完成', 'success');
    }
  },
  
  // 图片旋转
  'image-rotate': {
    name: '图片旋转',
    render: () => `
      <div class="tool-section">
        <label class="tool-section-label">上传图片</label>
        <div class="file-upload" onclick="document.getElementById('rotateFile').click()">
          ${ICONS.upload}
          <span>点击上传图片</span>
          <input type="file" id="rotateFile" accept="image/*" onchange="ImageTools.handleRotate(event)">
        </div>
        <div class="image-preview" id="rotatePreview"></div>
      </div>
      <div class="tool-options">
        <button class="tool-page-btn" onclick="ImageTools.doRotate(-90)">左转90°</button>
        <button class="tool-page-btn" onclick="ImageTools.doRotate(90)">右转90°</button>
        <button class="tool-page-btn" onclick="ImageTools.doRotate(180)">旋转180°</button>
        <button class="tool-page-btn" onclick="ImageTools.doFlip('h')">水平翻转</button>
        <button class="tool-page-btn" onclick="ImageTools.doFlip('v')">垂直翻转</button>
      </div>
      <div class="tool-section" id="rotateResult" style="display:none;">
        <label class="tool-section-label">结果</label>
        <div class="image-preview" id="rotateOutput"></div>
      </div>
    `,
    handleRotate: (event) => {
      const file = event.target.files[0];
      if (!file) return;
      
      const img = new Image();
      img.onload = () => {
        window.rotateImage = img;
        document.getElementById('rotatePreview').innerHTML = `
          <div class="preview-item">
            <img src="${img.src}" alt="原图">
          </div>
        `;
      };
      img.src = URL.createObjectURL(file);
    },
    doRotate: (angle) => {
      const img = window.rotateImage;
      if (!img) {
        showToast('请先上传图片', 'error');
        return;
      }
      
      const rad = angle * Math.PI / 180;
      const sin = Math.abs(Math.sin(rad));
      const cos = Math.abs(Math.cos(rad));
      const width = Math.round(img.width * cos + img.height * sin);
      const height = Math.round(img.width * sin + img.height * cos);
      
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.translate(width / 2, height / 2);
      ctx.rotate(rad);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      
      const result = canvas.toDataURL('image/png');
      document.getElementById('rotateResult').style.display = 'block';
      document.getElementById('rotateOutput').innerHTML = `
        <div class="preview-item">
          <img src="${result}" alt="旋转结果">
          <button class="preview-item-remove" onclick="ImageTools.downloadImage('${result}')">
            ${ICONS.download}
          </button>
        </div>
      `;
    },
    doFlip: (direction) => {
      const img = window.rotateImage;
      if (!img) {
        showToast('请先上传图片', 'error');
        return;
      }
      
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      if (direction === 'h') {
        ctx.translate(img.width, 0);
        ctx.scale(-1, 1);
      } else {
        ctx.translate(0, img.height);
        ctx.scale(1, -1);
      }
      ctx.drawImage(img, 0, 0);
      
      const result = canvas.toDataURL('image/png');
      document.getElementById('rotateResult').style.display = 'block';
      document.getElementById('rotateOutput').innerHTML = `
        <div class="preview-item">
          <img src="${result}" alt="翻转结果">
          <button class="preview-item-remove" onclick="ImageTools.downloadImage('${result}')">
            ${ICONS.download}
          </button>
        </div>
      `;
    },
    downloadImage: (dataUrl) => {
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'transformed_image.png';
      a.click();
    }
  },
  
  // 占位图片生成
  'placeholder': {
    name: '占位图片',
    render: () => `
      <div class="tool-options">
        <div class="tool-option">
          <label>宽度：</label>
          <input type="number" id="phWidth" class="tool-input" value="400" min="50" max="2000" style="width:80px;">
        </div>
        <div class="tool-option">
          <label>高度：</label>
          <input type="number" id="phHeight" class="tool-input" value="300" min="50" max="2000" style="width:80px;">
        </div>
        <div class="tool-option">
          <label>文字：</label>
          <input type="text" id="phText" class="tool-input" value="${400}x${300}" style="width:100px;">
        </div>
        <div class="tool-option">
          <label>背景色：</label>
          <input type="color" id="phBg" class="color-picker" value="#cccccc">
        </div>
        <div class="tool-option">
          <label>文字色：</label>
          <input type="color" id="phColor" class="color-picker" value="#666666">
        </div>
      </div>
      <div class="tool-section" style="margin-top: 1rem;">
        <button class="tool-page-btn primary" onclick="ImageTools.generatePlaceholder()">
          ${ICONS.play} 生成
        </button>
      </div>
      <div class="tool-section" id="placeholderResult" style="display:none;">
        <label class="tool-section-label">预览</label>
        <div style="text-align: center; padding: 1rem;">
          <img id="placeholderImg" style="max-width: 100%; border-radius: 8px;">
        </div>
      </div>
    `,
    generatePlaceholder: () => {
      const width = parseInt(document.getElementById('phWidth').value);
      const height = parseInt(document.getElementById('phHeight').value);
      const text = document.getElementById('phText').value || `${width}x${height}`;
      const bg = document.getElementById('phBg').value.replace('#', '');
      const color = document.getElementById('phColor').value.replace('#', '');
      
      const url = `https://via.placeholder.com/${width}x${height}/${bg}/${color}?text=${encodeURIComponent(text)}`;
      
      document.getElementById('placeholderResult').style.display = 'block';
      document.getElementById('placeholderImg').src = url;
    }
  },
  
  // 图片格式转换
  'image-format': {
    name: '图片格式转换',
    render: () => `
      <div class="tool-section">
        <label class="tool-section-label">选择图片</label>
        <input type="file" id="imageInput" class="tool-file" accept="image/*" onchange="ImageTools.previewImage()">
      </div>
      <div class="tool-section" id="previewSection" style="display:none;">
        <label class="tool-section-label">预览</label>
        <img id="imagePreview" class="image-preview" alt="预览">
      </div>
      <div class="tool-section">
        <label class="tool-section-label">目标格式</label>
        <select id="targetFormat" class="tool-select">
          <option value="image/png">PNG</option>
          <option value="image/jpeg">JPEG</option>
          <option value="image/webp">WebP</option>
        </select>
      </div>
      <div class="tool-options">
        <button class="tool-page-btn primary" onclick="ImageTools.convertFormat()">
          ${ICONS.play} 转换格式
        </button>
      </div>
      <div class="tool-section" id="resultSection" style="display:none;">
        <label class="tool-section-label">转换结果</label>
        <div class="image-result" id="imageResult"></div>
        <button class="tool-result-btn" onclick="ImageTools.downloadImage()">
          ${ICONS.download} 下载图片
        </button>
      </div>
    `,
    previewImage: () => {
      const file = document.getElementById('imageInput').files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          document.getElementById('imagePreview').src = e.target.result;
          document.getElementById('previewSection').style.display = 'block';
        };
        reader.readAsDataURL(file);
      }
    },
    convertFormat: () => {
      const file = document.getElementById('imageInput').files[0];
      const format = document.getElementById('targetFormat').value;
      
      if (!file) {
        showToast('请选择图片', 'error');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          
          const dataUrl = canvas.toDataURL(format);
          document.getElementById('resultSection').style.display = 'block';
          document.getElementById('imageResult').innerHTML = `<img src="${dataUrl}" class="image-preview">`;
          ImageTools.convertedImage = dataUrl;
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    downloadImage: () => {
      if (ImageTools.convertedImage) {
        const link = document.createElement('a');
        link.href = ImageTools.convertedImage;
        link.download = 'converted-image.png';
        link.click();
      }
    },
    convertedImage: null,
    run: () => {}
  },
  
  // 图片水印
  'image-watermark': {
    name: '图片水印',
    _loadedImg: null,
    _loadedLogoImg: null,
    _watermarkMode: 'text', // 'text' | 'logo'
    _watermarkResultDataUrl: null,
    render: () => `
      <div class="tool-section">
        <label class="tool-section-label">选择目标图片</label>
        <div class="file-upload" onclick="document.getElementById('watermarkImageInput').click()">
          ${ICONS.upload}
          <span>点击或拖拽上传需要添加水印的图片</span>
          <input type="file" id="watermarkImageInput" class="tool-file" accept="image/*" onchange="ImageTools.previewWatermark(event)">
        </div>
        <div id="wmOriginalPreviewSec" style="display:none; margin-top: 1rem;">
          <img id="wmOriginalImg" src="" style="max-height: 160px; border-radius: 8px; border: 1px solid var(--border-color);">
        </div>
      </div>

      <div class="tool-section" id="wmConfigSec" style="display:none;">
        <label class="tool-section-label">水印参数配置</label>

        <!-- 水印类型切换 -->
        <div style="display:flex; gap: 0.5rem; margin-bottom: 1rem;">
          <button id="wmTypeBtnText" class="tool-page-btn primary" onclick="ImageTools.switchWatermarkType('text')">文字水印</button>
          <button id="wmTypeBtnLogo" class="tool-page-btn" onclick="ImageTools.switchWatermarkType('logo')">图片 Logo 水印</button>
        </div>

        <!-- 文字水印面板 -->
        <div id="wmPanelText" style="display:block;">
          <div class="tool-options" style="flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem;">
            <div class="tool-option" style="flex: 1; min-width: 200px;">
              <label>水印内容：</label>
              <input type="text" id="wmTextContent" class="tool-input" value="仅供验证使用" placeholder="请输入水印文本" style="width: 100%;">
            </div>
            <div class="tool-option">
              <label>字号 (px)：</label>
              <input type="number" id="wmFontSize" class="tool-input" value="36" min="10" max="200" style="width: 80px;">
            </div>
            <div class="tool-option">
              <label>字体颜色：</label>
              <input type="color" id="wmColor" class="color-picker" value="#ffffff">
            </div>
            <div class="tool-option">
              <label>透明度：<span id="wmOpacityTextVal">60%</span></label>
              <input type="range" id="wmOpacityText" min="10" max="100" value="60" style="width: 100px;" oninput="document.getElementById('wmOpacityTextVal').textContent = this.value + '%'">
            </div>
            <div class="tool-option">
              <label>旋转角度：<span id="wmAngleTextVal">-30°</span></label>
              <input type="range" id="wmAngleText" min="-180" max="180" value="-30" style="width: 100px;" oninput="document.getElementById('wmAngleTextVal').textContent = this.value + '°'">
            </div>
            <div class="tool-option" style="display:flex; align-items:center; gap: 0.25rem;">
              <input type="checkbox" id="wmTextShadow" checked>
              <label for="wmTextShadow">开启文字阴影描边 (防重叠模糊)</label>
            </div>
          </div>
        </div>

        <!-- 图片 Logo 水印面板 -->
        <div id="wmPanelLogo" style="display:none;">
          <div class="tool-options" style="flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem;">
            <div class="tool-option">
              <label>上传 Logo 图片：</label>
              <input type="file" id="wmLogoFileInput" accept="image/*" class="tool-file" onchange="ImageTools.handleWatermarkLogoUpload(event)">
            </div>
            <div class="tool-option">
              <label>Logo 缩放：<span id="wmLogoScaleVal">30%</span></label>
              <input type="range" id="wmLogoScale" min="5" max="200" value="30" style="width: 100px;" oninput="document.getElementById('wmLogoScaleVal').textContent = this.value + '%'">
            </div>
            <div class="tool-option">
              <label>Logo 透明度：<span id="wmLogoOpacityVal">70%</span></label>
              <input type="range" id="wmLogoOpacity" min="10" max="100" value="70" style="width: 100px;" oninput="document.getElementById('wmLogoOpacityVal').textContent = this.value + '%'">
            </div>
          </div>
          <div id="wmLogoPreviewThumb" style="display:none; margin-bottom: 1rem;">
            <small style="color: var(--text-tertiary);">Logo 预览：</small><br>
            <img id="wmLogoImg" src="" style="max-height: 50px; background: #eee; border-radius: 4px; padding: 4px;">
          </div>
        </div>

        <!-- 水印位置 -->
        <div style="margin-top: 1rem;">
          <label class="tool-section-label">水印排版位置</label>
          <div class="tool-options" style="flex-wrap: wrap; gap: 1rem;">
            <div class="tool-option">
              <select id="wmPosition" class="tool-select" style="min-width: 180px;">
                <option value="tile">满屏平铺 (防伪防盗防造假)</option>
                <option value="bottom-right" selected>右下角</option>
                <option value="bottom-left">左下角</option>
                <option value="top-right">右上角</option>
                <option value="top-left">左上角</option>
                <option value="center">居中正中</option>
              </select>
            </div>
            <button class="tool-page-btn primary" onclick="ImageTools.addWatermark()">
              ${ICONS.play} 生成水印图片
            </button>
          </div>
        </div>
      </div>

      <div class="tool-section" id="wmResultSec" style="display:none; margin-top: 1.5rem;">
        <label class="tool-section-label">水印生成结果</label>
        <div class="image-preview" id="wmResultOutput"></div>
      </div>
    `,
    switchWatermarkType: function(type) {
      this._watermarkMode = type;
      const btnText = document.getElementById('wmTypeBtnText');
      const btnLogo = document.getElementById('wmTypeBtnLogo');
      const panelText = document.getElementById('wmPanelText');
      const panelLogo = document.getElementById('wmPanelLogo');

      if (type === 'text') {
        if (btnText) btnText.className = 'tool-page-btn primary';
        if (btnLogo) btnLogo.className = 'tool-page-btn';
        if (panelText) panelText.style.display = 'block';
        if (panelLogo) panelLogo.style.display = 'none';
      } else {
        if (btnText) btnText.className = 'tool-page-btn';
        if (btnLogo) btnLogo.className = 'tool-page-btn primary';
        if (panelText) panelText.style.display = 'none';
        if (panelLogo) panelLogo.style.display = 'block';
      }
    },
    previewWatermark: function(event) {
      const file = (event && event.target && event.target.files && event.target.files[0]) ||
                   (document.getElementById('watermarkImageInput') && document.getElementById('watermarkImageInput').files[0]);
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          this._loadedImg = img;
          const previewImg = document.getElementById('wmOriginalImg');
          const previewSec = document.getElementById('wmOriginalPreviewSec');
          const configSec = document.getElementById('wmConfigSec');

          if (previewImg) previewImg.src = e.target.result;
          if (previewSec) previewSec.style.display = 'block';
          if (configSec) configSec.style.display = 'block';
          showToast('目标图片已载入', 'success');
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    handleWatermarkLogoUpload: function(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          this._loadedLogoImg = img;
          const logoImg = document.getElementById('wmLogoImg');
          const logoThumb = document.getElementById('wmLogoPreviewThumb');
          if (logoImg) logoImg.src = e.target.result;
          if (logoThumb) logoThumb.style.display = 'block';
          showToast('Logo 图片载入成功', 'success');
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    addWatermark: function() {
      if (!this._loadedImg) {
        showToast('请先选择目标图片', 'error');
        return;
      }

      const img = this._loadedImg;
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      // Draw base image
      ctx.drawImage(img, 0, 0);

      const position = document.getElementById('wmPosition').value;

      if (this._watermarkMode === 'text') {
        const text = (document.getElementById('wmTextContent').value || '').trim();
        if (!text) {
          showToast('请输入水印文字', 'error');
          return;
        }

        const fontSize = parseInt(document.getElementById('wmFontSize').value) || 36;
        const color = document.getElementById('wmColor').value;
        const opacity = (parseInt(document.getElementById('wmOpacityText').value) || 60) / 100;
        const angle = (parseInt(document.getElementById('wmAngleText').value) || 0) * (Math.PI / 180);
        const useShadow = document.getElementById('wmTextShadow').checked;

        ctx.font = `bold ${fontSize}px sans-serif, "PingFang SC", "Microsoft YaHei"`;
        const metrics = ctx.measureText(text);
        const textWidth = metrics.width;
        const textHeight = fontSize;

        if (position === 'tile') {
          // Tile Mode across canvas
          ctx.save();
          ctx.globalAlpha = opacity;
          ctx.fillStyle = color;

          const stepX = textWidth + fontSize * 3;
          const stepY = fontSize * 4;

          for (let x = -canvas.width; x < canvas.width * 2; x += stepX) {
            for (let y = -canvas.height; y < canvas.height * 2; y += stepY) {
              ctx.save();
              ctx.translate(x, y);
              ctx.rotate(angle);
              if (useShadow) {
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
                ctx.lineWidth = Math.max(2, fontSize / 12);
                ctx.strokeText(text, 0, 0);
              }
              ctx.fillText(text, 0, 0);
              ctx.restore();
            }
          }
          ctx.restore();
        } else {
          // Single Position Mode
          const padding = Math.max(20, fontSize * 0.5);
          let posX = padding;
          let posY = padding + textHeight;

          if (position === 'bottom-right') {
            posX = canvas.width - textWidth - padding;
            posY = canvas.height - padding;
          } else if (position === 'bottom-left') {
            posX = padding;
            posY = canvas.height - padding;
          } else if (position === 'top-right') {
            posX = canvas.width - textWidth - padding;
            posY = padding + textHeight;
          } else if (position === 'top-left') {
            posX = padding;
            posY = padding + textHeight;
          } else if (position === 'center') {
            posX = (canvas.width - textWidth) / 2;
            posY = (canvas.height + textHeight) / 2;
          }

          ctx.save();
          ctx.globalAlpha = opacity;
          ctx.fillStyle = color;
          ctx.translate(posX + textWidth / 2, posY - textHeight / 2);
          ctx.rotate(angle);

          if (useShadow) {
            ctx.strokeStyle = 'rgba(0,0,0,0.5)';
            ctx.lineWidth = Math.max(2, fontSize / 10);
            ctx.strokeText(text, -textWidth / 2, textHeight / 2);
          }
          ctx.fillText(text, -textWidth / 2, textHeight / 2);
          ctx.restore();
        }
      } else {
        // Logo Watermark Mode
        if (!this._loadedLogoImg) {
          showToast('请先上传 Logo 图标', 'error');
          return;
        }

        const logo = this._loadedLogoImg;
        const scalePct = (parseInt(document.getElementById('wmLogoScale').value) || 30) / 100;
        const opacity = (parseInt(document.getElementById('wmLogoOpacity').value) || 70) / 100;

        const logoW = logo.width * scalePct;
        const logoH = logo.height * scalePct;

        if (position === 'tile') {
          ctx.save();
          ctx.globalAlpha = opacity;
          const stepX = logoW + 80;
          const stepY = logoH + 80;
          for (let x = 0; x < canvas.width; x += stepX) {
            for (let y = 0; y < canvas.height; y += stepY) {
              ctx.drawImage(logo, x, y, logoW, logoH);
            }
          }
          ctx.restore();
        } else {
          const padding = 20;
          let posX = padding;
          let posY = padding;

          if (position === 'bottom-right') {
            posX = canvas.width - logoW - padding;
            posY = canvas.height - logoH - padding;
          } else if (position === 'bottom-left') {
            posX = padding;
            posY = canvas.height - logoH - padding;
          } else if (position === 'top-right') {
            posX = canvas.width - logoW - padding;
            posY = padding;
          } else if (position === 'top-left') {
            posX = padding;
            posY = padding;
          } else if (position === 'center') {
            posX = (canvas.width - logoW) / 2;
            posY = (canvas.height - logoH) / 2;
          }

          ctx.save();
          ctx.globalAlpha = opacity;
          ctx.drawImage(logo, posX, posY, logoW, logoH);
          ctx.restore();
        }
      }

      const resultDataUrl = canvas.toDataURL('image/png');
      this._watermarkResultDataUrl = resultDataUrl;

      document.getElementById('wmResultSec').style.display = 'block';
      document.getElementById('wmResultOutput').innerHTML = `
        <div class="preview-item" style="flex-direction: column; align-items: flex-start; gap: 0.5rem;">
          <img src="${resultDataUrl}" style="max-height: 300px; border-radius: 8px; border: 1px solid var(--border-color);">
          <button class="tool-result-btn" onclick="ImageTools.downloadWatermarked()">
            ${ICONS.download} 下载加水印后的图片
          </button>
        </div>
      `;
      showToast('水印添加成功', 'success');
    },
    downloadWatermarked: function() {
      if (this._watermarkResultDataUrl) {
        const link = document.createElement('a');
        link.href = this._watermarkResultDataUrl;
        link.download = 'watermarked-image.png';
        link.click();
      } else {
        showToast('未找到可下载的水印图片', 'error');
      }
    }
  },

  // 图片水印 (别名与旧模板兼容)
  'imagewatermark': {
    name: '图片水印',
    render: () => ImageTools['image-watermark'].render(),
    previewWatermark: (...args) => ImageTools['image-watermark'].previewWatermark(...args),
    addWatermark: (...args) => ImageTools['image-watermark'].addWatermark(...args),
    downloadWatermarked: (...args) => ImageTools['image-watermark'].downloadWatermarked(...args)
  },

  // 图片裁剪
  'image-crop': {
    name: '图片裁剪',
    _loadedImg: null,
    _cropCanvas: null,
    _cropCtx: null,
    _cropData: { x: 0, y: 0, w: 200, h: 200 },
    _aspectRatio: null, // null for free, or float ratio
    _croppedDataUrl: null,
    render: () => `
      <div class="tool-section">
        <label class="tool-section-label">上传需要裁剪的图片</label>
        <div class="file-upload" onclick="document.getElementById('cropFileInput').click()">
          ${ICONS.upload}
          <span>点击或拖拽图片到此处</span>
          <input type="file" id="cropFileInput" accept="image/*" onchange="ImageTools.previewCrop(event)">
        </div>
      </div>

      <div class="tool-section" id="cropWorkspaceSec" style="display:none;">
        <label class="tool-section-label">裁剪比例与参数</label>

        <!-- 常用比例预设卡片 -->
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem;">
          <button class="tool-page-btn primary crop-ratio-btn" onclick="ImageTools.setCropRatio(null, this)">自由比例</button>
          <button class="tool-page-btn crop-ratio-btn" onclick="ImageTools.setCropRatio(1, this)">1:1 (正方形)</button>
          <button class="tool-page-btn crop-ratio-btn" onclick="ImageTools.setCropRatio(4/3, this)">4:3 (标准照片)</button>
          <button class="tool-page-btn crop-ratio-btn" onclick="ImageTools.setCropRatio(16/9, this)">16:9 (宽屏)</button>
          <button class="tool-page-btn crop-ratio-btn" onclick="ImageTools.setCropRatio(9/16, this)">9:16 (手机全屏)</button>
          <button class="tool-page-btn crop-ratio-btn" onclick="ImageTools.setCropRatio(3/2, this)">3:2 (经典图)</button>
        </div>

        <div class="crop-controls" style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center; margin-bottom: 1rem;">
          <div class="crop-control">
            <label>X 起点：</label>
            <input type="number" id="cropX" class="tool-input" value="0" min="0" style="width:75px;" oninput="ImageTools.updateCropFromInputs()">
          </div>
          <div class="crop-control">
            <label>Y 起点：</label>
            <input type="number" id="cropY" class="tool-input" value="0" min="0" style="width:75px;" oninput="ImageTools.updateCropFromInputs()">
          </div>
          <div class="crop-control">
            <label>裁剪宽度：</label>
            <input type="number" id="cropWidth" class="tool-input" value="200" min="10" style="width:85px;" oninput="ImageTools.updateCropFromInputs()">
          </div>
          <div class="crop-control">
            <label>裁剪高度：</label>
            <input type="number" id="cropHeight" class="tool-input" value="200" min="10" style="width:85px;" oninput="ImageTools.updateCropFromInputs()">
          </div>
          <button class="tool-page-btn primary" onclick="ImageTools.cropImage()">
            ${ICONS.play} 执行裁剪
          </button>
        </div>

        <!-- 画板预览与裁剪框 -->
        <div style="background: var(--bg-secondary); padding: 1rem; border-radius: 8px; text-align: center; border: 1px solid var(--border-color); overflow: auto;">
          <canvas id="cropInteractiveCanvas" style="max-width: 100%; height: auto; border-radius: 4px; cursor: crosshair;"></canvas>
        </div>
      </div>

      <div class="tool-section" id="cropResultSec" style="display:none; margin-top: 1.5rem;">
        <label class="tool-section-label">裁剪结果</label>
        <div class="image-preview" id="cropResultOutput"></div>
      </div>
    `,
    previewCrop: function(event) {
      const file = (event && event.target && event.target.files && event.target.files[0]) ||
                   (document.getElementById('cropFileInput') && document.getElementById('cropFileInput').files[0]);
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          this._loadedImg = img;

          // Default crop box: center 60% of image
          const defaultW = Math.round(img.width * 0.6);
          const defaultH = Math.round(img.height * 0.6);
          const defaultX = Math.round((img.width - defaultW) / 2);
          const defaultY = Math.round((img.height - defaultH) / 2);

          this._cropData = { x: defaultX, y: defaultY, w: defaultW, h: defaultH };

          document.getElementById('cropX').value = defaultX;
          document.getElementById('cropY').value = defaultY;
          document.getElementById('cropWidth').value = defaultW;
          document.getElementById('cropHeight').value = defaultH;

          document.getElementById('cropWorkspaceSec').style.display = 'block';
          document.getElementById('cropResultSec').style.display = 'none';

          this._drawCropCanvas();
          this._initCanvasEvents();
          showToast('图片加载完成，请调整裁剪框', 'success');
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    setCropRatio: function(ratio, btnEl) {
      this._aspectRatio = ratio;

      // Update button active state
      const btns = document.querySelectorAll('.crop-ratio-btn');
      btns.forEach(b => b.className = 'tool-page-btn crop-ratio-btn');
      if (btnEl) btnEl.className = 'tool-page-btn primary crop-ratio-btn';

      if (ratio && this._loadedImg) {
        let w = this._cropData.w;
        let h = Math.round(w / ratio);
        if (h > this._loadedImg.height) {
          h = this._loadedImg.height;
          w = Math.round(h * ratio);
        }
        this._cropData.w = w;
        this._cropData.h = h;
        document.getElementById('cropWidth').value = w;
        document.getElementById('cropHeight').value = h;
        this._drawCropCanvas();
      }
    },
    updateCropFromInputs: function() {
      if (!this._loadedImg) return;
      const x = parseInt(document.getElementById('cropX').value) || 0;
      const y = parseInt(document.getElementById('cropY').value) || 0;
      const w = parseInt(document.getElementById('cropWidth').value) || 10;
      const h = parseInt(document.getElementById('cropHeight').value) || 10;

      this._cropData = { x, y, w, h };
      this._drawCropCanvas();
    },
    _drawCropCanvas: function() {
      const img = this._loadedImg;
      if (!img) return;

      const canvas = document.getElementById('cropInteractiveCanvas');
      if (!canvas) return;

      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      // 1. Draw original image
      ctx.drawImage(img, 0, 0);

      // 2. Draw dark translucent overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 3. Clear crop area to show sharp image
      const { x, y, w, h } = this._cropData;
      ctx.clearRect(x, y, w, h);
      ctx.drawImage(img, x, y, w, h, x, y, w, h);

      // 4. Draw bright grid border on crop area
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = Math.max(2, Math.round(canvas.width / 400));
      ctx.strokeRect(x, y, w, h);

      // Rule of thirds grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      // vertical grid
      ctx.moveTo(x + w / 3, y); ctx.lineTo(x + w / 3, y + h);
      ctx.moveTo(x + (w * 2) / 3, y); ctx.lineTo(x + (w * 2) / 3, y + h);
      // horizontal grid
      ctx.moveTo(x, y + h / 3); ctx.lineTo(x + w, y + h / 3);
      ctx.moveTo(x, y + (h * 2) / 3); ctx.lineTo(x + w, y + (h * 2) / 3);
      ctx.stroke();
    },
    _initCanvasEvents: function() {
      const canvas = document.getElementById('cropInteractiveCanvas');
      if (!canvas) return;

      let isDragging = false;
      let startX = 0;
      let startY = 0;
      let initialCropX = 0;
      let initialCropY = 0;

      const getPos = (e) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
          x: (clientX - rect.left) * scaleX,
          y: (clientY - rect.top) * scaleY
        };
      };

      canvas.onmousedown = (e) => {
        const pos = getPos(e);
        isDragging = true;
        startX = pos.x;
        startY = pos.y;
        initialCropX = this._cropData.x;
        initialCropY = this._cropData.y;
      };

      canvas.onmousemove = (e) => {
        if (!isDragging || !this._loadedImg) return;
        const pos = getPos(e);
        const dx = pos.x - startX;
        const dy = pos.y - startY;

        let newX = Math.max(0, Math.min(this._loadedImg.width - this._cropData.w, initialCropX + dx));
        let newY = Math.max(0, Math.min(this._loadedImg.height - this._cropData.h, initialCropY + dy));

        this._cropData.x = Math.round(newX);
        this._cropData.y = Math.round(newY);

        document.getElementById('cropX').value = this._cropData.x;
        document.getElementById('cropY').value = this._cropData.y;

        this._drawCropCanvas();
      };

      window.onmouseup = () => {
        isDragging = false;
      };
    },
    cropImage: function() {
      if (!this._loadedImg) {
        showToast('请先选择图片', 'error');
        return;
      }

      const { x, y, w, h } = this._cropData;
      if (w <= 0 || h <= 0) {
        showToast('裁剪尺寸无效', 'error');
        return;
      }

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(this._loadedImg, x, y, w, h, 0, 0, w, h);

      const dataUrl = canvas.toDataURL('image/png');
      this._croppedDataUrl = dataUrl;

      document.getElementById('cropResultSec').style.display = 'block';
      document.getElementById('cropResultOutput').innerHTML = `
        <div class="preview-item" style="flex-direction: column; align-items: flex-start; gap: 0.5rem;">
          <img src="${dataUrl}" style="max-height: 280px; border-radius: 8px; border: 1px solid var(--border-color);">
          <div style="font-size: 0.85rem; color: var(--text-secondary);">尺寸: ${w} x ${h} px</div>
          <button class="tool-result-btn" onclick="ImageTools.downloadCropped()">
            ${ICONS.download} 下载裁剪后的图片 (${w}x${h})
          </button>
        </div>
      `;
      showToast('图片裁剪完成', 'success');
    },
    downloadCropped: function() {
      if (this._croppedDataUrl) {
        const link = document.createElement('a');
        link.href = this._croppedDataUrl;
        link.download = 'cropped-image.png';
        link.click();
      } else {
        showToast('未找到可下载的裁剪图片', 'error');
      }
    }
  },

  // 图片压缩
  'image-compress': {
    name: '图片压缩',
    render: () => `
      <div class="tool-section">
        <label class="tool-section-label">上传图片</label>
        <div class="file-upload" onclick="document.getElementById('compressFile').click()">
          ${ICONS.upload}
          <span>点击上传需要压缩的图片</span>
          <small>支持 PNG, JPG, WebP 等各种图片格式</small>
          <input type="file" id="compressFile" accept="image/*" onchange="ImageTools['image-compress'].previewCompress(event)">
        </div>
      </div>
      <div class="tool-section" id="compressOptions" style="display:none;">
        <div class="tool-options" style="flex-wrap: wrap; gap: 1rem;">
          <div class="tool-option">
            <label>压缩质量：<strong id="compressQualityVal">80%</strong></label>
            <input type="range" id="compressQuality" min="10" max="100" value="80" style="width:140px;" oninput="document.getElementById('compressQualityVal').textContent = this.value + '%'">
          </div>
          <div class="tool-option">
            <label>最大宽度(可选)：</label>
            <input type="number" id="compressMaxWidth" class="tool-input" placeholder="不限制" style="width:90px;">
          </div>
          <button class="tool-page-btn primary" onclick="ImageTools['image-compress'].doCompress()">
            ${ICONS.play} 开始压缩
          </button>
        </div>
      </div>
      <div class="tool-section" id="compressResultSection" style="display:none;">
        <label class="tool-section-label">压缩对比结果</label>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
          <div style="background: var(--bg-secondary); padding: 1rem; border-radius: 8px; text-align: center;">
            <div style="font-weight: 600; margin-bottom: 0.5rem;">原图</div>
            <div id="originalSizeInfo" style="font-size: 0.9rem; color: var(--text-tertiary); margin-bottom: 0.5rem;"></div>
            <img id="originalCompressImg" style="max-width: 100%; max-height: 200px; border-radius: 6px; border: 1px solid var(--border-color);">
          </div>
          <div style="background: var(--bg-secondary); padding: 1rem; border-radius: 8px; text-align: center;">
            <div style="font-weight: 600; color: var(--accent); margin-bottom: 0.5rem;">压缩后</div>
            <div id="compressedSizeInfo" style="font-size: 0.9rem; color: var(--accent); font-weight: 600; margin-bottom: 0.5rem;"></div>
            <img id="compressedCompressImg" style="max-width: 100%; max-height: 200px; border-radius: 6px; border: 1px solid var(--border-color);">
          </div>
        </div>
        <div style="text-align: center;">
          <button class="tool-page-btn primary" onclick="ImageTools['image-compress'].downloadCompressed()">
            ${ICONS.download} 下载压缩后的图片
          </button>
        </div>
      </div>
    `,
    previewCompress: (e) => {
      const file = e.target.files[0];
      if (!file) return;
      ImageTools._compressSourceFile = file;
      document.getElementById('compressOptions').style.display = 'block';
      
      const reader = new FileReader();
      reader.onload = (evt) => {
        const img = new Image();
        img.onload = () => {
          ImageTools._loadedCompressImage = img;
          document.getElementById('originalCompressImg').src = evt.target.result;
          document.getElementById('originalSizeInfo').textContent = `${img.width}x${img.height} | ${(file.size / 1024).toFixed(1)} KB`;
        };
        img.src = evt.target.result;
      };
      reader.readAsDataURL(file);
    },
    doCompress: () => {
      const img = ImageTools._loadedCompressImage;
      const file = ImageTools._compressSourceFile;
      if (!img) {
        showToast('请先选择图片', 'error');
        return;
      }
      const quality = (parseInt(document.getElementById('compressQuality').value) || 80) / 100;
      const maxWidth = parseInt(document.getElementById('compressMaxWidth').value);

      let width = img.width;
      let height = img.height;
      if (maxWidth && width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      const mimeType = file.type === 'image/png' ? 'image/jpeg' : (file.type || 'image/jpeg');
      const dataUrl = canvas.toDataURL(mimeType, quality);
      
      const head = 'data:' + mimeType + ';base64,';
      const bytes = Math.round((dataUrl.length - head.length) * 3 / 4);
      const savings = Math.round((1 - bytes / file.size) * 100);

      document.getElementById('compressedCompressImg').src = dataUrl;
      document.getElementById('compressedSizeInfo').textContent = `${width}x${height} | ${(bytes / 1024).toFixed(1)} KB (${savings > 0 ? '体积减少 ' + savings + '%' : '文件轻微变化'})`;
      document.getElementById('compressResultSection').style.display = 'block';
      ImageTools._compressedResultDataUrl = dataUrl;
    },
    downloadCompressed: () => {
      if (ImageTools._compressedResultDataUrl) {
        const a = document.createElement('a');
        a.href = ImageTools._compressedResultDataUrl;
        a.download = 'compressed_image.jpg';
        a.click();
      }
    }
  },

  // Favicon生成
  'favicon': {
    name: 'Favicon生成',
    render: () => `
      <div class="tool-section">
        <label class="tool-section-label">上传图标源文件</label>
        <div class="file-upload" onclick="document.getElementById('faviconFile').click()">
          ${ICONS.upload}
          <span>选择或拖拽图片 (建议 512x512 高清 PNG)</span>
          <input type="file" id="faviconFile" accept="image/*" onchange="ImageTools['favicon'].previewFavicon(event)">
        </div>
      </div>
      <div class="tool-section" id="faviconOptions" style="display:none;">
        <label class="tool-section-label">生成尺寸预览</label>
        <div id="faviconPreviewGrid" style="display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 1.5rem; align-items: flex-end;"></div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button class="tool-page-btn primary" onclick="ImageTools['favicon'].downloadFavicon(32)">
            ${ICONS.download} 下载 32x32 (standard)
          </button>
          <button class="tool-page-btn" onclick="ImageTools['favicon'].downloadFavicon(64)">
            ${ICONS.download} 下载 64x64
          </button>
          <button class="tool-page-btn" onclick="ImageTools['favicon'].downloadFavicon(128)">
            ${ICONS.download} 下载 128x128
          </button>
        </div>
        <div style="margin-top: 1rem;">
          <label class="tool-section-label">网页 HTML 引入代码</label>
          <div class="tool-result">
            <textarea class="tool-textarea tool-result-textarea" readonly style="height: 60px;"><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"></textarea>
            <div class="tool-result-actions">
              <button class="tool-result-btn" onclick="copyToClipboard('<link rel=\\&quot;icon\\&quot; type=\\&quot;image/png\\&quot; sizes=\\&quot;32x32\\&quot; href=\\&quot;/favicon-32x32.png\\&quot;>\\n<link rel=\\&quot;icon\\&quot; type=\\&quot;image/png\\&quot; sizes=\\&quot;16x16\\&quot; href=\\&quot;/favicon-16x16.png\\&quot;>')">
                ${ICONS.copy} 复制 HTML
              </button>
            </div>
          </div>
        </div>
      </div>
    `,
    previewFavicon: (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        const img = new Image();
        img.onload = () => {
          ImageTools._faviconSourceImg = img;
          const grid = document.getElementById('faviconPreviewGrid');
          grid.innerHTML = '';
          const sizes = [16, 32, 48, 64, 128];
          ImageTools._faviconCanvasMap = {};

          sizes.forEach(sz => {
            const canvas = document.createElement('canvas');
            canvas.width = sz;
            canvas.height = sz;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, sz, sz);
            ImageTools._faviconCanvasMap[sz] = canvas;

            const item = document.createElement('div');
            item.style.textAlign = 'center';
            item.innerHTML = `
              <div style="padding: 8px; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 6px; display: flex; align-items: center; justify-content: center; min-width: ${Math.max(sz + 16, 48)}px; min-height: ${Math.max(sz + 16, 48)}px;">
                <img src="${canvas.toDataURL()}" style="width:${sz}px; height:${sz}px;">
              </div>
              <span style="font-size: 0.75rem; color: var(--text-tertiary); margin-top: 4px; display: block;">${sz}x${sz}</span>
            `;
            grid.appendChild(item);
          });
          document.getElementById('faviconOptions').style.display = 'block';
        };
        img.src = evt.target.result;
      };
      reader.readAsDataURL(file);
    },
    downloadFavicon: (size) => {
      const canvas = ImageTools._faviconCanvasMap && ImageTools._faviconCanvasMap[size];
      if (canvas) {
        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = `favicon-${size}x${size}.png`;
        a.click();
      } else {
        showToast('请先选择图标文件', 'error');
      }
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
