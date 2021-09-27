let grid = document.querySelector("[js-grid]");
let cards = Array.from(document.querySelectorAll("[js-card]"));
let deckCards = Array.from(document.querySelectorAll("[js-deck-card]"));
let gridLib = animateCSSGrid.wrapGrid(grid, {
  // int: default is 0 ms
  stagger: 20,
  // int: default is 250 ms
  duration: 300,
  // string: default is 'easeInOut'
  easing: 'easeInOut',
  // function: called with list of elements about to animate
  onStart: (animatingElementList) => { },
  // function: called with list of elements that just finished animating
  // cancelled animations will not trigger onEnd
  onEnd: (animatingElementList) => {
    // console.log(animatingElementList);

    animatingElementList.forEach(element => {
      if (element.hasAttribute("js-stacked") && !element.hasAttribute("js-deck-card")) {
        // console.log(element);
        // element.style.opacity = "0";
        element.classList.add("transparent");

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

// const getTail = function (deckCard) {

//   let index = cards.indexOf(deckCard);
//   let countChilds = getChilds(deckCard).length;

//   return cards.slice(index + countChilds + 1, cards.length);
// }

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

cards.forEach((deckCard) => {

  if (deckCard.hasAttribute("js-deck-card")) {

    deckCard.addEventListener("click", () => {

      if (deckCard.hasAttribute("js-stacked")) {

        deckCard.removeAttribute("js-stacked");

        getChilds(deckCard).forEach((card) => {
          card.classList.remove("transparent");

          card.removeAttribute("js-stacked");
          card.classList.remove("stacked");
        });

        animateCards();

      } else {
        deckCard.setAttribute("js-stacked", "");

        getChilds(deckCard).forEach((card) => {
          card.setAttribute("js-stacked", "");
          card.classList.add("stacked");
        });

        animateCards();
      }
    });
  }
});
