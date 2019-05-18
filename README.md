<h1><img src="https://raw.githubusercontent.com/katerina-tziala/budget_manager_ems_app/master/src/assets/images/img/logo/android-chrome-72x72.png" alt="budget manager logo" width="54" height="54">Budget Manager - Expense Monitoring System</h1>
<p align="center">
<img src="https://raw.githubusercontent.com/katerina-tziala/budget_manager_ems_app/master/src/assets/images/BMEMS_ResponsiveLayout.png" alt="budget_manager_ems_app responsive layout" width="80%" height="auto">
</p>


The ***Budget Manager***
application was designed and developed from scratch, for the purposes of my master thesis, on affective feedback techniques, titled:
***"Affective system monitoring personal expenses, helping the user to stay on budget"***
This app is a fully functional prototype system, with mobile friendly interfaces, that helps users track their personal expenses and stay on budget. 
<br><br>
<h2>APP FEATURES</h2>
The following list is a high-level overview of the app's features:

  **1.** Signup & Login System
  
  **2.** Account Activation & Password Recovery
  
  **3.** Support System (via sending emails)
  
  **4.** Managing Personal Profile 
  
  **5.** Managing Personal Categories of Expenses
  
  **6.** Managing & Monitoring Weekly Budget
  
  **7.** Managing & Monitoring Internal Budget Goals Per Week
  
  **8.** Managing & Monitoring Expenses (with multiple filtering & sorting options)
  
  **9.** Budget Statistics Per Week (with additional overviews and charts per day, category of expenses, payment methods, budget goals, etc.)
  
  **10.** Feedback Regarding Users' Performance on Budget Adherence Per Week

<br/>
Access the app here: <a href="https://budgetmanager.codemix.gr/index.html" target="blank">Budget Manager App</a>
<br><br>
<h2>BUILD AND RUN THE APP</h2>
<p>Install node.js and gulp.js (if you haven't done it already)!</p>
<p>The app was developed using XAMPP therefore, in order to "run" the app locally:</p>

 **1.** Create a database using XAMPP with collation utf8_unicode_ci and name budgetmanager
 
  **2.** Import the database from the *"budgetmanager_db.sql"* file which is located in the database folder

  **3.** Rename the master folder from *"budget_manager_ems_app-master"* to  "budget_manager_ems_app"
  
  **4.** Move the *"budget_manager_ems_app"* folder inside the xampp/htdocs directory
  
  **5.** Run&nbsp;&nbsp;&nbsp;**npm install**&nbsp;&nbsp;&nbsp;to install all the dependencies of the app (node modules)
  
  **6.** Run&nbsp;&nbsp;&nbsp;**gulp**&nbsp;&nbsp;&nbsp;to build the app for development/demonstration/testing purposes
  
  **7.** Visit http://localhost/budget_manager_ems_app/dev/index.html to access the app
  
<br>
<h2>BUILD THE APP FOR DISTRIBUTION</h2>
  **1.** Create a database with collation utf8_unicode_ci on the server where the app will be uploaded
 
  **2.** Import the database from the *"budgetmanager_db.sql"* file which is located in the database folder

  **3.** In the config.json *(located in the gulp_tasks folder)* change the ***"app_params"*** as described below:
         "app_params" : {<br>
  &nbsp;&nbsp;"dev" : {...},<br>
  &nbsp;&nbsp;"dist" : {<br>
  &nbsp;&nbsp;&nbsp;&nbsp;"path" : "the_link_of_the_uploaded_app",<br>
  &nbsp;&nbsp;&nbsp;&nbsp;"db_username" : "your_username_to_access_database_on_server",<br>
  &nbsp;&nbsp;&nbsp;&nbsp;"db_password" : "your_password_to_access_database_on_server",<br>
  &nbsp;&nbsp;&nbsp;&nbsp;"db_name" : "your_database_name_on_server",<br>
  &nbsp;&nbsp;&nbsp;&nbsp;"app_scope" : "scope_of_the_uploaded_app"<br>
  &nbsp;&nbsp;}<br>
  },

  **4.** Run&nbsp;&nbsp;&nbsp;**gulp dist**&nbsp;&nbsp;&nbsp;to build the app
 
  **5.** Upload all files that are located inside the ***"budget_manager_ems_app/dist"*** folder on the server

<p><i><b>Note: </b></i>For production, you also have to run&nbsp;&nbsp;&nbsp;<b>npm install</b>&nbsp;&nbsp;&nbsp;before running&nbsp;&nbsp;&nbsp;<i><b>gulp dist</b></i>&nbsp;&nbsp;&nbsp;if you haven't done it already!</p>
<hr>
<h3>:star:&nbsp;&nbsp;MANY THANKS&nbsp;&nbsp;:star:</h3>
&nbsp;&nbsp;&nbsp;&nbsp;To all contributors who developed the libraries that were implemented in this system:<br/>

&nbsp;&nbsp;&nbsp;&nbsp;<a href="https://github.com/Blobfolio/blob-select"><img src="https://github.com/katerina-tziala/budget_manager_ems_app/blob/master/src/assets/libs/tags/tags_blobselect.png" alt="blob-select" width="auto" height="30"></a>
<a href="https://www.chartjs.org/"><img src="https://github.com/katerina-tziala/budget_manager_ems_app/blob/master/src/assets/libs/tags/tags_charts.png" alt="Chart.js" width="auto" height="30"></a>
<a href="https://github.com/grudus/Timepicker"><img src="https://github.com/katerina-tziala/budget_manager_ems_app/blob/master/src/assets/libs/tags/tags_grudus_timepicker.png" alt="Grudus Timepicker" width="auto" height="30"></a>
<a href="https://github.com/puranjayjain/md-date-time-picker"><img src="https://github.com/katerina-tziala/budget_manager_ems_app/blob/master/src/assets/libs/tags/tags_md_date_time_picker.png" alt="md-date-time-picker" width="auto" height="30"></a>

&nbsp;&nbsp;&nbsp;&nbsp;And also to fontawesome.com and google for the provided fonts:<br>
&nbsp;&nbsp;&nbsp;&nbsp;<a href="https://fontawesome.com/"><img src="https://www.drupal.org/files/project-images/font_awesome_logo.png" alt="fontawesome" width="auto" height="60"></a>
<a href="https://fonts.google.com/"><img src="https://pbs.twimg.com/profile_images/742732476213268480/ZWREQYdH_400x400.jpg" alt="Google Fonts" width="auto" height="60"></a>

&nbsp;&nbsp;&nbsp;&nbsp;:heart: :blush: :relaxed: :smiley: :wink:
