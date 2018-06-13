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
