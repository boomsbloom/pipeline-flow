pfileColor = "lightyellow"
qualControlColor = "MediumTurquoise"
preprocessingColor = "palevioletred"

// function loadJSON(file) {
//
//     var xmlhttp = new XMLHttpRequest()
//     xmlhttp.onreadystatechange = function () {
//           if (xmlhttp.readyState == 4 && xmlhttp.status == "200") {
//             makeTree(xmlhttp.responseText)
//           }
//     }
//     xmlhttp.open('GET', file, true)
//     xmlhttp.send()
//  }
//
//  loadJSON("structures/initialStepsFunctional.json")

var treeData = [
{
  "name": "pconvert",
  "scripts": "script: pconvert \nconfig: pconvert_config.m.template",
  "link": "https://sites.google.com/a/smp.stanford.edu/scsnlwiki/data/fmri-data-processing/transforming-p-files-to-analyze-images--makevols",
  "color": "lightyellow",
  "children": [
    {
      "name": "Nifti",
      "parent": "pconvert",
      "color": "MediumTurquoise",
      "children": [
        {
          "name": "Std Pipeline",
          "parent": "Nifti",
          "color": "MediumTurquoise",
          "children": [
            {
              "name": "swar/swfar",
              "parent": "Std Pipeline",
              "color": "palevioletred",
              "children": [
                {
                  "name": "movement exclusion",
                  "parent": "swar/swfar",
                  "color": "palevioletred",
                  "children": [
                    {
                      "name": "Quality Control",
                      "parent": "movement exclusion",
                      "color": "MediumTurquoise",
                      "children": [
                        {
                          "name": "Task-Based Analysis",
                          "parent": "Std Pipeline",
                          "color": "white"
                        }, {
                          "name": "Resting-State Analysis",
                          "parent": "Std Pipeline",
                          "color": "white"
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "name": "ArtRepair Pipeline",
          "parent": "Nifti",
          "color": "MediumTurquoise",
          "children": [
            {
              "name": "swar/swfar",
              "parent": "Std Pipeline",
              "color": "palevioletred",
              "children": [
                {
                  "name": "movement exclusion",
                  "parent": "swar/swfar",
                  "color": "palevioletred",
                  "children": [
                    {
                      "name": "Flipped (swfar)",
                      "parent": "Determine subsequent pipelines",
                      "color": "palevioletred",
                      "children": [
                        {
                          "name": "Volume Repair",
                          "parent": "Flipped (swfar)",
                          "color": "palevioletred",
                        }
                      ]
                    },
                    {
                      "name": "Not flipped (swar)",
                      "parent": "Determine subsequent pipelines",
                      "color": "palevioletred",
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "name": "Analyze",
      "parent": "pconvert",
      "color": "MediumTurquoise",
      "children": [
        {
          "name": "Std Pipeline",
          "parent": "Analyze",
          "color": "MediumTurquoise",
          "children": [
            {
              "name": "swar/swfar",
              "parent": "Std Pipeline",
              "color": "palevioletred",
              "children": [
                {
                  "name": "movement exclusion",
                  "parent": "swar/swfar",
                  "color": "palevioletred"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
]

makeTree(treeData)

function makeTree(tree) {

  //var treeData = JSON.parse(tree)

  var margin = {top: 50, right: 400, bottom: 20, left: 0},
  	width = 1000 - margin.right - margin.left,
  	height = 1500 - margin.top - margin.bottom;

  var i = 0,
  	duration = 750,
  	root;

  var tree = d3.layout.tree()
  	.size([1000, width]);

  var diagonal = d3.svg.diagonal()
  	.projection(function(d) { return [d.x, d.y]; });

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return d.scripts
    })

  var svg = d3.select("body").append("svg")
  	.attr("width", width + margin.right + margin.left)
  	.attr("height", height + margin.top + margin.bottom)
    .append("g")
  	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.call(tip)

  root = treeData[0];
  root.x0 = 1//height / 2;
  root.y0 = 0 ;

  update(root);

  d3.select(self.frameElement).style("height", "500px");

  function update(source) {

    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse(),
  	  links = tree.links(nodes);

    // Normalize for fixed-depth.
    nodes.forEach(function(d) { d.y = d.depth * 180; });

    // Update the nodes…
    var node = svg.selectAll("g.node")
  	  .data(nodes, function(d) { return d.id || (d.id = ++i); });

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("g")
  	  .attr("class", "node")
  	  .attr("transform", function(d) { return "translate(" + source.x0 + "," + source.y0 + ")"; })

    nodeEnter.append("circle")
  	  .attr("r", 1e-6)
  	  .style("fill", function(d) { return d._children ? "lightsteelMediumTurquoise " : "#fff"; })
      .on("click", click)
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide)
      .style("stroke", function(d) {
        return d.color});

    nodeEnter.append("text")
  	  //.attr("x", function(d) { return -13 })
  	  //.attr("dy", ".35em")
  	  .attr("text-anchor", function(d) { return "middle"; })
  	  .text(function(d) { return d.name; })
  	  .style("fill-opacity", 1e-6)
      .attr("font-family", "arial")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .attr("class", "hyper").on("click", function(d) {
        window.open(d.link)
      });

    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
  	  .duration(duration)
  	  .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    nodeUpdate.select("circle")
  	  .attr("r", 40)
  	  .style("fill", function(d) { return d._children ? d.color : "#fff"; });


    nodeUpdate.select("text")
  	  .style("fill-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
  	  .duration(duration)
  	  .attr("transform", function(d) { return "translate(" + source.x + "," + source.y + ")"; })
  	  .remove();

    nodeExit.select("circle")
  	  .attr("r", 1e-6);

    nodeExit.select("text")
  	  .style("fill-opacity", 1e-6);

    // Update the links…
    var link = svg.selectAll("path.link")
  	  .data(links, function(d) { return d.target.id; });

    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
  	  .attr("class", "link")
      .style("stroke", function(d) {
        return d.target.color})
  	  .attr("d", function(d) {
  		var o = {x: source.x0, y: source.y0};
  		return diagonal({source: o, target: o});
  	  })


    // Transition links to their new position.
    link.transition()
  	  .duration(duration)
  	  .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
  	  .duration(duration)
  	  .attr("d", function(d) {
  		var o = {x: source.x, y: source.y};
  		return diagonal({source: o, target: o});
  	  })
  	  .remove();

    // Stash the old positions for transition.
    nodes.forEach(function(d) {
  	d.x0 = d.x;
  	d.y0 = d.y;
    });
  }

  // Toggle children on click.
  function click(d) {
    if (d.children) {
  	d._children = d.children;
  	d.children = null;
    } else {
  	d.children = d._children;
  	d._children = null;
    }
    update(d);
  }

}
