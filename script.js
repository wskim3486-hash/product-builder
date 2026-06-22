const numbersEl = document.querySelector("#numbers");
const stageEl = document.querySelector(".stage");
const resultEl = document.querySelector("#result");
const pickButton = document.querySelector("#pickButton");

const numbers = Array.from({ length: 99 }, (_, index) => index + 1);

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function createNumberChip(number) {
  const chip = document.createElement("span");
  chip.className = "number-chip";
  chip.textContent = number;
  chip.dataset.number = number;
  chip.style.left = `${randomBetween(235, 790)}px`;
  chip.style.top = `${randomBetween(95, 455)}px`;
  chip.style.setProperty("--x", `${randomBetween(80, 240)}px`);
  chip.style.setProperty("--y", `${randomBetween(-130, 130)}px`);
  chip.style.setProperty("--delay", `${randomBetween(-3, 0)}s`);
  chip.style.setProperty("--duration", `${randomBetween(2.3, 4.6)}s`);
  return chip;
}

function resetNumbers() {
  numbersEl.replaceChildren(...numbers.map(createNumberChip));
}

function pickNumber() {
  const winner = Math.floor(Math.random() * 99) + 1;
  const chips = [...document.querySelectorAll(".number-chip")];

  pickButton.disabled = true;
  pickButton.textContent = "숫자 날리는 중...";
  resultEl.textContent = "?";
  stageEl.classList.add("picking");

  setTimeout(() => {
    chips.forEach((chip) => {
      chip.classList.toggle("winner", Number(chip.dataset.number) === winner);
      if (Number(chip.dataset.number) !== winner) {
        chip.style.opacity = "0.28";
      }
    });
    resultEl.textContent = winner;
    pickButton.textContent = "다시 뽑기";
    pickButton.disabled = false;
    stageEl.classList.remove("picking");
  }, 1600);
}

pickButton.addEventListener("click", () => {
  resetNumbers();
  requestAnimationFrame(pickNumber);
});

resetNumbers();
