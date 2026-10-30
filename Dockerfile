# 魔搭创空间 Docker 镜像
# 多阶段构建：先在 builder 里装依赖并打包前端，运行镜像里只保留产物和 Node 运行时

# ---------- 构建阶段 ----------
FROM node:22-slim AS builder

WORKDIR /build

# 先只复制依赖清单，利用 Docker 层缓存：代码变了不用重装依赖
COPY package.json package-lock.json ./
RUN npm ci --registry=https://registry.npmmirror.com

# 再复制源码并构建
COPY . .
RUN npm run build

# ---------- 运行阶段 ----------
FROM node:22-slim

WORKDIR /app

# 运行时需要 Node 22（内置 node:sqlite），无需额外安装数据库
COPY --from=builder /build/dist ./dist
COPY --from=builder /build/server ./server
COPY --from=builder /build/package.json ./package.json

# 数据目录（SQLite 文件）。创空间重启后容器会重建，数据不保留
RUN mkdir -p /app/data

# 魔搭要求 Docker 类型的服务监听 7860 端口
ENV PORT=7860
ENV HOST=0.0.0.0
ENV NODE_ENV=production
# 数据放 /tmp 之外的持久位置，容器内任意可写目录即可
ENV DATA_DIR=/app/data

# 启动前必须通过环境变量/密钥提供：
#   ADMIN_PASSWORD  后台登录密码
#   SESSION_SECRET  Cookie 签名密钥

EXPOSE 7860

CMD ["node", "server/app.mjs"]