# Known Board 数据格式规范

## 概述

本文档定义了 Known Board 应用程序的数据结构和格式规范，用于导出和导入功能。

## 数据结构

### 根对象

```json
{
  "version": "1.0",
  "exportedAt": "2023-01-01T00:00:00.000Z",
  "data": {
    "tasks": [],
    "taskSets": []
  }
}
```

### TaskSet (任务集)

```json
{
  "id": "string",
  "title": "string",
  "description": "string (可选)",
  "hidden": "boolean",
  "parentId": "string (可选)"
}
```

### Task (任务)

```json
{
  "id": "string",
  "title": "string",
  "description": "string (可选)",
  "completed": "boolean",
  "deadline": "string (可选, ISO 8601 格式)",
  "videoUrl": "string (可选)",
  "parentId": "string (可选)",
  "episodes": []
}
```

### Episode (分集)

```json
{
  "id": "string",
  "number": "number",
  "title": "string (可选)",
  "completed": "boolean"
}
```

## 示例

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
        "hidden": false
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
        ]
      }
    ]
  }
}
```