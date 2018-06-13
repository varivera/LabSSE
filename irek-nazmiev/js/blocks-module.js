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

function addBlock(type) {
     switch(type) {
          case "input":
               break;
          case "output":
               break;
          case "add":
               break;
          case "sub":
               break;
          case "mult":
               break;
          case "div":
               break;
          case "replace":
               break;
          case "is-substring":
               break;
          case "concatenate":
               break;
     }
}
