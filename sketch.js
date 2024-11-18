let rivers = [];
let glyphSize = 100;  
let spacing = 400;    // Aumentato per maggior spazio tra i glifi
let margin = 0;      
let titleFont;        
let legendFont;       
let continentData = {};

function preload() {
  rivers = loadTable('rivers-data.csv', 'csv', 'header');
}

function setup() {
  titleFont = loadFont('Sprat-Bold.otf');
  legendFont = loadFont('NoticiaText-Bold.ttf');  
  let container = createDiv();
  container.style('overflow-y', 'scroll');
  container.style('height', windowHeight + 'px'); 

  let cnv = createCanvas(windowWidth, windowHeight); 
  container.child(cnv);

  calculateContinentsData();
  noStroke();
  drawContent();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  drawContent();
}

function calculateContinentsData() {
  for (let i = 0; i < rivers.getRowCount(); i++) {
    let continent = rivers.getString(i, 'continent').toLowerCase();
    let length = rivers.getNum(i, 'length');
    
    if (!continentData[continent]) {
      continentData[continent] = { totalLength: 0, rivers: [] };
    }
    
    continentData[continent].totalLength += length;
    continentData[continent].rivers.push({
      name: rivers.getString(i, 'name'),
      length: length
    });
  }
}

function drawContent() {
  background(0);
  drawTitle();
  drawLegend();

  let continents = Object.keys(continentData);
  let cols = 1;  // Allinea i glifi in una sola colonna
  let rows = continents.length; 

  for (let i = 0; i < continents.length; i++) {
    let col = i % cols;  
    let row = floor(i / cols);  
    let x = width / 2;  // Centrare orizzontalmente
    let y = margin + 300 + row * spacing;  

    drawGlyph(x, y, continentData[continents[i]], continents[i].toUpperCase());
  }
}

function drawTitle() {
  fill(255);
  textSize(42);  
  textFont(titleFont);  
  textAlign(CENTER, CENTER);  
  text("Length of rivers by continent", width / 2, margin + 30);
}

function drawLegend() {
  // Implementa la tua funzione di legenda qui. Riferiti al codice esistente per la legenda.
}

function drawGlyph(x, y, continentInfo, continentName) {
  let rivers = continentInfo.rivers;
  let continentColor;

  switch (continentName.toLowerCase()) {
    case 'africa': continentColor = color(212, 236, 243); break;
    case 'asia': continentColor = color(34, 139, 34); break;
    case 'europe': continentColor = color(255, 165, 0); break;
    case 'north america': continentColor = color(0, 0, 255); break;
    case 'south america': continentColor = color(255, 20, 147); break;
    case 'australia': continentColor = color(255, 255, 0); break;
    case 'antarctica': continentColor = color(255, 0, 0); break;
    default: continentColor = color(150); break;
  }

  stroke(continentColor);
  strokeWeight(2);  // Aumentato lo spessore della linea
  noFill();

  for (let i = 0; i < rivers.length; i++) {
    let riverLength = rivers[i].length;
    let radius = map(riverLength, 0, 7000, 50, 300);  // Aumentato il valore massimo per i cerchi
    ellipse(x, y, radius * 2, radius * 2);
  }

  fill(255);
  noStroke();
  textSize(18);  // Aumentata la dimensione del testo per migliorare la leggibilità
  textAlign(CENTER, CENTER);
  text(continentName, x, y + 50);  // Spostato verso il basso per un migliore allineamento
}

