let events = data.events;

const blankEvent = {
  image: "../images/not-found.png",
  name: "Nope",
  description: "Sorry, we don't have any events.",
  date: "2000-01-01",
  price: "N/A",
  detailsLink: "../images/not-found.png",
};

events.sort(function (a, b) {
  return new Date(b.date) - new Date(a.date);
});

const currentDate = new Date(data.currentDate);

const pastEvents = events.filter(event => new Date(event.date) < currentDate);
const upcomingEvents = events.filter(
  event => new Date(event.date) >= currentDate
);

generateEventCards(upcomingEvents);
generateSmallScreenEventCards(upcomingEvents);

// Tarjetas
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
      description.textContent = event.description;
      const buttonDiv = document.createElement("div");
      buttonDiv.className = "d-flex justify-content-between p-3";
      const priceButton = document.createElement("button");
      priceButton.className = "btn btn-outline-primary";
      priceButton.disabled = true;
      priceButton.textContent = `$${event.price}`;
      const detailsLink = document.createElement("a");
      detailsLink.className = "btn btn-primary";
      detailsLink.href = "./assets/pages/details.html";
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

//Tarjetitas
function generateSmallScreenEventCards(events) {
  const cardsContainer = document.querySelector(".d-sm-none");
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
    detailsLink.href = event.detailsLink;
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
