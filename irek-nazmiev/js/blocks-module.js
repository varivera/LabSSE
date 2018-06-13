function openCloseSpoiler(block) {
     if (block.name == "shown") {
          block.name = "hided";
          block.parentElement.children[1].style.display = "none";
     }
     else {
          block.name = "shown";
          block.parentElement.children[1].style.display = "block";
     }
}

function addBlock(content) {
     var block = document.createElement("button");
     block.className = "block";
     block.innerHTML = content;
     block.style.top = field.clientHeight / 2 + "px";
     block.style.left = field.clientWidth / 2 + "px";
     block.setAttribute("onmousemove", "moveBlock(this);");
     field.appendChild(block);
}

function moveBlock(block) {
     block.onmousedown = function(e) {       // start moving on first click
          var blockCoords = block.getBoundingClientRect();
          var shiftX = e.pageX - blockCoords.left;
          var shiftY = e.pageY - blockCoords.top;

          document.onmousemove = function(e) {    // when mouse is moving, change
               block.style.left = e.pageX - shiftX + 'px';
               block.style.top = e.pageY - shiftY + 'px';                       // block's coordinates
          };

          block.onmouseup = function() {          // stop moving on second click
               document.onmousemove = null;
               block.onmouseup = null;
          };
     }
}
