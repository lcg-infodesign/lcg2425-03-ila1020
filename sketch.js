let data; // Variabile per contenere i dati del dataset
let coloretesto = "#040404"; 


function preload() {
    data = loadTable("rivers-data.csv", "csv", "header"); // Carica il file CSV con i dati dei fiumi
}

// Dimensioni minime e massime dei cerchi
let minCircleSize = 50; 
let maxCircleSize = 170; 

// Numero di cerchi per riga
let numGlifiXriga = 4; 

// Inizializzazione dei valori minimi e massimi
let minTemp = Infinity; 
let maxTemp = -Infinity; 
let minLength = Infinity; 
let maxLength = -Infinity; 


function setup() {
    let totalCircles = data.getRowCount(); // Ottieni il numero totale di cerchi da disegnare

    // Calcolo dei valori minimi e massimi per lunghezza e temperatura
    for (let i = 0; i < totalCircles; i++) {
        let length = data.getNum(i, 'length'); 
        let min_temp = data.getNum(i, 'min_temp'); 
        let max_temp = data.getNum(i, 'max_temp'); 
    // min e max riportano rispettivamente il valore minimo e il valore massimo in un array di numeri
        minLength = min(minLength, length); // Aggiorna il valore minimo di lunghezza
        maxLength = max(maxLength, length); // Aggiorna il valore massimo di lunghezza
        minTemp = min(minTemp, min_temp); // Aggiorna il valore minimo di temperatura
        maxTemp = max(maxTemp, max_temp); // Aggiorna il valore massimo di temperatura
    }

    // Calcolo dell'altezza del canvas in base al numero di cerchi e alle loro dimensioni
    let canvasHeight = Math.ceil(totalCircles / numGlifiXriga) * (maxCircleSize + 100) + 60;
    createCanvas(windowWidth, canvasHeight); // Crea un canvas a larghezza piena

    background("#deb887"); // Imposta il colore di sfondo

    // Titolo
    fill(coloretesto); 
    textAlign(CENTER, CENTER); // Allinea il testo al centro
    textSize(32); 
    textFont("Georgia"); 
    text("Temperature e lunghezza dei fiumi del mondo", width / 2, 30); // Disegna il titolo

    drawCircles(totalCircles); // Disegna i cerchi
}

// Funzione per disegnare i cerchi
function drawCircles(totalCircles) {
    let ypos = 200; // Inizio verticale per il disegno dei cerchi

    for (let row = 0; row < Math.ceil(totalCircles / numGlifiXriga); row++) {
        let xpos = (width - (numGlifiXriga * (maxCircleSize + 100) - 100)) / 2; // Calcola la posizione orizzontale

        for (let col = 0; col < numGlifiXriga; col++) {
            let index = row * numGlifiXriga + col; // Calcola l'indice dell'elemento corrente
            if (index >= totalCircles) break; // Esci se tutti i cerchi sono stati disegnati

            let item = data.getObject()[index]; // Ottiene i dati per l'elemento corrente
            let circleSize = map(item.length, minLength, maxLength, minCircleSize, maxCircleSize); // Calcola la dimensione del cerchio
            drawglyphs(xpos + circleSize / 2, ypos + circleSize / 2, circleSize, item); // Disegna il glifo
            xpos += circleSize + 100; // Aggiorna la posizione orizzontale per il prossimo cerchio
        }

        ypos += maxCircleSize + 150; // Aggiorna la posizione verticale per la prossima riga di cerchi
    }
}

// Funzione per disegnare un glifo
function drawglyphs(x, y, size, data) {
    let colorForTemp = maptemperaturetocolor(data.max_temp); // Ottiene il colore in base alla temperatura massima
    let borderColorForMinTemp = maptemperaturetocolor(data.min_temp); // Ottiene il colore del bordo in base alla temperatura minima

    stroke(borderColorForMinTemp); 
    strokeWeight(map(size, minCircleSize, maxCircleSize, 4, 40)); // Calcola lo spessore del bordo
    fill(255); // Imposta il colore di riempimento
    ellipse(x, y, size, size); // Disegna il cerchio esterno

    fill(colorForTemp); 
    noStroke(); 
    ellipse(x, y, size, size); // Disegna il cerchio interno

    drawpattern(x, y, size); // Disegna il pattern all'interno del cerchio
    
    fill(coloretesto); 
    noStroke(); 
    textAlign(CENTER, CENTER); 
    textSize(12); 
    textFont("Georgia"); 
    text(data.name, x, y + size / 2 + 25); // Disegna il nome del fiume sotto il cerchio
}

// Funzione per mappare la temperatura a un colore
function maptemperaturetocolor(temp) {
    let normTemp = constrain(map(temp, minTemp, maxTemp, 0, 1), 0, 1); // Normalizza la temperatura
    let r = normTemp * 255; // Calcola il valore rosso
    let b = (1 - normTemp) * 255; // Calcola il valore blu
    return color(r, 0, b); // Restituisce il colore
}

// Funzione per disegnare il pattern all'interno del cerchio
function drawpattern(x, y, size) {
    let resolution = 0.03; 
    let len; 
    let numAcross01 = 6; 
    stroke(255);
    strokeWeight(0.7); 
    let margin = 0.4 * size; 
    let smallSize = size - margin; 
    let size1 = smallSize / numAcross01; 
    len = size1 * 0.4; 

    // Disegna linee all'interno del cerchio
    for (let xi = -smallSize / 2 + size1 / 2; xi < smallSize / 2; xi += size1) {
        for (let yi = -smallSize / 2 + size1 / 2; yi < smallSize / 2; yi += size1) {
            let oldX = x + xi;
            let oldY = y + yi;

            for (let i = 0; i < 20; i++) { 
                let n3 = noise((oldX + 100) * resolution, (oldY + 200) * resolution) + 0.033; // Genera rumore
                let ang = map(n3, 0.3, 0.7, 0, PI); // Mappa il rumore a un angolo
                
                let newX = cos(ang) * len + oldX; // Calcola la nuova posizione
                let newY = sin(ang) * len + oldY;

                line(oldX, oldY, newX, newY); // Disegna la linea
                oldX = newX; 
                oldY = newY; 
            }
        }
    }
}

