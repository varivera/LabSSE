var isBusy = false,
    maxId = 0;

function moveBlock(block) {
     block.onmousedown = function(e) {       // start moving on first click
          if (!isBusy && e.button == 0) {
               var x, y;

               var blockCoords = block.getBoundingClientRect(),
                   shiftX = e.pageX - blockCoords.left,
                   shiftY = e.pageY - blockCoords.top;

               block.parentElement.style.zIndex = 1000;
               document.getElementById("trash-can-wrapper").style.left = 0;

               var fieldMovableCoords = field.children[0].getBoundingClientRect();
               var linesList = [].slice.call(document.getElementsByClassName("line"));
               linesList = linesList.filter( function(line) {return line.textContent.includes(block.name)});

               linesList.forEach( function(line) {
                         var lineCoords = line.getBoundingClientRect(),
                             angle = +line.style.transform.slice(7, -4);

                         if (angle >= 0 && angle <= Math.PI / 2) {
                              var x1 = lineCoords.x - fieldMovableCoords.x,
                                  y1 = lineCoords.y - fieldMovableCoords.y,
                                  x2 = lineCoords.right - fieldMovableCoords.x,
                                  y2 = lineCoords.bottom - fieldMovableCoords.y;
                         } else if (angle > Math.PI / 2 && angle <= Math.PI) {
                              var x1 = lineCoords.right - fieldMovableCoords.x,
                                  y1 = lineCoords.y - fieldMovableCoords.y,
                                  x2 = lineCoords.x - fieldMovableCoords.x,
                                  y2 = lineCoords.bottom - fieldMovableCoords.y;
                         } else if (angle > Math.PI && angle <= 1.5*Math.PI) {
                              var x1 = lineCoords.right - fieldMovableCoords.x,
                                  y1 = lineCoords.bottom - fieldMovableCoords.y,
                                  x2 = lineCoords.x - fieldMovableCoords.x,
                                  y2 = lineCoords.y - fieldMovableCoords.y;
                         } else if (angle > 1.5*Math.PI && angle <= 2*Math.PI) {
                              var x1 = lineCoords.x - fieldMovableCoords.x,
                                  y1 = lineCoords.bottom - fieldMovableCoords.y,
                                  x2 = lineCoords.right - fieldMovableCoords.x,
                                  y2 = lineCoords.y - fieldMovableCoords.y;
                         }

                         linesList.splice(linesList.indexOf(line) + 1, 0, {
                              item: line,
                              x1: x1,
                              y1: y1,
                              x2: x2,
                              y2: y2,
                              shiftX1: x1 - e.pageX,
                              shiftY1: y1 - e.pageY,
                              shiftX2: x2 - e.pageX,
                              shiftY2: y2 - e.pageY,
                         });

                         linesList.splice(linesList.indexOf(line), 1);
               });

               document.onmousemove = function(e) {    // when mouse is moving, change block's coordinates
                    var fieldMovableCoords = field.children[0].getBoundingClientRect();

                    block.style.left = e.pageX - shiftX - fieldMovableCoords.left + 'px';
                    block.style.top = e.pageY - shiftY - fieldMovableCoords.top + 'px';

                    linesList.forEach( function(line) {
                         if (line.item.textContent.split('-')[0] == block.name) {    // head is here
                              var x1 = e.pageX + line.shiftX1,
                                  y1 = e.pageY + line.shiftY1;
                              updateLine(line.item, x1, y1, line.x2, line.y2)
                         } else {
                              var x2 = e.pageX + line.shiftX2,
                                  y2 = e.pageY + line.shiftY2;
                              updateLine(line.item, line.x1, line.y1, x2, y2)
                         }
                    });

                    x = e.pageX;
                    y = e.pageY;
               };

               block.onmouseup = function(e) {          // stop moving on second click
                    document.onmousemove = null;
                    block.onmouseup = null;
                    block.parentElement.style.zIndex = "unset";
                    if ( isInTrashCan(x, y) ) {
                         var linesList = [].slice.call( document.getElementsByClassName("line") );
                         linesList = linesList.filter( function(line) {return line.textContent.includes(block.name)} );
                         var connectors = [].slice.call( document.getElementsByClassName('con') );
                         connectors = connectors.filter( function(connector) {return connector.textContent.includes(block.name)} );
                         connectors.forEach( function(connector) { connector.name = "no-con"; } );
                         linesList.forEach( function(line) {line.remove();} );
                         block.remove();
                    }
                    document.getElementById("trash-can-wrapper").style.left = "-20vw";
               };

               function isInTrashCan(x, y){
                    var trashCanCoords = document.getElementById("trash-can").getBoundingClientRect();
                    return x >= trashCanCoords.left &
                           x <= (trashCanCoords.left + trashCanCoords.width) &
                           y >= trashCanCoords.top &
                           y <= (trashCanCoords.top + trashCanCoords.height);
               }
          }
     }
}

// move the field and all blocks inside while holding right-click button and
// moving the cursor. Actually we move hidden block and all the blocks inside
// have coordinates related to this block and are also being moved
function moveField() {
     block.onmousedown = function(e) {
          if (e.button == 2) {     // right-click button
               var fieldMovable = document.getElementById('field-movable'),
                   fieldMovableCoords = fieldMovable.getBoundingClientRect(),
                   shiftX = e.pageX - fieldMovableCoords.left,
                   shiftY = e.pageY - fieldMovableCoords.top;

               // change field-movable block's position
               block.onmousemove = function(e) {
                    fieldMovable.style.left = e.pageX - shiftX + 'px';
                    fieldMovable.style.top = e.pageY - shiftY + 'px';
               }

               // stop moving
               document.onmouseup = function() {
                    block.onmousemove = null;
                    document.onmouseup = null;
               }
          }
     }

     block.oncontextmenu = function(e) {   // not to show the context menu
          return false;                    // after pressing right-click button
     }
}

// get data for creating line (length, angle, top-left coordinates) from
// start and finish points
function calculateLineData(x1, y1, x2, y2) {
     var a = x1 - x2,         // cathetuses
         b = y1 - y2,
         length = Math.sqrt(a*a + b*b);      // hypothenus

     var sx = (x1 + x2)/2,    // middle point
         sy = (y1 + y2)/2;

     var x = sx - length/2,   // top-left coordinate
         y = sy;

     var angle = Math.PI - Math.atan2(-b, a);    // between line and horizontal

     return {
          x: x,
          y: y,
          length: length,
          angle: angle
     }
}

// return line element made by start and finish points
function createLine(x1, y1, x2, y2) {
     var line = document.createElement("div");

     updateLine(line, x1, y1, x2, y2);
     line.setAttribute('class', 'line');

     return line;
}

// change line's data depending on start and finish points
function updateLine(line, x1, y1, x2, y2) {
     var lineData = calculateLineData(x1, y1, x2, y2),
         styles = 'width: ' + lineData.length + 'px; '
                + 'transform: rotate(' + lineData.angle + 'rad); '
                + 'top: ' + lineData.y + 'px; '
                + 'left: ' + lineData.x + 'px;';

     line.setAttribute('style', styles);
}

// create the line with starting coordinates on connector and draw it while
// moving the cursor by updating its data depending on cursor's position
function connect(headConnector) {
     if (startConnectingIsAvailable()) {
          var conCoords = headConnector.getBoundingClientRect(),
              fieldMovable = document.getElementById('field-movable'),
              fieldMovableCoords = fieldMovable.getBoundingClientRect();
              x1 = conCoords.x - fieldMovableCoords.x + 5, // starting position
              y1 = conCoords.y - fieldMovableCoords.y + 5, // on head connector
              line = createLine(x1, y1, x1, y1);

          isBusy = true;
          fieldMovable.appendChild(line);    // create a line

          // drawing the line while moving cursor (change line's data depending
          // on starting point and cursor's coordinates)
          document.onmousemove = function(e) {
               var x2 = e.pageX - fieldMovableCoords.x,  // set up starting
                   y2 = e.pageY - fieldMovableCoords.y;  // coordinates

               updateLine(line, x1, y1, x2, y2);

               // connect the line after clicking on necessary connector
               document.onclick = function(e) {
                    var tailConnector = e.target;

                    if (finishConnectingIsAvailable(tailConnector)) {
                         // mark the line with its head and tail blocks' ids
                         line.textContent =
                              getGrandParent(headConnector).name +
                                   "-" + getGrandParent(tailConnector).name;
                         // mark connectors the same as connected line was
                         headConnector.textContent =
                              tailConnector.textContent = line.textContent;

                         // mark connected connectors
                         headConnector.name = tailConnector.name = 'con';
                         document.onmousemove = null;
                         document.onclick = null;
                         isBusy = false;
                    }
               }

               // cancel connecting by pressing right-click button
               document.oncontextmenu = function(e) {
                    if (isBusy) {
                         document.onmousemove = null;
                         document.onclick = null;
                         line.remove();
                         isBusy = false;
                    }
               }
          }
     }

     function startConnectingIsAvailable() {
          return !isConnected(headConnector) && !isBusy;
     }

     function finishConnectingIsAvailable(tailConnector) {
          return isConnector(tailConnector) &&
                    !isConnected(tailConnector) &&
                         connectorsHaveDifferentTypes() &&
                              !lieOnSameBlock();

          function connectorsHaveDifferentTypes() {
               return headConnector.className != tailConnector.className;
          }

          function lieOnSameBlock() {
               return getGrandParent(headConnector) ==
                    getGrandParent(tailConnector);
          }
     }

     function isConnector(elem) {
          return elem.className.includes('con');
     }

     function isConnected(connector) {
          return connector.name == 'con';
     }

     function getGrandParent(elem) {
          return elem.parentElement.parentElement;
     }
}
