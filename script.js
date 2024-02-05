document.addEventListener("DOMContentLoaded", function () {
    const audioInput = document.getElementById("audioInput");
    const audio = document.getElementById("audio");
    const equalizerTable = document.getElementById("equalizerTable");

    let audioContext;
    let analyser;

    function initializeAudio() {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        function updateEqualizer() {
            analyser.getByteFrequencyData(dataArray);
            if (equalizerTable) {
                const rowsCount = equalizerTable.rows.length;
                const colsCount = equalizerTable.rows[0].cells.length;

                for (let i = 0; i < rowsCount; i++) {
                    for (let j = 0; j < colsCount; j++) {
                        const index = i * colsCount + j;
                        const value = dataArray[index] / 3 + 2;

                        equalizerTable.rows[i].cells[j].style.backgroundColor =
                            value <= 50 ? "white" : "#b2ffb2";
                    }
                }
            }

            requestAnimationFrame(updateEqualizer);
        }

        audioInput.addEventListener("change", function (event) {
            const file = event.target.files[0];

            if (file) {
                audio.classList.remove("display-none");
                audioInput.classList.add("display-none");
                const objectURL = URL.createObjectURL(file);
                audio.src = objectURL;
                updateEqualizer();
            }
        });
    }

    document.addEventListener("click", initializeAudio);
});
