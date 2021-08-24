FROM node:14.17

RUN mkdir /backend
ADD . /backend
WORKDIR /backend
RUN npm config set registry http://registry.npmjs.org/
RUN npm install
RUN npm run build
ENTRYPOINT ["npm", "run", "start:prod"]

