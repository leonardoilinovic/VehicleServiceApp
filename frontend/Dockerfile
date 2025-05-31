# VehicleServiceApp/frontend/Dockerfile

# Stage 1: Build the React application
FROM node:18-alpine as build-stage

WORKDIR /app

# Copy package.json and package-lock.json (since you use npm)
COPY package.json package-lock.json ./

# Install dependencies using npm
RUN npm install --frozen-lockfile

# Copy the rest of your application code
COPY . .

# !!! KLJUČNA PROMJENA OVDJE (potvrdi da je ovo prisutno) !!!
# Add an ARG for the build-time environment variable (from docker-compose.yml)
ARG REACT_APP_API_URL_BUILD

# Set the environment variable for the application (runtime)
# React aplikacija će vidjeti ovo kao process.env.REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL_BUILD}

# Build the React app for production
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine as production-stage

# Copy the built React app to Nginx's web root
COPY --from=build-stage /app/build /usr/share/nginx/html

# Copy the nginx.conf from the frontend root directly
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (where Nginx listens inside the container)
EXPOSE 80

# Command to start Nginx
CMD ["nginx", "-g", "daemon off;"]