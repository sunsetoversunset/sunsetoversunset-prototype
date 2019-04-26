var width = d3.select("#streetview-containers").node().getBoundingClientRect().width;

const mult = 148000;

var reels = [
{'id': '#streetview-strip-holder-1966', 'src': '2012m1_ref199_241-north.csv'},
    {'id': '#streetview-strip-holder-1973', 'src': '2012m1_ref32_4a7-north.csv'},
    {'id': '#streetview-strip-holder-1985', 'src': '2012m1_ref67_835-north.csv'},
    {'id': '#streetview-strip-holder-1995', 'src': '2012m1_ref79_8u9-north.csv'},
    {'id': '#streetview-strip-holder-2007', 'src': '2012m2_ref33_oy0-north.csv'}
    ];


reels.forEach( buildStrip );

function buildStrip(r) {

    var svg = d3.select(r.id)
        .append("svg")
        .attr("width", width)
        .attr("height", 260)
        .attr("class", "strip-svg")
        .call(d3.zoom().on("zoom",zoomed).on("end",zoomdraw));

    var g = svg.append("g")
        .attr('class','strip-g');

    d3.csv('../data/' + r.src).then(function(d){ loadItems(d,g); });

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
    
function zoomed() {
    d3.selectAll('.strip-g').attr("transform","translate(" + d3.event.transform.x + ",0)");
}

function zoomdraw() {

    var t = d3.event.transform.x;
    var left = -50 - t;
    var right = width - t;

    d3.selectAll('.strip-g')
        .each(function(g) { loadImages(d3.select(this),left,right); } )    
}

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

