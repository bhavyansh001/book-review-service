# Frontend Dockerfile for React + Vite + Nginx
FROM node:20 AS build
WORKDIR /app
COPY package.json ./
COPY package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build

# Production image: nginx to serve static files
FROM nginx:1.25-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
