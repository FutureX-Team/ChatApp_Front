# Chat Application - تطبيق الدردشة

A modern, full-stack chat application built with React frontend and laravel-PHP backend, featuring a clean separation of concerns and modern development practices.

#Project Setup Guide
This guide explains how to properly set up and run the project's front-end on your local machine.
1. Prerequisites
Before you begin, ensure you have the following software installed on your system:
Node.js: (Recommended version: 18.x or later).
npm (Node Package Manager): (This is installed automatically with Node.js).
A running instance of the backend server.
2. Installation Steps
Follow these steps in order to get your development environment running.
##Step 1: Clone the Repository
Open your terminal, and clone the project repository to your local machine:
Bash
git clone <YOUR_REPOSITORY_URL>
cd <PROJECT_FOLDER_NAME>
If you downloaded the project as a .zip file, unzip it and navigate into the project directory using your terminal.
##Step 2: Install Dependencies
Run the following command to install all the required libraries and dependencies listed in the package.json file.
Bash
npm install
##Step 3: Configure the API Connection
Open the API configuration file located at: src/api/api.js.
Find the line that defines the baseURL.
Change the placeholder URL to the actual URL of your running backend server.
JavaScript
// Example:
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // <-- EDIT THIS URL
  // ...
} );
3. Running the Project
To run the application, you will need two separate terminals open: one for the backend and one for the frontend.
A. Run the Backend Server
Open a new terminal and navigate to your backend project directory.
Start the server. (If your backend is a Laravel project, use the command below):
Bash
php artisan serve
Ensure the backend is running before starting the frontend.
B. Run the Frontend Application
In the terminal for your frontend project (this project).
Run the following command:
Bash
npm start
This command will start the development server and automatically open the project in your default web browser at http://localhost:3000. The application is now ready for use.