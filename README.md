# 🛍️ ShopVault — Product Manager

A full-stack CRUD web application built with HTML/CSS/JS on the frontend
and Node.js + Express + MongoDB on the backend.

Built as an academic project for the Full Stack Development lab (BIS601),
6th Semester — IS&E Dept, BIET Davangere.

---

## Features

- View all products in a table
- Add new products
- Edit existing products via modal
- Delete products
- Auto-seeds 5 default products on first run
- REST API with full CRUD support

---

## Tech Stack

| Layer    | Technology              |
|----------|-------------------------|
| Frontend | HTML, CSS, JavaScript   |
| Backend  | Node.js, Express.js     |
| Database | MongoDB (Mongoose ODM)  |

---

## Project Structure

    shopping-app/
    ├── client/
    │   ├── index.html      ← Home page
    │   ├── about.html      ← Products page (CRUD table)
    │   ├── app.js          ← API calls & table logic
    │   └── style.css       ← Shared styles
    │
    ├── server/
    │   ├── index.js        ← Express server + MongoDB + REST API
    │   └── package.json
    │
    └── README.md

---

## Setup & Run

Prerequisites — Node.js installed and MongoDB running locally on port 27017.

    cd server
    npm install
    node index.js

Open browser at http://localhost:3001

---

## API Endpoints

| Method | Route             | Action         |
|--------|-------------------|----------------|
| GET    | /api/products     | Get all        |
| POST   | /api/products     | Add product    |
| PUT    | /api/products/:id | Update product |
| DELETE | /api/products/:id | Delete product |

---

*Aditi V Shastry | 4BD23IS005 | IS&E Dept, BIET Davangere*