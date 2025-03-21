# Orders Hub - Sistema de Gerenciamento de Pedidos

Orders Hub é um sistema moderno de gerenciamento de pedidos construído com arquitetura distribuída, oferecendo alta disponibilidade, escalabilidade e monitoramento em tempo real. O sistema permite gerenciar o ciclo de vida completo dos pedidos, desde a criação até a finalização, com notificações em tempo real e um dashboard analítico avançado.

## Tecnologias Principais

### Frontend:
  - Framework: React 18 com TypeScript
  - Build Tool: Vite
  - UI/Estilização: Tailwind CSS 4 + Framer Motion
  - Gráficos: Recharts
  - Estado e Comunicação: Axios, SignalR Client
  - Servidor Web: Nginx (servindo arquivos estáticos com configuração otimizada)

### Backend:
  - Framework: ASP.NET Core 8
  - Arquitetura: Clean Architecture com CQRS
  - ORM: Entity Framework Core 8
  - Comunicação em Tempo Real: SignalR
  - Cache Distribuído: Redis
  - Mensageria: RabbitMQ
  - Banco de Dados: PostgreSQL
  - API Documentation: Swagger/OpenAPI

### DevOps e Monitoramento:
  - Containerização: Docker & Docker Compose
  - Métricas: Prometheus
  - Monitoramento de Serviços: Health Checks integrados
  - Análise de Desempenho: Métricas personalizadas, histogramas e contadores

## Estrutura do Projeto

```
/orders-hub
├── frontend/                      # Aplicação React
│   ├── src/                       # Código fonte
│   │   ├── components/            # Componentes React reutilizáveis
│   │   ├── context/               # React Context para gerenciamento de estado
│   │   ├── hooks/                 # Hooks personalizados
│   │   ├── pages/                 # Páginas/Rotas da aplicação
│   │   ├── services/              # Serviços de API e comunicação
│   │   └── utils/                 # Funções utilitárias
│   ├── Dockerfile                 # Configuração de build do frontend
│   └── nginx.conf                 # Configuração do Nginx
│
├── backend/                       # API ASP.NET Core
│   ├── OrdersAPI/                 # Solução principal
│   │   ├── OrdersAPI.API/         # API principal (Controllers, Middleware)
│   │   ├── OrdersAPI.Core/        # Domínio, Entidades e Interfaces
│   │   ├── OrdersAPI.Application/ # Casos de uso e lógica de negócio
│   │   ├── OrdersAPI.Infrastructure/ # Implementações de repositório, cache, etc.
│   │   └── OrdersAPI.Seeder/      # Geração de dados de teste
│   └── Dockerfile                 # Configuração de build do backend
│
├── docker-compose.yml             # Orquestração de containers
├── prometheus.yml                 # Configuração do Prometheus
└── README.md                      # Documentação do projeto
```

## Funcionalidades Principais

### Gestão de Pedidos:
  - Criação, visualização, edição e exclusão de pedidos
  - Filtros avançados e ordenação
  - Atualização de status com histórico de alterações

### Notificações em Tempo Real:
  - Notificações instantâneas para alterações de pedidos usando SignalR
  - Sistema de toasts para alertas do usuário
  - Indicadores visuais de status

### Dashboard Analítico:
  - Visualização de métricas chave de negócio
  - Gráficos de tendências e distribuição
  - Estatísticas de pedidos por status, cliente e produto
  - Comparativos com períodos anteriores (diário, mensal, anual)

### Monitoramento e Performance:
  - Métricas detalhadas de performance do sistema
  - Status de todos os serviços (API, Redis, RabbitMQ)
  - Monitoramento de uso de CPU, memória e cache
  - Taxa de sucesso de requisições

## Arquitetura Detalhada

### Fluxo de Dados

1. O cliente interage com a interface React
2. Requisições são enviadas à API ASP.NET Core
3. A API processa os dados, utilizando cache quando apropriado
4. Mudanças de estado são persistidas no PostgreSQL
5. Notificações são enviadas via SignalR para clientes conectados
6. Operações assíncronas são enfileiradas no RabbitMQ para processamento

### Cache Distribuído (Redis)
  - Armazenamento de resultados frequentes de consultas
  - Cache de dashboard por 30 minutos
  - Cache de detalhes de pedidos
  - Estratégias de invalidação por padrão

### Mensageria (RabbitMQ)
  - Processamento assíncrono de pedidos
  - Enfileiramento de notificações
  - Padrão publish/subscribe para eventos do sistema

### Monitoramento (Prometheus)
  - Coleta de métricas personalizadas:
    - Pedidos processados (total, por status, por tipo)
    - Tempo de processamento de pedidos
    - Uso de cache (hit rate, miss rate)
    - Performance da API (tempo de resposta, taxa de sucesso)
    - Conexões de banco de dados (ativas, idle, total)
    - Uso de recursos do sistema (CPU, memória)

## Endpoints da API

### Pedidos
  - ```GET /api/orders``` - Lista todos os pedidos com filtros
  - ```GET /api/orders/{id}``` - Obtém detalhes de um pedido específico
  - ```POST /api/orders``` - Cria um novo pedido
  - ```PUT /api/orders/{id}``` - Atualiza um pedido existente
  - ```DELETE /api/orders/{id}``` - Remove um pedido

### Dashboard
  - ```GET /api/dashboard/summary``` - Obtém resumo do dashboard com filtros

### Performance
  - ```GET /api/performance/status``` - Status e métricas do sistema
  - ```GET /api/metrics``` - Endpoint Prometheus para coleta de métricas

### Autenticação
  - ```POST /api/auth/login``` - Autenticação de usuários
  - ```POST /api/auth/register``` - Registro de novos usuários

### Health Check
  - ```GET /health``` - Status de saúde de todos os serviços

## Componentes do Frontend

### Páginas Principais
  - Dashboard - Visão geral com métricas e gráficos
  - OrdersList - Lista paginada de pedidos com filtros
  - OrderDetail - Visualização e edição de um pedido
  - PerformancePage - Monitoramento do sistema em tempo real
  - Authentication - Login e registro

### Componentes Reutilizáveis
  - KPICard - Cards para métricas de performance
  - StatusIndicator - Indicador visual de status de serviços
  - MetricsChart - Gráficos para visualização de dados
  - Notifications - Sistema de toasts para alertas

## Configuração do Docker

O sistema utiliza Docker Compose para orquestrar todos os serviços necessários:

```yaml
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "5000:80"
    depends_on:
      - postgres
      - redis
      - rabbitmq
    environment:
      - ConnectionStrings__DbConnection=Host=postgres;Database=ordersdb;Username=postgres;Password=postgres
      - Redis__ConnectionString=redis:6379,password=admin
      - RabbitMQ__Host=rabbitmq
      - RabbitMQ__Username=guest
      - RabbitMQ__Password=guest

  postgres:
    image: postgres:14
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=ordersdb
    volumes:
      - postgres-data:/var/lib/postgresql/data

  redis:
    image: redis:7
    ports:
      - "6379:6379"
    command: redis-server --requirepass admin
    volumes:
      - redis-data:/data

  redis-commander:
    image: rediscommander/redis-commander
    ports:
      - "8081:8081"
    environment:
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - REDIS_PASSWORD=admin

  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "5672:5672"
      - "15672:15672"
    environment:
      - RABBITMQ_DEFAULT_USER=guest
      - RABBITMQ_DEFAULT_PASS=guest
    volumes:
      - rabbitmq-data:/var/lib/rabbitmq

  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus

volumes:
  postgres-data:
  redis-data:
  rabbitmq-data:
  prometheus-data:
```

### Configuração do Prometheus

O Prometheus coleta métricas de todos os serviços a cada 15 segundos

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s
  scrape_timeout: 10s

scrape_configs:
  - job_name: 'webapp'
    metrics_path: '/metrics'
    static_configs:
      - targets: ['backend:80']
    scrape_interval: 5s
    scrape_timeout: 4s
    scheme: http
    tls_config:
      insecure_skip_verify: true

  - job_name: 'nginx'
    static_configs:
      - targets: ['frontend:80']
    scrape_interval: 10s
    scrape_timeout: 5s

  - job_name: 'redis'
    static_configs:
      - targets: ['redis-exporter:9121']
    scrape_interval: 10s
    scrape_timeout: 5s

  - job_name: 'rabbitmq'
    static_configs:
      - targets: ['rabbitmq:15692']
    scrape_interval: 10s
    scrape_timeout: 5s

  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres-exporter:9187']
    scrape_interval: 10s
    scrape_timeout: 5s
```

### Configuração do Nginx

O Nginx otimiza a entrega dos arquivos estáticos do frontend:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Compressão gzip
    gzip on;
    gzip_comp_level 5;
    gzip_min_length 256;
    gzip_proxied any;
    gzip_types
        application/javascript
        application/json
        text/css
        text/plain;

    # Cache de arquivos estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # Rota principal
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Redirecionamento para a API
    location /api/ {
        proxy_pass http://backend/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Configuração para SignalR
    location /api/notifications {
        proxy_pass http://backend/api/notifications;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Métricas de Performance

O sistema coleta e monitora diversas métricas de performance:

- **Pedidos**:
  - Total de pedidos processados
  - Tempo médio de processamento
  - Distribuição por status

- **API**:
  - Taxa de sucesso de requisições
  - Tempo de resposta
  - Requisições em andamento

- **Cache**:
  - Taxa de acerto (Hit Rate)
  - Taxa de erro (Miss Rate)
  - Total de hits e misses

- **Banco de Dados**:
  - Conexões ativas
  - Conexões ociosas
  - Total de conexões

- **Recursos do Sistema**:
  - Uso de CPU
  - Uso de memória
  - Status de serviços (API, Redis, RabbitMQ)

## Execução do Projeto

### Pré-requisitos
- Docker e Docker Compose
- Mínimo de 4GB de RAM disponível
- Portas 3000, 5000, 6379, 5432, 8081, 15672 e 9090 livres

### Comandos

```bash

docker-compose up -d


docker-compose logs -f


Frontend: http://localhost:3000
API Swagger: http://localhost:5000/swagger
Redis Commander: http://localhost:8081
RabbitMQ Management: http://localhost:15672
Prometheus: http://localhost:9090

docker-compose down
```

## Considerações de Segurança

- Autenticação JWT implementada
- Redis protegido por senha
- RabbitMQ com credenciais seguras
- CORS configurado apropriadamente
- Validação de entrada em todas as APIs
- Proteção contra ataques comuns (XSS, CSRF)

## Oportunidades de Melhoria

- Implementação de Grafana para visualização avançada de métricas
- Adição de testes automatizados (unitários, integração, E2E)
- Implementação de CI/CD pipeline
- Escalabilidade horizontal para componentes-chave
- Implementação de tracing distribuído com Jaeger ou Zipkin

---

Este projeto demonstra uma arquitetura completa e moderna para sistemas empresariais, com foco em desempenho, escalabilidade e experiência do usuário.
