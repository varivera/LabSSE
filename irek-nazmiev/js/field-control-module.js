var isBusy = false;

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

                         document.onmousemove = function(e) {    // when mouse is moving, change block's coordinates
                                   var fieldMovableCoords = field.children[0].getBoundingClientRect();
                                   block.style.left = e.pageX - shiftX - fieldMovableCoords.left + 'px';
                                   block.style.top = e.pageY - shiftY - fieldMovableCoords.top + 'px';

                                   x = e.pageX;
                                   y = e.pageY;
                         };

                         block.onmouseup = function() {          // stop moving on second click
                              document.onmousemove = null;
                              block.onmouseup = null;
                              block.parentElement.style.zIndex = "unset";
                              if (isInTrashCan(x, y))
                                   block.remove();
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

function connect(connector) {
     if (connector.name == 'no-con' && !isBusy) {
          isBusy = true;
          var conCoords = connector.getBoundingClientRect(),
              fieldMovableCoords = field.children[0].getBoundingClientRect(),
              x1 = conCoords.x - fieldMovableCoords.x + 5,
              y1 = conCoords.y - fieldMovableCoords.y + 5,
              line = createLineElement(x1, y1, x1, y1);
          field.children[0].appendChild(line);

          document.onmousemove = function(e) {
               var fieldMovableCoords = field.children[0].getBoundingClientRect(),
                   x2 = e.pageX - fieldMovableCoords.x,
                   y2 = e.pageY - fieldMovableCoords.y;

               updateLineElement(line, x1, y1, x2, y2);

               document.onclick = function(e) {
                    if (e.target.name == 'no-con' && (connector.className != e.target.className) && (connector.parentElement.parentElement != e.target.parentElement.parentElement)) {
                         e.target.name = 'con';
                         connector.name = 'con';
                         document.onmousemove = null;
                         document.onclick = null;
                         isBusy = false;
                    }
               }

               document.oncontextmenu = function(e) {
                    document.onmousemove = null;
                    document.onclick = null;
                    line.remove();
                    isBusy = false;
               }
          };
     }
}
