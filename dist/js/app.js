let grid = document.querySelector("[js-grid]");
let cards = Array.from(document.querySelectorAll("[js-card]"));
let deckCards = Array.from(document.querySelectorAll("[js-deck-card]"));
let startingCard = document.querySelector("[js-starting-card]");
let accordion = document.querySelector("[js-accordion]");
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
      // if (card.hasAttribute("js-stacked") && !card.hasAttribute("js-deck-card")) {
      // }
      // card.classList.remove("opacity-0");
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

    let newPosition = getPosition(card)
    card.style.gridArea = `${newPosition.newRow} / ${newPosition.newCol}`;
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

  let newRow = Math.ceil(position / (columnCount));

  let newCol = position % columnCount;

  if (newCol === 0) {
    newCol = columnCount;
  }

  return { newRow, newCol };
}

const initCardStack = function (deckCard) {
  deckCard.setAttribute("js-stacked", "");

  getChilds(deckCard).forEach((card, index) => {
    if (index === 0) {
      card.classList.add("z-10");
    }

    initFlip(card);

    if (index === 0) {
      card.classList.add("turn-left");
      card.classList.add("higher-z-index");
    } else if (index === 1) {
      card.classList.add("turn-right");
    }
  });
}

class Carousel {

  constructor(card) {
    this.slideIndex = 1;
    this.card = card;
    this.slides = this.card.getElementsByClassName("mySlides");

    this.initNextButtons();
    this.initBackButtons();
  }

  initNextButtons() {
    let nextButtons = this.card.querySelectorAll("[js-next-button]");

    nextButtons.forEach(nextButton => {
      nextButton.addEventListener("click", () => {
        this.plusSlides(1);
      })
    });
  }

  initBackButtons() {
    let backButtons = this.card.querySelectorAll("[js-back-button]");

    backButtons.forEach(backButton => {
      backButton.addEventListener("click", () => {
        this.plusSlides(-1);
      })
    });
  }

  plusSlides(n) {
    this.showSlides(this.slideIndex += n);
  }

  showSlides(n) {
    var i;
    if (n > this.slides.length) { this.slideIndex = 1 }
    if (n < 1) { this.slideIndex = this.slides.length }
    for (i = 0; i < this.slides.length; i++) {
      this.slides[i].classList.add("hidden");
    }
    this.slides[this.slideIndex - 1].classList.remove("hidden");
  }
}

const flipToFireBack = function (card) {

  let title = card.querySelector("[js-title]");

  let content = card.querySelector("[js-content]");
  content.classList.add("flipped-left");

  let back = content.querySelector("[js-flip-card-back]");
  back.classList.remove("shield");
  back.classList.add("fire");

  back.innerHTML = `
  <div class="slideshow-container h-full">

    <div class="mySlides animate__animated animate__fadeIn h-full flex flex-col justify-between">
      <div class="w-full h-full overflow-hidden p-1 px-1">
        <textarea placeholder="Bitte erl??utere kurz die Wahl dieses Themengebietes - wo genau liegen aus deiner Sicht die Probleme im Team?" class="overflow-hidden w-full h-full resize-none rounded border-blue-gray-300 focus:outline-none focus:border-red-400 outline-none focus:ring-red-400" name="comment" id="comment" rows="10"></textarea>
      </div>
      <div class="flex -mt-1">
        <button js-undone-button class="w-full bg-blue-gray-200 hover:bg-blue-gray-300 rounded h-12 m-1 mr-0.5">Zur??ck</button>
        <button js-next-button class="w-full bg-blue-gray-200 hover:bg-blue-gray-300 rounded h-12 m-1 ml-0.5">Weiter</button>
      </div>
    </div>
    
    <div class="mySlides animate__animated animate__fadeIn h-full flex flex-col justify-between">
      <div class="w-full h-full overflow-hidden p-1 px-1">
        <textarea placeholder="Hast du schon eine Idee, wie das Problem gel??st werden k??nnte?" class="overflow-hidden w-full h-full resize-none rounded border-blue-gray-300 focus:outline-none focus:border-red-400 outline-none focus:ring-red-400" name="comment" id="comment" rows="10"></textarea>
      </div>
      <div class="flex -mt-1">
        <button js-back-button class="w-full bg-blue-gray-200 hover:bg-blue-gray-300 rounded h-12 m-1 mr-0.5">Zur??ck</button>
        <button js-next-button class="w-full bg-blue-gray-200 hover:bg-blue-gray-300 rounded h-12 m-1 ml-0.5">Weiter</button>
      </div>
    </div>
    
    <div class="mySlides animate__animated animate__fadeIn bg-red-300 flex flex-col justify-between h-full rounded" >
      <p class="mt-5 mx-5 text-red-900 text-base font-bold">${title.innerHTML}</p>
      <div class="ml-2 mr-5 flex items-center h-full">
        <div class="icon-wrapper">
          <img class="w-40" src="./dist/icons/fire-pressed.svg" alt="" />
        </div>
        <p class="text-red-900 ml-2">Du hast 1 von 5 Themen negativ bewertet</p>
      </div>
      <button js-undone-button class="h-14 rounded-b w-full flex items-center justify-center text-white font-sm bg-red-500">
        R??ckg??ngig
      </button>
    </div>
  
  </div>
  `

  let carousel = new Carousel(card);

  let undoneButtons = content.querySelectorAll("[js-undone-button]");
  undoneButtons.forEach(undoneButton => {
    undoneButton.addEventListener("click", () => {
      content.classList.remove("flipped-left");
    });
  })

  carousel.showSlides(1);
}

const flipToShieldBack = function (card) {
  let title = card.querySelector("[js-title]");
  let shieldButton = card.querySelector("[js-button-shield]");
  let content = card.querySelector("[js-content]");
  let back = content.querySelector("[js-flip-card-back]");

  shieldButton.classList.toggle("pressed");
  content.classList.add("flipped-right");
  back.classList.remove("fire");
  // back.classList.add("shield");
  back.innerHTML = `
    <div class="bg-emerald-300 flex flex-col justify-between h-full rounded" >
                      <p class="mt-5 mx-5 text-emerald-900 text-base font-bold">${title.innerHTML}</p>
                      <div class="ml-2 mr-5 flex items-center h-full">
                        <div class="icon-wrapper">
                          <img class="w-40" src="./dist/icons/shield-pressed.svg" alt="" />
                        </div>
                        <p class="text-emerald-900 ml-2">Du hast 1 von 5 Themen positiv bewertet</p>
                      </div>
                      <button js-back-button class="h-14 rounded-b w-full flex items-center justify-center text-white font-sm bg-emerald-600">
                        R??ckg??ngig
                      </button>
                    </>
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

const handleStack = function (deckCard) {
  if (deckCard.hasAttribute("js-stacked")) {

    deckCard.removeAttribute("js-stacked");

    getChilds(deckCard).forEach((card, index) => {
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

    animateCards();
  }
}

const initAccordions = function () {
  console.log("initAccordions");
  let accordion = document.querySelector("[js-accordion]");
  let head = accordion.querySelector("[js-head]");
  let toggleButton = head.querySelector("[js-toggle]");
  let panel = accordion.querySelector("[js-panel]");

  panel.style.maxHeight = panel.scrollHeight + "px";

  setTimeout(() => {
    toggleButton.classList.remove("opacity-0");

    // setTimeout(() => {
    //   toggleButton.classList.add("animate__animated");
    //   toggleButton.classList.add("animate__heartBeat");

    //   toggleButton.addEventListener("animationend", () => {
    //     toggleButton.classList.remove("animate__animated");
    //     toggleButton.classList.remove("animate__heartBeat");
    //   })
    // }, 200)

    // panel.style.maxHeight = "0px";
  }, 400);

  toggleButton.addEventListener("click", function () {
    accordion.classList.toggle("active");

    if (panel.style.maxHeight === "") {
      panel.style.maxHeight = "0px";
    } else if (panel.style.maxHeight === "0px") {
      panel.style.maxHeight = panel.scrollHeight + "px";
    } else {
      panel.style.maxHeight = "0";
    }
  });
}


const init = function () {

  cards.forEach((card) => {

    if (card.hasAttribute("js-deck-card")) {

      card.querySelector(".content").classList.add("shadow-md");

      initCardStack(card);

      card.addEventListener("click", () => {
        handleStack(card);
      });
    } else {
      let flipCardFront = card.querySelector(".flip-card-front");
      let flipCardBack = card.querySelector(".flip-card-back");
      flipCardFront.classList.add("shadow-lg");
      flipCardBack.classList.add("shadow-lg");

    }
  });

  animateCards();
}

const initStartingCard = function () {

  console.log(startingCard)

  cards.forEach((card, index) => {
    if (card.hasAttribute("js-deck-card")) {
      card.style.zIndex = (cards.length - index) + 10 + "";
    }
  });

  startingCard.addEventListener("click", () => {
    init();
    startingCard.classList.add("opacity-0");

    setTimeout(() => {
      startingCard.remove();
    }, 500);
  })
}

// initAccordions();
initStartingCard();