<h1 align="center">
   <img alt="sigma" src="github/Sigma.svg" width="180px" />
</h1>

<div align="center">
  <h1>Sigma - A Secure Realtime Chat App </h1>
</div>

<p align="center" >
  <a href="#-sobre-a-aplica%C3%A7%C3%A3o"> About </a> &nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;
  <a href="#-tecnologias">Techs</a> &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-conteúdos-aplicados"> Content</a> &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-suporte"> Suport </a> &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-licen%C3%A7a">License</a>
</p>

<p align="center">
  <a href="https://github.com/eulazzo" target="_blank">
    <img src="https://img.shields.io/static/v1?label=author&message=eulazzo&color=f2f2f2&labelColor=03cafc" alt="Github"> 
  </a>
    <img src="https://img.shields.io/github/stars/eulazzo/sigma?color=f2f2f2&labelColor=03cafc" alt="Stars">
  <img src="https://img.shields.io/github/last-commit/eulazzo/sigma?color=f2f2f2&labelColor=03cafc" alt="Commits">
  <img src="https://img.shields.io/static/v1?label=license&message=MIT&color=f2f2f2&labelColor=03cafc" alt="License">
</p>

<h1 align="center">
   <img alt="sigma" src="github/allScrenToNow.gif" width="250px" />
</h1>

## About the project

#### Sigma

<p>Sigma is a secure Realtime Chat App.
 Was inspired by Signal Ui.</p>
<p>Developed with <code>React Native</code>, <code>Aws Amplify</code>,<code>Expo Vector Icons</code>,</br><code>Cognito</code>,
<code>expo-av</code> ,<code> expo-image-picker</code>  
and <code>TweetNaCl</code> </p> 

#### Functionalities:
- Send messages, images (Gallery or Camera), audios.
- User Online/Offline status and last seen.
- SENT/READ/DELIVERED message status
- create Groups and remove users
- Delete messages
- Message Replies


## User Authentication with Cognito

<p>
   
For user authentication, cognito Service was used. It keep track all users, tokens, permissions etc.
However,the users from the app contain photos and names, just Authentication is not enough for that. It is necessary to keep them in the database, <code>but how to save user data as soon as he registers in the app?</code> For this,<code>Amplify Authentication Module</code>  can trigger some actions, among them the <code>User Confirmation</code> . That is, as soon as the user confirms the email, something can be done. 
</p>

### Lambda functions

<p> 
   Behind these triggers are the <code>Lambda functions</code>, which run in the cloud on AWS  without having to worry about servers. As said, you have Authentication Module that can trigger functions depending on some events.  
   In this case <code>User Confirmation Event</code> serves the purpose, because when the user confirms, a lambda is created that will <code>save the user data in DynamoDB</code>, with this we can show user data on screen.  
   For this, it was necessary to make some settings. On the terminal i typed <code>amplify auth update</code> and follow a few steps until the last question where it shows the option <code>which trigger do you want to enable for cognito?</code>  just choose <code>Post Confirmation</code>  and then choose to add the lambda function with the purpose of save user data in DynanoDB.
</p>

## Sent, read and Delivered Message Status 

### To implement this feature, the following logic was thought: </br>
<p>
When a message is sent whether it is delivered or not we have to check if the  
message has been successfully synced to the cloud, if the message has been saved
in the database. </br>

Because if we don't have internet the message will appear on the screen because we are 
using DataStore but will not be synchronized with database. So in this case it shouldn't show any <code>checkmark</code> ,  once the message is successfully synced
the status should change to  <code>DELIVERED</code> and when the message is read to <code>READ</code> .
</p>

### DataStore events (Checking if the message was saved)
<p>
To check if the message is saved in the database, we can listen some events. 
DataStore events will trigger some events, we have the <code>outboxMutationEnqueued</code>  dispatched when local changes have recently been prepared for synchronization. In this way, as soon as we are trying to send something for synchronization with the cloud, the mentioned event will be triggered and when it is finished the <code>outboxMutationProcessed</code>  event is triggered.
</p>

### OutboxMutationProcessed event and how to change the message status
<p>
That is, listening to the <code>outboxMutationProcessed event</code> it is possible to change the message state from <code>SENT</code> to <code>DELIVERED</code> since we have this event as soon as a message is synchronized and saved in the database. The listener was added to the APP function, as we know that this component will always be mounted. Basically, in the app component, inside the listener function we  <code>check if the event is equal</code> to <code>outboxMutationProcessed</code>. If so, we check if the <code>MODEL</code> returned by the function is equal to the Message Model of our application. <code>Finally</code>, we just set the message to <code>DELIVERED</code>. 
</p>
 
### Status change in real time

<p>
To view the status change in real time, we use DataStore.observe to notice changes in the Model Message opType and set the message's new state. To set the status as <code>READ</code> , it is enough to check if the message is not mine and if the message does not already contain <code>READ</code> status, if ok in this verification, a copy is made in the DataStore using the new state of the message specifying which status(Message).
</p>

## Upload of images
<p>
Briefly, The first step is all about permissions. Ensure that the application has access to the user's images. Next step, was to picker the image from device and as a return we have the local (Mobile) URI of the image, setting it to state.  To save the image in the cloud i have used S3 Storage.
</p>
 
## See the app's features till now:

### Delivered status set when the user views the message

<h1>
   <img alt="sigma" src="github/1-receveidMessage.gif " width="250px" />
</h1>

### Reply to a message 

<h1>
   <img alt="sigma" src="github/2-reply.gif " width="250px" />
</h1>

### Delete Message 

<h1>
   <img alt="sigma" src="github/3-deletingMessages.gif" width="250px" />
</h1>

### Trying to delete another user's message 

<h1>
   <img alt="sigma" src="github/4-deletingFriendsMessage.gif" width="250px" />
</h1>

### Groups and remove some users 

<h1>
   <img alt="sigma" src="github/5-creatingGroups.gif" width="250px" />
</h1>

### Send Images 

<h1>
   <img alt="sigma" src="github/6-sendingImages.gif" width="250px" />
</h1>

### Take photos and send them 

<h1>
   <img alt="sigma" src="github/7-takingAndSendingPhotos.gif" width="250px" />
</h1>

 

## Getting started

1. Clone this repo using `git@github.com:eulazzo/sigma_app.git`
2. Move yourself to the appropriate directory: `cd sigma-app`<br />
3. Run `npm install` to install dependencies<br />



## :rocket: Technologies

<table>
   
  <thead>
    <th>Back-end</th>
    <th>Front-end</th>
  </thead>
   
  <tbody>
    <tr>
      <td>Aws Amplify</td>
      <td>React Native</td>
    </tr>
     <tr>
      <td>Cognito</td>
      <td>Css</td>
    </tr>
  </tbody>
  
</table>

## License

This project is licensed under the MIT License - see the [LICENSE](https://opensource.org/licenses/MIT) page for details.
<!-- <h4>Techs:</h4>

![image](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)  
![image](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)

  -->

 

