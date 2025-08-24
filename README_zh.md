![LayRain](./public/assist/img/logo.svg)
# <center>LayRain</center>
[![English](https://img.shields.io/badge/English-informational?style=for-the-badge)](README.md)
![简体中文](https://img.shields.io/badge/简体中文-inactive?style=for-the-badge)
---
#### 项目概述
LeiRain 是一个基于 Flask 开发的一言（Hitokoto）服务 API，提供获取、添加、更新、删除一言以及为一言点赞等功能。“一言”指那些简短且富有哲理、情感或思考性的句子，可以是名言、诗词、电影台词等类型。

#### 功能特点
- 获取随机一言
- 根据 ID 获取一言
- 添加新的一言
- 更新一言内容
- 删除一言
- 获取一言列表（支持分页和分类筛选功能）
- 获取分类列表
- 为指定一言点赞
- 获取某条一言的点赞数量

#### 技术栈
- 后端框架：Flask
- 数据库：MySQL
- 数据库驱动：pymysql
- 跨域支持：Flask-CORS（Flask 跨域扩展库）

#### 项目结构
```
LeiRain/
├── api.py         #### Flask API 主文件，定义了所有 API 端点
├── main.py        #### 一言系统的核心逻辑文件，实现与数据库的交互功能
├── requirements.txt  #### 项目依赖包列表文件
├── docs/          #### 文档目录
│   ├── docs/      #### VitePress 文档（用于项目说明与使用指南）
│   └── public/    #### 文档所需的静态资源文件
├── public/        #### 前端静态文件目录
│   ├── assist/    #### 辅助资源文件（如样式、脚本辅助文件等）
│   └── index.html #### 前端页面文件（项目前端入口页面）
└── ...
```

#### 文档
https://dev.layrain.cynara.my/（访问此链接可查看项目详细文档）

#### 许可证
版权所有 © 2025 CynaraGroup，保留所有权利。
本项目基于 LGPL-3.0 许可证（GNU 宽通用公共许可证 3.0 版）发行。