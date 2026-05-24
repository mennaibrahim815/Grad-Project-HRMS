# Staffly - Smart HRMS (Graduation Project)

Staffly is an enterprise-grade Human Resource Management System (HRMS) designed for software companies. It automates core HR operations including recruitment, real-time IoT attendance tracking, complex payroll calculations, and project management.

This repository is a **Monorepo** containing all the services, clients, and hardware logic required to run the system.

##  Repository Structure

Since this is a collaborative graduation project, the codebase is divided into specific domains:

* `/backend` - The core Node.js/Express API, payroll engine, and MongoDB aggregations.
* `/frontend` - The React web dashboard for HR administrators.
* `/hardware` - C++ scripts for the ESP32 microcontroller and RFID reader integration.
* `/ai_service` - Python scripts for CV parsing and candidate ranking (ATS).

##  Tech Stack
* **Backend:** Node.js, Express.js, MongoDB (Mongoose), Zod.
* **Frontend:** React, Vite, Tailwind CSS, Zustand.
* **AI/ML:** Python, ONNX.
* **IoT:** ESP32, RFID modules, C++.

##  Team & Contributions

**Note for Reviewers and Recruiters:**
As the **Team Leader and Lead Backend/AI Engineer**, my primary contributions including the System Architecture, Backend Logic, AI Integration, and IoT bridging are located exclusively in the `/backend` and `/ai_service` directories on the `Youssef` branch. 

The `/frontend` directory is maintained by the UI/UX and frontend team members.

##  Getting Started

To run this project locally, you will need to start the backend server and the frontend client separately. 
