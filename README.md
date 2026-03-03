# MTDS - Mixer Transmission Design System
**Version 1.0 - March 2026**
## Table of Contents

1. [Introduction](#introduction)  
2. [Program Structure](#program-structure)
---

## Introduction
MTDS project is a tool for designing and calculating mixer and its components measurements.

---

## Project Structure
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
