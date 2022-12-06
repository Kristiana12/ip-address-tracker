const map = L.map('map').setView([51.505, -0.09], 16);

L.tileLayer('http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}', {
  minZoom: 15,
  maxZoom: 15,
  subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
}).addTo(map);

const addIcon = () => {
  var greenIcon = L.icon({
    iconUrl: 'images/icon-location.svg',

    iconSize: [40, 40], // size of the icon
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
  });

  L.marker([51.5, -0.09], { icon: greenIcon }).addTo(map);
};

addIcon();
