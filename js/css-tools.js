// =============================================
// CSS / UI 样式生成器工具 (CSS & UI Tools)
// =============================================

const CssTools = {
  // ---------------------------------------------
  // 1. CSS 渐变与阴影生成器
  // ---------------------------------------------
  'css-gradient-shadow': {
    activeTab: 'gradient',

    gradientState: {
      type: 'linear',
      angle: 135,
      color1: '#8b5cf6',
      pos1: 0,
      color2: '#3b82f6',
      pos2: 100
    },

    shadowState: {
      inset: false,
      x: 0,
      y: 10,
      blur: 25,
      spread: -5,
      color: '#000000',
      opacity: 0.15
    },

    textShadowState: {
      x: 2,
      y: 4,
      blur: 8,
      color: '#8b5cf6',
      opacity: 0.5
    },

    glassState: {
      blur: 12,
      bgOpacity: 0.2,
      borderOpacity: 0.3,
      bgColor: '#ffffff'
    },

    render() {
      return `
        <div class="tool-section">
          <!-- 模式切换卡 -->
          <div class="tool-tabs" id="cssGenTabs">
            <button class="tool-tab active" onclick="CssTools['css-gradient-shadow'].switchTab('gradient', this)">🌈 CSS 渐变</button>
            <button class="tool-tab" onclick="CssTools['css-gradient-shadow'].switchTab('shadow', this)">📦 盒阴影 (Box Shadow)</button>
            <button class="tool-tab" onclick="CssTools['css-gradient-shadow'].switchTab('textShadow', this)">✨ 文字阴影 (Text Shadow)</button>
            <button class="tool-tab" onclick="CssTools['css-gradient-shadow'].switchTab('glass', this)">🔮 玻璃拟态 (Glassmorphism)</button>
          </div>

          <div class="css-builder-layout">
            <!-- 左侧可视化调参面板 -->
            <div class="css-controls-pane" id="cssControlsPane">
              <!-- 动态注入面板控制 -->
            </div>

            <!-- 右侧实时预览与代码 -->
            <div class="css-preview-pane">
              <div class="css-preview-header">实时效果预览</div>
              <div class="css-preview-stage" id="cssPreviewStage">
                <div class="css-preview-card" id="cssPreviewCard">
                  <span id="cssPreviewText">CSS Style Preview</span>
                </div>
              </div>

              <div class="css-code-header">
                <span>生成的 CSS 代码</span>
                <button class="tool-btn primary" onclick="CssTools['css-gradient-shadow'].copyCss()">复制代码</button>
              </div>
              <textarea id="cssGeneratedCode" class="tool-textarea" readonly style="height:100px;font-family:var(--font-mono);font-size:0.88rem;"></textarea>
            </div>
          </div>
        </div>
      `;
    },

    initPane() {
      const pane = document.getElementById('cssControlsPane');
      if (!pane) return;

      if (this.activeTab === 'gradient') {
        const s = this.gradientState;
        pane.innerHTML = `
          <div class="tool-control-group" style="margin-bottom:0.75rem;">
            <label>渐变类型:</label>
            <select onchange="CssTools['css-gradient-shadow'].gradientState.type=this.value; CssTools['css-gradient-shadow'].update();">
              <option value="linear" ${s.type === 'linear' ? 'selected' : ''}>线性渐变 (Linear)</option>
              <option value="radial" ${s.type === 'radial' ? 'selected' : ''}>径向渐变 (Radial)</option>
            </select>
          </div>

          ${s.type === 'linear' ? `
            <div class="tool-control-group" style="margin-bottom:0.75rem;">
              <label>渐变角度 (${s.angle}°):</label>
              <input type="range" min="0" max="360" value="${s.angle}" oninput="CssTools['css-gradient-shadow'].gradientState.angle=parseInt(this.value); CssTools['css-gradient-shadow'].update();">
            </div>
          ` : ''}

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:0.75rem;">
            <div>
              <label style="font-size:0.8rem;color:var(--text-secondary);">起始颜色 1:</label>
              <input type="color" value="${s.color1}" style="width:100%;height:38px;border:none;border-radius:6px;cursor:pointer;" oninput="CssTools['css-gradient-shadow'].gradientState.color1=this.value; CssTools['css-gradient-shadow'].update();">
            </div>
            <div>
              <label style="font-size:0.8rem;color:var(--text-secondary);">终止颜色 2:</label>
              <input type="color" value="${s.color2}" style="width:100%;height:38px;border:none;border-radius:6px;cursor:pointer;" oninput="CssTools['css-gradient-shadow'].gradientState.color2=this.value; CssTools['css-gradient-shadow'].update();">
            </div>
          </div>

          <div class="css-preset-gallery">
            <div style="font-size:0.85rem;font-weight:600;margin-bottom:0.5rem;color:var(--text-primary);">预设灵感库:</div>
            <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:0.5rem;">
              <button class="css-preset-btn" style="background:linear-gradient(135deg, #8b5cf6, #3b82f6);" onclick="CssTools['css-gradient-shadow'].applyGradientPreset('#8b5cf6', '#3b82f6')">赛博紫蓝</button>
              <button class="css-preset-btn" style="background:linear-gradient(135deg, #f43f5e, #fb923c);" onclick="CssTools['css-gradient-shadow'].applyGradientPreset('#f43f5e', '#fb923c')">日落霞光</button>
              <button class="css-preset-btn" style="background:linear-gradient(135deg, #10b981, #06b6d4);" onclick="CssTools['css-gradient-shadow'].applyGradientPreset('#10b981', '#06b6d4')">薄荷青绿</button>
              <button class="css-preset-btn" style="background:linear-gradient(135deg, #ec4899, #8b5cf6);" onclick="CssTools['css-gradient-shadow'].applyGradientPreset('#ec4899', '#8b5cf6')">浪漫粉紫</button>
              <button class="css-preset-btn" style="background:linear-gradient(135deg, #f59e0b, #ef4444);" onclick="CssTools['css-gradient-shadow'].applyGradientPreset('#f59e0b', '#ef4444')">暖阳炽红</button>
              <button class="css-preset-btn" style="background:linear-gradient(135deg, #0284c7, #0d9488);" onclick="CssTools['css-gradient-shadow'].applyGradientPreset('#0284c7', '#0d9488')">深海夜空</button>
            </div>
          </div>
        `;
      } else if (this.activeTab === 'shadow') {
        const s = this.shadowState;
        pane.innerHTML = `
          <div class="tool-control-group" style="margin-bottom:0.5rem;">
            <label>X 轴偏移量 (${s.x}px):</label>
            <input type="range" min="-50" max="50" value="${s.x}" oninput="CssTools['css-gradient-shadow'].shadowState.x=parseInt(this.value); CssTools['css-gradient-shadow'].update();">
          </div>
          <div class="tool-control-group" style="margin-bottom:0.5rem;">
            <label>Y 轴偏移量 (${s.y}px):</label>
            <input type="range" min="-50" max="50" value="${s.y}" oninput="CssTools['css-gradient-shadow'].shadowState.y=parseInt(this.value); CssTools['css-gradient-shadow'].update();">
          </div>
          <div class="tool-control-group" style="margin-bottom:0.5rem;">
            <label>模糊半径 Blur (${s.blur}px):</label>
            <input type="range" min="0" max="100" value="${s.blur}" oninput="CssTools['css-gradient-shadow'].shadowState.blur=parseInt(this.value); CssTools['css-gradient-shadow'].update();">
          </div>
          <div class="tool-control-group" style="margin-bottom:0.5rem;">
            <label>扩展半径 Spread (${s.spread}px):</label>
            <input type="range" min="-30" max="50" value="${s.spread}" oninput="CssTools['css-gradient-shadow'].shadowState.spread=parseInt(this.value); CssTools['css-gradient-shadow'].update();">
          </div>
          <div class="tool-control-group" style="margin-bottom:0.5rem;">
            <label>透明度 Opacity (${Math.round(s.opacity * 100)}%):</label>
            <input type="range" min="0" max="100" value="${Math.round(s.opacity * 100)}" oninput="CssTools['css-gradient-shadow'].shadowState.opacity=parseInt(this.value)/100; CssTools['css-gradient-shadow'].update();">
          </div>
          <div style="display:flex;align-items:center;gap:1rem;margin-bottom:0.75rem;">
            <label style="font-size:0.85rem;">阴影颜色:</label>
            <input type="color" value="${s.color}" style="height:32px;border:none;cursor:pointer;" oninput="CssTools['css-gradient-shadow'].shadowState.color=this.value; CssTools['css-gradient-shadow'].update();">
            <label style="font-size:0.85rem;margin-left:auto;"><input type="checkbox" ${s.inset ? 'checked' : ''} onchange="CssTools['css-gradient-shadow'].shadowState.inset=this.checked; CssTools['css-gradient-shadow'].update();"> 内部阴影 (Inset)</label>
          </div>
        `;
      } else if (this.activeTab === 'textShadow') {
        const s = this.textShadowState;
        pane.innerHTML = `
          <div class="tool-control-group" style="margin-bottom:0.5rem;">
            <label>X 轴偏移量 (${s.x}px):</label>
            <input type="range" min="-30" max="30" value="${s.x}" oninput="CssTools['css-gradient-shadow'].textShadowState.x=parseInt(this.value); CssTools['css-gradient-shadow'].update();">
          </div>
          <div class="tool-control-group" style="margin-bottom:0.5rem;">
            <label>Y 轴偏移量 (${s.y}px):</label>
            <input type="range" min="-30" max="30" value="${s.y}" oninput="CssTools['css-gradient-shadow'].textShadowState.y=parseInt(this.value); CssTools['css-gradient-shadow'].update();">
          </div>
          <div class="tool-control-group" style="margin-bottom:0.5rem;">
            <label>模糊半径 (${s.blur}px):</label>
            <input type="range" min="0" max="50" value="${s.blur}" oninput="CssTools['css-gradient-shadow'].textShadowState.blur=parseInt(this.value); CssTools['css-gradient-shadow'].update();">
          </div>
          <div style="display:flex;align-items:center;gap:1rem;margin-bottom:0.75rem;">
            <label style="font-size:0.85rem;">阴影颜色:</label>
            <input type="color" value="${s.color}" style="height:32px;border:none;cursor:pointer;" oninput="CssTools['css-gradient-shadow'].textShadowState.color=this.value; CssTools['css-gradient-shadow'].update();">
          </div>
        `;
      } else if (this.activeTab === 'glass') {
        const s = this.glassState;
        pane.innerHTML = `
          <div class="tool-control-group" style="margin-bottom:0.5rem;">
            <label>背景高斯模糊 (${s.blur}px):</label>
            <input type="range" min="0" max="30" value="${s.blur}" oninput="CssTools['css-gradient-shadow'].glassState.blur=parseInt(this.value); CssTools['css-gradient-shadow'].update();">
          </div>
          <div class="tool-control-group" style="margin-bottom:0.5rem;">
            <label>背景不透明度 (${Math.round(s.bgOpacity * 100)}%):</label>
            <input type="range" min="0" max="100" value="${Math.round(s.bgOpacity * 100)}" oninput="CssTools['css-gradient-shadow'].glassState.bgOpacity=parseInt(this.value)/100; CssTools['css-gradient-shadow'].update();">
          </div>
          <div class="tool-control-group" style="margin-bottom:0.5rem;">
            <label>边框高光透明度 (${Math.round(s.borderOpacity * 100)}%):</label>
            <input type="range" min="0" max="100" value="${Math.round(s.borderOpacity * 100)}" oninput="CssTools['css-gradient-shadow'].glassState.borderOpacity=parseInt(this.value)/100; CssTools['css-gradient-shadow'].update();">
          </div>
        `;
      }

      this.update();
    },

    switchTab(tab, btn) {
      this.activeTab = tab;
      document.querySelectorAll('#cssGenTabs .tool-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      this.initPane();
    },

    applyGradientPreset(c1, c2) {
      this.gradientState.color1 = c1;
      this.gradientState.color2 = c2;
      this.initPane();
    },

    update() {
      const card = document.getElementById('cssPreviewCard');
      const text = document.getElementById('cssPreviewText');
      const stage = document.getElementById('cssPreviewStage');
      const codeBox = document.getElementById('cssGeneratedCode');

      if (!card || !codeBox) return;

      // 重置初始样式
      card.style.background = '';
      card.style.boxShadow = '';
      card.style.backdropFilter = '';
      card.style.border = '1px solid var(--border-color)';
      if (text) text.style.textShadow = '';
      if (stage) stage.style.background = 'var(--bg-secondary)';

      let cssCode = '';

      if (this.activeTab === 'gradient') {
        const s = this.gradientState;
        const bgVal = s.type === 'linear' 
          ? `linear-gradient(${s.angle}deg, ${s.color1} 0%, ${s.color2} 100%)`
          : `radial-gradient(circle, ${s.color1} 0%, ${s.color2} 100%)`;
        card.style.background = bgVal;
        cssCode = `background: ${bgVal};`;
      } else if (this.activeTab === 'shadow') {
        const s = this.shadowState;
        card.style.background = 'var(--card-bg)';
        const rgba = hexToRgba(s.color, s.opacity);
        const shadowVal = `${s.inset ? 'inset ' : ''}${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${rgba}`;
        card.style.boxShadow = shadowVal;
        cssCode = `box-shadow: ${shadowVal};`;
      } else if (this.activeTab === 'textShadow') {
        const s = this.textShadowState;
        card.style.background = 'var(--card-bg)';
        const rgba = hexToRgba(s.color, s.opacity);
        const tsVal = `${s.x}px ${s.y}px ${s.blur}px ${rgba}`;
        if (text) {
          text.style.textShadow = tsVal;
          text.style.fontSize = '1.8rem';
          text.style.fontWeight = 'bold';
        }
        cssCode = `text-shadow: ${tsVal};`;
      } else if (this.activeTab === 'glass') {
        const s = this.glassState;
        if (stage) stage.style.background = 'linear-gradient(135deg, #6366f1, #ec4899, #f59e0b)';
        card.style.background = `rgba(255, 255, 255, ${s.bgOpacity})`;
        card.style.backdropFilter = `blur(${s.blur}px)`;
        card.style.webkitBackdropFilter = `blur(${s.blur}px)`;
        card.style.border = `1px solid rgba(255, 255, 255, ${s.borderOpacity})`;
        cssCode = `background: rgba(255, 255, 255, ${s.bgOpacity});\nbackdrop-filter: blur(${s.blur}px);\n-webkit-backdrop-filter: blur(${s.blur}px);\nborder: 1px solid rgba(255, 255, 255, ${s.borderOpacity});`;
      }

      codeBox.value = cssCode;
    },

    copyCss() {
      const codeBox = document.getElementById('cssGeneratedCode');
      if (codeBox) copyText(codeBox.value);
    }
  },

  // ---------------------------------------------
  // 2. Flexbox / Grid 布局可视化生成
  // ---------------------------------------------
  'flex-grid-builder': {
    mode: 'flex', // 'flex' | 'grid'

    flexState: {
      direction: 'row',
      justify: 'space-between',
      alignItems: 'center',
      flexWrap: 'nowrap',
      gap: 16,
      itemCount: 4
    },

    gridState: {
      columns: 'repeat(3, 1fr)',
      gap: 16,
      alignItems: 'stretch',
      justifyItems: 'stretch',
      itemCount: 6
    },

    render() {
      return `
        <div class="tool-section">
          <!-- 布局模式与参数控制 -->
          <div class="tool-controls" style="margin-bottom:0.75rem;flex-wrap:wrap;gap:0.75rem;">
            <div class="tool-control-group">
              <label>布局模式:</label>
              <select id="layoutModeSelect" onchange="CssTools['flex-grid-builder'].switchMode(this.value)">
                <option value="flex">Flexbox 弹性布局</option>
                <option value="grid">CSS Grid 网格布局</option>
              </select>
            </div>
          </div>

          <div class="layout-builder-split">
            <!-- 属性控制区 -->
            <div class="layout-controls-pane" id="layoutControlsPane">
              <!-- 动态注入属性表单 -->
            </div>

            <!-- 可视化画布与代码区 -->
            <div class="layout-stage-pane">
              <div class="layout-stage-header">布局可视化 Stage</div>
              <div id="layoutVisualStage" class="layout-visual-stage">
                <!-- 动态子元素 -->
              </div>

              <div style="margin-top:1rem;">
                <div class="css-code-header">
                  <span>容器 CSS 代码</span>
                  <button class="tool-btn primary" onclick="CssTools['flex-grid-builder'].copyCss()">复制 CSS</button>
                </div>
                <textarea id="layoutGeneratedCss" class="tool-textarea" readonly style="height:110px;font-family:var(--font-mono);font-size:0.85rem;"></textarea>
              </div>
            </div>
          </div>
        </div>
      `;
    },

    switchMode(mode) {
      this.mode = mode;
      this.renderControlsAndStage();
    },

    renderControlsAndStage() {
      const pane = document.getElementById('layoutControlsPane');
      const stage = document.getElementById('layoutVisualStage');
      const cssOut = document.getElementById('layoutGeneratedCss');

      if (!pane || !stage) return;

      if (this.mode === 'flex') {
        const f = this.flexState;
        pane.innerHTML = `
          <div class="tool-control-group" style="margin-bottom:0.5rem;">
            <label>flex-direction (主轴方向):</label>
            <select onchange="CssTools['flex-grid-builder'].flexState.direction=this.value; CssTools['flex-grid-builder'].renderControlsAndStage();">
              <option value="row" ${f.direction==='row'?'selected':''}>row (水平)</option>
              <option value="row-reverse" ${f.direction==='row-reverse'?'selected':''}>row-reverse (水平反向)</option>
              <option value="column" ${f.direction==='column'?'selected':''}>column (垂直)</option>
              <option value="column-reverse" ${f.direction==='column-reverse'?'selected':''}>column-reverse (垂直反向)</option>
            </select>
          </div>

          <div class="tool-control-group" style="margin-bottom:0.5rem;">
            <label>justify-content (主轴对齐):</label>
            <select onchange="CssTools['flex-grid-builder'].flexState.justify=this.value; CssTools['flex-grid-builder'].renderControlsAndStage();">
              <option value="flex-start" ${f.justify==='flex-start'?'selected':''}>flex-start (起点对齐)</option>
              <option value="center" ${f.justify==='center'?'selected':''}>center (居中)</option>
              <option value="flex-end" ${f.justify==='flex-end'?'selected':''}>flex-end (终点对齐)</option>
              <option value="space-between" ${f.justify==='space-between'?'selected':''}>space-between (两端对齐)</option>
              <option value="space-around" ${f.justify==='space-around'?'selected':''}>space-around (环绕分布)</option>
              <option value="space-evenly" ${f.justify==='space-evenly'?'selected':''}>space-evenly (均匀分布)</option>
            </select>
          </div>

          <div class="tool-control-group" style="margin-bottom:0.5rem;">
            <label>align-items (交叉轴对齐):</label>
            <select onchange="CssTools['flex-grid-builder'].flexState.alignItems=this.value; CssTools['flex-grid-builder'].renderControlsAndStage();">
              <option value="stretch" ${f.alignItems==='stretch'?'selected':''}>stretch (拉伸填充)</option>
              <option value="flex-start" ${f.alignItems==='flex-start'?'selected':''}>flex-start (顶对齐)</option>
              <option value="center" ${f.alignItems==='center'?'selected':''}>center (居中)</option>
              <option value="flex-end" ${f.alignItems==='flex-end'?'selected':''}>flex-end (底对齐)</option>
            </select>
          </div>

          <div class="tool-control-group" style="margin-bottom:0.5rem;">
            <label>flex-wrap (换行):</label>
            <select onchange="CssTools['flex-grid-builder'].flexState.flexWrap=this.value; CssTools['flex-grid-builder'].renderControlsAndStage();">
              <option value="nowrap" ${f.flexWrap==='nowrap'?'selected':''}>nowrap (不换行)</option>
              <option value="wrap" ${f.flexWrap==='wrap'?'selected':''}>wrap (换行)</option>
            </select>
          </div>

          <div class="tool-control-group" style="margin-bottom:0.5rem;">
            <label>gap 间距 (${f.gap}px):</label>
            <input type="range" min="0" max="50" value="${f.gap}" oninput="CssTools['flex-grid-builder'].flexState.gap=parseInt(this.value); CssTools['flex-grid-builder'].renderControlsAndStage();">
          </div>

          <div class="tool-control-group">
            <label>子元素数量 (${f.itemCount}):</label>
            <input type="range" min="1" max="12" value="${f.itemCount}" oninput="CssTools['flex-grid-builder'].flexState.itemCount=parseInt(this.value); CssTools['flex-grid-builder'].renderControlsAndStage();">
          </div>
        `;

        // 应用 Flex 样式到 stage
        stage.style.display = 'flex';
        stage.style.flexDirection = f.direction;
        stage.style.justifyContent = f.justify;
        stage.style.alignItems = f.alignItems;
        stage.style.flexWrap = f.flexWrap;
        stage.style.gap = `${f.gap}px`;
        stage.style.gridTemplateColumns = '';

        let itemsHtml = '';
        for (let i = 1; i <= f.itemCount; i++) {
          itemsHtml += `<div class="layout-stage-item">Item ${i}</div>`;
        }
        stage.innerHTML = itemsHtml;

        const css = `.container {\n  display: flex;\n  flex-direction: ${f.direction};\n  justify-content: ${f.justify};\n  align-items: ${f.alignItems};\n  flex-wrap: ${f.flexWrap};\n  gap: ${f.gap}px;\n}`;
        if (cssOut) cssOut.value = css;

      } else {
        const g = this.gridState;
        pane.innerHTML = `
          <div class="tool-control-group" style="margin-bottom:0.5rem;">
            <label>grid-template-columns (列网格):</label>
            <select onchange="CssTools['flex-grid-builder'].gridState.columns=this.value; CssTools['flex-grid-builder'].renderControlsAndStage();">
              <option value="repeat(3, 1fr)" ${g.columns==='repeat(3, 1fr)'?'selected':''}>三等分 (repeat(3, 1fr))</option>
              <option value="repeat(2, 1fr)" ${g.columns==='repeat(2, 1fr)'?'selected':''}>二等分 (repeat(2, 1fr))</option>
              <option value="repeat(4, 1fr)" ${g.columns==='repeat(4, 1fr)'?'selected':''}>四等分 (repeat(4, 1fr))</option>
              <option value="200px 1fr" ${g.columns==='200px 1fr'?'selected':''}>侧边栏+自适应 (200px 1fr)</option>
              <option value="1fr 2fr 1fr" ${g.columns==='1fr 2fr 1fr'?'selected':''}>圣杯三列 (1fr 2fr 1fr)</option>
            </select>
          </div>

          <div class="tool-control-group" style="margin-bottom:0.5rem;">
            <label>gap 间距 (${g.gap}px):</label>
            <input type="range" min="0" max="50" value="${g.gap}" oninput="CssTools['flex-grid-builder'].gridState.gap=parseInt(this.value); CssTools['flex-grid-builder'].renderControlsAndStage();">
          </div>

          <div class="tool-control-group" style="margin-bottom:0.5rem;">
            <label>justify-items (水平排列):</label>
            <select onchange="CssTools['flex-grid-builder'].gridState.justifyItems=this.value; CssTools['flex-grid-builder'].renderControlsAndStage();">
              <option value="stretch" ${g.justifyItems==='stretch'?'selected':''}>stretch (填充)</option>
              <option value="start" ${g.justifyItems==='start'?'selected':''}>start (靠左)</option>
              <option value="center" ${g.justifyItems==='center'?'selected':''}>center (居中)</option>
              <option value="end" ${g.justifyItems==='end'?'selected':''}>end (靠右)</option>
            </select>
          </div>

          <div class="tool-control-group" style="margin-bottom:0.5rem;">
            <label>align-items (垂直排列):</label>
            <select onchange="CssTools['flex-grid-builder'].gridState.alignItems=this.value; CssTools['flex-grid-builder'].renderControlsAndStage();">
              <option value="stretch" ${g.alignItems==='stretch'?'selected':''}>stretch (填充)</option>
              <option value="start" ${g.alignItems==='start'?'selected':''}>start (靠顶)</option>
              <option value="center" ${g.alignItems==='center'?'selected':''}>center (居中)</option>
              <option value="end" ${g.alignItems==='end'?'selected':''}>end (靠底)</option>
            </select>
          </div>

          <div class="tool-control-group">
            <label>子元素数量 (${g.itemCount}):</label>
            <input type="range" min="1" max="12" value="${g.itemCount}" oninput="CssTools['flex-grid-builder'].gridState.itemCount=parseInt(this.value); CssTools['flex-grid-builder'].renderControlsAndStage();">
          </div>
        `;

        // 应用 Grid 样式到 stage
        stage.style.display = 'grid';
        stage.style.gridTemplateColumns = g.columns;
        stage.style.gap = `${g.gap}px`;
        stage.style.justifyItems = g.justifyItems;
        stage.style.alignItems = g.alignItems;
        stage.style.flexDirection = '';

        let itemsHtml = '';
        for (let i = 1; i <= g.itemCount; i++) {
          itemsHtml += `<div class="layout-stage-item">Grid Box ${i}</div>`;
        }
        stage.innerHTML = itemsHtml;

        const css = `.grid-container {\n  display: grid;\n  grid-template-columns: ${g.columns};\n  gap: ${g.gap}px;\n  justify-items: ${g.justifyItems};\n  align-items: ${g.alignItems};\n}`;
        if (cssOut) cssOut.value = css;
      }
    },

    copyCss() {
      const el = document.getElementById('layoutGeneratedCss');
      if (el) copyText(el.value);
    }
  },

  // ---------------------------------------------
  // 3. CSS 贝塞尔曲线动画预览
  // ---------------------------------------------
  'cubic-bezier-preview': {
    params: { x1: 0.25, y1: 0.1, x2: 0.25, y2: 1.0, duration: 1.2 },

    presets: {
      'ease': [0.25, 0.1, 0.25, 1.0],
      'linear': [0.0, 0.0, 1.0, 1.0],
      'ease-in': [0.42, 0.0, 1.0, 1.0],
      'ease-out': [0.0, 0.0, 0.58, 1.0],
      'ease-in-out': [0.42, 0.0, 0.58, 1.0],
      'easeInBack': [0.36, 0.0, 0.66, -0.56],
      'easeOutBack': [0.34, 1.56, 0.64, 1.0],
      'easeOutBounce': [0.68, -0.55, 0.265, 1.55]
    },

    render() {
      return `
        <div class="tool-section">
          <!-- 预设选择与控制 -->
          <div class="tool-controls" style="margin-bottom:0.75rem;flex-wrap:wrap;gap:0.75rem;">
            <div class="tool-control-group">
              <label>常用贝塞尔预设:</label>
              <select id="bezierPreset" onchange="CssTools['cubic-bezier-preview'].loadPreset(this.value)">
                <option value="ease">ease (0.25, 0.1, 0.25, 1.0)</option>
                <option value="linear">linear 线性 (0.0, 0.0, 1.0, 1.0)</option>
                <option value="ease-in">ease-in 加速 (0.42, 0.0, 1.0, 1.0)</option>
                <option value="ease-out">ease-out 减速 (0.0, 0.0, 0.58, 1.0)</option>
                <option value="ease-in-out">ease-in-out 缓入缓出</option>
                <option value="easeOutBack">easeOutBack (回弹冲击)</option>
                <option value="easeInBack">easeInBack (蓄力发力)</option>
              </select>
            </div>
            <div class="tool-control-group">
              <label>动画时长 Duration (${this.params.duration}s):</label>
              <input type="range" min="0.2" max="3.0" step="0.1" value="${this.params.duration}" oninput="CssTools['cubic-bezier-preview'].params.duration=parseFloat(this.value); CssTools['cubic-bezier-preview'].update();">
            </div>
            <button class="tool-btn primary" onclick="CssTools['cubic-bezier-preview'].triggerAnimation()">重新播放动画</button>
          </div>

          <div class="bezier-tool-grid">
            <!-- 贝塞尔参数输入面板 -->
            <div class="bezier-params-pane">
              <div style="font-size:0.92rem;font-weight:700;margin-bottom:0.75rem;color:var(--text-primary);">控制点参数 (P1, P2)</div>
              
              <div class="tool-control-group" style="margin-bottom:0.5rem;">
                <label>X1 (P1): <span id="valX1">${this.params.x1}</span></label>
                <input type="range" min="0" max="1" step="0.01" value="${this.params.x1}" oninput="CssTools['cubic-bezier-preview'].params.x1=parseFloat(this.value); CssTools['cubic-bezier-preview'].update();">
              </div>
              <div class="tool-control-group" style="margin-bottom:0.5rem;">
                <label>Y1 (P1): <span id="valY1">${this.params.y1}</span></label>
                <input type="range" min="-0.5" max="1.5" step="0.01" value="${this.params.y1}" oninput="CssTools['cubic-bezier-preview'].params.y1=parseFloat(this.value); CssTools['cubic-bezier-preview'].update();">
              </div>
              <div class="tool-control-group" style="margin-bottom:0.5rem;">
                <label>X2 (P2): <span id="valX2">${this.params.x2}</span></label>
                <input type="range" min="0" max="1" step="0.01" value="${this.params.x2}" oninput="CssTools['cubic-bezier-preview'].params.x2=parseFloat(this.value); CssTools['cubic-bezier-preview'].update();">
              </div>
              <div class="tool-control-group" style="margin-bottom:0.5rem;">
                <label>Y2 (P2): <span id="valY2">${this.params.y2}</span></label>
                <input type="range" min="-0.5" max="1.5" step="0.01" value="${this.params.y2}" oninput="CssTools['cubic-bezier-preview'].params.y2=parseFloat(this.value); CssTools['cubic-bezier-preview'].update();">
              </div>

              <div style="margin-top:1rem;">
                <div class="css-code-header">
                  <span>CSS 动画代码</span>
                  <button class="tool-btn secondary" style="padding:0.2rem 0.5rem;font-size:0.75rem;" onclick="copyText(document.getElementById('bezierCssCode').value)">复制</button>
                </div>
                <textarea id="bezierCssCode" class="tool-textarea" readonly style="height:70px;font-family:var(--font-mono);font-size:0.8rem;"></textarea>
              </div>
            </div>

            <!-- 动画实况对比区域 -->
            <div class="bezier-stage-pane">
              <div style="font-size:0.92rem;font-weight:700;margin-bottom:0.75rem;color:var(--text-primary);">动画效果实况对比</div>
              
              <!-- 演示 1：平移滑块对比 -->
              <div class="bezier-anim-track-box">
                <div class="track-label">当前 Custom Bezier 曲线</div>
                <div class="track-bar">
                  <div class="anim-block custom-block" id="animCustomBlock"></div>
                </div>
              </div>

              <div class="bezier-anim-track-box" style="margin-top:0.75rem;">
                <div class="track-label">标准 Linear 线性对比</div>
                <div class="track-bar">
                  <div class="anim-block linear-block" id="animLinearBlock"></div>
                </div>
              </div>

              <!-- 演示 2：缩放脉冲与旋转 -->
              <div style="display:flex;gap:1.5rem;margin-top:1.25rem;align-items:center;justify-content:space-around;" class="bezier-fx-demo-box">
                <div style="text-align:center;">
                  <div class="anim-pulse-box" id="animPulseBox">Card Flip</div>
                  <div style="font-size:0.75rem;color:var(--text-tertiary);margin-top:0.35rem;">缩放翻转演示</div>
                </div>
                <div style="text-align:center;">
                  <div class="anim-ball-bounce" id="animBallBounce">⚽</div>
                  <div style="font-size:0.75rem;color:var(--text-tertiary);margin-top:0.35rem;">弹跳落地演示</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    },

    loadPreset(name) {
      const arr = this.presets[name] || this.presets['ease'];
      this.params.x1 = arr[0];
      this.params.y1 = arr[1];
      this.params.x2 = arr[2];
      this.params.y2 = arr[3];

      document.getElementById('valX1').textContent = this.params.x1;
      document.getElementById('valY1').textContent = this.params.y1;
      document.getElementById('valX2').textContent = this.params.x2;
      document.getElementById('valY2').textContent = this.params.y2;

      this.update();
    },

    update() {
      const { x1, y1, x2, y2, duration } = this.params;

      document.getElementById('valX1').textContent = x1;
      document.getElementById('valY1').textContent = y1;
      document.getElementById('valX2').textContent = x2;
      document.getElementById('valY2').textContent = y2;

      const bezierStr = `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
      const cssSnippet = `transition: all ${duration}s ${bezierStr};`;

      const codeBox = document.getElementById('bezierCssCode');
      if (codeBox) codeBox.value = cssSnippet;

      this.triggerAnimation();
    },

    triggerAnimation() {
      const { x1, y1, x2, y2, duration } = this.params;
      const bezierStr = `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;

      const customBlock = document.getElementById('animCustomBlock');
      const linearBlock = document.getElementById('animLinearBlock');
      const pulseBox = document.getElementById('animPulseBox');
      const ball = document.getElementById('animBallBounce');

      if (!customBlock) return;

      // 重置并触发 CSS 过渡/动画
      customBlock.style.transition = `transform ${duration}s ${bezierStr}`;
      linearBlock.style.transition = `transform ${duration}s linear`;
      pulseBox.style.transition = `transform ${duration}s ${bezierStr}`;
      ball.style.transition = `transform ${duration}s ${bezierStr}`;

      customBlock.style.transform = 'translateX(0px)';
      linearBlock.style.transform = 'translateX(0px)';
      pulseBox.style.transform = 'scale(1) rotate(0deg)';
      ball.style.transform = 'translateY(0px)';

      setTimeout(() => {
        const parentWidth = customBlock.parentElement.clientWidth - 48;
        customBlock.style.transform = `translateX(${parentWidth}px)`;
        linearBlock.style.transform = `translateX(${parentWidth}px)`;
        pulseBox.style.transform = 'scale(1.2) rotate(360deg)';
        ball.style.transform = 'translateY(-40px)';
      }, 50);
    }
  }
};

// 辅助函数
function hexToRgba(hex, alpha) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`;
}
