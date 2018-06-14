function moveBlock(block) {
     block.onmousedown = function(e) {       // start moving on first click
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
