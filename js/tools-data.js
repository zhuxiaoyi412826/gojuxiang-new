// =============================================
// 工具箱数据结构与工具定义
// =============================================

const TOOLS_DATA = {
  // 文本处理类
  text: {
    name: '文本处理',
    icon: 'text',
    color: 'text',
    tools: [
      { id: 'word-count', name: '字数统计', desc: '统计文本的字数、字符数、行数、阅读时长等', tags: ['统计'] },
      { id: 'text-diff', name: '文本对比', desc: '比较两段文本的差异与逐行对比', tags: ['对比'] },
      { id: 'line-sort', name: '行排序', desc: '对文本行进行升序、降序或按长度排序', tags: ['排序'] },
      { id: 'line-dedup', name: '行去重', desc: '去除重复的行与空白行过滤', tags: ['去重'] },
      { id: 'text-find-replace', name: '查找替换', desc: '批量查找、正则替换与常用预设处理', tags: ['批量'] },
      { id: 'text-indent', name: '缩进转换', desc: '转换Tab和空格缩进', tags: ['格式化'] },
      { id: 'text-case', name: '大小写转换', desc: '英文大小写、驼峰、蛇形、常量等转换', tags: ['转换'] },
      { id: 'text-lines', name: '行号处理', desc: '添加或移除行号、补零与前缀后缀', tags: ['格式化'] },
      { id: 'text-join', name: '行合并', desc: '将多行按指定连接符合并成一行', tags: ['合并'] },
      { id: 'text-split', name: '文本分割', desc: '按指定字符或固定行数分割文本', tags: ['分割'] },
      { id: 'markdown-preview', name: 'Markdown预览', desc: '实时渲染 Markdown 与 HTML 导出', tags: ['预览'] },
      { id: 'camel-case', name: '驼峰命名转换', desc: '驼峰/下划线/中划线/帕斯卡全格式互转', tags: ['转换'] },
      { id: 'paragraph-dedup', name: '段落去重', desc: '智能段落去重与相似度清洗', tags: ['去重'] },
      { id: 'token-count', name: 'Token 统计', desc: '估算及精准统计 LLM / 大模型 Token 数量及费用预估', tags: ['AI', 'Token', '统计'] },
      { id: 'translate-card', name: '在线翻译', desc: '英汉双向文本翻译，独立结果输入框与一键复制', tags: ['翻译', '英语', '中文'] }
    ]
  },
  
  // 编码解码类
  encode: {
    name: '编码解码',
    icon: 'code',
    color: 'code',
    tools: [
      { id: 'url-encode', name: 'URL编码解码', desc: 'URL特殊字符编码与解码', tags: ['Web'] },
      { id: 'base64', name: 'Base64编码', desc: 'Base64加密解密转换', tags: ['加密'] },
      { id: 'html-encode', name: 'HTML实体编码', desc: 'HTML特殊字符转义与反转义', tags: ['Web'] },
      { id: 'unicode', name: 'Unicode编码', desc: 'Unicode字符转换', tags: ['字符'] },
      { id: 'hex-encode', name: 'Hex编码', desc: '字符串与十六进制互转', tags: ['进制'] },
      { id: 'jwt-decode', name: 'JWT解码', desc: '解析JSON Web Token', tags: ['Web'] },
      { id: 'uuid-gen', name: 'UUID生成', desc: '生成UUID标识符', tags: ['生成'] },
      { id: 'barcode-gen', name: '条形码生成', desc: '生成各种条形码', tags: ['生成'] },
      { id: 'short-url', name: '短链接生成', desc: '生成短链接', tags: ['Web'] },
      { id: 'qr-encode', name: '二维码生成', desc: '根据输入的URL或文本生成二维码图片', tags: ['二维码', '生成'] },
      { id: 'qrdecode', name: '二维码解析', desc: '上传二维码图片或摄像头扫描识别提取内容', tags: ['二维码', '解析', '解码'] }
    ]
  },

  // 加密解密类
  crypto: {
    name: '加密解密',
    icon: 'lock',
    color: 'code',
    tools: [
      { id: 'text-encrypt', name: '文本加密解密', desc: 'AES/DES/RC4/XOR对称文本加解密', tags: ['对称加密', '密码'] },
      { id: 'morse', name: '摩斯电码', desc: '摩斯电码加密解密', tags: ['密码'] },
      { id: 'rot13', name: 'ROT13加密', desc: '简单的字母替换加密', tags: ['密码'] },
      { id: 'jwt-encode', name: 'JWT编码', desc: '生成JSON Web Token', tags: ['Web'] },
      { id: 'hash-generate', name: '哈希生成', desc: '生成MD5/SHA/SHA-3及自定义加盐哈希', tags: ['加密', '加盐'] },
      { id: 'rsa-encrypt', name: 'RSA加密算法', desc: 'RSA公私钥加解密与密钥对生成', tags: ['RSA', '非对称加密'] },
      { id: 'argon2-hash', name: 'Argon2id加密', desc: 'Argon2id 密码哈希与密钥派生', tags: ['Argon2', '密码哈希'] },
      { id: 'sm-crypto', name: '国密算法(SM2/SM3/SM4)', desc: '国密SM2非对称、SM3杂凑与SM4分组加解密', tags: ['国密', 'SM2', 'SM3', 'SM4'] },
      { id: 'bcrypt-hash', name: 'bcrypt加密', desc: 'bcrypt 密码哈希生成与校验', tags: ['bcrypt', '密码加密'] }
    ]
  },
  
  // 开发工具类
  dev: {
    name: '开发工具',
    icon: 'dev',
    color: 'dev',
    tools: [
      { id: 'json-format', name: 'JSON格式化', desc: 'JSON数据美化与压缩', tags: ['格式化'] },
      { id: 'json-validate', name: 'JSON验证', desc: '验证JSON格式是否正确', tags: ['验证'] },
      { id: 'json-to-ts', name: 'JSON转TypeScript', desc: 'JSON转换为TypeScript类型', tags: ['转换'] },
      { id: 'xml-format', name: 'XML格式化', desc: 'XML数据美化与压缩', tags: ['格式化'] },
      { id: 'sql-format', name: 'SQL格式化', desc: 'SQL语句美化与压缩', tags: ['格式化'] },
      { id: 'regex-tester', name: '正则表达式', desc: '在线正则表达式测试、语法校验、常用预设与书写指南', tags: ['正则', '测试', '指南'] },
      { id: 'cron-gen', name: 'Cron生成器', desc: '可视化Cron表达式生成', tags: ['生成'] },
      { id: 'color-convert', name: '颜色转换', desc: 'HEX/RGB/HSL颜色互转', tags: ['转换'] },
      { id: 'timestamp', name: '时间戳转换', desc: 'Unix时间戳与日期互转', tags: ['时间'] },
      { id: 'crontab-test', name: 'Cron测试', desc: '测试Cron表达式执行时间', tags: ['测试'] },
      { id: 'name-generator', name: '批量姓名生成器', desc: '批量生成随机姓名', tags: ['生成'] },
      { id: 'http-test', name: 'HTTP请求测试', desc: '类似Postman的简易版', tags: ['测试'] },
      { id: 'code-minify', name: '代码压缩', desc: 'JS/CSS代码压缩', tags: ['压缩'] }
    ]
  },
  
  // 常用命令类
  cmd: {
    name: '常用命令',
    icon: 'cmd',
    color: 'cmd',
    tools: [
      { id: 'git-cmd', name: 'Git', desc: '常用Git命令速查', tags: ['版本控制'] },
      { id: 'docker-cmd', name: 'Docker', desc: 'Docker常用命令', tags: ['容器'] }
    ]
  },
  
  // 图片处理类
  image: {
    name: '图片处理',
    icon: 'image',
    color: 'image',
    tools: [
      { id: 'image-base64', name: '图片Base64', desc: '图片与Base64互转', tags: ['转换'] },
      { id: 'image-resize', name: '图片缩放', desc: '调整图片尺寸大小', tags: ['调整'] },
      { id: 'image-crop', name: '图片裁剪', desc: '裁剪图片区域', tags: ['裁剪'] },
      { id: 'image-rotate', name: '图片旋转', desc: '旋转或翻转图片', tags: ['旋转'] },
      { id: 'image-compress', name: '图片压缩', desc: '压缩图片文件大小', tags: ['压缩'] },
      { id: 'imagewatermark', name: '图片水印', desc: '添加文字或图片水印', tags: ['水印'] },
      { id: 'favicon', name: 'Favicon生成', desc: '从图片生成Favicon', tags: ['生成'] }
    ]
  },
  
  // 生活实用类
  life: {
    name: '生活实用',
    icon: 'life',
    color: 'life',
    tools: [
      { id: 'unit-convert', name: '单位换算', desc: '长度、重量、温度等换算', tags: ['换算'] },
      { id: 'currency', name: '汇率换算', desc: '实时货币汇率转换', tags: ['换算'] },
      { id: 'timezone', name: '时区转换', desc: '不同时区时间转换', tags: ['时间'] },
      { id: 'calculator', name: '计算器', desc: '科学计算器', tags: ['计算'] },
      { id: 'bmi', name: 'BMI计算', desc: '身体质量指数计算', tags: ['健康'] },
      { id: 'password-gen', name: '密码生成', desc: '生成随机安全密码', tags: ['生成'] },
      { id: 'password-test', name: '密码强度', desc: '测试密码强度', tags: ['测试'] },
      { id: 'random-pick', name: '随机抽签', desc: '随机选择器', tags: ['随机'] },
      { id: 'countdown', name: '倒计时', desc: '重要日期倒计时', tags: ['时间'] },
      { id: 'color-palette', name: '调色板', desc: '生成配色方案', tags: ['设计'] },
      { id: 'date-calc', name: '日期计算', desc: '计算两个日期相差天数', tags: ['时间'] },
      { id: 'anniversary', name: '纪念日计算', desc: '计算恋爱/结婚纪念日', tags: ['时间'] },
      { id: 'case-converter', name: '大小写与数字转换器', desc: '中文大写数字(金额/人民币)、论文学术大小写(Title/Sentence Case)转换', tags: ['大小写', '人民币大写', '论文', '转换'] }
    ]
  },
  
  // 趣味工具类
  fun: {
    name: '趣味工具',
    icon: 'fun',
    color: 'fun',
    tools: [
      { id: 'emoji', name: 'Emoji表情', desc: '复制各类Emoji表情', tags: ['表情'] },
      { id: 'meme', name: '表情包生成', desc: '制作趣味表情包', tags: ['图片'] },
      { id: 'love-calc', name: '缘分计算', desc: '计算你和TA的缘分值', tags: ['娱乐'] },
      { id: 'dice', name: '掷骰子', desc: '随机掷出骰子', tags: ['随机'] },
      { id: 'flip-coin', name: '抛硬币', desc: '正反面试试运气', tags: ['随机'] },
      { id: 'riddle', name: '脑筋急转弯', desc: '随机出题趣味问答', tags: ['娱乐'] },
      { id: 'word-game', name: '文字游戏', desc: '文字接龙等趣味游戏', tags: ['游戏'] },
      { id: 'ascii-art', name: 'ASCII艺术字', desc: '生成ASCII字符画', tags: ['文字'] },
      { id: 'fake-person', name: '虚拟身份', desc: '生成随机虚拟身份信息', tags: ['生成'] },
      { id: 'horoscope', name: '星座运势', desc: '查看今日星座运势', tags: ['娱乐'] },
      { id: 'random-joke', name: '随机笑话', desc: '随机展示笑话', tags: ['娱乐'] },
      { id: 'daily-quote', name: '每日一句', desc: '名人名言/鸡汤', tags: ['文字'] },
      { id: 'psych-test', name: '心理测试', desc: '简单心理测试', tags: ['测试'] }
    ]
  },

  // 数据与图表类
  data: {
    name: '数据图表',
    icon: 'dev',
    color: 'dev',
    tools: [
      { id: 'excel-csv-convert', name: 'Excel/CSV 格式转换与预览', desc: '在线快速解析 CSV/JSON/Excel 数据，多格式导出与表格预览', tags: ['Excel', 'CSV', 'JSON', '转换'] },
      { id: 'mermaid-preview', name: 'Mermaid 流程图预览', desc: '输入文本实时渲染流程图、甘特图、时序图与架构图', tags: ['Mermaid', '流程图', '图表'] },
      { id: 'data-diff-analyzer', name: '数据对比与差值分析', desc: '快速对比两组数值列表、JSON 或表格数据的差异与交并集', tags: ['数据分析', '对比', '差值'] }
    ]
  },

  // CSS/UI 样式生成器类
  css: {
    name: 'CSS样式',
    icon: 'image',
    color: 'image',
    tools: [
      { id: 'css-gradient-shadow', name: 'CSS 渐变与阴影生成器', desc: '可视化调整 Box-Shadow、Text-Shadow 和 CSS 渐变并复制代码', tags: ['CSS', '阴影', '渐变'] },
      { id: 'flex-grid-builder', name: 'Flex / Grid 布局生成器', desc: '拖拽与参数控制 Flexbox / Grid 布局，生成响应式 CSS 代码', tags: ['CSS', 'Flexbox', 'Grid', '布局'] },
      { id: 'cubic-bezier-preview', name: 'CSS 贝塞尔曲线动画预览', desc: '控制贝塞尔曲线 cubic-bezier，实时预览动画效果与 CSS 代码', tags: ['CSS', '动画', '贝塞尔曲线'] }
    ]
  }
};

// 获取所有工具列表（扁平化）
function getAllTools() {
  const all = [];
  for (const category in TOOLS_DATA) {
    TOOLS_DATA[category].tools.forEach(tool => {
      all.push({ ...tool, category, categoryName: TOOLS_DATA[category].name });
    });
  }
  return all;
}

// 根据ID获取工具信息
function getToolById(id) {
  const all = getAllTools();
  return all.find(t => t.id === id);
}

// 搜索工具
function searchTools(query) {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return getAllTools().filter(tool => 
    tool.name.toLowerCase().includes(q) ||
    tool.desc.toLowerCase().includes(q) ||
    tool.tags.some(tag => tag.toLowerCase().includes(q))
  );
}

// 图标SVG
const ICONS = {
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  starFilled: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  history: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>',
  lockIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
  textIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>',
  codeIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  devIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>',
  imageIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
  lifeIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
  funIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>',
  cmdIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
  refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
  link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
  externalLink: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>'
};

// =============================================
// AI 导航数据 (AI Navigation Data)
// =============================================
const AI_NAV_DATA = {
  skills: {
    name: 'Skills',
    icon: '⚡',
    desc: 'AI 提示词、Agent 技能与系统指令资源库',
    items: [
      {
        id: 'anthropic-prompts',
        name: 'Anthropic Prompt Library',
        url: 'https://docs.anthropic.com/en/prompt-library/library',
        desc: 'Anthropic 官方出品的 Claude 高质量提示词范例库与系统指令指南。',
        tags: ['官方范例', 'Claude', 'Prompt'],
        badge: '官方',
        icon: '🧠'
      },
      {
        id: 'promptbase',
        name: 'PromptBase',
        url: 'https://promptbase.com/',
        desc: '全球知名的 AI 提示词探索与交易平台，涵盖 Midjourney、ChatGPT、DALL-E 等。',
        tags: ['Prompt', '绘图', '对话'],
        badge: '热门',
        icon: '🎯'
      },
      {
        id: 'fabric',
        name: 'Fabric System',
        url: 'https://github.com/danielmiessler/fabric',
        desc: '开源的 AI 技能框架，将各类日常问题拆解为模块化 AI Prompt 技能。',
        tags: ['开源', 'Agent技能', 'CLI'],
        badge: '开源',
        icon: '🧵'
      },
      {
        id: 'llamaindex-skills',
        name: 'LlamaIndex Hub',
        url: 'https://www.llamaindex.ai/',
        desc: '大模型数据连接与 RAG 上下文检索技能组件库，高效接入企业数据。',
        tags: ['RAG', '数据增强', 'Agent'],
        badge: '框架',
        icon: '🦙'
      },
      {
        id: 'opengpts',
        name: 'OpenGPTs',
        url: 'https://github.com/langchain-ai/opengpts',
        desc: 'LangChain 开源的自定义 AI Agent 与技能拓展系统，可自由配置工具与知识库。',
        tags: ['开源', 'Agent', 'LangChain'],
        badge: '开源',
        icon: '🤖'
      },
      {
        id: 'google-ai-prompts',
        name: 'Gemini Prompt Gallery',
        url: 'https://ai.google.dev/prompts',
        desc: 'Google 官方 Gemini 模型提示词画廊，提供多种多模态与代码指令范例。',
        tags: ['Google', 'Gemini', '官方'],
        badge: '官方',
        icon: '✨'
      }
    ]
  },

  aitools: {
    name: 'AI工具',
    icon: '🧰',
    desc: '高效生产力 AI 对话、搜索与智能体助手',
    items: [
      {
        id: 'chatgpt',
        name: 'ChatGPT',
        url: 'https://chatgpt.com/',
        desc: 'OpenAI 旗下的标志性 AI 助手，支持多模态对话、图像分析与高级推理。',
        tags: ['OpenAI', 'GPT-4o', '对话'],
        badge: '热门',
        icon: '💬'
      },
      {
        id: 'claude',
        name: 'Claude',
        url: 'https://claude.ai/',
        desc: 'Anthropic 研发的新一代智能助手，具备卓越的代码编写、长文分析与逻辑推理能力。',
        tags: ['Anthropic', 'Sonnet 3.5', '长文本'],
        badge: '推荐',
        icon: '🎭'
      },
      {
        id: 'gemini',
        name: 'Google Gemini',
        url: 'https://gemini.google.com/',
        desc: 'Google 原生多模态 AI 助手，深度融合 Google 搜索与生态协同。',
        tags: ['Google', '多模态', '搜索实时'],
        badge: '官方',
        icon: '💎'
      },
      {
        id: 'kimi',
        name: 'Kimi 智能助手',
        url: 'https://kimi.moonshot.cn/',
        desc: '月之暗面 (Moonshot AI) 推出的支持超长无损上下文与智能联网搜索助手。',
        tags: ['超长文本', '联网搜索', '国产推荐'],
        badge: '热门',
        icon: '🌙'
      },
      {
        id: 'perplexity',
        name: 'Perplexity AI',
        url: 'https://www.perplexity.ai/',
        desc: '结合 AI 生成与实时网络检索的对话式搜索引擎，准确附带权威参考来源。',
        tags: ['AI搜索', '学术研究', '实时信息'],
        badge: '推荐',
        icon: '🔍'
      },
      {
        id: 'coze',
        name: 'Coze 扣子',
        url: 'https://www.coze.cn/',
        desc: '字节跳动推出的 AI Agent 智能体开发平台，无需编写代码快速搭建 AIBot。',
        tags: ['Agent', '低代码', 'Bot插件'],
        badge: '免费',
        icon: '🧩'
      },
      {
        id: 'dify',
        name: 'Dify.ai',
        url: 'https://dify.ai/',
        desc: '开源的大语言模型应用开发平台，提供直观的可视化 Workflow 与 RAG 配置。',
        tags: ['开源', 'LLMOps', '工作流'],
        badge: '开源',
        icon: '⚙️'
      }
    ]
  },

  mcp: {
    name: 'MCP',
    icon: '🔌',
    desc: 'Model Context Protocol 上下文扩展协议与服务生态',
    items: [
      {
        id: 'mcp-official',
        name: 'MCP Official Docs',
        url: 'https://modelcontextprotocol.io/',
        desc: 'Anthropic 主导发起的 Model Context Protocol (MCP) 开放标准官方规范与指引。',
        tags: ['官方规范', 'Protocol', 'Anthropic'],
        badge: '官方',
        icon: '📖'
      },
      {
        id: 'smithery',
        name: 'Smithery.ai',
        url: 'https://smithery.ai/',
        desc: '发现、搜索和一键部署 MCP 服务端的全网中心平台，一键赋予 AI 连通万物能力。',
        tags: ['MCP注册表', '服务器', '插件扩展'],
        badge: '热门',
        icon: '⚒️'
      },
      {
        id: 'mcp-so',
        name: 'PulseMCP / MCP.so',
        url: 'https://mcp.so/',
        desc: '精选 MCP 协议服务器与客户端组件目录，追踪最新最热门的 MCP 扩展。',
        tags: ['MCP生态', '目录', '扩展库'],
        badge: '推荐',
        icon: '📡'
      },
      {
        id: 'awesome-mcp-servers',
        name: 'Awesome MCP Servers',
        url: 'https://github.com/punkpeye/awesome-mcp-servers',
        desc: 'GitHub 社区维护的 MCP Server 优质资源与代码仓库汇总清单。',
        tags: ['GitHub开源', 'Awesome', '列表'],
        badge: '开源',
        icon: '⭐'
      },
      {
        id: 'glama-mcp',
        name: 'Glama MCP Hub',
        url: 'https://glama.ai/mcp/servers',
        desc: '可视化 MCP 服务器发现与工具调用浏览平台，快速接入各种 API 数据源。',
        tags: ['工具集', '集成', 'API扩展'],
        badge: '工具',
        icon: '🔮'
      }
    ]
  },

  aigc: {
    name: 'AIGC',
    icon: '🎨',
    desc: 'AI 图像生成、视频创作、音频合成与多媒体艺术',
    items: [
      {
        id: 'midjourney',
        name: 'Midjourney',
        url: 'https://www.midjourney.com/',
        desc: '业界顶级视觉画质与艺术构图的 AI 图像生成服务。',
        tags: ['AI绘图', '艺术设计', '顶尖画质'],
        badge: '热门',
        icon: '🎨'
      },
      {
        id: 'comfyui',
        name: 'ComfyUI',
        url: 'https://github.com/comfyanonymous/ComfyUI',
        desc: '基于模块化节点图的精准控制开源 SD/FLUX 图像生成工作流 GUI。',
        tags: ['开源', '节点工作流', 'Stable Diffusion'],
        badge: '开源',
        icon: '🕸️'
      },
      {
        id: 'runway',
        name: 'RunwayML',
        url: 'https://runwayml.com/',
        desc: 'Gen-3 Alpha 影视级 AI 视频生成与动态视觉创意制作工具。',
        tags: ['AI视频', 'Gen-3', '特效设计'],
        badge: '专业',
        icon: '🎬'
      },
      {
        id: 'luma-dream-machine',
        name: 'Luma Dream Machine',
        url: 'https://lumalabs.ai/dream-machine',
        desc: '高质量超拟真动态视频生成模型，轻松从文本和图片构建高清视频。',
        tags: ['AI视频', '高质量', 'Dream Machine'],
        badge: '热门',
        icon: '✨'
      },
      {
        id: 'suno',
        name: 'Suno AI',
        url: 'https://suno.com/',
        desc: '只需要简单文本提示词即可一键生成广播级音质的完整流行歌曲与音乐。',
        tags: ['AI音乐', '歌曲生成', '作曲'],
        badge: '推荐',
        icon: '🎵'
      },
      {
        id: 'civitai',
        name: 'Civitai (C站)',
        url: 'https://civitai.com/',
        desc: '全球最大的 AI 绘图模型、Lora 权重与 prompt 交流分享社区。',
        tags: ['模型下载', 'Lora', '社区'],
        badge: '社区',
        icon: '🏛️'
      },
      {
        id: 'flux',
        name: 'FLUX.1',
        url: 'https://blackforestlabs.ai/',
        desc: 'Black Forest Labs 推出的最强开源文生图模型，图像逼真度与细节掌控极佳。',
        tags: ['开源', '最强画质', 'Black Forest'],
        badge: '开源',
        icon: '⚡'
      }
    ]
  },

  github: {
    name: 'GitHub开源',
    icon: '🐙',
    desc: 'GitHub 上广受关注的爆款开源 AI 框架与应用',
    items: [
      {
        id: 'ollama',
        name: 'Ollama',
        url: 'https://github.com/ollama/ollama',
        desc: '极简本地大模型运行与管理工具，命令行一键下载并启动 Llama 3/DeepSeek/Qwen。',
        tags: ['本地运行', 'LLM', '开源'],
        badge: '爆款',
        icon: '🦙'
      },
      {
        id: 'vllm',
        name: 'vLLM',
        url: 'https://github.com/vllm-project/vllm',
        desc: '高吞吐量、低延迟的大语言模型 PagedAttention 推理与 API 服务提供引擎。',
        tags: ['高性能推理', 'PagedAttention', '部署'],
        badge: '硬核',
        icon: '🚀'
      },
      {
        id: 'langchain',
        name: 'LangChain',
        url: 'https://github.com/langchain-ai/langchain',
        desc: '知名的大模型开发框架，包含数据连接、记忆管理与 Agent 工具链组合。',
        tags: ['Agent框架', 'Python/JS', '组合构建'],
        badge: '主流',
        icon: '🦜'
      },
      {
        id: 'llama-cpp',
        name: 'llama.cpp',
        url: 'https://github.com/ggerganov/llama.cpp',
        desc: '纯 C/C++ 实现的高性能 LLM 推理库，完美支持 CPU/GPU 混合量化加速。',
        tags: ['C/C++', '量化加速', '低资源'],
        badge: '高性能',
        icon: '⚙️'
      },
      {
        id: 'open-webui',
        name: 'Open WebUI',
        url: 'https://github.com/open-webui/open-webui',
        desc: '功能极其丰富的私有化 Web 交互界面，无缝对接 Ollama 与 OpenAI API。',
        tags: ['WebUI', '私有部署', '功能全'],
        badge: '推荐',
        icon: '🖥️'
      },
      {
        id: 'autogen',
        name: 'Microsoft AutoGen',
        url: 'https://github.com/microsoft/autogen',
        desc: '微软开源的多 Agent 框架，支持多个 AI 角色相互对话并协作完成复杂的编程与推理任务。',
        tags: ['微软', '多Agent协作', '自动化'],
        badge: '开源',
        icon: '👥'
      }
    ]
  },

  aicode: {
    name: 'AI编程',
    icon: '💻',
    desc: '让代码开发效率翻倍的 AI 编程助手与 IDE',
    items: [
      {
        id: 'cursor',
        name: 'Cursor IDE',
        url: 'https://www.cursor.com/',
        desc: '专为 AI 时代重构的超级智能代码编辑器，集成智能补全、Composer 多文件改写与问答。',
        tags: ['智能IDE', 'Composer', '强力推荐'],
        badge: '爆款',
        icon: '🖱️'
      },
      {
        id: 'roo-code',
        name: 'Roo Code / Cline',
        url: 'https://github.com/RooVetGit/Roo-Code',
        desc: 'VS Code 自治型 AI 编程 Agent 插件，能全自动创建文件、运行命令与调试修 Bug。',
        tags: ['VSCode扩展', 'Autonomous Agent', '开源'],
        badge: '开源',
        icon: '🦘'
      },
      {
        id: 'v0-dev',
        name: 'v0.dev by Vercel',
        url: 'https://v0.dev/',
        desc: 'Vercel 出品的自然语言 UI 生成平台，输入需求直接输出精美 Tailwind & React 代码。',
        tags: ['前端生成', 'Tailwind', 'React'],
        badge: '推荐',
        icon: '⚡'
      },
      {
        id: 'github-copilot',
        name: 'GitHub Copilot',
        url: 'https://github.com/features/copilot',
        desc: 'GitHub & OpenAI 合作打造的老牌实时代码补全与 Copilot Chat 开发伙伴。',
        tags: ['代码补全', 'GitHub', '全平台'],
        badge: '主流',
        icon: '✈️'
      },
      {
        id: 'bolt-new',
        name: 'Bolt.new',
        url: 'https://bolt.new/',
        desc: '在浏览器沙盒中直接利用 AI 一键构建、安装依赖并实时预览全栈 Web 应用。',
        tags: ['WebContainers', '全栈生成', '即时预览'],
        badge: '热门',
        icon: '⚡'
      },
      {
        id: 'replit-agent',
        name: 'Replit Agent',
        url: 'https://replit.com/',
        desc: '只要自然语言描述需求，AI 就能在云端全自动写代码、配环境并一键部署在线上线。',
        tags: ['云端IDE', '自动部署', '全自动'],
        badge: '智能',
        icon: '🌀'
      }
    ]
  },

  llm: {
    name: '大模型',
    icon: '🌐',
    desc: '主流大语言模型官方开放平台与 API 服务',
    items: [
      {
        id: 'deepseek',
        name: 'DeepSeek 深度求索',
        url: 'https://www.deepseek.com/',
        desc: '国产开源最强推理模型 DeepSeek-R1 与 V3，高性价比 API 及强大解题逻辑。',
        tags: ['DeepSeek-R1', '开源推理', '超低价格API'],
        badge: '爆款',
        icon: '🐋'
      },
      {
        id: 'huggingface',
        name: 'Hugging Face',
        url: 'https://huggingface.co/',
        desc: '全球最大的开源 AI 模型、数据集、Space 演示与机器学习基础设施枢纽。',
        tags: ['开源模型', '数据集', 'AI社区'],
        badge: '必备',
        icon: '🤗'
      },
      {
        id: 'openai-platform',
        name: 'OpenAI Platform',
        url: 'https://platform.openai.com/',
        desc: 'OpenAI 开发者中心，提供 GPT-4o、o1、Embeddings 与 Realtime API 接口。',
        tags: ['GPT-4o', 'API开发者', 'OpenAI'],
        badge: '官方',
        icon: '🔑'
      },
      {
        id: 'google-aistudio',
        name: 'Google AI Studio',
        url: 'https://aistudio.google.com/',
        desc: 'Google 开发者原生的 Gemini 1.5 Pro / Flash 调试与 API 密钥管理控制台。',
        tags: ['Gemini 1.5', '百万上下文', 'API'],
        badge: '官方',
        icon: '⚡'
      },
      {
        id: 'anthropic-console',
        name: 'Anthropic Console',
        url: 'https://console.anthropic.com/',
        desc: 'Claude 3.5 Sonnet / Haiku 模型 API 官方调用与 Workbench 调优后台。',
        tags: ['Claude API', 'Anthropic', '提示词工程'],
        badge: '官方',
        icon: '🏛️'
      },
      {
        id: 'qwen',
        name: 'Qwen 通义千问',
        url: 'https://tongyi.aliyun.com/',
        desc: '阿里巴巴开源的通义千问 Qwen2.5 语言、代码与视觉大模型生态。',
        tags: ['Qwen2.5', '阿里开源', '多模态'],
        badge: '开源',
        icon: '☁️'
      }
    ]
  }
};

