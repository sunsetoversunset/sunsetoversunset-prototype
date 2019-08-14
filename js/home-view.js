
var width = d3.select("#streetview-containers").node().getBoundingClientRect().width;
var scroll = 0;
var moveSpeed = 0.8;
var perspective = 'n';

var streetviewContainers = d3.select('#streetview-containers').selectAll('div')
    .data(reels)
    .enter()
    .append('div')
    .attr('class', 'streetview-year-container')
    .attr('id', function(d) { return 'streetview-year-container-' + d.year; });

streetviewContainers.append('div')
    .attr('class', 'streetview-year-label')
    .text(function(d) { return d.year; });

var stripsContainersN = streetviewContainers.append('div')
    .attr('class', 'photography-strip-container photography-strip-container-n')
    .attr('id', function(d) { return 'photography-strip-container-n-' + d.year; });

var stripsContainersS = streetviewContainers.append('div')
    .attr('class', 'photography-strip-container photography-strip-container-s hidden-strip')
    .attr('id', function(d) { return 'photography-strip-container-s-' + d.year; });

var stripsN = stripsContainersN.append('svg')
    .attr("width", width)
    .attr("height", "250")
    .attr("class", "strip-svg strip-svg-n")
    .attr("id", function(d) { return "strip-svg-n-" + d.year; });

var stripsS = stripsContainersS.append('svg')
    .attr("width", width)
    .attr("height", "250")
    .attr("class", "strip-svg strip-svg-s")
    .attr("id", function(d) { return "strip-svg-s-" + d.year; });

var addresses = d3.select('#address-bar').append('svg')
    .attr("width", width)
    .attr("height", "20");

var addressesN = addresses.append('g')
    .attr('class', 'addresses-text addresses-text-n');
var addressesS = addresses.append('g')
    .attr('class', 'addresses-text addresses-text-s hidden-strip');;

d3.csv('./data/addresses-n.csv').then(function(csv) {
    addressesN.selectAll('text')
        .data(csv)
        .enter()
        .append('text')
        .attr("x", function(d) { return d.index * mult; })
        .attr("y", "15")
        .attr("text-anchor", "middle")
        .text(function(d) { return d.address; });
});

d3.csv('./data/addresses-s.csv').then(function(csv) {
    addressesS.selectAll('text')
        .data(csv)
        .enter()
        .append('text')
        .attr("x", function(d) { return -d.index * mult; })
        .attr("y", "15")
        .attr("text-anchor", "middle")
        .text(function(d) { return d.address; });
});

buildStrips().then(loadImages);

d3.select("#scroll-button-right")
    .on('click', function() { scrollHandle("r"); });

d3.select("#scroll-button-left")
    .on('click', function() { scrollHandle("l"); });

d3.select("#jump-value")
    .on('keyup', function() { if(d3.event.key == "Enter") {scrollHandle("j"); } });

d3.select("#jump-button")
    .on('click', function() { scrollHandle("j"); });

d3.select('body')
    .on('keydown', function() {
        if (d3.event.key == 'ArrowLeft') { scrollHandle("l"); }
        if (d3.event.key == 'ArrowRight') { scrollHandle("r"); }
    });

d3.selectAll("#perspective-control>.control-option")
    .on('click', function() { perspectiveHandle(d3.select(this).attr('data-value')) });


d3.selectAll("#speed-control>.control-option")
    .on('click', function() {
        var t = d3.select(this);
        moveSpeed = t.attr('data-value');
        d3.selectAll("#speed-control>.control-option").classed('control-option-selected', false);
        t.classed('control-option-selected', true);
    });

d3.select("#years-control").selectAll("div.control-option")
    .data(reels)
    .enter()
    .append("div")
    .attr("class", "control-option control-option-selected")
    .html(function(d) { return '<i class="fas fa-toggle-on"></i> ' + d.year; })
    .on('click', function(d) {
        thisButton = d3.select(this)
        selectedStrip = d3.select('#streetview-year-container-' + d.year);
        if (thisButton.classed('control-option-selected')) {
            selectedStrip.classed('hidden-year', true);
            thisButton.classed('control-option-selected', false);
            thisButton.select('i').classed('fa-toggle-off', true).classed('fa-toggle-on', false);

        } else {
            selectedStrip.classed('hidden-year', false);
            thisButton.classed('control-option-selected', true);
            thisButton.select('i').classed('fa-toggle-off', false).classed('fa-toggle-on', true);
        }
    });



function buildStrips() {

    return new Promise(function(resolve, error) {
        var promises = [];

        stripsN.each(function(d) {
            var stripSvg = d3.select(this);
            promises.push(d3.csv('./data/' + d.src + '-n.csv').then(function(csv) { createWireframes(csv, stripSvg, 'n', 1); }));
        });

        stripsS.each(function(d) {
            var stripSvg = d3.select(this);
            promises.push(d3.csv('./data/' + d.src + '-s.csv').then(function(csv) { createWireframes(csv, stripSvg, 's', -1); }));
        });

        Promise.all(promises).then(function() { resolve(); });

    });
}

function createWireframes(csv, stripSvg, classer, flipper) {

    var g = stripSvg.append('g')
        .attr("class", function() { return "strip-g strip-g-" + classer; });

    var rect = g.selectAll("rect")
        .data(csv)
        .enter()
        .append("rect")
        .attr("x", function(d) { return (flipper * (mult * parseFloat(d.index))) - 184; })
        .attr("y", "0")
        .attr("width", "380")
        .attr("height", "250")
        .attr("class", function() { return "image-frame image-frame-" + classer; });
}


function loadImages() {

    if (perspective == 'n') {
        var m = 1;
        var left = scroll - 200;
        var right = scroll + width + 200;
    } else {
        var m = -1;
        var right = scroll + 200;
        var left = scroll - width - 200;
    }

    d3.selectAll('.image-frame-' + perspective)
        .each(function(d) {
            var x = d3.select(this).attr("x")
            if (m * x >= left && m * x <= right) {
                if (d.ld != true) {
                    var g = d3.select(this.parentNode);
                    var f = "http://media.getty.edu/iiif/research/archives/" + d["filename"];
                    g.append("svg:image")
                        .attr("x", x)
                        .attr("y", "0")
                        .attr("width", "380")
                        .attr("height", "250")
                        .attr("xlink:href", f + "/full/,250/0/default.jpg")
                        .attr("class", "single-image")
                        .on("click", function(d) { window.open(f + "/full/,900/0/default.jpg") });
                    d.ld = true;
                }
            };
        });
}

function perspectiveHandle(p) {

    if (perspective != p) {
        perspective = p;
        d3.selectAll('.photography-strip-container').classed('hidden-strip', true);
        d3.selectAll('.photography-strip-container-' + p).classed('hidden-strip', false);

        loadImages();

        d3.selectAll('.direction-text').text(function() { return d3.select(this).text() == 'West' ? "East" : "West" });
        d3.selectAll('#perspective-control>.control-option').classed('control-option-selected', false);
        d3.select('#perspective-control-' + p).classed('control-option-selected', true);

        d3.selectAll('.addresses-text').classed('hidden-strip', true);
        d3.select('.addresses-text-' + p).classed('hidden-strip', false);
    }

}


function scrollHandle(direction) {

    var dist;

    if (direction == 'j') {
        var jumpToAdd = Number(d3.select("#jump-value").property('value'));
        dist = mult * d3.scaleLinear([9200, 4530], [0, 1]).clamp(true)(jumpToAdd);

        var jumpToSide;

        (jumpToAdd % 2 == 0) ? jumpToSide = 's': jumpToSide = 'n';

        if (jumpToSide != perspective) {
            perspectiveHandle(jumpToSide);
        }

    } else {
        (direction == 'r' && perspective == 'n') || (direction == 'l' && perspective == 's') ? dist = scroll + (moveSpeed * width): dist = scroll - (moveSpeed * width);
    }

    scroll = dist;

    d3.selectAll('.strip-g-n')
        .transition()
        .attr("transform", "translate(" + -dist + ",0)");

    d3.selectAll('.strip-g-s')
        .transition()
        .attr("transform", "translate(" + dist + ",0)");

    addressesN.transition()
        .attr("transform", "translate(" + -dist + ",0)");

    addressesS.transition()
        .attr("transform", "translate(" + dist + ",0)");

    loadImages();

}