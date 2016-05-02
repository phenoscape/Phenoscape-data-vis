var data = {
  'integumental system': [277, 'http://purl.obolibrary.org/obo/UBERON_0002416'],
  'neurocranium': [1653, 'http://purl.obolibrary.org/obo/UBERON_0001703'],
  'hindlimb skeleton': [0, 'http://purl.obolibrary.org/obo/UBERON_0001441'],
  'jaw region': [0, 'http://purl.obolibrary.org/obo/UBERON_0011595'],
  'hyoid arch skeleton': [528, 'http://purl.obolibrary.org/obo/UBERON_0005884'],
  'forelimb skeleton': [0, 'http://purl.obolibrary.org/obo/UBERON_0001440'],
  'fin skeleton': [313, 'http://purl.obolibrary.org/obo/UBERON_0012353'],
  'dermatocranium': [574, 'http://purl.obolibrary.org/obo/UBERON_0003113'],
  'pectoral girdle skeleton': [1108, 'http://purl.obolibrary.org/obo/UBERON_0007831'],
  'pelvic girdle skeleton': [426, 'http://purl.obolibrary.org/obo/UBERON_0007832'],
  'ventral hyoid arch skeleton': [284, 'http://purl.obolibrary.org/obo/UBERON_0011153'],
  'post-cranial axial skeletal system': [0, 'http://purl.obolibrary.org/obo/UBERON_0011138']
};
var stack = new Array(); // stores path to be able to go back
var phenoBlue = d3.rgb(66, 139, 202);

var margin = {
    top: 70,
    right: 50,
    bottom: 150,
    left: 30
  },
  width = 960 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

drawGraph(data);

function type(d) {
  d.value = +d.value;
  return d;
}

/**----------------------------**/
//functions that get the data

//@uberon: uberon number
function get_total(uberon, callback) {
  //var urlBase='http://kb.phenoscape.org/api/entity/presence?entity=http:%2F%2Fpurl.obolibrary.org%2Fobo%2FUBERON_'+uberon+'&total=true'; //presence graph
  var urlBase = 'http://kb.phenoscape.org/api/taxon/with_phenotype?entity=%3Chttp:%2F%2Fpurl.obolibrary.org%2Fobo%2FUBERON_' + uberon + '%3E&total=true';
  $.getJSON(urlBase, function(json) {
    var count = json.total;
    callback(count);
  });
}

//@purlURL: uberon url
function getUberon(purlUrl) {

  uberon = purlUrl.substr(purlUrl.length - 7);
  return uberon;
}

/**function gets children
@uberonURL: uberon purl url 
returns urls of the children **/
function getChild(uberonURL, callback) {
  children = [];
  var urlBase = 'http://kb.phenoscape.org/api/term/classification?iri=' + uberonURL
  $.getJSON(urlBase, function(json) {
    for (var i = 0; i < json.superClassOf.length; i++) {
      var child = json.superClassOf[i]['@id'];
      if (child.length > 5 && child.length < 100) {
        children.push(child);
        console.log('Child: ' + child);
      }
    }

    callback(children);
  });
}

/**
Returns array of all of the immediate parts of a specific anatomy 
identified by uberon
**/ 
function getPartOf(uberonURL, callback) {
  var children=[];
  var urlBase = 'http://kb.phenoscape.org/api/term/property_neighbors/object?term=' + uberonURL + '&property=http://purl.obolibrary.org/obo/BFO_0000050'
  $.getJSON(urlBase, function(json) {
    for (var i = 0; i < json.results.length; i++) {
      var child = json.results[i]['@id'];
      if (child.length > 5 && child.length < 100) {
        children.push(child);
        //console.log('Child: ' + child);
      }
    }

    callback(children);
  });
}

//get name of anatomy using the purl URL
function getName(purlURL, callback) {
  var url = 'http://kb.phenoscape.org/api/term?iri=' + purlURL
  $.getJSON(url, function(json) {
    //console.log(json.label);
    callback(json.label);
  });
}

//parameter: data is an associative array
function getMax(data) {
  //TODO
  var max = 0;
  for (var key in data) {
    if (data[key][0] > max) {
      max = data[key][0];
    }
  }
  return max;

}

//to update graph every time
function drawGraph(data) {
  stack.push(data);
  var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1)
    .domain(sortDescending(data).map(function(d) {
      return d.key
    }));

  var y = d3.scale.linear()
    .domain([0, getMax(data)])
    .range([height, 0]);

  console.log("Max: " + getMax(data));
  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return d.key + "<br/>" + "Annotated Taxa Count: " + d3.values(d)[1][0];
    })

  var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.call(tip);

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg.selectAll("text")
    //.call(wrap, x.rangeBand())
    //.attr("y", 10)
    //.attr("x", 50)
    .attr("dx", "-.8em")
    .attr("dy", ".70em")
    .attr("transform", "rotate(45)")
    .style("text-anchor", "start");

  var yLine = svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -50)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Annotated Taxa Count");

  var bars = svg.selectAll(".bar")
    .data(d3.entries(data))
    .enter().append("rect")
    .attr("fill", phenoBlue)
    .attr("class", "bar")
    .attr("x", function(d) {
      return x(d.key);
    })
    .attr("width", x.rangeBand())
    .attr("y", function(d) {
      return y(d3.values(d)[1][0]);
    })
    .attr("height", function(d) {
      return height - y(d3.values(d)[1][0]);
    })
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)

//to go back on graph
  var svg = d3.select('button').on('click', function() {
    //console.log(stack.length);
    if (stack.length == 1) {
      alert("Can't go back anymore");
    } else {
      removeEverything(tip);
      console.log(stack.pop());
      drawGraph(stack.pop());
    }
  });
  //update to get sub anatomies based on click
  bars.on('click', function(d, i) {
    //get new data
    //get immediate parts

    var promise = new Promise(function(resolve, reject) {
      var dataset = [];
      uberonURL = d3.values(d)[1][1];
      getPartOf(uberonURL, function(d) { //get parts
        if (d.length==0){
          alert("No more descending possible");
        }
        for (var i in d) {
          get_total(getUberon(d[i]), function(i, total) {
            getName(d[i], function(name) {
              dataset[name] = [total, d[i]];
              if (Object.keys(dataset).length == d.length) {
                resolve(dataset);
              }
            })
          }.bind(null, i));
        }
      })

      setTimeout(resolve.bind(null, data), 10000);
    });

    promise.then(function(result) {
      console.log(result);
      removeEverything(tip);
      drawGraph(result);
    }, function(err) {
      alert("No more descending possible");
      removeEverything(tip);
      drawGraph(data);
      console.log("Failed!", err);
    })

  });

}

function sortDescending(data) {
  return d3.entries(data).sort(function(a, b) {
    return d3.values(b)[1][0] - d3.values(a)[1][0];
  });
}

function removeEverything(tip) {
  tip.hide()
  d3.select("svg").remove();
  d3.selectAll("tip").remove();
}

function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
      words = text.text().split(/\s+/).reverse(),
      word,
      line = [],
      lineNumber = 0,
      lineHeight = .85, // ems
      y = text.attr("y"),
      dy = parseFloat(text.attr("dy")),
      tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}