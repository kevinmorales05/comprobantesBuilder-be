# Usa una imagen base oficial que permite playwright
FROM node:20-bookworm

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

# Expone el puerto que utilizará la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "run", "start:prod"]
