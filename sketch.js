let data;

function preload() {
  // Carica i dati dal CSV
  data = loadTable("rivers-data.csv", "csv", "header");
}

// Definisci alcune variabili globali per colori e dimensioni
let bgColor = "#0f1638"; // Colore di sfondo dei cerchi
let textColor = "#040404"; // Colore del testo
let pageColor = "#ededed"; // Colore di sfondo della pagina

let circleSize = 250; // Dimensione dei cerchi principali (ingrandita)
let numAcross = 50; // Numero di pattern in orizzontale
let rez3 = 0.01; // Risoluzione del rumore
let len; // Lunghezza per il pattern di rumore

function setup() {
  // Crea un'area di disegno che riempie la finestra
  createCanvas(windowWidth, windowHeight);

  // Imposta il colore di sfondo della pagina
  background(pageColor);

  // Posizioni iniziali per disegnare i cerchi
  let xpos = 100 + circleSize / 2;
  let ypos = 100 + circleSize / 2;

  // Ciclo per disegnare un cerchio per ogni fiume nel dataset
  for (let i = 0; i < data.getRowCount(); i++) {
    let item = data.getObject()[i];

    // Chiama la funzione per disegnare i glyph (cerchi con pattern di rumore)
    drawGlyphs(xpos, ypos, circleSize, item);

    // Incrementa la posizione x per il cerchio successivo
    xpos += circleSize + 100; // Regola il distanziamento orizzontale

    // Se la posizione x supera la larghezza, passa alla riga successiva
    if (xpos > width - circleSize) {
      xpos = 100 + circleSize / 2;
      ypos += circleSize + 100; // Regola il distanziamento verticale
    }
  }
}

function drawGlyphs(x, y, size, data) {
  // Disegna il cerchio di sfondo
  fill('red');
  noStroke();
  ellipse(x, y, size, size);

  // Disegna il pattern di rumore all'interno del cerchio
  stroke(0, 200);
  strokeWeight(0.6);
  
  // Mantieni un margine di 40 per garantire che il pattern sia più piccolo dell'ellisse
  let margin = 0.4 * size; // Modifica questo valore per regolare il margine
  let smallSize = size - margin;
  
  let size1 = smallSize / numAcross; // Risoluzione del pattern ridotta
  len = size1 * 0.3;

  for (let xi = -smallSize / 2 + size1 / 2; xi < smallSize / 2; xi += size1) {
    for (let yi = -smallSize / 2 + size1 / 2; yi < smallSize / 2; yi += size1) {
      let oldX = x + xi;
      let oldY = y + yi;

      for (let i = 0; i < 20; i++) {
        let n3 = noise((oldX + 200) * rez3, (oldY + 200) * rez3) + 0.033; // Aggiunto offset per le funzioni di rumore
        let ang = map(n3, 0.3, 0.7, 0, PI * 2);
        
        let newX = cos(ang) * len + oldX;
        let newY = sin(ang) * len + oldY;
        line(oldX, oldY, newX, newY);
        oldX = newX;
        oldY = newY;
      }
    }
  }

  // Scrivi il nome del fiume sotto il cerchio
  fill(textColor);
  textAlign(CENTER, CENTER);
  textSize(14);
  textFont("Georgia");
  text(data.name, x, y + size / 2 + 50); // Posizione del nome del fiume
}
