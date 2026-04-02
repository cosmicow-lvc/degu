# degu
Proyecto Integrador Plataforma

BASE DE DATOS 

remplaza los datos de tu configuracion de base de datos con lo siguiente 

Replace the placeholders with your actual database credentials:

DATABASE_URL="postgresql://username:password@localhost:5432/mydb?schema=public"

username: Your PostgreSQL username
password: Your PostgreSQL password
localhost:5432: Your PostgreSQL host and port
mydb: Your database name

mas sobre la informacion de la configuracion inicial aqui: https://www.prisma.io/docs/prisma-orm/quickstart/postgresql

backend 

configuracion inicial aqui: https://docs.nestjs.com/first-steps

frontend:

configuracion inicial aqui: https://vite.dev/guide/

uso de docker:

1. para construir: docker-compose build --no-cache
2. para levantar: docker-compose up -d 
3. para bajarlo: docker-compose down -v