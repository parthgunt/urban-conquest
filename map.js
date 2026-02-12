mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN_HERE';


const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v11',
    center: [79.16026965, 12.9714122],
    zoom: 15
});

let rawCoordinates = [];
let drawing = false;

map.on('load', () => {

    map.addSource('route', {
        type: 'geojson',
        data: {
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: []
            }
        }
    });

    map.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route',
        layout: {
            'line-join': 'round',
            'line-cap': 'round'
        },
        paint: {
            'line-color': '#ffffff',
            'line-width': 5
        }
    });

    map.on('click', () => {
        drawing = !drawing;
        if (drawing) {
            rawCoordinates = [];
        }
    });

    map.on('mousemove', (e) => {

        if (!drawing) return;

        const point = [e.lngLat.lng, e.lngLat.lat];
        rawCoordinates.push(point);

        // Send updated path to territory engine
        if (window.processPath) {
            window.processPath(rawCoordinates);
        }

        map.getSource('route').setData({
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: rawCoordinates
            }
        });
    });
});
