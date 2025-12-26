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






  
 



