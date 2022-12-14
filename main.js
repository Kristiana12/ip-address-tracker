const searchBtn = document.querySelector('.search-btn');
const form = document.getElementById('search-ip');
const errorMsgEL = document.querySelector('.error-message');
let map;

//Show user on leaflet
const showUserLocation = (lat, lng) => {
  //remove previous map if it exists
  if (map) {
    map.remove();
  }
  //Show user location on Map
  map = L.map('map').setView([lat, lng], 14);

  //Google maps
  const googleStreet = L.tileLayer(
    'http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}',
    {
      minZoom: 14,
      maxZoom: 14,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    }
  );

  googleStreet.addTo(map);

  //Leaflet Icon
  const addIcon = () => {
    const customIcon = L.icon({
      iconUrl: 'images/icon-location.svg',
      iconSize: [32, 40], // size of the icon
    });

    L.marker([lat, lng], { icon: customIcon }).addTo(map);
  };

  addIcon();
};

//Display IP address UI
const IpAddressUI = (ip) => {
  const IPAddressEL = document.getElementById('ip');
  IPAddressEL.textContent = ip;
};

//Display City, Country, PostalCode
const displayRegionUI = (city, country, postalCode) => {
  const regionEL = document.getElementById('region');
  regionEL.textContent = `${city}, ${country} ${postalCode}`;
};

//Display Timezone
const displayTimezoneUI = (timezone) => {
  const timezoneEL = document.getElementById('timezone');
  timezoneEL.textContent = `UTC ${timezone}`;
};

//Display ISP
const displayIspUI = (isp) => {
  const ispEL = document.getElementById('isp');
  ispEL.textContent = isp;
};

//Display error message
const displayError = (msg = 'Invalid ip address or domain name') => {
  form.classList.add('error');
  errorMsgEL.textContent = msg;
};

//Remove Error
const removeError = () => {
  form.classList.remove('error');
  errorMsgEL.textContent = '';
};

//Get Location Data
const getData = async (request) => {
  let data;
  try {
    const response = await fetch(request);
    //if request fails
    if (!response.ok) {
      throw new Error(`Something went wrong, could not get location `);
    }
    data = await response.json();
  } catch (err) {
    displayError(err.message);
    //Reject Promise returned from async function
    throw err;
  }

  const location = data.location;
  /* Show on Map location */
  showUserLocation(location.lat, location.lng);
  /* Display IP */
  IpAddressUI(data.ip);
  /* Display City*/
  displayRegionUI(location.city, location.country, location.postalCode);
  /* Display Timezone */
  displayTimezoneUI(location.timezone);
  /* Display ISP */
  displayIspUI(data.isp);
};

getData(
  'https://geo.ipify.org/api/v2/country,city,vpn?apiKey=at_kJ1AeaUq5icvRTFfvJl3qJxdYGZF6'
);

//Modify input to avoid errors when fetching Data
const modifyInput = (input) => {
  const newInputSecure = input.includes('https://www.');
  const newInputSecure2 = input.includes('https://');
  const newInput = input.includes('http://www.');
  const newInput2 = input.includes('http://');
  const normalInput = input.includes('www.');
  const domainLastChar = input[input.length - 1] === '/';

  //First remove '/' if true
  if (domainLastChar) {
    input = input.slice(0, -1);
  }

  //Remove the 'prefixes' to avoid problems when fetching Data
  if (newInputSecure) {
    input = input.replace('https://www.', '');
  } else if (newInputSecure2) {
    input = input.replace('https://', '');
  } else if (normalInput) {
    input = input.replace('www.', '');
  } else if (newInput) {
    input = input.replace('http://www.', '');
  } else if (newInput2) {
    input = input.replace('http://', '');
  }
  return input.trim();
};

const checkInputValidation = (input) => {
  // Regular expression to check if string is a IP address
  const regexIP =
    /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;

  //Check whether a string looks like a valid domain name
  const regexDomain = /\b([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}\b/;

  const modifiedInput = modifyInput(input);

  //Fetch Data depends on the users input (domain or ip address)
  if (regexIP.test(input)) {
    removeError();
    getData(
      `https://geo.ipify.org/api/v2/country,city,vpn?apiKey=at_kJ1AeaUq5icvRTFfvJl3qJxdYGZF6&ipAddress=${modifiedInput}`
    );
  } else if (regexDomain.test(input)) {
    removeError();
    getData(
      `https://geo.ipify.org/api/v2/country,city,vpn?apiKey=at_kJ1AeaUq5icvRTFfvJl3qJxdYGZF6&domain=${modifiedInput}`
    );
  } else {
    displayError();
  }
};

searchBtn.addEventListener('click', function (e) {
  e.preventDefault();
  const userInput = document.querySelector('.search-input').value;

  if (!userInput) {
    displayError('Field can not be left empty');
  }
  if (userInput) {
    checkInputValidation(userInput);
  }
});
