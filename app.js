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

const initCardStack = function (deckCard) {
  deckCard.setAttribute("js-stacked", "");

  getChilds(deckCard).forEach((card, index) => {
    card.setAttribute("js-stacked", "");
    card.classList.add("stacked");

    if (index === 0) {
      card.classList.add("turn-left");
      card.classList.add("higher-z-index");
    } else if (index === 1) {
      card.classList.add("turn-right");
    }
  });

  // animateCards();
}

const flipToFireBack = function (card) {
  let fireButton = card.querySelector("[js-button-fire]");

  fireButton.classList.toggle("pressed");

  let content = card.querySelector("[js-content]");

  content.classList.add("flipped-left");

  let back = content.querySelector("[js-flip-card-back]");
  back.classList.remove("shield");
  back.classList.add("fire");

  back.innerHTML = `
                      <div class="textarea-wrapper">
                        <textarea
                          placeholder="Bitte erläutern Sie kurz die Wahl dieses Themengebietes - wo genau liegen aus Ihrer Sicht die Probleme in Ihrem Team?"
                          class="comment"
                          name="comment"
                          id="comment"
                          rows="10"
                        ></textarea>
                      </div>
                      <div class="back-card-action">
                        <button js-button-abort class="button abort">Abbrechen</button>
                        <button js-button-save-comment class="button save-comment">Speichern</button>
                      </div>
                      `


  let abortButton = content.querySelector("[js-button-abort]");
  abortButton.addEventListener("click", () => {
    content.classList.remove("flipped-left");

  })
}

const flipToShieldBack = function (card) {
  let shieldButton = card.querySelector("[js-button-shield]");
  let content = card.querySelector("[js-content]");
  let back = content.querySelector("[js-flip-card-back]");

  shieldButton.classList.toggle("pressed");
  content.classList.add("flipped-right");
  back.classList.remove("fire");
  back.classList.add("shield");
  back.innerHTML = `<button js-back-button class="back-button">
                      <img class="icon" src="./icons/corner-up-left.svg" alt="" />
                    </button>
                    <div class="icon-wrapper">
                      <img class="icon" src="./icons/shield-pressed.svg" alt="" />
                    </div>
                    <div class="text-wrapper">
                      <p class="text">Sie haben das Thema positiv bewertet</p>
                    </div>
                    `;

  let backButton = back.querySelector("[js-back-button]");
  backButton.addEventListener("click", () => {
    content.classList.remove("flipped-right");
  });

  // content.removeEventListener("swiped-left");

  // content.addEventListener("swiped-left", () => {
  //   content.classList.remove("flipped-right");
  // });
}

const initFlip = function (card) {

  let shieldButton = card.querySelector("[js-button-shield]");
  let fireButton = card.querySelector("[js-button-fire]");
  let content = card.querySelector("[js-content]");

  content.addEventListener("swiped-right", () => {
    if (content.classList.contains("flipped-left")) {
      content.classList.remove("flipped-left");
    } else {
      if (!content.classList.contains("flipped-left")) flipToShieldBack(card);
    }
  });

  content.addEventListener("swiped-left", () => {
    if (content.classList.contains("flipped-right")) {
      content.classList.remove("flipped-right");
    } else {
      if (!content.classList.contains("flipped-right")) flipToFireBack(card);
    }
  });

  shieldButton.addEventListener("click", () => {
    flipToShieldBack(card);
  });

  fireButton.addEventListener("click", () => {
    flipToFireBack(card);
  });
}

cards.forEach((card) => {

  if (!card.hasAttribute("js-deck-card")) {
    initFlip(card);
  }

  if (card.hasAttribute("js-deck-card")) {

    initCardStack(card);

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

    // initFlip(card);
  }
});

animateCards();
