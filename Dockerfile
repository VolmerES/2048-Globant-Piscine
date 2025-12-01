FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

# Copiamos todos los archivos del proyecto al directorio que sirve Nginx
COPY . /usr/share/nginx/html

#puerto 80
