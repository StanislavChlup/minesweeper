//code by stanislav chlup
var game;
game = {
	adjacent: function(width, height, x, y) {
		/* center */
		if(x>0&&x<width-1&&y>0&&y<height-1){
			return [
				{x:x-1,y:y-1},
				{x:x,y:y-1},
				{x:x+1,y:y-1},
				{x:x-1,y:y},
				{x:x+1,y:y},
				{x:x-1,y:y+1},
				{x:x,y:y+1},
				{x:x+1,y:y+1}
				]}
				
		/* sides */
				
		/* left */
		if(x==0&&y!=0&&y!=height-1){
			return [
				{x:x,y:y-1},
				{x:x+1,y:y-1},
				{x:x+1,y:y},
				{x:x,y:y+1},
				{x:x+1,y:y+1}
				]}
		/* right */
		if (x==width-1&&y!=0&&y!=height-1) {
			return [
				{x:x-1,y:y-1},
				{x:x,y:y-1},
				{x:x-1,y:y},
				{x:x-1,y:y+1},
				{x:x,y:y+1},
				]}
		/* top */
		if (y==0&&x!=0&&x!=width-1) {
			return [
				{x:x-1,y:y},
				{x:x+1,y:y},
				{x:x-1,y:y+1},
				{x:x,y:y+1},
				{x:x+1,y:y+1}
				]}
		/* bottom */
		if (y==height-1&&x!=0&&x!=width-1) {
			return [
				{x:x-1,y:y-1},
				{x:x,y:y-1},
				{x:x+1,y:y-1},
				{x:x-1,y:y},
				{x:x+1,y:y},
				]}
				
		/* corners */
		
		/* top left */
		if (x==0&&y==0){
			return [
				{x:x+1,y:y},
				{x:x,y:y+1},
				{x:x+1,y:y+1}
				]}
		/* top right */
		if (y==0&&x==width-1){
			return [
				{ x: x - 1, y: y },
				{ x: x - 1, y: y + 1 },
				{ x: x, y: y + 1 },
				]}
		/* bottom left */
		if (y==height-1&&x==0){
			return [
				{x:x,y:y-1},
				{x:x+1,y:y-1},
				{x:x+1,y:y},
				]}
		/* bottom right */
		if (y==height-1&&x==width-1){
			return [
				{x:x-1,y:y-1},
				{x:x,y:y-1},
				{x:x-1,y:y},
				]}
	},
	
	generatemines: function(width, height, minecount, notx,noty) {
		let playfield = {
			matrix: Array.from({ length: height }, () =>
				Array.from({ length: width }, () =>
					({
						value: -1,
						mine: false,
						visual: 'none'
					}))),
			width: width,
			height: height,
			mines: [],
		};
		if (minecount <= (width * height)-9) {
			for (let totalmines = 0; totalmines < minecount; totalmines++) {
				let success = false;
				let safe = false;
				while (!success) {
					
					success = false;
					let safe = false;
					let x = Math.floor(Math.random() * playfield.width);
					let y = Math.floor(Math.random() * playfield.height);
					
					
					let adj = game.adjacent(width,height,notx,noty);

					
					switch (adj.length) {
						case 3:
							if (!(adj[0].x==x&&adj[0].y==y||adj[1].x==x&&adj[1].y==y||adj[2].x==x&&adj[2].y==y)) {
								safe = true;
							}
							break;
						case 5:
							if (!(adj[0].x==x&&adj[0].y==y||adj[1].x==x&&adj[1].y==y||adj[2].x==x&&adj[2].y==y||adj[3].x==x&&adj[3].y==y||adj[4].x==x&&adj[4].y==y)) {
								safe = true;
							}
							break;
						case 8:
							if (!(adj[0].x==x&&adj[0].y==y||adj[1].x==x&&adj[1].y==y||adj[2].x==x&&adj[2].y==y||adj[3].x==x&&adj[3].y==y||adj[4].x==x&&adj[4].y==y||adj[5].x==x&&adj[5].y==y||adj[6].x==x&&adj[6].y==y||adj[7].x==x&&adj[7].y==y)) {
								safe = true;
							}
							break;
					}
						if (notx==x&&noty==y) {
							safe=false;
						}
					
					if (playfield.matrix[x][y].mine == false) {
						if(safe){
						playfield.matrix[x][y].mine = true;
						playfield.mines[totalmines] = { x: x, y: y }
						success = true;
						}
					};
				};
			};
		} else {
			console.log('error');
			return 1;
		}
		return playfield;
	},

	generatenumbers: function(playfield) {
		for (let x = 0; x < playfield.width; x++) {
			for (let y = 0; y < playfield.height; y++) {
				if (!playfield.matrix[x][y].mine) {
					let m = 0;
					let arr = game.adjacent(playfield.width,playfield.height,x,y);
					for (let i = 0; i < arr.length; i++) {
						m += playfield.matrix[arr[i].x][arr[i].y].mine
					}
					playfield.matrix[x][y].value=m;
				}
			}
		}
		return playfield;
	},

	generateplayfield: function(width,height,minecount,notx,noty){
		let playfield = game.generatenumbers(game.generatemines(width,height,minecount,notx,noty));
		return playfield;
	},


};
var width = 10;
var height = 10;
var minecount = 20;
var ctx;
var canvas;
var pwidth = 2048/width;
var pheight = 2048/height;
var death = false;
var covered = width * height - minecount;
var flags = minecount;
var mode = 'click';
var cursx,cursy,moved;
var firstp;
var playfield;

window.onload = function(){start();}
function start(){
	firstp=true;
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	canvas.style.width='400px'
	ctx.clearRect(0,0,canvas.width,canvas.height);
	document.getElementById('mines').innerHTML='mines:'+minecount
	drawall();
	
}

function r(){
	start();
	death = 0;
	covered = width * height - minecount;
	flags = minecount;
	console.clear()
	document.getElementById('p').innerHTML=''
}

function visual(x,y) {
	if (playfield.matrix[x][y].visual!='uncovered'){
		if(playfield.matrix[x][y].visual=='flag'){
			var unrevieled = new Image();
			unrevieled.src = '/images/unrevieled.png';
			unrevieled.onload=function(){
			ctx.drawImage(unrevieled,x*pwidth,y*pheight,pwidth,pheight);}
			playfield.matrix[x][y].visual='none';
			flags++;
			document.getElementById('mines').innerHTML='mines:'+flags
		}else{
			var flag = new Image();
			flag.src = '/images/flag.png';
			flag.onload=function(){
			ctx.drawImage(flag,x*pwidth,y*pheight,pwidth,pheight);}
			playfield.matrix[x][y].visual='flag';
			flags--;
			document.getElementById('mines').innerHTML='mines:'+flags
		}
	}
			if(covered==0){
				alert('victory');
				document.getElementById('p').innerHTML='victory'
				death=true;
			}
}

function uncover0(x,y){
	if(!death){
	if (mode=='click'&&playfield.matrix[x][y].visual=='none') {
		drawp(x,y);
	}
	}
}

function uncover(x,y){
	if(!death){
	if (mode=='click'&&playfield.matrix[x][y].visual=='none') {
		drawp(x,y);
	}else{visual(x,y);}
	
	
	}
}

function drawall(){
	for (var x = 0; x < width; x++) {
		for (var y = 0; y < height; y++) {
				empty(x,y);
		}
	}
}
	
function showall(){
	if (!firstp) {
		death=true;
		for (var x = 0; x < width; x++) {
			for (var y = 0; y < height; y++) {
				drawp(x,y);
			}
		}
	}else{alert('click before using show all');}
}

function empty(x,y){
	var unrevieled = new Image();
			unrevieled.src = '/images/unrevieled.png';
			unrevieled.onload=function(){
			ctx.drawImage(unrevieled,x*pwidth,y*pheight,pwidth,pheight);}
}

function drawp(x,y){
	
	if(playfield.matrix[x][y].visual=='none'){
		playfield.matrix[x][y].visual='uncovered';
		switch (playfield.matrix[x][y].value) {
		
		case -1://mine
		if (!death) {
				var exploded = new Image();
			exploded.src = '/images/exploded.png';
			exploded.onload=function(){
			ctx.drawImage(exploded,x*pwidth,y*pheight,pwidth,pheight);
			}
			death = true;
				document.getElementById('p').innerHTML = 'lost'
				showall();
			
		}else{
			var mine = new Image();
			mine.src = '/images/mine.png';
			mine.onload=function(){
			ctx.drawImage(mine,x*pwidth,y*pheight,pwidth,pheight);
			}
		}
			
			
			break;
			
		case 0://0
			var _0 = new Image();
			_0.src = '/images/_0.png';
			_0.onload=function(){
			ctx.drawImage(_0,x*pwidth,y*pheight,pwidth,pheight);}
			
			if (playfield.matrix[x][y].value==0) {
		var arr = game.adjacent(width,height,x,y);
		for (var i = 0; i < game.adjacent(width,height,x,y).length; i++) {
			uncover0(arr[i].x,arr[i].y);
		}
	}
			break;
			
		case 1://1
			var _1 = new Image();
			_1.src = '/images/_1.png';
			_1.onload=function(){
			ctx.drawImage(_1,x*pwidth,y*pheight,pwidth,pheight);}
			break;
			
		case 2://2
			var _2 = new Image();
			_2.src = '/images/_2.png';
			_2.onload=function(){
			ctx.drawImage(_2,x*pwidth,y*pheight,pwidth,pheight);}
			break;
			
		case 3://3
			var _3 = new Image();
			_3.src = '/images/_3.png';
			_3.onload=function(){
			ctx.drawImage(_3,x*pwidth,y*pheight,pwidth,pheight);}
			break;
			
		case 4://4
			var _4 = new Image();
			_4.src = '/images/_4.png';
			_4.onload=function(){
			ctx.drawImage(_4,x*pwidth,y*pheight,pwidth,pheight);}
			break;
			
		case 5://5
			var _5 = new Image();
			_5.src = '/images/_5.png';
			_5.onload=function(){
			ctx.drawImage(_5,x*pwidth,y*pheight,pwidth,pheight);}
			break;
			
		case 6://6
			var _6 = new Image();
			_6.src = '/images/_6.png';
			_6.onload=function(){
			ctx.drawImage(_6,x*pwidth,y*pheight,pwidth,pheight);}
			break;
			
			case 7://7
			var _7 = new Image();
			_7.src = '/images/_7.png';
			_7.onload=function(){
			ctx.drawImage(_7,x*pwidth,y*pheight,pwidth,pheight);}
			break;
			
		case 8://8
			var _8 = new Image();
			_8.src = '/images/_8.png';
			_8.onload=function(){
			ctx.drawImage(_8,x*pwidth,y*pheight,pwidth,pheight);}
			break;
	}
		if (!death) {
			covered--;
			if(covered==0){
				alert('victory')
				document.getElementById('p').innerHTML='victory'
				death=true;
			}
		}
	}
	if (playfield.matrix[x][y].visual=='flag'&&playfield.matrix[x][y].mine==false) {
		var flagmissplaced = new Image();
			flagmissplaced.src = '/images/flagmissplaced.png';
			flagmissplaced.onload=function(){
			ctx.drawImage(flagmissplaced,x*pwidth,y*pheight,pwidth,pheight);
			}
			death = true;
			document.getElementById('p').innerHTML='lost';
	}
}

function changemode(){
	if (mode=='click') {
		mode='flag';
		document.getElementById('mode').innerHTML='🚩';
	}else{
		mode='click';
		document.getElementById('mode').innerHTML='👆';
	}
}

function cursorpos(e,value) {
	if (value==1) {
	cursx = e.touches[0].clientX-7;
	cursy = e.touches[0].clientY-51;
	}
	if (value==2) {
		moved=true;
	}
	if (value==3) {
		if (!moved) {
		clicked(cursx,cursy);
		}
		moved=false;
	}
}

function clicked(x,y){
	x=Math.floor(x/(400/width));
	y=Math.floor(y/(400/height));
	if(x<0){x=0;}if(y<0){y=0;}
	if(x>width-1){x=width-1;}if(y>height-1){y=height-1;}
	if (firstp) {
		playfield = game.generateplayfield(width,height,minecount,x,y);
		firstp=false;
	}
	uncover(x,y);
}
