var LEVEL;
var player;

var imageKing;
var imageLady;
var imagePlayer;
var imageRoom = [];
var imageWasted;
var knife;
var sound;
var imageKnifeBloody;
var currentObj = "Find a weapon";

let touchStartX, touchStartY;
const centerThreshold = 50; // px around center for "tap"

function touchStarted() {
  touchStartX = mouseX;
  touchStartY = mouseY;
  return false;
}

function touchEnded() {
  let dx = mouseX - touchStartX;
  let dy = mouseY - touchStartY;

  if (abs(dx) < 20 && abs(dy) < 20) {
    // Tap near center
    if (dist(mouseX, mouseY, width / 2, height / 2) < centerThreshold) {
      simulateKey(' ');
    }
  } else {
    // Swipe direction
    if (abs(dx) > abs(dy)) {
      simulateKey(dx > 0 ? 'ArrowRight' : 'ArrowLeft');
    } else {
      simulateKey(dy > 0 ? 'ArrowDown' : 'ArrowUp');
    }
  }
  return false;
}

function simulateKey(key) {
  let evt = new KeyboardEvent("keydown", {key});
  document.dispatchEvent(evt);
}

function preload() {
  imagePlayer = loadImage("KING.png");
  imageLady = loadImage("lady.png");
  imageKing = loadImage("kingSleepy.png");

  imageRoom.push(loadImage("room.png"));
  imageRoom.push(loadImage("room2.png"));
  imageRoom.push(loadImage("kitchen.png"));
  imageKnifeBloody = loadImage("knifeBlood.png");
  imageWasted = loadImage("wasted.png");
  sound = loadSound("owl.mp3");
}

function getRoom(index, index2) {
  var p1 = createVector(LEVEL.xs[index], LEVEL.ys[index]);
  var p2 = createVector(LEVEL.xs[index2], LEVEL.ys[index2]);
  return [p1, p2];
}

var finalTime;

function ENDSCREEN()
{
	//save end time to local storage as best
	var best = localStorage.getItem("macbest");
	if (best == null)
	{
		best = finalTime;
	}
	else
	{
		best = min(best, finalTime);
	}
	localStorage.setItem("macbest", best);

	//draw the end screen
	push();
	fill(100)
	stroke(0);
	rect(width/2 - 200, height / 2 - 200, 400, 400,10);
	textAlign(CENTER)
	textSize(50);
	fill(255)
	strokeWeight(2);
	
	text("You win!", width / 2, height / 2 - 100);
	textSize(30);
	var str = "Time: " + floor(finalTime/1000/60) + ":" + floor((finalTime/1000)%60)+":"+floor(finalTime%1000);
	text(str, width / 2, height / 2);
	text("Best time: " + floor(best/1000/60) + ":" + floor((best/1000)%60) + ":"+floor(best%1000), width / 2, height / 2 + 50);
	//text("Best time: " + best + " seconds", width / 2, height / 2 + 50);
	text("Press R to restart", width / 2, height / 2 + 100);

	//if R is pressed, reload the page
	if (keyIsDown(82)) {
		location.reload();
	}
	pop();

}
var DONEZO = false;

var backgrounds = [];
function setup() {
  createCanvas(windowWidth, windowHeight);
  LEVEL = new Level();

  //midpoint between [64] and [0]
  var playerStart = createVector(
    (LEVEL.xs[0] + LEVEL.xs[64]) / 2,
    (LEVEL.ys[0] + LEVEL.ys[64]) / 2
  );
  var kingStart = createVector(
    (LEVEL.xs[34] + LEVEL.xs[36]) / 2,
    (LEVEL.ys[34] + LEVEL.ys[36]) / 2
  );
  LEVEL.setPlayer(new Entity(playerStart.x, playerStart.y, 25));
  LEVEL.addEntity(new Entity(kingStart.x - 65 / 2, kingStart.y - 65 / 2, 65));
  LEVEL.entities[LEVEL.entities.length - 1].image = imageKing;
  LEVEL.entities[LEVEL.entities.length - 1].useImage = true;
  LEVEL.entities[LEVEL.entities.length - 1].isKing = true;

  LEVEL.addEntity(
    new Entity(playerStart.x - 65 / 2 - 60, playerStart.y - 65 / 2 - 30, 65)
  );
  LEVEL.entities[LEVEL.entities.length - 1].image = imageLady;
  LEVEL.entities[LEVEL.entities.length - 1].useImage = true;
  LEVEL.entities[LEVEL.entities.length - 1].isLady = true;

  LEVEL.player.image = imagePlayer;
  LEVEL.player.useImage = true;
  var b = random([0, 1, 2, 3, 4, 5]);
  var a = [
    imageRoom[0],
    imageRoom[1],
    imageRoom[2],
    imageRoom[0],
    imageRoom[1],
    imageRoom[2],
  ];
  LEVEL.addObstacle(new OBSTACLE(6, 4));
  if (b != 0) {
    var randomIndex = Math.floor(Math.random() * a.length);
    var randomElement = a[randomIndex];
    a.splice(randomIndex, 1);
    backgrounds.push(new BACKGROUND(6, 4, randomElement));
  }
  //backgrounds.push(new BACKGROUND(0,64,imageRoom[0]));
  LEVEL.addObstacle(new OBSTACLE(60, 58));
  if (b != 1) {
    var randomIndex = Math.floor(Math.random() * a.length);
    var randomElement = a[randomIndex];
    a.splice(randomIndex, 1);
    backgrounds.push(new BACKGROUND(60, 58, randomElement));
  }
  LEVEL.addObstacle(new OBSTACLE(44, 42));
  if (b != 2) {
    var randomIndex = Math.floor(Math.random() * a.length);
    var randomElement = a[randomIndex];
    a.splice(randomIndex, 1);
    backgrounds.push(new BACKGROUND(44, 42, randomElement));
  }

  LEVEL.addObstacle(new OBSTACLE(34, 36));

  LEVEL.addObstacle(new OBSTACLE(28, 30));
  if (b != 3) {
    //select random background from a and remove it from the array
    var randomIndex = Math.floor(Math.random() * a.length);
    var randomElement = a[randomIndex];
    a.splice(randomIndex, 1);
    backgrounds.push(new BACKGROUND(28, 30, randomElement));
  }
  LEVEL.addObstacle(new OBSTACLE(18, 16));
  if (b != 4) {
    var randomIndex = Math.floor(Math.random() * a.length);
    var randomElement = a[randomIndex];
    a.splice(randomIndex, 1);
    backgrounds.push(new BACKGROUND(18, 16, randomElement));
  }

  LEVEL.addObstacle(new OBSTACLE(50, 52));
  if (b != 5) {
    var randomIndex = Math.floor(Math.random() * a.length);
    var randomElement = a[randomIndex];
    a.splice(randomIndex, 1);
    backgrounds.push(new BACKGROUND(50, 52, randomElement));
  }

  switch (b) {
    case 0:
      knife = new Item(6, 4, 40);
      knife.image = loadImage("knife.png");
      knife.useImage = true;
      break;
    case 1:
      knife = new Item(60, 58, 40);
      knife.image = loadImage("knife.png");
      knife.useImage = true;
      break;
    case 2:
      knife = new Item(44, 42, 40);
      knife.image = loadImage("knife.png");
      knife.useImage = true;
      break;
    case 3:
      knife = new Item(28, 30, 40);
      knife.image = loadImage("knife.png");
      knife.useImage = true;
      break;
    case 4:
      knife = new Item(18, 16, 40);
      knife.image = loadImage("knife.png");
      knife.useImage = true;
      break;
    case 5:
      knife = new Item(50, 52, 40);
      knife.image = loadImage("knife.png");
      knife.useImage = true;
      break;
  }
}

function draw() {
  
  if (DONEZO)
	{
		background(0,10);
		ENDSCREEN();
		return;
	}else
	{
		background(255);
	}
  for (var i = 0; i < backgrounds.length; i++) {
    backgrounds[i].update();
  }
  knife.update();
  LEVEL.update();

  dialogUpdate();

  //get Seconds and minutes and milliseconds from millis
  var seconds = Math.floor((millis() / 1000) % 60);
  var minutes = Math.floor((millis() / (1000 * 60)) % 60);
  var hours = Math.floor((millis() / (1000 * 60 * 60)) % 24);
  push();
  textSize(30);
  fill(0);
  if (kingDead) {
    if (DONE2) {
      currentObj = "Return home";
	  if (LEVEL.player.x <LEVEL.xs[1]-LEVEL.player.size*2)
		{
			DONEZO = true;
			finalTime = millis();
		}
    } else if (DONE) {
      currentObj = "Return the evidence";
    } else {
      currentObj = "Return to Lady Macbeth";
	  
    }
  }
  text(
    "Current time: " +
      hours +
      ":" +
      minutes +
      ":" +
      seconds +
      ":" +
      floor(millis() % 1000) +
      "\nGoal: " +
      currentObj,
    10,
    30
  );


  pop();
}
