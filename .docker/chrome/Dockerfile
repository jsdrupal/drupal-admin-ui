FROM alpine:3.8

RUN apk add bind-tools chromium chromium-chromedriver

CMD [ "sh", "-c", "chromedriver --whitelisted-ips=$(host node | sed 's/node has address //g')" ]
