# Kotori Homepage

公开的个人 Homepage。站点保留日系画册和翻书封面，并提供博客随笔、项目一览、外部链接、公共音乐和 `/editor/` 综合内容编辑器。

## 本地构建与预览

```powershell
npm install --cache .npm-cache
npm run editor
```

打开 <http://localhost:8000/>。本地编辑器位于 <http://localhost:8000/editor/>。`npm run editor` 同时提供仅限本机的网易云歌曲信息代理，因此粘贴歌曲链接后可以自动填写曲名、歌手并下载封面。线上 GitHub Actions 使用 `npm run build`，不会把编辑器、编辑器入口或本地代理部署到公开网站。

## 公开内容

- `content/site.json`：Hero、简介、兴趣、外部链接和公共默认视觉。
- `content/projects.json`：手选的公开项目。
- `content/music.json`：所有访客共用的网易云曲目。
- `content/posts/*.md`：博客 Markdown；`draft: true` 不会公开。
- `assets/uploads/`：编辑器上传并压缩后的公共素材。

所有公开内容均通过本地 `/editor/` 管理。编辑器草稿保存在 IndexedDB；发布时需要每次粘贴一个仅授权 `Kotori-cjk/Kotori-cjk.github.io`、具有 `Contents: read/write` 的 fine-grained token。令牌只存在页面内存，不写入浏览器存储、URL、日志或仓库。

发布前编辑器会检查远程 `main` 是否变化，并通过 Git blobs/trees/commits/refs API 将全部修改作为一个 commit 写入。远程分支变化时会拒绝覆盖。

## 个人外观

访问者自己的封面和背景继续保存在当前浏览器的 IndexedDB，并可导入导出。这些个人设置不会改变其他访客看到的公共默认内容。

## 部署故障排查

1. 在仓库 Settings → Pages 中将 Source 设为 **GitHub Actions**。
2. 检查 `Deploy Homepage` workflow 的 build 与 deploy job。
3. 构建失败时先在本地运行 `npm ci` 和 `npm run build`。
4. 深层文章地址为 `/blog/<slug>/`；不要手动编辑 `dist/`。
