let grid = document.querySelector("[js-grid]");
let cards = Array.from(document.querySelectorAll("[js-card]"));
let deckCards = Array.from(document.querySelectorAll("[js-deck-card]"));
let gridLib = animateCSSGrid.wrapGrid(grid, {
  // int: default is 0 ms
  stagger: 0,
  // int: default is 250 ms
  duration: 300,
  // string: default is 'easeInOut'
  easing: 'easeOut',
  // function: called with list of elements about to animate
  onStart: (animatingElementList) => {
    animatingElementList.forEach((card) => {
      // card.classList.add("animate-in-process");
    });
  },
  // function: called with list of elements that just finished animating
  // cancelled animations will not trigger onEnd
  onEnd: (animatingElementList) => {

    animatingElementList.forEach(card => {
      if (card.hasAttribute("js-stacked") && !card.hasAttribute("js-deck-card")) {
      }
    });
  }
});

const gridComputedStyle = window.getComputedStyle(grid);
const columnCount = gridComputedStyle.getPropertyValue("grid-template-columns").split(" ").length;

const getChilds = function (deckCard) {

  let _indexOfDeckCard = deckCards.indexOf(deckCard);

  if (_indexOfDeckCard + 1 === deckCards.length) {
    return cards.slice(cards.indexOf(deckCard) + 1, cards.length);
  } else {
    let nextDeckCard_ = deckCards[_indexOfDeckCard + 1];
    let indexOfNextDeckCard = cards.indexOf(nextDeckCard_);
    return cards.slice(cards.indexOf(deckCard) + 1, indexOfNextDeckCard);
  }
}

const animateCards = function () {

  cards.forEach((card) => {

    let position = getPosition(card);
    let newRow = Math.ceil(position / (columnCount));

    let newCol = position % columnCount;

    if (newCol === 0) {
      newCol = columnCount;
    }

    card.style.gridArea = `${newRow} / ${newCol}`;
    gridLib.forceGridAnimation();
  })
}

const getPosition = function (card) {

  let position = 0;

  for (let i = 0; i < cards.indexOf(card) + 1; i++) {
    if (cards[i].hasAttribute("js-stacked")) {
      i += getChilds(cards[i]).length;
    }
    position++;
  }

  return position;
}

const init = function (deckCard) {
  deckCard.setAttribute("js-stacked", "");

  getChilds(deckCard).forEach((card, index) => {
    card.setAttribute("js-stacked", "");
    card.classList.add("stacked");

    if (index === 0) {
      card.classList.add("turn-left");
    } else if (index === 1) {
      card.classList.add("turn-right");
    }
  });

  // animateCards();
}

const initButtons = function (card) {

  let shieldButton = card.querySelector("[js-button-shield]");
  let fireButton = card.querySelector("[js-button-fire]");

  shieldButton.addEventListener("click", () => {
    shieldButton.classList.toggle("pressed");
    let content = card.querySelector("[js-content]");

    content.classList.add("flipped-right");
    let back = content.querySelector("[js-flip-card-back]");

    back.classList.remove("fire");
    back.classList.add("shield");
    back.innerHTML = `<button js-back-button class="back-button">
                        <img src="./icons/x-circle.svg" alt="" />
                      </button>
                      <div class="icon-wrapper">
                        <img class="icon" src="./icons/shield-pressed.svg" alt="" />
                      </div>`;

    let backButton = back.querySelector("[js-back-button]");
    backButton.addEventListener("click", () => {
      content.classList.remove("flipped-right");
    })
  });

  fireButton.addEventListener("click", () => {
    fireButton.classList.toggle("pressed");

    let content = card.querySelector("[js-content]");

    content.classList.add("flipped-left");

    let back = content.querySelector("[js-flip-card-back]");
    back.classList.remove("shield");
    back.classList.add("fire");

    back.innerHTML = `
                      <p class="instruction">Bitte geben Sie einen Kommentar ein</p>
                      <div class="input-wrapper">
                        <div class="textarea-wrapper">
                          <textarea
                            class="comment"
                            name="comment"
                            id="comment"
                            rows="3"
                          ></textarea>
                        </div>
                        <div class="back-card-action">
                          <button js-button-save-comment class="button save-comment">Speichern</button>
                          <button js-button-abort class="button abort">Abbrechen</button>
                        </div>
                      </div>
                      `


    let abortButton = content.querySelector("[js-button-abort]");
    abortButton.addEventListener("click", () => {
      content.classList.remove("flipped-left");

    })
  });
}

cards.forEach((card) => {

  if (!card.hasAttribute("js-deck-card")) {
    initButtons(card);
  }


  if (card.hasAttribute("js-deck-card")) {

    init(card);

    card.addEventListener("click", () => {

      if (card.hasAttribute("js-stacked")) {

        card.removeAttribute("js-stacked");

        getChilds(card).forEach((card, index) => {
          card.classList.remove("transparent");
          card.removeAttribute("js-stacked");
          card.classList.remove("stacked");

          if (index === 0) {
            card.classList.remove("turn-left");
          } else if (index === 1) {
            card.classList.remove("turn-right");
          }
        });

        animateCards();

      } else {
        card.setAttribute("js-stacked", "");

        getChilds(card).forEach((card, index) => {
          card.setAttribute("js-stacked", "");
          card.classList.add("stacked");

          if (index === 0) {
            card.classList.add("turn-left");
          } else if (index === 1) {
            card.classList.add("turn-right");
          }
        });

        animateCards();
      }
    });
  } else {

    // initButtons(card);

  }
});

animateCards();
