FROM centos:7

RUN mkdir /app

WORKDIR /app

ADD . .

EXPOSE 80

RUN yum install -y epel-release
RUN yum install -y npm nodejs
RUN npm install


CMD ["node","result.js"]

