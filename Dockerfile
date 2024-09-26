# Usa una imagen base oficial que permite playwright
FROM node:20-bookworm

# Configurar variables de entorno
# Define argumentos de construcción
ARG NODE_ENV
ARG APIKEY_BREVO
ARG URL_BREVO

# Configurar variables de entorno usando ARG
ENV NODE_ENV=${NODE_ENV}
ENV APIKEY_BREVO: ${APIKEY_BREVO}
ENV URL_BREVO: ${URL_BREVO}

RUN npx -y playwright@1.47.2 install --with-deps

# Crea un directorio de trabajo
WORKDIR /app

# Copia los archivos en el proyecto
COPY package*.json ./
COPY . .

# Instala las dependencias de la aplicación
RUN npm install

# Compila la aplicación NestJS
RUN npm run build

# Install Playwright browsers
RUN npx playwright install

# Expone el puerto que utilizará la aplicación
EXPOSE ${PORT}

# Comando para iniciar la aplicación
CMD ["npm", "run", "start:prod"]
