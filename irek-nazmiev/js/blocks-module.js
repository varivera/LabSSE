var maxBlockId = 0;

function addBlock(content) {
     var fieldMovable = document.getElementById('field-movable'),
         fieldMovableCoords = fieldMovable.getBoundingClientRect();

     var inputConnector = createConnector("input"),
         outputConnector = createConnector("output");

     var inputCons = createConWrapper("input"),
         outputCons = createConWrapper("output");

     var block = createBlock();

     var maxConId = 0;

     if (content == 'input') {
          appendChildren(0, 1);
     } else if (content == 'output') {
          appendChildren(1, 0);
     } else if (content == 'isSubstring') {
          appendChildren(1, 1);
     } else if (content == 'replace') {
          appendChildren(3, 1);
     } else {
          appendChildren(2, 1);
     }

     fieldMovable.appendChild(block);

     function appendChildren(inConAmount, outConAmount) {

          fillConWrapper(inputCons, inputConnector, inConAmount);
          fillConWrapper(outputCons, outputConnector, outConAmount);

          function fillConWrapper(conWrapper, connectorType, conAmount) {
               for (i = 0; i < conAmount; i++) {
                    var conClone = connectorType.cloneNode();
                    conClone.textContent = block.name + "-" + maxConId++;
                    conWrapper.appendChild(conClone);
               }
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
