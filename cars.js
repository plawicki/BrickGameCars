$(function(){
	var canvas = $('canvas')[0]
	var ctx = canvas.getContext("2d");

	// settings
	var darkbackground = "#8A9B93";
	var background = "#98B0A3";
	var lines = "#000200";

	canvas.style.background = background;
	canvas.width = document.body.clientWidth;
	canvas.height = document.body.clientHeight;

	canvas.style.width = canvas.width + "px";
	canvas.style.height = canvas.height + "px";

	ctx.szerokosc = canvas.width;
	ctx.wysokosc = canvas.height;

	ctx.clear = function(){
		ctx.save();

		ctx.fillStyle = background;
		ctx.fillRect(0,0,ctx.szerokosc, ctx.wysokosc);

		ctx.restore();
	}

	vector = function(x, y){
		if(x, y){
			this.x = x;
			this.y = y;
		}
		else{
			this.x = 0;
			this.y = 0;
		}
	}

	tile = function(width, height, color, lines, gap){
		this.width = width;
		this.height = height;
		this.color = color;
		this.lines = lines;
		this.gap = gap;
	}

	tile.prototype.draw = function(ctx, position, color){

		if(color)
			ctx.fillStyle = color;
		else
			ctx.fillStyle = this.lines;
		// drawing 32x32 black rectangle
		
		ctx.fillRect(position.x, position.y, this.width, this.height);

		// drawing 28x28 green rectangle
		ctx.fillStyle = this.color;
		ctx.fillRect(position.x + 2 * this.gap, position.y + 2 * this.gap, this.width - 4 * this.gap, this.height - 4 * this.gap);

		// drawing 24x24 black rectangle
		if(color)
			ctx.fillStyle = color;
		else
			ctx.fillStyle = this.lines;
		ctx.fillRect(position.x + 4 * this.gap, position.y + 4 * this.gap, this.width - 8 * this.gap, this.height - 8 * this.gap);

		

	}

	board = function(position, width, height, gap, score, tile, cars, player, background){
		this.position = position;

		this.background = background;

		this.width = width;
		this.height = height;

		// gap between tiles
		this.gap = gap;

		// container for actual cars 
		this.state = new Array();

		this.score = score;

		// ref to tile used to draw
		this.tile = tile;

		// container of cars temples
		this.cars = cars;

		// ref to player
		this.player = player;

	}

	board.prototype.update = function(){
	

	}

	board.prototype.draw = function(ctx){
		ctx.clear();
		ctx.save();

		for(var i=1; i<this.width; i++)
		{
			for(var j=1; j<this.height; j++)
			{
				this.tile.draw(ctx, new vector(i * this.tile.width + this.gap * i, j * this.tile.height + this.gap * j), this.background);
			}
		}

		ctx.moveTo(374, 32);
		ctx.lineTo(374, 678);
		ctx.stroke();

		ctx.restore();
	}

	car = function(position, type, difficulty, tile, cars, gap){
		this.position = position;
		this.type = type;
		this.shape = new Array();
		this.gap = gap;
		this.direction = 0;

		if(this.position.x >= 1 && this.position.x <= 5)
			this.direction = 0;
		if(this.position.x >= 6 && this.position.x <= 7)
			this.direction = 1;

		// ref to container of car types
		this.cars = cars;

		for(var i=0; i<3; i++)
		{
			this.shape.push(new Array()); 
			for(var j=0; j<4; j++)
			{
				this.shape[i][j] = this.cars[this.type].shape[j][i];
			}
		}

		this.difficulty = difficulty;
		this.tile = tile;
	} 

	car.prototype.update = function(){

		if(this.difficulty == 0)
			this.position.y++;
		else
		{
			// setting direction 0 - right, 1 - left
			if(this.position.x === 1)
				this.direction = 0;
			if(this.position.x === 7)
				this.direction = 1;

			this.position.y++;

			if(this.direction === 0)
				this.position.x++;
			else
				this.position.x--;
		}

	}

	car.prototype.draw = function(ctx){

		ctx.save();
		for(var i=0; i<3; i++)
			for(var j=0; j<4; j++)
			{
				if(this.position.y + j <= 19 && this.position.y + j >= 1)
				if(this.shape[i][j] === 1)
					this.tile.draw(ctx, new vector((i+this.position.x) * this.tile.width + this.gap * (this.position.x + i), (j+this.position.y) * this.tile.height + this.gap * (this.position.y + j)))
			}
		ctx.restore();

	}

	// cars examples
	var cars =
	[
		{
			"shape": 	[
						[0, 1, 0],
						[1, 1, 1],
						[0, 1, 0],
						[1, 0, 1]
				  		],
			"name": "Formula"
		},
		{
			"shape": 	[
						[1, 1, 1],
						[1, 1, 1],
						[1, 0, 1],
						[1, 1, 1]
				  		],
			"name": "Truck"
		},
		{
			"shape": 	[
						[1, 0, 0],
						[1, 0, 0],
						[1, 0, 0],
						[0, 0, 0]
				  		],
			"name": "Bike"
		},
		{
			"shape": 	[
						[1, 0, 1],
						[0, 1, 0],
						[0, 1, 0],
						[1, 1, 1]
				  		],
			"name": "Car"
		}
	]
	// end-of-cars examples

	// initialization
	var tile = new tile(32, 32, background, lines, 2);

	// position, type, difficulty, tile, cars
	var car = new car(new vector(0,-4), 1, 1, tile, cars, 2)

	var player = null;

	var board = new board(new vector(4,1), 10, 20, 2, 0, tile, cars, player, darkbackground, speed);

	updateGame = function(){
		board.update();
		board.draw(ctx);

		car.update();
		car.draw(ctx);
	}

	var speed = 500;
	gameloop = setInterval(updateGame, speed);
})
