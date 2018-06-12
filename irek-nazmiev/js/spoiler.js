function openCloseSpoiler(block){
     if (block.name == "shown"){
          block.name = "hided";
          block.parentElement.children[1].style.display = "none";
     }
     else{
          block.name = "shown";
          block.parentElement.children[1].style.display = "block";
     }
}
