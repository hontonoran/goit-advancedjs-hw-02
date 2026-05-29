import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  form: document.querySelector('.form'),
};

iziToast.settings({
  timeout: 5000,
  resetOnHover: true,
  icon: 'material-icons',
  transitionIn: 'flipInX',
  transitionOut: 'flipOutX',
  position: 'topRight',
});

const createPromise = (delay, state) => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      if (state.toLowerCase() === 'fulfilled') {
        res(delay);
      } else {
        rej(delay);
      }
    }, delay);
  });
};

const submitHandler = e => {
  e.preventDefault();

  const form = e.target;
  const delay = Number(form.elements['delay'].value);
  const state = form.elements['state'].value;

  createPromise(delay, state)
    .then(value => {
      iziToast.success({
        title: 'Fulfilled',
        message: `✅ Fulfilled promise in ${value}ms`,
      });
    })
    .catch(value => {
      iziToast.error({
        title: 'Rejected',
        message: `❌ Rejected promise in ${value}ms`,
      });
    });
};

refs.form.addEventListener('submit', submitHandler);
