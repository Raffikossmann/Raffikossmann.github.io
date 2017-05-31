window.onload = function () {
var layers = {
            geolandbasemap: L.tileLayer("https://{s}.wien.gv.at/basemap/geolandbasemap/normal/google3857/{z}/{y}/{x}.png", {
                subdomains: ['maps', 'maps1', 'maps2', 'maps3', 'maps4'],
                attribution: 'Datenquelle: <a href="http://www.basemap.at/">basemap.at</a>'
            }),
            bmapgrau: L.tileLayer("https://{s}.wien.gv.at/basemap/bmapgrau/normal/google3857/{z}/{y}/{x}.png", {
                subdomains: ['maps', 'maps1', 'maps2', 'maps3', 'maps4'],
                attribution: 'Datenquelle: <a href="http://www.basemap.at/">basemap.at</a>'
            }),
            bmapoverlay: L.tileLayer("https://{s}.wien.gv.at/basemap/bmapoverlay/normal/google3857/{z}/{y}/{x}.png", {
                subdomains: ['maps', 'maps1', 'maps2', 'maps3', 'maps4'],
                attribution: 'Datenquelle: <a href="http://www.basemap.at/">basemap.at</a>'
            }),
            bmaphidpi: L.tileLayer("https://{s}.wien.gv.at/basemap/bmaphidpi/normal/google3857/{z}/{y}/{x}.jpeg", {
                subdomains: ['maps', 'maps1', 'maps2', 'maps3', 'maps4'],
                attribution: 'Datenquelle: <a href="http://www.basemap.at/">basemap.at</a>'
            }),
            bmaporthofoto30cm: L.tileLayer("https://{s}.wien.gv.at/basemap/bmaporthofoto30cm/normal/google3857/{z}/{y}/{x}.jpeg", {
                subdomains: ['maps', 'maps1', 'maps2', 'maps3', 'maps4'],
                attribution: 'Datenquelle: <a href="http://www.basemap.at/">basemap.at</a>'
            }),
            osm: L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                subdomains: ['a', 'b', 'c'],
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            })
        };

        // Karte definieren
        var map = L.map('map', {
            layers: [layers.geolandbasemap],
            center : [47.654, 13.370],
            zoom : 8
        });

        // Maßstab hinzufügen
        L.control.scale({
            maxWidth: 200,
            metric: true,
            imperial: false
        }).addTo(map);

        // Höhenprofil control hinzufügen
        var profileControl = L.control.elevation({
            position : 'bottomleft',
            theme : 'steelblue-theme'
        });
        profileControl.addTo(map);
		
		var gpxTrackGroup = L.featureGroup ().addTo(map);
		
		var coloredLineGroup = L.featureGroup().addTo(map);
		
		function loadTrack(gpxFile) {
		         //Etappen als Info anzeigen
				 //console.log("etappeninfo: ", window.ETAPPENINFO);
				 //console.log("info :", window.ETAPPENINFO[gpxFile]);
				 //console.log("Kurztext :", window.ETAPPENINFO[gpxFile].Kurztext);
				 //console.log("Streckenbeschreibung :", window.ETAPPENINFO[gpxFile].Streckenbeschreibung);
				 document.getElementById("Kurztext").innerHTML = window.ETAPPENINFO[gpxFile].Kurztext;
				 document.getElementById("Streckenbeschreibung").innerHTML = window.ETAPPENINFO[gpxFile].Streckenbeschreibung;
				 
				 //bestehenden Track, farbige Linie mit Steigung und Profil löschen				 
				 //gpxTrackGroup.clearLayers();
				 //coloredLineGroup.clearLayers();
				 //profileControl.clear();
		
        // GPX Track laden
        gpxTrack = omnivore.gpx('data/'+gpxFile).addTo(gpxTrackGroup);

        // nach erfolgreichem Laden Popup hinzufügen, Ausschnitt setzen und Höhenprofil erzeugen
        gpxTrack.on('ready', function () {
            // Popup hinzufügen
            var markup = '<h3> Adlerweg-Etappe 11: Karwendelhaus – Hallerangerhaus</h3>';
            markup += '<p>Hinauf in höchste Höhen führt die alpinistisch anspruchsvollste Adlerweg-Etappe im Karwendel. Neben dem Karwendelhaus startet die Route und führt auf die 2.749 Meter hohe Birkkarspitze. Nach dem Gipfelsieg erfolgt der Abstieg ins schöne Hinterautal und weiter bis zum Etappenziel, dem Hallangerhaus.</p>'
            markup += '<li>Ausgangspunkt: Karwendelhaus</li>';
            markup += '<li>Endpunkt: Hallerangerhaus</li>';
            markup += '<li>Höhenmeter bergauf:1440</li>';
            markup += '<li>Höhenmeter bergab: 1450</li>';
            markup += '<li>Höchster Punkt: 2749</li>';
            markup += '<li>Schwierigkeitsgrad: schwierig</li>';
            markup += '<li>Streckenlänge (in km): 14</li>';
            markup += '<li>Gehzeit (in Stunden): 8</li>';
            markup += '<li>Einkehrmöglichkeiten: Karwendelhaus, Kastenalm, Hallerangerhaus, Hallerangeralm</li>';
            markup += '<li><a href="http://www.tirol.at/reisefuehrer/sport/wandern/wandertouren/a-adlerweg-etappe-11-karwendelhaus-hallerangerhaus">Weitere Informationen</a></li>';
            gpxTrack.bindPopup(markup, { maxWidth : 450 });

            // Ausschnitt setzen
            map.fitBounds(gpxTrack.getBounds());

            // Höhenprofil erzeugen
			profileControl.clear();
            gpxTrack.eachLayer(function(layer) {
                profileControl.addData(layer.feature);
				
				//var pts
				//console.log(layer.feature.geometry.coordinates)
				var pts = layer.feature.geometry.coordinates;
				
				for (var i = 1; i < pts.length; i += 1) {
				    //console.log(pts[i]);   //aktueller Punkt
					//console.log(pts[i-1]);   //vorhergehender Punkt
					
					//Entfernung best
					var dist = map.distance(
					       [ pts[i][1], pts[i][0]],
						   [ pts[i-1][1], pts[i-1][0] ]
					).toFixed(0);
					//console.log(dist);
					
					var delta = pts[i][2] - pts[i-1][2];
					//console.log(delta,"Höhenmeter auf", dist,"m Strecke");
					
					//Steigung errechnen					
					var rad = Math.atan(delta/dist);
					var deg = (rad * (180/Math.PI)).toFixed(1);
					//console.log(deg);
					
					//colorbrewer	Farbpalette; 	
                     //rot: ['#fee5d9','#fcbba1','#fc9272','#fb6a4a','#de2d26','#a50f15']; 
					 //gruen: ['#ffffcc','#d9f0a3','#addd8e','#78c679','#31a354','#006837'];
					 
					//switch-statement
					var farbe;
					switch(true) { // checks if condition is true, not for certain values of a variable
						case (deg >= 20) :  farbe = "#bd0026"; break;
						case (deg >= 15) :  farbe = "#f03b20"; break;
						case (deg >= 10) :  farbe = "#fd8d3c"; break;
						case (deg >= 5) :  farbe = "#feb24c"; break;
						case (deg >= 1) :  farbe = "#fed976"; break;
						case (deg >= -1) :  farbe = "yellow"; break;
						case (deg >= -5) :  farbe = "#d9f0a3"; break;
						case (deg >=-10) :  farbe = "#addd8e"; break;
						case (deg >=-15) :  farbe = "#78c679"; break;
						case (deg >= -20) :  farbe = "#31a354"; break;
						case (deg < -20) :  farbe = "#006837"; break;
					}
					//console.log(deg, farbe);
					
					//Linie zeichnen
					var pointA = new L.LatLng(pts[i][1], pts[i][0]);
					var pointB = new L.LatLng(pts[i-1][1], pts[i-1][0]);
					var pointList = [pointA, pointB];
			   
					var firstpolyline = new L.Polyline(pointList, {
					 color: farbe,
					 weight: 6,
					 opacity: 1.0,
					 smoothFactor: 1

					});
				
					firstpolyline.addTo(coloredLineGroup);
				}
            });
        });
		
		
		
		var huts = [
                 L.marker([47.42724, 11.42161], {title: "Karwendelhaus", icon: L.icon ({iconAnchor: [12, 30], iconUrl: 'icons/huette.png' }) }), //Karwendelhaus 47.42724, 11.42161;; 
				 L.marker([47.36953, 11.43490], {title: "Kastenalm ",icon: L.icon ({iconAnchor: [12, 30], iconUrl: 'icons/huette.png' }) }), //Kastenalm  47.36953, 11.43490
				 L.marker([47.35477, 11.47718], {title: "Hallerangerhaus",icon: L.icon ({iconAnchor: [12, 30], iconUrl: 'icons/huette.png' }) }), //Hallerangerhaus 47.35477, 11.47718
				 L.marker([47.35647, 11.47980], {title: "Hallerangeralm",icon: L.icon ({iconAnchor: [12, 30], iconUrl: 'icons/huette.png' }) })  //Hallerangeralm 47.35647, 11.47980
			];
		var hutsLayer = L.featureGroup(); 
		for (var i=0; i<huts.length; i++) {
			hutsLayer.addLayer(huts[i]);
		}
		// hutsLayer.addTo(map);
		map.on("zoomend", function () {
			if (map.getZoom() >= 15) { 
				map.addLayer(hutsLayer);
			} else { 
				map.removeLayer(hutsLayer); 
			}
		});
		
		var track1 = [
		         L.marker([47.42728, 11.42170], {title: "Startpunkt der Etappe", icon: L.icon ({iconAnchor: [12, 30], iconUrl: 'icons/start.png' }) }),
				 L.marker([47.35469, 11.47710], {title: "Endpunkt der Etappe", icon: L.icon ({iconAnchor: [12, 30], iconUrl: 'icons/end.png' }) })
		];
		var track1Layer = L.featureGroup();
		for (var i=0; i<track1.length; i++) {
		     track1Layer.addLayer(track1[i]);
		}
		//startLayer.addTo(map);
		map.on("zoomend", function () {
		       if (map.getZoom () >= 12) {
			         map.addLayer(track1Layer);
			   }
			   else {
			        map.removeLayer(track1Layer);
				}
		});	
		} // end function loadTrack
		
		        // WMTS-Layer Auswahl hinzufügen
        var layerControl = L.control.layers({
            "basemap.at - STANDARD": layers.geolandbasemap,
            "basemap.at - GRAU": layers.bmapgrau,
            "basemap.at - OVERLAY": layers.bmapoverlay,
            "basemap.at - HIGH-DPI": layers.bmaphidpi,
            "basemap.at - ORTHOFOTO": layers.bmaporthofoto30cm,
            "OpenStreetMap": layers.osm,
        },{
            //"Adlerweg Etappe 11" : gpxTrack
        }).addTo(map);
		
		//zwischen den einzelnen Etappen hin und her schalten
		var etappenSelektor = document.getElementById("etappen");
		//console.log("Selector", etappenSelektor);
		etappenSelektor.onchange = function(evt) {
		  console.log("Change event: ", evt);
		  console.log("GPX Track laden: ", etappenSelektor[etappenSelektor.selectedIndex].value);
		  loadTrack(etappenSelektor[etappenSelektor.selectedIndex].value);
		}
		loadTrack("AdlerwegEtappe11.gpx");
};