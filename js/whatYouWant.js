let font;
let fSize; // font size
let msgLines = ["I WANT", "WHAT", "YOU WANT", "WHAT"]; // text to write
let lines = [];
let count = 0;
let mcount = 0;

function preload() {
    font = loadFont('Nunito-Light.ttf')
    img = loadImage('assets/Spot.png');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    fSize = windowWidth/10;
    textFont(font);
    textSize(fSize);
    for (let l = 0; l < msgLines.length; l++){
        var pts = font.textToPoints(msgLines[l], 0, 0, fSize, {
            sampleFactor: 0.08 + (1920-window.innerWidth)*0.0001, // increase for more points
            simplifyThreshold: 0.0 // increase to remove collinear points
        });
        lines.push(pts);
    }

    //stroke(255);
    //strokeWeight(8);

    largest = -10000;
    largesty = -10000;
    smallest = 10000;
    smallesty = 10000;

    for (let l = 0; l < lines.length; l++){
        for (let i = 0; i < lines[l].length; i++) {
            if (lines[l][i].x > largest){
                largest = lines[l][i].x;
            }
            if (lines[l][i].x < smallest){
                smallest = lines[l][i].x;
            }
            if (lines[l][i].y > largesty){
                largesty = lines[l][i].y;
            }
            if (lines[l][i].y < smallesty){
                smallesty = lines[l][i].y;
            }
            lines[l][i].color = [random(0,255), random(0,255), random(0,255)]
        }
    }

    letterWidth = largest-smallest;
    letterHeight = largesty-smallesty;
    
  }

  var mouseThreshold = window.innerHeight/3;
  var noiseSize = 800;
  var moveX = -window.innerWidth/10 + window.innerWidth/2;

  function draw() {
    var spacing = 20 + fSize;
    background(0);
    translate(moveX,-spacing-count);
    noStroke();
    var defSize = 0.02 * (window.innerWidth/1920);

    for (let r = 0; r < 5; r++){
        for (let l = 0; l < lines.length; l++){
            translate(0, spacing);

            var down = spacing*((r*4)+l)+100;

            for (let p = 0; p < lines[l].length; p++){
                push();

                var dist = 1-(easeInOutQuad(min(mouseThreshold, getDistanceBetweenPoints(mouseX-moveX, mouseY+spacing, lines[l][p].x - smallest - (letterWidth/2), lines[l][p].y - smallesty -  (letterHeight/2) + down - count))/mouseThreshold));
                var tNoiseX = ((noise(lines[l][p].x+(mcount/100))*noiseSize)-(noiseSize/2))*(defSize+(dist*(1-defSize)));
                var tNoiseY = ((noise(lines[l][p].y+(mcount/100))*noiseSize)-(noiseSize/2))*(defSize+(dist*(1-defSize)));
                
                if ((lines[l][p].y - smallesty -  (letterHeight/2) + down - count) < window.innerHeight+200 && (lines[l][p].y - smallesty -  (letterHeight/2) + down - count) > -100){

                    translate(lines[l][p].x - smallest - (letterWidth/2) + tNoiseX, lines[l][p].y - smallesty -  letterHeight/2 + tNoiseY);
                    fill(lerp(lines[l][p].color[0], 255, (1-dist)), lerp(lines[l][p].color[1], 255, (1-dist)), lerp(lines[l][p].color[2], 255, (1-dist)))
                    ellipse(0,0,4-(dist*2))
                }
                pop();
            }
        }
    }

    count+=1;
    mcount+=1;
    if (count == spacing*4){
        count = 0;
    }
  }

  function getDistanceBetweenPoints(x1,y1,x2,y2){
    let x = x1 - x2;
    let y = y1 - y2;
    return sqrt(x * x + y * y);
  }