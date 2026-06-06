/* ==========================================
   BHARAT DEFENCE MONITOR
   SIDEBAR / EVENT FEED
========================================== */

let currentSidebarEvents = [];

/* ==========================================
   RENDER SIDEBAR EVENTS
========================================== */

function renderSidebarEvents(events) {

    currentSidebarEvents = events;

    const container =
        document.getElementById(
            "eventFeed"
        );

    if (!container)
        return;

    container.innerHTML = "";

    if (events.length === 0) {

        container.innerHTML = `
            <div class="empty-feed">
                No events match current filters.
            </div>
        `;

        return;
    }

    const sortedEvents =
        [...events].sort(
            (a, b) =>
                new Date(
                    b.date || 0
                ) -
                new Date(
                    a.date || 0
                )
        );

    sortedEvents.forEach(event => {

        container.appendChild(
            createEventCard(event)
        );

    });

}

/* ==========================================
   CREATE EVENT CARD
========================================== */

function createEventCard(event) {

    const card =
        document.createElement(
            "div"
        );

    card.className =
        "event-card";

    card.dataset.category =
        event.category || "";

    card.dataset.id =
        event.id || "";

    const severity =
        event.severity ||
        "medium";

    const severityColor =
        getSeverityColor(
            severity
        );

    card.innerHTML = `
        <div
            style="
            display:flex;
            justify-content:space-between;
            align-items:flex-start;
            margin-bottom:8px;
            "
        >

            <div
                class="event-title"
            >
                ${event.title}
            </div>

            <div
                style="
                background:${severityColor};
                color:white;
                padding:3px 8px;
                border-radius:999px;
                font-size:11px;
                text-transform:uppercase;
                "
            >
                ${severity}
            </div>

        </div>

        <div class="event-location">
            📍 ${event.location}
        </div>

        <div class="event-date">
            ${formatDate(
                event.date
            )}
        </div>

        ${
            event.summary
                ? `
            <div
                style="
                margin-top:8px;
                font-size:13px;
                line-height:1.45;
                color:#cbd5e1;
                "
            >
                ${event.summary}
            </div>
        `
                : ""
        }

        ${
            event.source
                ? `
            <div
                style="
                margin-top:10px;
                color:#94a3b8;
                font-size:12px;
                "
            >
                Source:
                ${event.source}
            </div>
        `
                : ""
        }
    `;

    card.addEventListener(
        "click",
        () => {

            if (
                typeof flyToEvent ===
                "function"
            ) {

                flyToEvent(
                    event
                );

            }

        }
    );

    return card;

}

/* ==========================================
   SEVERITY COLORS
========================================== */

function getSeverityColor(
    severity
) {

    switch (
        severity
    ) {

        case "critical":
            return "#dc2626";

        case "high":
            return "#f97316";

        case "medium":
            return "#2563eb";

        case "low":
            return "#10b981";

        default:
            return "#64748b";

    }

}

/* ==========================================
   DATE FORMATTER
========================================== */

function formatDate(
    dateString
) {

    if (!dateString)
        return "Unknown";

    const date =
        new Date(
            dateString
        );

    return (
        date.toLocaleDateString(
            "en-IN",
            {
                year: "numeric",
                month: "short",
                day: "numeric"
            }
        )
    );

}

/* ==========================================
   FILTER SIDEBAR
========================================== */

function filterSidebarEvents(
    searchTerm
) {

    if (
        !searchTerm ||
        searchTerm.trim() === ""
    ) {

        renderSidebarEvents(
            currentSidebarEvents
        );

        return;
    }

    const term =
        searchTerm
            .toLowerCase()
            .trim();

    const filtered =
        currentSidebarEvents.filter(
            event =>
                (
                    event.title || ""
                )
                    .toLowerCase()
                    .includes(
                        term
                    ) ||

                (
                    event.location ||
                    ""
                )
                    .toLowerCase()
                    .includes(
                        term
                    ) ||

                (
                    event.summary ||
                    ""
                )
                    .toLowerCase()
                    .includes(
                        term
                    )
        );

    renderSidebarEvents(
        filtered
    );

}

/* ==========================================
   CATEGORY FILTER
========================================== */

function filterByCategory(
    category
) {

    if (
        !window.allEvents
    )
        return;

    if (
        category === "all"
    ) {

        renderSidebarEvents(
            window.allEvents
        );

        return;
    }

    const filtered =
        window.allEvents.filter(
            event =>
                event.category ===
                category
        );

    renderSidebarEvents(
        filtered
    );

}

/* ==========================================
   SORTING
========================================== */

function sortEventsByDate() {

    const sorted =
        [...currentSidebarEvents]
        .sort(
            (
                a,
                b
            ) =>
                new Date(
                    b.date || 0
                ) -
                new Date(
                    a.date || 0
                )
        );

    renderSidebarEvents(
        sorted
    );

}

function sortEventsBySeverity() {

    const order = {

        critical: 4,
        high: 3,
        medium: 2,
        low: 1

    };

    const sorted =
        [...currentSidebarEvents]
        .sort(
            (
                a,
                b
            ) =>
                (
                    order[
                        b.severity
                    ] || 0
                ) -
                (
                    order[
                        a.severity
                    ] || 0
                )
        );

    renderSidebarEvents(
        sorted
    );

}

/* ==========================================
   EMPTY STATE
========================================== */

function showLoadingFeed() {

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
            color:#94a3b8;
            "
        >
            Loading events...
        </div>
    `;

}

/* ==========================================
   AUTO REFRESH
========================================== */

function refreshSidebar() {

    if (
        !window.allEvents
    )
        return;

    renderSidebarEvents(
        window.allEvents
    );

}

/* ==========================================
   GLOBAL EXPORTS
========================================== */

window.renderSidebarEvents =
    renderSidebarEvents;

window.filterSidebarEvents =
    filterSidebarEvents;

window.filterByCategory =
    filterByCategory;

window.sortEventsByDate =
    sortEventsByDate;

window.sortEventsBySeverity =
    sortEventsBySeverity;

window.showLoadingFeed =
    showLoadingFeed;

window.refreshSidebar =
    refreshSidebar;
