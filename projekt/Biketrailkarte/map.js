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

    // Karte definieren
    var map = L.map('map', {
        layers: [layers.geolandbasemap],
        center: [47.654, 13.370],
        zoom: 8
    });

    // Maßstab hinzufügen
    L.control.scale({
        maxWidth: 200,
        metric: true,
        imperial: false
    }).addTo(map);
    var gpxTrackGroup = L.featureGroup().addTo(map);
    var coloredLineGroup = L.featureGroup().addTo(map);

    // Höhenprofil control hinzufügen
    var profileControl = L.control.elevation({
        position: 'bottomleft',
        theme: 'steelblue-theme',
		width: 400,
		height: 125,
    });
    profileControl.addTo(map);

    function loadTrack(gpxFile) {
        document.getElementById("Titel").innerHTML = window.ETAPPENINFO[gpxFile].Titel;
        document.getElementById("Ausgangspunkt").innerHTML = window.ETAPPENINFO[gpxFile].Ausgangspunkt;
        document.getElementById("Endpunkt").innerHTML = window.ETAPPENINFO[gpxFile].Endpunkt;
        document.getElementById("Laenge").innerHTML = window.ETAPPENINFO[gpxFile].Laenge;
        document.getElementById("Fahrzeit").innerHTML = window.ETAPPENINFO[gpxFile].Fahrzeit;
        document.getElementById("Schwierigkeitsgrad").innerHTML = window.ETAPPENINFO[gpxFile].Schwierigkeitsgrad;
        document.getElementById("Hoehenmeterauf").innerHTML = window.ETAPPENINFO[gpxFile].Hoehenmeterauf;
        document.getElementById("Hoehenmeterab").innerHTML = window.ETAPPENINFO[gpxFile].Hoehenmeterab;

        gpxTrackGroup.clearLayers();
        coloredLineGroup.clearLayers();

        gpxTrack = omnivore.gpx('biketrail/' + gpxFile).addTo(gpxTrackGroup);

        // nach erfolgreichem Laden Popup hinzufügen, Ausschnitt setzen und Höhenprofil erzeugen
        gpxTrack.on('ready', function() {

            // Ausschnitt setzen
            map.fitBounds(gpxTrack.getBounds());

            // Höhenprofil erzeugen

            profileControl.clear();
            gpxTrack.eachLayer(function(layer) {
                profileControl.addData(layer.feature);

                var pts = layer.feature.geometry.coordinates;

                for (var i = 1; i < pts.length; i++) {

                    var dist = map.distance(
                        [pts[i][1], pts[i][0]], [pts[i - 1][1], pts[i - 1][0]]
                    ).toFixed(0);

                    var delta = pts[i][2] - pts[i - 1][2];

                    var rad = Math.atan(delta / dist);
                    var deg = (rad * (180 / Math.PI)).toFixed(1);

                    var rot = ["#ab2524", "#a02128", "#a1232b", "#8d1d2c", "#701f29", "#5e2028"];
                    var gruen = ["#42EB00", "#38C400", "#288F00", "#195700", "#0A2400"];

                    var farbe;
                    switch (true) {
                        case (deg >= 20):
                            farbe = "#bd0026";
                            break;
                        case (deg >= 15):
                            farbe = "#f03b20";
                            break;
                        case (deg >= 10):
                            farbe = "#fd8d3c";
                            break;
                        case (deg >= 5):
                            farbe = "#feb24c";
                            break;
                        case (deg >= 1):
                            farbe = "#fed976";
                            break;
                        case (deg >= -1):
                            farbe = "yellow";
                            break;
                        case (deg >= -5):
                            farbe = "#d9f0a3";
                            break;
                        case (deg >= -10):
                            farbe = "#addd8e";
                            break;
                        case (deg >= -15):
                            farbe = "#78c679";
                            break;
                        case (deg >= -20):
                            farbe = "#31a354";
                            break;
                        case (deg < -20):
                            farbe = "#006837";
                            break;
                    }
                    var pointA = new L.LatLng(pts[i][1], pts[i][0]);
                    var pointB = new L.LatLng(pts[i - 1][1], pts[i - 1][0]);
                    var pointList = [pointA, pointB];

                    var firstpolyline = new L.Polyline(pointList, {
                        color: farbe,
                        weight: 6,
                        opacity: 1,
                        smoothFactor: 1

                    });

                    firstpolyline.addTo(coloredLineGroup);
                }
            });
        });
    };

    var layerControl = L.control.layers({
        "basemap.at - STANDARD": layers.geolandbasemap,
        "basemap.at - GRAU": layers.bmapgrau,
        "basemap.at - OVERLAY": layers.bmapoverlay,
        "basemap.at - HIGH-DPI": layers.bmaphidpi,
        "basemap.at - ORTHOFOTO": layers.bmaporthofoto30cm,
        "OpenStreetMap": layers.osm,
    }, {
        "Biketrail Etappen": gpxTrackGroup,
        "Steigungen": coloredLineGroup,
    }).addTo(map);

    var etappenSelektor = document.getElementById("etappen");
    etappenSelektor.onchange = function(evt) {
        loadTrack(etappenSelektor[etappenSelektor.selectedIndex].value);
    }

    loadTrack("01 Steeg-Weissenbach.gpx");
};