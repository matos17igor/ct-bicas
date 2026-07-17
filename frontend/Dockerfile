# 1. Imagem leve do Node para buildar o React
FROM node:20-alpine

# 2. Pasta onde o app vai morar no contêiner
WORKDIR /usr/src/app

# 3. Copia e instala as dependências
COPY package*.json ./
RUN npm install

# 4. Copia o código do frontend
COPY . .

# 5. Avisa a porta padrão que o Vite usa no desenvolvimento
EXPOSE 5173

# 6. Comando para ligar o servidor de desenvolvimento do Vite
CMD ["npm", "run", "dev", "--", "--host"]