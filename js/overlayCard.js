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
    let overlayContainer = document.querySelector("[js-overlay-container]");

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

            document.addEventListener('keydown', (e) => {
                if (e.key === "Escape") {
                    overlayContainer.classList.remove("flex");
                    overlayContainer.classList.add("hidden");
                }
            });
        }
    });
}

initOverlay();
