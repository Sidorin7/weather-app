import conditions from "./conditions.js";

const apiKey = "8a058ebf11ef460a99674844230608";

// элементы на странице
const header = document.querySelector(".header");
const form = document.querySelector("#form");
const input = document.querySelector("#inputCity");

function removeCard() {
  const prevCard = document.querySelector(".card");
  if (prevCard) prevCard.remove();
}

function showError(errorMessage) {
  // Отобразить карточку с ошибкой
  const html = `<div class="card">${errorMessage}</div>`;

  header.insertAdjacentHTML("afterend", html);
}

function showCard({ name, country, temp, condition, imgPath }) {
  // разметка для карточки

  const html = `
          <div class="card">
              <h2 class="card-city"><span>${name}</span>${country}</h2>

              <div class="card-weather">
                  <div class="card-value">${temp}<sup>°c</sup></div>
                      <img class="card-img" src="${imgPath}" alt="Weather" />
              </div>
                  <div class="card-description">${condition}</div>
          </div
          `;

  // отображаем карточку на странице

  header.insertAdjacentHTML("afterend", html);
}

async function getWeather(city) {
  // запрос на сервер
  const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

// Cлучаем отправку формы

form.onsubmit = async function (e) {
  e.preventDefault();

  let city = input.value.trim();

  // получаем данне с сервера
  const data = await getWeather(city);

  // проверка на ошибку

  if (data.error) {
    removeCard();

    showError(data.error.message);
  } else {
    removeCard();

    const info = conditions.find(
      (obj) => obj.code === data.current.condition.code
    );

    const filePath = "./img/" + (data.current.is_day ? "day" : "night") + "/";
    const fileName = (data.current.is_day ? info.day : info.night) + ".png";
    const imgPath = filePath + fileName;
    console.log(filePath + fileName);

    const weatherData = {
      name: data.location.name,
      country: data.location.country,
      temp: data.current.temp_c,
      condition: data.current.is_day
        ? info.languages[23]["day_text"]
        : info.languages[23]["night_text"],
      imgPath: imgPath,
    };
    showCard(weatherData);
  }
};
