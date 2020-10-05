"use strict"

import units from './units';
import iconsLib from './icons';

const myApi = '55ffb9f0ed7451bf73feeb670fa45c0f',
      url = 'http://api.openweathermap.org/data/2.5/weather?',
      form = document.querySelector('.form');

if (localStorage['city'] !== undefined) {
  getData(localStorage.city, myApi, 'metric');
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const cityName = form.city.value;
  getData(cityName, myApi, 'metric');
  form.reset();
})




//Functions
function getData(city, apiKey, unitsSys) {
  fetch(url + `q=${city}&units=${units[unitsSys]}&appid=${apiKey}`)
      .then(response => response.json())
      .then(data => {
        makeWeatherTab('.output', data);
      })
      .catch((error) => {showErrorInfo('.output', 'Oops! Something went wrong :(')})
}


function makeWeatherTab(containerSelector, dataObj) {
  const container =  document.querySelector(containerSelector);
  container.innerHTML = '';

  if (dataObj.cod != '200') {
    showErrorInfo(containerSelector, `${dataObj.cod}: ${dataObj.message}`);
    return;
  };

  container.classList.remove('error');
  localStorage.setItem('city', dataObj.name);

  const weatherTab = document.createElement('div'),
        tabMain =  document.createElement('div'),
        tabBack = document.createElement('div');

  weatherTab.classList.add('tab');
  tabMain.classList.add('tab__main');
  tabBack.classList.add('tab__back');
  weatherTab.append(tabBack, tabMain);
  makeTabContent();
  container.append(weatherTab);

  function makeTabContent() {
    const header = document.createElement('div'),
          time = document.createElement('div'),
          temp = document.createElement('div'),
          descr = document.createElement('p');


    header.classList.add('tab__header');
    header.innerHTML = `
      ${dataObj.name}<sup>${dataObj.sys.country}</sup>
    `;

    time.classList.add('tab__time');
    time.textContent = showLocalTime(dataObj.timezone);

    temp.classList.add('tab__temp');
    temp.innerHTML = `
      <div>${Math.ceil(dataObj.main.temp)}<sup>°C</sup></div>
      <i class="wi ${iconsLib[dataObj.weather[0].icon]}"></i>
      <p>Feels like ${Math.ceil(dataObj.main.feels_like)}°C</p>
    `;

    descr.classList.add('tab__descr');
    descr.textContent = `${dataObj.weather[0].description}`;

    tabMain.append(header, time, temp, descr);
  }
}


function showErrorInfo(containerSelector, errorMsg) {
  const container = document.querySelector(containerSelector);
  container.innerHTML = `
    <img src='img/rain1.gif' alt=':('>
    ${errorMsg}`;
  container.classList.add('error');
}



function showLocalTime(offset) {
  const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr',
                       'May', 'Jun', 'Jul', 'Aug',
                       'Sep', 'Oct', 'Nov', 'Dec'];
  const date = new Date(),
        hours = (date.getUTCHours() + offset/3600) % 12 || 12,
        am = ((date.getUTCHours() + offset/3600) < 12) ? 'a.m.':'p.m.';
  return `${shortMonths[date.getUTCMonth()]} ${date.getUTCDate()}, ${hours}:${addZero(date.getMinutes())} ${am}`;
}


function addZero(num) {
  if (num < 9) return `0${num}`;
  return num;
}

function capitalize(str) {
  return `${str.slice(0, 1).toUpperCase()}${str.slice(1)}`;
}
