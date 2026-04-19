import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import '../css/1-timer.css';

const inputEl = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('[data-start]');

const timerEl = document.querySelector('.timer');
const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

let userSelectedDate = null; // Обрана користувачем дата
let timerId = null; // ID для майбутнього інтервалу

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    if (userSelectedDate <= new Date()) {
      iziToast.error({
        message: 'Please choose a date in the future',
        timeout: 2500,
        position: 'topRight',
        displayMode: 'replace',
        transitionIn: 'bounceInDown',
        transitionOut: 'fadeOutRight',
      });
      startBtn.disabled = true;
      return;
    }
    startBtn.disabled = false;
  },
};

flatpickr('#datetime-picker', options);

setTimeout(
  () =>
    iziToast.info({
      icon: '',
      title: '😉 Hello!',
      message:
        'This timer was created by Volodymyr Burtsev.<br>It was additionally improved to show the most accurate countdown.<br>Check out how it works with your system time.',
      timeout: 3000,
      position: 'topCenter',
      pauseOnHover: false,
      resetOnHover: true,
      progressBarColor: '#20488888',
      transitionIn: 'bounceInRight',
      transitionOut: 'fadeOutUp',
      transitionInMobile: 'fadeIn',
      transitionOutMobile: 'fadeOut',
      closeOnClick: true,
    }),
  2000
);

startBtn.addEventListener('click', () => {
  startBtn.disabled = true;
  inputEl.disabled = true;

  const timerTarget = document.createElement('div');
  timerTarget.classList.add('timer-target');
  secondsEl.before(timerTarget);

  // Функція, яка оновлює значення таймера в UI
  const tick = () => {
    const currentTime = new Date();
    // Визначаємо лічильник з виправленням похибки в 1 секунду
    const deltaTime = userSelectedDate - currentTime + (currentTime % 1000);

    // Якщо час вийшов, зупиняємо таймер
    if (deltaTime <= 0) {
      clearInterval(timerId);
      updateTimerUI(0); // фіксуємо фінал на нулях в UI
      inputEl.disabled = false;

      // Додаємо анімацію завершення в таймері
      timerEl.classList.add('timer-blink');
      inputEl.classList.add('timer-blink');
      setTimeout(() => timerEl.classList.remove('timer-blink'), 1000);
      setTimeout(() => inputEl.classList.remove('timer-blink'), 1000);
      iziToast.success({
        icon: '',
        title: '🎉&nbsp;Done!',
        timeout: 2000,
        target: '.timer-target',
        balloon: true,
        position: 'topCenter',
        maxWidth: 120,
        progressBar: false,
        transitionIn: 'bounceInRight',
        transitionOut: 'fadeOutUp',
        transitionInMobile: 'fadeIn',
        transitionOutMobile: 'fadeOut',
        closeOnClick: true,
        onClosed: function () {
          const timerTarget = document.querySelector('.timer-target');
          timerTarget.remove();
        },
      });
      return;
    }

    updateTimerUI(deltaTime);
  };

  tick(); // Миттєво оновлюємо UI при кліку

  // Розрахунок затримки до наступної секунди
  const delayToNextSecond = 1000 - (Date.now() % 1000);
  // Запуск інтервалу з урахуванням затримки
  setTimeout(
    () => {
      tick(); // Повторне оновлення для усунення похибки за долю секунди
      timerId = setInterval(tick, 1000);
    },
    delayToNextSecond // Похибка в межах 1 секунди
  );
});

function updateTimerUI(deltaTime) {
  const { days, hours, minutes, seconds } = convertMs(deltaTime);

  const addLeadingZero = value => String(value).padStart(2, '0');

  daysEl.textContent = addLeadingZero(days);
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEl.textContent = addLeadingZero(seconds);
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
