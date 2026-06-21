# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies (including devDependencies)
RUN npm ci

COPY . .

# Generate Prisma Client & compile TypeScript to JS
RUN npx prisma generate
RUN npm run build

# Stage 2: Production
FROM node:18-alpine AS runner

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy compiled files and prisma output from builder stage
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /usr/src/app/node_modules/@prisma ./node_modules/@prisma

EXPOSE 4000

ENV NODE_ENV=production

CMD ["node", "dist/src/main.js"]
