FROM node
WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node
WORKDIR /usr/app
COPY package*.json ./
RUN npm install --production
COPY --from=0 /usr/app/dist ./dist

EXPOSE 3000
ENV NODE_ENV production
CMD node ./dist/index.js
USER node

