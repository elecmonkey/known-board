# Known Board 网课看版

一个用来追踪学习进度的类 To-do List 工具。

戳 [https://wk.edev.uno/](https://wk.edev.uno/) 快速体验，数据保存在浏览器本地 localStorage 中。

## 愿景

希望解决常见 To-do List 工具规划大量学习资源时（啃厚书、几十几百集的网课、etc.）的不足。

## 技术栈

- **UI框架**：SolidJS
- **CSS框架**：Tailwind CSS
- **路由管理**：@solidjs/router
- **构建工具**：Vite

### 项目结构

```
src/
├── components/         # 复用组件
├── pages/              # 页面组件
├── utils/              # 工具函数
├── docs/               # 文档
├── store.tsx           # 状态管理
└── types.ts            # 类型定义
```

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

## 数据

Single-page Web Application，所有数据储存在浏览器本地 localStorage 中。

数据可以导出为 `json` 文件来跨浏览器、跨设备传递，详细的数据格式规范请参考 `src/docs/data-format.md`。

## 开源协议

本项目采用 MIT 开源协议，欢迎提出 Issue 或提交 Pull Request！