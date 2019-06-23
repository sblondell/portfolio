const newGame = new Game();

document.getElementById('btn__reset').addEventListener('click', function() { newGame.startGame(); });

document.getElementById('qwerty').addEventListener(
  'click',
  function(event) {
    if (event.target.tagName === 'BUTTON') {
      newGame.handleInteraction(event);
    }
  }
);

document.addEventListener(
  'keydown',
  function(event) {
    newGame.handleInteraction(event);
  }
);

