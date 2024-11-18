let data;

function preload() {
    data = loadTable("rivers-data.csv", "csv", "header");
}

let textColor = "#040404";
let pageColor = "#ededed";

let minCircleSize = 50; // Dimensione minima del cerchio
let maxCircleSize = 170; // Dimensione massima del cerchio
let numAcross = 3; // Numero di glifi per riga
let rez3 = 0.02; 
let len; 

function setup() {
    let totalCircles = data.getRowCount();

    // Calcolare l'altezza totale della canvas in base al numero di cerchi
    let canvasHeight = Math.ceil(totalCircles / numAcross) * (maxCircleSize + 100);
    resizeCanvas(windowWidth, canvasHeight);
    
    // Imposta il colore di sfondo
    background(pageColor);
    
    // Le variabili per la posizione iniziale
    let ypos = 100;

    // Trova le lunghezze minime e massime per lo scaling
    let minLength = Infinity;
    let maxLength = -Infinity;

    for (let i = 0; i < totalCircles; i++) {
        let length = data.getNum(i, 'length');
        minLength = min(minLength, length);
        maxLength = max(maxLength, length);
    }

    // Disegna cerchi in base alla lunghezza
    for (let row = 0; row < Math.ceil(totalCircles / numAcross); row++) {
        let xpos = (width - (numAcross * (maxCircleSize + 100) - 100)) / 2; // Centratura della riga

        for (let col = 0; col < numAcross; col++) {
            let index = row * numAcross + col;
            if (index >= totalCircles) break; // Ferma se non ci sono più cerchi

            let item = data.getObject()[index];
            let circleSize = map(item.length, minLength, maxLength, minCircleSize, maxCircleSize);

            drawGlyphs(xpos + circleSize / 2, ypos + circleSize / 2, circleSize, item);

            xpos += circleSize + 100; // Spostamento alla posizione del cerchio successivo
        }

        ypos += maxCircleSize + 100; // Scendi alla prossima riga
    }
}

// Mappa la temperatura e colore
function mapTemperatureToColor(temp) {
    let minTemp = 5;
    let maxTemp = 30;
    
    let normTemp = constrain(map(temp, minTemp, maxTemp, 0, 1), 0, 1);
    
    let r = normTemp * 255;
    let g = 0; 
    let b = (1 - normTemp) * 255;
    
    return color(r, g, b);
}

function drawGlyphs(x, y, size, data) {
  let colorForTemp = mapTemperatureToColor(data.max_temp);
  let borderColorForMinTemp = mapTemperatureToColor(data.min_temp);

  // Disegna il bordo attorno al cerchio con spessore proporzionale
  stroke(borderColorForMinTemp);
  let borderThickness = map(size, minCircleSize, maxCircleSize, 4, 16); // Esempio di variabilità del bordo
  strokeWeight(borderThickness);
  ellipse(x, y, size, size);

  // Disegna il cerchio principale
  fill(colorForTemp);
  strokeWeight(0); // Assicurati che il cerchio principale non abbia contorni
  ellipse(x, y, size - borderThickness, size - borderThickness); // Riduci il cerchio principale in base allo spessore del bordo

  stroke(255); 
  strokeWeight(0.9);
  
  let margin = 0.4 * size; 
  let smallSize = size - margin;
  
  let size1 = smallSize / numAcross;
  let len = size1 * 0.3;

  for (let xi = -smallSize / 2 + size1 / 2; xi < smallSize / 2; xi += size1) {
      for (let yi = -smallSize / 2 + size1 / 2; yi < smallSize / 2; yi += size1) {
          let oldX = x + xi;
          let oldY = y + yi;

          for (let i = 0; i < 20; i++) {
              let n3 = noise((oldX + 200) * rez3, (oldY + 200) * rez3) + 0.033;
              let ang = map(n3, 0.3, 0.7, 0, PI * 2);
              
              let newX = cos(ang) * len + oldX;
              let newY = sin(ang) * len + oldY;
              line(oldX, oldY, newX, newY);
              oldX = newX;
              oldY = newY;
          }
      }
  }

  // Scrivere il nome del fiume sotto al cerchio
  fill(textColor);
  textAlign(CENTER, CENTER);
  textSize(14);
  textFont("Georgia");

  // Gestione del testo per disporlo su due righe
  let riverName = data.name;
  let maxLineWidth = size; // Imposta la larghezza massima accettabile per una riga
  let words = riverName.split(' '); // Suddividi il testo in parole
  let lines = [];
  let currentLine = '';

  for (let word of words) {
      let testLine = currentLine + (currentLine.length > 0 ? ' ' : '') + word;
      let testWidth = textWidth(testLine);
      if (testWidth > maxLineWidth) {
          lines.push(currentLine);
          currentLine = word;
      } else {
          currentLine = testLine;
      }
  }
  lines.push(currentLine); // Aggiungi l'ultima linea

  // Disegna il testo a più righe
  let lineHeight = 18; // Altezza della riga
  for (let i = 0; i < lines.length; i++) {
      text(lines[i], x, y + size / 2 + 27 + i * lineHeight);
  }
}
