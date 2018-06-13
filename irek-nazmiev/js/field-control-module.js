function moveBlock(block) {
     block.onmousedown = function(e) {       // start moving on first click
          var x, y;

          var blockCoords = block.getBoundingClientRect(),
              shiftX = e.pageX - blockCoords.left,
              shiftY = e.pageY - blockCoords.top;

          block.style.zIndex = 1000;
          document.getElementById("trash-can-wrapper").style.bottom = 0;

          document.onmousemove = function(e) {    // when mouse is moving, change block's coordinates
               block.style.left = e.pageX - shiftX + 'px';
               block.style.top = e.pageY - shiftY + 'px';
               x = e.pageX;
               y = e.pageY;
          };

          block.onmouseup = function() {          // stop moving on second click
               document.onmousemove = null;
               block.onmouseup = null;
               block.style.zIndex = "unset";
               if (isInTrashCan(x, y))
                    block.remove();
               document.getElementById("trash-can-wrapper").style.bottom = "-15.7vh";
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
