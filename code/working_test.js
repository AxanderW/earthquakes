var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    
    zoom: 5
    });
    var light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
    }).addTo(myMap);

function getColor(d) {
    return d > 5 ? '#ff471a' :
            d > 4  ? '#ff8000' :
            d > 3  ? '#ffa64d' :
            d > 2  ? '#ffe066' :
            d > 1   ? '#ddff99':
            "#00e600";
}

// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
// Perform a GET request to the query URL
d3.json(queryUrl,function(response){
    // Loop through data
    var responseData = response.features;
    console.log(responseData);
    responseLength = responseData.length;
    console.log(responseLength);
    for (var i=0; i<responseLength; i++){
      // Set the data location property to a variable
   
      var location = responseData[i].geometry.coordinates;
      var coordinates = [location[1],location[0]];
      console.log(coordinates);
      var radius = responseData[i].properties.mag;
      var place = responseData[i].properties.place;
      console.log(radius);
      // Check for location property
      if (responseData) {
        // Add circles to map
    L.circle(coordinates, {
      fillOpacity: 0.75,
      color: "black",
      stroke: true,
   
      weight: .5,
      fillColor: getColor(radius),
      // Adjust radius
      radius:radius * 30000
    }).bindPopup("<h1>" + place + "</h1> <hr> <h3>magnitudes: " + radius + "</h3>").addTo(myMap);
    var legend = L.control({position: 'bottomright'});
      }
   
    }
   });

