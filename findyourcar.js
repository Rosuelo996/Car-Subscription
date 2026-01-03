const cardListEl = document.querySelector(".card__list");
const searchInputEl = document.querySelector(".header__input");
const emptyStateEl = document.querySelector(".search__empty");
const searchTitleEl = document.querySelector(".search__title");
const searchProgress = document.getElementById("searchProgress");
const searchLoading = document.getElementById("searchLoading");

const minRange = document.getElementById("minRange");
const maxRange = document.getElementById("maxRange");
const priceText = document.getElementById("priceText");

const allowedMakes = [
  "toyota",
  "audi",
  "bmw",
  "mercedes",
  "ford",
  "tesla",
  "volkswagen",
  "honda",
  "hyundai",
];

const MAX_RESULTS = 9;

// STATE

let carsData = [];
let allCarsData = [];

// API

async function getModelsForMake(make) {
  const url = `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/${make}?format=json`;
  const response = await fetch(url);
  const data = await response.json();
  return data.Results;
}

// RANDOM DATA

function randomPrice() {
  const min = 10000;
  const max = 100000;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomMileage() {
  const min = 0;
  const max = 12000;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomBodyType() {
  const types = ["Sedan", "SUV", "Coupe", "Hybrid", "Wagon", "Convertible"];
  return types[Math.floor(Math.random() * types.length)];
}

// IMAGES

function getCarImage(make, modelName) {
  const formattedModel = modelName.replace(/\s+/g, "-");

  return `./assets/cars/${make}/${formattedModel}.jpg`;
}

// MAIN

async function loadAllCars() {
  searchProgress.classList.remove("hidden");
  searchLoading.classList.remove("hidden");
  allCarsData = [];

  for (let i = 0; i < allowedMakes.length; i++) {
    const make = allowedMakes[i];
    const apiModels = await getModelsForMake(make);
    const limitedModels = apiModels.slice(0, MAX_RESULTS);

    const carsForMake = limitedModels.map((apiModel) => {
      return {
        make: apiModel.Make_Name,
        model: apiModel.Model_Name,
        price: randomPrice(),
        mileage: randomMileage(),
        bodyType: randomBodyType(),
        img: getCarImage(make, apiModel.Model_Name),
      };
    });

    allCarsData = allCarsData.concat(carsForMake);
  }

  carsData = allCarsData;
  isDataReady = true;
  filterSortAndRender();

  searchProgress.classList.add("hidden");
  searchLoading.classList.add("hidden");
}

// FILTER + SORT + OUTPUT

function filterSortAndRender() {
  const minPrice = Number(minRange.value);
  const maxPrice = Number(maxRange.value);

  // filter
  const filteredCars = carsData

    .filter((car) => {
      return car.price >= minPrice && car.price <= maxPrice;
    })

    // sort
    .sort((a, b) => b.price - a.price);

  // render + empty state
  cardListEl.innerHTML = filteredCars.map((car) => modelHTML(car)).join("");

  updateUI();
}

// CAR CARD

function modelHTML(car) {
  return `
    <div class="card">
      <div class="card__img--wrapper">
        <img class="card__img" src="${car.img}"
          alt="${car.make} ${car.model}"
          onerror="this.src='./assets/car-sample.jpg'" />
        <div class="card__overlay">
          <span>More info</span>
        </div>
      </div>

      <div class="card__description">
        <h3 class="card__title purple">${car.make} ${car.model}</h3>

        <div class="card__spec">
          <i class="fa-solid fa-car-side card__icon"></i>
          <span>${car.bodyType}</span>
        </div>

        <div class="card__spec">
          <i class="fa-solid fa-gears card__icon"></i>
          <span>Automatic</span>
        </div>

        <div class="card__spec">
          <i class="fa-solid fa-gauge card__icon"></i>
          <span>${car.mileage.toLocaleString()} km</span>
        </div>

        <div class="car-card__price purple">£${car.price.toLocaleString()}</div>
      </div>
    </div>
  `;
}

// SEARCH BUTTON

function searchCars() {
  const rawInput = searchInputEl.value;
  const input = rawInput.trim().toLowerCase();

  // search results
  if (input !== "") {
    searchTitleEl.innerHTML = `Search results for "<span class="purple">${rawInput}</span>"`;
  } else {
    searchTitleEl.innerHTML = "Search results:";
  }

  // show loading
  searchProgress.classList.remove("hidden");
  searchLoading.classList.remove("hidden");
  emptyStateEl.classList.add("hidden");
  cardListEl.innerHTML = "";

  // search input
  setTimeout(() => {
    if (input === "") {
      carsData = allCarsData;
    } else {
      const words = input.split(" ");
      const makeWord = words[0];
      const modelWord = words.slice(1).join(" ");

      carsData = allCarsData.filter((car) => {
        const make = car.make.toLowerCase();
        const model = car.model.toLowerCase();

        const isKnownMake = allowedMakes.includes(makeWord);

        // user typed make + model 
        if (modelWord && isKnownMake) {
          return make.includes(makeWord) && model.includes(modelWord);
        }

        // user typed model words only 
        else if (modelWord) {
          return model.includes(modelWord);
        }

        return make.includes(input) || model.includes(input);
      });
    }

    filterSortAndRender();

    // hide loading
    searchProgress.classList.add("hidden");
    searchLoading.classList.add("hidden");
  }, 1000);
}

// RESET

function resetSearch() {
  searchInputEl.value = "";
  searchTitleEl.innerHTML = "Search results:";
  emptyStateEl.classList.add("hidden");

  // reset sliders
  minRange.value = 0;
  maxRange.value = 100000;
  updatePrice();

  loadAllCars();
}

// SLIDER TEXT + FILTER TRIGGER

function updatePrice() {
  let min = Number(minRange.value);
  let max = Number(maxRange.value);

  if (min > max) {
    minRange.value = max;
    min = Number(minRange.value);
  }

  priceText.textContent = `£${min.toLocaleString()} to £${max.toLocaleString()}`;

  filterSortAndRender();
}

// EMPTY STATE

let isDataReady = false;

function updateUI() {
  if (!isDataReady) return;

  if (carsData.length === 0) {
    emptyStateEl.classList.remove("hidden");
  } else {
    emptyStateEl.classList.add("hidden");
  }
}

// INITIAL LOAD

updatePrice();
loadAllCars();

// MENU

function openMenu() {
  document.body.classList.add("menu--open");
}

function closeMenu() {
  document.body.classList.remove("menu--open");
}
