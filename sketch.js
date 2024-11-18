let data;

function preload() {
  data = loadTable("rivers-data.csv", "csv", "header");
}

let textColor = "#040404";
let pageColor = "#ededed";

let circleSize = 300;
let numAcross = 30; 
let rez3 = 0.02; 
let len; 

function setup() {
  // Crea una canvas che riempie la larghezza della finestra
  let totalCircles = data.getRowCount();
  let canvasHeight = Math.ceil(totalCircles / numAcross) * (circleSize + 100) + 100; // Calcola l'altezza totale
  createCanvas(windowWidth, canvasHeight);

  // Imposta il colore di sfondo
  background(pageColor);
  let xpos = 100 + circleSize / 2;
  let ypos = 100 + circleSize / 2;

  for (let i = 0; i < data.getRowCount(); i++) {
    let item = data.getObject()[i];
    drawGlyphs(xpos, ypos, circleSize, item);

    xpos += circleSize + 100;

    if (xpos > width - circleSize) {
      xpos = 100 + circleSize / 2;
      ypos += circleSize + 100; 
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
  let canvasHeight = Math.ceil(totalCircles / numAcross) * (circleSize + 100) + 100;
  resizeCanvas(windowWidth, canvasHeight);
  setup(); // Ripeti il setup per disegnare di nuovo i glyphs
}
