# Etapa 1: Instala dependencias y construye la aplicación
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Crea la imagen final de producción
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
# La API URL debe pasarse como una variable de entorno en el despliegue
ENV NEXT_PUBLIC_API_URL=

# Expone el puerto por defecto de Next.js
EXPOSE 3000
CMD ["npm", "start"]