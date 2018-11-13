# budget_manager_ems_app
Budget Manager - Expense Monitoring System

 The <i><b>Budget Manager</b></i> application is designed and developed for personal use only, and as part of the completion of my master thesis with title: <br>
 <i><b>  "Affective system monitoring personal expenses, helping the user to stay on budget"</b></i>.
<br>
<ul>
<li>This fully functional prototype system is a mobile friendly web-based interface that helps users track their personal expenses and stay on budget.</li>
<li>The  <i><b>Budget Manager</b></i> application was developed in order to implement and study affective feedback techniques.</li>
<ul>
<br>
<h1>BUILD AND RUN THE APP</h1>
<p>Install node.js and gulp.js (if you haven't done it already)</p>
<p>The app was developed using XAMPP therefore, in order to "run" the app locally:</p>
<ol>
<li>Create a database using XAMPP with collation utf8_unicode_ci and name budgetmanager</li>
<li>Import the database from the budgetmanager_db.sql file which is located in the database folder</li>
<li>Rename the master folder from  "budget_manager_ems_app-master" to  "budget_manager_ems_app"</li>
<li>Move the "budget_manager_ems_app" folder inside the xampp/htdocs directory</li>
<li>Run&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>npm install to</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;to install all the dependencies of the app (node modules)</li>
<li>Run&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>gulp build_app</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;to build the app</li>
<li>Visit http://localhost/budget_manager_ems_app/dev/index.html to access the app</li>
</ol>

<br>
<h1>BUILD THE APP FOR PRODUCTION</h1>
<ol>
<li>Create a database with collation utf8_unicode_ci on the server where the app will be uploaded</li>
<li>Import the database from the budgetmanager_db.sql file which is located in the database folder</li>
<li>Inside gulpfile.js change the following variables inside the 'build_for_dist' function:<br>
  link = "the_link_of_the_uploaded_app";<br>
  db_username = "username_to_access_database_in_server";<br>
  db_password = "password_to_access_database_in_server";<br>
  db_name = "your_database_name";<br>
  app_scope = "scope_of_the_app";
</li>
<li>Run&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>gulp build_for_dist</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;to build the app</li>
<li>Upload all files inside budget_manager_ems_app/dist folder on the server</li>
</ol>
