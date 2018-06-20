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

function hideShowBlockPanel(block) {
     if (block.name == "shown") {
          block.name = "hided";
          block.style.backgroundImage = "url(img/right-arrow.png)";
          block.parentElement.style.left = "-20vw";
     }
     else {
          block.name = "shown";
          block.style.backgroundImage = "url(img/left-arrow.png)";
          block.parentElement.style.left = "0";
     }
}

function addBlock(content) {
     var inputConnectors = '<button class="in-con con" onclick="connect(this);" name="no-con"></button>',
         outputConnectors = '<button class="out-con con" onclick="connect(this);" name="no-con"></button>';
     var block = document.createElement("button");

     block.className = "block";
     block.name = maxId++;
     block.setAttribute("onmousemove", "moveBlock(this);");

     if (content == 'input')
          inputConnectors = "";
     else if (content == 'output')
          outputConnectors = "";
     else if (content == 'isSubstring')
          inputConnectors = inputConnectors.repeat(1);
     else if (content == 'replace')
          inputConnectors = inputConnectors.repeat(3);
     else
          inputConnectors = inputConnectors.repeat(2);

     block.innerHTML = content + '<div class="input-connectors connectors">' + inputConnectors
                     + '</div><div class="output-connectors connectors">' + outputConnectors
                     + '</div>';
     field.children[0].appendChild(block);
}
