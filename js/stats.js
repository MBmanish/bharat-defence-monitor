/* ==========================================
   BHARAT DEFENCE MONITOR
   STATS ENGINE
========================================== */

const StatsManager = {

    stats: {

        military: 0,
        border: 0,
        maritime: 0,
        weather: 0,
        infrastructure: 0,
        cyber: 0,
        strategic: 0,
        transport: 0,

        total: 0,
        critical: 0,
        recent24h: 0

    },

    update(events) {

        if (!events)
            return;

        this.calculate(events);

        this.render();

    },

    calculate(events) {

        this.stats = {

            military: 0,
            border: 0,
            maritime: 0,
            weather: 0,
            infrastructure: 0,
            cyber: 0,
            strategic: 0,
            transport: 0,

            total: events.length,
            critical: 0,
            recent24h: 0

        };

        const now = new Date();

        events.forEach(event => {

            if (
                this.stats[
                    event.category
                ] !== undefined
            ) {

                this.stats[
                    event.category
                ]++;

            }

            if (
                event.severity ===
                "critical"
            ) {

                this.stats.critical++;

            }

            if (
                event.date
            ) {

                const eventDate =
                    new Date(
                        event.date
                    );

                const diffHours =
                    (
                        now -
                        eventDate
                    ) /
                    (
                        1000 *
                        60 *
                        60
                    );

                if (
                    diffHours <=
                    24
                ) {

                    this.stats
                        .recent24h++;

                }

            }

        });

    },

    render() {

        setValue(
            "military-count",
            this.stats.military
        );

        setValue(
            "border-count",
            this.stats.border
        );

        setValue(
            "maritime-count",
            this.stats.maritime
        );

        setValue(
            "weather-count",
            this.stats.weather
        );

        setValue(
            "infrastructure-count",
            this.stats.infrastructure
        );

        setValue(
            "cyber-count",
            this.stats.cyber
        );

        if (
            typeof LayerManager !==
            "undefined"
        ) {

            LayerManager.updateLayerCounters(
                window.allEvents || []
            );

        }

        updateHeaderTimestamp();

    }

};

/* ==========================================
   DOM HELPERS
========================================== */

function setValue(
    id,
    value
) {

    const el =
        document.getElementById(
            id
        );

    if (el) {

        el.textContent =
            value;

    }

}

/* ==========================================
   HEADER TIMESTAMP
========================================== */

function updateHeaderTimestamp() {

    const el =
        document.getElementById(
            "lastUpdated"
        );

    if (!el)
        return;

    const now =
        new Date();

    el.textContent =
        "Updated: " +
        now.toLocaleString(
            "en-IN"
        );

}

/* ==========================================
   EXTRA ANALYTICS
========================================== */

function getCriticalEvents(
    events
) {

    return events.filter(
        event =>
            event.severity ===
            "critical"
    );

}

function getRecentEvents(
    events,
    hours = 24
) {

    const cutoff =
        new Date();

    cutoff.setHours(
        cutoff.getHours() -
        hours
    );

    return events.filter(
        event => {

            if (
                !event.date
            ) {

                return false;

            }

            return (
                new Date(
                    event.date
                ) >= cutoff
            );

        }
    );

}

function getCategorySummary(
    events
) {

    const summary = {};

    events.forEach(event => {

        if (
            !summary[
                event.category
            ]
        ) {

            summary[
                event.category
            ] = 0;

        }

        summary[
            event.category
        ]++;

    });

    return summary;

}

/* ==========================================
   DASHBOARD HEALTH
========================================== */

function getDashboardHealth(
    events
) {

    const critical =
        getCriticalEvents(
            events
        ).length;

    if (
        critical >= 10
    ) {

        return "HIGH";

    }

    if (
        critical >= 5
    ) {

        return "ELEVATED";

    }

    return "NORMAL";

}

/* ==========================================
   REFRESH
========================================== */

function refreshStats() {

    if (
        !window.allEvents
    )
        return;

    StatsManager.update(
        window.allEvents
    );

}

/* ==========================================
   AUTO REFRESH TIMER
========================================== */

setInterval(
    () => {

        updateHeaderTimestamp();

    },
    60000
);

/* ==========================================
   GLOBAL EXPORTS
========================================== */

window.StatsManager =
    StatsManager;

window.refreshStats =
    refreshStats;

window.getCriticalEvents =
    getCriticalEvents;

window.getRecentEvents =
    getRecentEvents;

window.getCategorySummary =
    getCategorySummary;

window.getDashboardHealth =
    getDashboardHealth;
