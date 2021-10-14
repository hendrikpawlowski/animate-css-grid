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

  // console.log(card);

  // console.log(shieldButton);

  shieldButton.addEventListener("click", () => {
    shieldButton.classList.toggle("pressed");
  });

  fireButton.addEventListener("click", () => {
    fireButton.classList.toggle("pressed");
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

(() => {
  const items = $('.grid-item > div');

  items.attr('draggable', 'true');
  items.css('--rotyf', '0deg');
  items.css('position', 'relative');
  items.css('transition', 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)');
  items.css('perspective', '800px');

  const fronts = items.find('.content');
  fronts.css('-webkit-transform', 'rotateY(var(--rotyf))');
  fronts.css('transform', 'rotateY(var(--rotyf))');
  fronts.css('-webkit-transform-style', 'preserve-3d');
  fronts.css('transform-style', 'preserve-3d');
  fronts.css('-webkit-backface-visibility', 'hidden');
  fronts.css('backface-visibility', 'hidden');
  fronts.css('transition', 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)');

  items.each(function () {
    $(this).append('<div class="back" style="position:absolute;top:0;left:0;width:100%;height:100%;display:flex;flex-direction:column;justify-content:center;text-align:center"><div>Rückseite<div></div>');
  });

  const backs = items.find('.back');
  backs.css('--rotyb', 'calc(var(--rotyf) + 180deg)');
  backs.css('-webkit-transform', 'rotateY(var(--rotyb))');
  backs.css('transform', 'rotateY(var(--rotyb))');
  backs.css('-webkit-transform-style', 'preserve-3d');
  backs.css('transform-style', 'preserve-3d');
  backs.css('-webkit-backface-visibility', 'hidden');
  backs.css('backface-visibility', 'hidden');
  backs.css('background', 'rgb(190,220,230)')
  backs.css('box-shadow', '0 6px 16px rgba(0,0,0,0.15)');
  backs.css('transition', 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)');

  let start = false;
  let startX = 0;
  let startRotyf = 0;

  items.on('dragstart', function (ev) {
    const dragImage = document.createElement("img");
    ev.originalEvent.dataTransfer.setDragImage(dragImage, 0, 0);
    start = true;
  });

  function limit(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function getRotyf(element) {
    return +element.style.getPropertyValue("--rotyf")
      .slice(0,-3); // remove "deg" unit to get number value
  }

  function setRotyf(element, value) {
    element.style.setProperty("--rotyf", value + "deg");
  }

  items.on('drag', function (ev) {
    ev.preventDefault();

    if (start) {
      startX = ev.clientX;
      startRotyf = +getRotyf(ev.target);
      start = false;
    }

    var rect = ev.target.parentElement.getBoundingClientRect();
    var x = ev.clientX - startX;
    let r = limit(x / (rect.width * .5), -1, 1);

    // console.log(ev.type, ev.clientX, startX, rect.width, x, r);

    if (ev.screenX === 0) {
      return; // last drag event doesn't have mouse location
    }

    let rotyf = getRotyf(ev.target);
    let rotyf_new = limit(startRotyf + r*180, startRotyf-180, startRotyf+180);

    // console.log(rotyf, rotyf_new);

    if (Math.abs(rotyf - rotyf_new) < 0.5) {
      return; // only rotate if change is big enough
    }

    setRotyf(ev.target, rotyf_new);
  });

  items.on('dragend', function (ev) {
    // lock to full 180 degree rotations
    setRotyf(ev.target, Math.round(+getRotyf(ev.target) / 180) * 180);
  });
})();
