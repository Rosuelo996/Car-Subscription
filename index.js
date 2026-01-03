const car = document.querySelector(".car");


function driveInCar() {
    car.classList.remove("is-exiting");

    car.classList.remove("is-idle");

    car.classList.add("is-entering");
}

function driveOutCar () {
    car.classList.remove("is-entering");

    car.classList.remove("is-idle");

    car.classList.add("is-exiting");
}

function onCarEnd(event) {
  if (event.animationName === "driveIn") {

  car.classList.remove("is-entering");

  car.classList.add("is-idle");

  car.classList.add("is-blinking");

  setTimeout(() => {
  car.classList.remove("is-blinking")
},3200);
}
}

function openMenu() {
  document.body.classList.add("menu--open");
}

function closeMenu() {
  document.body.classList.remove("menu--open");
}

function onSearch() {
  const searchIcon = document.querySelector(".search__icon");
  const spinner = document.querySelector(".search__spinner");

  searchIcon.classList.add("hidden");
  spinner.classList.remove("hidden");

  setTimeout(() => {
    spinner.classList.add("hidden");
    searchIcon.classList.remove("hidden");
  }, 1200);
}

function onSearchClick() {
  driveOutCar(); 
  onSearch();     
}





  
 



