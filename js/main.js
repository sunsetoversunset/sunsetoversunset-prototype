
var width = d3.select("#streetview-containers").node().getBoundingClientRect().width;
const mult = 148000; 
var scroll = 0;

const reels = [
    {'year': '1966', 'src': '2012m1_ref199_241'},
    {'year': '1973', 'src': '2012m1_ref32_4a7'},
    {'year': '1985', 'src': '2012m1_ref67_835'},
    {'year': '1995', 'src': '2012m1_ref79_8u9'},
    {'year': '2007', 'src': '2012m2_ref33_oy0'}
    ];

var streetviewContainers = d3.select('#streetview-containers').selectAll('div')
    .data(reels)
    .enter()
    .append('div')
    .attr('class','streetview-year-container')
    .attr('id', function(d){ return 'streetview-year-container-' + d.year; });

streetviewContainers.append('div')
    .attr('class','streetview-year-label')
    .text(function(d){ return d.year; });

var stripsContainers = streetviewContainers.append('div')
    .attr('class','photography-strip-container')
    .attr('id', function(d){ return 'photography-strip-container' + d.year; });

var strips = stripsContainers.append('svg')
    .attr("width", width)
    .attr("height", 250)
    .attr("class", "strip-svg")
    .attr("id", function(d) { return "strip-svg-" + d.year; });

strips.each(buildStrip);

var rightButton = d3.select("#scroll-button-right")
    .on('click',function(){ scrollHandle(width*.8,"right"); });

var rightButton = d3.select("#scroll-button-left")
    .on('click',function(){ scrollHandle(width*.8,"left"); });

function buildStrip(d) {
    var strip = d3.select(this);
    d3.csv('./data/' + d.src + '-north.csv').then(function(d) { createWireframes(d,strip); });
}

function createWireframes(d,strip) {
    var g = strip.append('g')
        .attr("class","strip-g");

    var rect = g.selectAll("rect")
        .data(d)
        .enter()
        .append("rect")
        .attr("x", function(d) { return mult * parseFloat(d.index) })
        .attr("y", "0")
        .attr("width", "450")
        .attr("height", "250")
        .attr("class", "image-frame");

    loadImages(g,0,width);
}


function loadItems(d,g) {
    g.selectAll("rect")
        .data(d)
        .enter()
        .append("rect")
        .attr("x", function(d) { return mult * parseFloat(d.index) })
        .attr("y", "0")
        .attr("width", "450")
        .attr("height", "250")
        .attr("class", "image-frame");

    loadImages(g,-10,width);
}
    
// function zoomed() {
//     d3.selectAll('.strip-g').attr("transform","translate(" + d3.event.transform.x + ",0)");
// }

// function zoomdraw() {

//     var t = d3.event.transform.x;
//     var left = -50 - t;
//     var right = width - t;

//     d3.selectAll('.strip-g')
//         .each(function(g) { loadImages(d3.select(this),left,right); } )    
// }

function loadImages(g,left,right) {

    g.selectAll("rect")
        .each( function(d) { 
            var x = d3.select(this).attr("x")
            if(x >= left && x <= right) { 

                if(d.ld != true) {
                    var f = d["filename"] + "/full/,250/0/default.jpg";
                    g.append("svg:image")
                        .attr("x", x)
                        .attr("y", "0")
                        .attr("width", "450")
                        .attr("height", "250")
                        .attr("xlink:href", f)
                        .attr("class","single-image");
                    d.ld = true;
                }
             }; 
        });
}

function scrollHandle(dist,dir) {

    dir=='left' ? dist = scroll + dist : dist = scroll - dist;
    scroll = dist;

    d3.selectAll('.strip-g')
        .transition()
        .attr("transform","translate(" + dist + ",0)")
        .each(function() { loadImages(d3.select(this),-scroll,width-scroll); });


}

