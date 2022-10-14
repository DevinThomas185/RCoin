FROM node:alpine as build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build . 
ENTRYPOINT ["nginx", "-g", "daemon off;"]