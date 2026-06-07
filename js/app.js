/* ==========================================
   BHARAT DEFENCE MONITOR
   APPLICATION CONTROLLER
========================================== */

window.allEvents = [];

const DATASETS = [

    "data/military.json",
    "data/border.json",
    "data/maritime.json",
    "data/weather.json",
    "data/infrastructure.json",
    "data/cyber.json",
    "data/strategic_assets.json",
    "data/transport.json"

];

/* ==========================================
   APPLICATION BOOTSTRAP
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        try {

            console.log(
                "Starting Bharat Defence Monitor..."
            );

            showLoadingFeed();

            initializeMap();

            await loadAllDatasets();

            initializeSearch();

            initializeAutoRefresh();

            console.log(
                "Bharat Defence Monitor Ready"
            );

        } catch (error) {

            console.error(
                "Application startup failed",
                error
            );

            showFatalError(
                error
            );

        }

    }
);

/* ==========================================
   LOAD DATASETS
========================================== */

async function loadAllDatasets() {

    const responses =
        await Promise.all(

            DATASETS.map(
                file =>
                    fetch(file)
                        .then(
                            response => {

                                if (
                                    !response.ok
                                ) {

                                    throw new Error(
                                        `Failed to load ${file}`
                                    );

                                }

                                return response.json();

                            }
                        )
            )

        );

    window.allEvents =
        responses.flat();

    normalizeEvents();

    initializeDashboard();

}

/* ==========================================
   NORMALIZE DATA
========================================== */

function normalizeEvents() {

    window.allEvents =
        window.allEvents.map(
            event => {

                return {

                    id:
                        event.id ||
                        crypto.randomUUID(),

                    title:
                        event.title ||
                        "Untitled Event",

                    location:
                        event.location ||
                        "Unknown Location",

                    lat:
                        Number(
                            event.lat
                        ),

                    lng:
                        Number(
                            event.lng
                        ),

                    category:
                        event.category ||
                        "military",

                    severity:
                        event.severity ||
                        "medium",

                    date:
                        event.date ||
                        new Date()
                            .toISOString(),

                    source:
                        event.source ||
                        "Open Source",

                    summary:
                        event.summary ||
                        ""

                };

            }
        );

}

/* ==========================================
   INITIAL DASHBOARD RENDER
========================================== */

function initializeDashboard() {

    renderMapEvents(
        window.allEvents
    );

    renderSidebarEvents(
        window.allEvents
    );

    StatsManager.update(
        window.allEvents
    );

    if (
        typeof LayerManager !==
        "undefined"
    ) {

        LayerManager.updateLayerCounters(
            window.allEvents
        );

    }

}

/* ==========================================
   SEARCH
========================================== */

function initializeSearch() {

    const searchBox =
        document.getElementById(
            "searchBox"
        );

    if (!searchBox)
        return;

    searchBox.addEventListener(
        "input",
        event => {

            const term =
                event.target.value
                    .toLowerCase()
                    .trim();

            const filtered =
                window.allEvents.filter(
                    item => {

                        return (

                            (
                                item.title || ""
                            )
                                .toLowerCase()
                                .includes(
                                    term
                                )

                            ||

                            (
                                item.location || ""
                            )
                                .toLowerCase()
                                .includes(
                                    term
                                )

                            ||

                            (
                                item.summary || ""
                            )
                                .toLowerCase()
                                .includes(
                                    term
                                )

                            ||

                            (
                                item.category || ""
                            )
                                .toLowerCase()
                                .includes(
                                    term
                                )

                        );

                    }
                );

            renderSidebarEvents(
                filtered
            );

            renderMapEvents(
                filtered
            );

        }
    );

}

/* ==========================================
   AUTO REFRESH
========================================== */

function initializeAutoRefresh() {

    setInterval(
        async () => {

            try {

                console.log(
                    "Refreshing datasets..."
                );

                await loadAllDatasets();

            } catch (
                error
            ) {

                console.warn(
                    "Refresh skipped",
                    error
                );

            }

        },

        300000
    );

}

/* ==========================================
   EVENT HELPERS
========================================== */

function getEventsByCategory(
    category
) {

    return (
        window.allEvents || []
    ).filter(
        event =>
            event.category ===
            category
    );

}

function getEventById(
    id
) {

    return (
        window.allEvents || []
    ).find(
        event =>
            event.id == id
    );

}

function getLatestEvents(
    limit = 20
) {

    return (
        [...window.allEvents]
    )

        .sort(
            (
                a,
                b
            ) =>
                new Date(
                    b.date
                ) -
                new Date(
                    a.date
                )
        )

        .slice(
            0,
            limit
        );

}

/* ==========================================
   DASHBOARD SUMMARY
========================================== */

function getDashboardSummary() {

    return {

        totalEvents:
            window.allEvents.length,

        military:
            getEventsByCategory(
                "military"
            ).length,

        border:
            getEventsByCategory(
                "border"
            ).length,

        maritime:
            getEventsByCategory(
                "maritime"
            ).length,

        weather:
            getEventsByCategory(
                "weather"
            ).length,

        infrastructure:
            getEventsByCategory(
                "infrastructure"
            ).length,

        cyber:
            getEventsByCategory(
                "cyber"
            ).length,

        strategic:
            getEventsByCategory(
                "strategic"
            ).length,

        transport:
            getEventsByCategory(
                "transport"
            ).length

    };

}

/* ==========================================
   ERROR HANDLING
========================================== */

function showFatalError(
    error
) {

    const container =
        document.getElementById(
            "eventFeed"
        );

    if (!container)
        return;

    container.innerHTML = `

        <div
            style="
            padding:20px;
            color:#ef4444;
            "
        >

            <h3>
                Dashboard Error
            </h3>

            <br>

            <div>
                ${error.message}
            </div>

        </div>

    `;

}

/* ==========================================
   MANUAL REFRESH
========================================== */

async function reloadDashboard() {

    try {

        await loadAllDatasets();

    } catch (
        error
    ) {

        console.error(
            error
        );

    }

}

/* ==========================================
   GLOBAL EXPORTS
========================================== */

window.reloadDashboard =
    reloadDashboard;

window.getDashboardSummary =
    getDashboardSummary;

window.getEventsByCategory =
    getEventsByCategory;

window.getEventById =
    getEventById;

window.getLatestEvents =
    getLatestEvents;
