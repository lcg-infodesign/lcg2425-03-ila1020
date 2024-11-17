let rivers = [];
let glyphSize = 20;  // Dimensione base del glifo
let spacing = 300;    // Distanza tra i glifi
let margin = 50;      // Margine uguale per tutti i lati
let titleFont;        // font del titolo
let legendFont;       // font della legenda



function preload() {
  // Carica dati dal CSV
  rivers = loadTable('rivers-data.csv', 'csv', 'header');
  
  // FONT
  titleFont = loadFont('Sprat-Bold.otf');  // Sostituisci con il percorso al tuo font
  legendFont = loadFont('NoticiaText-Bold.ttf');  // Carica il font per la legenda (sostituisci con il percorso corretto)
  
}

function setup() {
  let container = createDiv();
  container.style('overflow-y', 'scroll');
  container.style('height', windowHeight + 'px'); // Altezza del contenitore uguale a quella della finestra

  // Crea il canvas e aggiungilo al contenitore
  let cnv = createCanvas(windowWidth, rivers.getRowCount() * spacing + margin * 2 + 300); // Altezza del canvas sufficientemente grande
  container.child(cnv);

  noStroke();
  drawContent();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  drawContent();
}

function drawContent() {
  background(0);

  // Calcola il numero di colonne e righe tenendo conto dei margini
  let cols = floor((width - 2 * margin) / spacing);  // Sottrae i margini dalla larghezza
  let rows = ceil(rivers.getRowCount() / cols);  // Calcola il numero di righe

  // Imposta lo sfondo
  background(0);

  drawTitle();
  drawLegend();

  // Disegna i glifi per ogni fiume
  for (let i = 0; i < rivers.getRowCount(); i++) {
    let col = i % cols;  // Indice di colonna
    let row = floor(i / cols);  // Indice di riga
    let x = margin + col * spacing;  // Aggiungi il margine
    let y = margin + 300 + row * spacing;  // Aggiorna il margine per i glifi
    drawGlyph(x, y, rivers.getRow(i));
  }
}

function drawTitle() {
  fill(255);  // Testo bianco
  textSize(42);  
  textFont(titleFont);  // Usa il font caricato
  textAlign(CENTER, CENTER);  
  text("Length of rivers in the world", width / 2, margin + 30);  // Aggiungi 30 per una distanza fissa dal margine
}

function drawLegend() {
  fill(255);  // Testo bianco
  textSize(14);  // Dimensione del testo
  textAlign(CENTER, TOP);
  textFont(legendFont);  // Imposta il font della legenda

  let continentNames = ['AFRICA', 'ASIA', 'EUROPE', 'NORTH AMERICA', 'SOUTH AMERICA', 'AUSTRALIA', 'ANTARCTICA'];
  let continentColors = [
    color(212, 236, 243),
    color(34,139,34),
    color(255,165,0),
    color(0,0,255),
    color(255,20,147),
    color(255,255,0),
    color(255,0,0)
  ];

  let legendY = margin + 120;  // Aumentare la distanza della legenda dal titolo
  let legendWidth = width - 2 * margin; // Larghezza totale disponibile per la legenda
  let itemSpacing = 80;  // Spazio tra i pallini
  let itemsPerRow = floor(legendWidth / (itemSpacing + 60)); // Calcola i pallini in base alla larghezza disponibile

  // Calcola il centro della legenda
  let legendXStart = (width - (itemsPerRow * (itemSpacing + 60) - itemSpacing)) / 2;

  // Disegna ogni colore associandogli il nome continente
  for (let i = 0; i < continentNames.length; i++) {
    let col = i % itemsPerRow; // Indice di colonna
    let row = floor(i / itemsPerRow); // Indice di riga
    let legendX = legendXStart + col * (itemSpacing + 60); // Calcola la posizione X per il pallino

    fill(continentColors[i]);
    ellipse(legendX, legendY + row * 30, 20, 20);  // Disegna un cerchio per il colore del continente

    fill(255); // Testo bianco per i nomi dei continenti
    text(continentNames[i], legendX, legendY + row * 30 + 20); // Aumenta il valore di y per distanziare
  }
}

function drawGlyph(x, y, data) {
  let name = data.getString('name');
  let length = data.getNum('length'); 

  let numPoints = Math.floor(length / 50);
  let distanceBetweenPoints = 1; 

  let continentColor;

  switch (data.getString('continent').toLowerCase()) {
    case 'africa': continentColor = color(212, 236, 243); break;
    case 'asia': continentColor = color(34,139,34); break;
    case 'europe': continentColor = color(255,165,0); break;
    case 'north america': continentColor = color(0,0,255); break;
    case 'south america': continentColor = color(255,20,147); break;
    case 'australia': continentColor = color(255,255,0); break;
    case 'antarctica': continentColor = color(255,0,0); break;
    default: continentColor = color(150); break;
  }

  stroke(continentColor);
  strokeWeight(2);
  noFill();  

  beginShape();
  for (let i = 0; i < numPoints; i++) {
    let angle = map(i, 0, numPoints, 0, TWO_PI * 4);
    let r = distanceBetweenPoints * i;

    let xOffset = r * cos(angle);
    let yOffset = r * sin(angle);

    curveVertex(x + xOffset, y + yOffset);
  }
  endShape();
  
  // Calcola la larghezza del testo per centrarlo
  let textWidthValue = textWidth(name); // Calcola la larghezza del testo
  fill(255); 
  noStroke();
  textSize(12);
  textAlign(CENTER, CENTER);
  // Modifica la posizione 'x' per centrare il testo sotto la spirale
  text(name, x, y + 25); // Sposta il testo 'y' sotto la spirale
}
