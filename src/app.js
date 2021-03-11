// if the data you are going to import is small, then you can import it using es6 import
// (I like to use use screaming snake case for imported json)
// import MY_DATA from './app/data/example.json'

import {myExampleUtil} from './utils';
import {select} from 'd3-selection';
// this command imports the css file, if you remove it your css wont be applied!
import './main.css';

import mapboxgl from 'mapbox-gl';

var mapbox_css = document.createElement('link');
mapbox_css.href = 'https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css';
mapbox_css.rel = 'stylesheet';
document.head.appendChild(mapbox_css);

var app = document.querySelector('#app');
var title = document.createElement('h1');
title.className = 'title';
title.innerHTML = 'Chicago Census Block Level Dynamic Crime Features Map, ';
app.appendChild(title);

var subtitle = document.createElement('h2');
subtitle.className = 'subtitle';
subtitle.innerHTML =
  'Median Income have a negative correlation with Crime Rate, Unemployment Rate have a positive correlation with Crime Rate';
app.appendChild(subtitle);

var map_container = document.createElement('div');
map_container.className = 'map_container';
document.body.appendChild(map_container);

var source = document.createElement('div');
source.className = 'source';
source.innerHTML = 'Source: Chicago Open Data, ACS Data';
document.body.appendChild(source);

var foot = document.createElement('div');
foot.className = 'foot';
foot.innerHTML = 'Author: Wenjun Shi';
var credit = document.createElement('a');
credit.className = 'credit';
credit.innerHTML = 'Credit to Mapbox';
credit.href = 'https://www.mapbox.com/';
foot.appendChild(credit);
document.body.appendChild(foot);

var map1 = document.createElement('div');
map1.className = 'map1';
map_container.appendChild(map1);

//map part

mapboxgl.accessToken =
  'pk.eyJ1IjoiYWhudyIsImEiOiJja2ZlN3FtdmMwMDF5MzhvNmV2MTR5aGh1In0.0GbDLZhYZuPa0zK6-va2hQ';
var map = new mapboxgl.Map({
  container: map1,
  hash: true,
  style: 'mapbox://styles/mapbox/dark-v10',
  center: [-87.6298, 41.844],
  zoom: 10.5,
  debug: 1,
});
map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.FullscreenControl());

//create elements and vars
var button = document.createElement('div');
button.setAttribute('id', 'button_3d');
button.setAttribute('class', 'mapboxgl-ctrl-group');
button.innerHTML = '3D';
map1.appendChild(button);

var button1 = document.createElement('div');
button1.setAttribute('id', 'crime_button');
button1.setAttribute('class', 'mapboxgl-ctrl-group');
button1.innerHTML = 'Crime Rate Map';
map1.appendChild(button1);

var button2 = document.createElement('div');
button2.setAttribute('id', 'income_button');
button2.setAttribute('class', 'mapboxgl-ctrl-group');
button2.innerHTML = 'Median Income Map';
map1.appendChild(button2);

var button3 = document.createElement('div');
button3.setAttribute('id', 'unemp_button');
button3.setAttribute('class', 'mapboxgl-ctrl-group');
button3.innerHTML = 'Unemployment Rate Map';
map1.appendChild(button3);

//slider
var slider_container = document.createElement('div');
slider_container.setAttribute('id', 'slider_container');
slider_container.setAttribute('class', 'mapboxgl-ctrl-group');
var label = document.createElement('label');
label.innerHTML = 'Layer opacity:';
var slider_value = document.createElement('span');
slider_value.setAttribute('id', 'slider_value');
slider_value.innerHTML = '80%';
label.appendChild(slider_value);

var slider_input = document.createElement('input');
slider_input.setAttribute('id', 'slider_input');
slider_input.setAttribute('type', 'range');
slider_input.setAttribute('min', '0');
slider_input.setAttribute('max', '100');
slider_input.setAttribute('step', '0');
slider_input.setAttribute('value', '80');

slider_container.appendChild(label);
slider_container.appendChild(slider_input);

map1.appendChild(slider_container);

var view2 = {
  center: [-87.6924, 41.8386],
  zoom: 10.5,
  bearing: 15.1,
  pitch: 50,
  speed: 0.2,
  curve: 0.7,
};
var view1 = {
  center: [-87.6356, 41.8386],
  zoom: 10.5,
  bearing: 0,
  pitch: 0,
  speed: 0.5,
  curve: 0.5,
};

var crime_rate_color = {
  property: 'crime_rate',
  stops: [
    [0, '#ffffcc'],
    [20000, '#a1dab4'],
    [40000, '#41b6c4'],
    [40000, '#2c7fb8'],
    [80000, '#253494'],
  ],
};
var crime_rate_height = {
  property: 'crime_rate',
  stops: [
    [0, 1],
    [20000, 2000],
    [40000, 4000],
    [40000, 6000],
    [80000, 13000],
  ],
};

var median_income_color = {
  property: 'Median_Income',
  stops: [
    [0, '#feebe2'],
    [50000, '#fbb4b9'],
    [100000, '#f768a1'],
    [150000, '#ae017e'],
  ],
};

var median_income_height = {
  property: 'Median_Income',
  stops: [
    [0, 1],
    [50000, 3000],
    [100000, 6000],
    [150000, 13000],
  ],
};

var unemp_pct_color = {
  property: 'unemp_pct',
  stops: [
    [0, '#ffffd4'],
    [0.1, '#fed98e'],
    [0.2, '#fe9929'],
    [0.3, '#d95f0e'],
    [0.4, '#993404'],
  ],
};
var unemp_pct_height = {
  property: 'unemp_pct',
  stops: [
    [0, 1],
    [0.1, 2000],
    [0.2, 4000],
    [0.3, 6000],
    [0.4, 13000],
  ],
};

//map on load
map.on('load', function() {
  map.flyTo(view1);
  map.addSource('crime-map', {
    type: 'geojson',
    data: './data/proj2.geojson',
  });

  //layers for 2d map
  map.addLayer({
    id: 'Crime Rate Map',
    type: 'fill',
    source: 'crime-map',
    layout: {
      visibility: 'visible',
    },
    paint: {
      'fill-color': crime_rate_color,
      'fill-outline-color': 'white',
      'fill-opacity': 0.8,
    },
  });

  map.addLayer({
    id: 'Median Income Map',
    type: 'fill',
    source: 'crime-map',
    layout: {
      visibility: 'none',
    },
    paint: {
      'fill-color': median_income_color,
      'fill-outline-color': 'white',
      'fill-opacity': 0.8,
    },
  });

  map.addLayer({
    id: 'Unemployment Rate Map',
    type: 'fill',
    source: 'crime-map',
    layout: {
      visibility: 'none',
    },
    paint: {
      'fill-color': unemp_pct_color,
      'fill-outline-color': 'white',
      'fill-opacity': 0.8,
    },
  });

  //layers for 3d map

  map.addLayer({
    id: 'Crime Rate Map 3D',
    type: 'fill-extrusion',
    source: 'crime-map',
    layout: {
      visibility: 'none',
    },
    paint: {
      'fill-extrusion-color': crime_rate_color,
      'fill-extrusion-height': crime_rate_height,
      'fill-extrusion-opacity': 0.8,
      'fill-extrusion-base': 0,
    },
  });

  map.addLayer({
    id: 'Median Income Map 3D',
    type: 'fill-extrusion',
    source: 'crime-map',
    layout: {
      visibility: 'none',
    },
    paint: {
      'fill-extrusion-color': median_income_color,
      'fill-extrusion-height': median_income_height,
      'fill-extrusion-opacity': 0.8,
      'fill-extrusion-base': 0,
    },
  });

  map.addLayer({
    id: 'Unemployment Rate Map 3D',
    type: 'fill-extrusion',
    source: 'crime-map',
    layout: {
      visibility: 'none',
    },
    paint: {
      'fill-extrusion-color': unemp_pct_color,
      'fill-extrusion-height': unemp_pct_height,
      'fill-extrusion-opacity': 0.8,
      'fill-extrusion-base': 0,
    },
  });

  var maplist = [
    'Crime Rate Map',
    'Median Income Map',
    'Unemployment Rate Map',
  ];
  var current_map = 'Crime Rate Map';
  var current_3d = 'Crime Rate Map 3D';
  var slider = document.getElementById('slider_input');
  var sliderValue = document.getElementById('slider_value');

  //variable switch button
  var var1 = document.getElementById('crime_button');
  var1.addEventListener('click', function() {
    sliderValue.textContent = '80%';
    var var_name = var1.innerHTML;
    map.setLayoutProperty(current_3d, 'visibility', 'none');
    var i;
    for (i = 0; i < maplist.length; i++) {
      var map_name = maplist[i];
      if (map_name === var_name) {
        current_map = map_name;
        current_3d = map_name + ' 3D';
        map.setLayoutProperty(current_map, 'visibility', 'visible');
        var1.className = 'mapboxgl-ctrl-group';
        map.flyTo(view1);
      } else {
        map.setLayoutProperty(map_name, 'visibility', 'none');
      }
    }
  });

  var var2 = document.getElementById('income_button');
  var2.addEventListener('click', function() {
    sliderValue.textContent = '80%';
    var var_name = var2.innerHTML;
    map.setLayoutProperty(current_3d, 'visibility', 'none');
    var i;
    for (i = 0; i < maplist.length; i++) {
      var map_name = maplist[i];
      if (map_name === var_name) {
        current_map = map_name;
        current_3d = map_name + ' 3D';
        map.setLayoutProperty(current_map, 'visibility', 'visible');
        var2.className = 'mapboxgl-ctrl-group';
        map.flyTo(view1);
      } else {
        map.setLayoutProperty(map_name, 'visibility', 'none');
      }
    }
  });

  var var3 = document.getElementById('unemp_button');
  var3.addEventListener('click', function() {
    sliderValue.textContent = '80%';
    var var_name = var3.innerHTML;
    map.setLayoutProperty(current_3d, 'visibility', 'none');
    var i;
    for (i = 0; i < maplist.length; i++) {
      var map_name = maplist[i];
      if (map_name === var_name) {
        current_map = map_name;
        current_3d = map_name + ' 3D';
        map.setLayoutProperty(current_map, 'visibility', 'visible');
        var3.className = 'mapboxgl-ctrl-group';
        map.flyTo(view1);
      } else {
        map.setLayoutProperty(map_name, 'visibility', 'none');
      }
    }
  });

  //3d button
  var ex = document.getElementById('button_3d');
  ex.addEventListener('click', function() {
    if (map.getLayoutProperty(current_map, 'visibility') === 'visible') {
      map.setLayoutProperty(current_3d, 'visibility', 'visible');
      ex.className = 'mapboxgl-ctrl-group active';
      setTimeout(function() {
        map.flyTo(view2);
        map.setLayoutProperty(current_map, 'visibility', 'none');
      }, 2000);
    } else {
      map.setLayoutProperty(current_map, 'visibility', 'visible');
      map.setLayoutProperty(current_3d, 'visibility', 'none');
      ex.className = 'mapboxgl-ctrl-group';
      map.flyTo(view1);
    }
  });

  //slider
  slider.addEventListener('input', function(e) {
    map.setPaintProperty(
      current_map,
      'fill-opacity',
      parseInt(e.target.value, 10) / 100,
    );
    map.setPaintProperty(
      current_3d,
      'fill-extrusion-opacity',
      parseInt(e.target.value, 10) / 100,
    );
    sliderValue.textContent = e.target.value + '%';
  });
});

//tooltip
var popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false,
});

var column_name = [
  'Total Population',
  'Crime Rate',
  'Median Income',
  'Unemployment Rate',
];

function identifyFeatures(location, fields) {
  var identifiedFeatures = map.queryRenderedFeatures(location.point);
  /*console.log(identifiedFeatures);*/
  popup.remove();
  if (identifiedFeatures != '') {
    var popupText = '';
    var i;
    for (i = 0; i < fields.length; i++) {
      if (column_name[i] === 'Unemployment Rate') {
        popupText +=
          '<strong>' +
          column_name[i] +
          ':</strong> ' +
          (identifiedFeatures[0].properties[fields[i]] * 100).toFixed(2) +
          '%' +
          '<' +
          'br' +
          '>';
      } else if (column_name[i] === 'Crime Rate') {
        popupText +=
          '<strong>' +
          column_name[i] +
          ':</strong> ' +
          identifiedFeatures[0].properties[fields[i]].toFixed(2) +
          '<' +
          'br' +
          '>';
      } else {
        popupText +=
          '<strong>' +
          column_name[i] +
          ':</strong> ' +
          identifiedFeatures[0].properties[fields[i]] +
          '<' +
          'br' +
          '>';
      }
    }
    popup
      .setLngLat(location.lngLat)
      .setHTML(popupText)
      .addTo(map);
  }
}

map.on('click', 'Crime Rate Map', function(e) {
  identifyFeatures(e, [
    'Race_Total',
    'crime_rate',
    'Median_Income',
    'unemp_pct',
  ]);
});

map.on('click', 'Median Income Map', function(e) {
  identifyFeatures(e, [
    'Race_Total',
    'crime_rate',
    'Median_Income',
    'unemp_pct',
  ]);
});

map.on('click', 'Unemployment Rate Map', function(e) {
  identifyFeatures(e, [
    'Race_Total',
    'crime_rate',
    'Median_Income',
    'unemp_pct',
  ]);
});

map.on('mousemove', 'Crime Rate Map', function(e) {
  identifyFeatures(e, [
    'Race_Total',
    'crime_rate',
    'Median_Income',
    'unemp_pct',
  ]);
});
map.on('mousemove', 'Median Income Map', function(e) {
  identifyFeatures(e, [
    'Race_Total',
    'crime_rate',
    'Median_Income',
    'unemp_pct',
  ]);
});

map.on('mousemove', 'Unemployment Rate Map', function(e) {
  identifyFeatures(e, [
    'Race_Total',
    'crime_rate',
    'Median_Income',
    'unemp_pct',
  ]);
});

//3d tooltip
map.on('click', 'Crime Rate Map 3D', function(e) {
  identifyFeatures(e, [
    'Race_Total',
    'crime_rate',
    'Median_Income',
    'unemp_pct',
  ]);
});

map.on('click', 'Median Income Map 3D', function(e) {
  identifyFeatures(e, [
    'Race_Total',
    'crime_rate',
    'Median_Income',
    'unemp_pct',
  ]);
});

map.on('click', 'Unemployment Rate Map 3D', function(e) {
  identifyFeatures(e, [
    'Race_Total',
    'crime_rate',
    'Median_Income',
    'unemp_pct',
  ]);
});

map.on('mousemove', 'Crime Rate Map 3D', function(e) {
  identifyFeatures(e, [
    'Race_Total',
    'crime_rate',
    'Median_Income',
    'unemp_pct',
  ]);
});
map.on('mousemove', 'Median Income Map 3D', function(e) {
  identifyFeatures(e, [
    'Race_Total',
    'crime_rate',
    'Median_Income',
    'unemp_pct',
  ]);
});

map.on('mousemove', 'Unemployment Rate Map 3D', function(e) {
  identifyFeatures(e, [
    'Race_Total',
    'crime_rate',
    'Median_Income',
    'unemp_pct',
  ]);
});
