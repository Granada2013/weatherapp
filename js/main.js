"use strict"

import units from './units';
import iconsLib from './weather_icons';

const myApi = '55ffb9f0ed7451bf73feeb670fa45c0f';

fetch('current.city.list.json')
  .then(data => data.json())
  .then(cities => {
    const form = document.querySelector('.form'),
          output = document.querySelector('.output'),
          dropdown = document.querySelector('.dropdown');

    //Dislpay latest search weather info
    if (localStorage['city'] !== undefined) {
      getData({city: localStorage.city,
              country: localStorage.country,
              apiKey: myApi,
              unitsSys: 'metric'})
    };

    //Show dropdown menu upon form submission
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (dropdown.dataset.open) return;
      const cityName = form.city.value;
      makeDropdownMenu({dropdownSelector: '.dropdown',
                        parentFormElement: form,
                        city: cityName,
                        citiesLib: cities});
    });

    //Pick dropdown menu item and show relevant weather card
    dropdown.addEventListener('click', e => {
      getData({city: e.target.dataset.city,
              country: e.target.dataset.country,
              apiKey: myApi,
              unitsSys: 'metric'});
      closeDropdownMenu('.dropdown');
      form.reset();
    });

    //Close dropdown menu upon changing form input
    form.addEventListener('input', () => {
      if (dropdown.dataset.open == 'true') closeDropdownMenu('.dropdown');
      if (!output.classList.contains('error')) return;
      output.innerHTML = '';
      output.classList.remove('error');
    });

    //Close dropdown meun by clicking 'Esc'
    document.addEventListener('keydown', event => {
      if (event.code == 'Escape' && dropdown.dataset.open == 'true') {
        closeDropdownMenu('.dropdown');
        form.reset();
      };
    })
  })
  .catch((err) => {
    showErrorInfo({containerSelector: '.output',
                  errorMsg: 'The site is currently unavaliable. Please try again later.'})
  })


//FUNCTIONS
//Construct and show dropdown city name menu
function makeDropdownMenu({dropdownSelector,
                          parentFormElement,
                          city, citiesLib}) {
  const dropdown = document.querySelector(dropdownSelector),
        reg = new RegExp('\\b' + city + '\\b', 'i');

  dropdown.dataset.open = true;
  dropdown.style.overflowY = 'hidden';

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
    showErrorInfo({containerSelector: '.output',
                   errorMsg: 'City not found'});
    closeDropdownMenu(dropdownSelector);
    parentFormElement.reset();
    return;
  };

  if (dropdown.children.length > 5) {
    dropdown.style.overflowY = 'scroll';
  };
};


//Close dropdown menu
function closeDropdownMenu(dropdownSelector) {
  const dropdown = document.querySelector(dropdownSelector);
  dropdown.innerHTML = '';
  delete dropdown.dataset['open'];
}

//Get current weather data from Openweathermap
function getData({city, country, apiKey, unitsSys}) {
  const url = 'https://api.openweathermap.org/data/2.5/weather?';
  fetch(url + `q=${city},${country}&units=${units[unitsSys]}&appid=${apiKey}`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        makeWeatherCard({containerSelector: '.output',
                         dataObj: data});
      })
      .catch((error) => {
        console.log(error);
        showErrorInfo({containerSelector: '.output',
                       errorMsg: 'Oops! Something went wrong :('});
      });
}


//Construct and display weather card using data object fetched from Openweathermap
function makeWeatherCard({containerSelector, dataObj}) {
  const container =  document.querySelector(containerSelector),
        {cod, message, name, main,
         sys: {country}, timezone,
         weather: [{description, icon}]} = dataObj;

  container.innerHTML = '';
  container.classList.remove('error');

  if (cod != '200') {
    const errorMsg = `${cod}: ${capitalize(message)}`;
    showErrorInfo({containerSelector, errorMsg});
    return;
  };

  localStorage.setItem('city', name);
  localStorage.setItem('country', country);
  const weatherCard = document.createElement('div'),
        cardMain =  document.createElement('div'),
        cardBack = document.createElement('div');

  weatherCard.classList.add('card');
  cardMain.classList.add('card__main');
  cardBack.classList.add('card__back');
  weatherCard.append(cardBack, cardMain);
  makeCardContent();
  container.append(weatherCard);

  //Parse Openweathermap data object and construct weathercard content
  function makeCardContent() {
    const header = document.createElement('div'),
          time = document.createElement('div'),
          temp = document.createElement('div'),
          descr = document.createElement('p');

    header.classList.add('card__header');
    header.innerHTML = `
      ${name}<sup>${country}</sup>
    `;

    time.classList.add('card__time');
    time.textContent = showLocalTime(timezone);

    temp.classList.add('card__temp');
    temp.innerHTML = `
      <div>${Math.ceil(main.temp)}<sup>°C</sup></div>
      <i class="wi ${iconsLib[icon]}"></i>
      <p>Feels like ${Math.ceil(main.feels_like)}°C</p>
    `;

    descr.classList.add('card__descr');
    descr.textContent = `${description}`;

    cardMain.append(header, time, temp, descr);
  }
}

// Construct and display error message
function showErrorInfo({containerSelector, errorMsg}) {
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

//Format number from <n> to <0n> if n is less then 10
function addZero(num) {
  if (num <= 9) return `0${num}`;
  return num;
}

//Format string by capitalizing its first letter
function capitalize(str) {
  return `${str.slice(0, 1).toUpperCase()}${str.slice(1).toLowerCase()}`;
}
