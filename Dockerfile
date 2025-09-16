# Etapa 1: Instala dependencias y construye la aplicación
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .

# Acepta el argumento de construcción para la variable de entorno
ARG NEXT_PUBLIC_API_URL

# Establece la variable de entorno para el paso de construcción
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build

# Etapa 2: Crea la imagen final de producción
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
# La variable de entorno ya está seteada desde la etapa 1
# La variable es accesible en tiempo de ejecución
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

EXPOSE 3000
CMD ["npm", "start"]