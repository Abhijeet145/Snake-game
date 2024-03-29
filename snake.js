highscore = 0;
prevscore = 0;
start = true;
drawHighScore = false;
const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.mp3');
const musicSound = new Audio('music/music.mp3');
function Init(){
    
	cankey = document.getElementById("canvaskeys");
	cankey.width = 570;
	cankey.height = 400;
	keylen = 220;
	keyheight = 95;
	penkey = cankey.getContext('2d');
	init ={
		draw:function(){
			// pen.clearRect(0,0,W,H);
			pen.fillStyle = "yellow";
			pen.font = "32px Roboto";
			pen.fillText("Score :",4,32);
			pen.fillText("High Score :",8*cs,32);
			pen.fillText(highscore,12*cs+5,32);

			//print the keypad
			penkey.fillStyle = "green"; 
			penkey.fillRect(175,100,keylen,keyheight);
			penkey.fillRect(0,205,keylen,keyheight);
			penkey.fillRect(350,205,keylen,keyheight);
			penkey.fillRect(175,305,keylen,keyheight);
			// print score and high score
			if(drawHighScore==true)
			{
				pen.fillStyle = "yellow";
				pen.font = "30px Roboto";
				pen.fillText("Congratulations!",4.5*cs,4*cs-6);
				pen.font = "20px Roboto";
				pen.fillText("You have made a new high score",3.5*cs+5,5*cs-6);
			}
			
			if(start==true)
			{
				document.removeEventListener('click',tostart);
				pen.font = "25px Roboto";
				pen.fillText("Click on Start",5*cs+13,5*cs-6);
				pen.font = "60px Roboto";
				pen.fillText("Start ",5.5*cs+3,17+8*cs);
				start = false;
			}
			else
			{
				pen.font = "30px Roboto";
				pen.fillText(prevscore,110,32);
				pen.font = "60px Roboto";
				pen.fillText("Restart ",5*cs-3,17+8*cs);
				pen.font = "30px Roboto";

			}

		}
	}

	canvas = document.getElementById("mycanvas");
	W = canvas.width = 560;
	H = canvas.height = 480;
	pen = canvas.getContext('2d');
	cs = 40;
	game_over = false;

	food = getRandomFood();

	score = 0;

	// get an image for food
	food_img = new Image();
	food_img.src = "image/food.png";

	snake = {
		intit_len:3,
		color:"mediumseagreen",
		cells:[],
		direction:"none",
		createSnake:function(){
			for(var i = this.intit_len;i>0;i--){
				this.cells.push({x:i,y:1});
			}	
		},
		drawSnake: function(){
			
			for (var i= 1;i< this.cells.length;i++ ){
				pen.fillStyle = this.color;
				pen.fillRect(this.cells[i].x*cs,this.cells[i].y*cs,cs-2,cs-2);
			}
			pen.fillStyle = "red";
				pen.fillRect(this.cells[0].x*cs,this.cells[0].y*cs,cs-2,cs-2);		
		},
		updateSnake: function(){
			
			var headX = this.cells[0].x;
			var headY = this.cells[0].y;
			
			if(headX==food.x && headY==food.y)
			{
				foodSound.play();
				food = getRandomFood();
				score++;
				prevscore = score;
			}
			else
				this.cells.pop();
			var nextX,nextY;
			if(this.direction == "right")
			{
				nextX = headX + 1;
				nextY = headY;
			}
			else if(this.direction == "left")
			{
				nextX = headX - 1;
				nextY = headY;
			}
			else if(this.direction == "up")
			{
				nextX = headX;
				nextY = headY - 1;
			}
			else if(this.direction == "down")
			{
				nextX = headX;
				nextY = headY + 1;
			}
			else
			{
				nextY = headY;
				nextX = headX;
			}
			this.cells.unshift({x:nextX,y:nextY});
			// logic to stop the snake from going out of the boundary
			last_x = Math.round(W/cs)-2;
			last_y = Math.round(H/cs)-2;
			for(let i=1;i<this.cells.length;i++){
				if((this.cells[i].x === this.cells[0].x) && (this.cells[i].y === this.cells[0].y)){
					game_over=true;
					gameOverSound.play();
					musicSound.pause();
				}
			}
			if(this.cells[0].x <1 || this.cells[0].y <1 || this.cells[0].x >last_x || this.cells[0].y>last_y)
			{
				game_over=true;
				gameOverSound.play();
				musicSound.pause();
			}
		}
	};

	init.draw();

	snake.createSnake();
	document.addEventListener('click',tostart);
    document.addEventListener('keydown',updateDirection);
    cankey.addEventListener('click',updateDirection_key);
    }

function tostart(){
	draw();
	musicSound.play();
}


// function to test the functionality of keys
function updateDirection_key(e){
	var x = e.offsetX;
	var y = e.offsetY;

	if(x>175 && x<175+keylen && y>100 && y<100+keyheight)
	{
		snake.direction = "up";
	}
	else if(x>0 && x<0+keylen && y>205 && y<205+keyheight)
	{
		snake.direction = "left";
	}
	else if(x>350 && x<350+keylen && y>205 && y<205+keyheight)
	{
		snake.direction = "right";
	}
	else if(x>175 && x<175+keylen && y>305 && y<305+keyheight)
	{
		snake.direction = "down";
	}
}



// main draw function
function draw(){
	//console.log("In draw");

	//erase the previous window
	pen.clearRect(40,40,W,H);
	snake.drawSnake();
	food.drawFood();

	// show score and keep it changing
	pen.clearRect(98,0,5*cs,cs);

	pen.fillStyle = "yellow";
	pen.font = "30px Roboto";
	pen.fillText(score,110,32);

}

function getRandomFood(){
	var foodX = Math.round(Math.random()*(W-cs)/cs);
	var foodY = Math.round(Math.random()*(H-cs)/cs);
	last_x = Math.round(W/cs)-2;
	last_y = Math.round(H/cs)-2;
    if(foodX <1 || foodY <1 || foodX >last_x || foodY>last_y)
    {
    	return getRandomFood();
    }	
	var food ={
		x: foodX,
		y: foodY,
		color:"yellow",
		drawFood: function(){
			pen.fillStyle = this.color;
			pen.drawImage(food_img,food.x*cs,food.y*cs,cs,cs);
		},
	}

	return food;
}
function updateDirection(e){
	if(e.key == 'ArrowUp')
	{
		snake.direction = "up";
	}
	else if(e.key == 'ArrowDown')
	{
		snake.direction = "down";
	}
	else if(e.key == 'ArrowRight')
	{
		snake.direction = "right";
	}
	else if(e.key == 'ArrowLeft')
	{
		snake.direction = "left";
	}
	else if(e.key == ' ')
	{
		snake.direction = "none";
		musicSound.pause();
	}

}
function update(){
	snake.updateSnake();
	moveSound.play();
}

// main game loop
function gameloop(){
	//console.log("In gameloop");
	if(game_over==true){
		clearInterval(f);
		if(score>highscore)
		{
			highscore = score;
			drawHighScore=true;
		}
		else
		{
			drawHighScore=false;
		}
		document.addEventListener('keydown',restart);
		document.addEventListener('click',restart);
		Init();
		return;
	}
	if(snake.direction!="none")
	{
		
		draw();
		update();
	}
}

Init();


function restart(){
	document.removeEventListener('keydown',restart);
	document.removeEventListener('click',restart);
	Init();
    draw();
	f = setInterval(gameloop,250);
}
f = setInterval(gameloop,250);


