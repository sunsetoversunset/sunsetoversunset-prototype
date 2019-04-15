
var map95 = L.map('map-holder-1995', {zoomControl: false}).setView([34.097950, -118.3533],21);

// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(map95);


$.getJSON('./data/79_8u9_snippet.geojson', function(g) {

	var geoLayer = L.geoJSON(g, {
		pointToLayer: function(p,coords) {
			console.log(p);
			icon = L.icon({
				iconUrl: p["properties"]["filename"] + "/full/,250/0/default.jpg"
			})
			return L.marker(coords, {icon: icon});
		}

	}).addTo(map95);
})
