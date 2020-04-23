FROM node:12.16.2
MAINTAINER Ted
ENV TZ Asia/Shanghai
EXPOSE 3690
RUN useradd -b /home -m -s /bin/bash part
USER part
CMD [ "node", "/app/app.js" ]
