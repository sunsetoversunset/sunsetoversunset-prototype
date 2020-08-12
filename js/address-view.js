
var container = d3.select("#address-streetview-container");

d3.json('./data/address-photos/9021.json').then(generateThumbnails);

function generateThumbnails(d) {

	container.selectAll('.streetview-year-container')
		.data(d.photoYears)
		.enter()
		.append('div')
		.attr('class','streetview-year-container')
		.append('h4')
		.attr('class','streetview-year-container-label')
		.text(function(d){ return d.year; })
	
	container.selectAll('.streetview-year-container')
		.append('div')
		.attr('class','streetview-thumbnails-container')
		.selectAll('.streetview-thumbnail')
		.data(function(d){ return d.photos.sort(function(a,b){ return d3.ascending(a.index,b.index); }); })
		.enter()
		.append('img')
		.attr('class','streetview-thumbnail')
		.attr('src',function(d){ return "https://media.getty.edu/iiif/image/" + d.identifier + "/full/,150/0/default.jpg"});

}