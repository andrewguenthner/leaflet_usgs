

function energyFunctionRichter(mag) {
  // Returns the energy associated with a given magnitude of an earthquake
  // relative to magnitude 1
  return (31.6 ** mag)
}

function calculateRadius(mag) {
  // To give the maps the ability to explore smaller earthquakes more 
  // easily at a smaller scale, the radius will be zoom dependent
  const minRadius = 3
  const maxRadius = 40
  const markerRadius = 0.02 * energyFunctionRichter(mag) ** 0.5
  const radiusToUse = Math.min(Math.max(minRadius,markerRadius),maxRadius);
  return radiusToUse
}

function assignEventColor(mag) {
  // Assign single-hue orange color with 6 brightness levels
  // and gray default (darker for larger mag) -- from ColorBrewer
  switch(true) {
    case (mag < 1) :
      return "#ddd"
      break;
    case (mag < 2) :
      return "#feedde"
      break;
    case (mag < 3) :
      return "#fdd0a2"
      break;
    case (mag < 4) :
      return "#fdae6b"
      break;
    case (mag < 5) :
      return "#fd8d3c"
      break;
    case (mag < 6) :
      return "#e6550d"
      break;
    case (mag < 11) :
      return "#a63603"
    default :
      return "#777"
  }
}

function makeMarkers(point, latlng) {
  return L.circleMarker(latlng, {
    // make the area of the cirlce proportional to the energy released
    // this means the relative radius of the circle has a rough relationship
    // to the radius at which earthquake effects are felt -- clipped to 5-200px radius
    radius: calculateRadius(point.properties.mag,4),
    fillColor: assignEventColor(point.properties.mag),
    fillOpacity: 0.8,
    color: "black",
    weight: 1
  }).bindPopup(`<em>${point.properties.place}</em><br>
  ${ new Date(point.properties.time).toUTCString()}<br>
  Magnitude: ${point.properties.mag}`)
}

var quakeMap = L.map("map", {
  center: [39, -90],
  zoom: 4
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.emerald",
  accessToken: API_KEY
}).addTo(quakeMap);

var USGSLink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson";

d3.json(USGSLink).then( function (data) { 

const geoLayer = L.geoJSON(data, {
    pointToLayer : makeMarkers,
    }).addTo(quakeMap);

  // Because of the color scheme, the legend labels are fixed
  const legendLabels = [0, 1, 2, 3, 4, 5, 6];
  const legendColorItems = legendLabels.map(label => assignEventColor(label));

  const legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    const div = L.DomUtil.create("div", "info legend");
    const labels = [];

    // Add min & max
    const legendInfo = "<h4>Magnitude</h4>" +
      "<div class=\"labels\">" +
      "</div>";

    div.innerHTML = legendInfo;

    legendColorItems.forEach(function(colorName, index) {
      labels.push("<li style=\"background-color: " + colorName + "\">" + legendLabels[index] + "-" + parseInt(legendLabels[index] + (index > 5 ? 5: 1)) +"</li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding legend to the map
  legend.addTo(quakeMap);

});
