# ESUSU-API
An API for a cooperative society (Esusu) platform where members contribute money for a month and one person takes the total, until everyone has received.

### SUMMARY
This platform comprises of major CRUD endpoints and other few endpoints required to perform operations on the platform. For the automation of the saving process for all groups and their members, a  cron job was implemented to run every weekend (Saturdays). Since there's no specific payment integration, the script just automatically increases the users' balance by NGN 1000.00 every week. When a new tenure request is made, a new list of receipients is generated in a random manner, such that whoever joins during the tenure, is automatically added to the bottom of the list. Every group has only one admin (who is the founder of the group).

### TECHNOLOGY USED
* Node.js
* Express.js
* MongoDB
* AWS Elastic Beanstalk

### SETTING UP LOCALLY
To setup locally, follow steps as stated below:
* Clone repository -
` git clone https://github.com/Tee-Stark/esusu-api`

* Navigate into newly cloned repo directory -
` cd esusu-api`

* Yarn is what I used so you might need to install yarn, before installing dependencies - 
` npm i -G yarn && yarn install`
> Note: You can choose to run both above commannds one after the other, to avoid the use of the && operator.

* Create a .env file with your preferred values for the variables in the envsample file

* To start server in development mode - 
` yarn dev`

* To start application in production mode - 
` yarn start`

If all of the above was done correctly, the server should start running in your terminal.
