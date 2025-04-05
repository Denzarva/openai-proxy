FROM node:18
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 8787
CMD ["npm", "start"]
