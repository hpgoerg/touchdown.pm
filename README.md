# Touchdown.PM


![Touchdown.PM-Logo](Logo.png)   
*Thx to my son Felix (https://felixgoerg.myportfolio.com/) for designing the logo* 


## What is Touchdown.PM?

**Touchdown.PM** is a simple, lean - easy to use - project management software, loosely oriented to the scrum method.   

***Technically*** it consists of a **backend** that uses *node.js* as runtime platform and offers *rest services* for the frontend.

*MongoDB* is used as database. 
The **frontend** is a *React* web application.

##  Touchdown.PM with HTTP

### general installation steps

- install **node.js**

- install MongoDB\
(the application was tested with MongoDB Community Edit, version 4.2.3)
- in **./backend/config.js** adopt the params
```PROD_DB_URL``` and ```DEFAULT_DATABASE_NAME``` to your database configuration values
- in **./frontend/src/config.js** set param ```REST_SERVER_PORT``` to the value of param ```REST_SERVER_PORT_FOR_PROD``` from ./backend/config.js (default: _3001_) and adopt ```REST_SERVER``` to the address of your server.
- from terminal at directory **./backend** execute command\
```$ npm install```
- from terminal at directory **./frontend** execute command\
```$ npm install```

- setup the database schema by executing the following command from terminal at directory **./backend**  
```$ npm run setup-db```

- import at least one member with role **ROLE.ADMIN** into the DB.\
To do this first adopt **./backend/newMembersImport.js** to your organizational needs.\
Than in terminal at directory **./backend** execute the command\
```$ npm run import-members```.\
(Additional members can later be added online in the frontend by members with role *ROLE.ADMIN* from menu __Subject => Member__).

Alternatively to the last two steps defined before you can use generated fake data. To do this execute the following command from terminal at directory **./backend**\
```$ npm run setup-db-fake-data```.\
To change the fake data generation you can adopt **./backend/src/backend/db/dbGenerateMassData.js**.  


### Run Touchdown.PM  with HTTP

- start your MongoDB database
- start Touchdown.PM *backend* from terminal at directory **./backend** by executing command\
```$ npm run server-http```
- start Touchdown.PM *frontend* from terminal at directory **./frontend** by executing command\
```$ npm start```

When the browser has opened with the application at default URL [http://localhost:3000](http://localhost:3000) 
select **Account** in the Touchdown.PM **toolbar** and then click on **Login**. 
With fake data imported you log in with **dan.demo@scrummers.com** as Email address and **Touchdown.PM#20** as Password.  

After successful login you can start the application parts (like   *Sprint*) from toolbar menu **Subject**.

##  Touchdown.PM with HTTPS

*Hint: HTTPS was tested with a localhost certificate. You may eventually need to do more steps than documented in the following if using a certificate from a certificate authority*.

### Additional installation steps for  HTTPS
\
In addition to the steps defined in __general installation steps__ do the following:

- copy your certificate files into directory **./frontend/cert**
- eventually adopt the following code snippet from __./backend/src/backend/restserver/restserver.js__:


        const options = {
            key: fs.readFileSync(path.resolve(... ,
            cert: fs.readFileSync(path.resolve(... ,
            //ca: read file of your certificateAuthority
            requestCert: false,
            rejectUnauthorized: false
        };


- in **./frontend/src/config.js** set **REST_SERVER_PORT** to the value of REST_SERVER_PORT_FOR_PROD_HTTPS (from ./backend/config.js) and set **REST_SERVER_PROTOCOL** to **'https'**
- in **./frontend/.env.development** remove the comment signs so that the content is  
<pre><code>SSL_CRT_FILE=cert/certificate.crt
SSL_KEY_FILE=cert/certificate.key
</code></pre>
- in **./frontend/package.json** set HTTPS=true
<pre><code> "start": "HTTPS=true react-scripts start"</code></pre>

### Run Touchdown.PM with HTTPS

- from terminal at directory **./backend** run the following command: \
```npm run server-https```
- from terminal at directory **./frontend** run the following command: \
```npm start```

## Special configuration options

### Configuration of verification workflow

Epics, Userstories and Releases use the same verification workflow.  

The possible status instances of the verification workflow are defined in __./backend/configVerificationWorkflow.js__.  

You can change the status instances for __production__ which are defined as follows:  

```
const verificationWfProduction =
    [ "verificationwf.created", "verificationwf.inverification", "verificationwf.approved", "verificationwf.rejected", "verificationwf.implemented ];
```

The status instances (e.g. *"verificationwf.created"*) represent  **i18n ids** to allow internationalization when the workflow status is shown in the frontend. 

You can change this production verification workflow in two ways:  

**First** you can change the internationalized text values for the **i18n ids** in:  
__./frontend/src/locales__

Following is an excerpt of the english locale frontend file
__./frontend/src/locales/en.json__. 

```
"verificationwf.created": "created",
"verificationwf.inverification": "in verification",
"verificationwf.approved": "approved",
"verificationwf.rejected": "rejected",
"verificationwf.implemented": "implemented"
```

You __don't__ have to do a database migration afterwords because when persisting workflow status instances the **i18n ids** defined in the workflow are used.  

__Second__ you can define __additional__ workflow instances.  
In this case you have to define new i18n ids _and_ their text values. 
If you add more workflow status instances you eventually have to adopt the optic of
__./frontend/src/views/shared/DataChartViewStorypoints.jsx__


### Configuration of password rule. 

The formal password rule is defined in __./backend/config.js__ in param PASSWORD_REGEX.\
\
If changing PASSWORD_REGEX you must adopt the text value of i18n id __h.password__ in the backend locale files  
_and_ the text value of i18n id __general.error.password.required__ in the frontend locale files.

## Terminology

### Userstory

A **Userstory** in _Touchdown.PM_ describes a business functionality from the perspective of a role actor like in _scrum_.  
_Touchdown.PM_ has **no** explicit **backlog**, but you can use the **Workflow status** of a userstory in the sense of a
backlog filter.

### Epic

An **Epic** is an aggregation of userstories.  
You can use an epic in the sense of a _project_ or an _initiative_ or an all in all description
of a desired business functionality or a software.

The same userstory can be assigned to _multiple_ epics. The idea behind this is to define an epic whose functionality
is in part already implemented. This allows reuse.

### Sprint

Oriented to _Scrum_ a **Sprint** is understood as a time-boxed period to develop a potentially
releasable software component or generally a product part.  

A specific characteristic in *Touchdown.PM* is that a *Task* is not understood as part of _one_ userstory, but as a helper
construct to define the work to be done in a Sprint.  

The assumption is that one sprint task may eventually be relevant for more than one userstory and that some tasks are general tasks (e.g. documentation).

### Impediment

In _Touchdown.PM_ an **Impediment** is anything that slows velocity of the teams and hinders them to get their work done.  
In Touchdown.PM impediments are defined independent of sprints or epics to realize general problems early.

### Release

A **Release** is the rollout of a software (or software components) or of a product in general.  

In the sense of Scrum software rollout should be iterative in relative short periods. 


## Please consider

I developed this software privately as a retiree. Don't expect me to maintain or enhance this software in any way.

## License
MIT licensed

