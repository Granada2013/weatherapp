!function(e){var t={};function n(r){if(t[r])return t[r].exports;var i=t[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(r,i,function(t){return e[t]}.bind(null,i));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";n.r(t);var r={metric:"metric",imperial:"imperial"};var i={"01d":"wi-day-sunny","02d":"wi-day-cloudy","03d":"wi-cloud","04d":"wi-cloudy","09d":"wi-showers","10d":"wi-day-rain","11d":"wi-thunderstorm","13d":"wi-snow","50d":"wi-fog","01n":"wi-night-clear","02n":"wi-night-alt-cloudy","03n":"wi-cloud","04n":"wi-cloudy","09n":"wi-showers","10n":"wi-night-alt-hail","11n":"wi-thunderstorm","13n":"wi-snow","50n":"wi-fog"};const o="55ffb9f0ed7451bf73feeb670fa45c0f",a=document.querySelector(".form");function c(e,t,n){fetch(`https://api.openweathermap.org/data/2.5/weather?q=${e}&units=${r[n]}&appid=${t}`).then(e=>e.json()).then(e=>{!function(e,t){const n=document.querySelector(e);if(n.innerHTML="","200"!=t.cod)return void d(e,`${t.cod}: ${r=t.message,`${r.slice(0,1).toUpperCase()}${r.slice(1).toLowerCase()}`}`);var r;n.classList.remove("error"),localStorage.setItem("city",t.name);const o=document.createElement("div"),a=document.createElement("div"),c=document.createElement("div");o.classList.add("tab"),a.classList.add("tab__main"),c.classList.add("tab__back"),o.append(c,a),function(){const e=document.createElement("div"),n=document.createElement("div"),r=document.createElement("div"),o=document.createElement("p");e.classList.add("tab__header"),e.innerHTML=`\n      ${t.name}<sup>${t.sys.country}</sup>\n    `,n.classList.add("tab__time"),n.textContent=function(e){const t=new Date,n=(t.getUTCHours()+e/3600)%12||12,r=t.getUTCHours()+e/3600<12?"a.m.":"p.m.";return`${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][t.getUTCMonth()]} ${t.getUTCDate()}, ${n}:${i=t.getMinutes(),i<=9?"0"+i:i} ${r}`;var i}(t.timezone),r.classList.add("tab__temp"),r.innerHTML=`\n      <div>${Math.ceil(t.main.temp)}<sup>°C</sup></div>\n      <i class="wi ${i[t.weather[0].icon]}"></i>\n      <p>Feels like ${Math.ceil(t.main.feels_like)}°C</p>\n    `,o.classList.add("tab__descr"),o.textContent=""+t.weather[0].description,a.append(e,n,r,o)}(),n.append(o)}(".output",e)}).catch(e=>{d(".output","Oops! Something went wrong :(")})}function d(e,t){const n=document.querySelector(e);n.innerHTML="\n    <img src='img/rain.gif' alt=':('>\n    "+t,n.classList.add("error")}void 0!==localStorage.city&&c(localStorage.city,o,"metric"),a.addEventListener("submit",e=>{e.preventDefault();c(a.city.value,o,"metric"),a.reset()})}]);
//# sourceMappingURL=script.js.map