// ===============================
// Selecting all required elements
// ===============================
const start_btn = document.querySelector(".start_btn button");
const info_box = document.querySelector(".info_box");
const exit_btn = info_box.querySelector(".buttons .quit");
const continue_btn = info_box.querySelector(".buttons .restart");
const quiz_box = document.querySelector(".quiz_box");
const result_box = document.querySelector(".result_box");
const option_list = document.querySelector(".option_list");
const time_line = document.querySelector("header .time_line");
const timeText = document.querySelector(".timer .time_left_txt");
const timeCount = document.querySelector(".timer .timer_sec");
const next_btn = document.querySelector("footer .next_btn");
const bottom_ques_counter = document.querySelector("footer .total_que");

// ===============================
// Quiz variables
// ===============================
let timeValue = 15;
let que_count = 0;
let que_numb = 1;
let userScore = 0;
let counter;
let counterLine;

// ===============================
// Start Quiz
// ===============================
start_btn.onclick = () => {
    info_box.classList.add("activeInfo");
};

exit_btn.onclick = () => {
    info_box.classList.remove("activeInfo");
};

continue_btn.onclick = () => {
    info_box.classList.remove("activeInfo");
    quiz_box.classList.add("activeQuiz");
    resetQuiz();
};

// ===============================
// Restart / Quit
// ===============================
const restart_quiz = result_box.querySelector(".buttons .restart");
const quit_quiz = result_box.querySelector(".buttons .quit");

restart_quiz.onclick = () => {
    quiz_box.classList.add("activeQuiz");
    result_box.classList.remove("activeResult");
    resetQuiz();
};

quit_quiz.onclick = () => {
    window.location.reload();
};

// ===============================
// Next Button
// ===============================
next_btn.onclick = () => {
    if (que_count < questions.length - 1) {
        que_count++;
        que_numb++;
        loadQuestion();
    } else {
        clearInterval(counter);
        clearInterval(counterLine);
        showResult();
    }
};

// ===============================
// Load Question
// ===============================
function loadQuestion() {
    clearInterval(counter);
    clearInterval(counterLine);

    timeValue = 15;
    timeText.textContent = "Time Left";
    time_line.style.width = "0px";
    next_btn.classList.remove("show");

    showQuestion(que_count);
    queCounter(que_numb);
    startTimer(timeValue);
    startTimerLine();
}

// ===============================
// Show Question
// ===============================
function showQuestion(index) {
    const que_text = document.querySelector(".que_text");

    que_text.innerHTML = `<span>${questions[index].numb}. ${questions[index].question}</span>`;

    option_list.innerHTML = questions[index].options
        .map(opt => `<div class="option"><span>${opt}</span></div>`)
        .join("");

    const options = option_list.querySelectorAll(".option");
    options.forEach(option => {
        option.addEventListener("click", () => optionSelected(option));
    });
}

// ===============================
// Option Icons
// ===============================
const tickIcon = '<div class="icon tick"><i class="fas fa-check"></i></div>';
const crossIcon = '<div class="icon cross"><i class="fas fa-times"></i></div>';

// ===============================
// Option Selected
// ===============================
function optionSelected(answer) {
    if (answer.classList.contains("disabled")) return;

    clearInterval(counter);
    clearInterval(counterLine);

    const userAns = answer.textContent;
    const correctAns = questions[que_count].answer;
    const options = option_list.children;

    answer.classList.add("selected");

    if (userAns === correctAns) {
        userScore++;
        answer.classList.add("correct");
        answer.insertAdjacentHTML("beforeend", tickIcon);
    } else {
        answer.classList.add("incorrect");
        answer.insertAdjacentHTML("beforeend", crossIcon);

        [...options].forEach(opt => {
            if (opt.textContent === correctAns) {
                opt.classList.add("correct");
                opt.insertAdjacentHTML("beforeend", tickIcon);
            }
        });
    }

    [...options].forEach(opt => opt.classList.add("disabled"));
    next_btn.classList.add("show");
}

// ===============================
// Timer
// ===============================
function startTimer(time) {
    counter = setInterval(() => {
        timeCount.textContent = time < 10 ? `0${time}` : time;
        time--;

        if (time < 0) {
            clearInterval(counter);
            timeText.textContent = "Time Off";

            const options = option_list.children;
            const correctAns = questions[que_count].answer;

            [...options].forEach(opt => {
                if (opt.textContent === correctAns) {
                    opt.classList.add("correct");
                    opt.insertAdjacentHTML("beforeend", tickIcon);
                }
                opt.classList.add("disabled");
            });

            next_btn.classList.add("show");
        }
    }, 1000);
}

// ===============================
// Timeline (Responsive)
// ===============================
function startTimerLine() {
    let width = 0;
    const maxWidth = quiz_box.clientWidth;

    counterLine = setInterval(() => {
        width += maxWidth / (15 * 35);
        time_line.style.width = `${width}px`;

        if (width >= maxWidth) {
            clearInterval(counterLine);
        }
    }, 29);
}

// ===============================
// Question Counter
// ===============================
function queCounter(index) {
    bottom_ques_counter.innerHTML = `
        <span>
            <p>${index}</p> of <p>${questions.length}</p> Questions
        </span>
    `;
}

// ===============================
// Result
// ===============================
function showResult() {
    quiz_box.classList.remove("activeQuiz");
    result_box.classList.add("activeResult");

    const scoreText = result_box.querySelector(".score_text");
    let message = "";

    if (userScore >= 8) {
        message = "and congrats! 🎉";
    } else if (userScore >= 5) {
        message = "and nice 😎";
    } else {
        message = "and keep practicing 🙂";
    }

   scoreText.innerHTML = `
      <span class="result-score">
         ${message}, You got 
         <strong>${userScore}</strong> out of <strong>${questions.length}</strong>
      </span>
   `;


    // Save best score
    const bestScore = localStorage.getItem("bestScore") || 0;
    if (userScore > bestScore) {
        localStorage.setItem("bestScore", userScore);
    }
}

// ===============================
// Reset Quiz
// ===============================
function resetQuiz() {
    que_count = 0;
    que_numb = 1;
    userScore = 0;
    loadQuestion();
}

// ===============================
// Keyboard Support (1–4)
// ===============================
document.addEventListener("keydown", (e) => {
    const options = option_list.querySelectorAll(".option");
    if (!options.length) return;

    if (e.key >= "1" && e.key <= "4") {
        const index = e.key - 1;
        if (options[index] && !options[index].classList.contains("disabled")) {
            optionSelected(options[index]);
        }
    }
});
