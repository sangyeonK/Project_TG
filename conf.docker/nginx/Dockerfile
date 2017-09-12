FROM nginx:latest

MAINTAINER sangyeon <sovietist@hotmail.com>

COPY nginx.conf /etc/nginx/
COPY cors.conf /etc/nginx/
COPY robots.txt /usr/share/nginx/html/
COPY docker.entrypoint /docker.entrypoint
COPY ssl /etc/nginx/ssl

RUN apt-get update && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /etc/nginx/conf.d/default.conf && \
    chmod +x /docker.entrypoint/run.sh

EXPOSE 80/tcp 443/tcp 8080/tcp

WORKDIR /docker.entrypoint

ENTRYPOINT ["/docker.entrypoint/run.sh"]

CMD ["nginx"]