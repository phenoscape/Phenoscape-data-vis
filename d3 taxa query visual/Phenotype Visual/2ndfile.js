var data = {
  'integumental system': 277,
  'neurocranium': 1653,
  'hindlimb skeleton': 0,
  'jaw region': 0,
  'hyoid arch skeleton': 528,
  'forelimb skeleton': 0,
  'fin skeleton': 313,
  'dermatocranium': 574,
  'pectoral girdle skeleton': 1108,
  'pelvic girdle skeleton': 426,
  'ventral hyoid arch skeleton': 0,
  'post-cranial axial skeletal system': 0
}

//need to replace this with drawGraph(data)!!!!!!
drawGraph(data);

function type(d) {
  d.value = +d.value;
  return d;
}

/**----------------------------**/
//functions that get the data

//Parameter: uberon number
function get_total(uberon, callback) {
  var urlBase = 'http://kb.phenoscape.org/api/taxon/with_phenotype?entity=%3Chttp:%2F%2Fpurl.obolibrary.org%2Fobo%2FUBERON_' + uberon + '%3E&total=true';
  $.getJSON(urlBase, function(json) {
    var count = json.total;
    //console.log('Taxa total: ', count);
    //console.log(typeof(count));
    callback(count);
  });
}

//gets uberon number from UBERON.csv file, only used for base case
function get_uberon(anatomy, callback) {
  //find VTO of taxa
  d3.csv("UBERON.csv", function(data) {
    for (var i = 0; i < data.length; i++) {
      var term = data[i].Term_label;
      if (term == anatomy) {
        var uberon = data[i].UberonNum;
        //console.log(uberon);
        callback(uberon);
      }
      //j=j+1;
    }
    for (var i = 0; i < data.length; i++) {
      var termP = data[i].Parent_term_label;
      if (termP == anatomy) {
        var uberon = data[i].UberonNumParent;
        //console.log(aurl);
        callback(uberon);
      }
    }
  });
  return;
}

//Get uberon number using the url
function getUberon(purlUrl) {

  uberon = purlUrl.substr(purlUrl.length - 7);
  return uberon;
}

//function gets all of the purl urls of the taxa within the rank of a specific super-taxon. 
//parameter uberon: uberon number
function getDescendants(uberon, callback) {
  var descendants = [];
  var descUrl = 'http://kb.phenoscape.org/api/term/all_descendants?iri=http://purl.obolibrary.org/obo/UBERON_' + uberon;
  $.getJSON(descUrl, function(json) {
    for (var i = 0; i < json.results.length; i++) {
      uberon = json.results[i]['@id'];
      descendants.push(uberon)
      console.log('Descendant uberon: ' + uberon);
    }
    callback(descendants);
  });
}

/**function gets children
Parameter: uberon number
returns urls of the children **/
function getChild(uberon, callback) {
  children = [];
  var urlBase = 'http://kb.phenoscape.org/api/term/classification?iri=http://purl.obolibrary.org/obo/UBERON_' + uberon
  $.getJSON(urlBase, function(json) {
    for (var i = 0; i < json.superClassOf.length; i++) {
      var child = json.superClassOf[i]['@id'];
      if (child.length > 5 && child.length<100) {
        children.push(child);
        console.log('Child: ' + child);
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
    if (data[key] > max) {
      max = data[key];
    }
  }
  return max;

}

//function populates names and totals array
//Parameter: descArray is array of descendants
function populateArrays(descArray, callback) {
  var names = [];
  var totals = [];
  for (var i = 0; i < descArray.length; i++) {
    getName(descArray[i], function(name) {
      names[i] = name;
    });
    get_total(getUberon(descArray[i]), function(total) {
      totals[i] = total;
    });
  }
  callback(names, totals);
}

//Parameters: names-array of anatomy names
// totals: array of total counts
function populateData(names, totals) {
  var data = [];
  for (var i = 0; i < names.length; i++) {
    data[names[i]] = totals[i];
  }
  return data;
}

//to update graph every time
function drawGraph(data) {
  //TODO
  var margin = {
      top: 70,
      right: 20,
      bottom: 30,
      left: 60
    },
    width = 960 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1)
    .domain(d3.entries(data).map(function(d) {
      return d.key
    }));

  var y = d3.scale.linear()
    .domain([0, getMax(data)])
    .range([height, 0]);

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
      return d.key + "<br/>" + "Annontated taxa count: " + d.value;
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

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("taxaCount");

  svg.selectAll(".bar")
    .data(d3.entries(data))
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) {
      return x(d.key);
    })
    .attr("width", x.rangeBand())
    .attr("y", function(d) {
      return y(d.value);
    })
    .attr("height", function(d) {
      return height - y(d.value);
    })
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)

  //update to get sub anatomies based on click
  .on('click', function(d, i) {
    //get new data
    //get descendants
    tip.hide()
    d3.selectAll("svg").remove();
    d3.selectAll("tip").remove();
    /**
    get_uberon(d.key, function(uberon){
      getChild(uberon, function(d){
        for (var i in d){
          console.log("Desc: "+i);
          get_total(getUberon(d[i]),function(total){
            getName(d[i],function(name){
              data[name]=total;
              console.log(name+":"+total);
              
            })
          });
        }**/
    //ASK ABOUT PROMISES
    var promise = new Promise(function(resolve, reject) {
      var data = [];
      get_uberon(d.key, function(uberon) {
        getChild(uberon, function(d) {
          for (var i in d) {
            console.log("d!"+d);
            console.log("Desc: " + i);
            get_total(getUberon(d[i]), function(i, total) {
              getName(d[i], function(name) {
                data[name] = total;
                console.log(name + ": " + total);
                console.log("data length: " + data.length);
                console.log("d length: " + d.length);
                if (Object.keys(data).length == d.length) {
                  resolve(data);
                }
              })
            }.bind(null, i));
          }
        })
      });
     setTimeout(resolve.bind(null,data), 2000); 
     //
    });

    promise.then(function(result) {
      console.log(result);
      drawGraph(result);
    }, function(err) {
      console.log("Failed!", err);
    })

  });
  //});
}

/**
//parameter d is the array of child uberon urls
function populate(d,callback){
  for (var desc in d){
    console.log("Desc: "+desc);
    get_total(getUberon(d[desc]),function(total){
      getName(d[desc],function(name){
        data[name]=total;
        console.log(name+":"+total);
        console.log("Data: "+data);
        //drawGraph(data);
      })
    });
  }
  callback(data);
});
}
**/