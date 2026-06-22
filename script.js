const numbersEl = document.querySelector("#numbers");
const stageEl = document.querySelector(".stage");
const resultEl = document.querySelector("#result");
const pickButton = document.querySelector("#pickButton");
const partnerForm = document.querySelector("#partnerForm");
const partnerSubmit = document.querySelector("#partnerSubmit");
const formStatus = document.querySelector("#formStatus");

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

partnerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  partnerSubmit.disabled = true;
  formStatus.classList.remove("error");
  formStatus.textContent = "문의 내용을 보내는 중입니다...";

  try {
    const response = await fetch(partnerForm.action, {
      method: "POST",
      body: new FormData(partnerForm),
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Form submission failed");
    }

    partnerForm.reset();
    formStatus.textContent = "문의가 접수되었습니다. 감사합니다.";
  } catch (error) {
    formStatus.classList.add("error");
    formStatus.textContent = "전송에 실패했습니다. 잠시 후 다시 시도해주세요.";
  } finally {
    partnerSubmit.disabled = false;
  }
});

resetNumbers();
