//calls the initialize canvas method
init();
//booleans for checking to see if the game has started or is paused. used in startSplash and startGame
var started = false, paused = false;

//creates and gets canvas
function init()
{
	//creates the canvas dom element
	canvas = document.createElement("canvas");
	//gets the 2d context of the canvas for drawing, etc
	ctx = canvas.getContext("2d");
	//calls the resize function
	resize();
	//appends the canvas element to html
	document.body.appendChild(canvas);
	//when the window resizes, resets and calls the startSplash function
	window.onresize = function(){resize();clearInterval(startColors);startSplash();}
}
///////// END OF INITIALIZING THE CANVAS //////////
function resize()
{
	//sets the canvas height just under the window height
	canvas.height = window.innerHeight-5;
	//sets the canvas width to a fixed ratio of height
	canvas.width = canvas.height/1.2;
}
function clearCanvas(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
}
//Splash screen
function startSplash()
{
		//sets the header font size to a fixed ratio of the screen size
		headerFontSize = canvas.height/15;
		//aligns text to center
		ctx.textAlign = "center";
		//setInterval to change color of text rapidly - like a loop
		startColors = setInterval(function()
		{
			//sets the font
			ctx.font = headerFontSize+'px Lucida Grande';
			//sets the fill color of all canvas elements to a random rgb value
			ctx.fillStyle=  "rgb("+Math.floor(Math.random() * 255)+","+Math.floor(Math.random() * 255)+","+Math.floor(Math.random() * 255)+")" ;
			//draws "Falldown!" to the center of the canvas
			ctx.fillText("Falldown!", canvas.width/2, canvas.height/2);
			//changes the font to a smaller size
			ctx.font = ' '+headerFontSize/2.2+'px Lucida Grande';
			//sets a different random color to the fill
			ctx.fillStyle=  "rgb("+Math.floor(Math.random() * 255)+","+Math.floor(Math.random() * 255)+","+Math.floor(Math.random() * 255)+")" ;
			//fills "enter to start" under "Falldown!"
			ctx.fillText('Press Enter to start', canvas.width/2, canvas.height/2+headerFontSize);
		}, 100);	
		//if the game hasn't started, 
		if(started == false)
		{
			//when enter is pressed and the game hasn't started, start the game
			document.onkeypress = function(event){if (event.keyCode == 13) {clearInterval(startColors); ctx.clearRect(0,0,canvas.width,canvas.height); startGame();}}
			//when the screen is tapped on a mobile device and the game hasn't started, start the game
			document.ontouchend = function(event){clearInterval(startColors); ctx.clearRect(0,0,canvas.width,canvas.height); startGame();}
		}
}
//calls the start splash screen game
startSplash();

//function for the start of the game
function startGame()
{
//says the game has started
started = true;
//enter or tap to pause if the game has started
if(started == true)
{
	document.onkeypress = function(event){if (event.keyCode == 13 && paused==true){paused = false; animate();}else if(event.keyCode == 13 && paused==false){paused=true;} }
	document.ontouchend = function(event){if(paused==true){paused = false; animate();}else if(paused==false){paused = true;} }
}	
	///////// INITIALIZE AND LOAD ALL VARIABLES ///////
	///////////////BALL////////////////////
	//class so that when a variable is a type of this, that variables ids have the following. eg this.x is ball.x's property if ball = new Ball()
	function Ball(x,y,vx,vy)
	{
	    console.log(vy);
		//sets the ball radius according to the canvas height
		this.radius = canvas.height/50;
		//sets the ball x value to the one given when calling this function
		this.x = x;
		//sets the ball y value to the one given calling this function
		this.y = y;
		//balls x speed
		this.vx = this.radius/2;
		//balls y speed
		this.vy = vy;
		//moves y coordinates by vy every time
		this.y += this.vy;
		//sets the leftmost point of the ball
		this.startX = this.x-this.radius;
		//sets the sets the rightmost point of the ball
		this.endX = this.x+this.radius;
		//sets the topmost point of the ball
		this.startY = this.y-this.radius;
		//sets the bottommost point of the ball
		this.endY = this.y+this.radius;
		//sets the fillstyle of the ball to be a random color
		ctx.fillStyle=  "rgb("+Math.floor(Math.random() * 255)+","+Math.floor(Math.random() * 255)+","+Math.floor(Math.random() * 255)+")" ;
		//start the drawing path for the ball
		ctx.beginPath();
		//sets the coordinates, radius and such for the ball
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
		//end the drawing path for the ball
		ctx.closePath();
		//fill the ball with the random color assigned to it
		ctx.fill();	
	}
	//draws the first ball at canvas.height/50 which is the radius of the ball
	var startX = 30, startY = 30, vx = 0, vy = 0, ball = new Ball(startX, startY, vx, vy);
		var left = false, right = false;
	//moves ball's x values when arrow keys move. also, moves ball's y value when it is in freefall(gravity). Also, detects collision with walls
	function moveBall()
	{
		//gravity for ball to drop vertically when in free fall
		ball.vy += ball.radius/20;

		//collision with bottom
		if(ball.endY >= canvas.height){ball.vy = 0; ball.y = canvas.height-ball.radius-1;}
		//arrow keys to move. onkeydown is when arrow key is held down
		document.onkeydown = function(event)
		{	
			//left arrow key
			if(event.keyCode==37){left = true;}
			//right arrow key
			else if(event.keyCode==39){right = true;}
		}
		//onkeyup is to make a smooth transition when the user is holding the key down. otherwise the balls movement would be choppy 
		document.onkeyup = function(event)
		{
			//left arrow key
			if(event.keyCode == 37){left = false;}
			//right arrow key
			else if(event.keyCode == 39){right = false;}	
		}
		//same but for tilt position of device
		window.ondeviceorientation = function(event) 
		{
			if(event.gamma > 5){if(ball.endX>=canvas.width){ball.x+=0;ball.x=canvas.width-ball.radius;}else{ball.x += ball.vx;}}
			else if(event.gamma < -5){if(ball.startX<=0){ball.x+=0;ball.x=0+ball.radius;}else{ball.x -= ball.vx;}}
			
		}
		//if left arrow key is pressed, ball goes left at the given ball speed
		//the ifs inside of ifs are for collisions with left and right walls
		if(left){if(ball.startX<=0){ball.x+=0;ball.x=0+ball.radius;}else{ball.x -= ball.vx;} }
		//if right is pressed, ball goes right at the given ball speed
		else if (right){if(ball.endX>=canvas.width){ball.x+=0;ball.x=canvas.width-ball.radius;}else{ball.x += ball.vx;} }
		//mobile device rotation
	
	}
	//////////////PLATFORMS////////////////
	//sets all variables for platforms. randx = array of all x random coordinates of all platforms, amt is amount of platforms, pycoord is same as rand but y values, px is start of first rectangle, py is start of y value of first platform, platform gap is white space in between 2 rectangles beside each other, spacing is space inbetween platforms y location, platformspeed is how many pixels the platform is moving up to animate
	var randx = [], amt = 2000, pyCoord = [], px = 0, py = canvas.height/2, platformGap = ball.radius*6, spacing = canvas.height/10, platformspeed = ball.radius/10;
	//creates an array of random x values for all of the platforms
	function makeRandomPlatforms(){for (i = 0; i < amt; i++){randx[i] = Math.floor(Math.random() * (  canvas.width - ball.radius*5) );}}
	//calls the previous function to create the array
	makeRandomPlatforms();
	//drawing and collisions with platforms
	function drawPlatforms(){
		//make the platforms go up by 1 pixel every interval - for animating platforms going up
		py -= platformspeed;
		//save the platform y location
		var temp = py;
		//make platforms black
		ctx.fillStyle = "#000";
		//starts the drawing class
		ctx.beginPath();
		//loops over to draw all different platforms. amt is the amount of platforms drawn
		for(i = 0;i < amt; i++)
		{
			//y values are height of platform
			//make first rectangle from x value 0 to random x value smaller than radius*6 from the end
			ctx.rect(px,py, randx[i],ball.radius);
			//make second rectangle from platform gap(radius*6) to end of canvas width
			ctx.rect(randx[i] + (platformGap), py, canvas.width, ball.radius);
			//sets the ith number of the pyCoord array to the platform's current y location. used for collisions and to save the current y location
			pyCoord[i] = py;  
			//sets the next platform y location to be  
			py += spacing; 
			///////BALL COLLISION WITH PLATFORMS/////////////
			//note - ball collision with walls is in the moveBall function
			//ball collision with top of platform
			if (ball.endY >= pyCoord[i] && ball.endY <= (pyCoord[i] + (ball.radius*2)) && (ball.startX <= randx[i] || ball.endX >= randx[i] + (ball.radius*6)+1+1/* here is bug fix for right wall */) )
			{
				//ball y location is thy platform y location - ball radius
				ball.y = pyCoord[i] - ball.radius; /*-3 is fix for bottom of ball to be above the y location of the platform*/
				//balls downward velocity is 0 to make it not fall down below platform 
				ball.vy = 0;		
			}
			//collision with left side of platform gap
//			else if ( ball.startY >= pyCoord[i] && ball.startY <= (pyCoord[i]+(ball.radius)) &&  ball.startX <= randx[i])
//			{
//				ball.x = randx[i]+ball.radius;
//				ball.x += ball.vx;
//			}
			//collision with right side of platform gap
//			else if ( (ball.startY >= pyCoord[i] && ball.startY <= (pyCoord[i]+(ball.radius)) ) &&  ( (ball.endX >= randx[i] + (ball.radius*6)) ) && randx[i] + ball.radius*6 < canvas.width)
//			{
//				ball.x = randx[i] + ball.radius*5;
//				ball.x -= ball.vx;
//			}
		}
		//close the platform drawing path
		ctx.closePath();
		//fills the 2 platforms
		ctx.fill();
		//restores the platform y location from earlier
		py = temp;
		//increase the speed of the platforms. the faster it goes, the slower the speed increases
		if (platformspeed > ball.radius/8)
		{
			platformspeed += ball.radius/200000;
		}
		else if (platformspeed > ball.radius/7.27) 
		{
			platformspeed += 0;
		}
		else 
		{
			platformspeed += ball.radius/40000;
		}
	}
	/************* SCORING **************/
	var score = 0, highScore, scores;
	//gets the high score from local browser storage. if there is none, creates a high score of 0 in localStorage
	function getHighScore()
	{
		//if there is no localStorage value for highScore
		if(localStorage.getItem("highScore") == null)
		{
			//create a localStorage value HighScore of 0. note that localstorage must be a string. cannot be an integer
			localStorage.setItem("highScore", '0');
		}
		//if there is already a localstorage variable for highScore
		
		//get highScore from localStorage
			highScore = JSON.parse(localStorage.getItem("highScore"));
	}
	//calls the getHighScore function
	getHighScore();
	//updates the current score and high score 60 times a second(the optimal frame rate), and displays it. this is used when the game is being played
	var tempHighScore = highScore;
	function updateScore()
	{
		score += 1/60;
		ctx.textAlign ="left";
		ctx.fillStyle =  '#000000' ;
		ctx.font = headerFontSize/4+"px Lucida Grande";
		ctx.fillText("Score: "+Math.ceil(score),ball.radius,ball.radius);
		ctx.textAlign = "right";
		ctx.fillText("High Score: "+Math.ceil(tempHighScore),canvas.width-ball.radius,ball.radius);
		if(score > tempHighScore)
		{
			tempHighScore = score;
		}
	}
	//updates the new score as the high score if it is higher than the current high score
	function showHighScore()
	{
		//sets the localstorage high score as the new high score if the current score is greater than the current high score
		if( score > highScore)
		{
			highScore = score;
			//json.stringify is needed to convert the float value of highScore to a string so localstorage can hold it
			localStorage.setItem("highScore", JSON.stringify(highScore));
		}
		//following three lines draw the current high score just below center of screen
		ctx.font = headerFontSize/2+'px Lucida Grande';
		ctx.textAlign = "center";
		ctx.fillText("High Score: " + Math.ceil(highScore) ,canvas.width/2,canvas.height/1.6);
		
		
	}
	//////////////// GAME /////////////////////////
	//the animation of the game			
	function animate()
	{
		//animate the game when the game is not paused
		if (paused==false){window.requestAnimationFrame(animate);}
		//clears the whole canvas screen. not very efficient because it clears white space. a better way to do it would be to clear every platform *on screen* and ball location, but thats hard
		clearCanvas();
		//funky dunky background
//		ctx.fillStyle=  "rgb("+Math.floor(Math.random() * 255)+","+Math.floor(Math.random() * 255)+","+Math.floor(Math.random() * 255)+")" ;
//		ctx.fillRect(0,0,canvas.width,canvas.height);
		//draws all platforms
		drawPlatforms();

		//calls the move ball function. this includes collision with bottom left and right walls
		moveBall();	
		//makes a new ball. see Ball() function for more info. assigning ball.x and ball.y update the position of the ball from inside the moveBall() function
		ball = new Ball(ball.x, ball.y, ball.vx, ball.vy);
		//updates score
		updateScore();
		//collision with top - game over. by putting this here i can clear the screen in the doGameOver function. if i put it in the moveBall function it would not clear the screen
		if(ball.startY<=0){paused=true;doGameOver();}
	}
	animate();
	//this function is called when the game ends
	function doGameOver()
	{
		//clears the canvas so anything that is there is gone and its just white
		clearCanvas();
		//draws the current score to the screen
		ctx.font = ""+headerFontSize/2+"px Lucida Grande";
		ctx.textAlign = "center";	
		ctx.fillText("Current Score:"+Math.ceil(score),canvas.width/2,canvas.height/1.8);
		//gets the new high score and prints it to the screen 
		showHighScore();
		//draws game over to screen
		ctx.font = " "+headerFontSize/2+"px Lucida Grande";
		ctx.textAlign = "center";
		ctx.fillText("Game Over",canvas.width/2, canvas.height/2.5);
		document.onkeypress = function(){if(event.keyCode == 13){paused = false; startGame();}} }
}