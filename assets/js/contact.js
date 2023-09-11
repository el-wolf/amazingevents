const toastLiveExample = document.getElementById('liveToast');
const submitBtn = document.getElementById('sbmt');
const form = document.querySelector('form');

submitBtn.addEventListener('click', function (event) {
  if (form.checkValidity()) {
    event.preventDefault();
    const toastBootstrap = new bootstrap.Toast(toastLiveExample);
    toastBootstrap.show();
  }
});
