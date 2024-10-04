# Usa una imagen base oficial que permite playwright
FROM node:20-bookworm

# Configurar variables de entorno
# Define argumentos de construcción
ARG NODE_ENV
ARG APIKEY_BREVO
ARG URL_BREVO

# Configurar variables de entorno usando ARG
ENV NODE_ENV=${NODE_ENV}
ENV APIKEY_BREVO=${APIKEY_BREVO}
ENV URL_BREVO=${URL_BREVO}

# get playright
RUN npx -y playwright@1.47.2 install --with-deps

# Asegurarse de que los permisos sean correctos para el directorio de Playwright
RUN chmod -R 755 /root/.cache/ms-playwright
RUN chmod -R 755 /root/.cache/ms-playwright/chromium-1134 

RUN echo "root folders"
RUN ls -al

# Check where Playwright installed the browsers
RUN echo "Checking Playwright installation path..." \
    && find / -type d -name "ms-playwright" -print \
    && ls -al /root/.cache/ms-playwright

# Update npm to the latest version
RUN npm install -g npm@latest
# get playright
# RUN npx -y playwright@1.47.2 install --with-deps
#PLAYWRIGHT_BROWSERS_PATH=/root/.cache/ms-playwright/chromium-1134
RUN echo "This is the /root directory"
RUN ls -al /root/.cache/ms-playwright && ls -al /root/.cache/ms-playwright/chromium-1134

# Crea un directorio de trabajo
WORKDIR /app

# Copia los archivos en el proyecto
COPY package*.json ./
COPY . .

# Set environment variables to ensure Playwright uses the correct cache path
ENV PLAYWRIGHT_BROWSERS_PATH=${PLAYWRIGHT_PATH}

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
