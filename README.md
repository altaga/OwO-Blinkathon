# OwO-Blinkathon

 [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [<img src="https://img.shields.io/badge/View-Website-blue">](https://main.d1v7l1x8vxa5jf.amplifyapp.com/) [<img src="https://img.shields.io/badge/View-Video-red">](https://youtu.be/VCwTtG5JPBU)

<img src="https://i.ibb.co/sbrTvhD/Render2.gif" width=500>

<hr>

Super App that grants youngsters financial power, incorporating the next generations to finance.

Test it yourself

Webpage:

https://main.d1v7l1x8vxa5jf.amplifyapp.com/

To test it follow the instructions presented here:

https://github.com/altaga/OwO-Blinkathon/blob/main/TEST.md

# Table of Contents: 

- [OwO-Blinkathon](#owo-blinkathon)
- [Table of Contents:](#table-of-contents)
- [**Introduction**:](#introduction)
- [**OwO**](#owo)
  - [**Backend**:](#backend)
  - [**OwO App**:](#owo-app)
  - [**Register**:](#register)
  - [**Login**:](#login)
  - [**Parent - Sumary Page**:](#parent---sumary-page)
  - [**Parent - Kids**:](#parent---kids)
  - [**Parent - Card**:](#parent---card)
  - [**Kid - Sumary Page**:](#kid---sumary-page)
  - [**Kid - Rewards Page**:](#kid---rewards-page)
  - [Email:](#email)

# **Introduction**:

As Millennials, when our team were children we had very different interests in relation to goods and services. We mostly bought bikes, toys, board games and video games without microtransactions. We went to Gamestop or similar stores and bought our games with cash and that was it.

The world has changed, and a new generation has emerged that is the bigger one yet. Enter Zed Generation or Centennials.

<img src="https://i.ibb.co/hswxwV4/image.png">

What are their interests you may add?

90% of them consume digital content such as services like Netflix, Youtube, Spotify or Fortnite.

As the world turned into a more digitized one their interests of course are on the more digital side, instead of buying that Video Game and just playing it, theirs have microtransactions. Instead of going to a movie, they prefer to watch Netflix (also because of COVID). Instead of listening to music on the radio they want to acquire a Spotify account. And the number of digital services they want keeps on growing.

<img src="https://i.ibb.co/kgcW2VQ/gustos.png">

And well this is the main problem presented here. 

They have a very hard time acquiring these products in a world that has sped up considerably and does not offer any financial solution that they can call their own.

In addition to that financial literacy is not met at a young age and they are about to join the millennials as one of the generations with a bigger debt and lack of financial literacy. (1)

There is seldom any Fintech, banking solution or project willing to look at this market (which is huge) and generate a solution.


**<h2>Until now....</h2>**

# **OwO**

## **Backend**:

For the application it was decided to base all the management of gift cards on BlinkSky thanks to the fact that its implementation was quite fast in our app using AWS services.

<img src="./Images/diagram.png">

You can see that all of our development is scalable thanks to the management of AWS and BlinkSky, due to its ability to handle customer requests.

## **OwO App**:

The OwO app consists of several sections, which consume the API's through lambdas.

<img src="./Images/main.jpg" width="220px">

## **Register**:  

The registration screen is the first approach of our clients to the Rapyd APIs, since in this step we will create their account and all the data that we will mention below.

<img src="./Images/register.jpg" width="220px">

From this moment, all the extra data that we occupy for the correct operation of the app is stored in Rapyd through the Metadata of each user.

<img src="./Images/metadata.png" width="1000px">

## **Login**:

This is the classic login screen to our application.

With this we can compare if the stored credential is that of the user and give him access to his account.

<img src="./Images/login.jpg" width="220px">

## **Parent - Sumary Page**:

This page allows us to see a summary of all our transactions, charge money to the account (dev), transfer SOL to our account in USD, perform the verification, etc.

<img src="./Images/summary1.jpg" width="220px"><img src="./Images/summary2.jpg" width="220px"><img src="./Images/summary3.jpg" width="220px"><img src="./Images/summary4.jpg" width="220px">

To transfer Solana to the wallet the following model is used.

<img src="./Images/soltransfer.png" width="100%">

## **Parent - Kids**:

This tab has the BlinkSky APIs implemented to be able to send GiftCards as rewards to the child, in this case the list of available cards is updated in real time with the BlinkSky API.

<img src="./Images/blink2.jpg" width="220px">

By pressing the  give giftcard button we will be able to see how a menu is displayed that makes it possible to select all the options of the card.

<img src="./Images/uipart.png" width="220px">

We can select our preferred card, the catalog is downloaded directly from the BlinkSky API.

<img src="./Images/blink1.jpg" width="220px">
<img src="./Images/blink3.jpg" width="220px">

Each card has a minimum and a maximum value, these are pre-configured with the Min and Max buttons.

<img src="./Images/blink4.jpg" width="220px">

Finally, when I press the "give" button, it appears in the Child's account.

[Kid-Rewards](#kid---rewards-page)

## **Parent - Card**:

This tab allows us to issue a card to our account and view the data.

<img src="./Images/card1.jpg" width="220px"><img src="./Images/card2.jpg" width="220px"><img src="./Images/card3.jpg" width="220px"><img src="./Images/card4.jpg" width="220px">

## **Kid - Sumary Page**:

This tab is very similar to the father's, the only difference is that the boy cannot have a blockchain account and instead of adding money to the account, he has to request it from the father's account.

<img src="./Images/Summarykid.jpg" width="220px">

## **Kid - Rewards Page**:

All the cards that we give to the child account will appear in this tab, in this case we can see the master card that we show in the section [Parent-Kids](#parent---kids)

<img src="./Images/blink6.jpg" width="220px">
<img src="./Images/blink7.jpg" width="220px">

We can see that the cards we send through the platform appear in our BlinkSky Digital Dashboard.

<img src="./Images/dashboard.png">

## Email:

In this case, in order to give the user a better experience, we add the function of sending a welcome email with their passwords to users who register.

<img src="./Images/email.png" width="220px">
