# Recipe Realm Frontend

**Recipe Realm** is a web application that helps users discover and organize food recipes. This frontend repository is designed to interact with the [Recipe Realm Backend](https://github.com/bertrandhaine/recipe-realm-backend), ensuring a seamless recipe management experience.

## Features

- **Browse Recipes**: Users can explore all available recipes on the platform.
- **Create Custom Lists**: Users can create personalized lists to organize recipes according to their preferences.
- **Manage Recipes in Lists**: Users can add recipes to their lists or remove them as needed.
- **View Custom Lists**: Users can view their curated lists of recipes anytime.

## Technologies Used

- **Vue.js**: A progressive JavaScript framework used to build the frontend user interface.
- **Pinia**: State management library used with Vue.js to manage the state across the frontend application.
- **Vite**: A modern frontend build tool that provides a faster and leaner development experience for modern web projects.
- **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs.
- **Shadcn-Vue**: A component library that provides ready-to-use components that are easy to customize and extend.

## Prerequisites

Before running this project, make sure to set up the backend component. It should be running locally on the default port `3000`. Follow the setup instructions on the [backend repository](https://github.com/bertrandhaine/recipe-realm-backend).

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/bertrandhaine/recipe-realm-frontend.git
   ```
2. Ensure Node.js is installed on your system:
   ```bash
   npm install npm@latest -g
   ```
3. Navigate to the project directory and install dependencies:
   ```bash
   cd recipe-realm-frontend
   npm install
   ```
4. Configure environment variables:
   - Copy the `.env.example` file to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Open the `.env` file and set `VITE_BASE_API_URL` to the backend server URL:
     ```bash
     VITE_BASE_API_URL=http://localhost:3000/api
     ```
5. Run the application:
   ```bash
   npm run dev
   ```

## Deployment

For deployment, ensure that all environment variables and production settings are correctly configured. Use a server like Nginx to serve the static files and proxy backend requests.

## Authors

- **Bertrand Uemura Haine**

## License

This project is licensed under the MIT License.
