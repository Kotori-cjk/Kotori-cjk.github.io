# Kotori Homepage

公开的个人 Homepage。页面以日系画册为视觉方向，刷新时先展示可翻开的封面，正文包含自我介绍、兴趣、外部链接、私人学习空间入口和轻量网易云唱片卡片。

## 本地预览

```powershell
python -m http.server 8000
```

打开 <http://localhost:8000/>。本站不保存也不校验 Space 密码；密码表单直接提交给 Space 的服务端鉴权接口。

## 配置与数据

- 站点地址集中在 `site-config.js`。
- 自定义封面、背景和音乐保存在浏览器本地，并可从设置面板完整导入导出。
- 开源图片和动画许可记录在 `assets/ATTRIBUTION.md` 与 `vendor/st-page-flip/LICENSE`。
