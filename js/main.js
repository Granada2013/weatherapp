"use strict"

import units from './units';
import iconsLib from './weather_icons';

fetch('current.city.list.json')
  .then(data => data.json())
  .then(cities => {

    const myApi = '55ffb9f0ed7451bf73feeb670fa45c0f',
          form = document.querySelector('.form');

    if (localStorage['city'] !== undefined) {
      getData(localStorage.city, localStorage.country, myApi, 'metric');
    };

    form.addEventListener('submit', e => {
      e.preventDefault();

      const cityName = form.city.value;
      makeDropdownMenu('.dropdown', form, cityName, cities);
      pickDropdownOption('.dropdown', form);

      e.target.addEventListener('input', () => {
        closeDropdownMenu('.dropdown');

        const output = document.querySelector('.output');
        if (!output.classList.contains('error')) return;
        output.innerHTML = '';
      });

      document.addEventListener('keydown', event => {
        if (event.code != 'Escape') return;
        closeDropdownMenu('.dropdown');
        form.reset();
      })
    });
  })
  .catch((err) => {
    showErrorInfo('.output',
                  'The site is currently unavaliable. Please try again later.')
  })



//FUNCTIONS
//Construct and show dropdown city name menu
function makeDropdownMenu(dropdownSelector, parentFormElement, city, citiesLib) {
  const dropdown = document.querySelector(dropdownSelector),
        reg = new RegExp('\\b' + city + '\\b', 'i');
  if (dropdown.dataset.open != undefined) return;

  dropdown.dataset.open = true;
  dropdown.style.overflowY = 'scroll';

  citiesLib.forEach(record => {
    if (reg.test(record.name)) {
      const item = document.createElement('li');
      item.dataset.city = record.name;
      item.dataset.country = record.country;
      item.textContent = `${record.name}, ${record.country}`
      item.classList.add('dropdown__item');
      dropdown.append(item);
    };
  });

  if (dropdown.children.length == 0) {
    showErrorInfo('.output', 'City not found');
    closeDropdownMenu(dropdownSelector);
    parentFormElement.reset();
    return;
  };

  if (dropdown.children.length <= 5) {
    dropdown.style.overflowY = 'hidden';
  }
}

//Pick city from dropdown menu and fetch relevant data from Openweathermap
function pickDropdownOption(dropdownSelector, parentFormElement) {
  const dropdown = document.querySelector(dropdownSelector);
  dropdown.addEventListener('click', e => {
    getData(e.target.dataset.city,
            e.target.dataset.country, myApi, 'metric');
    closeDropdownMenu(dropdownSelector);
    parentFormElement.reset();
  });
};

//Close dropdown menu
function closeDropdownMenu(dropdownSelector) {
  const dropdown = document.querySelector(dropdownSelector);
  dropdown.innerHTML = '';
  delete dropdown.dataset['open'];
}

//Get current weather data from Openweathermap
function getData(city, country, apiKey, unitsSys) {
  const url = 'https://api.openweathermap.org/data/2.5/weather?';
  fetch(url + `q=${city},${country}&units=${units[unitsSys]}&appid=${apiKey}`)
      .then(response => response.json())
      .then(data => {
        makeWeatherCard('.output', data);
      })
      .catch((error) => {showErrorInfo('.output', 'Oops! Something went wrong :(')})
}

//Construct and display weather card using data object fetched from Openweathermap
function makeWeatherCard(containerSelector, dataObj) {
  const container =  document.querySelector(containerSelector);
  container.innerHTML = '';

  if (dataObj.cod != '200') {
    showErrorInfo(containerSelector, `${dataObj.cod}: ${capitalize(dataObj.message)}`);
    return;
  };

  container.classList.remove('error');
  localStorage.setItem('city', dataObj.name);
  localStorage.setItem('country', dataObj.sys.country);
  const weatherCard = document.createElement('div'),
        cardMain =  document.createElement('div'),
        cardBack = document.createElement('div');

  weatherCard.classList.add('card');
  cardMain.classList.add('card__main');
  cardBack.classList.add('card__back');
  weatherCard.append(cardBack, cardMain);
  makeCardContent();
  container.append(weatherCard);

  //Construct and display weathercard content
  function makeCardContent() {
    const header = document.createElement('div'),
          time = document.createElement('div'),
          temp = document.createElement('div'),
          descr = document.createElement('p');

    header.classList.add('card__header');
    header.innerHTML = `
      ${dataObj.name}<sup>${dataObj.sys.country}</sup>
    `;

    time.classList.add('card__time');
    time.textContent = showLocalTime(dataObj.timezone);

    temp.classList.add('card__temp');
    temp.innerHTML = `
      <div>${Math.ceil(dataObj.main.temp)}<sup>°C</sup></div>
      <i class="wi ${iconsLib[dataObj.weather[0].icon]}"></i>
      <p>Feels like ${Math.ceil(dataObj.main.feels_like)}°C</p>
    `;

    descr.classList.add('card__descr');
    descr.textContent = `${dataObj.weather[0].description}`;

    cardMain.append(header, time, temp, descr);
  }
}

// Construct and display error message
function showErrorInfo(containerSelector, errorMsg) {
  const container = document.querySelector(containerSelector);
  container.innerHTML = `
    <img src='img/rain.gif' alt=':('>
    ${errorMsg}`;
  container.classList.add('error');
}


//Calculate and format local time and date based on time offset
function showLocalTime(offset) {
  const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr',
                       'May', 'Jun', 'Jul', 'Aug',
                       'Sep', 'Oct', 'Nov', 'Dec'];
  const date = new Date(),
        hours = Math.abs(date.getUTCHours() + offset/3600) % 12 || 12,
        am = ((date.getUTCHours() + offset/3600) < 12) ? 'a.m.':'p.m.';

  return `${shortMonths[date.getUTCMonth()]} ${date.getUTCDate()},
          ${hours}:${addZero(date.getMinutes())} ${am}`;
}

function addZero(num) {
  if (num <= 9) return `0${num}`;
  return num;
}

function capitalize(str) {
  return `${str.slice(0, 1).toUpperCase()}${str.slice(1).toLowerCase()}`;
}
