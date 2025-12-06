###############################
# 1) Stage — Build frontend
###############################
FROM node:22-alpine AS build

# Рабочая директория
WORKDIR /app

# Копируем package.json + lock
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем остальные файлы фронтенда
COPY . .

# Собираем проект (создаёт dist/)
RUN npm run build


###############################
# 2) Stage — Run with nginx
###############################
FROM nginx:alpine AS production

# Удаляем дефолтную конфигурацию nginx
RUN rm -rf /etc/nginx/conf.d/default.conf

# Копируем кастомный nginx.conf (ты должен его иметь в проекте)
COPY nginx.conf /etc/nginx/nginx.conf

# Копируем сборку фронтенда
COPY --from=build /app/dist /usr/share/nginx/html

# Открываем порт
EXPOSE 80

# Запускаем nginx
CMD ["nginx", "-g", "daemon off;"]
