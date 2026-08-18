// =============================================
// 页面渲染逻辑
// =============================================

// 首页渲染
function renderHomePage() {
  const container = document.getElementById('home-content');
  if (!container) return;
  
  // 获取热门工具（根据所有人访问使用最多的前12个）
  const allTools = getAllTools();
  const popular = UsageManager.getTopTools(allTools, 12);
  
  container.innerHTML = `
    <!-- 分类概览 -->
    <section class="home-section">
      <div class="section-header">
        <h2 class="section-title">所有分类</h2>
      </div>
      <div class="categories-grid">
        ${Object.entries(TOOLS_DATA).map(([key, cat]) => `
          <div class="category-card" onclick="navigateTo('category', '${key}')">
            <div class="category-icon ${cat.color}">
              ${ICONS[cat.icon + 'Icon']}
            </div>
            <div class="category-info">
              <h3>${cat.name}</h3>
              <span>${cat.tools.length} 个工具</span>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
    
    <!-- 热门工具 -->
    <section class="home-section">
      <div class="section-header">
        <h2 class="section-title">热门工具</h2>
      </div>
      <div class="popular-tools-grid">
        ${popular.map((tool, idx) => renderToolCard(tool, tool.category, idx + 1)).join('')}
      </div>
    </section>
    
    <!-- 最近使用 -->
    <section class="home-section" id="recentSection" style="display: none;">
      <div class="section-header">
        <h2 class="section-title">最近使用</h2>
      </div>
      <div class="recent-tools-grid" id="recentTools"></div>
    </section>
  `;
  
  // 加载最近使用
  renderRecentTools();
}

// 分类页渲染
function renderCategoryPage(categoryId) {
  const container = document.getElementById('category-content');
  if (!container) return;
  
  const category = TOOLS_DATA[categoryId];
  if (!category) return;
  
  // 获取历史记录，找出该分类中上一个访问/使用的卡片
  const history = HistoryManager.get();
  const lastUsedEntry = history.find(h => category.tools.some(t => t.id === h.id));
  
  let firstTool = null;
  let remainingTools = [];

  if (lastUsedEntry) {
    firstTool = category.tools.find(t => t.id === lastUsedEntry.id);
    remainingTools = category.tools.filter(t => t.id !== firstTool.id);
  } else {
    remainingTools = [...category.tools];
  }

  // 第二个及之后的卡片：按点击/使用计数器高低排序（高的排在前面，低的排在后面）
  remainingTools.sort((a, b) => {
    const countA = UsageManager.get(a.id);
    const countB = UsageManager.get(b.id);
    if (countB !== countA) return countB - countA;
    return a.name.localeCompare(b.name, 'zh-CN');
  });

  const sortedTools = firstTool ? [firstTool, ...remainingTools] : remainingTools;

  container.innerHTML = `
    <div class="layout-with-sidebar">
      <aside class="sidebar">
        <div class="sidebar-title">分类</div>
        <nav class="sidebar-nav">
          ${Object.entries(TOOLS_DATA).map(([key, cat]) => `
            <div class="sidebar-link ${key === categoryId ? 'active' : ''}" data-category="${key}" onclick="navigateTo('category', '${key}')">
              ${ICONS[cat.icon + 'Icon']}
              <span>${cat.name}</span>
            </div>
          `).join('')}
        </nav>
      </aside>
      
      <main class="category-main">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;flex-wrap:wrap;gap:0.5rem;">
          <h1 style="font-size: 1.5rem; margin-bottom: 0;">${category.name}</h1>
          <div style="font-size:0.8rem;color:var(--text-tertiary);background:var(--bg-secondary);padding:4px 12px;border-radius:12px;border:1px solid var(--border-color);display:flex;align-items:center;gap:6px;">
            <span>⏱️</span>
            <span>${firstTool ? `首位已固定为上个卡片「${escapeHtml(firstTool.name)}」，第 2 位起按计数降序` : '第 1 位固定上个卡片，其余按计数降序排序'}</span>
          </div>
        </div>
        <div class="cards-grid">
          ${sortedTools.map((tool, idx) => renderToolCard(tool, categoryId, idx + 1, firstTool && tool.id === firstTool.id)).join('')}
        </div>
      </main>
    </div>
  `;
}

// 增加计数器处理函数
function incrementToolCounter(toolId, event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  UsageManager.increment(toolId);
  const count = UsageManager.get(toolId);
  const tool = getToolById(toolId);
  showToast(`「${tool ? tool.name : '工具'}」点击数 +1 (当前: ${count})`, 'info');

  // 如果在分类或首页，重新渲染以实时重排卡片顺序
  if (currentPage === 'category' && currentCategory) {
    renderCategoryPage(currentCategory);
  } else if (currentPage === 'home') {
    renderHomePage();
  } else if (currentPage === 'starred') {
    renderStarredPage();
  } else {
    const el = document.getElementById(`counter-${toolId}`);
    if (el) el.textContent = count.toLocaleString();
  }
}

// 工具卡片渲染
function renderToolCard(tool, categoryId, index = null, isLastUsed = false) {
  const isStarred = FavoritesManager.isFavorite(tool.id);
  const clickCount = UsageManager.get(tool.id);

  let numberBadge = '';
  if (isLastUsed) {
    numberBadge = `<span class="tool-card-number" style="background:var(--accent-light, rgba(99,102,241,0.15));color:var(--accent,#6366f1);font-weight:700;padding:2px 8px;border-radius:10px;font-size:0.75rem;">⏱️ 上个卡片</span>`;
  } else if (index !== null) {
    numberBadge = `<span class="tool-card-number">#${index}</span>`;
  }

  return `
    <div class="tool-card" onclick="navigateTo('tool', '${tool.id}')">
      <div class="tool-card-header">
        <div class="tool-card-icon">
          ${ICONS.codeIcon}
        </div>
        <div class="tool-card-header-right">
          ${numberBadge}
          <div class="tool-card-actions">
            <button class="tool-card-action ${isStarred ? 'starred' : ''}" title="${isStarred ? '取消收藏' : '收藏'}" onclick="event.stopPropagation(); toggleStar('${tool.id}', this)">
              ${isStarred ? ICONS.starFilled : ICONS.star}
            </button>
          </div>
        </div>
      </div>
      <div class="tool-card-title">${tool.name}</div>
      <div class="tool-card-desc">${tool.desc}</div>
      <div class="tool-card-footer">
        <div class="tool-card-tags">
          ${tool.tags.map(tag => `<span class="tool-card-tag">${tag}</span>`).join('')}
        </div>
        <button class="tool-card-counter-btn" title="点击增加使用计数" onclick="incrementToolCounter('${tool.id}', event)">
          <span style="color:#f59e0b;">🔥</span>
          <span class="counter-num" id="counter-${tool.id}">${clickCount.toLocaleString()}</span>
          <span class="counter-add">+1</span>
        </button>
      </div>
    </div>
  `;
}

// 工具页渲染
function renderToolPage(toolId) {
  const container = document.getElementById('tool-content');
  if (!container) return;
  
  const tool = getToolById(toolId);
  if (!tool) return;
  
  // 获取工具实现
  const toolImpl = getToolImpl(toolId);
  
  container.innerHTML = `
    <div class="tool-page">
      <div class="tool-page-header">
        <button class="tool-page-back" onclick="goBack()">
          ${ICONS.back}
        </button>
        <h1 class="tool-page-title">${tool.name}</h1>
        <div class="tool-page-actions">
          <button class="tool-page-btn ${FavoritesManager.isFavorite(toolId) ? 'primary' : ''}" id="toolStarBtn" onclick="toggleToolStar('${toolId}')">
            ${FavoritesManager.isFavorite(toolId) ? ICONS.starFilled : ICONS.star}
            <span>${FavoritesManager.isFavorite(toolId) ? '已收藏' : '收藏'}</span>
          </button>
        </div>
      </div>
      <div class="tool-content">
        ${toolImpl ? toolImpl.render() : '<p>工具正在开发中...</p>'}
      </div>
    </div>
  `;
  
  // 初始化工具
  if (toolImpl) {
    // 初始化滑块显示值
    const lengthSlider = document.getElementById('pwdLength');
    if (lengthSlider) {
      lengthSlider.addEventListener('input', () => {
        document.getElementById('pwdLengthValue').textContent = lengthSlider.value;
      });
    }
    
    // 颜色选择器同步
    const colorPicker = document.getElementById('colorPicker');
    if (colorPicker) {
      colorPicker.addEventListener('input', () => {
        document.getElementById('colorInput').value = colorPicker.value;
      });
    }
    
    // Emoji初始化
    if (toolId === 'emoji') {
      setTimeout(() => {
        const tab = document.querySelector('#emojiTabs .tab');
        if (typeof FunTools.switchEmojiTab === 'function') {
          FunTools.switchEmojiTab('smile', tab);
        }
      }, 50);
    }

    // 数据与图表、CSS工具等特殊初始化
    if (toolId === 'excel-csv-convert' && typeof DataTools !== 'undefined') {
      setTimeout(() => DataTools['excel-csv-convert'].loadSample(), 50);
    } else if (toolId === 'mermaid-preview' && typeof DataTools !== 'undefined') {
      setTimeout(() => DataTools['mermaid-preview'].loadPreset('flowchart'), 50);
    } else if (toolId === 'data-diff-analyzer' && typeof DataTools !== 'undefined') {
      setTimeout(() => DataTools['data-diff-analyzer'].loadSample(), 50);
    } else if (toolId === 'css-gradient-shadow' && typeof CssTools !== 'undefined') {
      setTimeout(() => CssTools['css-gradient-shadow'].initPane(), 50);
    } else if (toolId === 'flex-grid-builder' && typeof CssTools !== 'undefined') {
      setTimeout(() => CssTools['flex-grid-builder'].renderControlsAndStage(), 50);
    } else if (toolId === 'cubic-bezier-preview' && typeof CssTools !== 'undefined') {
      setTimeout(() => CssTools['cubic-bezier-preview'].update(), 50);
    }
  }
}

// 获取工具实现
function getToolImpl(toolId) {
  if (typeof DataTools !== 'undefined' && DataTools[toolId]) return DataTools[toolId];
  if (typeof CssTools !== 'undefined' && CssTools[toolId]) return CssTools[toolId];
  return TextTools[toolId] || EncodeTools[toolId] || DevTools[toolId] || ImageTools[toolId] || LifeTools[toolId] || FunTools[toolId];
}

// 关于页面
function renderAboutPage() {
  const container = document.getElementById('about-content');
  if (!container) return;
  
  container.innerHTML = `
    <div class="about-content">
      <h2>关于工具箱</h2>
      <p>在线工具箱是一个免费、无需注册的实用工具集合，提供文本处理、编码解码、开发工具等多种在线工具。</p>
      
      <h2>功能特点</h2>
      <ul>
        <li>完全免费，无需注册即可使用</li>
        <li>所有数据处理均在本地完成，保护隐私</li>
        <li>支持暗黑模式，随时切换</li>
        <li>响应式设计，手机电脑都能用</li>
        <li>工具持续更新中</li>
      </ul>
      
      <h2>使用说明</h2>
      <p>直接在首页浏览或搜索需要的工具，点击即可使用。所有工具都支持一键复制结果。</p>
      
      <h2>联系我们</h2>
      <p>如果你有任何问题或建议，欢迎反馈。</p>
    </div>
  `;
}

// 更新日志页面
function renderChangelogPage() {
  const container = document.getElementById('changelog-content');
  if (!container) return;
  
  container.innerHTML = `
    <div class="changelog-item">
      <div class="changelog-date">2024-01-15</div>
      <div class="changelog-title">
        <span class="changelog-tag new">新增</span>
        版本 1.0.0 正式发布
      </div>
      <ul class="changelog-list">
        <li>发布初始版本</li>
        <li>包含文本处理、编码解码、开发工具等核心功能</li>
        <li>支持暗黑模式切换</li>
        <li>实现收藏和历史记录功能</li>
      </ul>
    </div>
    
    <div class="changelog-item">
      <div class="changelog-date">2024-01-10</div>
      <div class="changelog-title">
        <span class="changelog-tag imp">优化</span>
        工具箱基础架构
      </div>
      <ul class="changelog-list">
        <li>优化页面加载速度</li>
        <li>改进移动端适配</li>
        <li>增加工具分类导航</li>
      </ul>
    </div>
  `;
}

// AI 导航页面状态与渲染
let currentAiNavCat = 'all';
let currentAiNavQuery = '';

function renderAiNavPage(categoryKey = null) {
  const container = document.getElementById('ai-nav-content');
  if (!container) return;

  if (categoryKey) {
    currentAiNavCat = categoryKey;
  }

  // 收集所有 AI 导航项目
  let allItems = [];
  Object.keys(AI_NAV_DATA).forEach(key => {
    const cat = AI_NAV_DATA[key];
    cat.items.forEach(item => {
      allItems.push({ ...item, categoryKey: key, categoryName: cat.name });
    });
  });

  // 计算每个分类的数量
  const counts = { all: allItems.length };
  Object.keys(AI_NAV_DATA).forEach(key => {
    counts[key] = AI_NAV_DATA[key].items.length;
  });

  // 当前分类元信息
  const activeCatObj = currentAiNavCat === 'all' 
    ? { name: '全部 AI 导航', icon: '🌐', desc: '精选前沿 AI 工具、协议生态、编程助手与大模型官方平台导航' } 
    : AI_NAV_DATA[currentAiNavCat] || { name: 'AI 导航', icon: '🤖', desc: '' };

  // 渲染整体结构：左侧分类 + 右侧卡片与搜索
  container.innerHTML = `
    <div class="ainav-layout">
      <!-- 左侧分类侧边栏 -->
      <aside class="ainav-sidebar">
        <div class="ainav-sidebar-header">
          <span class="ainav-sidebar-icon">🤖</span>
          <span class="ainav-sidebar-title">AI 导航分类</span>
        </div>
        <nav class="ainav-cat-list">
          <div class="ainav-cat-item ${currentAiNavCat === 'all' ? 'active' : ''}" onclick="filterAiNavCategory('all')">
            <span class="ainav-cat-icon">🌐</span>
            <span class="ainav-cat-name">全部资源</span>
            <span class="ainav-cat-badge">${counts.all}</span>
          </div>
          ${Object.keys(AI_NAV_DATA).map(key => {
            const cat = AI_NAV_DATA[key];
            return `
              <div class="ainav-cat-item ${currentAiNavCat === key ? 'active' : ''}" onclick="filterAiNavCategory('${key}')">
                <span class="ainav-cat-icon">${cat.icon}</span>
                <span class="ainav-cat-name">${cat.name}</span>
                <span class="ainav-cat-badge">${counts[key]}</span>
              </div>
            `;
          }).join('')}
        </nav>
      </aside>

      <!-- 右侧主展示区 -->
      <main class="ainav-main">
        <div class="ainav-header-banner">
          <div class="ainav-header-info">
            <div class="ainav-header-title-row">
              <span class="ainav-header-icon">${activeCatObj.icon}</span>
              <h1 class="ainav-header-title">${activeCatObj.name}</h1>
              <span class="ainav-header-count" id="ainavCountBadge">显示中</span>
            </div>
            <p class="ainav-header-desc">${activeCatObj.desc}</p>
          </div>
          <div class="ainav-search-wrapper">
            <svg class="ainav-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input type="text" id="ainavSearchInput" class="ainav-search-input" placeholder="搜索 AI 网站、工具或关键词..." value="${currentAiNavQuery}" oninput="filterAiNavSearch(this.value)">
            ${currentAiNavQuery ? `<button class="ainav-search-clear" onclick="clearAiNavSearch()">✕</button>` : ''}
          </div>
        </div>

        <div class="ainav-cards-container" id="ainavCardsGrid">
          <!-- 动态渲染的 AI 卡片网格 -->
        </div>
      </main>
    </div>
  `;

  renderAiNavCards();
}

function filterAiNavCategory(catKey) {
  currentAiNavCat = catKey;
  // 更新 sidebar 高亮
  document.querySelectorAll('.ainav-cat-item').forEach(el => el.classList.remove('active'));
  const activeEl = document.querySelector(`.ainav-cat-item[onclick="filterAiNavCategory('${catKey}')"]`);
  if (activeEl) activeEl.classList.add('active');

  // 更新 Header Info
  const activeCatObj = catKey === 'all' 
    ? { name: '全部 AI 导航', icon: '🌐', desc: '精选前沿 AI 工具、协议生态、编程助手与大模型官方平台导航' } 
    : AI_NAV_DATA[catKey] || { name: 'AI 导航', icon: '🤖', desc: '' };

  const titleEl = document.querySelector('.ainav-header-title');
  const iconEl = document.querySelector('.ainav-header-icon');
  const descEl = document.querySelector('.ainav-header-desc');
  if (titleEl) titleEl.textContent = activeCatObj.name;
  if (iconEl) iconEl.textContent = activeCatObj.icon;
  if (descEl) descEl.textContent = activeCatObj.desc;

  renderAiNavCards();
}

function filterAiNavSearch(query) {
  currentAiNavQuery = query.trim().toLowerCase();
  renderAiNavCards();
}

function clearAiNavSearch() {
  currentAiNavQuery = '';
  const input = document.getElementById('ainavSearchInput');
  if (input) input.value = '';
  renderAiNavCards();
}

function renderAiNavCards() {
  const grid = document.getElementById('ainavCardsGrid');
  const countBadge = document.getElementById('ainavCountBadge');
  if (!grid) return;

  // 过滤卡片
  let items = [];
  if (currentAiNavCat === 'all') {
    Object.keys(AI_NAV_DATA).forEach(key => {
      AI_NAV_DATA[key].items.forEach(item => {
        items.push({ ...item, categoryKey: key, categoryName: AI_NAV_DATA[key].name });
      });
    });
  } else if (AI_NAV_DATA[currentAiNavCat]) {
    const cat = AI_NAV_DATA[currentAiNavCat];
    items = cat.items.map(item => ({ ...item, categoryKey: currentAiNavCat, categoryName: cat.name }));
  }

  if (currentAiNavQuery) {
    items = items.filter(item => {
      const nameMatch = item.name.toLowerCase().includes(currentAiNavQuery);
      const descMatch = item.desc.toLowerCase().includes(currentAiNavQuery);
      const tagMatch = item.tags.some(t => t.toLowerCase().includes(currentAiNavQuery));
      const categoryMatch = item.categoryName.toLowerCase().includes(currentAiNavQuery);
      return nameMatch || descMatch || tagMatch || categoryMatch;
    });
  }

  if (countBadge) {
    countBadge.textContent = `共 ${items.length} 项`;
  }

  if (items.length === 0) {
    grid.innerHTML = `
      <div class="ainav-empty-state">
        <div class="ainav-empty-icon">🔍</div>
        <h3>未找到匹配的 AI 资源</h3>
        <p>尝试更换搜索关键词或选择其他分类</p>
        <button class="ainav-btn-reset" onclick="clearAiNavSearch(); filterAiNavCategory('all');">查看全部资源</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = `
    <div class="ainav-grid">
      ${items.map(item => {
        let domain = '';
        try {
          domain = new URL(item.url).hostname.replace('www.', '');
        } catch (e) {
          domain = item.url;
        }

        return `
          <div class="ainav-card" onclick="window.open('${item.url}', '_blank', 'noopener,noreferrer')" title="点击跳转访问 ${item.name}">
            <div class="ainav-card-top">
              <div class="ainav-card-icon">${item.icon || '🤖'}</div>
              <div class="ainav-card-meta">
                <div class="ainav-card-title-row">
                  <h3 class="ainav-card-title">${item.name}</h3>
                  ${item.badge ? `<span class="ainav-badge ${getBadgeClass(item.badge)}">${item.badge}</span>` : ''}
                </div>
                <div class="ainav-card-domain">
                  <span>${domain}</span>
                </div>
              </div>
            </div>

            <div class="ainav-card-desc">${item.desc}</div>

            <div class="ainav-card-bottom">
              <div class="ainav-card-tags">
                ${item.tags.map(tag => `<span class="ainav-tag">${tag}</span>`).join('')}
              </div>
              <div class="ainav-card-action">
                <span>直达</span>
                ${ICONS.externalLink}
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function getBadgeClass(badge) {
  switch (badge) {
    case '爆款':
    case '热门':
      return 'badge-hot';
    case '官方':
      return 'badge-official';
    case '开源':
      return 'badge-opensource';
    case '推荐':
    case '必备':
      return 'badge-recommend';
    default:
      return 'badge-default';
  }
}

// 小游戏数据
const GAMES_DATA = [
  { id: 'dice', name: '掷骰子', desc: '随机掷出骰子，看看运气如何', icon: '🎲', category: '休闲', tags: ['休闲', '随机'] },
  { id: 'flip-coin', name: '抛硬币', desc: '正反面试试运气', icon: '🪙', category: '休闲', tags: ['休闲', '决策'] },
  { id: 'random-pick', name: '随机抽签', desc: '从选项中随机抽取一个', icon: '🎯', category: '休闲', tags: ['休闲', '决策'] },
  { id: 'love-calc', name: '缘分计算', desc: '计算你和TA的缘分值', icon: '', category: '趣味', tags: ['趣味', '娱乐'] },
  { id: 'emoji', name: 'Emoji表情', desc: '复制各类Emoji表情', icon: '😀', category: '工具', tags: ['工具', '表情'] },
  { id: 'ascii-art', name: 'ASCII艺术字', desc: '生成ASCII字符画', icon: '', category: '创意', tags: ['创意', '艺术'] },
  { id: 'riddle', name: '脑筋急转弯', desc: '随机出题趣味问答', icon: '', category: '益智', tags: ['益智', '问答'] },
  { id: 'word-game', name: '文字游戏', desc: '文字接龙等趣味游戏', icon: '', category: '益智', tags: ['益智', '文字'] },
  { id: 'fake-person', name: '虚拟身份', desc: '生成随机虚拟身份信息', icon: '🎭', category: '创意', tags: ['创意', '生成'] },
  { id: 'horoscope', name: '星座运势', desc: '查看今日星座运势', icon: '⭐', category: '趣味', tags: ['趣味', '星座'] },
  { id: 'memory-game', name: '记忆翻牌', desc: '考验你的记忆力', icon: '🃏', category: '益智', tags: ['益智', '记忆'] },
  { id: 'reaction-time', name: '反应测试', desc: '测试你的反应速度', icon: '', category: '挑战', tags: ['挑战', '速度'] },
  { id: 'typing-game', name: '打字练习', desc: '提升打字速度', icon: '⌨️', category: '挑战', tags: ['挑战', '技能'] },
  { id: 'color-match', name: '颜色匹配', desc: '识别正确的颜色', icon: '', category: '挑战', tags: ['挑战', '视觉'] },
  { id: 'number-puzzle', name: '数字拼图', desc: '经典数字华容道', icon: '🔢', category: '益智', tags: ['益智', '拼图'] }
];

// 小游戏页面
function renderGamesPage() {
  const container = document.getElementById('games-content');
  if (!container) return;
  
  // 获取分类
  const categories = [...new Set(GAMES_DATA.map(g => g.category))];
  
  // 更新分类侧边栏
  const categoriesContainer = document.getElementById('games-categories');
  if (categoriesContainer) {
    categoriesContainer.innerHTML = `
      <div class="games-category-item active" onclick="filterGamesByCategory('all', this)">
        <span class="games-category-icon"></span>
        <span>全部游戏</span>
      </div>
      ${categories.map(cat => `
        <div class="games-category-item" onclick="filterGamesByCategory('${cat}', this)">
          <span class="games-category-icon">${getCategoryIcon(cat)}</span>
          <span>${cat}</span>
        </div>
      `).join('')}
    `;
  }
  
  // 更新分类筛选下拉框
  const categoryFilter = document.getElementById('games-category-filter');
  if (categoryFilter) {
    categoryFilter.innerHTML = `
      <option value="all">全部</option>
      ${categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
    `;
  }
  
  // 更新游戏数量
  const countEl = document.getElementById('games-count');
  if (countEl) countEl.textContent = GAMES_DATA.length;
  
  // 渲染游戏卡片
  container.innerHTML = `
    <div class="games-grid">
      ${GAMES_DATA.map(game => `
        <div class="game-card" data-category="${game.category}" data-name="${game.name}">
          <div class="game-card-image">
            <span style="font-size: 4rem;">${game.icon}</span>
            <span class="game-card-badge">未探索</span>
          </div>
          <div class="game-card-body">
            <div class="game-card-title">${game.name}</div>
            <div class="game-card-desc">${game.desc}</div>
            <div class="game-card-tags">
              ${game.tags.map(tag => `<span class="game-card-tag">${tag}</span>`).join('')}
            </div>
            <div class="game-card-actions">
              <button class="game-card-btn primary" onclick="navigateTo('tool', '${game.id}')">进入游戏</button>
              <button class="game-card-btn secondary" onclick="event.stopPropagation()">观摩视频</button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function getCategoryIcon(category) {
  const icons = {
    '休闲': '🎯',
    '趣味': '🎪',
    '工具': '',
    '创意': '',
    '益智': '🧩',
    '挑战': '⚡'
  };
  return icons[category] || '';
}

function filterGamesByCategory(category, element) {
  // 更新侧边栏激活状态
  document.querySelectorAll('.games-category-item').forEach(item => {
    item.classList.remove('active');
  });
  if (element) element.classList.add('active');
  
  // 筛选游戏卡片
  const cards = document.querySelectorAll('.game-card');
  cards.forEach(card => {
    if (category === 'all' || card.dataset.category === category) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

function filterGames() {
  const query = document.getElementById('games-search-input').value.toLowerCase();
  const cards = document.querySelectorAll('.game-card');
  cards.forEach(card => {
    const name = card.dataset.name.toLowerCase();
    if (name.includes(query)) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

// 收藏页面
function renderStarredPage() {
  const container = document.getElementById('starred-content');
  if (!container) return;
  
  const starred = FavoritesManager.get().map(id => getToolById(id)).filter(Boolean);
  
  if (starred.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        ${ICONS.star}
        <h3>暂无收藏</h3>
        <p>点击工具卡片上的星标即可收藏</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = `
    <div class="section-header">
      <h2 class="section-title">我的收藏 (${starred.length})</h2>
      <button class="tool-page-btn" onclick="clearAllStarred()">清空</button>
    </div>
    <div class="cards-grid">
      ${starred.map((tool, idx) => renderToolCard(tool, tool.category, idx + 1)).join('')}
    </div>
  `;
}

// 历史页面
function renderHistoryPage() {
  const container = document.getElementById('history-content');
  if (!container) return;
  
  const history = HistoryManager.get();
  
  if (history.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        ${ICONS.history}
        <h3>暂无历史记录</h3>
        <p>你使用过的工具会显示在这里</p>
      </div>
    `;
    return;
  }
  
  const historyTools = history.map(h => {
    const tool = getToolById(h.id);
    return tool ? { ...tool, time: h.time } : null;
  }).filter(Boolean);
  
  container.innerHTML = `
    <div class="section-header">
      <h2 class="section-title">历史记录 (${historyTools.length})</h2>
      <button class="tool-page-btn" onclick="clearAllHistory()">清空</button>
    </div>
    <div class="history-list">
      ${historyTools.map(tool => `
        <div class="history-item" onclick="navigateTo('tool', '${tool.id}')">
          <div class="history-item-left">
            ${ICONS.history}
            <span>${tool.name}</span>
          </div>
          <span class="history-item-time">${formatTime(tool.time)}</span>
          <button class="history-item-remove" onclick="event.stopPropagation(); removeHistory('${tool.id}')">
            ${ICONS.close}
          </button>
        </div>
      `).join('')}
    </div>
  `;
}

// 最近使用工具 (显示最近使用的8个，一行显示4个，最多2行)
function renderRecentTools() {
  const history = HistoryManager.get().slice(0, 8);
  const section = document.getElementById('recentSection');
  const grid = document.getElementById('recentTools');
  if (!section || !grid) return;

  if (history.length === 0) {
    section.style.display = 'none';
    return;
  }
  
  const recentTools = history.map(h => getToolById(h.id)).filter(Boolean);
  if (recentTools.length === 0) {
    section.style.display = 'none';
    return;
  }
  
  section.style.display = 'block';
  grid.innerHTML = recentTools.map((tool, idx) => renderToolCard(tool, tool.category, idx + 1)).join('');
}

// 操作函数
function toggleStar(toolId, btn) {
  const isStarred = FavoritesManager.toggle(toolId);
  btn.classList.toggle('starred', isStarred);
  btn.innerHTML = isStarred ? ICONS.starFilled : ICONS.star;
}

function toggleToolStar(toolId) {
  const isStarred = FavoritesManager.toggle(toolId);
  const btn = document.getElementById('toolStarBtn');
  if (btn) {
    btn.innerHTML = `${isStarred ? ICONS.starFilled : ICONS.star}<span>${isStarred ? '已收藏' : '收藏'}</span>`;
    btn.classList.toggle('primary', isStarred);
  }
}

function removeHistory(toolId) {
  HistoryManager.remove(toolId);
  renderHistoryPage();
}

function clearAllStarred() {
  if (confirm('确定清空所有收藏？')) {
    FavoritesManager.get().forEach(id => FavoritesManager.remove(id));
    renderStarredPage();
    showToast('已清空所有收藏', 'info');
  }
}

function clearAllHistory() {
  if (confirm('确定清空历史记录？')) {
    HistoryManager.clear();
    renderHistoryPage();
    showToast('已清空历史记录', 'info');
  }
}

// 返回功能
let historyStack = [];
function goBack() {
  if (historyStack.length > 0) {
    const prev = historyStack.pop();
    navigateTo(prev.page, prev.param);
  } else {
    navigateTo('home');
  }
}

// 记录导航历史
const originalNavigateTo = navigateTo;
navigateTo = function(page, param) {
  historyStack.push({ page: currentPage, param: currentTool || currentCategory });
  originalNavigateTo(page, param);
};
