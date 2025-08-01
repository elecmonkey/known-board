# Known Board 数据格式规范

## 概述

本文档定义了 Known Board 应用程序的数据结构和格式规范，用于导出和导入功能。

## 版本历史

- **v1.0**: 初始版本，使用平铺的 taskSets 和 tasks 数组结构
- **v2.0**: 树形结构版本，使用统一的 TreeNode 节点和 children 数组

## 数据结构 (v2.0)

### 根对象

```json
{
  "version": "2.0",
  "exportedAt": "2023-01-01T00:00:00.000Z",
  "data": {
    "version": "2.0",
    "children": []
  }
}
```

### TreeNode (树形节点)

所有节点统一使用 TreeNode 结构，通过 `type` 字段区分任务集和任务：

```json
{
  "id": "string",
  "type": "taskSet" | "task",
  "title": "string",
  "description": "string (可选)",
  
  // TaskSet 特有字段
  "hidden": "boolean (仅 taskSet 类型)",
  
  // Task 特有字段
  "completed": "boolean (仅 task 类型)",
  "deadline": "string (可选, ISO 8601 格式, 仅 task 类型)",
  "videoUrl": "string (可选, 仅 task 类型)",
  "episodes": "Episode[] (仅 task 类型)",
  
  // 树形结构
  "children": "TreeNode[] (可选, 子节点数组)"
}
```

### Episode (分集)

```json
{
  "id": "string",
  "number": "number",
  "title": "string",
  "description": "string (可选)",
  "deadline": "string (可选, ISO 8601 格式)",
  "videoUrl": "string (可选)",
  "completed": "boolean"
}
```

## 示例 (v2.0)

```json
{
  "version": "2.0",
  "exportedAt": "2023-01-01T00:00:00.000Z",
  "data": {
    "version": "2.0",
    "children": [
      {
        "id": "set1",
        "type": "taskSet",
        "title": "学习计划",
        "description": "我的年度学习计划",
        "hidden": false,
        "children": [
          {
            "id": "task1",
            "type": "task",
            "title": "学习 TypeScript",
            "description": "掌握 TypeScript 基础知识",
            "completed": false,
            "deadline": "2023-12-31",
            "episodes": [
              {
                "id": "ep1",
                "number": 1,
                "title": "基础语法",
                "completed": true
              },
              {
                "id": "ep2",
                "number": 2,
                "title": "高级类型",
                "completed": false
              }
            ],
            "children": []
          },
          {
            "id": "set2",
            "type": "taskSet",
            "title": "前端框架",
            "description": "学习现代前端框架",
            "hidden": false,
            "children": [
              {
                "id": "task2",
                "type": "task",
                "title": "SolidJS 入门",
                "completed": true,
                "children": []
              }
            ]
          }
        ]
      }
    ]
  }
}
```

## 旧版本兼容性 (v1.0)

应用程序自动支持 v1.0 格式的导入和 localStorage 数据迁移：

### v1.0 格式示例

```json
{
  "version": "1.0",
  "exportedAt": "2023-01-01T00:00:00.000Z",
  "data": {
    "taskSets": [
      {
        "id": "set1",
        "title": "学习计划",
        "description": "我的年度学习计划",
        "hidden": false,
        "parentId": undefined
      }
    ],
    "tasks": [
      {
        "id": "task1",
        "title": "学习 TypeScript",
        "description": "掌握 TypeScript 基础知识",
        "completed": false,
        "deadline": "2023-12-31",
        "parentId": "set1",
        "episodes": [...]
      }
    ]
  }
}
```

### 迁移逻辑

1. **自动检测**: 应用程序自动检测数据版本
2. **结构转换**: 将平铺的 parentId 关系转换为嵌套的 children 结构
3. **类型标记**: 为每个节点添加 `type` 字段
4. **保存更新**: 迁移后的数据自动保存为 v2.0 格式

## 排序支持

v2.0 格式天然支持拖拽排序：

- **位置信息**: 通过 `children` 数组的顺序确定显示顺序
- **拖拽操作**: 重新排列数组元素即可改变顺序
- **跨层级移动**: 将节点从一个 `children` 数组移动到另一个