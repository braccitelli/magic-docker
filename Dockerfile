FROM ubuntu:16.10

MAINTAINER Magic.BGV Devteam

ENV TOMCAT_VERSION 8.0.39

# Set locales
RUN locale-gen en_GB.UTF-8
ENV LANG en_GB.UTF-8
ENV LC_CTYPE en_GB.UTF-8

# Fix sh
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Install dependencies
RUN apt-get update && \
apt-get install -y git build-essential curl wget software-properties-common && apt-get install -y apache2 && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN \
add-apt-repository -y ppa:webupd8team/java && \
apt-get update && \
apt-get install -y nodejs && \
apt-get install -y npm

#Configure Nodejs
RUN mkdir /home/magicbgv
WORKDIR /home/magicbgv
COPY * /home/magicbgv/

RUN /bin/bash -c "ln -s /usr/bin/nodejs /usr/local/bin/node"

RUN npm init -y && \
npm install express --save && \
npm install node-gyp --save && \
npm install nodemon --save && \
npm install simple-git --save && \
npm install dateformat --save

ENV APACHE_RUN_USER www-data
ENV APACHE_RUN_GROUP www-data
ENV APACHE_LOG_DIR /var/log/apache2
ENV APACHE_LOCK_DIR /var/lock/apache2
ENV APACHE_PID_FILE /var/run/apache2.pid
ENV APACHE_RUN_DIR /var/run/apache2

EXPOSE 3000
EXPOSE 3001
CMD ["/bin/bash", "./start.sh"]