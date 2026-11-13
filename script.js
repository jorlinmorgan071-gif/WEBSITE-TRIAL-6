const filterButtons = document.querySelectorAll('.filter-btn');
const cards = [...document.querySelectorAll('.video-card')];
filterButtons.forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  filterButtons.forEach(item => item.classList.toggle('active', item === button));
  cards.forEach((card, index) => {
    const visible = filter === 'all' || card.dataset.category === filter;
    card.classList.add('is-hiding');
    window.setTimeout(() => {
      card.hidden = !visible;
      if (visible) {
        card.style.order = String(index);
        card.classList.remove('is-hiding');
      }
    }, 150);
  });
}));

const readToggle = document.querySelector('.read-toggle');
const reviewExtra = document.querySelector('.review-extra');
readToggle.addEventListener('click', () => {
  const expanded = readToggle.getAttribute('aria-expanded') === 'true';
  readToggle.setAttribute('aria-expanded', String(!expanded));
  reviewExtra.hidden = expanded;
  readToggle.innerHTML = expanded ? 'READ THE FULL FIELD NOTE <span>＋</span>' : 'CLOSE THE FIELD NOTE <span>−</span>';
});

const range = document.querySelector('#price-range');
const priceDisplay = document.querySelector('#price-display');
const budgetNote = document.querySelector('.budget-note');
const recommendations = [...document.querySelectorAll('.recommendation')];
function updateBudget() {
  const budget = Number(range.value);
  const percent = ((budget - Number(range.min)) / (Number(range.max) - Number(range.min))) * 100;
  priceDisplay.textContent = `$${budget.toLocaleString()}`;
  range.style.background = `linear-gradient(to right, var(--blue) 0%, var(--blue) ${percent}%, #383838 ${percent}%)`;
  recommendations.forEach(card => {
    const over = Number(card.dataset.price) > budget;
    card.classList.toggle('is-over-budget', over);
    card.style.order = String(Number(card.dataset.price));
  });
  budgetNote.innerHTML = `SHOWING PICKS UP TO <span>$${budget.toLocaleString()}</span> <span>—</span> MORE BUDGET, MORE OPTIONS.`;
}
range.addEventListener('input', updateBudget);
updateBudget();

const prompt = document.querySelector('.email-prompt');
const emailInput = document.querySelector('#email');
const pitches = ['The one gadget worth your money.', 'A little less hype in your inbox.', 'The honest take, once a week.'];
let pitchIndex = 0;
let character = 0;
let deleting = false;
function typePitch() {
  if (document.activeElement === emailInput || emailInput.value) {
    prompt.textContent = '';
    window.setTimeout(typePitch, 250);
    return;
  }
  const pitch = pitches[pitchIndex];
  character += deleting ? -1 : 1;
  prompt.textContent = pitch.slice(0, character);
  let delay = deleting ? 30 : 55;
  if (!deleting && character === pitch.length) { deleting = true; delay = 1600; }
  else if (deleting && character === 0) { deleting = false; pitchIndex = (pitchIndex + 1) % pitches.length; delay = 350; }
  window.setTimeout(typePitch, delay);
}
typePitch();
emailInput.addEventListener('focus', () => { prompt.textContent = ''; });
emailInput.addEventListener('blur', () => { if (!emailInput.value) { character = 0; deleting = false; } });

document.querySelector('.signup-form').addEventListener('submit', event => {
  event.preventDefault();
  if (!emailInput.checkValidity()) { emailInput.reportValidity(); return; }
  document.querySelector('.form-message').textContent = 'YOU’RE ON THE LIST. KEEP AN EYE OUT.';
  document.querySelector('.form-message').style.color = 'var(--yellow)';
  emailInput.value = '';
});

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('open', !open);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

const toneSections = document.querySelectorAll('.section-tone');
if ('IntersectionObserver' in window) {
  const toneObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const tone = entry.target.dataset.tone;
        document.documentElement.style.setProperty('--accent', `var(--${tone})`);
      }
    });
  }, { rootMargin: '-40% 0px -45% 0px' });
  toneSections.forEach(section => toneObserver.observe(section));
}
