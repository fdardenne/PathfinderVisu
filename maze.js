
WIDTH = window.innerWidth;
HEIGHT = window.innerHeight-50;
SQUARE = 30;
OFFSET = 2;
drawing_option = "wall";

colors = {
    "wall": "#323232",
    "void": "#e6e1e1",
    "start": "#C1E1C1",
    "goal":  "#FAA0A0" 
}

algo = {
    "BFS":bfs,
    "DFS":dfs
}

positions = {}
walls = {} //2D dict, walls[x][y]. Prefer dict for memory

mouse_down = false;
canvas = document.getElementById("mainCanvas");
ctx= canvas.getContext("2d");

var waitingDrawQueue = []
timerId = false;
var finished = false;
var flushed = true;

function init() {
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
}

function rect(x,y, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.rect((x*SQUARE)+(x*OFFSET),(y*SQUARE)+(y*OFFSET),SQUARE,SQUARE);
    ctx.closePath();
    ctx.fill();
}

function draw_positions(){
    rect(positions["start"][0], positions["start"][1], colors["start"]);
    rect(positions["goal"][0], positions["goal"][1], colors["goal"]);
}

function drawMaze() {
    for(col=0; col<WIDTH/(SQUARE+OFFSET); col++){
        for(row=0; row<HEIGHT/(SQUARE+OFFSET); row++){
            rect(col,row, colors.void);
        }
    }
}

function resetVisited(){
    for(col=0; col<WIDTH/(SQUARE+OFFSET); col++){
        for(row=0; row<HEIGHT/(SQUARE+OFFSET); row++){
            if(!(col in walls && walls[col][row])){
                rect(col,row, colors.void);
            }
        }
    }
    draw_positions()
}
function getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

function drawOneElemQueue(){
    if(waitingDrawQueue.length > 0){
        let x, y, color;
        [x, y, color] = waitingDrawQueue.shift();
        rect(x,y,color)
        draw_positions();
    }else{
        if(finished){
            clearInterval(timerId);
            finished = false;
            flushed = false;
            console.log("finished");
        }
    }
}

function eventDraw(evt){
    if(!flushed){
        resetVisited()
        flushed = true;
    }
    var mousePos = getMousePos(canvas, evt);

    // Determine square
    x = Math.floor(mousePos.x/(SQUARE+OFFSET));
    y = Math.floor(mousePos.y/(SQUARE+OFFSET));

    // Unique start and goal
    if(drawing_option == "start" || drawing_option == "goal"){
        if(positions[drawing_option]){
            pos = positions[drawing_option];
            rect(pos[0],pos[1], colors["void"]);
        }
        positions[drawing_option] = [x,y];
        if(x in walls && y in walls[x]){
            walls[x][y] = false;
        }
    }

    if(drawing_option == "void"){
        if(x in walls && y in walls[x]){
            walls[x][y] = false;
        }
    }

    if(drawing_option == "wall"){
        if(x in walls){
            walls[x][y] = true;
        }else{
            walls[x] = {}
            walls[x][y] = true;

        }
        
    }

    // Draw
    rect(x,y, colors[drawing_option])
}

// EVENT LISTENER 

canvas.addEventListener('click', function(evt) {
    eventDraw(evt);
}, false);

canvas.addEventListener('mousedown', function(evt) {
    mouse_down = true;
}, false);

//Binding the click event on the canvas
canvas.addEventListener('mouseup', function(evt) {
    mouse_down = false;
}, false);

canvas.addEventListener("mousemove", function (evt) {
    if(mouse_down){
        eventDraw(evt);
    }
}, false);

$('input[type=radio][name=draw]').change(function() {
    drawing_option = this.value;
});

$('button').click(function() {
    if(!flushed){
        resetVisited()
        flushed = true;
    }

    let problem = new Problem(positions, walls, WIDTH/(SQUARE+OFFSET), HEIGHT/(SQUARE+OFFSET));

    timerId = setInterval(drawOneElemQueue, 10);
    // console.log($("#algo").val());
    let t = algo[$("#algo").val()](problem);
    while(t.parent){
        waitingDrawQueue.push([t.state.positions.start[0],t.state.positions.start[1],"#FAC898"])
        t = t.parent;
    }
    finished = true;
})


// INIT
init()
drawMaze()








