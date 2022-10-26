# canvas-events framework

## what is that library

*. this js small library hellp developers to work with canvas and shapes, and it provide custom javascript events to deal with shapes on canvas as it html elements normaly event listeners
*. this library provides internal pull events and not external API , also it is based on real Javascript event set. which makes the events of this  library run as native events and at the same time javascript calls real events that makes library fast and 100% accurate and makes it easy to use canvas for any developer just provide the canvas id for the start function and start setting your event listener like that normal event listener  in JavaScript. 

## languages and framworks
1. javascript
2. Jquery

## What kind of events does this library provide

Now you can use events on canvas shapes

1. drag Start event
2. drag over
3. drag leave
4. drag out
5. drag enter
6. drop
7. drag end
8. Relase Cancel event  !!! The new JavaScript event listener which not exist in javascript before which is 
9. click event
10. mouseenter shape event (accurate by 1 pixel)
11. mouseout shape event (accurate by 1 pixel)

## How to Start

!note before start
[img icon elements must have a CLASS: icon_image and a unique identifier, the canvas must have a unique identifier, and the canvas's background image must have ID: project_image ]



2- Add all the img icons you want the framework to draw in the canvas element, If you want to make a copy of the same image don't provide two images only one and add the new object for this image in the projectImage array cotain same img HTML id with the new position and any other required data you need.


3- Add a Canvas element and add an ID to it and we'll use it in the setup.

4- Create an Array variable that contains objects repsersnts your icons will be painted  

```javascript
const projectStamps = [
  {title: 'repear', image_id: 'scream',  x: 100,  y: 100,  w: 35,  h: 35,  id: 1},
  {title: 'repear', image_id: 'scream',  x: 100,  y: 100,  w: 35,  h: 35,  id: 1}
]
```
> this object must include at least these properties  below, 
you can add any other data for specfic object or all other objects this will return also more data in the event listeners can used to extend framework funcitonlty and make it more dynamic.


5- Finally, create a new object painter and assign it to a variable,

```javascript

let painter;
window.onload = function() {
  /* Use Canvas Events Library  */
  painter = mouseDragStartGenerator('#myCanvas', projectStamps);  
};

/* #myCanvas is the canvas element DOM selector required,
projectStamps is the list of all starter icons required for the all events*/
```


> You can have more than one Painter object because it is returned by the function and event listeners are sperated from painter object method or it not can effect it  global variables as it the parent class for it,
you can add diffrent data to each object variable and extend it functions or use diffrent proprties.



### What is Relase Cancel event do:
This event is fired when the checkout process is cancelled. For example dropping the item out of the target drop container, it's important to clear anything extra if the drag is cancelled. For example in the game when the user loses dropping the item into the target container, you can use this event to hide the item easily. (Note that this does not mean that when the event is cancelled, the element will change shape position and wait for the user to back it)


### why should I use this:

If you don't use this library you have decided to make working with canvas more difficult and not 100% accurate and slow if you care about the accuracy and speed this library made for you.

### note:
Download/clone it now for free. There are probably a lot of Canvas libraries out there, but it wouldn't be the easiest to use like this one. It is also an event library that can be used with some other canvas libraries. ([Canvas events] are dynamic meaning)


## How to use it
first include canvas-events.js file into your html file, make sure to add jquery and pass the projectStamps icons which contain icon title, image_id, x,y, w, h,id and any other data then call mouseDragStartGenerator and pass it the canvas element selector and projecticons make sure you have image element for each provided image id like scream in example1 in examples folder then start use the events easy just 1 function and array of objects with all your icons 

```
let painter;

const projectStamps = [{
  title: 'repear',
  image_id: 'scream',
  x: 100,
  y: 100,
  w: 35,
  h: 35,
  id: 1
}, {
  title: 'repear2',
  image_id: 'scream',
  x: 100,
  y: 100,
  w: 35,
  h: 35,
  id: 122
}, {
  title: 'fix',
  image_id: 'scream',
  x: 200,
  y: 100,
  w: 35,
  h: 35,
  id: 2
}, {
  title: 'development',
  image_id: 'scream',
  x: 50,
  y: 0,
  w: 35,
  h: 35,
  id: 3
}, {
  title: 'guarding',
  image_id: 'scream',
  x: 170,
  y: 0,
  w: 35,
  h: 35,
  id: 4
}];



window.onload = function() {
  /* Use Canvas Events Library */
  painter = mouseDragStartGenerator('#myCanvas', projectStamps);  
};
```


### screenshots

#### mouse enter and mouse out (shape):
![image](https://user-images.githubusercontent.com/55125302/197537763-705a52ff-4257-43d1-82df-b06912f7a2ae.png)

#### Flow of events and order:
![image](https://user-images.githubusercontent.com/55125302/197538089-9c74663c-fdc3-44f4-bbf0-8439dad20dea.png)



### events

``` javaScript
  /*   Drag Events Listener STarts (developer work) */
  $(document).on('CanvasDragStart', function(e, eventInfo) {
    console.log("My First Drag Event listener.", eventInfo);

  });
  /*CanvasDragOver returns 2 events CanvasDragOver and mouse move js events with datatransfet object*/
  $(document).on('CanvasDragOver', function(e, eventInfo) {
    console.log("Reciveing Datatransfer shape from drag event listener ", eventInfo);
    $(document).on('CanvasDrop', function(e, eventInfo) {

  });

  $(document).on('CanvasRelaseCancel', function(e, eventInfo) {
    console.log("Reciveing Datatransfer from drag relase cancel this new event data just info and used for back any changes made if drag faliure also let u able even to make changes using data transfer when event cancled on canvas shape for example game and user not able to drop this item in required place so hide this item for
  });


  /*Event canvasStampClick one element clicked [list of clicked shapes length is 1]*/
  $(document).on('canvasStampClick', function(e, eventInfo) {
    console.log("canvasStampClick event listener CanvasEvents", e, eventInfo);
  });
  
  /*canvasGroupStampClick more than one element clicked in same time so [list of clicked shapes length > 1] */
  $(document).on('canvasGroupStampClick', function(e, eventInfo) {
    console.log("canvasGroupStampClick event listener CanvasEvents", e, eventInfo);
  });

  /* onStampMouseEnter (1 time called only when enter stamp) */
  $(document).on('stampMouseEnter', function(e, eventInfo) {
  });

  /* onStampMouseEnter (1 time called only when enter stamp) */
  $(document).on('stampMouseOut', function(e, eventInfo) {
    console.log("stamp stampMouseOut event listener");
  });

  /*remove stamp event listener */
  $(document).on('canvasStampRemove', function(e, eventInfo) {
    console.log("canvasStampRemove event listener", e, eventInfo);
  });


### what this framework provide more than normal javaScript and normal drag and drop API:


1. canvasGroupStampClick
2. CanvasRelaseCancel

3- on drag and drop event, all data saved in list in painter object can be sent by settimeout/socket-ajax/socket to server in any time with timestamps as unique id aslo with the all data of event and data transferobject to trace the game changes or even try make performance by wait at some time and make all changes once with 1 request per period of time.
```

### License

MIT License


###### Created By Python King.








