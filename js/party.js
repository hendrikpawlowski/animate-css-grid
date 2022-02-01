const init = function () {
    const container = document.querySelector('[js-rocket-container]');
    const fireworks = new Fireworks(container, { /* options */ });

    fireworks.setOptions({
        delay: { min: 3, max: 5 },
        speed: 1,
        rocketsPoint: 50,
        // mouse: { click: true, move: false, max: 0 },
        explosion: 3,
        particles: 300,
        acceleration: 1.04,
        friction: 0.99,
        gravity: 2,
        opacity: 0.5,
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
            }, 5000);
        }
    })
}

init();