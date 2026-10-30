# 魔搭创空间部署说明

> 这个目录是**部署到魔搭创空间专用**的，包含了创空间需要的 `README.md`（含部署元数据）。
> 项目主目录的 `README.md`、`Dockerfile` 保持原样，这里只是额外补充一个文件。

---

## 部署方式

魔搭创空间有 4 种类型：`static`、`gradio`、`streamlit`、`docker`。

你的项目是 **Node.js + SQLite**，必须用 **`docker`** 类型。

---

## 第 0 步：准备

1. 在 [modelscope.cn](https://modelscope.cn) 注册（手机号即可）
2. **完成阿里云实名认证**（Docker 创空间的硬性要求）
3. 拿到 Access Token：[modelscope.cn/my/myaccesstoken](https://modelscope.cn/my/myaccesstoken)

---

## 第 1 步：创建 Docker 类型创空间

打开 https://modelscope.cn/studios/create

| 字段 | 填什么 |
|---|---|
| 所属账号 | 你的用户名 |
| 空间名称 | `personal-site` |
| 可见性 | 先选**私有**，验证正常后再改公开 |
| **SDK 类型** | **docker** |

创建后会得到一个空的 git 仓库地址。

---

## 第 2 步：准备要上传的文件

创空间的仓库根目录**必须包含**：

```
<创空间仓库根目录>
├── Dockerfile          ← 从项目根目录复制
├── .dockerignore       ← 从项目根目录复制
├── README.md           ← 用本目录下的这份（含 yaml 元数据）
├── package.json
├── package-lock.json
├── index.html
├── admin.html
├── public/
├── server/
├── src/
├── tsconfig*.json
└── vite.config.ts
```

**不要上传**：`node_modules/`、`dist/`、`data/`、`.git/`

> 构建在 Docker 里完成，所以不用本地 build。

---

## 第 3 步：配置密码（必须）

创空间 → 设置 → **环境变量** 或 **密钥**，添加两条：

| Key | Value |
|---|---|
| `ADMIN_PASSWORD` | 你定的后台密码（≥16 位） |
| `SESSION_SECRET` | 64 位随机串 |

> 不配置的话，容器会**拒绝启动**（生产环境安全校验）。

---

## 第 4 步：推送代码

在创空间仓库目录（把里面放好第 2 步的文件）执行：

```bash
git add -A
git commit -m "deploy personal site"
git push origin master
```

> 魔搭默认分支是 **`master`**，不是 `main`。

---

## 第 5 步：部署并查看状态

创空间页面点击 **部署**。然后看构建日志：

```bash
ms logs 你的用户名/personal-site --log-type build
```

构建大约 2–5 分钟（要装依赖 + 编译前端）。

---

## 第 6 步：访问

```
https://modelscope.cn/studios/你的用户名/personal-site
```

后台：

```
https://modelscope.cn/studios/你的用户名/personal-site/admin.html
```

---

## 已知限制

| 限制 | 说明 |
|---|---|
| **端口固定 7860** | Dockerfile 里已经设好 `ENV PORT=7860` |
| **免费实例会休眠** | 一段时间没人访问会停止，下次访问需要唤醒（几十秒） |
| **数据不持久** | 容器重建后 `data/site.db` 丢失，留言会清空 |
| **需要实名认证** | 阿里云账号实名是 Docker 创空间的前提 |

> 如果想要数据长期保存，需要挂载持久存储（魔搭创空间目前对免费用户的持久化支持有限），或者改用云服务器。

---

## 常见问题

**构建失败：`npm ci` 报错**
- 检查 `package-lock.json` 是否一起上传了
- Dockerfile 已配镜像源 `registry.npmmirror.com`

**启动失败：`[fatal] 生产环境必须设置 ADMIN_PASSWORD`**
- 忘了配环境变量，回第 3 步

**页面 404**
- 检查 `npm run build` 是否真的产出了 `dist/`，本地先跑一次 `npm run build` 确认

**访问慢**
- 免费实例冷启动，首次访问需要 30–60 秒唤醒