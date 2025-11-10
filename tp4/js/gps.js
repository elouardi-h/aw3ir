function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    setMapHtml("Geolocation is not supported by this browser.");
  }
}

// Fonction utilitaire : injecter du HTML dans #map
function setMapHtml(html) {
  var mapDiv = document.getElementById("map");
  if (mapDiv) mapDiv.innerHTML = html;
}

// Fonction principale appelée par getCurrentPosition
function showPosition(position) {
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;

  // 1) Tenter de convertir en adresse texte via Nominatim
  var url =
    "https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=" +
    encodeURIComponent(latitude) +
    "&lon=" +
    encodeURIComponent(longitude);

  fetch(url, { headers: { Accept: "application/json" } })
    .then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    })
    .then(function (data) {
      var adresseComplete =
        (data && data.display_name) ||
        (Number(latitude).toFixed(5) + ", " + Number(longitude).toFixed(5));

      var adresseInput = document.querySelector("#adresse");
      if (adresseInput) {
        adresseInput.value = adresseComplete;
        if (typeof calcNbChar === "function") {
          calcNbChar("adresse");
        }
      }
    })
    .catch(function (err) {
      console.error("Reverse geocoding error:", err);
      var adresseInput = document.querySelector("#adresse");
      if (adresseInput) {
        adresseInput.value =
          Number(latitude).toFixed(5) + ", " + Number(longitude).toFixed(5);
        if (typeof calcNbChar === "function") {
          calcNbChar("adresse");
        }
      }
    })
    .finally(function () {
      
      renderMap(latitude, longitude);
    });
}

function renderMap(lat, lon) {
  var zoom = 5;
  var delta = 0.05 / Math.pow(2, zoom - 10);

  var south = lat - delta;
  var north = lat + delta;
  var west = lon - delta;
  var east = lon + delta;

  var bbox =
    encodeURIComponent(west) +
    "%2C" +
    encodeURIComponent(south) +
    "%2C" +
    encodeURIComponent(east) +
    "%2C" +
    encodeURIComponent(north);

  var src =
    "https://www.openstreetmap.org/export/embed.html?bbox=" +
    bbox +
    "&layer=mapnik&marker=" +
    encodeURIComponent(lat) +
    "%2C" +
    encodeURIComponent(lon);

  setMapHtml(
    '<iframe width="100%" height="200" frameborder="0" scrolling="no" src="' +
      src +
      '"></iframe>'
  );
}

// Gestion des erreurs geoloc
function showError(error) {
  var msg;
  switch (error.code) {
    case error.PERMISSION_DENIED:
      msg = "User denied the request for Geolocation.";
      break;
    case error.POSITION_UNAVAILABLE:
      msg = "Location information is unavailable.";
      break;
    case error.TIMEOUT:
      msg = "The request to get user location timed out.";
      break;
    default:
      msg = "An unknown error occurred.";
  }
  setMapHtml(msg);
}
