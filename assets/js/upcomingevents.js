let data = {};
let events = [];
let checkboxes = [];
let currentDate;
let pastEvents;
let upcomingEvents;

const noMatchingEventsMessage = document.getElementById("no-matching-events");

const blankEvent = {
  image: "../images/not-found.png",
  name: "Nope",
  description: "Sorry, we don't have any events.",
  date: "2000-01-01",
  price: "N/A",
  detailsLink: "../images/not-found.png",
};

const categoriesContainer = document.getElementById("categories");
const categoriesContentContainer =
  document.getElementById("categories-content");
const searchInput = categoriesContainer.querySelector("input[type='search']");
const submitSearch = categoriesContainer.querySelector("button[type='submit']");

function fetchData() {
  showSpinner();
  return fetch("https://mindhub-xj03.onrender.com/api/amazing")
    .then(response => response.json())
    .then(datos => {
      data = datos;
      events = data.events;
      currentDate = new Date(data.currentDate);
      pastEvents = events.filter(event => new Date(event.date) < currentDate);
      upcomingEvents = events.filter(
        event => new Date(event.date) >= currentDate
      );

      createCategoryCheckboxes();
      generateEventCards(upcomingEvents);
      generateSmallScreenEventCards(upcomingEvents);

      checkboxes = categoriesContentContainer.querySelectorAll(
        "input[type='checkbox']"
      );

      submitSearch.addEventListener("click", function (event) {
        event.preventDefault();
        applyFilters();
      });

      categoriesContentContainer.addEventListener("change", function (event) {
        if (event.target && event.target.type === "checkbox") {
          applyFilters();
        }
      });
      hideSpinner();
    })
    .catch(error => {
      console.log(" ////// ERROR ////// " + error);
    });
}

fetchData();

function createCategoryCheckboxes() {
  const addedCategories = [];

  data.events.forEach(evento => {
    const category = evento.category;

    if (!addedCategories.includes(category)) {
      addedCategories.push(category);

      const checkboxDiv = document.createElement("div");
      checkboxDiv.classList.add("form-check", "form-check-inline");

      const checkboxId = evento._id;
      const checkbox = document.createElement("input");
      checkbox.classList.add("form-check-input");
      checkbox.type = "checkbox";
      checkbox.id = checkboxId;
      checkbox.value = category;

      const label = document.createElement("label");
      label.classList.add("form-check-label");
      label.setAttribute("for", checkboxId);
      label.textContent = category;

      checkboxDiv.appendChild(checkbox);
      checkboxDiv.appendChild(label);

      categoriesContentContainer.appendChild(checkboxDiv);
    }
  });
}

function generateEventCards(events) {
  const eventContainer = document.querySelector(".carousel-inner");
  const indicatorsContainer = document.querySelector(".carousel-indicators");

  while (events.length % 3 !== 0) {
    events.push(blankEvent);
  }

  for (let i = 0; i < events.length; i += 3) {
    const group = events.slice(i, i + 3);
    const cardGroup = document.createElement("div");
    cardGroup.className = "carousel-item";

    const cardsWrapper = document.createElement("div");
    cardsWrapper.className = "cards-w";
    cardsWrapper.setAttribute("data-bs-theme", "dark");

    for (let j = i; j < i + 3 && j < events.length; j++) {
      const event = events[j];
      const card = document.createElement("div");
      card.className = "card border-dark";

      if (event === blankEvent) {
        card.classList.add("blank-event");
      }

      const imageContainer = document.createElement("div");
      imageContainer.className = "image-w";
      const image = document.createElement("img");
      image.src = event.image;
      image.alt = event.title;
      image.classList.add("h-100");
      imageContainer.appendChild(image);
      card.appendChild(imageContainer);

      const cardBody = document.createElement("div");
      cardBody.className = "card-body";
      const title = document.createElement("h5");
      title.className = "card-title";
      title.textContent = event.name;
      const description = document.createElement("p");
      description.className = "card-text";
      description.textContent = `${event.description.slice(0, 80)}... `;
      const buttonDiv = document.createElement("div");
      buttonDiv.className = "d-flex justify-content-between p-3";
      const priceButton = document.createElement("button");
      priceButton.className = "btn btn-outline-primary";
      priceButton.disabled = true;
      priceButton.textContent = `$${event.price}`;
      const detailsLink = document.createElement("a");
      detailsLink.className = "btn btn-primary";
      detailsLink.href = `./details.html?id=${event._id}`;
      detailsLink.textContent = "Details";
      buttonDiv.appendChild(priceButton);
      buttonDiv.appendChild(detailsLink);

      cardBody.appendChild(title);
      cardBody.appendChild(description);
      cardBody.appendChild(buttonDiv);

      card.appendChild(cardBody);
      cardsWrapper.appendChild(card);
    }

    const indicatorButton = document.createElement("button");
    indicatorButton.type = "button";
    indicatorButton.setAttribute(
      "data-bs-target",
      "#carouselExampleIndicators"
    );
    indicatorButton.setAttribute("data-bs-slide-to", i / 3);
    if (i === 0) {
      indicatorButton.classList.add("active");
      indicatorButton.setAttribute("aria-current", "true");
    }
    indicatorButton.setAttribute("aria-label", `Slide ${i / 3 + 1}`);

    indicatorsContainer.appendChild(indicatorButton);

    cardGroup.appendChild(cardsWrapper);
    eventContainer.appendChild(cardGroup);
  }

  eventContainer.firstElementChild.classList.add("active");
}

function generateSmallScreenEventCards(events) {
  const cardsContainer = document.getElementById("sm-main-content");
  cardsContainer.classList.add("flex-column");

  for (const event of events) {
    const card = document.createElement("div");
    card.classList.add("card", "border-dark", "mb-3");

    const imageWrapper = document.createElement("div");
    imageWrapper.classList.add("image-w");

    const image = document.createElement("img");
    image.src = event.image;
    image.alt = event.title;
    image.classList.add("h-100");

    imageWrapper.appendChild(image);

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = event.name;

    const cardText = document.createElement("p");
    cardText.classList.add("card-text");
    cardText.textContent = event.description;

    const buttonGroup = document.createElement("div");
    buttonGroup.classList.add("d-flex", "justify-content-between", "p-3");

    const priceButton = document.createElement("button");
    priceButton.type = "button";
    priceButton.classList.add("btn", "btn-outline-primary");
    priceButton.disabled = true;
    priceButton.textContent = `$${event.price}`;

    const detailsLink = document.createElement("a");
    detailsLink.href = `./details.html?id=${event._id}`;
    detailsLink.classList.add("btn", "btn-primary");
    detailsLink.textContent = "Details";

    buttonGroup.appendChild(priceButton);
    buttonGroup.appendChild(detailsLink);

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);
    cardBody.appendChild(buttonGroup);

    card.appendChild(imageWrapper);
    card.appendChild(cardBody);

    card.style.width = "100%";

    cardsContainer.appendChild(card);
  }
}

function applyFilters() {
  const selectedCategories = Array.from(checkboxes)
    .filter(checkbox => checkbox.checked)
    .map(checkbox => checkbox.value);

  const searchTerm = searchInput.value.toLowerCase().trim();

  const filteredEvents = upcomingEvents.filter(event => {
    const categoriesMatch =
      selectedCategories.length === 0 ||
      selectedCategories.includes(event.category);

    const nameMatch = event.name.toLowerCase().includes(searchTerm);
    const descriptionMatch = event.description
      .toLowerCase()
      .includes(searchTerm);

    return categoriesMatch && (nameMatch || descriptionMatch);
  });

  noMatchingEventsMessage.style.display =
    filteredEvents.length === 0 ? "block" : "none";

  updateEventCards(filteredEvents);
}

function updateEventCards(filteredEvents) {
  const eventContainer = document.querySelector(".carousel-inner");
  const indicatorsContainer = document.querySelector(".carousel-indicators");
  const smallScreenCardsContainer = document.getElementById("sm-main-content");

  eventContainer.innerHTML = "";
  indicatorsContainer.innerHTML = "";
  smallScreenCardsContainer.innerHTML = "";

  generateEventCards(filteredEvents);
  generateSmallScreenEventCards(filteredEvents);
}

function showSpinner() {
  const spinnerContainer = document.getElementById("spinner-container");
  const loadingSpinner = document.getElementById("loading-spinner");
  const loadingSpinnerSm = document.getElementById("loading-spinner-sm");

  spinnerContainer.style.display = "block";
  loadingSpinner.style.display = "block";
  loadingSpinnerSm.style.display = "block";
}

function hideSpinner() {
  const spinnerContainer = document.getElementById("spinner-container");
  const loadingSpinner = document.getElementById("loading-spinner");
  const loadingSpinnerSm = document.getElementById("loading-spinner-sm");

  spinnerContainer.style.display = "none";
  loadingSpinner.style.display = "none";
  loadingSpinnerSm.style.display = "none";
  spinnerContainer.classList.remove("p-5");
}
