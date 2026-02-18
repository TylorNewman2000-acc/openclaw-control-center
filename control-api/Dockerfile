FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev
COPY src ./src
EXPOSE 8780
ENV CONTROL_API_PORT=8780
CMD ["node", "src/server.js"]
