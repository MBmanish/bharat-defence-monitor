/* ==========================================
   BHARAT DEFENCE MONITOR
   MAP ENGINE
========================================== */

let map;
let activeMarkers = [];

const CATEGORY_COLORS = {
    military: "#ef4444",
    border: "#f97316",
    maritime: "#3b82f6",
    weather: "#8b5cf6",
    infrastructure: "#10b981",
    cyber: "#eab308",
    strategic: "#ec4899",
    transport: "#06b6d4"
};

/* ==========================================
   INITIALIZE MAP
========================================== */

function initializeMap() {

    map = new maplibregl.Map({

        container: "map",

        style: {
            version: 8,
            sources: {
                osm: {
                    type: "raster",
                    tiles: [
                        "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
                        "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
                        "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    ],
                    tileSize: 256
                }
            },
            layers: [
                {
                    id: "osm",
                    type: "raster",
                    source: "osm"
                }
            ]
        },

        center: [78.9629, 22.5937],
        zoom: 4.8,

        minZoom: 3,
        maxZoom: 14

    });

    map.addControl(
        new maplibregl.NavigationControl(),
        "top-right"
    );

    map.addControl(
        new maplibregl.ScaleControl(),
        "bottom-left"
    );

    map.on("load", () => {

        addMapOverlays();

        console.log(
            "Bharat Defence Monitor Map Loaded"
        );

    });

}

/* ==========================================
   MAP OVERLAYS
========================================== */

function addMapOverlays() {

    const mapContainer =
        document.querySelector(".map-panel");

    const status = document.createElement("div");

    status.className =
        "map-overlay map-status";

    status.innerHTML = `
        <div class="map-status-title">
            ACTIVE EVENTS
        </div>

        <div
            class="map-status-value"
            id="activeEventsCounter"
        >
            0
        </div>
    `;

    mapContainer.appendChild(status);

    const focus = document.createElement("div");

    focus.className =
        "india-focus";

    focus.innerHTML =
        "🇮🇳 INDIA MILITARY ACTIVITY MONITOR";

    mapContainer.appendChild(focus);

    const footer =
        document.createElement("div");

    footer.className =
        "map-footer";

    footer.innerHTML =
        "Open Source Intelligence Dashboard";

    mapContainer.appendChild(footer);

}

/* ==========================================
   CLEAR MARKERS
========================================== */

function clearMarkers() {

    activeMarkers.forEach(marker => {

        marker.remove();

    });

    activeMarkers = [];

}

/* ==========================================
   CREATE MARKER
========================================== */

function createMarker(event) {

    const markerElement =
        document.createElement("div");

    markerElement.className =
        `event-marker
         marker-${event.category}
         severity-${event.severity || "medium"}`;

    const popupHTML = `
        <div class="popup-title">
            ${event.title}
        </div>

        <div class="popup-location">
            📍 ${event.location}
        </div>

        <div class="popup-date">
            ${event.date || ""}
        </div>

        <div class="popup-summary">
            ${event.summary || ""}
        </div>
    `;

    const marker =
        new maplibregl.Marker(markerElement)

        .setLngLat([
            event.lng,
            event.lat
        ])

        .setPopup(
            new maplibregl.Popup({
                closeButton: true
            }).setHTML(popupHTML)
        )

        .addTo(map);

    activeMarkers.push(marker);

}

/* ==========================================
   RENDER EVENTS
========================================== */

function renderMapEvents(events) {

    if (!map) return;

    clearMarkers();

    let visibleCount = 0;

    events.forEach(event => {

        const checkbox =
            document.getElementById(
                event.category
            );

        if (
            checkbox &&
            checkbox.checked === false
        ) {
            return;
        }

        createMarker(event);

        visibleCount++;

    });

    updateActiveCounter(
        visibleCount
    );

}

/* ==========================================
   ACTIVE COUNTER
========================================== */

function updateActiveCounter(
    count
) {

    const el =
        document.getElementById(
            "activeEventsCounter"
        );

    if (el) {

        el.textContent = count;

    }

}

/* ==========================================
   FLY TO EVENT
========================================== */

function flyToEvent(event) {

    if (!map) return;

    map.flyTo({

        center: [
            event.lng,
            event.lat
        ],

        zoom: 7,

        speed: 1.2

    });

}

/* ==========================================
   FOCUS INDIA
========================================== */

function focusIndia() {

    map.flyTo({

        center: [
            78.9629,
            22.5937
        ],

        zoom: 4.8

    });

}

/* ==========================================
   FILTER BY CATEGORY
========================================== */

function getVisibleEvents(events) {

    return events.filter(event => {

        const checkbox =
            document.getElementById(
                event.category
            );

        if (!checkbox)
            return true;

        return checkbox.checked;

    });

}

/* ==========================================
   REFRESH MAP
========================================== */

function refreshMap(events) {

    const visibleEvents =
        getVisibleEvents(events);

    renderMapEvents(
        visibleEvents
    );

}

/* ==========================================
   FUTURE CLUSTER SUPPORT
========================================== */

function enableClustering() {

    console.log(
        "Cluster support reserved for v2"
    );

}

/* ==========================================
   EXPOSE FUNCTIONS
========================================== */

window.initializeMap =
    initializeMap;

window.renderMapEvents =
    renderMapEvents;

window.refreshMap =
    refreshMap;

window.flyToEvent =
    flyToEvent;

window.focusIndia =
    focusIndia;
