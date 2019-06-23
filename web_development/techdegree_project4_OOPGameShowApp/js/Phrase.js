class Phrase {
  constructor(phrase) {
    this.phrase = phrase.toLowerCase();
  }

  /*
   * Adds the phrase into the WebPage; Uses JQuery.
   */
  addPhraseToDisplay() {
    for (let alpha of this.phrase) {
      var li_letter;
      alpha === ' ' ? 
        li_letter = $('<li>').addClass('space').text(alpha) :
        li_letter = $('<li>').addClass(`hide letter ${alpha.toLowerCase()}`).text(alpha);
      $('#phrase ul').append(li_letter);
    }
  }

  /*
   * Checks to see if user selection matches any letter in phrase.
   * @param   {String}	  userChoice - the a-z character the user chose
   * @return  {Boolean}
   */
  checkLetter(userChoice) {
    const li_hiddenPhrase = document.querySelectorAll('#phrase li');

    var regExp = `.*letter ${userChoice}$`; //Regular expression used to test if the user choice is in the class attribute...
					    //...of any of the html of the letters in the phrase
    var regexp_userChoice = new RegExp(regExp, "i"); 

    for (let letter of li_hiddenPhrase) {
      if (regexp_userChoice.test(letter.className)) {
	      return true;
      }
    }
    return false;
  }
  
  /*
   * Reveals all letters matching the user guess.
   * @param   {String}	letter - the a-z character the user chose
   */
  showMatchedLetter(letter) {
    const li_hiddenPhrase = document.querySelectorAll('#phrase li');
    const regExp = `.*letter ${letter}$`; //Regular expression used to test if the user choice is in the class attribute...
					//of any of the html of the letters in the phrase
    const regexp_userChoice = new RegExp(regExp, "i"); 

    for (let letter of li_hiddenPhrase) {
      if (regexp_userChoice.test(letter.className)) {
        letter.classList.remove('hide');
        letter.classList.add('show');
      }
    }
  }


  /* Modifies a phrase tile's color.
   * @param {String}  color - an RGB + alpha value in the form 'rgb(0,0,0,0)'
   * @param {Object}  tile - a DOM element node
   */
  tile_changeColor(color, tile) {
    tile.style.backgroundColor = color;
  }

  /*
   * Takes a color on the RGB scale and returns the same color, but with a
   * modified alpha(opacity) value.
   * @param   {String}  color - an RGB value in the form '000,000,000'
   * @param   {Integer} deviation - an integer used to indicate the deviation from the initial alpha value
   * @return  {String}  transformedColor - an RGB + alpha value in the form 'rgb(0,0,0,0')  
   */
  tile_modifyOpacity(color, deviation) {
    const opacityCeiling = 0.70; //Creates a cap for opacity
    const opacityFloor = 0.20; //Creates a baseline for opacity
    const opacityWindow = opacityCeiling - opacityFloor;
    const opacityCommonDiff = (opacityWindow / document.querySelectorAll('.letter').length);
    const newOpacity = (opacityCommonDiff * deviation) + opacityFloor; 
    const transformedColor = `rgb(${color}, ${newOpacity.toString()})`; 

    return transformedColor;
  }

  /*
   * Takes a random color from the color array and iterates through the on-screen phrase--modifying the
   * opacity along the way.
   */
  tile_generatePattern() {
    //Two pointers needed for functions to solve scoping issues with setInterval()
    const pointer_tile_modifyOpacity = this.tile_modifyOpacity;
    const pointer_tile_changeColor = this.tile_changeColor;

    const domLI_Phrase = document.querySelectorAll('.letter');
    const sweep_speed = 50;
    const sweep_fullSweep = sweep_speed * domLI_Phrase.length;
    const colors = [
      '255,51,204',
      '255,0,102',
      '204,51,255',
      '0,153,255',
      '255,26,26',
      '255,102,0',
      '0,0,102',
      '255,0,68'
    ];

    function sweeper() {
      const randNum = Math.ceil((Math.random() * colors.length));
      let i = 0;
      let timerID = null;
      let rgbColor = '';

      timerID = setInterval(() => {                      
        rgbColor = pointer_tile_modifyOpacity(colors[randNum], i);
        pointer_tile_changeColor(rgbColor , domLI_Phrase[i]);
        ++i;                                           
        if (i === domLI_Phrase.length) { clearInterval(timerID); }
      }, sweep_speed);
    }

    for (let send_off = 0; send_off <= 9; send_off++) {
      //Each subsequent "color sweep" is timed at 'C + Cn', C = one complete sweep , n = current iteration 
      const sweep_nextSweepSpeed = sweep_fullSweep + (sweep_fullSweep * send_off);
      setTimeout(() => {
        sweeper();
      }, sweep_nextSweepSpeed); 
    }
  }
}

