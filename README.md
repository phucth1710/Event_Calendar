# Event Calendar 
This project is part of CSE330 - Creative Programming and Rapid Prototyping  
Kien Ta - Anh Le

Link to Our Calendar:
http://ec2-13-250-43-149.ap-southeast-1.compute.amazonaws.com/~talekien1710/module5-group-module5-488493-488494/main.html

# Basic functionality:

A simple calendar that allows users to add and remove events dynamically. JavaScript is used for client's interaction. AJAX is used to request/save information from server. All events with associating users, dates, and time are saved in MySQL database using PHP.

- A month-by-month view of the calendar.  
- Users can register and log in to the website.  
- Registered users can add events, and they can only see the events they added.  
- Registered users delete their events.  
- All data about events, users are safely stored in MySQL database.  
- Web security added to prevent attacking, such as XSS attacks, session hijacking attacks (session cookie is HTTP-Only), CSRF attacks (token added), Injection attacks (prepared queries). Also password is salted and encrypted.


# Creative portion:

## 1. Calendar Sharing
Users have the option to share all their private events to their additional desired users. Those shared users are able to see all events associated 
to the "owner" user. After sharing the event, the shared users have the right to adjust all events of owmer.

## 2. Group Event
- Users can create group events that display on multiple users calendars. Once the event is shared, all participants have the right to edit/delete the event.
Input the event participants separated by commas, for example: david, kien, anhle


## 3. Password validation:
The password users register for must contain the following:
- A lowercase letter
- An uppercase letter
- A number
- Minimum 8 characters


# Registered users:
talekien1710  
Kien1234

anhvqle  
helloVN84


# Demo:
Before:
![](images/before.png)

After:
![](images/after.png)
