# 📝 Doodle Drop - Notes App

Doodle Drop is a secure and feature-rich full-stack note-taking application that enables users to effortlessly create, update, and manage their personal notes. It includes user authentication, password recovery, and an admin dashboard for comprehensive user management.

---

## 🚀 Live Demo


🌐 [Deployed on Heroku](https://doodle-drop-app-9d8bf42b718b.herokuapp.com/)  


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
📦 Doodle-Drop
├── client/ # React frontend
├── server/ # Express backend
│ ├── Controllers/
│ ├── Middleware/
│ ├── Routes/
│ ├── Database/
│ └── index.js
├── .env
├── README.md


---

## 📦 Installation & Setup

```bash
# Clone the repository
git clone https://github.com/your-username/doodle-drop.git
cd doodle-drop

# Install server dependencies
cd server
npm install

# Setup environment variables (.env)
touch .env
# Add your credentials:
# PORT=3001
# DB_HOST=...
# DB_USER=...
# DB_PASSWORD=...
# DB_NAME=...
# JWT_SECRET=...

# Start server
npm run dev
# In a separate terminal, install client dependencies
cd client
npm install

# Start React client
npm start

