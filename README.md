# ![alt text](https://raw.githubusercontent.com/katerina-tziala/budget_manager_ems_app/master/src/assets/images/img/logo/android-chrome-48x48.png "budget manager logo")budget_manager_ems_app
<h3>Budget Manager - Expense Monitoring System</h3>
<img src="https://raw.githubusercontent.com/katerina-tziala/budget_manager_ems_app/master/src/assets/libs/BMEMS_ResponsiveLayout.png" alt=")budget_manager_ems_app responsive layout" width="100%" height="auto">
The <i><b>Budget Manager</b></i> application is a fully functional prototype system, with mobile friendly interfaces, that helps users track their personal expenses and stay on budget. This app was designed and developed for the purposes of my master thesis on affective feedback techniques titled:
<h3><i>"Affective system monitoring personal expenses, helping the user to stay on budget"</i></h3><br/>
Access the app here:
<a href="https://budgetmanager.codemix.gr/index.html" target="blank">Budget Manager App</a>
<br/>
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

<br/>
<p>The following sections describe how to build the app for development and distribution.</p>
<br>
<h1>BUILD AND RUN THE APP</h1>
<p>Install node.js and gulp.js (if you haven't done it already)!</p>
<p>The app was developed using XAMPP therefore, in order to "run" the app locally:</p>
<ol>
<li>Create a database using XAMPP with collation utf8_unicode_ci and name budgetmanager</li>
<li>Import the database from the budgetmanager_db.sql file which is located in the database folder</li>
<li>Rename the master folder from  "budget_manager_ems_app-master" to  "budget_manager_ems_app"</li>
<li>Move the "budget_manager_ems_app" folder inside the xampp/htdocs directory</li>
<li>Run&nbsp;&nbsp;&nbsp;<b>npm install</b>&nbsp;&nbsp;&nbsp;to install all the dependencies of the app (node modules)</li>
<li>Run&nbsp;&nbsp;&nbsp;<b>gulp</b>&nbsp;&nbsp;&nbsp;to build the app for development/demonstration/testing purposes</li>
<li>Visit http://localhost/budget_manager_ems_app/dev/index.html to access the app</li>
</ol>
<br>
<h1>BUILD THE APP FOR DISTRIBUTION</h1>
<ol>
<li>Create a database with collation utf8_unicode_ci on the server where the app will be uploaded</li>
<li>Import the database from the budgetmanager_db.sql file which is located in the database folder</li>
<li>In the config.json <i>(located in the gulp_tasks folder)</i>
change the <i><b>"app_params"</b></i> as descripbed below:<br>
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
</li>
<li>Run&nbsp;&nbsp;&nbsp;<b>gulp dist</b>&nbsp;&nbsp;&nbsp;to build the app</li>
<li>Upload all files that are located inside the <i><b>"budget_manager_ems_app/dist"</b></i> folder on the server</li>
</ol>
<p><i><b>Note: </b></i>For production, you also have to run&nbsp;&nbsp;&nbsp;<b>npm install</b>&nbsp;&nbsp;&nbsp;before running&nbsp;&nbsp;&nbsp;<i><b>gulp dist</b></i>&nbsp;&nbsp;&nbsp;if you haven't done it already!</p>
