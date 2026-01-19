const question = document.getElementById("question");
const yesBtn = document.getElementById("yes");
const noBtn = document.getElementById("no");
const result = document.getElementById("result");
const scoreText = document.getElementById("score");
const timerText = document.getElementById("timer");
const restartBtn = document.getElementById("restart");
const rankText = document.getElementById("rank");

const correctSound = new Audio("correct.mp3");
const wrongSound = new Audio("wrong.mp3");
const timeoutSound = new Audio("timeout.mp3");

const quiz = [
  { text: "HTMLはWebページの構造を定義する言語である。", answer: "yes" },
  { text: "CSSはWebページの見た目を指定するために使われる。", answer: "yes" },
  { text: "JavaScriptはWebページに動きをつけることができる。", answer: "yes" },
  { text: "HTMLだけでボタンのクリック処理を書くことができる。", answer: "no" },
  { text: "addEventListenerはJavaScriptの機能である。", answer: "yes" }
];

let current = 0;
let score = 0;
let time = 5;
let timerId;
let isAnswered = false;

/* ---------- 共通 ---------- */
function stopAllSounds() {
  [correctSound, wrongSound, timeoutSound].forEach(sound => {
    sound.pause();
    sound.currentTime = 0;
  });
}

function resetResultStyle() {
  result.className = "";
}

/* ---------- 問題表示 ---------- */
function showQuestion() {
  isAnswered = false;
  question.textContent = quiz[current].text;
  result.textContent = "";
  scoreText.textContent = "";
  resetResultStyle();
  clearInterval(timerId);
  startTimer();
}

/* ---------- タイマー ---------- */
function startTimer() {
  time = 5;
  timerText.textContent = `残り時間：${time}秒`;

  timerId = setInterval(() => {
    time--;
    timerText.textContent = `残り時間：${time}秒`;

    if (time === 0) {
      clearInterval(timerId);
      isAnswered = true;
      stopAllSounds();
      result.textContent = "時間切れ！";
      result.classList.add("timeout");
      timeoutSound.play();
      current++;

      current < quiz.length
        ? setTimeout(showQuestion, 1000)
        : endQuiz();
    }
  }, 1000);
}

/* ---------- 正誤判定 ---------- */
function checkAnswer(selected) {
  if (isAnswered) return;
  isAnswered = true;

  clearInterval(timerId);
  stopAllSounds();
  resetResultStyle();

  if (selected === quiz[current].answer) {
    result.textContent = "正解！🎉";
    result.classList.add("correct");
    correctSound.play();
    score++;
  } else {
    result.textContent = "不正解…";
    result.classList.add("wrong");
    wrongSound.play();
  }

  current++;
  current < quiz.length
    ? setTimeout(showQuestion, 1000)
    : endQuiz();
}

/* ---------- 終了 ---------- */
function endQuiz() {
  question.textContent = "クイズ終了！";
  timerText.textContent = "";
  scoreText.textContent = `${quiz.length}問中 ${score}問正解`;
  rankText.textContent = getRank(score, quiz.length);
  yesBtn.disabled = true;
  noBtn.disabled = true;
  restartBtn.style.display = "inline-block";
}

function getRank(score, total) {
  const rate = score / total;
  if (rate === 1) return "Sランク 🌟";
  if (rate >= 0.8) return "Aランク 👍";
  if (rate >= 0.5) return "Bランク 🙂";
  return "Cランク 💪";
}

/* ---------- ボタン ---------- */
yesBtn.addEventListener("click", () => checkAnswer("yes"));
noBtn.addEventListener("click", () => checkAnswer("no"));

restartBtn.addEventListener("click", () => {
  current = 0;
  score = 0;
  rankText.textContent = "";
  yesBtn.disabled = false;
  noBtn.disabled = false;
  restartBtn.style.display = "none";
  showQuestion();
});
