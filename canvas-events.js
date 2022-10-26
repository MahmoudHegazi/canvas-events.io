var stampsSettings = {
  mouseEnterStamp: false,
  dragStartSuccessStampCb: null,
  dragStartfalidStampCb: null,
  currentMouseEnters: [],
  currentMouseEntersShapes: []
}

let dataTransfer = {};


function getTheNotNullID(dataObj) {
  for (key in dataObj) {
    if (dataObj[key] && dataObj[key]['getData'] && dataObj[key]['getData']['status'] == "processing") {
      return dataObj[key];
    }
  }
}

function updateDataTransferStatus(dataObj, status = 'completed') {
  for (key in dataObj) {
    if (dataObj[key] && dataObj[key]['getData'] && dataObj[key]['getData']['status'] == "processing") {
      dataObj[key]['getData']['status'] = status;
      return dataObj;
    }
  }
  return dataObj;
}


var settings = {
  holdWait: 30,
  delayBeforeLastCursor: 150,
  mouseDragStart: false,
  mouseDragEvent: false,
  isMouseDown: false,
  isMouseDownAndMoved: false,
  lastCursorTimeout: null,
  mouseDownTimeouts: [],
  eventCursors: {
    dragEnd: 'default',
    dragStart: 'grab',
    drageOver: 'grabbing',
    dragRelaseCancel: 'none',
    dragOverOutTarget: 'no-drop',
    drop: 'grab'
  },
  canvasSelector: ''
}


function setStyles() {
  const iconImages = document.querySelectorAll("img.icon_image");
  const projectImage = document.querySelector("img#project_image");
  if (projectImage) {
    projectImage.style.position = "absolute";
    projectImage.style.left = "6000px";
  }
  if (iconImages) {
    iconImages.forEach((elm) => {
      elm.style.position = "absolute";
      elm.style.left = "6000px";
    });
  }

}


const projectImage = document.getElementById("project_image");


/* ------------------------------------**/


function clearTimeouts(timeOutsList) {
  timeOutsList.forEach((timeout) => {
    if (timeout) {
      clearTimeout(timeout);
    }
  });
  return [];
}
/*function to validate if the data transfer object hold all event data */
function isValidDragTransferObj(transferObj) {
  return transferObj && transferObj.uniqueid && dataTransfer[transferObj.uniqueid] && dataTransfer[transferObj.uniqueid].getData && dataTransfer[transferObj.uniqueid].getData.data && dataTransfer[transferObj.uniqueid].getData.event;
}



//startDragLeaveListener
function mouseDownChecker(event, elmSelector) {
  /* if user hold mouse for 500 mileseconds triger this event*/
  let oneI = Math.floor(settings.holdWait / 3);
  settings.mouseDownTimeouts = clearTimeouts(settings.mouseDownTimeouts);
  let timeoutI = 0;
  for (let i = 0; i < 3; i++) {
    let mDownTimeout = setTimeout(() => {

      console.log(settings.isMouseDown);


      /*now by adding check for stampsSettings.mouseEnterStamp which connect this native drag event and stamps event and start drag only when on shape best perofrmance */
      if (i == 2 && settings.isMouseDown == true && stampsSettings.mouseEnterStamp) {

        /* on drag start event */
        settings.mouseDragStart = true;
        console.log('On drag start event', timeoutI);
        /* here start check for mouse hold relase event lets say parent and child events */
        settings.mouseDownTimeouts = clearTimeouts(settings.mouseDownTimeouts);

        /* add event listener that look for move after draging started also this move event cleared when releas */
        $(elmSelector).bind("mousemove.dragStart", (event) => {
          drageOverCB(event, elmSelector);
        });
        onDragStartCB(event, elmSelector);


      }
    }, timeoutI);
    timeoutI += oneI;
    settings.mouseDownTimeouts.push(mDownTimeout);
  }

}

/* on drag start callback
more info Look Document for drag over event
*/
function onDragStartCB(event, elmSelector) {

  const thisDragEvent = event;
  /*connection to start draging canvas item, check if user within the stamp this value auto changed */
  console.log('here', stampsSettings.mouseEnterStamp === true);
  if (settings.mouseDragStart === true) {

    /* #############    Here First Reciving OF stamps event data of shapes     ###################### */
    if (stampsSettings.dragStartSuccessStampCb) {
      /* let stamps call back set the stamp and event data then get it here within drag event dragStartSuccessStampCb void function for setting data like object java set data */
      stampsSettings.dragStartSuccessStampCb();
      /* here get the unique id*/
      console.log("Here Recived Shape and event data ", getTheNotNullID(dataTransfer));
    }

    if (dataTransfer) {

      const transferObj = getTheNotNullID(dataTransfer);

      if (isValidDragTransferObj(transferObj)) {

        $(document).trigger('CanvasDragStart', {
          shape: dataTransfer[transferObj.uniqueid].getData.data,
          event: dataTransfer[transferObj.uniqueid].getData.event,
          event_id: transferObj.uniqueid,
          transferObjState: transferObj,
          dragEvent: thisDragEvent
        });
      }
    }

    document.body.style.cursor = settings.eventCursors.dragStart;
    console.log("DragStart Event: trigered one time  before drag over event and after set all drag start process.");


    /* this first relation of events betwen drag start and drag leave , the mouseout start binded here in this point of time*/
    startDragLeaveListener(event, elmSelector);

  }
}



/* drave over like mouseover like draging */
function drageOverCB(event, elmSelector) {
  /* get the draged shape data object  from dataTransfer object */

  const thisDragEvent = event;
  if (settings.mouseDragStart === true) {

    settings.isMouseDownAndMoved = true;
    settings.mouseDragEvent = true;
    document.body.style.cursor = settings.eventCursors.drageOver;
    console.log("on drag event mouse move while mouse was holded on mouse drag event ");
    if (dataTransfer) {
      /*  console.log("Reciveing Datatransfer and trigger dragover", transferObj); */
      const transferObj = getTheNotNullID(dataTransfer);
      if (isValidDragTransferObj(transferObj)) {
        $(document).trigger('CanvasDragOver', {
          shape: dataTransfer[transferObj.uniqueid].getData.data,
          event: dataTransfer[transferObj.uniqueid].getData.event,
          event_id: transferObj.uniqueid,
          elmSelector: elmSelector,
          transferObjState: transferObj,
          dragEvent: thisDragEvent
        });

      }
    }



  }
}

function dragLeaveCB(event, elmSelector = settings.canvasSelector) {
  /*  unbound drag leave listener until enter set it */
  $(elmSelector).unbind("mouseout.dragover_out_target");

  document.body.style.cursor = settings.eventCursors.dragOverOutTarget;

  console.log("DragEventLeave: !!! HI, Iam dragleave event trigger one time when item outside drop area (mouseout-while draging event is on");

  /* start listen for drag mouse enter after drag leave event fired and finish all it's process */
  startDragEnterListener(event, elmSelector);
}


function dragEnterCB(event, elmSelector = settings.canvasSelector) {
  $(elmSelector).unbind("mouseenter.dragover_enter_target", );

  console.log("DragEventEnter: !!! HI, Iam  event drag event enter trigger one time one drag item draged back to drop area (mouseenter-while draging is on");

  /* to continue cycle, drag leave event at end of its process bind enter event liting and now after enter finished all process start listing back for drag leave, at drag end any drag event removed  */
  startDragLeaveListener(event, elmSelector);

}


/* On drop event */
function dragDropCB(event, elmSelector) {
  console.log("Drop Event: happend after mouseup while dragging is on within the draop area I trigger dropend event after I finished with cancel false status");
  document.body.style.cursor = settings.eventCursors.drop;

  /* trigger CanvasDrop event */
  if (dataTransfer) {
    /*  console.log("Reciveing Datatransfer and trigger dragover", transferObj); */
    const transferObj = getTheNotNullID(dataTransfer);
    if (isValidDragTransferObj(transferObj)) {
      $(document).trigger('CanvasDrop', {
        shape: dataTransfer[transferObj.uniqueid].getData.data,
        event: dataTransfer[transferObj.uniqueid].getData.event,
        event_id: transferObj.uniqueid,
        elmSelector: elmSelector,
        transferObjState: transferObj,
        dropEvent: event
      });

    }
  }
  dragEndCB(event, elmSelector, false);
}


/* image is moved by developer user in event listener so any cancel will not move image from beging */
function dragRelaseCancelCB(event, elmSelector, externalTagret) {

  document.body.style.cursor = settings.eventCursors.dragRelaseCancel;
  console.log("drag relase cancel event when drop items outside the target drop area this called before drag end event to fix the drag changes made");

  /* trigger CanvasRelaseCancel event New Event to web */
  if (dataTransfer) {
    /*  console.log("Reciveing Datatransfer and trigger dragover", transferObj); */
    const transferObj = getTheNotNullID(dataTransfer);
    if (isValidDragTransferObj(transferObj)) {
      $(document).trigger('CanvasRelaseCancel', {
        shape: dataTransfer[transferObj.uniqueid].getData.data,
        event: dataTransfer[transferObj.uniqueid].getData.event,
        event_id: transferObj.uniqueid,
        elmSelector: elmSelector,
        transferObjState: transferObj,
        relaseCancelEvent: event
      });

    }
  }
  dragEndCB(event, elmSelector, true);
}



let lastCursorTimeout = null;
/* settings.canvasSelector should never becuase all cycles provide elmSelector, but this last plan in case missing settings.canvasSelector */
function dragEndCB(event, elmSelector = settings.canvasSelector, cancled = false) {

  settings.isMouseDown = false;
  settings.mouseDragStart = false;
  settings.mouseDragEvent = false;
  settings.isMouseDownAndMoved = false;
  $(elmSelector).unbind("mousemove.dragStart");
  $(elmSelector).unbind("mouseup.dragevent_relase_outside");

  /* out then enter that drag one possible option for drag enter */
  $(elmSelector).unbind("mouseout.dragover_out_target");

  $(elmSelector).unbind("mouseenter.dragover_enter_target");

  /* delay before style change of cursor */
  if (lastCursorTimeout) {
    clearTimeout(settings.lastCursorTimeout);

  }
  settings.lastCursorTimeout = setTimeout(() => {
    document.body.style.cursor = settings.eventCursors.dragEnd;
  }, settings.delayBeforeLastCursor);

  /*here we set the last transaction status to completed or cancled*/
  if (cancled) {
    dataTransfer = updateDataTransferStatus(dataTransfer, 'cancled');
  } else {
    dataTransfer = updateDataTransferStatus(dataTransfer, 'completed');
  }

  console.log("on drag end event, Cancled:", cancled);
}




/* drag leave must happend before enter becuase targetdrop and target item container are the canvas 1 elm so you can not enter  and out from same element must out from same elm and  then enter back to same element */

function startDragLeaveListener(event, elmSelector = settings.canvasSelector) {

  $(elmSelector).on('mouseout.dragover_out_target', function(event) {
    if (settings.mouseDragStart && settings.mouseDragEvent) {
      console.log("hi started leave check listing");
      dragLeaveCB(event, elmSelector);

    }


  });
}
/* relation function starat listing for drag enter event after drag start event complete this performance/async level to to be same point of time of listing and triger js event listeners used*/
function startDragEnterListener(event, elmSelector = settings.canvasSelector) {
  $(elmSelector).on('mouseenter.dragover_enter_target', function(event) {

    if (settings.mouseDragStart && settings.mouseDragEvent) {
      console.log("hi started drag enter check listing");
      dragEnterCB(event, elmSelector);

    }



  });


}

/*main function*/
function startCanvasEvents(elmSelector, projectStamps, eventsSettings=null,stampEventsOn=true, stampEventsMouseOn=true, hoverBgZero= "rgba(50, 250,10, 0.3)", hoverBgOne="rgba(170, 170,240, 0.3)") {

if (eventsSettings){
  settings = eventsSettings;
}

const painter = {
/* easly controll the events and close them*/
stampEventsOn : stampEventsOn,
stampEventsMouseOn : stampEventsMouseOn,
currentMouseEnters : [],
currentMouseEntersShapes : [],
borders : [],
hoverBgZero : hoverBgZero,
hoverBgOne : hoverBgOne,
canvas : null,
ctx : null,
projectStamps: projectStamps,
currentShapes: projectStamps,


CanvasHoverEffect(stamp) {

  if (!validStampObj(stamp)) {
    console.log("can not add stamp, invalid object");
    return false;
  }


  const border = {
    id: this.borders.length,
    frogienKey: stamp.id,
    title: 'border',
    x: stamp.x,
    y: stamp.y,
    w: stamp.w + 1,
    h: stamp.h + 1
  };

  var grd = this.ctx.createLinearGradient(0, 0, 50, 0);
  grd.addColorStop(0, this.hoverBgZero);
  grd.addColorStop(1, this.hoverBgOne);
  this.ctx.fillStyle = grd;
  this.ctx.fillRect(border.x, border.y, border.w, border.h);
  this.borders.push(border);


},

removeBorder(stampPrimaryKey) {
  let targetI = false;
  for (let i = 0; i < this.borders.length; i++) {
    if (this.borders[i].frogienKey == stampPrimaryKey) {
      targetI = i;
      break;
    }
  }
  if (targetI !== false) {
    /* remove the stamp from drawing stamps list and redraw the data */
    this.borders.splice(targetI, 1);
    this.drawProject(this.canvas, this.ctx, this.projectStamps);
  }
},


addStamp(stamp) {

  if (!validStampObj(stamp)) {
    console.log("can not add stamp, invalid object");
    return false;
  }

  const image = document.getElementById(stamp.image_id);
  stamp['w'] = image.getBoundingClientRect().width;
  stamp['h'] = image.getBoundingClientRect().height;

  this.ctx.drawImage(image, stamp.x, stamp.y, stamp.w, stamp.h);
  this.currentShapes.push(stamp);
  return stamp;

},



clearCanvas() {
  this.currentShapes = [];
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  return true;
},



 drawProject() {
  
  this.clearCanvas();
  

  if (projectImage) {
    this.ctx.drawImage(projectImage, 0, 0);
  }

  this.projectStamps.forEach((stamp) => {
    this.addStamp(stamp);
  });
  // console.log(currentShapes);
},

removeStamp(targetId) {
  let targetI = false;
  for (let i = 0; i < this.projectStamps.length; i++) {
    if (this.projectStamps[i].id == targetId) {
      targetI = i;
      break;
    }
  }
  if (targetI !== false) {
    /* remove the stamp from drawing stamps list and redraw the data */
    this.projectStamps.splice(targetI, 1);
    this.drawProject(this.canvas, this.ctx, this.projectStamps);
    $(document).trigger('canvasStampRemove', {
      shape: this.projectStamps[targetI]
    });
  }
},


/*normal function to move icon on canvas (user add his function) this called in canvas drop event*/
MoveStampIcon(targetId, newX, newY) {

  if (!targetId || !newX || !newY) {
    console.log("missing one or more of required arugments", targetId, newX, newY);
    return null;
  }
  if (isNaN(newX) || isNaN(newY)) {
    console.log("invalid x or y options only numbers accepted", newX, newY);
    return null;
  }



  let targetI = false;
  for (let i = 0; i < this.projectStamps.length; i++) {
    if (this.projectStamps[i] && this.projectStamps[i].id == targetId) {
      targetI = i;
      break;
    }
  }
  /*just very simple change the x and y of the tagret shape object and redraw app no delete and recreate */
  if (targetI !== false) {
    this.projectStamps[targetI]['x'] = newX;
    this.projectStamps[targetI]['y'] = newY;
    this.drawProject(this.canvas, this.ctx, this.projectStamps);
    console.log("\n\n\n\n hi", targetId, "\n\n\n\n\n");
    return this.projectStamps[targetI];
  }

  return null;
},


};






painter.canvas = document.querySelector(elmSelector);
painter.ctx = painter.canvas.getContext("2d");

  mouseEnterAndOutCB(painter.canvas, painter.currentShapes, painter.projectStamps);
  clickAndUnClickCB(painter.canvas,painter.currentShapes, painter.projectStamps);
  const canvas = painter.canvas;

  if (!$(elmSelector).length) {
    console.log(`invalid selector provided ${elmSelector}`);
    return false;
  }
  setStyles();
  settings.canvasSelector = elmSelector;
  $(elmSelector).addClass("noselect");
  fixDargConfliect(elmSelector);


  $(document).on('mouseup.dragevent_relase_outside', function(event) {
    /*isMouseDown maybe true when first mouse down pressed */
    if (settings.mouseDragStart || settings.mouseDragEvent) {
      /* here point of time before call drag end with cancel status */
      console.log("here checked the user drag item outside drop area and dropped it ");

      dragRelaseCancelCB(event, elmSelector, document);
    }
  });


  $(elmSelector).on('mousedown.dragevent mouseup.dragevent', function mouseState(e) {



    /*save cancel infiate mousdrageover listener*/

    if (e.type == "mousedown") {
      //code triggers on mouse hold
      settings.isMouseDown = true;
      mouseDownChecker(e, elmSelector);


    } else {
      /*removing isMouseDown always to not count click relase as dragevent relase event */
      settings.isMouseDown = false;
      if (settings.mouseDragEvent == true) {
        /* on mouse drag relase event [drag drop event] trigger point of time*/
        dragDropCB(event, elmSelector);
      }
    }

  });
  
  painter.drawProject();
  
  return painter;




}


/*for fit this library dynamic get all page dragable elements */
function getDragableElms() {
  const dragablePageElms = [];
  var allElms = document.getElementsByTagName("*");

  for (var i = 0, max = allElms.length; i < max; i++) {
    if (allElms[i].draggable == true) {
      //console.log(allElms[i].draggable == true);
      dragablePageElms.push(allElms[i]);
    }
    // Do something with the element here
  }
  return dragablePageElms;
}

function fixDargConfliect(elmSelector) {
  const AllDragbleElms = getDragableElms();
  if (AllDragbleElms && AllDragbleElms.length) {
    AllDragbleElms.forEach((dragableEvent) => {

      /* end mouse drag This drag event fix so it ended  only with cancel status becuase it will never start custom drag */
      $(dragableEvent).on('drag', (event) => {
        if (settings.mouseDragEvent || settings.isMouseDown || settings.mouseDragStart) {
          dragEndCB(event, elmSelector, true);
        }
      });


    });
  }
}





/* AI event listener fired when any shapes taregts clicked on canvas fast and accurate */
function validStampObj(stamp) {
  if (!stamp || typeof(stamp.x) !== 'number' || typeof(stamp.y) !== 'number' || typeof(stamp.image_id) === 'undefined' || !document.getElementById(stamp.image_id)) {
    return false;
  } else {
    return true;
  }
}

/*return array*/
function detectMouseOverObjects(championCompass, currentShapes) {

  let clickedShapes = [];
  currentShapes.forEach((shape) => {
    if (championCompass.x > shape.x && championCompass.x < shape.x + shape.w && (championCompass.y > shape.y && championCompass.y < shape.y + shape.h)) {
      clickedShapes.push(shape);
    }
  });
  return clickedShapes;
}



/*function take mouse over or mouse click event and allIcons object and detect is this click or move over one or more shapes*/

function getMouseOverObjectsData(Event, currentShapes, projectIcons) {
  let data = [];
  if (!projectIcons) {
    return data
  };

  const dataObj = {
    event: Event,
    x: Event.clientX,
    y: Event.offsetY
  };
  projectIcons.forEach((icon) => {
    dataObj['w'] = icon.w;
    dataObj['h'] = icon.h;
    data = detectMouseOverObjects(dataObj, currentShapes);

  });
  return data;
}




/*detect when mouse enter icon or out while moving*/
function mouseEnterAndOutCB(canvasElm, currentShapes=[], projectStamps) {
  /* mousemove on canvas but target generate mouse was enter stamp but it now mouseover with js best was excute one time detect shapes but mouse enter in canvasevents */

  
  canvasElm.addEventListener("mousemove", (event) => {

    const data = getMouseOverObjectsData(event, currentShapes, projectStamps);

    if (data && data.length) {
      /* stamp mouse move and mouse enter events */
      data.forEach((shape) => {
        /* canvasEvents mouse enter */
        if (!stampsSettings.currentMouseEnters.includes(shape.id)) {


          stampsSettings.currentMouseEntersShapes.push(shape);
          stampsSettings.currentMouseEnters.push(shape.id);
          /*set first then trigger so event if need check will asynced*/

          stampsSettings.mouseEnterStamp = true;
          stampsSettings.dragStartSuccessStampCb = function() {
            const stampShape = shape;
            const stampEvent = event;
            const timeId = new Date().getTime();

            /*set/sent the shape object to data transfer to use my dragging functions */
            dataTransfer[timeId] = {
              uniqueid: timeId,
              getData: {
                data: shape,
                event: event,
                status: 'processing'
              }
            }
            return true;
          };

          $(document).trigger('stampMouseEnter', {
            shape: shape,
            shapes: data,
            event: event
          });

        }
      });
    } else {
      /*this first event mouseout call direct after mouse over  stamp event */
      /* stamp mouse out event (this generated from mousemove event) */



      if (stampsSettings.currentMouseEntersShapes.length > 0) {
        /*this means this first mouseout after mouse get out of stamp so we call our mouseout (remember this all mouse move event 3 from one also this make event call more performance as it call it only when stamp out not when mouse over no shapes work also with stampmouse over */
        stampsSettings.currentMouseEntersShapes.forEach((mouseOutShape) => {

          /* maybe mouse outed from more than one shape */
          /* set value for mouseEnterStamp to false */
          stampsSettings.mouseEnterStamp = false;
          /*trigger mouseout event per each icon even if cursor over more than one icon*/
          $(document).trigger('stampMouseOut', {
            shape: mouseOutShape,
            shapes: stampsSettings.currentMouseEntersShapes,
            shapesid: stampsSettings.currentMouseEnters,
            event: event
          });
        });

      }

      stampsSettings.currentMouseEnters = [];
      stampsSettings.currentMouseEntersShapes = [];
    }

    /* Here canvas shapes events data and mouse move within canvas   */
  });

}


/*used for generate stamp click event and unclick (click on empty area in canvas) canvasStampClick, canvasStampUnFocus */

function clickAndUnClickCB(canvasElm, currentShapes=[], projectStamps=[]) {

  canvasElm.addEventListener("click", (event) => {

    const data = getMouseOverObjectsData(event, currentShapes, projectStamps);

    /* valid stamp click accion event click */
    if (data && data.length > 0) {


      /*fire event for all clicked elements shapes */

      if (data.length == 1) {
        $(document).trigger('canvasStampClick', {
          shape: data[0],
          event: event
        });
      } else {
        $(document).trigger('canvasGroupStampClick', {
          shapes: data,
          event: event
        });
      }

    } else {
      /* trigger my custom event listener clickedEmptyArea no stamp unFocused stamp event (use it when work with stampclick) (when click on no stamps)*/
      $(document).trigger('canvasStampUnFocus', {
        event: event
      });
    }
    return false;
  });
}
