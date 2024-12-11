## STAR VINYLS README

Welcome to the Star Vinyls README!

## HOW TO SET UP ON LOCAL HOST:

1) Make sure latest version of Node.js is installed
2) Make sure MySQL is installed
3) Make sure you clone the repository using Git on your terminal
   ```bash
   git clone https://github.com/akifbokth/star-vinyls.git
   ```
5) Install the required Node.js modules
   ```bash
   npm install
   ```
6) Set up the database:
   - Database Schema
   ```bash
   mysql -u star_vinyls_app -p < create_db.sql
   ```
   - Database Data
   ```bash
   mysql -u star_vinyls_app -p < insert_test_data.sql
   ```

   NOTE: IF THIS DOESNT WORK, THEN MANUALLY PASTE THE CONTENTS OF THE create_db.sql & insert_test_data.sql INTO YOUR MYSQL GUI AND RUN THE CODE

7) Run the application with the terminal
   ```bash
   node index.js
   ```

   NOTE: IF THERE ARE ANY ERROR MESSAGES SAYING YOU ARE MISSING MODULES, INSTALL THEM USING npm install [module]

8) Go to http://localhost:8000 to see the application running locally
 
   
