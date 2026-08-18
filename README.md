# 在线工具箱

免费实用的在线工具集合，无需注册即可使用。提供文本处理、编码解码、加密解密、开发工具、图片处理、生活实用、数据图表、CSS 样式、AI 导航与小游戏等丰富的 Web 工具。

## 功能特性

- 海量工具：覆盖 10 大类、近 90 个实用工具，并持续扩充
- 智能翻译：在线翻译工具支持英汉双向翻译，可调用 Gemini AI 获取高精度结果，并提供免费引擎回退
- AI 导航：内置 AI 工具、MCP、AIGC、大模型、AI 编程等资源导航
- 小游戏：内置休闲、益智、挑战等分类的小游戏库
- 搜索与收藏：全局工具搜索，支持收藏与历史记录
- 主题切换：支持浅色 / 深色主题

## 技术栈

| 层级 | 技术 |
| ---- | ---- |
| 前端 | 原生 HTML / CSS / JavaScript |
| 后端 | Node.js + Express |
| AI 能力 | Google Gemini API（`@google/genai`） |
| 其他依赖 | jsQR（二维码解析） |

## 目录结构

```
gongjuxiang/
├── index.html              # 单页应用入口
├── server.js               # Express 静态服务器与翻译 API
├── package.json            # 项目配置与依赖
├── .env.example            # 环境变量示例
├── styles/
│   └── main.css            # 全局样式
├── js/
│   ├── tools-data.js       # 工具分类与工具定义数据
│   ├── utils.js            # 通用工具函数
│   ├── render.js           # 页面渲染与导航逻辑
│   ├── text-tools.js       # 文本处理工具
│   ├── encode-tools.js     # 编码解码工具
│   ├── dev-tools.js        # 开发工具
│   ├── image-tools.js      # 图片处理工具
│   ├── life-fun-tools.js   # 生活实用与趣味工具
│   ├── data-tools.js       # 数据图表工具
│   ├── css-tools.js        # CSS 样式工具
│   ├── qrcode.min.js       # 二维码生成库
│   └── jsqr.min.js         # 二维码解析库
└── assets/                 # 静态资源
```

## 快速开始

**前置要求：** Node.js

1. 安装依赖：

   ```bash
   npm install
   ```

2. 配置环境变量（可选）：

   复制 `.env.example` 中的内容，设置 `GEMINI_API_KEY`。该密钥用于「在线翻译」工具调用 Gemini AI 获取高精度翻译结果，不设置时翻译功能将自动回退到免费翻译引擎。

   ```bash
   GEMINI_API_KEY=你的Gemini_API密钥
   ```

3. 启动服务：

   ```bash
   npm run dev
   ```

   服务默认运行在 `http://localhost:3000`。

## 环境变量

| 变量名 | 是否必填 | 说明 |
| ------ | -------- | ---- |
| `GEMINI_API_KEY` | 否 | Gemini API 密钥，用于在线翻译的 AI 高精度翻译，缺失时自动使用免费引擎回退 |

## API 接口

| 方法 | 路径 | 说明 |
| ---- | ---- | ---- |
| POST | `/api/translate` | 在线翻译接口，请求体为 `{ "text": "...", "mode": "auto" }`，`mode` 支持 `auto` / `zh2en` |

翻译响应示例：

```json
{
  "success": true,
  "provider": "Gemini AI",
  "sourceLang": "zh",
  "targetLang": "en",
  "translatedText": "...",
  "phonetic": "",
  "keywords": [],
  "notes": ""
}
```

## 工具分类

| 分类 | 工具数量 | 说明 |
| ---- | -------- | ---- |
| 文本处理 | 15 | 字数统计、文本对比、行排序/去重、大小写转换、Markdown 预览等 |
| 编码解码 | 11 | URL、Base64、HTML 实体、Unicode、Hex、JWT、二维码等 |
| 加密解密 | 9 | AES/DES/RC4、哈希、RSA、国密算法、bcrypt、Argon2id 等 |
| 开发工具 | 13 | JSON/XML/SQL 格式化、正则测试、时间戳、HTTP 请求测试等 |
| 常用命令 | 2 | Git、Docker 命令速查 |
| 图片处理 | 7 | 图片缩放、裁剪、旋转、压缩、水印、Favicon 生成等 |
| 生活实用 | 13 | 单位换算、汇率、时区、BMI、密码生成、日期计算等 |
| 趣味工具 | 13 | Emoji、表情包、缘分计算、星座运势、心理测试等 |
| 数据图表 | 3 | Excel/CSV 转换、Mermaid 流程图、数据对比分析 |
| CSS 样式 | 3 | 渐变与阴影生成器、Flex/Grid 布局生成器、贝塞尔曲线预览 |

## 小游戏

内置 15 款小游戏，分为休闲、趣味、工具、创意、益智、挑战等分类，包括掷骰子、抛硬币、记忆翻牌、反应测试、打字练习、数字华容道等。

## 常用脚本

| 命令 | 说明 |
| ---- | ---- |
| `npm run dev` | 启动开发服务器（`node server.js`） |
| `npm start` | 启动服务器 |
| `npm run build` | 构建（占位命令，无需打包） |
| `npm run lint` | 代码检查（占位命令，无需检查） |
