# Kotori's Colorful Seika

Kotori's Colorful Seika 是我的个人学习主页，也是一个轻量的浏览器端学习工作台。它把课程笔记、每日待办、Obsidian / NotebookLM 外链、音乐与背景设置集中在一个柔和可爱的单页应用里，方便我把每天的学习记录沉淀下来。

在线访问：[https://kotori-cjk.github.io/](https://kotori-cjk.github.io/)

## 站点内容

- 学科笔记：按数学、物理、程设、AI 引论等方向组织 Markdown 笔记(也支持latex渲染)。
- 今日待办：记录当天任务、完成状态和任务类别。
- 外部工作流：支持跳转 Obsidian、NotebookLM、Bangumi 等常用页面。
- Code Analysis：跳转到洛谷刷题与 AI 代码分析站，用于保存题目、代码、AI 诊断和问答记录。
- 个性化设置：支持自定义背景图、网易云音乐、JSON 数据导入导出。

## 相关子站

- Code Analysis：[https://kotori-cjk.github.io/luogu-ai-journey/](https://kotori-cjk.github.io/luogu-ai-journey/)
- Luogu Journey：[https://kotori-cjk.github.io/luogu-journey/](https://kotori-cjk.github.io/luogu-journey/)

## 技术栈

这个站点保持为纯前端静态站点，便于直接部署在 GitHub Pages 上：

- HTML
- CSS
- Vanilla JavaScript
- LocalStorage
- Markdown rendering via `marked`

## 数据说明

站点数据默认保存在浏览器 `localStorage` 中，不依赖后端服务。设置面板提供 JSON 导入和导出功能，方便迁移、备份或恢复学习记录。

## 设计方向

整体视觉延续粉色系、柔和、轻量的学习空间风格。它不是一个严肃的管理后台，而更像一张可以长期陪伴学习的个人桌面。
