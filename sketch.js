
//Il colore del cerchio interno è relativo alla temperatura massima, 
//il contorno è relativo alla temperatura minima 
//la dimensione del cerchio è collegato con la dimensione del fiume in questione




let data; // Variabile per contenere i dati del dataset

// Carica i dati dal dataset
function preload() {
    data = loadTable("rivers-data.csv", "csv", "header"); 
}

// VARIABILI VARIE
let textColor = "#040404"; // Colore del testo
let pageColor = "#deb887"; // Colore dello sfondo della pagina

// DIMENSIONE CERCHIO
let minCircleSize = 50; // Dimensione minima del cerchio
let maxCircleSize = 170; // Dimensione massima del cerchio

let numAcross = 4; // Numero di glifi per riga (quanti cerchi per riga)





// proprietà della canvas
function setup() {
    let totalCircles = data.getRowCount(); // Numero totale dei cerchi che corrisponde al numero totale dei fiumi nel dataset

    // valori minimi e massimi
    let minLength = Infinity; // Inizializza la lunghezza minima a infinito
    let maxLength = -Infinity; // Inizializza la lunghezza massima a meno infinito
    let minTemp = Infinity; // Inizializza la temperatura minima a infinito
    let maxTemp = -Infinity; // Inizializza la temperatura massima a meno infinito

    // Calcola il valore minimo e massimo per lunghezze e temperature
    for (let i = 0; i < totalCircles; i++) {
        let length = data.getNum(i, 'length'); // Recupera la lunghezza del fiume dalla riga i
        let min_temp = data.getNum(i, 'min_temp'); // Recupera la temperatura minima dalla riga i
        let max_temp = data.getNum(i, 'max_temp'); // Recupera la temperatura massima dalla riga i
        
        // Aggiorna i valori minimi e massimi di lunghezza
        if (length < minLength) minLength = length;
        if (length > maxLength) maxLength = length;

        // Aggiorna i valori minimi e massimi di temperatura
        if (min_temp < minTemp) minTemp = min_temp;
        if (max_temp > maxTemp) maxTemp = max_temp;
    }



    // Calcola l'altezza totale della canvas in base al numero di cerchi, considerando anche lo spazio tra il nome del fiume e il cerchio
    let canvasHeight = Math.ceil(totalCircles / numAcross) * (maxCircleSize + 100) + 60; // +60 per il titolo
    resizeCanvas(windowWidth, canvasHeight); // Regola la dimensione della canvas

    background(pageColor);
    
    // titolo
    fill(textColor); 
    textAlign(CENTER, CENTER); 
    textSize(32); 
    textFont("Georgia"); 
    text("Temperature e lunghezza dei fiumi del mondo ", width / 2, 30); 

    let ypos = 200; // Inizia a disegnare i cerchi sotto il titolo

    // Disegna i cerchi sulla canvas organizzati in righe
    for (let row = 0; row < Math.floor(totalCircles / numAcross); row++) {
        let xpos = (width - (numAcross * (maxCircleSize + 100) - 100)) / 2; // Centratura della riga

        for (let col = 0; col < numAcross; col++) {
            let index = row * numAcross + col; // Calcola l'indice dell'elemento nel dataset
            if (index >= totalCircles) break; // Si ferma se non ci sono più cerchi

            // Recupera un elemento dalla struttura dati
            let item = data.getObject()[index];

            // Calcola la dimensione del cerchio in base alla lunghezza del fiume
            let circleSize = map(item.length, minLength, maxLength, minCircleSize, maxCircleSize);

            // Disegna i glifi nella posizione data
            drawglyphs(xpos + circleSize / 2, ypos + circleSize / 2, circleSize, item); 

            xpos += circleSize + 100; // Sposta alla posizione del cerchio successivo
        }

        // Aumenta la distanza verticale tra le righe
        ypos += maxCircleSize + 150; // Scende alla prossima riga (aumentato da 100 a 150)
    }
}

// Mappa la temperatura a un colore
function mapTemperatureToColor(temp) {
    let minTemp = 5; // Valore minimo per la temperatura
    let maxTemp = 30; // Valore massimo per la temperatura
    
    // Normalizza il valore della temperatura tra 0 e 1 usando constrain
    let normTemp = constrain(map(temp, minTemp, maxTemp, 0, 1), 0, 1);
    
    let r = normTemp * 255; // Colore temperatura più alta = rosso
    let g = 0; // Verde impostato a 0 per transizione lineare
    let b = (1 - normTemp) * 255; // Colore temperatura più bassa = blu
    
    return color(r, g, b); // Restituisce il colore finale
}

// PATTERN che cerca di assomigliare al percorso di un fiume
let rez3 = 0.04; // Risoluzione del noise per generare il pattern
let len; // Lunghezza delle linee del "pattern" bianco (dei fiumi)
let numAcross01 = 6; // Numero di sezioni per il pattern


function drawglyphs(x, y, size, data) {
    // Colori basati sulla temperatura
    let colorForTemp = mapTemperatureToColor(data.max_temp); // Colore per la temperatura più alta
    let borderColorForMinTemp = mapTemperatureToColor(data.min_temp); // Colore per la temperatura più bassa

    // Disegna il bordo attorno al cerchio con spessore proporzionale alla dimensione del cerchio
    stroke(borderColorForMinTemp); // Colore del bordo
    let borderThickness = map(size, minCircleSize, maxCircleSize, 4, 40); // Variabilità dello spessore del bordo
    strokeWeight(borderThickness); // Imposta lo spessore del bordo
    
    fill("255");
    ellipse(x, y, size, size); 

    // Disegna il cerchio principale all'interno (stesso diametro del cerchio esterno)
    fill(colorForTemp); // Colore per il cerchio principale
    noStroke(); // Nessun bordo per il cerchio interno
    ellipse(x, y, size, size); // Disegna cerchio allo stesso diametro

    
    stroke(255);
    strokeWeight(0.7); // Spessore delle linee del pattern
    let margin = 0.4 * size; // Margine che determina quanto il pattern "esce" dal bordo del cerchio
    let smallSize = size - margin; // Dimensioni del pattern
    let size1 = smallSize / numAcross01; // Il pattern totale diviso in sezioni
    len = size1 * 0.4; // Lunghezza delle linee del "pattern"

    // Disegna il pattern tipo fiume
    for (let xi = -smallSize / 2 + size1 / 2; xi < smallSize / 2; xi += size1) {
        for (let yi = -smallSize / 2 + size1 / 2; yi < smallSize / 2; yi += size1) {
            // Coordinate iniziali oldX e oldY per la posizione corrente del fiume
            let oldX = x + xi;
            let oldY = y + yi;

            // Funzione per generare un valore n3 che dipende dalla posizione corrente (oldX, oldY)
            for (let i = 0; i < 20; i++) { // Ciclo per generare il pattern
                let n3 = noise((oldX + 100) * rez3, (oldY + 200) * rez3) + 0.033; // Calcolo del rumore 
                let ang = map(n3, 0.3, 0.7, 0, PI); // Converte il valore di rumore in un angolo
                
                // Calcola il nuovo punto utilizzando coseno e seno del valore ang, spostandosi di len
                let newX = cos(ang) * len + oldX;
                let newY = sin(ang) * len + oldY;

                line(oldX, oldY, newX, newY); // Disegna la linea dal vecchio punto al nuovo
                oldX = newX; // Aggiorna il vecchio punto
                oldY = newY; // Aggiorna il vecchio punto
            }
        }
    }

    //testo
    fill(textColor); 
    noStroke(); 
    textAlign(CENTER, CENTER); 
    textSize(12); 
    textFont("Georgia"); 
    text(data.name, x, y + size / 2 + 25); 
}
