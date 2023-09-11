// Ganancia: Suma de la (asistencia o estimado) * precio de cada evento, de cada categoría.
// Porcentaje de asistencia:  (asistencia o estimado)* 100 / capacidad de cada evento, de cada categoría.

const url = "https://mindhub-xj03.onrender.com/api/amazing";
const eventsStatistics = document.getElementById("eventsStatistics");
const upcomingEventsStatistics = document.getElementById(
  "upcomingEventsStatistics"
);
const pastEventsStatistics = document.getElementById("pastEventsStatistics");
let data = {};
let highestAttendanceEvent = null;
let lowestAttendanceEvent = null;
let highestCapacityEvent = null;

fetchData(url);
function fetchData(url) {
  showSpinner();
  fetch(url)
    .then(response => response.json())
    .then(datos => {
      data = datos;
      highestAttendance = getHigherAttendance();
      lowestAttendance = getLowerAttendance();
      highestCapacityEvent = getHighestCapacityEvent();

      insertEventIntoTable(highestAttendance, "eventsStatistics");
      insertEventIntoTable(lowestAttendance, "eventsStatistics");
      insertEventIntoTable(highestCapacityEvent, "eventsStatistics");
      calculateAndDisplayStatistics(data);
      calculateAndDisplayPastStatistics(data);
      // console.log(
      //   `Highest percentage of attendance: ${
      //     highestAttendance.event.name
      //   } | ${highestAttendance.percentage.toFixed(2)}%`
      // );
      // console.log(
      //   `Lowest percentage of attendance: ${
      //     lowestAttendance.event.name
      //   } | ${lowestAttendance.percentage.toFixed(2)}%`
      // );
      // console.log(`Highest capacity: ${highestCapacityEvent.event.name}`);
      hideSpinner();
    })
    .catch(error => {
      console.log(" ////// ERROR ////// " + error);
    });
}

function insertEventIntoTable(event, tableId) {
  const table = document.getElementById(tableId);

  if (event && event.event && event.event.name) {
    const eventCell = document.createElement("td");
    eventCell.classList.add("text-center", "table-dark");
    eventCell.textContent = event.event.name;

    table.appendChild(eventCell);
  }
}

function createTableContent(event) {}

function getHigherAttendance() {
  data.events.forEach((event, index) => {
    if (
      "assistance" in event &&
      "capacity" in event &&
      typeof event.assistance === "number" &&
      typeof event.capacity === "number"
    ) {
      const assistance = event.assistance;
      const capacity = event.capacity;

      const attendancePercentage = (assistance * 100) / capacity;

      if (
        !highestAttendanceEvent ||
        attendancePercentage > highestAttendanceEvent.percentage
      ) {
        highestAttendanceEvent = {
          event,
          percentage: attendancePercentage,
        };
      }
    }
  });

  return highestAttendanceEvent;
}

function getLowerAttendance() {
  let lowestAttendancePercentage = 100;

  data.events.forEach((event, index) => {
    if (
      "assistance" in event &&
      "capacity" in event &&
      typeof event.assistance === "number" &&
      typeof event.capacity === "number"
    ) {
      const assistance = event.assistance;
      const capacity = event.capacity;

      const attendancePercentage = (assistance * 100) / capacity;

      if (attendancePercentage < lowestAttendancePercentage) {
        lowestAttendancePercentage = attendancePercentage;
        lowestAttendanceEvent = {
          event,
          percentage: attendancePercentage,
        };
      }
    }
  });

  return lowestAttendanceEvent;
}

function getHighestCapacityEvent() {
  data.events.forEach(event => {
    if ("capacity" in event && typeof event.capacity === "number") {
      const capacity = event.capacity;

      if (!highestCapacityEvent || capacity > highestCapacityEvent.capacity) {
        highestCapacityEvent = {
          event,
          capacity: capacity,
        };
      }
    }
  });

  return highestCapacityEvent;
}
function filterFutureEvents(data) {
  const currentDate = new Date(data.currentDate);
  return data.events.filter(event => new Date(event.date) > currentDate);
}

function groupEventsByCategory(events) {
  const eventsByCategory = {};
  events.forEach(event => {
    if (!eventsByCategory[event.category]) {
      eventsByCategory[event.category] = [];
    }
    eventsByCategory[event.category].push(event);
  });
  return eventsByCategory;
}

function calculateTotalRevenue(events) {
  return events.reduce((totalRevenue, event) => {
    const attendance = event.assistance || event.estimate || 0;
    const price = event.price || 0;
    return totalRevenue + attendance * price;
  }, 0);
}

function calculateAverageAttendancePercentage(events) {
  const totalAttendancePercentage = events.reduce((totalPercentage, event) => {
    const attendance = event.assistance || event.estimate || 0;
    const capacity = event.capacity || 1;
    return totalPercentage + (attendance / capacity) * 100;
  }, 0);
  return totalAttendancePercentage / events.length;
}

function sortCategoriesByAttendance(categories) {
  return categories.sort(
    (a, b) => b.averageAttendancePercentage - a.averageAttendancePercentage
  );
}

function populateTable(categoryStats, tableId) {
  const eventsStatisticsTable = document.getElementById(tableId);
  categoryStats.forEach(categoryStat => {
    const row = document.createElement("tr");
    const categoryCell = document.createElement("td");
    const revenueCell = document.createElement("td");
    const attendancePercentageCell = document.createElement("td");

    categoryCell.textContent = categoryStat.category;
    revenueNumber = Number(categoryStat.totalRevenue);

    revenueCell.textContent = `$${revenueNumber.toLocaleString()}`;
    attendancePercentageCell.textContent =
      categoryStat.averageAttendancePercentage.toFixed(2) + "%";

    categoryCell.classList.add("text-center");
    revenueCell.classList.add("text-center");
    attendancePercentageCell.classList.add("text-center");

    row.appendChild(categoryCell);
    row.appendChild(revenueCell);
    row.appendChild(attendancePercentageCell);

    eventsStatisticsTable.appendChild(row);
  });
}

function calculateAndDisplayStatistics(data) {
  const futureEvents = filterFutureEvents(data);
  const eventsByCategory = groupEventsByCategory(futureEvents);

  const categoryStats = [];
  for (const category in eventsByCategory) {
    const events = eventsByCategory[category];
    const totalRevenue = calculateTotalRevenue(events);
    const averageAttendancePercentage =
      calculateAverageAttendancePercentage(events);
    categoryStats.push({
      category,
      totalRevenue,
      averageAttendancePercentage,
    });
  }

  const sortedCategories = sortCategoriesByAttendance(categoryStats);
  populateTable(sortedCategories, "upcomingEventsStatistics");
}

function filterPastEvents(data) {
  const currentDate = new Date(data.currentDate);
  return data.events.filter(event => new Date(event.date) < currentDate);
}

function calculateAndDisplayPastStatistics(data) {
  const pastEvents = filterPastEvents(data);
  const pastEventsByCategory = groupEventsByCategory(pastEvents);

  const pastCategoryStats = [];
  for (const category in pastEventsByCategory) {
    const events = pastEventsByCategory[category];
    const totalRevenue = calculateTotalRevenue(events);
    const averageAttendancePercentage =
      calculateAverageAttendancePercentage(events);
    pastCategoryStats.push({
      category,
      totalRevenue,
      averageAttendancePercentage,
    });
  }

  const sortedPastCategories = sortCategoriesByAttendance(pastCategoryStats);
  populateTable(sortedPastCategories, "pastEventsStatistics");
}

function showSpinner() {
  const loadingSpinner = document.getElementById("loading-spinner");
  const loadingSpinner2 = document.getElementById("loading-spinner2");
  const loadingSpinner3 = document.getElementById("loading-spinner3");
  loadingSpinner.style.display = "block";
  loadingSpinner2.style.display = "block";
  loadingSpinner3.style.display = "block";
}

function hideSpinner() {
  const loadingSpinner = document.getElementById("loading-spinner");
  const loadingSpinner2 = document.getElementById("loading-spinner2");
  const loadingSpinner3 = document.getElementById("loading-spinner3");
  loadingSpinner.style.display = "none";
  loadingSpinner2.style.display = "none";
  loadingSpinner3.style.display = "none";
}
