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
    let margin = 20; // Define a margin

    // Calculate total canvas height based on number of rows
    let canvasHeight = Math.ceil(totalCircles / numAcross) * (maxCircleSize + 100) + margin * 2; 
    createCanvas(windowWidth - margin * 2, canvasHeight);

    // Set background color
    background(pageColor);
    noLoop(); // Stop draw loop, we only need to draw once

    drawCircles(margin); // Pass margin to drawCircles
}

function drawCircles(margin) {
    let totalCircles = data.getRowCount();

    // Determine min and max lengths
    let minLength = Infinity;
    let maxLength = -Infinity;

    for (let i = 0; i < totalCircles; i++) {
        let item = data.getObject()[i];
        let length = item.length;
        minLength = min(minLength, length);
        maxLength = max(maxLength, length);
    }

    // Calculate starting position
    let totalWidth = (numAcross * (maxCircleSize + 100)) - 100; // Minus one margin to fit the last circle
    let startX = margin + (width - totalWidth) / 2; // Center the circles horizontally
    let xpos = startX; 
    let ypos = margin; // Initial y position should also have margin

    // Draw circles based on length
    for (let i = 0; i < totalCircles; i++) {
        let item = data.getObject()[i];
        // Map river length to circle size
        let circleSize = map(item.length, minLength, maxLength, minCircleSize, maxCircleSize);

        drawGlyphs(xpos + circleSize / 2, ypos + circleSize / 2, circleSize, item);

        xpos += circleSize + 100;

        // Move to the next row if needed
        if (xpos > width - circleSize - margin) {
            xpos = startX; // Reset to starting position
            ypos += maxCircleSize + 100; // Increment y position for new row
        }
    }
}

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

    // Draw the river name around the circle
    fill(textColor);
    textAlign(CENTER, CENTER);
    textSize(16);
    textFont("Georgia-Bold");
  
    let name = data.name.toUpperCase();
    let startAngle = PI; 
    let endAngle = startAngle + TWO_PI; 
    
    let letterSpacingFactor = 1.5; 
    for (let i = 0; i < name.length; i++) {
        let angle = map(i, 0, name.length * letterSpacingFactor, startAngle, endAngle);
        let letterX = x + cos(angle) * (size / 2 + 20); 
        let letterY = y + sin(angle) * (size / 2 + 20);
        let baselineOffset = 5; 
        letterY += baselineOffset;
  
        // Set text rotation
        push(); 
        translate(letterX, letterY); 
        rotate(angle + HALF_PI); 
        text(name.charAt(i), 0, 0); 
        pop(); 
    }
}

function windowResized() {
    setup(); // Re-setup the canvas to adjust for new window size
}

