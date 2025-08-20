# Full-Stack Task Manager

This is a full-stack task management application built with a React frontend and a Node.js (Express) backend. It allows users to register, log in, create, and manage tasks. The application is containerized using Docker for easy setup and deployment.

## Features

*   **User Authentication:** Secure user registration and login using JWT.
*   **Task Management:** Create, read, update, and delete tasks.
*   **Task Assignment:** Assign tasks to other users.
*   **Task Filtering:** Filter tasks by status, priority, and due date.
*   **Document Uploads:** Attach up to 3 PDF documents to each task, which are uploaded to Cloudinary.
*   **Smart Completion:** A task can only be marked as "Completed" after the assigned user has read at least 80% of the attached documents.
*   **Admin Role:** An admin user can view all users in the system.
*   **Containerized:** The entire application (frontend, backend, database) can be run easily using Docker.

## Tech Stack

*   **Frontend:**
    *   React
    *   TypeScript
    *   Vite
    *   Redux Toolkit (for state management)
    *   React Router
    *   Tailwind CSS
    *   Axios

*   **Backend:**
    *   Node.js
    *   Express.js
    *   TypeScript
    *   PostgreSQL (with Prisma ORM)
    *   JWT (for authentication)
    *   Cloudinary (for file storage)
    *   Multer (for file uploads)

*   **DevOps:**
    *   Docker
    *   Docker Compose

## Prerequisites

*   Docker and Docker Compose installed on your machine.
*   A Cloudinary account to get the necessary API credentials (for document uploads).

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd fullstack-task-manager
    ```

2.  **Configure Environment Variables:**
    Create a `.env` file inside the `backend` directory and add the following variables. You will need to get the `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` from your Cloudinary account.

    ```env
    # backend/.env

    # PostgreSQL Database Connection
    DATABASE_URL="postgresql://postgres:password@db:5432/taskdb"

    # JWT Secret Key
    JWT_SECRET="taskmanager"

    # Cloudinary Credentials
    CLOUDINARY_CLOUD_NAME="your_cloud_name"
    CLOUDINARY_API_KEY="your_api_key"
    CLOUDINARY_API_SECRET="your_api_secret"
    ```

3.  **Build and Run the Application with Docker:**
    From the root of the project, run the following command:
    ```bash
    docker-compose up --build
    ```

4.  **Access the application:**
    *   **Frontend:** `http://localhost:5173`
    *   **Backend API:** `http://localhost:5000`

## API Endpoints

All API routes are prefixed with `/api`.

### Auth Routes (`/api/auth`)

*   `POST /register`: Register a new user.
*   `POST /login`: Log in an existing user.

### Task Routes (`/api/tasks`)

*   `POST /create-task`: Create a new task (requires authentication).
*   `PUT /tasks/:id`: Update an existing task (requires authentication).
*   `GET /tasks`: Get all tasks (requires authentication).
*   `GET /tasks/filter`: Get tasks based on filters (status, priority, dueDate).
*   `GET /tasks/:id`: Get a single task by its ID.
*   `DELETE /tasks/:id`: Delete a task by its ID.
*   `PUT /tasks/:id/completed`: Mark a task as completed (if 80% of documents are read).

### Admin Routes (`/api/admin`)

*   `GET /users`: Get a list of all users (requires admin privileges).
