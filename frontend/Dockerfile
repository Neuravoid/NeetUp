FROM node:20-alpine

WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm ci --silent

# Copy source
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
