FROM node:12.16.1-alpine
MAINTAINER hscode.vip
ENV NODE_ENV=production
ENV HOST 0.0.0.0
RUN mkdir -p /hscode
COPY . /hscode
WORKDIR /hscode
EXPOSE 9169
#此为cnpm淘宝镜像
RUN npm config set registry https://registry.npm.taobao.org
RUN npm install
RUN npm run build
CMD ["npm", "start"]