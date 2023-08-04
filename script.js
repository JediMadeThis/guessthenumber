const guessedNum = document.getElementById('gn');
const submitBtn = document.getElementById('submitBtn');
const hint = document.getElementById('hint');
const newGameBtn = document.getElementById('newGameBtn');
const darkModeBtn = document.getElementById('toggleDarkMode');
const timesGuessed = document.getElementById('timesGuessed');

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
  const answer = Number(guessedNum.value);
  hint.innerHTML = 'Hint: <em>Thinking...</em>';

  await wait(500);

  // input type not number
  if (typeof guessedNum !== 'number') {
    hint.textContent = "Error: That's not a number!";
  }

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

  // update tries
  timesGuessed.textContent = `Tries: ${tries}`;

  // on win
  if (answer === num) {
    hint.textContent = 'You won!';

    guessedNum.setAttribute('disabled', null);
    submitBtn.hidden = true;
    newGameBtn.hidden = false;
  }
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

// Dark mode implementation
let darkMode = false;

darkModeBtn.onclick = () => {
  let element = document.body;

  if (darkMode) {
    darkMode = false;

    element.classList.remove('darkMode');
    element.classList.add('lightMode');

    darkModeBtn.classList.add('lightMode');
    darkModeBtn.classList.remove('darkMode');

    darkModeBtn.textContent = 'Dark Mode';
  } else {
    darkMode = true;

    element.classList.remove('lightMode');
    element.classList.add('darkMode');

    darkModeBtn.classList.add('darkMode');
    darkModeBtn.classList.remove('lightMode');

    darkModeBtn.textContent = 'Light Mode';
  }
};

// wait function (delay)
function wait(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}
