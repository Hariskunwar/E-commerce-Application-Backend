# Ecommerce-Backend

## Overview

Welcome to the Ecommerce-Backend project by Harish Kunwar. 
This backend application is built using Node.js, Express, and Mongoose, providing a solid foundation for an E-commerce platform. 
It includes essential features for managing products, users, and orders.

## Features

- **Product Management:** CRUD operations for managing products.
- **User Authentication:** Secure user authentication using JWT.
- **Order Management:** Handling and tracking customer orders.
- **Express Framework:** Utilizes the Express framework for routing and middleware.
- **Mongoose ORM:** Interacts with MongoDB using Mongoose for data modeling and querying.

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

- Node.js )
- npm 
- MongoDB

1. Clone the repository:

   ```bash
   git clone https://github.com/Hariskunwar/E-commerce-Application-Backend

2. Install dependencies:

   npm install

3. Set up environment variables:

   Make Sure to create a config.env file in backend/config directory and add appropriate variables in order to use the app.
   
   PORT=8000
   MONGO_URI=mongodb://127.0.0.1:27017/eCommerce
   SECRET_STR=your_jwt_secret
   LOGIN_EXPIRES=jwt_expire_time

### Usage

  Start the server:
  
  npm start

### API Endpoints

  GET /api/v1products: Get all products.
  GET /api/v1/products/:id: Get a specific product by ID.
  POST /api/v1/products: Create a new product.
  PUT /api/v1/products/:id: Update a product by ID.
  DELETE /api/v1/products/:id: Delete a product by ID.

   
