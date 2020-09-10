# <img src="https://raw.githubusercontent.com/katerina-tziala/budget_manager_ems_app/master/src/assets/images/img/logo/android-chrome-72x72.png" alt="budget manager logo" width="44" height="44" align="left">Budget Manager - Expense Monitoring System
<br/>
<p align="center">
<img src="https://raw.githubusercontent.com/katerina-tziala/budget_manager_ems_app/master/documentation_images/BMEMS_ResponsiveLayout.png" alt="budget_manager_ems_app responsive layout" width="80%" height="auto">
</p>

The ***Budget Manager*** application was designed and developed from scratch, for the purposes of my master thesis, on affective feedback techniques, titled:
***"Affective system monitoring personal expenses, helping the user to stay on budget"***
This app is a fully functional prototype system, with mobile friendly interfaces, that helps users track their personal expenses and stay on budget.

Access the app here: <a href="https://budgetmanager.codemix.gr/index.html" target="blank">Budget Manager App</a>

## App Features
The following list is a high-level overview of the app's features:

1. Signup & Login System

2. Account Activation & Password Recovery
  
3. Support System (via sending emails)
  
4. Managing Personal Profile
  
5. Managing Personal Categories of Expenses
  
6. Managing & Monitoring Weekly Budget
  
7. Managing & Monitoring Internal Budget Goals Per Week
  
8. Managing & Monitoring Expenses (with multiple filtering & sorting options)
  
9. Budget Statistics Per Week (with additional overviews and charts per day, per category of expenses, per payment method, per budget goal, etc.)
  
10. Feedback Regarding Users' Performance on Budget Adherence Per Week

## Running the App Locally

Install [**Node.js**](https://nodejs.org/en/), [**Gulp.js**](https://gulpjs.com/) and  [**XAMPP**](https://www.apachefriends.org/index.html/) (if you haven't done it already).

The app was developed using XAMPP therefore, in order to run the app locally:

1. Fork and clone this repository to a new directory named ***budget_manager_ems_app*** inside the ***xampp/htdocs*** directory.

2. Create a database using XAMPP with collation utf8_unicode_ci and name budgetmanager.

3. Import the database from the ***budgetmanager_db.sql*** file which is located in the database folder.

4. To install the dependencies of the app, navigate from your terminal inside the ***xampp/htdocs/budget_manager_ems_app*** directory and run:

    ```
    npm install
    ```

    or

    ```
    npm i
    ```

5. To build the app for development, demonstration or testing purposes, navigate from your terminal inside the ***xampp/htdocs/budget_manager_ems_app*** directory run:

    ```
    gulp
    ```

6. Make sure that the APACHE and MySQL services are running on XAMPP.
   <p align="center">
    <img src="https://raw.githubusercontent.com/katerina-tziala/budget_manager_ems_app/master/documentation_images/xampp.png" alt="xampp control panel" width="70%" height="auto">
   </p>
7. Access the app at: ```http://localhost/budget_manager_ems_app/dev/index.html```

## Build the App for Distribution

1. Fork and clone this repository.

2. Create a database with collation utf8_unicode_ci on the server where the app will be uploaded and import the database from the ***budgetmanager_db.sql*** file which is located in the database folder.

3. In the ***config.json***, located in the ***gulp_tasks*** folder change the ***app_params*** as described below:
   ```javascript
    "app_params" : {
      "dev" : {...},
      "dist" : {
        "path" : "the_link_of_the_uploaded_app",
        "db_username" : "your_username_to_access_database_on_server",
        "db_password" : "your_password_to_access_database_on_server",
        "db_name" : "your_database_name_on_server",
        "app_scope" : "scope_of_the_uploaded_app"
      }
    },
   ```
4. To install the dependencies of the app, navigate from your terminal inside the ***budget_manager_ems_app-master*** directory and run:

    ```
    npm install
    ```

    or

    ```
    npm i
    ```

4. To build the app for distribution, navigate from your terminal inside the ***budget_manager_ems_app-master*** directory and run:

    ```
    gulp dist
    ```

5. Upload all files that are located inside the ***budget_manager_ems_app/dist*** folder on the server.

## Attributions

**:star:&nbsp;&nbsp;MANY THANKS&nbsp;&nbsp;:star:** to all contributors who developed the libraries that were utilized for the development of this system:

- **blob-select:** <a href="https://github.com/Blobfolio/blob-select"><img src="https://raw.githubusercontent.com/katerina-tziala/budget_manager_ems_app/master/documentation_images/tags/tags_blobselect.png" alt="blob-select" width="auto" height="22"></a>

- **chartjs:** <a href="https://www.chartjs.org/"><img src="https://raw.githubusercontent.com/katerina-tziala/budget_manager_ems_app/master/documentation_images/tags/tags_charts.png" alt="Chart.js" width="auto" height="22"></a>

- **Grudus Timepicker:** <a href="https://github.com/grudus/Timepicker"><img src="https://raw.githubusercontent.com/katerina-tziala/budget_manager_ems_app/master/documentation_images/tags/tags_grudus_timepicker.png" alt="Grudus Timepicker" width="auto" height="22"></a>

- **md-date-time-picker:** <a href="https://github.com/puranjayjain/md-date-time-picker"><img src="https://raw.githubusercontent.com/katerina-tziala/budget_manager_ems_app/master/documentation_images/tags/tags_md_date_time_picker.png" alt="md-date-time-picker" width="auto" height="22"></a>

And also to [fontawesome](https://fontawesome.com/) and [Google Fonts](https://fonts.google.com) for the provided fonts!
