# Instructions

## Project 2: [Public Transportation App](https://classroom.udacity.com/nanodegrees/nd802/parts/8021345403/modules/550593026975462/lessons/5505930269239847/concepts/57997297480923)

Prepare for this project with [JavaScript Promises](https://classroom.udacity.com/courses/ud898)
and [Building Offline-First Apps.](https://www.udacity.com/course/offline-web-applications--ud899)


## Viewing this project

* Run `npm start`
* Open [`localhost:8888`](http://localhost:8888/)


## Evaluation

Your project will be evaluated by a Udacity reviewer according to the
rubric below. Be sure to review it thoroughly before you submit. All
criteria must "meet specifications" in order to pass.


## Requirements

You must build an application that allows users to select a departure and 
arrival train station. The user will then see information about the two 
stations. The information you provide may include connected stations on the 
path, arrival & departure times, or any other information you deem important 
for the user. Initially, the application should load a default train schedule, 
this can be a general schedule, a live schedule, or simply a transit map - 
many public transportation agencies offer this information via an API, as a 
GTFS file (for example, [CalTrain](http://www.caltrain.com/developer.html) or 
[the My511.org transit data feed](http://511.org/developer-resources_transit-data-feed.asp)), 
or as an image. When the application is online the user should be able to see 
up to date information from the transit authority of choice. When offline the 
user should be able to continue to interact with the site in some capacity 
(e.g. The user has full access to the general schedule or the user is able to 
see route information they have accessed while online.)

Review [the evaluation rubric](https://review.udacity.com/#!/projects/5505930269/rubric)
for this project early and often.

### Completion

__Meets Specifications:__ App includes all requirements, including
departure and arrival times of trains.


### Responsiveness

__Meets Specifications:__ App is equally functional on mobile and desktop,
using responsive design to ensure its displayed in a usable state.


### Offline Functionality

__Meets Specifications:__ Application defaults to offline-first
functionality, functioning if a network connection does not exist.


### App Delivery

__Meets Specifications:__ App includes a build process (such as Grunt
or Gulp). Assets are minimized and concatenated as appropriate.


## Suggestions to Make Your Project Stand Out

* Minimize the amount of information that needs to be cached by caching
  only what the user access


----


# links

[Google Transit APIs](https://developers.google.com/transit/)


# mysql setup

```
cd ./mysql-docker
sudo docker build -t mysqlgtfs .
sudo docker sudo docker run --name grabel -e MYSQL_ROOT_PASSWORD=sooperSECR3Tpassw0rd -d mysqlgtfs
```