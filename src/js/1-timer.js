import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  picker: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('[data-start]'),
  daysLbl: document.querySelector('[data-days]'),
  hoursLbl: document.querySelector('[data-hours]'),
  minutesLbl: document.querySelector('[data-minutes]'),
  secondsLbl: document.querySelector('[data-seconds]'),
};

let userSelectedDate = null;
let timerId = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    setDate(selectedDates[0]);
  },
};

flatpickr(refs.picker, options);

const validateDate = (date, showMessage = true) => {
  const isValid = date instanceof Date && !isNaN(date) && date > Date.now();

  if (!isValid) {
    if (showMessage) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
      });
    }
    refs.startBtn.disabled = true;
    userSelectedDate = null;
    return false;
  }

  refs.startBtn.disabled = false;
  return true;
};

const setDate = (date, showMessage = true) => {
  if (validateDate(date, showMessage)) {
    userSelectedDate = date;
  }
};

const convertMs = ms => {
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
};

const formatNumber = num => String(num).padStart(2, '0');

const showTimer = ({ days, hours, minutes, seconds }) => {
  refs.daysLbl.textContent = formatNumber(days);
  refs.hoursLbl.textContent = formatNumber(hours);
  refs.minutesLbl.textContent = formatNumber(minutes);
  refs.secondsLbl.textContent = formatNumber(seconds);
};

const timerHandler = () => {
  const left = convertMs(userSelectedDate.getTime() - Date.now());
  const isFinish = Object.values(left).every(v => v <= 0);

  if (isFinish) {
    clearInterval(timerId);
    refs.picker.disabled = false;
    showTimer({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    return;
  }

  showTimer(left);
};

const startTimer = () => {
  if (validateDate(userSelectedDate)) {
    timerHandler();
    timerId = setInterval(timerHandler, 1000);
    refs.picker.disabled = true;
    refs.startBtn.disabled = true;
  }
};

refs.startBtn.addEventListener('click', startTimer);

validateDate(null, false);
