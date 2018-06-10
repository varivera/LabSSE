# Drag&Code site

This site allows user to write a program without coding - by interacting with blocks visually and intuitively.
User can add the preset program blocks into the field, move and connect them by lines representing inputs and outputs of the program blocks.

![Sketched example of blocks' group](https://github.com/varivera/LabSSE/blob/folder-design/irek-nazmiev/img/example-sketch.png?raw=true)

**There are 4 main types of blocks (and 9 blocks in common)**:
* Input
* Output
* Mathematical operations:
    * add
    * sub
    * mult
    * div
* String manipulation:
    * replace
    * isSubstring
    * concatenate

If all the structure is made right, it can be executed and result can be got.

## Stack of technologies

**Desgin part**:
* HTML
* CSS

**Logic part**:
* JavaScript - main language
* AJAX - _dynamic elements' updating_
* JQuery - _interaction with elements_
* Online database service - _in search of variants_

![Sketched stack of technologies](https://github.com/varivera/LabSSE/blob/folder-design/irek-nazmiev/img/technologies-stack.png?raw=true)

## Sketch of program architecture
**The architecture will consist of 4 main modules**:
* Field-control module - _list of objects of the class ``Block`` (see below) with their full data_
   * Field panel - _container with blocks and their connections allowing to manage with them_
   * Properties panel - _container with information about selected on a ``Field`` block(s) taken from a ``Field``-list_
* Blocks module - consists of a list with functions for adding a new blocks on a ``Field`` and class ``Block`` for determining the block's properties:
   * Block description - _class ``Block`` with all necessary functions and attributes for working with blocks_
   * Blocks panel - _container with buttons that allow user to add new blocks on a ``Field``_
* Tools module - _list of functions that allow user to manage with blocks_:
   * Tools panel - container with buttons that allow user to do operations on blocks: add/remove wires, delete blocks (more later)
* Execution module - _executes sequentially (by topological order) all the blocks and recieves the result. First, the program goes through the "Field" list and sorts it by topological sort (sorter). Then module analyses the object to determine its type and check on errors (analyser), processes it to get inputs and right code to execute (processor), executes it and get the result (executor). Finally, the result is transfered into the next block as input (transferer) and iteration goes to the next block. Module is activated by pressing the button ``RUN``_

![Sketch of program architecture](https://github.com/varivera/LabSSE/blob/folder-design/irek-nazmiev/img/architecture-sketch.png?raw=true)

![Sketch of program architecture 2](https://github.com/varivera/LabSSE/blob/folder-design/irek-nazmiev/img/architecture-sketch2.png?raw=true)
