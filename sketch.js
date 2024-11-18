let data;
//carico i dati dal dataset
function preload() {
    data = loadTable("rivers-data.csv", "csv", "header");
}



//VARIABILI VARIE
let textColor = "#040404";
let pageColor = "#deb887";


//DIMENSIONE CERCHIO
let minCircleSize = 50; // Dimensione minima del cerchio
let maxCircleSize = 170; // Dimensione massima del cerchio
let numAcross = 4; // Numero di glifi per riga

//PATTERN che cerca di assomigliare al percorso di un fiume
let rez3 = 0.02; 
let len; //lunghezza delle linee del "pattern" bianco








function setup() {
  
  let totalCircles = data.getRowCount(); //numero totale dei cerchi che corrisponde al numero totale dei fiumi nel dataset




  // altezza totale della canvas in base al numero di cerchi, considerando anche lo spazio tra il nome del fiume e il cerchio
  let canvasHeight = Math.ceil(totalCircles / numAcross) * (maxCircleSize + 100) + 60; // +60 per il titolo
  resizeCanvas(windowWidth, canvasHeight);
  
  

  background(pageColor);
  
  // TITOLO
  fill(textColor);
  textAlign(CENTER, CENTER);
  textSize(32);
  textFont("Georgia");
  text("Temperature e lunghezza dei fiumi del mondo ", width / 2, 30); 


  // distanza iniziale dal titolo
  let ypos = 200; // Inizia a disegnare i cerchi sotto il titolo






  // per tenere traccia delle lunghezze minime e massime dei cerchi che verranno disegnati. Infinity e -Infinity vengono utilizzati per garantire che qualsiasi valore di lunghezza trovato nel ciclo successivo possa aggiornare queste variabili.
  let minLength = Infinity;
  let maxLength = -Infinity;



//per ogni cerchio, viene estratto il dato sulla lunghezza dal dataset
  for (let i = 0; i < totalCircles; i++) {
      let length = data.getNum(i, 'length');
      minLength = min(minLength, length);
      maxLength = max(maxLength, length);
  }
//confronta la lunghezza corrente con minLength e maxLength per aggiornare le lunghezze minime e massime.




  // Numero di righe in base al numero totale dei cerchi e al fatto che in ogni riga ce ne possono essere solo 4
  for (let row = 0; row < Math.ceil(totalCircles / numAcross); row++) {
      let xpos = (width - (numAcross * maxCircleSize - 100)) / 2; // Centratura della riga

      


      for (let col = 0; col < numAcross; col++) {
          let index = row * numAcross + col;
          if (index >= totalCircles) break; // Ferma se non ci sono più cerchi

          let item = data.getObject()[index];
          let circleSize = map(item.length, minLength, maxLength, minCircleSize, maxCircleSize);

          drawGlyphs(xpos + circleSize / 2, ypos + circleSize / 2, circleSize, item);

          xpos += circleSize + 100; // Spostamento alla posizione del cerchio successivo
      }

      // Aumenta la distanza verticale tra le righe
      ypos += maxCircleSize + 150; // Scendi alla prossima riga (aumentato da 100 a 150)
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
    let len = size1 * 0.2;

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
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(12); // Dimensione del testo più piccola
    textFont("Georgia"); // Assicurati di usare un carattere che supporta il grassetto

    // Converti il nome del fiume in maiuscolo
    let riverName = data.name.toUpperCase();
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
    let lineHeight = 14; // Altezza della riga più piccola per avvicinare il testo
    for (let i = 0; i < lines.length; i++) {
        text(lines[i], x, y + size / 2 + 20 + i * lineHeight); // Distanza verticale ridotta
    }
}

