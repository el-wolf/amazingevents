let data = {};
let evento;
let id;
const url = "https://mindhub-xj03.onrender.com/api/amazing";
fetchData(url);

function fetchData(url) {
  fetch(url)
    .then(response => response.json())
    .then(datos => {
      const queryString = window.location.search;
      const params = new URLSearchParams(queryString);
      id = params.get("id");

      data = datos;
      evento = data.events.find(event => event._id == id);

      if (evento) {
        displayEventDetails(evento);
      } else {
        displayErrorMessage("Event not found.");
      }
    });
}


function displayEventDetails(event) {
  const divImg = document.getElementById("divImg");
  const divInfo = document.getElementById("divInfo");

  divImg.innerHTML = `<div>
    <img src="${event.image}" alt="" class="img-fluid" width="636" height="398">
  </div>`;

  divInfo.innerHTML = `<div>
    <h2 class="card-title mb-3">${event.name}</h2>
    <p class="card-text">Date: ${event.date}</p>
    <p class="card-text">Description: ${event.description}</p>
    <p class="card-text">Category: ${event.category}</p>
    <p class="card-text">Place: ${event.place}</p>
    <p class="card-text">Capacity: ${event.capacity}</p>
    <p class="card-text">Assistance/Estimate: ${event.assistance}</p>
    <button type="button" class="btn btn-outline-primary" disabled>$${event.price}</button>
  </div>`;
}

function displayErrorMessage(message) {
  const errorContainer = document.getElementById("error-container");
  errorContainer.textContent = message;
}
