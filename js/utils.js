// =============================================
// 工具函数库
// =============================================

// LocalStorage 封装
const Storage = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch { return defaultValue; }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  },
  remove(key) {
    localStorage.removeItem(key);
  }
};

// Toast 提示
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icons = {
    success: ICONS.check,
    error: ICONS.close,
    info: ICONS.info
  };
  
  toast.innerHTML = `${icons[type] || icons.info}<span>${message}</span>`;
  container.appendChild(toast);
  
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// 复制到剪贴板
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast('已复制到剪贴板', 'success');
    return true;
  } catch {
    showToast('复制失败，请手动复制', 'error');
    return false;
  }
}

// 复制文本辅助函数
function copyText(text) {
  if (!text) {
    showToast('无可复制的内容', 'info');
    return;
  }
  copyToClipboard(text);
}

// 通用文件下载辅助函数
function downloadFile(content, fileName, mimeType = 'text/plain;charset=utf-8;') {
  try {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  } catch (e) {
    showToast('下载失败：' + e.message, 'error');
  }
}

// 防抖函数
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// 时间格式化
function formatTime(date) {
  const d = new Date(date);
  const now = new Date();
  const diff = now - d;
  
  if (diff < 60000) return '刚刚';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`;
  
  return `${d.getMonth() + 1}-${d.getDate()}`;
}

// 主题管理
const ThemeManager = {
  init() {
    const saved = Storage.get('theme', 'light');
    this.setTheme(saved);
    
    document.getElementById('themeToggle')?.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'light' ? 'dark' : 'light';
      this.setTheme(next);
    });
  },
  
  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    Storage.set('theme', theme);
    
    const btn = document.getElementById('themeToggle');
    if (btn) {
      btn.innerHTML = theme === 'dark' ? ICONS.sun : ICONS.moon;
      btn.title = theme === 'dark' ? '切换到浅色模式' : '切换到暗黑模式';
    }
  }
};

// 收藏管理
const FavoritesManager = {
  key: 'toolbox_favorites',
  
  get() {
    return Storage.get(this.key, []);
  },
  
  add(toolId) {
    const favorites = this.get();
    if (!favorites.includes(toolId)) {
      favorites.push(toolId);
      Storage.set(this.key, favorites);
      showToast('已添加到收藏', 'success');
    }
  },
  
  remove(toolId) {
    const favorites = this.get().filter(id => id !== toolId);
    Storage.set(this.key, favorites);
    showToast('已取消收藏', 'info');
  },
  
  toggle(toolId) {
    if (this.get().includes(toolId)) {
      this.remove(toolId);
      return false;
    } else {
      this.add(toolId);
      return true;
    }
  },
  
  isFavorite(toolId) {
    return this.get().includes(toolId);
  }
};

// 历史记录管理
const HistoryManager = {
  key: 'toolbox_history',
  maxItems: 20,
  
  get() {
    return Storage.get(this.key, []);
  },
  
  add(toolId) {
    let history = this.get().filter(h => h.id !== toolId);
    history.unshift({ id: toolId, time: Date.now() });
    if (history.length > this.maxItems) {
      history = history.slice(0, this.maxItems);
    }
    Storage.set(this.key, history);
  },
  
  remove(toolId) {
    const history = this.get().filter(h => h.id !== toolId);
    Storage.set(this.key, history);
  },
  
  clear() {
    Storage.remove(this.key);
  }
};

// 使用统计管理 (访问量/热门排名)
const UsageManager = {
  key: 'toolbox_usage_stats',
  
  defaults: {
    'word-count': 1280,
    'text-diff': 1150,
    'line-sort': 1020,
    'line-dedup': 960,
    'text-find-replace': 910,
    'text-indent': 850,
    'text-case': 800,
    'text-lines': 740,
    'text-join': 700,
    'text-split': 660,
    'url-encode': 620,
    'base64': 590,
    'json-format': 530,
    'qr-encode': 480
  },

  getStats() {
    const custom = Storage.get(this.key, {});
    return { ...this.defaults, ...custom };
  },

  get(toolId) {
    const stats = this.getStats();
    return stats[toolId] || 0;
  },

  increment(toolId) {
    if (!toolId) return;
    const stats = Storage.get(this.key, {});
    const current = stats[toolId] !== undefined ? stats[toolId] : (this.defaults[toolId] || 0);
    stats[toolId] = current + 1;
    Storage.set(this.key, stats);
  },

  getTopTools(allTools, limit = 12) {
    const stats = this.getStats();
    return [...allTools].sort((a, b) => {
      const countA = stats[a.id] || 0;
      const countB = stats[b.id] || 0;
      if (countB !== countA) return countB - countA;
      return a.name.localeCompare(b.name, 'zh-CN');
    }).slice(0, limit);
  }
};

// 搜索管理
const SearchManager = {
  init() {
    const input = document.getElementById('searchInput');
    const modal = document.getElementById('searchModal');
    
    if (input) {
      input.addEventListener('input', debounce((e) => {
        this.handleSearch(e.target.value);
      }, 300));
      
      input.addEventListener('focus', () => {
        if (input.value) this.handleSearch(input.value);
      });
    }
    
    // 点击搜索图标打开弹窗
    document.getElementById('searchBtn')?.addEventListener('click', () => {
      this.openModal();
    });
    
    // ESC 关闭弹窗
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModal();
      }
    });
  },
  
  openModal() {
    const modal = document.getElementById('searchModal');
    const input = document.getElementById('modalSearchInput');
    if (modal && input) {
      modal.classList.add('active');
      input.focus();
      this.handleSearch('');
    }
  },
  
  closeModal() {
    const modal = document.getElementById('searchModal');
    if (modal) {
      modal.classList.remove('active');
    }
  },
  
  handleSearch(query) {
    const results = searchTools(query);
    this.renderResults(results);
    
    // 同时更新主搜索框
    const mainInput = document.getElementById('searchInput');
    if (mainInput && query) {
      mainInput.value = query;
    }
  },
  
  renderResults(results) {
    const list = document.getElementById('searchResults');
    if (!list) return;
    
    if (results.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          ${ICONS.search}
          <p>未找到相关工具</p>
        </div>
      `;
      return;
    }
    
    list.innerHTML = results.map(tool => `
      <div class="modal-list-item" onclick="navigateTo('tool', '${tool.id}')">
        ${ICONS.codeIcon}
        <span>${tool.name}</span>
      </div>
    `).join('');
  }
};

// 导航管理
let currentPage = 'home';
let currentCategory = null;
let currentTool = null;

function navigateTo(page, param = null) {
  currentPage = page;
  
  // 关闭模态框
  SearchManager.closeModal();
  
  // 隐藏所有页面
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  
  // 显示目标页面
  const pageEl = document.getElementById(`page-${page}`);
  if (pageEl) {
    pageEl.classList.add('active');
  }
  
  // 更新页面内容
  switch (page) {
    case 'home':
      renderHomePage();
      break;
    case 'category':
      currentCategory = param;
      renderCategoryPage(param);
      break;
    case 'ai-nav':
      renderAiNavPage(param);
      break;
    case 'games':
      renderGamesPage();
      break;
    case 'tool':
      currentTool = param;
      renderToolPage(param);
      HistoryManager.add(param);
      UsageManager.increment(param);
      break;
    case 'about':
      renderAboutPage();
      break;
    case 'changelog':
      renderChangelogPage();
      break;
    case 'starred':
      renderStarredPage();
      break;
    case 'history':
      renderHistoryPage();
      break;
  }
  
  // 滚动到顶部
  window.scrollTo(0, 0);
  
  // 更新导航高亮
  updateNavHighlight(page, param);
}

function updateNavHighlight(page, param) {
  document.querySelectorAll('.nav-item, .sidebar-link').forEach(link => {
    link.classList.remove('active');
  });
  
  if (page === 'category' && param) {
    document.querySelector(`.sidebar-link[data-category="${param}"]`)?.classList.add('active');
    document.querySelector('.nav-item[data-page="category"]')?.classList.add('active');
  } else {
    document.querySelector(`.nav-item[data-page="${page}"]`)?.classList.add('active');
  }
}
