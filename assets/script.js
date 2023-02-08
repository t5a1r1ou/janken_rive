window.addEventListener("load", () => {
  let resultValue = "";
  let yourHand;
  let cpuHand;
  const cardTitle = document.querySelector(".card__title");
  const cardResult = document.querySelector(".card__result");
  const navigationHandList = document.querySelector(".navigation__list--hands");
  const rockButton = navigationHandList.querySelector(
    ".navigation__button--rock"
  );
  const scissorsButton = navigationHandList.querySelector(
    ".navigation__button--scissors"
  );
  const paperButton = navigationHandList.querySelector(
    ".navigation__button--paper"
  );
  const handButtons = [rockButton, scissorsButton, paperButton];

  const handParams = ["rock", "scissors", "paper"];

  const calcResult = (you, cpu) => {
    if (you === cpu) {
      resultValue = "";
      return "あいこ！";
    } else if (
      (you === "rock" && cpu === "scissors") ||
      (you === "scissors" && cpu === "paper") ||
      (you === "paper" && cpu === "rock")
    ) {
      resultValue = "win";
      return "あなたのかち！";
    } else {
      resultValue = "lose";
      return "あなたのまけ...";
    }
  };

  const result = (you, cpu) => {
    cardTitle.innerHTML = "ぽんっ！";
    cardResult.innerHTML = calcResult(you, cpu);
  };

  for (let i = 0; i < handButtons.length; i++) {
    const button = handButtons[i];
    button.addEventListener("click", () => {
      const randomIndex = Math.floor(Math.random() * 3);
      yourHand = handParams[i];
      cpuHand = handParams[randomIndex];
      result(yourHand, cpuHand);
    });
  }

  const yourCanvases = document.querySelectorAll(".js-canvas-you");
  const cpuCanvases = document.querySelectorAll(".js-canvas-cpu");
  const canvases = [...yourCanvases, ...cpuCanvases];

  const layout = new rive.Layout({
    fit: rive.Fit.Cover,
  });

  const resizeCanvas = (rives) => {
    const { clientWidth: canvasContainerWidth } = document.querySelector(
      ".js-canvas-container"
    );
    canvases.forEach((canvas) => {
      canvas.width = canvasContainerWidth;
      canvas.height = canvasContainerWidth;
    });
    rives.forEach((r) => {
      r.layout = new rive.Layout({ fit: rive.Fit.Cover });
    });
  };

  [...yourCanvases]
    .filter((_, i) => i !== 0)
    .forEach((canvas) => {
      canvas.style.opacity = 0;
    });

  [...cpuCanvases]
    .filter((_, i) => i !== 0)
    .forEach((canvas) => {
      canvas.style.opacity = 0;
    });

  const youThinkingRive = new rive.Rive({
    src: "./assets/rivs/thinking.riv",
    autoplay: true,
    canvas: yourCanvases[0],
    layout,
    stateMachines: "thinking",
  });

  const youRockRive = new rive.Rive({
    src: "./assets/rivs/rock.riv",
    autoplay: true,
    canvas: yourCanvases[1],
    layout,
    stateMachines: "rock",
    onLoad: (_) => {
      const inputs = youRockRive.stateMachineInputs("rock");
      const winTrigger = inputs.find((i) => i.name === "rock_win");
      const loseTrigger = inputs.find((i) => i.name === "rock_lose");
      const button = document.querySelector(".navigation__button--rock");
      button.addEventListener("click", () => {
        [...yourCanvases].forEach((canvas, i) => {
          if (i === 1) {
            canvas.style.opacity = 1;
          } else {
            canvas.style.opacity = 0;
          }
        });
        if (resultValue === "win") {
          winTrigger.fire();
        } else if (resultValue === "lose") {
          loseTrigger.fire();
        }
      });
    },
  });

  const youScissorsRive = new rive.Rive({
    src: "./assets/rivs/scissors.riv",
    autoplay: true,
    canvas: yourCanvases[2],
    layout,
    stateMachines: "scissors",
    onLoad: (_) => {
      const inputs = youScissorsRive.stateMachineInputs("scissors");
      const winTrigger = inputs.find((i) => i.name === "scissors_win");
      const loseTrigger = inputs.find((i) => i.name === "scissors_lose");
      const button = document.querySelector(".navigation__button--scissors");
      button.addEventListener("click", () => {
        [...yourCanvases].forEach((canvas, i) => {
          if (i === 2) {
            canvas.style.opacity = 1;
          } else {
            canvas.style.opacity = 0;
          }
        });
        if (resultValue === "win") {
          winTrigger.fire();
        } else if (resultValue === "lose") {
          loseTrigger.fire();
        }
      });
    },
  });

  const youPaperRive = new rive.Rive({
    src: "./assets/rivs/paper.riv",
    autoplay: true,
    canvas: yourCanvases[3],
    layout,
    stateMachines: "paper",
    onLoad: (_) => {
      const inputs = youPaperRive.stateMachineInputs("paper");
      const winTrigger = inputs.find((i) => i.name === "paper_win");
      const loseTrigger = inputs.find((i) => i.name === "paper_lose");
      const button = document.querySelector(".navigation__button--paper");
      button.addEventListener("click", () => {
        [...yourCanvases].forEach((canvas, i) => {
          if (i === 3) {
            canvas.style.opacity = 1;
          } else {
            canvas.style.opacity = 0;
          }
        });
        if (resultValue === "win") {
          winTrigger.fire();
        } else if (resultValue === "lose") {
          loseTrigger.fire();
        }
      });
    },
  });

  const cpuThinkingRive = new rive.Rive({
    src: "./assets/rivs/thinking.riv",
    autoplay: true,
    canvas: cpuCanvases[0],
    layout,
    stateMachines: "thinking",
  });

  const cpuRockRive = new rive.Rive({
    src: "./assets/rivs/rock.riv",
    autoplay: true,
    canvas: cpuCanvases[1],
    layout,
    stateMachines: "rock",
    onLoad: (_) => {
      const inputs = cpuRockRive.stateMachineInputs("rock");
      const winTrigger = inputs.find((i) => i.name === "rock_lose");
      const loseTrigger = inputs.find((i) => i.name === "rock_win");
      const buttons = document.querySelectorAll(".navigation__button");
      [...buttons].forEach((button) => {
        button.addEventListener("click", () => {
          if (cpuHand !== "rock") return;
          [...cpuCanvases].forEach((canvas, i) => {
            if (i === 1) {
              canvas.style.opacity = 1;
            } else {
              canvas.style.opacity = 0;
            }
          });
          if (resultValue === "win") {
            winTrigger.fire();
          } else if (resultValue === "lose") {
            loseTrigger.fire();
          }
        });
      });
    },
  });

  const cpuScissorsRive = new rive.Rive({
    src: "./assets/rivs/scissors.riv",
    autoplay: true,
    canvas: cpuCanvases[2],
    layout,
    stateMachines: "scissors",
    onLoad: (_) => {
      const inputs = cpuScissorsRive.stateMachineInputs("scissors");
      const winTrigger = inputs.find((i) => i.name === "scissors_lose");
      const loseTrigger = inputs.find((i) => i.name === "scissors_win");
      const buttons = document.querySelectorAll(".navigation__button");
      [...buttons].forEach((button) => {
        button.addEventListener("click", () => {
          if (cpuHand !== "scissors") return;
          [...cpuCanvases].forEach((canvas, i) => {
            if (i === 2) {
              canvas.style.opacity = 1;
            } else {
              canvas.style.opacity = 0;
            }
          });
          if (resultValue === "win") {
            winTrigger.fire();
          } else if (resultValue === "lose") {
            loseTrigger.fire();
          }
        });
      });
    },
  });

  const cpuPaperRive = new rive.Rive({
    src: "./assets/rivs/paper.riv",
    autoplay: true,
    canvas: cpuCanvases[3],
    layout,
    stateMachines: "paper",
    onLoad: (_) => {
      const inputs = cpuPaperRive.stateMachineInputs("paper");
      const winTrigger = inputs.find((i) => i.name === "paper_lose");
      const loseTrigger = inputs.find((i) => i.name === "paper_win");
      const buttons = document.querySelectorAll(".navigation__button");
      [...buttons].forEach((button) => {
        button.addEventListener("click", () => {
          if (cpuHand !== "paper") return;
          [...cpuCanvases].forEach((canvas, i) => {
            if (i === 3) {
              canvas.style.opacity = 1;
            } else {
              canvas.style.opacity = 0;
            }
          });
          if (resultValue === "win") {
            winTrigger.fire();
          } else if (resultValue === "lose") {
            loseTrigger.fire();
          }
        });
      });
    },
  });

  const rives = [
    youThinkingRive,
    youRockRive,
    cpuThinkingRive,
    cpuRockRive,
    youScissorsRive,
    cpuScissorsRive,
    youPaperRive,
    cpuPaperRive,
  ];

  resizeCanvas(rives);

  window.addEventListener("resize", () => {
    resizeCanvas(rives);
  });
});
