var maxBlockId = 0;

function addBlock(content) {
     var fieldMovable = document.getElementById('field-movable'),
         fieldMovableCoords = fieldMovable.getBoundingClientRect();

     var inputConnector = createConnector("input"),
         outputConnector = createConnector("output");

     var inputCons = createConWrapper("input"),
         outputCons = createConWrapper("output");

     if (content == 'input') {
          outputCons.appendChild(outputConnector);
     } else if (content == 'output') {
          inputCons.appendChild(inputConnector);
     } else if (content == 'isSubstring') {
          inputCons.appendChild(inputConnector);
          outputCons.appendChild(outputConnector);
     } else if (content == 'replace') {
          appendChildren(inputCons, inputConnector, 3);
          outputCons.appendChild(outputConnector);
     } else {
          appendChildren(inputCons, inputConnector, 2);
          outputCons.appendChild(outputConnector);
     }

     var block = createBlock();

     fieldMovable.appendChild(block);

     function appendChildren(parent, child, amount) {
          var kid;

          for (i = 0; i < amount; i++) {
               kid = child.cloneNode();
               kid.textContent = i;
               parent.appendChild(kid);
          }
     }

     function createConnector(type) {
          var connector = document.createElement("button");

          if (type == "input")
               connector.className = "in-con con";
          else if (type == "output")
               connector.className = "out-con con";
          else
               alert("ERROR! Wrong type of connector!");

          connector.setAttribute("onmousemove", "connect(this);");
          connector.name = "no-con";
          connector.textContent = "0";

          return connector;
     }

     function createConWrapper(type) {
          var conWrapper = document.createElement('div');

          if (type == "input")
               conWrapper.className = "input-connectors connectors";
          else if (type == "output")
               conWrapper.className = "output-connectors connectors";
          else
               alert("ERROR! Wrong type of connector!");

          return conWrapper;
     }

     function createBlock() {
          var block = document.createElement("button"),
              screenWidth = document.body.clientWidth,
              screenHeight = document.body.clientHeight;

          block.textContent = content;
          block.className = "block";
          block.style.left = -fieldMovableCoords.x + screenWidth/2 + 'px';
          block.style.top = -fieldMovableCoords.y + screenHeight/2 + 'px';
          block.setAttribute("onmousemove", "moveBlock(this);");
          block.name = maxBlockId++;

          block.appendChild(inputCons);
          block.appendChild(outputCons);

          return block;
     }
}

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
