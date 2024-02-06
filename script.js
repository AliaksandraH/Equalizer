document.addEventListener("DOMContentLoaded", function () {
    const audioInput = document.getElementById("audioInput");
    const audio = document.getElementById("audio");
    const nameFile = document.getElementById("nameFile");
    const rows = 100;
    const cols = 100;
    let audioContext;
    let source;
    let analyser;
    let dataArray;

    let equalizerTable = document.createElement("table");
    equalizerTable.id = "equalizerTable";
    for (let i = 0; i < rows; i++) {
        let row = document.createElement("tr");
        for (let j = 0; j < cols; j++) {
            let cell = document.createElement("td");
            row.appendChild(cell);
        }
        equalizerTable.appendChild(row);
    }
    document.body.append(equalizerTable);

    function initializeAudio() {
        if (!audioContext) {
            audioContext = new AudioContext();
        }
        if (!source) {
            source = audioContext.createMediaElementSource(audio);
        }
        analyser = audioContext.createAnalyser();
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        analyser.fftSize = 256;
        dataArray = new Uint8Array(analyser.frequencyBinCount);
    }

    function updateEqualizer() {
        analyser.getByteFrequencyData(dataArray);
        if (equalizerTable) {
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    equalizerTable.rows[i].cells[j].style.backgroundColor =
                        "rgba(0, 0, 0, 0)";
                }
            }

            for (let i = 0; i < cols; i++) {
                const height = Math.round((dataArray[i] / 256) * rows);
                for (let j = 0; j < height; j++) {
                    equalizerTable.rows[j].cells[i].style.backgroundColor =
                        "#db0b9d";
                }
            }
        }

        requestAnimationFrame(updateEqualizer);
    }

    audioInput.addEventListener("change", function (event) {
        const file = event.target.files[0];

        if (file) {
            nameFile.innerHTML = file.name;
            const objectURL = URL.createObjectURL(file);
            audio.src = objectURL;
            updateEqualizer();
        }
    });

    audioInput.addEventListener("click", initializeAudio, { once: true });
});
