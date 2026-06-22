const numbersEl = document.querySelector("#numbers");
const stageEl = document.querySelector(".stage");
const resultEl = document.querySelector("#result");
const pickButton = document.querySelector("#pickButton");
const partnerForm = document.querySelector("#partnerForm");
const partnerSubmit = document.querySelector("#partnerSubmit");
const formStatus = document.querySelector("#formStatus");
const commentForm = document.querySelector("#commentForm");
const commentName = document.querySelector("#commentName");
const commentMessage = document.querySelector("#commentMessage");
const commentCount = document.querySelector("#commentCount");
const commentsList = document.querySelector("#commentsList");

const numbers = Array.from({ length: 99 }, (_, index) => index + 1);
const commentsStorageKey = "fan-number-picker-comments";

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

function getComments() {
  try {
    return JSON.parse(localStorage.getItem(commentsStorageKey)) ?? [];
  } catch (error) {
    return [];
  }
}

function saveComments(comments) {
  localStorage.setItem(commentsStorageKey, JSON.stringify(comments));
}

function formatCommentDate(isoDate) {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(isoDate));
}

function renderComments() {
  const comments = getComments();
  commentCount.textContent = `${comments.length}개`;

  if (comments.length === 0) {
    const empty = document.createElement("p");
    empty.className = "comment-empty";
    empty.textContent = "아직 댓글이 없습니다. 첫 응원 댓글을 남겨주세요.";
    commentsList.replaceChildren(empty);
    return;
  }

  const items = comments.map((comment) => {
    const item = document.createElement("article");
    item.className = "comment-item";

    const meta = document.createElement("div");
    meta.className = "comment-meta";

    const author = document.createElement("span");
    author.className = "comment-author";
    author.textContent = comment.name;

    const date = document.createElement("time");
    date.className = "comment-date";
    date.dateTime = comment.createdAt;
    date.textContent = formatCommentDate(comment.createdAt);

    const message = document.createElement("p");
    message.className = "comment-message";
    message.textContent = comment.message;

    meta.append(author, date);
    item.append(meta, message);
    return item;
  });

  commentsList.replaceChildren(...items);
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

commentForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = commentName.value.trim();
  const message = commentMessage.value.trim();

  if (!name || !message) {
    return;
  }

  const comments = getComments();
  comments.unshift({
    id: crypto.randomUUID(),
    name,
    message,
    createdAt: new Date().toISOString(),
  });

  saveComments(comments.slice(0, 20));
  commentForm.reset();
  renderComments();
});

resetNumbers();
renderComments();
