let data;

function preload() {
    data = loadTable("rivers-data.csv", "csv", "header");
}

let textColor = "#040404";
let pageColor = "#ededed";

let minCircleSize = 50; // Minimum circle size
let maxCircleSize = 300; // Maximum circle size
let numAcross = 5; // Number of glyphs across a row
let rez3 = 0.02; 
let len; 

function setup() {
    let totalCircles = data.getRowCount();

    // Calculate total canvas height based on number of circles and their arrangement
    let canvasHeight = Math.ceil(totalCircles / numAcross) * (maxCircleSize + 100) + 100; 
    resizeCanvas(windowWidth, canvasHeight);
    
    // Set the background color
    background(pageColor);
    
    // Position start variables
    let ypos = 100;

    // Find min and max lengths for scaling
    let minLength = Infinity;
    let maxLength = -Infinity;

    for (let i = 0; i < totalCircles; i++) {
        let length = data.getNum(i, 'length');
        minLength = min(minLength, length);
        maxLength = max(maxLength, length);
    }

    // Draw circles based on the length
    for (let row = 0; row < Math.ceil(totalCircles / numAcross); row++) {
        let xpos = (width - (numAcross * (minCircleSize + 100) - 100)) / 2; // Centering

        for (let col = 0; col < numAcross; col++) {
            let index = row * numAcross + col;
            if (index >= totalCircles) break; // Stop if there are no more circles

            let item = data.getObject()[index];
            let circleSize = map(item.length, minLength, maxLength, minCircleSize, maxCircleSize);

            drawGlyphs(xpos + circleSize / 2, ypos + circleSize / 2, circleSize, item);

            xpos += circleSize + 100; // Move to next circle position
        }

        ypos += maxCircleSize + 100; // Move down to next row
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
    strokeWeight(20);
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

