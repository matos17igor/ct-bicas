# 1. Imagem oficial do Node.js com Linux (alpine)
FROM node:20-alpine

# 2. Cria e define a pasta onde o projeto vai morar dentro do contêiner
WORKDIR /usr/src/app

# 3. Copia os arquivos de dependências para dentro do contêiner
COPY package*.json ./

# 4. Instala todas as dependências do projeto
RUN npm install

# 5. Copia o restante dos arquivos do seu projeto (código, prisma, etc.)
COPY . .

# 6. Gera o cliente do Prisma baseado no seu schema (fundamental para o backend funcionar)
RUN DATABASE_URL="postgres://fake:fake@localhost:5432/fake" npx prisma generate

# 7. Avisa que o contêiner vai abrir a porta 3000 (a mesma usada no Express e no frontend)
EXPOSE 3000

# 8. O comando que liga a API
CMD ["npm", "run", "dev"]