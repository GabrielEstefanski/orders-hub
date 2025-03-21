FROM node:20-alpine

WORKDIR /app

# Copiar apenas os arquivos necessários primeiro
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Instalar dependências
RUN npm install -g pnpm
RUN pnpm install

# Copiar o resto dos arquivos
COPY . .

# Construir a aplicação
RUN pnpm run build

# Copiar os arquivos estáticos para o diretório correto
RUN mkdir -p /usr/share/nginx/html && \
    cp -r dist/* /usr/share/nginx/html/ && \
    cp -r public/* /usr/share/nginx/html/

# Manter o container rodando
CMD ["tail", "-f", "/dev/null"]
