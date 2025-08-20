FROM node:20-alpine

WORKDIR /scr

COPY . . 

RUN npm install
RUN npx prisma generate
RUN npm run build

EXPOSE 5000

CMD ["node", "dist/index.js"]