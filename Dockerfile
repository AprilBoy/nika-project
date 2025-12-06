
# Production stage with nginx - copy pre-built application
FROM nginx:alpine AS production

# Copy pre-built application from local dist directory
COPY dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
