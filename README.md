# 📝 Doodle Drop - Notes App

Doodle Drop is a full-stack note-taking application that allows users to securely create, update,forget-password,admin dashboard for user management and manage personal notes. Built with modern technologies like React, Node.js, Express, MySQL, and JWT authentication.

---

## 🚀 Live Demo

🌐 [Deployed on Heroku]([https://doodle-drop-app-9d8bf42b718b.herokuapp.com/])  


---

## 📌 Features

- 🔐 **User Authentication** using JWT (Login/Register)
- 📒 **Notes Management**: Create, edit, delete notes
- 🧠 **User-specific Notes Dashboard**
- 📤 **Email Notification** via NodeMailer (optional use)
- 📦 **Backend API** built with Express & MySQL
- ⚛️ **Frontend** built using React & Tailwind CSS
- 🔄 **Axios** for frontend-backend communication

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Axios
- React Router DOM
- Tailwind CSS

### Backend
- Node.js
- Express.js
- JWT (jsonwebtoken)
- MySQL
- NodeMailer

---

## 🗃️ Database Schema

### `users` Table

| Column     | Type         | Description                |
|------------|--------------|----------------------------|
| id         | INT (PK)     | Auto-incremented user ID   |
| name       | VARCHAR      | User's full name           |
| email      | VARCHAR      | Unique user email          |
| password   | VARCHAR      | Hashed password            |
| role       | ENUM         | 'User' or 'Admin'          |

### `notes` Table

| Column     | Type         | Description                      |
|------------|--------------|----------------------------------|
| id         | INT (PK)     | Auto-incremented note ID         |
| title      | VARCHAR      | Note title                       |
| body       | TEXT         | Note content                     |
| userId     | INT (FK)     | Linked to `users.id` (owner)     |

---

## 📁 Project Structure


