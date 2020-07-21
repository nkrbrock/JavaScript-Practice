$(document).on('DOMContentLoaded', () => {

    const grid = document.querySelector(".grid");
    let squares = Array.from($(".grid div")); //collects all divs and turns them into an array
    const scoreDisplay = document.querySelector("#score");
    const startBtn = document.querySelector("#start-button");
    const width = 10;
    let nextRandom = 0;
    let timerId;
    let score = 0;
    const colors=[
        'orange',
        'red',
        'purple',
        'green',
        'blue'
    ]

    //arrow functions:
    //function hello (val) {return 'Hello World' + val}
    //hello = ()/val => 'Hello World' + val

    //the tetrominoes

    //L tetromino & rotations
    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ]

    const zTetromino = [
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1],
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1]
    ]

    const tTetromino = [
        [1, width, width+1, width+2],
        [1, width+1, width+2, width*2+1],
        [width, width+1, width+2, width*2+1],
        [1, width, width+1, width*2+1]
    ]

    const oTetromino = [
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1]
    ]

    const iTetromino = [
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3]
    ]

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

    let currentPosition = 4;
    let currentRotation = 0;

    // randomly select tetromino in its first rotation
    let random = Math.floor(Math.random()*theTetrominoes.length);
    let current = theTetrominoes[random][currentRotation];

    //draw the tetromino
    function draw(){
        current.forEach(index => {
            $(squares[currentPosition + index]).addClass('tetromino');
            $(squares[currentPosition + index]).css("background-color", colors[random]);
        })
    }

    //undraw the tetromino
    function undraw() {
        current.forEach(index =>{
            $(squares[currentPosition + index]).removeClass('tetromino');
            $(squares[currentPosition + index]).css("background-color", "");
        })
    }

    //make tetromino move down every second
    //timerId= setInterval(moveDown, 500);

    //assign functions to keyCodes
    function control(e){
        if(e.keyCode === 37) {
            moveLeft();
        } else if (e.keyCode === 38) {
            rotate();
        } else if (e.keyCode === 39) {
            moveRight();
        } else if (e.keyCode === 40) {
            moveDown();
        }
    }
    $(document).on("keyup", control);

    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }

    //freeze function
    function freeze(){
        if(current.some(index => $(squares[currentPosition + index + width]).hasClass("taken"))){
            current.forEach(index => $(squares[currentPosition + index]).addClass("taken"))
            //start a new tetromino falling
            random=nextRandom;
            nextRandom = Math.floor(Math.random()*theTetrominoes.length);
            current = theTetrominoes[random][currentRotation];
            currentPosition = 4;
            draw();
            displayShape();
            addScore();
            gameOver();
        }
    }

    //move tetromino left until it reaches the edge
    function moveLeft(){
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width ===0)

        if(!isAtLeftEdge) currentPosition -=1;

        //if there is a spot taken it will push it back to where it was
        if(current.some(index => $(squares[currentPosition + index]).hasClass("taken"))){
            currentPosition +=1;
        }
        draw();
    }

    function moveRight() {
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)

        if(!isAtRightEdge) currentPosition +=1;

        if(current.some(index => $(squares[currentPosition + index]).hasClass("taken"))){
            currentPosition -=1;
        }
        draw();
    }

    //rotate the tetromino
    function rotate(){
        undraw();
        currentRotation ++;
        if(currentRotation === current.length){ //if current rotation gets to 4, go back to 0
            currentRotation = 0;
        }
        current = theTetrominoes[random][currentRotation];
        draw();
    }

    //show next shape
    const displaySquares = document.querySelectorAll(".mini-grid div");
    const displayWidth = 4;
    let displayIndex = 0;

    //tetrominos w/out rotations
    const upNextTetrominoes = [
        [1, displayWidth+1, displayWidth*2+1, 2], //l
        [0, displayWidth, displayWidth+1, displayWidth*2+1], //z
        [1, displayWidth, displayWidth+1, displayWidth+2], //t
        [0, 1, displayWidth, displayWidth+1], //o
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //i
    ]

    //display next shape
    function displayShape(){
        displaySquares.forEach(square => {
            $(square).removeClass("tetromino");
            $(square).css("background-color", "")
        })
        upNextTetrominoes[nextRandom].forEach( index => {
            $(displaySquares[displayIndex + index]).addClass("tetromino");
            $(displaySquares[displayIndex + index]).css("background-color", colors[nextRandom])
        })
    }

    //add functionality to the button
    $(startBtn).on("click", ()=>{
        if(timerId){
            clearInterval(timerId);
            timerId=null;
        } else {
            draw();
            timerId = setInterval(moveDown, 500);
            nextRandom = Math.floor(Math.random()*theTetrominoes.length);
            displayShape();
        }
    })

    function addScore(){
        for (let i=0; i<199; i +=width) {
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];

            if(row.every(index => $(squares[index]).hasClass("taken"))){
                score +=10;
                $(scoreDisplay).html(score);
                row.forEach(index => {
                    $(squares[index]).removeClass("taken");
                    $(squares[index]).removeClass("tetromino");
                    $(squares[index]).css("background-color", "");
                })
                const squaresRemoved = squares.splice(i, width);
                squares=squaresRemoved.concat(squares);
                squares.forEach(cell => grid.appendChild(cell));
            }
        }
    }

    //game over
    function gameOver(){
        if(current.some(index => $(squares[currentPosition + index]).hasClass("taken"))) {
            $(scoreDisplay).html("end");
            clearInterval(timerId);
        }
    }

})