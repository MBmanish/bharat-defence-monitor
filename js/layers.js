/* ==========================================
   BHARAT DEFENCE MONITOR
   LAYER ENGINE
========================================== */

const LayerManager = {

    activeLayers: {

        military: true,
        border: true,
        maritime: true,
        weather: true,
        infrastructure: true,
        cyber: true,
        strategic: true,
        transport: true

    },

    initialize() {

        this.attachLayerListeners();

        console.log(
            "Layer Manager Initialized"
        );

    },

    attachLayerListeners() {

        const layerIds = [

            "military",
            "border",
            "maritime",
            "weather",
            "infrastructure",
            "cyber",
            "strategic",
            "transport"

        ];

        layerIds.forEach(layerId => {

            const checkbox =
                document.getElementById(layerId);

            if (!checkbox)
                return;

            checkbox.addEventListener(
                "change",
                () => {

                    this.toggleLayer(
                        layerId,
                        checkbox.checked
                    );

                }
            );

        });

    },

    toggleLayer(
        layerName,
        enabled
    ) {

        this.activeLayers[layerName] =
            enabled;

        console.log(
            `${layerName} => ${enabled}`
        );

        this.refresh();

    },

    refresh() {

        if (
            typeof window.allEvents ===
            "undefined"
        ) {
            return;
        }

        refreshMap(
            window.allEvents
        );

        if (
            typeof renderSidebarEvents ===
            "function"
        ) {

            renderSidebarEvents(
                this.getVisibleEvents(
                    window.allEvents
                )
            );

        }

    },

    getVisibleEvents(events) {

        return events.filter(event => {

            const state =
                this.activeLayers[
                    event.category
                ];

            return state !== false;

        });

    },

    enableAllLayers() {

        Object.keys(
            this.activeLayers
        ).forEach(layer => {

            this.activeLayers[layer] =
                true;

            const checkbox =
                document.getElementById(
                    layer
                );

            if (checkbox) {

                checkbox.checked =
                    true;

            }

        });

        this.refresh();

    },

    disableAllLayers() {

        Object.keys(
            this.activeLayers
        ).forEach(layer => {

            this.activeLayers[layer] =
                false;

            const checkbox =
                document.getElementById(
                    layer
                );

            if (checkbox) {

                checkbox.checked =
                    false;

            }

        });

        this.refresh();

    },

    militaryOnly() {

        Object.keys(
            this.activeLayers
        ).forEach(layer => {

            const enabled =
                layer === "military";

            this.activeLayers[layer] =
                enabled;

            const checkbox =
                document.getElementById(
                    layer
                );

            if (checkbox) {

                checkbox.checked =
                    enabled;

            }

        });

        this.refresh();

    },

    borderFocus() {

        Object.keys(
            this.activeLayers
        ).forEach(layer => {

            const enabled =
                layer === "border" ||
                layer === "military";

            this.activeLayers[layer] =
                enabled;

            const checkbox =
                document.getElementById(
                    layer
                );

            if (checkbox) {

                checkbox.checked =
                    enabled;

            }

        });

        this.refresh();

    },

    maritimeFocus() {

        Object.keys(
            this.activeLayers
        ).forEach(layer => {

            const enabled =
                layer === "maritime";

            this.activeLayers[layer] =
                enabled;

            const checkbox =
                document.getElementById(
                    layer
                );

            if (checkbox) {

                checkbox.checked =
                    enabled;

            }

        });

        this.refresh();

    },

    getLayerCounts(events) {

        const counts = {};

        Object.keys(
            this.activeLayers
        ).forEach(layer => {

            counts[layer] =
                events.filter(
                    e =>
                        e.category ===
                        layer
                ).length;

        });

        return counts;

    },

    updateLayerCounters(events) {

        const counts =
            this.getLayerCounts(
                events
            );

        const mapping = {

            military:
                "military-layer-count",

            border:
                "border-layer-count",

            maritime:
                "maritime-layer-count",

            weather:
                "weather-layer-count",

            infrastructure:
                "infrastructure-layer-count",

            cyber:
                "cyber-layer-count",

            strategic:
                "strategic-layer-count",

            transport:
                "transport-layer-count"

        };

        Object.entries(
            mapping
        ).forEach(
            ([layer, id]) => {

                const element =
                    document.getElementById(
                        id
                    );

                if (
                    element &&
                    counts[layer] !==
                        undefined
                ) {

                    element.textContent =
                        counts[layer];

                }

            }
        );

    },

    applyTimeFilter(
        events,
        days
    ) {

        if (!days)
            return events;

        const cutoff =
            new Date();

        cutoff.setDate(
            cutoff.getDate() -
                days
        );

        return events.filter(
            event => {

                if (!event.date)
                    return true;

                return (
                    new Date(
                        event.date
                    ) >= cutoff
                );

            }
        );

    },

    applySeverityFilter(
        events,
        severity
    ) {

        if (
            !severity ||
            severity === "all"
        ) {

            return events;

        }

        return events.filter(
            e =>
                e.severity ===
                severity
        );

    }

};

/* ==========================================
   QUICK ACTIONS
========================================== */

function showMilitaryOnly() {

    LayerManager.militaryOnly();

}

function showBorderFocus() {

    LayerManager.borderFocus();

}

function showMaritimeFocus() {

    LayerManager.maritimeFocus();

}

function showAllLayers() {

    LayerManager.enableAllLayers();

}

/* ==========================================
   INITIALIZATION
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        LayerManager.initialize();

    }
);

/* ==========================================
   GLOBAL EXPORTS
========================================== */

window.LayerManager =
    LayerManager;

window.showMilitaryOnly =
    showMilitaryOnly;

window.showBorderFocus =
    showBorderFocus;

window.showMaritimeFocus =
    showMaritimeFocus;

window.showAllLayers =
    showAllLayers;
