var margins = 30;
var showDialog = false;
var hasKnife = false;
var kingDead = false;
var DONE = false;
var DONE2 = false;
var d;
var l;

function dialogUpdate() {
  var txt =
    "Give me the daggers. The sleeping and the dead\n Are but as pictures. ’Tis the eye of childhood\nThat fears a painted devil. If he do bleed,\nI’ll gild the faces of the grooms withal,\nFor it must seem their guilt.";

  if (showDialog) {
	
    push();
    fill(0, 200);
    stroke("crimson");
    strokeWeight(3);

    rect(width / 3, height / 5, width / 2.5, height / 4.5);
    textSize(20);
    textAlign(CENTER);
    fill(255);
    noStroke();
    text(
      txt,
      width / 3 + 10,
      height / 5 + 10,
      width / 2.5 - 20,
      height / 3 - 20
    );
    pop();
	
	

    if (keyCode === 32 || LEVEL.player.movement == "select") {
      showDialog = false;
      LEVEL.player.movement = "none"
    }
  }
}

class Item {
  constructor(index1, index2, gabbaGhoul) {
    var room = getRoom(index1, index2);
    this.x = room[0].x;
    this.y = room[0].y;
    this.sizeX = room[1].x - room[0].x;
    this.sizeY = room[1].y - room[0].y;
    this.image;
    this.useImage = false;
    this.color = random(cssColors);
    this.stroke = 0;
    this.selected = false;
  }
  getDistance(x, y) {
    return dist(this.x + this.sizeX / 2, this.y + this.sizeY / 2, x, y);
  }
  update() {
    push();
    if (!this.useImage) {
      fill(this.color);
      stroke(this.stroke);
      square(this.x, this.y, this.size);
    } else {
      if (!this.selected) {
        image(
          this.image,
          this.x - 5,
          this.y - 5,
          this.sizeX + 5,
          this.sizeY + 5
        );
      } else{
		if (!DONE2){
        image(
          this.image,
          LEVEL.player.x - this.sizeX,
          LEVEL.player.y - this.sizeY,
          this.sizeX + 5,
          this.sizeY + 5
        );
	}else
	{
		
		image(
		  this.image,
		  l[0].x,
		  l[0].y,
		  l[1].x - l[0].x,
		  l[1].y - l[0].y
		);
	}
      }
    }

    if (this.getDistance(LEVEL.player.x, LEVEL.player.y) < 50) {
      stroke(0, 200);
      strokeWeight(5);
      noFill();
      circle(this.x + this.sizeX / 2, this.y + this.sizeY / 2, this.sizeX + 10);

      if (keyIsDown(32) || LEVEL.player.movement == "select") {
        LEVEL.player.movement = "none"
        this.selected = true;
        hasKnife = true;
        LEVEL.entities[0].isSelectable = true;
      }
    }
    pop();
  }
}

class Entity {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.isPlayer = false;
    this.image;
    this.useImage = false;
    this.color = random(cssColors);
    this.stroke = 0;
    this.selected = false;
    this.speed = 5;
    this.isKing = false;
    this.isLady = false;
    this.isSelectable = false;
    this.hasKnife = false;

    this.movement = "none";
  }
  getDistance(x, y) {
    return dist(this.x, this.y, x, y);
  }
  update() {
    push();
    if (!this.useImage) {
      fill(this.color);
      stroke(this.stroke);
      square(this.x, this.y, this.size);
    } else {
      image(this.image, this.x - 5, this.y - 5, this.size + 5, this.size + 5);
    }
    //check collision and movement, collideLineRect()

    //support mobile swipe movement and tap is space
   

    

    if (true) {
      if (this.isPlayer) {
        if (keyIsDown(LEFT_ARROW) || LEVEL.player.movement === "left") {
          //check collision with lines xs ys
          let collision = false;
          for (let i = 0; i < LEVEL.xs.length; i++) {
            if (
              collideLineRect(
                LEVEL.xs[i],
                LEVEL.ys[i],
                LEVEL.xs[(i + 1) % LEVEL.xs.length],
                LEVEL.ys[(i + 1) % LEVEL.xs.length],
                this.x - this.speed,
                this.y,
                this.size,
                this.size
              )
            ) {
              collision = true;
              break;
            }
          }
          if (!collision) {
            this.x -= this.speed;
          }
        }
        if (keyIsDown(RIGHT_ARROW) || LEVEL.player.movement === "right") {
          let collision = false;
          for (let i = 0; i < LEVEL.xs.length; i++) {
            if (
              collideLineRect(
                LEVEL.xs[i],
                LEVEL.ys[i],
                LEVEL.xs[(i + 1) % LEVEL.xs.length],
                LEVEL.ys[(i + 1) % LEVEL.xs.length],
                this.x + this.speed,
                this.y,
                this.size,
                this.size
              )
            ) {
              collision = true;
              break;
            }
          }
          if (!collision) {
            this.x += this.speed;
          }
        }
        if (keyIsDown(UP_ARROW) || LEVEL.player.movement === "up") {
          let collision = false;
          for (let i = 0; i < LEVEL.xs.length; i++) {
            if (
              collideLineRect(
                LEVEL.xs[i],
                LEVEL.ys[i],
                LEVEL.xs[(i + 1) % LEVEL.xs.length],
                LEVEL.ys[(i + 1) % LEVEL.xs.length],
                this.x,
                this.y - this.speed,
                this.size,
                this.size
              )
            ) {
              collision = true;
              break;
            }
          }
          if (!collision) {
            this.y -= this.speed;
          }
        }
        if (keyIsDown(DOWN_ARROW) || LEVEL.player.movement === "down") {
          let collision = false;
          for (let i = 0; i < LEVEL.xs.length; i++) {
            if (
              collideLineRect(
                LEVEL.xs[i],
                LEVEL.ys[i],
                LEVEL.xs[(i + 1) % LEVEL.xs.length],
                LEVEL.ys[(i + 1) % LEVEL.xs.length],
                this.x,
                this.y + this.speed,
                this.size,
                this.size
              )
            ) {
              collision = true;
              break;
            }
          }
          if (!collision) {
            this.y += this.speed;
          }
        }
      }
    }

    if (
      (this.isKing && hasKnife && !kingDead) ||
      (this.isLady && hasKnife && kingDead && !DONE) 
    ) {
      //console.log(this.getDistance(LEVEL.player.x, LEVEL.player.y));

      if (this.getDistance(LEVEL.player.x, LEVEL.player.y) < this.size) {
        stroke(0, 200);
        strokeWeight(5);
        noFill();
        circle(this.x + this.size / 2, this.y + this.size / 2, this.size);

        if (keyCode === 32 || LEVEL.player.movement == "select") {
          keyCode = NaN;
          this.selected = true;
          LEVEL.player.movement = "none"
          if (!kingDead) {
            kingDead = true;
            sound.play();
            knife.image = imageKnifeBloody;
          } else if (!DONE){
            
            LEVEL.player.image = imageLady;
            LEVEL.entities[1].image = imagePlayer;
            
            DONE = true;
			
			//wait for 2 seconds before showing dialog
			setTimeout(() => {
			  showDialog = true;
			}, 500);
			setTimeout(() => {
				keyCode = NaN;
        //LEVEL.player.movement = "none";
			  }, 400);
			keyCode = NaN;
			
          }
        }
      }
    }else if (DONE && !DONE2) 
		{
			l = getRoom(34, 36);
			if (collidePointRect(LEVEL.player.x,LEVEL.player.y,
				l[0].x,
				l[0].y,
				l[1].x - l[0].x,
				l[1].y - l[0].y) && (keyCode === 32||LEVEL.player.movement == "select")) {
				DONE2 = true;

				}

		}

    pop();
  }
}

class BACKGROUND {
  constructor(index1, index2, image) {
    var room = getRoom(index1, index2);
    this.x = room[0].x;
    this.y = room[0].y;
    this.sizeX = room[1].x - room[0].x;
    this.sizeY = room[1].y - room[0].y;
    this.image = image;
  }

  update() {
    image(this.image, this.x, this.y, this.sizeX, this.sizeY);
  }
}

class OBSTACLE {
  constructor(index1, index2) {
    var room = getRoom(index1, index2);
    this.x = room[0].x;
    this.y = room[0].y;
    this.sizeX = room[1].x - room[0].x;
    this.sizeY = room[1].y - room[0].y;
    this.hidden = false;
    this.color = 0;
    this.stroke = 255;
  }

  update() {
    if (this.hidden) return;

    push();

    fill(this.color);
    stroke(this.stroke);
    rect(this.x, this.y, this.sizeX, this.sizeY);

    pop();
  }
}

class Level {
  constructor() {
    this.entities = [];
    this.objects = [];
    this.player;
    this.xs = [
      387, 563, 563, 783, 783, 640, 640, 737, 737, 785, 785, 1040, 1040, 963,
      963, 1014, 1014, 915, 915, 933, 933, 813, 813, 921, 921, 1008, 1008, 982,
      982, 1105, 1105, 1045, 1045, 1148, 1148, 1265, 1265, 1145, 1145, 920, 920,
      962, 962, 827, 827, 880, 880, 714, 714, 778, 778, 865, 865, 775, 775, 719,
      719, 755, 755, 650, 650, 683, 683, 562, 565, 385, 385,
    ];
    this.ys = [
      517, 517, 563, 563, 465, 465, 403, 303, 441, 441, 352, 352, 382, 382, 410,
      410, 475, 475, 409, 409, 385, 385, 563, 563, 710, 710, 591, 591, 525, 525,
      595, 595, 713, 713, 694, 694, 782, 782, 749, 749, 787, 787, 897, 897, 789,
      789, 599, 599, 646, 646, 622, 622, 720, 720, 674, 674, 719, 719, 839, 839,
      713, 713, 603, 503, 635, 635, 517,
    ];
    this.ys[7] = this.ys[6];
    this.ys[63] = this.ys[62];
    this.xs[64] = this.xs[63];
    this.ys[9] = this.ys[7];
    this.xs[8] = this.xs[7];
    this.ys[8] = this.ys[7];
    this.xs[7] = this.xs[9];
    this.xs[8] = this.xs[9];

    this.xmin = this.xs[0];
    this.xmax = this.xs[0];
    this.ymin = this.ys[0];
    this.ymax = this.ys[0];
    //find min of both lists
    for (let i = 0; i < this.xs.length; i++) {
      if (this.xs[i] < this.xmin) {
        this.xmin = this.xs[i];
      }
      if (this.ys[i] < this.ymin) {
        this.ymin = this.ys[i];
      }
    }

    //find max of both
    for (let i = 0; i < this.xs.length; i++) {
      if (this.xs[i] > this.xmax) {
        this.xmax = this.xs[i];
      }
      if (this.ys[i] > this.ymax) {
        this.ymax = this.ys[i];
      }
    }

    //lerp all values to fit in screen
    for (let i = 0; i < this.xs.length; i++) {
      this.xs[i] = map(
        this.xs[i],
        this.xmin,
        this.xmax,
        margins,
        width - margins
      );
      this.ys[i] = map(
        this.ys[i],
        this.ymin,
        this.ymax,
        margins,
        height - margins
      );
    }
  }
  setPlayer(player) {
    this.player = player;
    this.player.isPlayer = true;
  }

  addEntity(entity) {
    this.entities.push(entity);
  }

  addObstacle(object) {
    this.objects.push(object);
  }

  update() {
    for (let i = 0; i < this.entities.length; i++) {
      this.entities[i].update(this.player);
    }

    for (let i = 0; i < this.objects.length; i++) {
      //check if collision with player
      if (this.player) {
        if (
          collideRectRect(
            this.objects[i].x,
            this.objects[i].y,
            this.objects[i].sizeX,
            this.objects[i].sizeY,
            this.player.x,
            this.player.y,
            this.player.size,
            this.player.size
          )
        ) {
          this.objects[i].hidden = true;
        }
        this.objects[i].update();
      }
    }
    if (this.player) {
      this.player.update();
    }

    if (kingDead && !DONE2) {
      var room = getRoom(34, 36);
      image(
        imageWasted,
        room[0].x,
        room[0].y,
        room[1].x - room[0].x,
        room[1].y - room[0].y
      );
    }

    stroke(0);
    fill(0);
    beginShape();
    for (let i = 0; i < this.xs.length; i++) {
      vertex(this.xs[i], this.ys[i]);

      text(i, this.xs[i] + 10, this.ys[i]);
    }
    noFill();
    endShape(CLOSE);

    //if key is pressed (NOT HELD) then log coordinates
  }
}

/*
X: 387  Y: 517
X: 563  Y: 517
X: 563  Y: 563
X: 783  Y: 563
X: 783  Y: 465
X: 640  Y: 465
X: 640  Y: 403
X: 737  Y: 303
X: 737  Y: 441
X: 785  Y: 441
X: 785  Y: 352
X: 1040 Y: 352
X: 1040 Y: 382
X: 963  Y: 382
X: 963  Y: 410
X: 1014 Y: 410
X: 1014 Y: 475
X: 915  Y: 475
X: 915  Y: 409
X: 933  Y: 409
X: 933  Y: 385
X: 813  Y: 385
X: 813  Y: 563
X: 921  Y: 563
X: 921  Y: 710
X: 1008 Y: 710
X: 1008 Y: 591
X: 982  Y: 591
X: 982  Y: 525
X: 1105 Y: 525
X: 1105 Y: 595
X: 1045 Y: 595
X: 1045 Y: 713
X: 1148 Y: 713
X: 1148 Y: 694
X: 1265 Y: 694
X: 1265 Y: 782
X: 1145 Y: 782
X: 1145 Y: 749
X: 920  Y: 749
X: 920  Y: 787
X: 962  Y: 787
X: 962  Y: 897
X: 827  Y: 897
X: 827  Y: 789
X: 880  Y: 789
X: 880  Y: 599
X: 714  Y: 599
X: 714  Y: 646
X: 778  Y: 646
X: 778  Y: 622
X: 865  Y: 622
X: 865  Y: 720
X: 775  Y: 720
X: 775  Y: 674
X: 719  Y: 674
X: 719  Y: 719
X: 755  Y: 719
X: 755  Y: 839
X: 650  Y: 839
X: 650  Y: 713
X: 683  Y: 713
X: 683  Y: 603
X: 562  Y: 503
X: 565  Y: 635
X: 385  Y: 635
X: 385  Y: 517




*/
