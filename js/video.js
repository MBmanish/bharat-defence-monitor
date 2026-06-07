/* ==========================================
   VIDEO CENTER
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const selector =
            document.getElementById(
                "videoSelector"
            );

        const player =
            document.getElementById(
                "defenceVideo"
            );

        if (
            !selector ||
            !player
        ) {
            return;
        }

        selector.addEventListener(
            "change",
            () => {

                const videoId =
                    selector.value;

                player.src =
                    `https://www.youtube.com/embed/${videoId}`;

            }
        );

    }
);
