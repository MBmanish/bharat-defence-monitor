/* ==========================================
   BHARAT DEFENCE MONITOR
   MAP ENGINE
========================================== */

let map;
let activeMarkers = [];

const CATEGORY_COLORS = {

    military: "#dc2626",
    border: "#ea580c",
    maritime: "#2563eb",
    weather: "#7c3aed",
    infrastructure: "#059669",

    cyber: "#0891b2",
    strategic: "#b45309",
    transport: "#475569"

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

    const color =
        CATEGORY_COLORS[
            event.category
        ] || "#64748b";
   
   console.log(event.title,event.category,color);

    markerElement.style.width =
        "14px";

    markerElement.style.height =
        "14px";

    markerElement.style.borderRadius =
        "50%";

    markerElement.style.background =
        color;

    markerElement.style.border =
        "2px solid white";

    markerElement.style.boxShadow =
        "0 0 4px rgba(0,0,0,0.4)";

    if (
        event.severity ===
        "high"
    ) {

        markerElement.style.width =
            "18px";

        markerElement.style.height =
            "18px";

    }

    if (
        event.severity ===
        "critical"
    ) {

        markerElement.style.width =
            "22px";

        markerElement.style.height =
            "22px";

        markerElement.style.boxShadow =
            "0 0 10px rgba(255,0,0,0.8)";

    }

    const popupHTML = `

        <div style="min-width:250px">

            <div style="
                font-weight:bold;
                font-size:15px;
                margin-bottom:8px;
            ">
                ${event.title}
            </div>

            <div>
                📍 ${event.location}
            </div>

            <div>
                📅 ${event.date || ""}
            </div>

            <div>
                🏷️ ${event.category}
            </div>

            <div style="
                margin-top:8px;
                color:#475569;
            ">
                ${event.summary || ""}
            </div>

        </div>

    `;

    const marker =
        new maplibregl.Marker(
            markerElement
        )

        .setLngLat([
            event.lng,
            event.lat
        ])

        .setPopup(
            new maplibregl.Popup({
                closeButton:true,
                maxWidth:"350px"
            }).setHTML(
                popupHTML
            )
        )

        .addTo(map);

    activeMarkers.push(
        marker
    );

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
