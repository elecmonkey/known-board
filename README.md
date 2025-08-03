# Known Board 网课看版

一个为学习资源管理设计的层次化任务跟踪工具，特别适合追踪书籍阅读、网课学习、大型项目等需要长期跟进的学习任务。

戳 [https://wk.edev.uno/](https://wk.edev.uno/) 快速体验，数据保存在浏览器本地 localStorage 中。

### 项目架构

```
/
├── index.html
├── src/
│   ├── components/         # 复用组件
│   ├── pages/              # 页面组件
│   │   ├── PendingPage.tsx     # 待办
│   │   ├── CompletedPage.tsx   # 已完成
│   │   ├── AllTasksPage.tsx    # 全部任务
│   │   ├── SortPage.tsx        # 拖拽排序
│   │   ├── AboutPage.tsx       # 关于
│   │   └── GuidePage.tsx       # 使用指南
│   ├── types/              # TypeScript类型定义
│   ├── utils/              # 工具代码
│   ├── docs/               # 文档
│   └── store.tsx           # 全局状态管理
└── plugin/
```

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 类型检查
pnpm type-check

# 预览构建结果
pnpm preview
```

## 数据

SPA Web 应用，所有数据储存在浏览器本地 localStorage 中。每次操作实时保存，无需手动操作。

数据可以导出为 `json` 文件来跨浏览器、跨设备传递，详细的数据格式规范请参考 `src/docs/data-format.md`。

## 开源协议

本项目采用 MIT 开源协议，欢迎提出 Issue 或提交 Pull Request！