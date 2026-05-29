const form = document.querySelector('.feedback-form');

const lsKey = 'feedback-form-state';

let formData = {
  email: '',
  message: '',
};

const savedData = localStorage.getItem(lsKey);

if (savedData) {
  try {
    const parsedData = JSON.parse(savedData);

    formData.email = parsedData.email ?? '';
    formData.message = parsedData.message ?? '';

    form.elements.email.value = formData.email;
    form.elements.message.value = formData.message;
  } catch {
    localStorage.removeItem(lsKey);
  }
}

const inputHandler = event => {
  if (event.target.name !== 'email' && event.target.name !== 'message') {
    return;
  }

  formData.email = form.elements.email.value.trim();
  formData.message = form.elements.message.value.trim();

  localStorage.setItem(lsKey, JSON.stringify(formData));
};

const submitHandler = event => {
  event.preventDefault();

  formData.email = form.elements.email.value.trim();
  formData.message = form.elements.message.value.trim();

  if (!formData.email || !formData.message) {
    alert('Fill please all fields');
    return;
  }

  console.log(formData);

  formData = {
    email: '',
    message: '',
  };

  localStorage.removeItem(lsKey);
  form.reset();
};

form.addEventListener('input', inputHandler);
form.addEventListener('submit', submitHandler);
