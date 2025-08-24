![LayRain](./public/assist/img/logo.svg)
# <center>LayRain</center>
[![English](https://img.shields.io/badge/English-informational?style=for-the-badge)](README.md)
![简体中文](https://img.shields.io/badge/简体中文-inactive?style=for-the-badge)
---
#### Project Overview
LeiRain is a Hitokoto service API developed based on Flask, providing functionalities such as retrieving, adding, updating, and deleting Hitokoto, as well as liking Hitokoto. Hitokoto refers to those short sentences full of philosophy, emotion, or reflection, which can be famous quotes, poems, movie lines, etc.

#### Feature Highlights
- Retrieve a random Hitokoto
- Retrieve a Hitokoto by ID
- Add a new Hitokoto
- Update a Hitokoto
- Delete a Hitokoto
- Retrieve Hitokoto list (supports pagination and category filtering)
- Retrieve category list
- Like a Hitokoto
- Retrieve the number of likes for a Hitokoto

#### Technology Stack
- Backend Framework: Flask
- Database: MySQL
- Database Driver: pymysql
- Cross-Origin Support: Flask-CORS

#### Project Structure
```
LeiRain/
├── api.py         # Main Flask API file, defining all API endpoints
├── main.py        # Core logic of the Hitokoto system, implementing interactions with the database
├── requirements.txt  # List of project dependency packages
├── docs/          # Documentation directory
│   ├── docs/      # VitePress documentation
│   └── public/    # Documentation static resources
├── public/        # Frontend static files
│   ├── assist/    # Auxiliary resources
│   └── index.html # Frontend page
└── ...
```

#### Documentation
https://dev.layrain.cynara.my/

#### License
Copyright © 2025 CynaraGroup. All rights reserved.
This project is distributed under the LGPL-3.0 license.