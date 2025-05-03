# build-stage
FROM --platform=linux/amd64 node:lts-alpine as build-stage
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
# 关键修改：确保构建输出到 dist/toivo 目录
RUN pnpm build && \
    mkdir -p /app/dist-toivo && \
    mv /app/dist/* /app/dist-toivo/

# production-stage
FROM nginx:stable-alpine
# 关键修改：复制到目标路径（不再嵌套）
COPY --from=build-stage /app/dist-toivo /usr/share/nginx/html/toivo
# 显式设置权限（防止403）
RUN chown -R nginx:nginx /usr/share/nginx/html/toivo
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]