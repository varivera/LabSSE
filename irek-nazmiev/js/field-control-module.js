var isBusy = false,
    maxId = 0;

function moveBlock(block) {
     block.onmousedown = function(e) {       // start moving on first click
          if (!isBusy) {
               if (e.button == 0) {
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
                                   updateLineElement(line.item, x1, y1, line.x2, line.y2)
                              } else {
                                   var x2 = e.pageX + line.shiftX2,
                                       y2 = e.pageY + line.shiftY2;
                                   updateLineElement(line.item, line.x1, line.y1, x2, y2)
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
}

function moveField(block) {
     block.onmousedown = function(e) {
          if (e.button == 2) {
               var blockCoords = block.children[0].getBoundingClientRect(),
                   shiftX = e.pageX - blockCoords.left,
                   shiftY = e.pageY - blockCoords.top;

               block.onmousemove = function(e) {
                    field.children[0].style.left = e.pageX - shiftX + 'px';
                    field.children[0].style.top = e.pageY - shiftY + 'px';
               }

               document.onmouseup = function() {
                    block.onmousemove = null;
                    document.onmouseup = null;
               }
          }
     }

     block.oncontextmenu = function(e) {
          return false;
     }
}

function createLineElement(x1, y1, x2, y2) {
     var line = document.createElement("div");
     var lineData = createLine(x1, y1, x2, y2);
     var styles = 'width: ' + lineData.length + 'px; '
                + 'transform: rotate(' + lineData.angle + 'rad); '
                + 'top: ' + lineData.y + 'px; '
                + 'left: ' + lineData.x + 'px;';
     line.setAttribute('style', styles);
     line.setAttribute('class', 'line');
     return line;
}

function createLine(x1, y1, x2, y2) {
     var a = x1 - x2,
         b = y1 - y2,
         length = Math.sqrt(a * a + b * b);

     var sx = (x1 + x2) / 2,
         sy = (y1 + y2) / 2;

     var x = sx - length / 2,
         y = sy;

     var angle = Math.PI - Math.atan2(-b, a);

     return {
          x: x,
          y: y,
          length: length,
          angle: angle
     };
}

function updateLineElement(line, x1, y1, x2, y2) {
     var lineData = createLine(x1, y1, x2, y2);
     var styles = 'width: ' + lineData.length + 'px; '
                + 'transform: rotate(' + lineData.angle + 'rad); '
                + 'top: ' + lineData.y + 'px; '
                + 'left: ' + lineData.x + 'px;';
     line.setAttribute('style', styles);
}

function connect(headConnector) {
     if (startConnectingIsAvailable()) {
          var conCoords = headConnector.getBoundingClientRect(),
              fieldMovableCoords = field.children[0].getBoundingClientRect(),
              x1 = conCoords.x - fieldMovableCoords.x + 5,
              y1 = conCoords.y - fieldMovableCoords.y + 5,
              line = createLineElement(x1, y1, x1, y1);

          isBusy = true;
          document.getElementById('field-movable').appendChild(line);

          document.onmousemove = function(e) {
               var x2 = e.pageX - fieldMovableCoords.x,
                   y2 = e.pageY - fieldMovableCoords.y;

               updateLineElement(line, x1, y1, x2, y2);

               document.onclick = function(e) {
                    var tailConnector = e.target;

                    if (finishConnectingIsAvailable(tailConnector)) {
                         line.textContent =
                              getGrandParent(headConnector).name +
                                   "-" + getGrandParent(tailConnector).name;
                         headConnector.textContent =
                              tailConnector.textContent = line.textContent;
                         
                         tailConnector.name = headConnector.name = 'con';
                         document.onmousemove = null;
                         document.onclick = null;
                         isBusy = false;
                    }
               }

               document.oncontextmenu = function(e) {
                    if (isBusy) {
                         document.onmousemove = null;
                         document.onclick = null;
                         line.remove();
                         isBusy = false;
                    }
               }
          };
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
