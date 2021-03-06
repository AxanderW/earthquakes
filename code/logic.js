var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var plateUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

function getColor(d){
    return d > 5 ? '#ff471a' :
    d > 4  ? '#ff8000' :
    d > 3  ? '#ffa64d' :
    d > 2  ? '#ffe066' :
    d > 1   ? '#ddff99':
    "#00e600";
}; //end getColor


// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);

    console.log(data);
  });


function createFeatures(earthquakeData){

    function makeCircles(feature, location){
        var radius = feature.properties.mag;
        
        var markerFeatures = {
            fillOpacity: 0.75,
            color: "black",
            stroke: true,
         
            weight: .5,
            fillColor: getColor(radius),
            radius: radius * 3
        } //end markerFeature
    return L.circleMarker(location,markerFeatures);

    
    };

    function popUp (feature,layer){
        var radius = feature.properties.mag
        var place = feature.properties.place
        layer.bindPopup("<h1>" + place + "</h1> <hr> <h3>magnitudes: " + radius + "</h3>")
    };




    var earthquakes = L.geoJSON(earthquakeData,{
        pointToLayer: makeCircles,
        onEachFeature: popUp
    }); 
    

    createMap(earthquakes);

}; //end createFeatures

function createMap(earthquake){

    var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
        });

    var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
        });

    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY
        });

    var baseMaps = {
        "Satellite Map": satellitemap,
        "Light Map": lightmap,
        "Dark Map": darkmap
      };

    // Create an empty layer group
   var plates = L.layerGroup([]);

   d3.json(plateUrl, function(geoJson){
        L.geoJSON(geoJson.features, {
            style: function (geoJsonFeature) {
                return {
                    weight: 2,
                    color: 'orange'
                }
            },
        }).addTo(plates)

   }); // end de.json(plateUrl)

    var overlayMaps = {
    Earthquakes: earthquake,
    Plates: plates
    };

    var myMap = L.map("map", {
        center: [
          37.09, -95.71
        ],
        zoom: 2,
        layers: [satellitemap,plates, earthquake]
      });

    L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
    }).addTo(myMap);


    // Create legend

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (mymap) {

    var div = L.DomUtil.create('div', 'info legend'),
      magnitudes = [0, 1, 2, 3, 4, 5],
      labels = [];

    div.innerHTML += '<p><u>Magnitude</u></p>'

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < magnitudes.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(magnitudes[i] + 1) + '"></i> ' +
            magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+');
    }

    return div;
    };

    legend.addTo(myMap);

    

}// end createMap

