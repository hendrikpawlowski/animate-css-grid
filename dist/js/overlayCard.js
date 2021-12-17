function clickedOnTheBack(card, target) {
    let flipCardBack = card.querySelector("[js-flip-card-back]");

    if (!flipCardBack) {
        return false;
    }

    return flipCardBack.contains(target);
}

function isDeckCard(card) {
    if (card.hasAttribute("js-deck-card")) {
        return true;
    } else {
        return false;
    }
}

function clickedInsideButtonArea(card, target) {
    let cardActionArea = card.querySelector(".card-action");
    if (!cardActionArea) {
        return false;
    }

    if (cardActionArea.contains(target)) {
        return true;
    } else {
        return false;
    }
}

function clickedInsideContentArea(overlayContainer, target) {
    let contentArea = overlayContainer.querySelector("[js-content]");
    if (!contentArea) {
        return false;
    }

    if (contentArea.contains(target)) {
        return true;
    } else {
        return false;
    }
}

const initOverlay = function () {
    console.log("initOverlay");
    let listOfCards = document.querySelectorAll("[js-card]");
    // let overlayContainer = document.createElement('div');
    let overlayContainer = document.querySelector("[js-overlay-container]");

    // overlayContainer.classList = "hidden fixed w-full h-full z-50 justify-center items-center";
    // overlayContainer.innerHTML = `
    // <div class="w-full h-full bg-blue-gray-900 opacity-50"></div>
    // <div js-content class="h-5/6 bg-blue-gray-50 fixed shadow-extreme rounded">
    //     <div class="h-1/5 p-8 flex items-center justify-between">
    //         <h1 class=" text-3xl font-semibold color-white text-blue-gray-900">Titel des Themas</h1>
    //         <button js-close-overlay>
    //             <svg class="h-8 w-8" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x-circle"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
    //         </button>
    //     </div>
    //     <div class="flex h-4/5">
    //         <ul class="px-8 pt-4">
    //             <li class="mb-4>
    //                 <div class="hover:bg-blue-gray-200">
    //                     Fortschritt
    //                 </div>
    //             </li>
    //             <li class="mb-4>
    //                 <div class="hover:bg-blue-gray-200">Thema bearbeiten</div>
    //             </li>
    //             <li class="mb-4>
    //                 <div class="hover:bg-blue-gray-200">Bewertung</div>
    //             </li>
    //             <li class="mb-4>
    //                 <div class="hover:bg-blue-gray-200">Beispiele</div>
    //             </li>
    //         </ul>
    //         <ul class="overflow-scroll px-8">
    //             <li class="mb-8 p-4 bg-white rounded shadow-lg max-w-lg">
    //                 <h2 class="text-lg font-semibold color-white text-blue-gray-900">Fortschritt</h2>
    //                 <div>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet</div>
    //             </li>
    //             <li class="mb-8 p-4 bg-white rounded shadow-lg max-w-lg">
    //                 <h2 class="text-lg font-semibold color-white text-blue-gray-900">Thema bearbeiten</h2>
    //                 <div>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet</div>
    //             </li>
    //             <li class="mb-8 p-4 bg-white rounded shadow-lg max-w-lg">
    //                 <h2 class="text-lg font-semibold color-white text-blue-gray-900">Bewertung</h2>
    //                 <div>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet</div>
    //             </li>
    //             <li class="mb-8 p-4 bg-white rounded shadow-lg max-w-lg">
    //                 <h2 class="text-lg font-semibold color-white text-blue-gray-900">Beispiele</h2>
    //                 <div>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet</div>
    //             </li>
    //         </ul>
    //     </div>
    // </div>
    // `
    document.body.prepend(overlayContainer);

    overlayContainer.addEventListener("click", (e) => {
        if (!clickedInsideContentArea(overlayContainer, e.target)) {
            overlayContainer.classList.remove("flex");
            overlayContainer.classList.add("hidden");
        }
    });

    let closeButton = overlayContainer.querySelector("[js-close-overlay]");
    closeButton.addEventListener("click", () => {
        overlayContainer.classList.remove("flex");
        overlayContainer.classList.add("hidden");
    });

    listOfCards.forEach(card => {
        if (!isDeckCard(card)) {
            card.addEventListener("click", (e) => {
                if (!clickedInsideButtonArea(card, e.target) && !clickedOnTheBack(card, e.target)) {
                    console.log("turn around");

                    overlayContainer.classList.remove("hidden");
                    overlayContainer.classList.add("flex");
                }
            });
        }
    });
}

initOverlay();
