// json url for earthquake data
var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'
// Create a map object
var myMap = L.map('map', {
  center: [37.09, -95.71],
  zoom: 5
});
// Add tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);
// Function to map color based on earthquake magnitude
d3.json(url).then(function(data) {
    function mapStyle(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: mapColor(feature.geometry.coordinates[2]),
            color: '#09090a',
            radius: mapRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        }
    }
    // Function to map color based on earthquake depth
    function mapColor(depth) {
        switch (true) {
            case depth > 90:
                return '#ff0000'; // Red for depth greater than 90
            case depth > 70:
                return '#ff6b21'; // Orange-reddish for depth between 71 and 90
            case depth > 50:
                return '#ff8800'; // Orange for depth between 51 and 70
            case depth > 30:
                return '#ffcc00'; // Yellow-orange for depth between 31 and 50
            case depth > 10:
                return '#eaff00'; // Yellow for depth between 11 and 30
            default:
                return '#91ff00'; // Light green for depth less than or equal to 10
        }
    }
    // Function to map radius based on earthquake magnitude
    function mapRadius(mag) {
        switch (true) {
            case mag < 1:
                return 5; // Set a specific radius for magnitude less than 1
            case mag < 3:
                return 10; // Set a specific radius for magnitude between 1 and 3
            case mag < 5:
                return 20; // Set a specific radius for magnitude between 3 and 5
            case mag < 7:
                return 35; // Set a specific radius for magnitude between 5 and 7
            default:
                return 50; // Set a default radius for any other magnitudes
        }
    }
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng);
    },
        style: mapStyle,
        onEachFeature: function (feature, layer) {
        layer.bindPopup('Magnitude: ' + feature.properties.mag + '<br>Location: ' + feature.properties.place + '<br>Depth: ' + feature.geometry.coordinates[2]);
    }
    }).addTo(myMap);
    // Create a legend for the map
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function() {
    // Adding the legend to the map
    let div = L.DomUtil.create('div', 'info legend');
    let limits = [-10, 10, 30, 50, 70, 90]; // Define depth limits here
    let colors = ['#91ff00', '#eaff00', '#ffcc00', '#ff8800', '#ff6b21', '#ff0000']; // Define corresponding colors
    // Adding the title to the legend
    div.innerHTML = "<h2>Depth (km)</h2>";
    // Adding the legend items with colors and values
    for (var i = 0; i < limits.length; i++) {
      div.innerHTML +=
        '<div><span class="color-box" style="background-color:' + colors[i] + '"></span>' +
        limits[i] + (limits[i + 1] ? '&ndash;' + limits[i + 1] + '<br>' : '+') + '</div>';
    }
  
    return div;
    };
  
  legend.addTo(myMap);
});

