let data;

function preload() {
  data = loadTable("rivers-data.csv", "csv", "header");
}

let textColor = "#040404";
let pageColor = "#ededed";

let minCircleSize = 50; // Minimum circle size
let maxCircleSize = 300; // Maximum circle size
let numAcross = 30; 
let rez3 = 0.02; 
let len; 




function setup() {
  let totalCircles = data.getRowCount();
  
  // Calcola l'altezza totale del canvas
  let canvasHeight = Math.ceil(totalCircles / numAcross) * (maxCircleSize + 100) + 100; 
  createCanvas(windowWidth, canvasHeight);

  // Imposta il colore di sfondo
  background(pageColor);
  let xpos = 100;
  let ypos = 100;

  // Determina i valori minimo e massimo della lunghezza
  let minLength = Infinity;
  let maxLength = -Infinity;

  // Trova la lunghezza minima e massima
  for (let i = 0; i < totalCircles; i++) {
    let item = data.getObject()[i];
    let length = item.length;
    minLength = min(minLength, length);
    maxLength = max(maxLength, length);
  }

  // Disegna i cerchi in base alla lunghezza
  for (let i = 0; i < totalCircles; i++) {
    let item = data.getObject()[i];
    // Mappa la lunghezza del fiume alla dimensione del cerchio
    let circleSize = map(item.length, minLength, maxLength, minCircleSize, maxCircleSize);

    drawGlyphs(xpos + circleSize / 2, ypos + circleSize / 2, circleSize, item);

    xpos += circleSize + 100;

    // Controlla se è necessario passare alla riga successiva
    if (xpos > width - circleSize) {
      xpos = 100;
      ypos += maxCircleSize + 100; 
    }
  }
}


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
  len = size1 * 0.3;

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
  textAlign(CENTER, CENTER);
  textSize(14);
  textFont("Georgia");
  text(data.name, x, y + size / 2 + 27);
}

function windowResized() {
  let totalCircles = data.getRowCount();
  let canvasHeight = Math.ceil(totalCircles / numAcross) * (maxCircleSize + 100) + 100;
  resizeCanvas(windowWidth, canvasHeight);
  setup(); // Ripeti il setup per disegnare di nuovo i glyphs
}
