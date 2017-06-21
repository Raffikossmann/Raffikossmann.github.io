    window.onload = function() {

        var bild = document.getElementById("figureImage");

        var unterschrift = document.getElementById("figureCaption");

        var letzterButton = document.getElementById("button1");

        var navigation = document.getElementById("sportSelector");

        navigation.onclick = function(evt) {

            var bildname = evt.target.getAttribute("data-image");
            var bildtitel = evt.target.getAttribute("data-title");

            bild.src = "images/" + bildname;

            unterschrift.innerHTML = bildtitel;

            evt.target.setAttribute("class", "current");

            letzterButton.removeAttribute("class");

            letzterButton = evt.target;
        };



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
            center: [47.654, 13.370],
            zoom: 8
        });

        var clusterGruppe_skate = L.markerClusterGroup().addTo(map);
        var clusterGruppe_surf = L.markerClusterGroup().addTo(map);
        var clusterGruppe_snow = L.markerClusterGroup().addTo(map);

        // Maßstab hinzufügen
        L.control.scale({
            maxWidth: 200,
            metric: true,
            imperial: false
        }).addTo(map);

        // Punkte Skatespots
        var skateiconByCategory = {
            1: "https://webmappingprojekt.files.wordpress.com/2017/06/skateboard.png?w=1140",
            2: "https://webmappingprojekt.files.wordpress.com/2017/06/skateboard2.png?w=1140"
        };
        // Punkte der Skatespots als Marker mit Popup hinzufügen
        var punkteSkate = L.geoJSON(window.skatespotMarker, {
            pointToLayer: function(feature, latlng) {
                return L.marker(latlng, {
                    icon: L.icon({
                        iconSize: [28, 33],
                        iconAnchor: [10, 33],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41],
                        shadowUrl: 'https://unpkg.com/leaflet@1.0.3/dist/images/marker-shadow.png',
                        iconUrl: skateiconByCategory[feature.properties.KATEGORIE]
                    })
                });
            },
            onEachFeature: function(feature, layer) {
                var note = '<h2>' + layer.feature.properties.NAME + '</h2>';
                note += '<h5>' + "Bemerkung: " + layer.feature.properties.BEMERKUNG + '</h5>';
                note += '<h5>' + "Typ: " + layer.feature.properties.TYP + '</h5>';
                note += '<h5>' + " " + layer.feature.properties.FOTO + '</h5>';
                layer.bindPopup(note);
            }
        }).addTo(clusterGruppe_skate);


        //Punkte Surfspots
        var surficonByCategory = {
            1: "https://webmappingprojekt.files.wordpress.com/2017/06/riversurf2.png?w=1140",
            2: "https://webmappingprojekt.files.wordpress.com/2017/06/riversurf.png?w=1140"
        };
        // Punkte der Surfspots als Marker mit Popup hinzufügen
        var punkteSurf = L.geoJSON(window.surfspotMarker, {
            pointToLayer: function(feature, latlng) {
                return L.marker(latlng, {
                    icon: L.icon({
                        iconSize: [28, 33],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41],
                        shadowUrl: 'https://unpkg.com/leaflet@1.0.3/dist/images/marker-shadow.png',
                        iconUrl: surficonByCategory[feature.properties.KATEGORIE]
                    })
                });
            },
            onEachFeature: function(feature, layer) {
                var note = '<h2>' + layer.feature.properties.NAME + '</h2>';
                note += '<h5>' + "Bemerkung: " + layer.feature.properties.BEMERKUNG + '</h5>';
                note += '<h5>' + "Typ: " + layer.feature.properties.TYP + '</h5>';
                note += '<h5>' + " " + layer.feature.properties.FOTO + '</h5>';
                layer.bindPopup(note);
            }
        }).addTo(clusterGruppe_surf);


        //Punkte Snowspots
        var snowiconByCategory = {
            1: "https://webmappingprojekt.files.wordpress.com/2017/06/snowboard21.png?crop",
            2: "https://webmappingprojekt.files.wordpress.com/2017/06/snowboard.png?w=1140"
        };
        // Punkte der Snowspots als Marker mit Popup hinzufügen
        var punkteSnow = L.geoJSON(window.snowspotMarker, {
            pointToLayer: function(feature, latlng) {
                return L.marker(latlng, {
                    icon: L.icon({
                        iconSize: [28, 33],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41],
                        shadowUrl: 'https://unpkg.com/leaflet@1.0.3/dist/images/marker-shadow.png',
                        iconUrl: snowiconByCategory[feature.properties.KATEGORIE]
                    })
                });
            },
            onEachFeature: function(feature, layer) {
                var note = '<h2>' + layer.feature.properties.NAME + '</h2>';
                note += '<h5>' + "Bemerkung: " + layer.feature.properties.BEMERKUNG + '</h5>';
                note += '<h5>' + "Typ: " + layer.feature.properties.TYP + '</h5>';
                note += '<h5>' + " " + layer.feature.properties.FOTO + '</h5>';
                layer.bindPopup(note);
            }
        }).addTo(clusterGruppe_snow);

        var linienMountainbike = L.geoJSON(window.mountainbikeMarker, {
            style: function(feature) {
                var farbe = "";
                if (feature.properties.SCHWIERIGK == "schwierig") {
                    farbe = "red";
                } else if (feature.properties.SCHWIERIGK == "mittelschwierig") {
                    farbe = "orange";
                } else {
                    farbe = "yellow";
                }
                return {
                    color: farbe
                };
            }
        }).bindPopup(function(layer) {
            var note = '<h2>' + layer.feature.properties.ROUTENNAME + '</h2>';
            note += '<h5>' + "Bemerkung: " + layer.feature.properties.ROUTENBESC + '</h5>';
            note += '<h5>' + "Typ: " + layer.feature.properties.ROUTEN_TYP + '</h5>';
            note += '<h5>' + "Fahrzeit: " + layer.feature.properties.FAHRZEIT + '</h5>';
            return note;
        }).addTo(map);


        // Ausschnitt auf Punkte der Spotmap setzen
        map.fitBounds(linienMountainbike.getBounds());
        

        // WMTS-Layer Auswahl hinzufügen
        var layerControl = L.control.layers({
            "basemap.at - STANDARD": layers.geolandbasemap,
            "basemap.at - GRAU": layers.bmapgrau,
            "basemap.at - OVERLAY": layers.bmapoverlay,
            "basemap.at - HIGH-DPI": layers.bmaphidpi,
            "basemap.at - ORTHOFOTO": layers.bmaporthofoto30cm,
            "OpenStreetMap": layers.osm,
        }, {
            "Skate": clusterGruppe_skate,
            "Surf": clusterGruppe_surf,
            "Snow": clusterGruppe_snow,
            "Mountainbike": linienMountainbike
        }).addTo(map);
    };
