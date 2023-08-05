const guessedNum = document.getElementById('gn');
const submitBtn = document.getElementById('submitBtn');
const hint = document.getElementById('hint');
const newGameBtn = document.getElementById('newGameBtn');
const darkModeBtn = document.getElementById('toggleDarkMode');
const timesGuessed = document.getElementById('timesGuessed');

const userDarkMode = window.matchMedia('(prefers-color-scheme:dark)').matches;

guessedNum.addEventListener('input', (event) => {
  const maxLength = 5;
  const originalText = event.target.value;
  const truncatedValue = originalText.slice(0, maxLength);

  if (truncatedValue !== originalText) {
    guessedNum.value = truncatedValue;
  }
});

let tries = 0;
let maxNum = 1000;

const radios = document.querySelectorAll(
  'input[type=radio][name="difficulty"]'
);

let num = Math.floor(Math.random() * (maxNum - 1 + 1)) + 1;
console.log(`Answer: ${num}`);

// on difficulty change
Array.prototype.forEach.call(radios, function (radio) {
  radio.addEventListener('change', async (event) => {
    maxNum = event.target.value;

    hint.innerHTML = 'Hint: <em>Regenerating answer...</em>';
    await wait(500);

    tries = 0;
    timesGuessed.textContent = `Tries: ${tries}`;

    num = Math.floor(Math.random() * (maxNum - 1 + 1)) + 1;
    console.log(`New answer: ${num}`);
    hint.textContent = 'Hint: -';
  });
});

// on submit
submitBtn.onclick = async () => {
  // if nothing is in the textbox, returns nothing
  if (!guessedNum.value) return;

  // if input type not number
  if (!/^\d+$/.test(guessedNum.value)) return;

  const answer = Number(guessedNum.value);
  hint.innerHTML = 'Hint: <em>Thinking...</em>';

  await wait(500);

  // number exceeded limit
  if (answer > maxNum) {
    hint.textContent = `Error: That's over ${maxNum}!`;
    return;
  }

  // number too high
  if (answer > num) {
    hint.textContent = 'Hint: Number too high!';
    tries++;
  }

  // number too low
  if (answer < num) {
    hint.textContent = 'Hint: Number too low!';
    tries++;
  }

  // on win
  if (answer === num) {
    tries++;
    hint.textContent = 'You won!';

    guessedNum.setAttribute('disabled', null);
    submitBtn.hidden = true;
    newGameBtn.hidden = false;
  }

  // update tries
  timesGuessed.textContent = `Tries: ${tries}`;
};

// Reloads website when "New Game" button clicked.
newGameBtn.onclick = () => {
  location.reload();
};

// Submit on Enter
guessedNum.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    submitBtn.click();
  }
});

// Dark mode
if (userDarkMode) darkMode();

darkModeBtn.onclick = () => {
  let element = document.body;

  if (element.classList.contains('darkMode')) lightMode();
  else darkMode();
};

function darkMode() {
  let element = document.body;

  element.classList.remove('lightMode');
  element.classList.add('darkMode');

  darkModeBtn.classList.add('darkMode');
  darkModeBtn.classList.remove('lightMode');

  darkModeBtn.textContent = 'Light Mode';
}

function lightMode() {
  let element = document.body;

  element.classList.remove('darkMode');
  element.classList.add('lightMode');

  darkModeBtn.classList.add('lightMode');
  darkModeBtn.classList.remove('darkMode');

  darkModeBtn.textContent = 'Dark Mode';
}

// hide content before page loads
document.addEventListener('DOMContentLoaded', () => {
  let element = document.body;
  element.hidden = false;
});

// wait function (delay)
function wait(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}
