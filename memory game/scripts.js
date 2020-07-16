const cards = document.querySelectorAll('.card'); /*makes a list of all card elements*/

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

function flipCard() {
    if (lockBoard) return; //this prevents anything from happening until the 2 cards selected finish movement
    if (this === firstCard) return; //card won't lock in place permanently if you double click it
    /*console.log('I was clicked');
    console.log(this); shows what this represents*/
    this.classList.add('flip'); //if class present remove it and vise versa

    if (!hasFlippedCard){
        //first click
        hasFlippedCard=true;
        firstCard = this;

        //console.log(hasFlippedCard, firstCard);
        return; //eliminates need for else{} and makes it cleaner
    }
        //second click
        hasFlippedCard=false;
        secondCard = this;

        //console.log({firstCard, secondCard});

        //do cards match? using data-* (named data-framework in this code)
        //console.log(firstCard.dataset.framework);
        //console.log(secondCard.dataset.framework);
        checkMatch();
        //console.log('function executed')
}

function checkMatch() {

    let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

    isMatch ? disableCards() : unflipCards(); //equivalent of writing an if/else in one line where condition ? if : else (called ternary operator)

}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoard();
}

function unflipCards() {
    lockBoard = true;

    setTimeout(() =>{
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');

        lockBoard = false;
        }, 1500); //stalls the cards from flipping for 1.5s
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

(function shuffle(){
    cards.forEach(card=>{
        let randomPos = Math.floor(Math.random()*48)
        card.style.order = randomPos;
    })
})(); //()before and after function means that the function is executed right after definition

cards.forEach(card => card.addEventListener('click', flipCard)); /*loops through list and attaches an event listener*/