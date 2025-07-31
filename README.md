# Seven Alpha E-commerce Platform

A full-featured e-commerce platform built with Node.js, Express, PostgreSQL, and Sequelize.

## Features

- **User Authentication**
  - JWT-based authentication
  - Google OAuth integration
  - Password reset functionality
  - Email verification

- **Product Management**
  - Add, update, delete products
  - Product categories
  - Product search and filtering
  - Product visibility control

- **Shopping Experience**
  - Shopping cart functionality
  - Wishlist management
  - Coupon system
  - Order tracking

- **Payment Processing**
  - Secure Stripe integration
  - Multiple payment methods
  - Order confirmation emails

- **Admin Panel**
  - User management
  - Order management
  - Product management
  - Sales analytics

## Tech Stack

- **Backend**: Node.js, Express
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT, Passport.js with Google OAuth
- **Payment**: Stripe API
- **Email**: Nodemailer
- **Frontend**: HTML, CSS, JavaScript (Frontend connection via Fetch API)

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd seven-alpha
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Copy the `.env.example` file to `.env` and update the values:

```bash
cp .env.example .env
```

4. **Set up the database**

Create a PostgreSQL database and update the database configuration in your `.env` file.

5. **Run database migrations**

```bash
npm run migrate
```

6. **Start the development server**

```bash
npm run dev
```

The server will start on the port specified in your `.env` file (default: 5000).

## API Documentation

The API endpoints are organized as follows:

- **Authentication**: `/api/auth/*`
- **Users**: `/api/users/*`
- **Products**: `/api/products/*`
- **Categories**: `/api/categories/*`
- **Cart**: `/api/cart/*`
- **Orders**: `/api/orders/*`
- **Payment**: `/api/payment/*`
- **Wishlist**: `/api/wishlist/*`
- **Coupons**: `/api/coupons/*`
- **Admin**: `/api/admin/*`

Detailed API documentation can be tested using Postman.

## Deployment

The application can be deployed using the following platforms:

### Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the build command: `npm install`
4. Set the start command: `npm start`
5. Add environment variables from your `.env` file

### Railway

1. Create a new project on Railway
2. Connect your GitHub repository
3. Add a PostgreSQL database plugin
4. Set environment variables from your `.env` file
5. Deploy the application

### Heroku

1. Create a new app on Heroku
2. Connect your GitHub repository
3. Add a PostgreSQL add-on
4. Set environment variables from your `.env` file
5. Deploy the application

## Testing

Test the API endpoints using Postman. Import the provided Postman collection to get started quickly.

```bash
npm test
```

## License

This project is licensed under the MIT License.