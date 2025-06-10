# GB Harvest Organic

A MERN stack application for selling organic products like fruits, dry fruits, and shilajit.

## Features
- User authentication (login/register) with JWT.
- Product listing and admin-only CRUD operations (Create, Read, Update, Delete).
- Responsive UI with Tailwind CSS.
- Search products by name.

## Tech Stack
- **Frontend**: ReactJS, Tailwind CSS, Axios, react-toastify
- **Backend**: Node.js, ExpressJS, MongoDB, JWT, bcryptjs
- **Database**: MongoDB Atlas

## Setup Instructions
1. Clone the repository: `git clone https://github.com/AlizayAslam/gb-harvest-organic.git`
2. Navigate to the server folder: `cd server`
3. Install backend dependencies: `npm install`
4. Create a `.env` file with:
GB Harvest Organic
A MERN stack application for managing organic products, featuring user authentication, role-based access, and an admin dashboard with integrated product management. Built with ReactJS, Node.js, ExpressJS, and MongoDB, with Tailwind CSS for styling.
Features

User Authentication: Login and signup with JWT-based authentication.
Role-Based Access: Head admin assigns admin roles; admins manage products; users view products.
Product Management: CRUD operations (add, edit, delete) via the admin dashboard, with search and pagination for product listing.
Admin Dashboard: Integrated form to add products, list products with edit/delete options.
Responsive UI: Minimal but user-friendly design with Tailwind CSS.

Tech Stack

Frontend: ReactJS, Tailwind CSS, React Router, Axios, React Toastify
Backend: Node.js, ExpressJS, MongoDB, JWT, bcryptjs, morgan
Database: MongoDB

Prerequisites

Node.js (v16 or higher)
MongoDB (local or MongoDB Atlas)

Installation

Clone the Repository:
git clone `git clone https://github.com/AlizayAslam/gb-harvest-organic.git`
cd gb-harvest-organic


Backend Setup:
cd server
npm install
npm install morgan

Create a .env file in the server folder with:
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
PORT=5000


Frontend Setup:
cd client
npm install

Create a .env file in the client folder with:
REACT_APP_API_URL=http://localhost:5000


Run the Application:

Start the backend:cd server
npm start


Start the frontend:cd client
npm start





Managing Admins

Initial Head Admin: Manually set the first head admin in MongoDB Atlas:
Access your MongoDB Atlas cluster.
Navigate to the users collection in the test database.
Insert or update a user document with { "role": "headAdmin" }, e.g.:{
  "name": "Head Admin",
  "email": "headadmin@example.com",
  "password": "<hashed-password>",
  "role": "headAdmin"
}




Use a tool like bcrypt to hash the password if inserting manually.


Assigning Admins: The head admin can promote users to admin via the /api/auth/update-role/:id endpoint. Example:curl -X PUT http://localhost:5000/api/auth/update-role/<user-id> \
-H "Authorization: Bearer <head-admin-token>" \
-H "Content-Type: application/json" \
-d '{"role": "admin"}'


Note: Only the head admin can assign or revoke admin roles. Regular users cannot sign up as admins.

API Endpoints
Authentication

POST /api/auth/signupBody: { "name": String, "email": String, "password": String }Response: { "message": "User created" }

POST /api/auth/loginBody: { "email": String, "password": String }Response: { "token": String, "role": String }

PUT /api/auth/update-role/:id (Head Admin only)Body: { "role": String }Headers: { "Authorization": "Bearer <token>" }Response: { "message": "User role updated", "user": Object }


Products

GET /api/productsResponse: Array of product objects.

POST /api/products (Admin/Head Admin only)Body: { "name": String, "category": String, "price": Number, "description": String, "stock": Number, "image": String }Headers: { "Authorization": "Bearer <token>" }Response: Product object.

PUT /api/products/:id (Admin/Head Admin only)Body: Updated product fields.Headers: { "Authorization": "Bearer <token>" }Response: Updated product object.

DELETE /api/products/:id (Admin/Head Admin only)Headers: { "Authorization": "Bearer <token>" }Response: { "message": "Product deleted" }


Folder Structure
gb-harvest-organic/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AddProduct.js       # Optional, can be removed
│   │   │   ├── AdminDashboard.js   # Admin dashboard with product management
│   │   │   ├── Auth.js            # Login and signup
│   │   │   ├── EditProduct.js     # Edit product form
│   │   │   ├── Input.js           # Reusable input component
│   │   │   ├── Landing.js         # Landing page
│   │   │   ├── Navbar.js          # Navigation bar
│   │   │   ├── ProductList.js     # Product listing
│   │   │   ├── ProtectedRoute.js  # Protected routes
│   │   │   ├── SignUp.js         # Optional, can be removed
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── app.test.js
│   │   ├── reportWebVitals.js
│   ├── .env
│   ├── package.json
├── server/
│   ├── middleware/
│   │   ├── auth.js
│   ├── models/
│   │   ├── Product.js
│   │   ├── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── product.js
│   ├── index.js
│   ├── .env
│   ├── package.json
├── README.md

Deployment

Backend (Render):

Push the server folder to a GitHub repository.
Create a web service on Render, connect the repository, and set environment variables.
Set the start command to npm start.


Frontend (Vercel):

Push the client folder to a GitHub repository.
Create a project on Vercel, connect the repository, and set REACT_APP_API_URL.
Deploy with default React settings.



Contributors

Aleeza Aslam

