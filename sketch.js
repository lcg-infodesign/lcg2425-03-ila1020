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
      let xpos = (width - (numAcross * (maxCircleSize + 100) - 100)) / 2; // Centratura della riga

      
      
      for (let col = 0; col < numAcross; col++) {
          let index = row * numAcross + col;
          if (index >= totalCircles) break; // si ferma se non ci sono più cerchi


//recupero un elemento dalla struttura dati
          let item = data.getObject()[index];

          //la dimensione del cerchio viene calcolata il relazione ai valori di lunghezza del dataset
          let circleSize = map(item.length, minLength, maxLength, minCircleSize, maxCircleSize);

          //richiamo alla funzione per il disegno dei glifi nella posizione data
          drawGlyphs(xpos + circleSize / 2, ypos + circleSize / 2, circleSize, item);

          xpos += circleSize + 100; // Spostamento alla posizione del cerchio successivo
      }

      // Aumenta la distanza verticale tra le righe
      ypos += maxCircleSize + 150; // Scendi alla prossima riga (aumentato da 100 a 150)
  }
}




// Mappa la temperatura associata al colore
//in questo caso, a colori più sul blu sono associate temperature più basse, a colori più sul rosso  temperature più alte
function mapTemperatureToColor(temp) {
    let minTemp = 5;
    let maxTemp = 30;
    
    //il valore della temperatura viene mappato in un intervallo tra 0 e 1, senza che esca dagli estremi (constrain)
    let normTemp = constrain(map(temp, minTemp, maxTemp, 0, 1), 0, 1);
    
    let r = normTemp * 255; //colore temperatura più alta = rosso
    let g = 0; 
    let b = (1 - normTemp) * 255;//più bassa, blu
    
    return color(r, g, b);
}



// GLIFI

function drawGlyphs(x, y, size, data) {
    let colorForTemp = mapTemperatureToColor(data.max_temp); //per la temperatura più alta
    let borderColorForMinTemp = mapTemperatureToColor(data.min_temp); //per la temperatura più bassa

    // Disegna il bordo attorno al cerchio con spessore proporzionale
    stroke(borderColorForMinTemp);
    let borderThickness = map(size, minCircleSize, maxCircleSize, 4, 16); //variabilità del bordo
    strokeWeight(borderThickness);
    ellipse(x, y, size, size);

    //cerchio principale
    fill(colorForTemp);

    ellipse(x, y, size - borderThickness, size - borderThickness); // Riduci il cerchio principale in base allo spessore del bordo





    //pattern tipo fiume
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




    // nome del fiume sotto al cerchio
    fill(textColor);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(12); 
    textFont("Georgia"); 

    // nome in maiuscolo
    let riverName = data.name.toUpperCase();
    let maxLineWidth = size; // larghezza massima accettabile per una riga
    let words = riverName.split(' '); // il testo suddiviso in parole
    
    //un array per memorizzare le linee ed una variabile per costruire la riga corrente
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

