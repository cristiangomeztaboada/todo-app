# Etapa 1: Instalar dependencias
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# Etapa 2: Construir la aplicación
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Etapa 3: Ejecutar la aplicación en producción
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
# Copiar archivos de construcción
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# Exponer el puerto
EXPOSE 3001
CMD ["node", "server.js"]