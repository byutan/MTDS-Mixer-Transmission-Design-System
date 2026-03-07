# MTDS - Mixer Transmission Design System
**Version 1.0 - March 2026**
## Table of Contents

1. [Introduction](#introduction)  
2. [Program Structure](#program-structure)
3. [Executing Instructions](#executing-instructions)
---

## Introduction
MTDS project is a tool for designing and calculating mixer and its components measurements.

---

## Program Structure
```
.
└── apps                                   # Root folder
   ├── frontend                            # Front-end folder
   │  ├── main.jsx                         # Application entry point
   │  └── App.jsx                          # Module entry point
   └── backend                             # Back-end folder
      ├── index.jsx                        # Server entry point
      └── src                              # Server setup folder
          ├── config                       # Configuration folder
          │   └── database.js              # Database connection configuration
          ├── controllers                  # Controllers folder
          │   ├── component.controller.js  # Handles component incoming requests and sends responses
          │   └── ...
          ├── routes                       # Routes folder
          │   ├── component.routes.js      # Defines component API endpoints and maps requests to controllers
          │   └── ...
          ├── services                     # Services folder
          │   ├── component.routes.js      # Contains business logic and core processing
          │   └── ...
          └── models                       # Models folder
              ├── component.routes.js      # Manages database interactions and data queries
              └── ...
```
---

## Executing Instructions
1. Clone the repository to local folder
``` git clone https://github.com/byutan/MTDS-Mixer-Transmission-Design-System.git  ```
2. Change directory to root folder
``` cd MTDS-Mixer-Transmission-Design-System ```
3. Install nodeJS library
``` npm install ```
4. Change directory to backend folder
``` cd apps/backend ```
5. Create .env with below content
```
DB_USER=postgres
DB_PASSWORD=(your postgreSQL password)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=do_an_da_nganh_db
```
6. Run frontend & backend
```
cd apps/backend(frontend)
npm run dev
```
---
