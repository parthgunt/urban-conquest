/* ===============================
   TERRITORY ENGINE
================================ */

let capturedTerritories = [];

/* ===============================
   LINE INTERSECTION LOGIC
================================ */

function linesIntersect(a, b, c, d) {

    function ccw(p1, p2, p3) {
        return (p3[1] - p1[1]) * (p2[0] - p1[0]) >
            (p2[1] - p1[1]) * (p3[0] - p1[0]);
    }

    return (ccw(a, c, d) !== ccw(b, c, d)) &&
        (ccw(a, b, c) !== ccw(a, b, d));
}

function detectLoop(path) {

    if (path.length < 10) return null;

    const last = path[path.length - 1];
    const prev = path[path.length - 2];

    for (let i = 0; i < path.length - 5; i++) {

        const segStart = path[i];
        const segEnd = path[i + 1];

        if (linesIntersect(segStart, segEnd, prev, last)) {
            return i + 1;
        }
    }

    return null;
}

/* ===============================
   MAIN PROCESS FUNCTION
================================ */

window.processPath = function (path) {

    const loopStartIndex = detectLoop(path);

    if (loopStartIndex !== null) {

        const newPolygon = path.slice(loopStartIndex);

        capturedTerritories.push(newPolygon);

        renderTerritories();
    }
};

/* ===============================
   RENDER ALL TERRITORIES
================================ */

function renderTerritories() {

    if (map.getSource("territories")) {
        map.removeLayer("territories");
        map.removeSource("territories");
    }

    const features = capturedTerritories.map(polygon => ({
        type: "Feature",
        geometry: {
            type: "Polygon",
            coordinates: [[...polygon, polygon[0]]]
        }
    }));

    map.addSource("territories", {
        type: "geojson",
        data: {
            type: "FeatureCollection",
            features: features
        }
    });

    map.addLayer({
        id: "territories",
        type: "fill",
        source: "territories",
        paint: {
            "fill-color": "#0080ff",
            "fill-opacity": 0.4
        }
    });
}
