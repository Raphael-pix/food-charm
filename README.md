# Food Charm

## About

Food Charm is a cooking platform designed to help users discover and create recipes, watch cooking videos, and personalize their culinary experience. With features like AI-powered recipe modifications, ingredient-based suggestions, and a user-friendly notification system, Food Charm aims to make cooking enjoyable and accessible for everyone.

## Table of Contents

- Food charm
  - [About](#about)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Technology Stack](#technology-stack)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the Application](#running-the-application)
  - [API Documentation](#api-documentation)
  - [Frontend Structure](#frontend-structure)
  - [Database Schema](#database-schema)
  - [Testing](#testing)
  - [Deployment](#deployment)
  - [Contributing](#contributing)
  - [Privacy](#privacy)
  - [License](#license)

## Features

- **Recipe Discovery**: Access a library of recipes and cooking videos from around the world.
- **Personalized Recipes**: Create and save personalized recipes tailored to your tastes and dietary needs.
- **Recipe Creation**: Create and share your own recipes, complete with step-by-step instructions.
- **What's in Your Fridge?**: Input ingredients you have on hand to receive suitable recipe suggestions.
- **AI Recipe Modification**: Modify recipes based on your preferences, servings, and ingredient availability with -AI assistance.
- **Recipe Saving**: Save your favorite recipes for easy access anytime.
- **User Profiles**: Create, view, and update your profile with personal preferences and saved content.
- **Notification System**: Stay updated with new recipes, personalized suggestions, and content updates.

## Technology Stack

- **Design**: Figma
- **Backend**: Node.js with Express.js
- **Frontend**: React.js
- **Database**: Appwrite
- **API**: RESTful API

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)
- Git
- spoonacular account
- Appwrite account
- Gemini API key

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Raphael-pix/food-charm.git
```

2. Install backend dependencies:

   ```bash
   cd server

   npm install
   ```

3. Install frontend dependencies:
    ```bash
    cd /

   npm install
   ```

## Configuration

1. Backend configuration:

- Create a `.env` file in the `server` directory
- Add the following environment variables:
  ```
  SPOONACULAR_API_KEY = "your_spoonacular_api_key"
  SPOONACULAR_BASE_URL = "https://api.spoonacular.com"
  GEMINI_API_KEY = "your_gemini_api_key"
  PORT = 5000
  ```

1. Frontend configuration:

- Update the API base URL in `/lib/config.js` if necessary

## Running the Application

1. Ensure the Appwrite service is running.

2. Run the backend server:

   ```bash
   cd sever

   npm run start
   ```

3. In a new terminal, run the frontend development server:

   ```bash
   cd /

   npx expo start
   ```

4. Access the application at using Expo Go

## API Documentation

API documentation will be available at `http://localhost:5000/api-docs` when the backend server is running.

## Frontend Structure

Designs for the user interface are available at `https://www.figma.com/design/bHWunlRH0mewHpvAJVNBW7/Food-Recipe-App-(Community)?node-id=0-1&t=CDxfXJmDVcynY5Vg-1`.

The React.js frontend is organized as follows:

- `/components`: Reusable React Native components
- `app`: Page-level React Native components
- `/context`: React store for state management
- `/assets`: Static assets like images and global styles
- `/lib`: Fucntions and other data

## Database Schema

Key Appwrite collections:

- Users
- Recipes
- Videos


## Testing

- Run backend tests: `cd server && npm run test`
- Run frontend tests: `cd / && npm run test:unit`

## Deployment

Deployment instructions for various platforms:

1. Heroku:

- Install the Heroku CLI
- Run `heroku create`
- Set environment variables: `heroku config:set NODE_ENV=production`
- Push to Heroku: `git push heroku main`

2. DigitalOcean:

- Create a droplet
- SSH into your droplet
- Clone the repository and follow the installation steps
- Use PM2 to manage the Node.js process

Detailed deployment guides for other platforms can be found in `DEPLOYMENT.md`.

## Contributing

We welcome contributions from the community. Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Privacy

We take user privacy seriously. Please review our [Privacy Policy](PRIVACY.md) for information on how we protect and use your data.

## License

Food charm is licensed under the [MIT License](LICENSE.md).
om.

Join Food charm today and be part of a community that understands and supports the beautiful journey of motherhood!

NOTE!
The current version of Food charm is yet to be completed.