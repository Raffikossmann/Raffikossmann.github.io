    window.onload = function() {
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

        var map = L.map('map', {
            layers: [layers.bmapgrau],
            center: [47.654, 13.370],
            zoom: 8
        });

        var clusterGruppe_skate = L.markerClusterGroup().addTo(map);
        var clusterGruppe_surf = L.markerClusterGroup().addTo(map);
        var clusterGruppe_snow = L.markerClusterGroup().addTo(map);

        L.control.scale({
            maxWidth: 200,
            metric: true,
            imperial: false
        }).addTo(map);

        var skateiconByCategory = {
            1: "https://webmappingprojekt.files.wordpress.com/2017/06/skateboard.png?w=1140",
            2: "https://webmappingprojekt.files.wordpress.com/2017/06/skateboard2.png?w=1140"
        };

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

        var surficonByCategory = {
            1: "https://webmappingprojekt.files.wordpress.com/2017/06/riversurf2.png?w=1140",
            2: "https://webmappingprojekt.files.wordpress.com/2017/06/riversurf.png?w=1140"
        };

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

        var snowiconByCategory = {
            1: "https://webmappingprojekt.files.wordpress.com/2017/06/snowboard21.png?crop",
            2: "https://webmappingprojekt.files.wordpress.com/2017/06/snowboard.png?w=1140"
        };

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

        map.fitBounds(punkteSurf.getBounds());

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
        }).addTo(map);

        map.locate({
            setView: true,
            maxZoom: 16
        });

        var first_point;

        var routing_control = L.Routing.control({
            show: false,
            language: 'de',
            routeWhileDragging: true
        }).addTo(map);

        map.on("locationfound", function(event) {

            first_point = L.marker(event.latlng).addTo(map);
            first_point.bindPopup('Wohin?').openPopup();
        });

        punkteSkate.on("click", function(event) {
            routing_control.setWaypoints([
                first_point.getLatLng(),
                event.latlng
            ]);
            routing_control.show();
        });

        punkteSnow.on("click", function(event) {
            routing_control.setWaypoints([
                first_point.getLatLng(),
                event.latlng
            ]);
            routing_control.show();
        });

        punkteSurf.on("click", function(event) {
            routing_control.setWaypoints([
                first_point.getLatLng(),
                event.latlng
            ]);
            routing_control.show();
        });

    };