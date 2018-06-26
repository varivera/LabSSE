var isBusy = false;

// move the block related to field-movable or delete it with all connected wires
function moveBlock(block) {
     block.onmousedown = function(e) {       // start moving when holding left click btn
          if (blockIsAvailable()) {
               var x, y,
                   blockCoords = block.getBoundingClientRect(),
                   shiftX = e.pageX - blockCoords.left,
                   shiftY = e.pageY - blockCoords.top,
                   fieldMovable = document.getElementById('field-movable'),
                   fieldMovableCoords = fieldMovable.getBoundingClientRect(),
                   trashCanWrapper =
                       document.getElementById("trash-can-wrapper"),
                   linesList = findConnectedLines(block),
                   connectors = findConnectedCons(linesList);

               isBusy = true;
               fieldMovable.style.zIndex = 1000;  // move block on foreground
               trashCanWrapper.style.left = 0;    // show the trash can

               linesList.forEach(function(line) {
                    var angle = +line.style.transform.slice(7, -4),
                        lineCoords = findRightCoords(angle);

                    // change line element on object with its necessary data
                    linesList[linesList.indexOf(line)] = {
                         item: line,
                         x1: lineCoords.x1,
                         y1: lineCoords.y1,
                         x2: lineCoords.x2,
                         y2: lineCoords.y2,
                         shiftX1: lineCoords.x1 - e.pageX,
                         shiftY1: lineCoords.y1 - e.pageY,
                         shiftX2: lineCoords.x2 - e.pageX,
                         shiftY2: lineCoords.y2 - e.pageY,
                    };

                    // determine head and tail points and find theit coordinates
                    function findRightCoords(angle) {
                         var lineCoords = line.getBoundingClientRect();

                         if (angle >= 0 && angle <= Math.PI/2) {
                              var x1 = lineCoords.x - fieldMovableCoords.x,
                                  y1 = lineCoords.y - fieldMovableCoords.y,
                                  x2 = lineCoords.right - fieldMovableCoords.x,
                                  y2 = lineCoords.bottom - fieldMovableCoords.y;
                         } else if (angle > Math.PI/2 && angle <= Math.PI) {
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

                         return {
                              x1: x1,
                              y1: y1,
                              x2: x2,
                              y2: y2
                         };
                    }
               });

               // when mouse is moving, change block's coordinates
               document.onmousemove = function(e) {
                    block.style.left = e.pageX - shiftX
                                     - fieldMovableCoords.left + 'px';
                    block.style.top = e.pageY - shiftY
                                    - fieldMovableCoords.top + 'px';

                    // update all lines connected to moving block
                    linesList.forEach(function(line) {
                         if (headConIsOnBlock(line, block)) {    // head is here
                              var x1 = e.pageX + line.shiftX1,
                                  y1 = e.pageY + line.shiftY1;
                              updateLine(line.item, x1, y1, line.x2, line.y2);
                         } else {
                              var x2 = e.pageX + line.shiftX2,
                                  y2 = e.pageY + line.shiftY2;
                              updateLine(line.item, line.x1, line.y1, x2, y2);
                         }

                         function headConIsOnBlock(line, block) {
                              return line.item.textContent.split('-')[0]
                                   == block.name;
                         }
                    });

                    x = e.pageX;   // save last cursor's coordinates
                    y = e.pageY;
               }

               block.onmouseup = function(e) {   // stop moving when end holding left click btn
                    document.onmousemove = null;
                    block.onmouseup = null;
                    fieldMovable.style.zIndex = "unset";

                    if (isInTrashCan(x, y)) {
                         linesList.forEach(function(line) {
                              line.item.remove();
                         });
                         connectors.forEach(function(connector) {
                              connector.name = "no-con";
                         });

                         block.remove();
                    }

                    trashCanWrapper.style.left = "-20vw";
                    isBusy = false;
               }

               function isInTrashCan(x, y){
                    var trashCan = document.getElementById('trash-can'),
                        trashCanCoords = trashCan.getBoundingClientRect();

                    return x >= trashCanCoords.left &
                           x <= (trashCanCoords.left + trashCanCoords.width) &
                           y >= trashCanCoords.top &
                           y <= (trashCanCoords.top + trashCanCoords.height);
               }

               function findConnectedLines(block) {
                    var linesList = document.getElementsByClassName('line');

                    linesList = [].slice.call(linesList);
                    linesList = linesList.filter(function(line) {
                         return line.textContent.includes(block.name + "-");
                    });

                    return linesList;
               }
          }

          function blockIsAvailable() {
               return !isBusy && e.button == 0;
          }
     }
}

// move the field and all blocks inside while holding right-click button and
// moving the cursor. Actually we move hidden block and all the blocks inside
// have coordinates related to this block and are also being moved
function moveField() {
     var fieldMovable = document.getElementById('field-movable');

     field.onmousedown = function(e) {
          if (!isBusy) {
               if (e.button == 2) {     // right-click button
                    var fieldMovableCoords = fieldMovable.getBoundingClientRect(),
                        shiftX = e.pageX - fieldMovableCoords.left,
                        shiftY = e.pageY - fieldMovableCoords.top;

                    // change field-movable block's position
                    field.onmousemove = function(e) {
                         fieldMovable.style.left = e.pageX - shiftX + 'px';
                         fieldMovable.style.top = e.pageY - shiftY + 'px';
                    }

                    // stop moving
                    document.onmouseup = function() {
                         field.onmousemove = null;
                         document.onmouseup = null;
                    }
               }
          }
     }

     field.oncontextmenu = function(e) {   // not to show the context menu
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
     };
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
     headConnector.onclick =  function(e) {
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
                                   headConnector.textContent + "|"
                                        + tailConnector.textContent;

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
     }

     headConnector.oncontextmenu = function(e) {
          if (headConnector.name == "con" && !isBusy) {
               var linesList = document.getElementsByClassName('line');
               linesList = [].slice.call(linesList);
               linesList = linesList.filter(function(line) {
                    return line.textContent.includes(headConnector.textContent);
               });
               consList = findConnectedCons(linesList);
               linesList.forEach(function(line) {
                    line.remove();
               });
               consList.forEach(function(con) {
                    con.name = "no-con";
               });
          }
     }

     function startConnectingIsAvailable() {
          return (!isConnected(headConnector) ||
               headConnector.className == "out-con con") && !isBusy;
     }

     function finishConnectingIsAvailable(tailConnector) {
          return isConnector(tailConnector) &&
                    (!isConnected(tailConnector) || tailConnector.className == "out-con con") &&
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
          return elem.className.includes('con ');
     }

     function isConnected(connector) {
          return connector.name == 'con';
     }

     function getGrandParent(elem) {
          return elem.parentElement.parentElement;
     }
}

function findConnectedCons(linesList) {
     var consList = document.getElementsByClassName('con'),
         consIds = [];

     linesList.forEach(function(line) {
          conPairIds = line.textContent.split('|');
          consIds.push(conPairIds[0], conPairIds[1]);
     });

     consList = [].slice.call(consList);
     consList = consList.filter(function(con) {
          return consIds.includes(con.textContent);
     });

     return consList;
}
