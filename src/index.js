// Import funkcji fetch oraz bibliotek
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

// Stałe
const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('#country-list');
const countryInfo = document.querySelector('#country-info');
const container = document.querySelector('.container'); // Container

// czyszczenie container
function clearContainer() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

// create flagi
function createFlagElement(country) {
  const flag = document.createElement('img');
  flag.src = country.flags.svg;
  flag.alt = `${country.name.common} flag`;
  flag.classList.add('country-flag');
  return flag;
}

// create nazwy kraju
function createNameElement(country) {
  const name = document.createElement('h1'); 
  name.classList.add('country-name');
  name.textContent = country.name.common;
  return name;
}

// create karta
function createCountryCard(country) {
  const card = document.createElement('div');
  card.classList.add('country-info-card');

  // flaga
  card.appendChild(createFlagElement(country));

  // kraj
  card.appendChild(createNameElement(country));

  // ditejls
  const details = document.createElement('ul');
  details.classList.add('country-details');

  // stolicy
  const capital = document.createElement('li');
  capital.innerHTML = `<span>Capital: </span>${country.capital}`;
  details.appendChild(capital);

  // populejszyn
  const population = document.createElement('li');
  population.innerHTML = `<span>Population: <span>${country.population}`;
  details.appendChild(population);

  // języki
  const languages = document.createElement('li');
  languages.innerHTML = `<span>Languages: </span>${Object.values(country.languages).join(', ')}`;
  details.appendChild(languages);

  card.appendChild(details);

  return card;
}

searchBox.addEventListener('input', debounce(async () => {
  const name = searchBox.value.trim();
  if (!name) {
    return;
  }
  try {
    const countries = await fetchCountries(name);
    if (countries.length === 1) {
      clearContainer();
      countryInfo.appendChild(createCountryCard(countries[0]));
    } else if (countries.length > 1) {
      clearContainer();
      countries.forEach(country => {
        const listItem = document.createElement('li');
        listItem.classList.add('country-list-item');
        listItem.appendChild(createFlagElement(country));
        listItem.appendChild(createNameElement(country));
        countryList.appendChild(listItem);
      });
    }
  } catch (error) {
    clearContainer();
    Notiflix.Notify.failure('Oops, there is no country with that name');
  }
}, 300));
