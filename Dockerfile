FROM node:18-alpine as base

# Create App Directory
WORKDIR /usr/src/app

FROM base as deps

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# RUN npm install
# If you are building your code for production
RUN npm ci --omit=dev

FROM base as runner

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . . 

EXPOSE 8080

CMD ["node", "index.js"]