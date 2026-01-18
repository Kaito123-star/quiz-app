const question = document.getElementById("question");
const yesBtn = document.getElementById("yes");
const noBtn = document.getElementById("no");
const result = document.getElementById("result");
const scoreText = document.getElementById("score");
const timerText = document.getElementById("timer");
const restartBtn = document.getElementById("restart");
const correctSound = new Audio("correct.mp3");
const wrongSound = new Audio("wrong.mp3");
const timeoutSound = new Audio("timeout.mp3");
const rankText = document.getElementById("rank");

// クイズデータ
const quiz = [
  { text: "HTMLはWebページの構造を定義する言語である。", answer: "yes" },
  { text: "CSSはWebページの見た目を指定するために使われる。", answer: "yes" },
  { text: "JavaScriptはWebページに動きをつけることができる。", answer: "yes" },
  { text: "HTMLだけでボタンのクリック処理を書くことができる。", answer: "no" },
  { text: "addEventListenerはJavaScriptの機能である。", answer: "yes" },
  { text: "constで宣言した変数は再代入できない。", answer: "yes" },
  { text: "if文は条件分岐を行うための構文である。", answer: "yes" },
  { text: "setIntervalは一度だけ処理を実行する。", answer: "no" },
  { text: "querySelectorはHTML要素を取得できる。", answer: "yes" },
  { text: "配列は1つの値しか保存できない。", answer: "no" }
];


let current = 0;
let score = 0;
let time = 5;
let timerId;

// 問題表示
function showQuestion() {
  question.textContent = quiz[current].text;
  result.textContent = "";
  scoreText.textContent = "";

  resetResultStyle();

  clearInterval(timerId);
  startTimer();
}

// タイマー開始
function startTimer() {
  time = 5;
  timerText.textContent = `残り時間：${time}秒`;

  timerId = setInterval(() => {
    time--;
    timerText.textContent = `残り時間：${time}秒`;

    if (time === 0) {
      clearInterval(timerId);
      resetResultStyle();
      result.textContent = "時間切れ！";
      result.classList.add("timeout");
      timeoutSound.play();
      current++;

      if (current < quiz.length) {
        setTimeout(showQuestion, 1000);
      } else {
        endQuiz();
      }
    }
  }, 1000);
}

// 正誤判定
function checkAnswer(selected) {
  clearInterval(timerId);
  resetResultStyle();
  resetSounds();
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

  if (current < quiz.length) {
    setTimeout(showQuestion, 1000);
  } else {
    endQuiz();
  }
}


// 終了処理
function endQuiz() {
  question.textContent = "クイズ終了！";
  result.textContent = "";
  timerText.textContent = "";
  scoreText.textContent = `${quiz.length}問中 ${score}問正解`;
  rankText.textContent = getRank(score, quiz.length);
  yesBtn.disabled = true;
  noBtn.disabled = true;
  restartBtn.style.display = "inline-block";
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function resetResultStyle() {
  result.className = "";
}

function resetSounds() {
  correctSound.currentTime = 0;
  wrongSound.currentTime = 0;
  timeoutSound.currentTime = 0;
}

function getRank(score, total) {
  const rate = score / total;

  if (rate === 1) {
    return "Sランク 🌟 完璧！";
  } else if (rate >= 0.8) {
    return "Aランク 👍 すごい！";
  } else if (rate >= 0.5) {
    return "Bランク 🙂 いい調子";
  } else {
    return "Cランク 💪 次はもっといける！";
  }
}


// ボタン
yesBtn.addEventListener("click", () => checkAnswer("yes"));
noBtn.addEventListener("click", () => checkAnswer("no"));
restartBtn.addEventListener("click", () => {
  current = 0;
  score = 0;
  rankText.textContent = "";
  shuffle(quiz); // ← 追加
  yesBtn.disabled = false;
  noBtn.disabled = false;
  restartBtn.style.display = "none";

  shuffle(quiz);
  showQuestion();
});

