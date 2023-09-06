

const queryString = window.location.search;
const params = new URLSearchParams(queryString);
const id = params.get("id");

const evento = data.events.find(eventg => eventg._id === id);
console.log(evento);

const divImg = document.getElementById("divImg");
const divInfo = document.getElementById("divInfo");

divImg.innerHTML = `<div>
      <img src="${evento.image}" alt="" class="img-fluid">
    </div>`;

console.log("ID del evento: " + id);

divInfo.innerHTML = `<div>
      <h2 class="card-title">${evento.name}</h2>
      <p class="card-text">Date: ${evento.date}</p>
      <p class="card-text">Description: ${evento.description}</p>
      <p class="card-text">Category: ${evento.category}</p>
      <p class="card-text">Place: ${evento.place}</p>
      <p class="card-text">Capacity: ${evento.capacity}</p>
      <p class="card-text">Assistance/Estimate: ${evento.estimate}</p>
      <button type="button" class="btn btn-outline-primary" disabled>$${evento.price}</button>
    </div>`;
