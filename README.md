# Employement certificate verifications with Affindi APIs

## Table of contents

- [Overview](#Overview)
- [Installation Guide](#installation-guide)
  - [Generate Affinidi API Key](#generate-affinidi-api-key)
  - [EmailJS](#emailjs)
  - [Firebase](#firebase)
  - [Installing React App](#installing-react-app)

### Overview

This project aims to provide simple solution for employers to issue employement certificate which can be easily verified by recruiters with few simple steps.This solution makes it easier to identify valid certificates.

At present, Employers issues certificates either in digital format or in physical format which candidates use to showcase while applying for the job.
But many times, It becomes a tedious process to verify those and hence the whole process is time consuming. Our platform can provide a solution to tackle this problem. Every employee can issue certificates through this platform. Recruiters can verify certificates on this platform.

We tried to look up for a decentralized solution where all issued certificates can be stored. Blockchain is right solution for the same. But It is not always easy to implement it from the scratch. Affinidi provides APIs which makes this whole development process very straight forward and easy to implement.

This repository contains code for the demo application where we have demonstrated how we can achieve it using Affinidi's verifiable APIs.

You can find demo application [here](https://google.com)

------------------------------------------------------

### Installation Guide

#### Generate Affinidi API Key

Before you could use our API and SDK services, you would have to register to get the API keys.

1. Go to apikey.affinidi.com
1. Register for an account
1. Store the API Key and API Key Hash safely

#### EmailJS

In our application, once the issuer has approved an application, the applicant will receive the credentials through their email. We are using EmailJS for it.

1. Register to EmailJS
1. Add an email service
1. Create an email template
![Template Format](https://i.ibb.co/Qn6BpmT/Screenshot-from-2021-05-09-12-40-37.png)
1. Send email with form details using EmailJS SDK
1. We will need User ID ([check](https://dashboard.emailjs.com/admin/integration)), service ID ([check](https://dashboard.emailjs.com/admin)) & Template ID ([check](https://dashboard.emailjs.com/admin/templates))

For video tutorial, Click [here](https://www.youtube.com/watch?v=NgWGllOjkbs)

#### Firebase

In our issuer application, we will be using firebase to mimic issuer's database which stores all of the applications.

1. Go to Firebase Console <https://console.firebase.google.com/>
1. Create a new Firestore
1. Navigation to Project Settings
1. Look for firebaseConfig and copy the credentials. It should look like

```
  var firebaseConfig = {
    apiKey: <<SOME API KEY>>,
    authDomain: "<<SOMEP PROJECT NAME>>.firebaseapp.com",
    projectId: "<<SOMEP PROJECT NAME>>",
    storageBucket: "<<SOMEP PROJECT NAME>>.appspot.com",
    messagingSenderId: <<SOME STRING>>,
    appId: <<SOME STRING>>
  };
```

### Installing React App

* Download and Install nodejs. Download from [here](https://nodejs.dev/download)
* Clone this repository to your local machine and navigate to directory. Run
```npm install```
* Create a .env file and add values for environment variables. Refer example.env
* Run ```npm start``` command in terminal to start the application.
* On your browser, You application will be running on http://127.0.0.1:3000
