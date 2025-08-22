FROM node:20-alpine as builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build


FROM nginx:stable-alpine

COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80