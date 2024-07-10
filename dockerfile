
FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD [ "node", "app.js" ]
ENV POSTGRES_URL=postgresql://postgres.jlycnshtlrukiymtppel:7Vhdw7uwyb9jQHXj@aws-0-us-east-1.pooler.supabase.com:6543/postgres
