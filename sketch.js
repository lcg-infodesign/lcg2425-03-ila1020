let textColor = "#040404";
let pageColor = "#a0a0a0"; // Modifica qui il colore di sfondo a un grigio più scuro

function preload() {
  data = loadTable("rivers-data.csv", "csv", "header");
}

let minCircleSize = 50; // Dimensione minima del cerchio
let maxCircleSize = 300; // Dimensione massima del cerchio
let numAcross = 30; 
let rez3 = 0.02; 
let len; 

function setup() {
  // Crea una canvas che riempie la larghezza della finestra
  let totalCircles = data.getRowCount();
  let canvasHeight = Math.ceil(totalCircles / numAcross) * (maxCircleSize + 150) + 8; // Aumenta lo spazio verticale
  createCanvas(windowWidth, canvasHeight);

  // Imposta il colore di sfondo
  background(pageColor);
  
  let xpos; // posizione x iniziale
  let ypos = 100;

  for (let i = 0; i < totalCircles; i++) {
    let item = data.getObject()[i];
    let circleSize = map(item.length, 650, 7000, minCircleSize, maxCircleSize); // Scala la dimensione

    // Calcola la posizione x per centrare la riga
    xpos = (width - (numAcross * (circleSize + 150) - 150)) / 2 + (circleSize + 150) * (i % numAcross);
    
    // Disegna il glifo centrato
    drawGlyphs(xpos + circleSize / 2, ypos + circleSize / 2, circleSize, item);

    if ((i + 1) % numAcross === 0) {
      ypos += maxCircleSize + 50; // Aumenta lo spazio verticale tra le righe
    }
  }
}

// Il resto del codice rimane invariato

// Mappatura della temperatura a colori
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
  fill(colorForTemp);
  noStroke();
  ellipse(x, y, size, size);

  stroke(255); 
  strokeWeight(0.9);
  
  let margin = 0.4 * size; 
  let smallSize = size - margin;

  let size1 = smallSize / numAcross;

  // Mappa la lunghezza del fiume a una lunghezza adatta per i pattern
  let lengthMapped = map(data.length, 650, 7000, 5, 50);
  len = lengthMapped * 0.3; // Regola questo moltiplicatore come necessario

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

  // Scrivi il nome del fiume sotto il cerchio
  fill(textColor);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(14);
  textFont("Georgia");
  textStyle(BOLD);
  text(data.name, x, y + size / 2 + 27); // Centra il testo rispetto al cerchio
}

