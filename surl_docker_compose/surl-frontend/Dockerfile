FROM node:14 AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --force
RUN npm ci
COPY . .
ENV REACT_APP_front_url "http://localhost:3000"
ENV REACT_APP_back_url "http://localhost:4000"
RUN npm run build

FROM nginx:1.21

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf


EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]

