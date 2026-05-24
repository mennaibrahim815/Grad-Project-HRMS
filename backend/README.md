# Staffly HRMS - Core Backend Engine

This directory contains the primary server-side implementation of the **Smart Human Resource Management System (HRMS)**. The system is designed to automate complex HR workflows for software companies, integrating IoT hardware, Machine Learning, and automated financial processing.

##  Technical Architecture
The backend is built on a **Modular Monolithic** architecture using the **MERN Stack**, focusing on scalability, secure session management, and high-performance data aggregation.

### Key Technical Implementations:
* **IoT & Real-time Integration:** Seamless integration with ESP32/RFID hardware for automated attendance. Implemented custom logic to handle concurrent check-ins and eliminate manual entry errors.
* **Advanced Data Aggregation:** Extensive use of MongoDB **Aggregation Pipelines ($facet, $lookup, $match)** to generate real-time analytical dashboards and perform complex payroll calculations in a single database hit.
* **Automated Lifecycle Management:** Utilized **Node-Cron** for daily automated tasks, including marking absences, resetting leave balances, and processing payroll drafts based on dynamic cutoff dates.
* **AI-Powered ATS:** Integration with a Python-based ML layer (via `child_process` and ONNX) to parse CVs and rank candidates based on job descriptions.
* **File Processing Pipeline:** Optimized image and document uploads using **Sharp** for on-the-fly compression and **Streamifier** for memory-efficient streaming to Cloudinary.

##  Security & Data Integrity
* **Authentication:** Multi-tier JWT implementation with Access & Refresh tokens stored in **Secure HttpOnly Cookies** to mitigate XSS and CSRF risks.
* **Authorization:** Strict **Role-Based Access Control (RBAC)** enforced at the middleware level.
* **Sanitization:** Input validation via **Zod** schemas and data sanitization to prevent NoSQL injection and XSS attacks.
* **Rate Limiting:** Implemented to protect sensitive endpoints (Login/OTP) from brute-force attacks.

##  Tech Stack
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (Mongoose ODM)
* **Validation:** Zod
* **Date Handling:** Day.js (with Timezone support for global compliance)
* **Utilities:** Bcrypt, Crypto (OTP encryption), Helmet.js.

##  Environment Variables
To run this project, you will need to add the following variables to your `.env` file:
`PORT`, `MONGO_URI`, `JWT_SECRET_KEY`, `CLOUDINARY_NAME/KEY/SECRET`, `EMAIL_USER/PASS` (for OTP), and `TIMEZONE`.

##  Primary Contributions (Team Lead Role)
As the **Team Leader and Lead Backend Engineer**, I was responsible for:
1.  Designing the overall **System Architecture** and Database Schema.
2.  Implementing the core **Payroll Engine** and **Attendance Logic**.
3.  Developing the **Security Infrastructure** and Authentication workflows.
4.  Integrating the **Hardware (IoT)** and **AI (Machine Learning)** services with the Node.js core.
5.  Setting up the **CI/CD flow** and managing Git merges for the backend repository.

---
