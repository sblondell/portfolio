class Game {
  constructor() {
    this.missed = 0;
    this.phrase = [
      new Phrase("AnjunaDeep Stream"),
      new Phrase("Casio Calculator Wins"),
      new Phrase("Down the road is gold"),
      new Phrase("Ocean flows Wind Blows"),
      new Phrase("Yippie Kaiya")
    ];
    this.activePhrase = null;
  }

  /*
   * Hides the start screen and displays a hidden phrase.
   */
  startGame() {
    const startScreen = document.querySelector("#overlay");

    this.resetGame();
    startScreen.style.display = 'none';
    startScreen.className = 'start';
    this.activePhrase = this.getRandomPhrase();
    this.activePhrase.addPhraseToDisplay();
  }

  /*
   * Completely resets the game to baseline.
   */
  resetGame() {
    const keyboard = document.querySelectorAll('.key');
    const lives = document.querySelectorAll('.tries');
    const phrase = document.querySelector('#phrase ul');

    this.missed = 0;
    for (let life of lives) {
      life.firstChild.src='images/liveHeart.png';
    }

    for (let key of keyboard) {
      key.className = 'key';
      key.disabled = false;
    }

    phrase.innerHTML = '';
  }

  /*
   * Returns a random phrase from the Game's phrase array.
   * @return  {String}	phrase[i] - a random phrase
   */
  getRandomPhrase() {
    return this.phrase[Math.ceil((Math.random() * this.phrase.length) - 1)];
  }

  /*
   * Takes a user's letter guess and checks for a match in the phrase.
   * If the guess is correct, the letter is shown.
   * If the guess is incorrect, a life is taken.
   * @param   {Object}	e - the event object passed by an EventListener
   */
  handleInteraction(e) {
    const keyboard = document.querySelectorAll('.key');
    var qwertyKey = null;
    var userChoice = null;
    
    //Simple function used to add 'chosen' or 'wrong' class to keyboard key
    function keyFlip (judgement) {
      qwertyKey.classList.add(judgement);
      qwertyKey.disabled = true;
    }

    e.target.tagName === 'BUTTON' ? userChoice = e.target.textContent.toLowerCase() : userChoice = e.key.toLowerCase();

    //If the user presses a non-letter key, return false
    if (!/^[a-z]$/.test(userChoice)) {
      return false;
    }else {
      //Finds the keyboard key associated with the user's choice
      for (let key of keyboard) {
        if (key.innerText === userChoice) {
          qwertyKey = key;
        } 
      }

      //Testing for 'className' === 'key' makes sure the associated onscreen keyboard button hasn't been guessed...
      //...if this wasn't here, the user could PRESS an identical key multiple times
      if (qwertyKey.className === 'key') {
        if (this.activePhrase.checkLetter(userChoice)) {
          this.activePhrase.showMatchedLetter(userChoice);
          this.activePhrase.tile_generatePattern();
          this.checkForWin();
          keyFlip('chosen');
        }else {
          keyFlip('wrong');
          this.removeLife();
        }
      }
    }
  }

  /*
   * Removes a life from the user's life bar.
   * Also calls game over if all lives are gone.
   */
  removeLife() {
    const lives = document.querySelectorAll('.tries');

    if (this.missed <= 4) {
      //JQuery animation
      $('img').eq(this.missed).animate({height:'110%', width:'110%'}, 200).animate({height:'35', width:'30'}, 500);

      lives[this.missed].firstChild.src='images/lostHeart.png';
      this.missed++;
    }
    if (this.missed === 5){
      this.gameOver();
    }
  }

  /*
   * Checks to see if user guessed all letters in the phrase.
   */
  checkForWin() {
    const dom_phrase = document.querySelectorAll('.letter');
    var win = true;

    //If any letter is still hidden (ie. class list has 'hide'), then player has not met win criteria
    for (let i = 0; i < dom_phrase.length; i++) {
      if (/^hide/.test(dom_phrase[i].classList.value)) {
        win = false;
        break;
      }
    }

    win ? this.gameOver() : false;
  }

  /*
   * Displays an end game message based on win or lose outcome.
   * Also, displays the start screen so user can play again.
   */
  gameOver() {
    const startScreen = document.querySelector("#overlay");
    const gameOverMsg = document.querySelector("#game-over-message");

    startScreen.style.display = '';
    
    if (this.missed === 5) {
      startScreen.className = 'lose';
      gameOverMsg.textContent = "Sorry, you lose. Play again!";
    }else {
      startScreen.className = 'win';
      gameOverMsg.innerHTML = `You Win!<br>
			      <p>The phrase was: <i>"${this.activePhrase.phrase}"</i></p>
			      `;
    }
  }
}
