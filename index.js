var start = document.getElementById("button-start");

function disableStartBtn(){
    document.getElementById("button-start").disabled = true;
}

function enableReloadBtn(){
    document.getElementById("button-reload").disabled = false;
}


start.addEventListener('click', startGame);

function startGame(){
    disableStartBtn();
    window.addEventListener("keydown", function(e){
        //e.preventDefault();
        switch(e.key){
            case "ArrowUp":
                e.preventDefault();
                moveUp();
                break;
            case "ArrowDown":
                e.preventDefault();
                moveDown();
                break;
            case "ArrowLeft":
                e.preventDefault();
                moveToLeft();
                break;
            case "ArrowRight":
                e.preventDefault();
                moveToRight();
                break;
            default:
                break;           
        }
    }, false);
}


function setClass(className){
    var node;
    var attribute;
    node = document.createElement("span");
    attribute = document.createAttribute("class");
    attribute.value = className;
    node.setAttributeNode(attribute);
    document.getElementById("board").appendChild(node);
}

var accomplished;
var map = tileMap01.mapGrid;
var originalMap = tileMap01.mapGrid;

setMap();

function setMap(){
    document.getElementById('board').innerHTML="";
    accomplished = 0;
    for(var i=0; i<tileMap01.height; i++){
        for(var j=0; j<tileMap01.width; j++){
            switch(originalMap[i][j].toString()){
                case 'W': setClass("wall");
                    break;

                case 'B': setClass("movableBlock");
                    break;

                case 'P': setClass("player");
                    break;

                case 'G': setClass("goalArea");
                    accomplished++;
                    break;

                case ' ': setClass("emptyArea");
                    break;

                case 'BG': setClass("movableBlock");
                    break;
                    
                case 'PG': setClass("player");
                    break;

                case 'O': setClass("ocean");
                    break;

                case 'S': setClass("ship");
            }
        }
    }

}



function upDateMap(){
    document.getElementById("board").innerHTML = "";
    for(var i=0; i<tileMap01.height; i++){
        for(var j=0; j<tileMap01.width; j++){

            switch(map[i][j].toString()){

                case "W": setClass("wall");
                    break;

                case "B": setClass("movableBlock");
                    break;

                case "P": setClass("player");
                    break;
    
                case "G": setClass("goalArea");
                    break;

                case "BG": setClass("openBox");
                    break;
                    
                case "PG": setClass("player");
                    break;
                    
                case 'O': setClass("ocean");
                    break;

                case 'S': setClass("ship");
                    break;

                case 'A': setClass("gameEnded");    
            
                case " ": setClass("emptyArea");           
            }
        }
    }
}



var restart = document.getElementById("button-reload");

restart.addEventListener('click', location.reload.bind(location));

var playerRow = 11;
var playerColumn = 11;
var playerNextRow, playerNextColumn;

function playerOutOfGoal(){
    if(map[playerRow][playerColumn].toString() === "PG"){
        map[playerRow][playerColumn] = new Array("G");
    }else{
        map[playerRow][playerColumn] = new Array(" ");
    }
}


function moveBox(boxNextRow, boxNextColumn){

    //Is next pos empty or a goal then possible to move box
    if(map[boxNextRow][boxNextColumn].toString() === " " || map[boxNextRow][boxNextColumn].toString() === "G"){
        var nextBoxPos = map[boxNextRow][boxNextColumn].toString();
        if(map[boxNextRow][boxNextColumn].toString() === "G"){
            map[boxNextRow][boxNextColumn] = new Array("BG");
            accomplished--
            if(accomplished === 0){
                document.getElementsByClassName("hidden").item(0).style.display = 'block';//WINNER!!!!!!!!!!!!!!!!!!!!
                //enableReloadBtn();
            }
        }else{
            map[boxNextRow][boxNextColumn] = new Array("B");
        }

        if(nextBoxPos === " " && map[playerNextRow][playerNextColumn].toString() === "BG"){
            map[playerNextRow][playerNextColumn] = new Array("PG");
            map[playerRow][playerColumn] = new Array("G");
            //accomplished++;
        }else if(nextBoxPos === " " && map[playerNextRow][playerNextColumn].toString() !== "BG" && map[playerRow][playerColumn].toString() === "PG"){
            map[playerNextRow][playerNextColumn] = new Array("P");
            map[playerRow][playerColumn] = new Array("G");
        }else if(nextBoxPos === "G" && map[playerNextRow][playerNextColumn].toString() === "BG"){
            map[playerNextRow][playerNextColumn] = new Array("PG");
            map[boxNextRow][boxNextColumn] = new Array("BG");
            if(map[playerRow][playerColumn].toString() === "P")
                map[playerRow][playerColumn] = new Array(" ");
            else if(map[playerRow][playerColumn].toString() === "PG")
                map[playerRow][playerColumn] = new Array("G");
            accomplished++;
        }else{
            map[playerNextRow][playerNextColumn] = new Array("P");
            map[playerRow][playerColumn] = new Array(" ");
        }
        playerRow = playerNextRow;
        playerColumn = playerNextColumn;
    }
}

function moveToBlank(){
    if(map[playerRow][playerColumn].toString() === "PG")
        map[playerRow][playerColumn] = new Array("G");
    else
        map[playerRow][playerColumn] = new Array(" ");
}

function moveDown(){
    playerNextRow = playerRow + 1;
    playerNextColumn = playerColumn;
    //om spelare rör sig i goalområdet
    if(map[playerNextRow][playerNextColumn].toString() === "G"){
        map[playerNextRow][playerNextColumn] = new Array("PG");
        playerOutOfGoal();
        playerRow = playerNextRow;
        playerColumn = playerNextColumn;
        upDateMap();
    }

    if(map[playerNextRow][playerNextColumn].toString() === " "){
        map[playerNextRow][playerNextColumn] = new Array("P");
        playerOutOfGoal();
        playerRow = playerNextRow;
        playerColumn = playerNextColumn;
        upDateMap();

    }else if(map[playerNextRow][playerNextColumn].toString() === "B" || map[playerNextRow][playerNextColumn].toString() === "BG"){
        var boxNextRow, boxNextCol;
        boxNextRow = playerNextRow + 1;
        boxNextCol = playerNextColumn;
        moveBox(boxNextRow, boxNextCol);
        upDateMap();
    }
}


function moveUp(){
    playerNextRow = playerRow - 1;
    playerNextColumn = playerColumn;

    if(map[playerNextRow][playerNextColumn].toString() === "G"){
        map[playerNextRow][playerNextColumn] = new Array("PG");
        playerOutOfGoal();
        playerRow = playerNextRow;
        playerColumn = playerNextColumn;
        upDateMap();
    }

    if(map[playerNextRow][playerNextColumn].toString() === " "){
        map[playerNextRow][playerNextColumn] = new Array("P");
        moveToBlank();
        playerRow = playerNextRow;
        playerColumn = playerNextColumn;
        upDateMap();

    }else if(map[playerNextRow][playerNextColumn].toString() === "B" || map[playerNextRow][playerNextColumn].toString() === "BG"){
        var boxNextRow, boxNextColumn;
        boxNextRow = playerNextRow - 1;
        boxNextColumn = playerNextColumn;

        moveBox(boxNextRow,boxNextColumn);
        upDateMap();
    }
}

function moveToLeft(){
    playerNextRow = playerRow;
    playerNextColumn = playerColumn - 1;

    if(map[playerNextRow][playerNextColumn].toString() === "G"){
        map[playerNextRow][playerNextColumn] = new Array("PG");
        playerOutOfGoal();
        playerRow = playerNextRow;
        playerColumn = playerNextColumn;
        upDateMap();
    }

    if(map[playerNextRow][playerNextColumn].toString() === " "){
        map[playerNextRow][playerNextColumn] = new Array("P");
        moveToBlank();
        playerRow = playerNextRow;
        playerColumn = playerNextColumn;
        upDateMap();

    }else if(map[playerNextRow][playerNextColumn].toString() === "B" || map[playerNextRow][playerNextColumn].toString() === "BG"){
        var boxNextRow, boxNextColumn;
        boxNextRow = playerNextRow;
        boxNextColumn = playerNextColumn - 1;

        moveBox(boxNextRow, boxNextColumn);
        upDateMap();
    }
}

function moveToRight(){
    playerNextRow = playerRow;
    playerNextColumn = playerColumn + 1;

    if(map[playerNextRow][playerNextColumn].toString() === "G"){
        map[playerNextRow][playerNextColumn] = new Array("PG");
        playerOutOfGoal();
        playerRow = playerNextRow;
        playerColumn = playerNextColumn;
        upDateMap();
    }

    if(map[playerNextRow][playerNextColumn].toString() === " "){
        map[playerNextRow][playerNextColumn] = new Array("P");
        moveToBlank();
        playerRow = playerNextRow;
        playerColumn = playerNextColumn;
        upDateMap();

    }else if(map[playerNextRow][playerNextColumn].toString() === "B" || map[playerNextRow][playerNextColumn].toString() === "BG"){
        var boxNextRow, boxNextColumn;
        boxNextRow = playerNextRow;
        boxNextColumn = playerNextColumn + 1;
        moveBox(boxNextRow, boxNextColumn);
        upDateMap();
    }
}


