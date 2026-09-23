FROM node:24-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM dependencies AS generated
COPY prisma.config.mjs ./
COPY prisma ./prisma
RUN DATABASE_URL="postgresql://unused:unused@localhost:5432/unused" npm run db:generate

FROM generated AS development
COPY src ./src
COPY test ./test
EXPOSE 4000
CMD ["npm", "run", "dev"]

FROM node:24-alpine AS production
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev --omit=peer --legacy-peer-deps
COPY --from=generated /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=generated /app/node_modules/.prisma ./node_modules/.prisma
COPY src ./src
USER node
EXPOSE 4000
CMD ["npm", "start"]
