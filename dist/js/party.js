const init = function () {
    const container = document.querySelector('[js-rocket-container]');
    const fireworks = new Fireworks(container, { /* options */ });

    fireworks.setOptions({
        delay: { min: 0, max: 5 },
        speed: 8,
        // mouse: { click: true, move: false, max: 0 },
        explosion: 5,
    });

    let rocketAnimationIsRunning = false;

    let confettiButton = document.querySelector("[js-confetti-button]");
    let rocketButton = document.querySelector("[js-rocket-button]");

    confettiButton.addEventListener("click", () => {
        party.confetti(confettiButton);
    })

    rocketButton.addEventListener("click", () => {
        if (!rocketAnimationIsRunning) {
            rocketAnimationIsRunning = true;

            container.classList.remove("opacity-0");

            fireworks.start();

            setTimeout(() => {
                container.classList.add("opacity-0");
                setTimeout(() => {
                    fireworks.stop();
                    rocketAnimationIsRunning = false;
                }, 1000);
            }, 1000);
        }
    })
}

init();