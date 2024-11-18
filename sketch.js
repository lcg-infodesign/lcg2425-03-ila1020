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
  
  // Calculate total canvas height
  let canvasHeight = Math.ceil(totalCircles / numAcross) * (maxCircleSize + 100) + 100; 
  createCanvas(windowWidth, canvasHeight);

  // Set background color
  background(pageColor);
  let xpos = 100;
  let ypos = 100;

  // Determine min and max lengths
  let minLength = Infinity;
  let maxLength = -Infinity;

  for (let i = 0; i < totalCircles; i++) {
    let item = data.getObject()[i];
    let length = item.length;
    minLength = min(minLength, length);
    maxLength = max(maxLength, length);
  }

  // Draw circles based on length
  for (let i = 0; i < totalCircles; i++) {
    let item = data.getObject()[i];
    // Map river length to circle size
    let circleSize = map(item.length, minLength, maxLength, minCircleSize, maxCircleSize);

    drawGlyphs(xpos + circleSize / 2, ypos + circleSize / 2, circleSize, item);

    xpos += circleSize + 100;

    // Move to the next row if needed
    if (xpos > width - circleSize) {
      xpos = 100;
      ypos += maxCircleSize + 100; 
    }
  }
}

// Map temperature to color
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
  
  // Draw the main circle
  fill(colorForTemp);
  ellipse(x, y, size, size);

  // Draw the border around the circle
  stroke(borderColorForMinTemp);
  strokeWeight(20); // Adjust border thickness as necessary
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

  // Write the river name under the circle
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
  setup(); // Redraw glyphs on window resize
}
