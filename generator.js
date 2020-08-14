var w = window.innerWidth;
var h = window.innerHeight;

var maze;
var player;

function generateMaze( size, difficulty) {
	maze = [];
	for (var i = 0; i < size.x; i++) {
		maze.push([]);
		for (var j = 0; j < size.y; j++) {
			maze[i].push( {x:-1, y:-1} );
		}
	}
	
	var goal = {x: Math.floor(Math.random()*size.x), y: Math.floor(Math.random()*size.y)};
	maze[goal.x][goal.y].control = "goal";
	var prev = goal;
	var cur;
	for (var i = 0; i < difficulty; i++) {
		cur = { x: Math.floor(Math.random()*size.x), y: Math.floor(Math.random()*size.y) };
		if (!maze[cur.x][cur.y].control) {
			var next_arr = [];
			if (maze[cur.x-1] && maze[cur.x-1][cur.y] && !maze[cur.x-1][cur.y].control) {
				next_arr.push({x: cur.x-1, y: cur.y});
			}
			if (maze[cur.x] && maze[cur.x][cur.y-1] && !maze[cur.x][cur.y-1].control) {
				next_arr.push({x: cur.x, y: cur.y-1});
			}
			if (maze[cur.x+1] && maze[cur.x+1][cur.y] && !maze[cur.x+1][cur.y].control) {
				next_arr.push({x: cur.x+1, y: cur.y});
			}
			if (maze[cur.x] && maze[cur.x][cur.y+1] && !maze[cur.x][cur.y+1].control) {
				next_arr.push({x: cur.x, y: cur.y+1});
			}
			
			if (next_arr.length > 0) {
				var index = Math.floor(Math.random()*next_arr.length);
				maze[cur.x][cur.y].control = "path";
				maze[cur.x][cur.y].x = prev.x;
				maze[cur.x][cur.y].y = prev.y;
				
				maze[next_arr[index].x][next_arr[index].y].control = "path";
				maze[next_arr[index].x][next_arr[index].y].x = Math.floor(Math.random()*size.x);
				maze[next_arr[index].x][next_arr[index].y].y = Math.floor(Math.random()*size.y);
				prev = next_arr[index];
			} else {
				i--;
				continue;
			}
		} else {
			i--;
			continue;
		}
	}
	player = prev;
	
	for (var i = 0; i < maze.length; i++) {
		for (var j = 0; j < maze[0].length; j++) {
			if (!maze[i][j].control) {
				maze[i][j].x = Math.floor(Math.random()*size.x);
				maze[i][j].y = Math.floor(Math.random()*size.y);
				if (Math.random() < 0.3) {
					maze[i][j].control = "404";
				}
			}
		}
	}
}

function paintMaze(canvas) {
	if (w/(maze.length+1) > h/(maze[0].length+1)) {
		step = h/(maze[0].length+1);
		x_pad = (w - (maze.length+1)*step)/2;
		y_pad = 0;
	} else {
		step = w/(maze.length+1); 
		x_pad = 0;
		y_pad = (h - (maze[0].length+1)*step)/2;
	}
	border = 1;
	
	var g = canvas.getContext("2d");
	g.font = (step*0.9) + "px sans-serif";
	g.textAlign = "left";
	g.textBaseline = "top";
	
	g.fillStyle = "#FF0000";
	var x;
	var y = y_pad;
	for (var i = 0; i < maze.length; i++) {
		x = (i+1.25)*step+border+x_pad;
		g.fillText(i, x, y);
	}
	x = x_pad + step*0.25;
	for (var j = 0; j < maze[0].length; j++) {
		y = (j+1)*step+border+y_pad;
		g.fillText(j, x, y);
	}
	
	for (var i = 0; i < maze.length; i++) {
		for (var j = 0; j < maze[0].length; j++) {
			x = (i+1)*step+border+x_pad;
			y = (j+1)*step+border+y_pad;
			
			if (i === player.x && j === player.y) {
				g.fillStyle = "#00FF00";
			} else if (maze[i][j].control === "goal") {
				g.fillStyle = "#FFFF00";	
			} else if (maze[i][j].control === "BL") {
				g.fillStyle = "#000000";	
			} else {
				g.fillStyle = "#FF0000";
			}
			g.fillRect(x, y, step-2*border, step-2*border);
			
			g.fillStyle = "#0000FF";
			g.fillText(maze[i][j].x + "" + maze[i][j].y, x, y);
		}
	}
};

function keypress(event) {
	var flag = false;
	if (event.key === "w") {
		if (maze[player.x][player.y-1]) {
			if (maze[player.x][player.y-1].control === "404" || maze[player.x][player.y-1].control === "BL") {
				maze[player.x][player.y-1].control = "BL";
				paintMaze(canvas);
			} else {
				player.y -= 1;
				flag = true;
			}
		}
	} else if (event.key === "s") {
		if (maze[player.x][player.y+1]) {
			if (maze[player.x][player.y+1].control === "404" || maze[player.x][player.y+1].control === "BL") {
				maze[player.x][player.y+1].control = "BL";
				paintMaze(canvas);
			} else {
				player.y += 1;
				flag = true;
			}
		}
	} else if (event.key === "a") {
		if (maze[player.x-1]) {
			if (maze[player.x-1][player.y].control === "404" || maze[player.x-1][player.y].control === "BL") {
				maze[player.x-1][player.y].control = "BL";
				paintMaze(canvas);
			} else {
				player.x -= 1;
				flag = true;
			}
		}
	} else if (event.key === "d") {
		if (maze[player.x+1]) {
			if (maze[player.x+1][player.y].control === "404" || maze[player.x+1][player.y].control === "BL") {
				maze[player.x+1][player.y].control = "BL";
				paintMaze(canvas);
			} else {
				player.x += 1;
				flag = true;
			}
		}
	}
	if (flag) {
		paintMaze(canvas);
		var pos = maze[player.x][player.y];
		if (pos.control === "goal") {
			window.location.reload();
		}
		player.x = pos.x;
		player.y = pos.y;
		var pos = maze[player.x][player.y];
		if (pos.control === "goal") {
			window.location.reload();
		}
		paintMaze(canvas);
	}
}

window.onload = function() {
	canvas = document.getElementById("MVLM_canvas");
	canvas.width = w;
	canvas.height = h;
	generateMaze({x:6, y:8}, 8);
	paintMaze(canvas, maze);
	
	document.onkeypress = keypress;
}
