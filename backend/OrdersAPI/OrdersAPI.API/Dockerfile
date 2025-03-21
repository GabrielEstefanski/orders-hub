# Etapa de Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copia a solução e os arquivos .csproj dos projetos ANTES de restaurar as dependências
COPY OrdersAPI.sln ./
COPY OrdersAPI/OrdersAPI.API/OrdersAPI.API.csproj ./OrdersAPI/OrdersAPI.API/
COPY OrdersAPI/OrdersAPI.Core/OrdersAPI.Core.csproj ./OrdersAPI/OrdersAPI.Core/
COPY OrdersAPI/OrdersAPI.Infrastructure/OrdersAPI.Infrastructure.csproj ./OrdersAPI/OrdersAPI.Infrastructure/
COPY OrdersAPI/OrdersAPI.Application/OrdersAPI.Application.csproj ./OrdersAPI/OrdersAPI.Application/
COPY OrdersAPI/OrdersAPI.Seeder/OrdersAPI.Seeder.csproj ./OrdersAPI/OrdersAPI.Seeder/

# Restaura as dependências da solução
RUN dotnet restore OrdersAPI.sln

# Copia o restante dos arquivos da aplicação (agora com o código-fonte)
COPY OrdersAPI/OrdersAPI.API ./OrdersAPI/OrdersAPI.API/
COPY OrdersAPI/OrdersAPI.Core ./OrdersAPI/OrdersAPI.Core/
COPY OrdersAPI/OrdersAPI.Infrastructure ./OrdersAPI/OrdersAPI.Infrastructure/
COPY OrdersAPI/OrdersAPI.Application ./OrdersAPI/OrdersAPI.Application/
COPY OrdersAPI/OrdersAPI.Seeder ./OrdersAPI/OrdersAPI.Seeder/

RUN dotnet publish OrdersAPI/OrdersAPI.API/OrdersAPI.API.csproj -c Release -o /app/publish
RUN dotnet publish OrdersAPI/OrdersAPI.Seeder/OrdersAPI.Seeder.csproj -c Release -o /app/publish/seeder
RUN mkdir -p /app/wwwroot/uploads/profiles

# Etapa de Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

RUN mkdir -p /app/uploads/profiles

# Copia os arquivos compilados da etapa de build
COPY --from=build /app/publish .

# Expõe a porta da API
EXPOSE 5000

# Comando de inicialização
ENTRYPOINT ["dotnet", "OrdersAPI.API.dll"]
