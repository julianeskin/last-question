var version = 0.03; //
var Game = {};
Game.Objects = [];

Game.FPS = 30;
Game.Currencies =  [['Second','Seconds','secs'], // this is some kind of time unit, I need to decide what – not implemented yet
					['Kelvin','Kelvin','kelv'], // not sure how/if this will be used
					['Quantum Foam','Quantum Foam','qfoams'],
					['Baryon','Baryons','baryons'],
					['Atom','Atoms','atoms']];
Game.Rates = [0,0,1,0,0]; // starting point for testing - reduce for release
Game.Wallet = [0,0,0,0,0]; // starting point for testing - reduce all to 0 for release

Game.Nobjects = 1;
Game.Object = function(id,type,singular,plural,basecosts,costgrowth,production,number,minreq,maxreq,color)
{
    this.singular = singular;
	this.plural = plural;
	this.number = number;
	this.minrequirements = minreq;
	this.maxrequirements = maxreq;
	this.basecosts = basecosts; //[seconds,kelvin,Qfoam,baryons,atoms] (although nothing ever "costs time")
	this.costgrowth = costgrowth; //[seconds,kelvin,Qfoam,baryons,atoms] (although nothing ever "costs time")
	this.production = production; //[seconds,kelvin,Qfoam,baryons,atoms] ("Producing time" is the game's way of advancing the age of the universe)
//	this.mouseOn = false;
//	if (this.mouseOn) {
//		//do something
//	}
	this.id = id;
	this.type = type;
	Game.Objects[this.singular] = this;
	return this;
}

Game.ActiveItem = 'quantum';

function lookup(object) {return document.getElementById(object);}

function AddEvent(object,event,fcn)
{
	if(object.attachEvent) 
		object.attachEvent("on" + event, function() {
			fcn.call(object);
		});
	else if(object.addEventListener) 
	object.addEventListener(event,fcn,false);
}

Game.Load = function() {
	new Game.Object('quantumgenerator1','quantum','Quantum Field Equation','Quantum Field Equations',[0,0,10,0,0],[0,0,1,0,0],[0,0,0.2,0,0],0,[0,0,0,0,0],[100,10,100000000,100000000,100000000]);
	new Game.Object('quantumgenerator2','quantum','Quantum Field Actuator','Quantum Field Actuators',[0,0,100,0,0],[0,0,1,0,0],[0,0,1,0,0],0,[0,0,50,0,0],[100,10,100000000,100000000,100000000]);
	new Game.Object('quantumgenerator3','quantum','Quantum Field Fluctuator','Quantum Field Fluctuators',[0,0,1000,0,0],[0,0,1,0,0],[0,0,12,0,0],0,[0,0,500,0,0],[100,10,100000000,100000000,100000000]);
	new Game.Object('baryongenerator1','baryon','Baryon Generator1','Baryon Generator1',[0,0,5000,0,0],[0,0,1,0,0],[0,0,0,1,0],0,[0,0,2000,0,0],[100,100000000,100000000,100000000,100000000]);
	new Game.Object('baryongenerator2','baryon','Baryon Generator2','Baryon Generator2',[0,0,20000,0,0],[0,0,1,0,0],[0,0,0,7,0],0,[0,0,15000,0,0],[100,100000000,100000000,100000000,100000000]);
	new Game.Object('baryongenerator3','baryon','Baryon Generator3','Baryon Generator3',[0,0,80000,0,0],[0,0,1,0,0],[0,0,0,21,0],0,[0,0,50000,0,0],[100,100000000,100000000,100000000,100000000]);
	new Game.Object('atomgenerator1','atom','Atom Generator1','Atom Generator1',[0,0,0,555,0],[0,0,0,1,0],[0,0,0,0,1],0,[0,0,0,255,0],[100,100000000,100000000,100000000,100000000]);
	new Game.Object('atomgenerator2','atom','Atom Generator2','Atom Generator2',[0,0,0,5555,0],[0,0,0,1,0],[0,0,0,0,16],0,[0,0,0,2555,0],[100,100000000,100000000,100000000,100000000]);
	new Game.Object('atomgenerator3','atom','Atom Generator3','Atom Generator3',[0,0,0,55555,0],[0,0,0,1,0],[0,0,0,0,42],0,[0,0,0,25555,0],[100,100000000,100000000,100000000,100000000]);

	Game.ItemMenu();
	Game.GeneratorMenu();
 	Game.Loop();
}

Game.Purchase = function(what,howmany)
{
	var costs = Game.getCost(what,howmany);
	var notenough = [];
	for (var i = 0; i < costs.length; i++ ) { notenough[i] = 0;}
	for (var i = 0; i < costs.length; i++ ) {
		if (Game.Wallet[i] < costs[i]) { notenough[i] = 1;}
	}
	if (Math.max(...notenough) == 0) {
 		Game.Spend(Game.getCost(what,howmany));
  		Game.Objects[what].number += howmany;
 		Game.RateUpdate();
 		Game.Nobjects += howmany;
		return 1;	// success
	} else {
		var missing = [];
		for (var i = 0; i < notenough.length; i++ ) {
			if (notenough[i] != 0) {
				missing.push(Game.Currencies[i][1]); // Ideally, I would be figuring out exactly how much of each is missing.
			}
		}
		var result = [];
		if (missing.length == 1) { 
			result = result + missing +'.'; 
		} else if (missing.length > 1) {
			result = 'Not enough ';
			for (var i = 0; i < missing.length - 1; i++ ) {
				result = result + missing[i] + ' or ';
			}
			result = result + missing[missing.length] + '.';
		return result;
		}
	}
 	Game.Draw();
}

Game.Loop = function()
{
 	Game.Logic();
	Game.Draw();
	setTimeout(Game.Loop,1000/Game.FPS);
}

Game.RateUpdate = function()
{
	Game.Rates = [0,0,0,0,0];
	for (var i in Game.Objects)
		{
			var object = Game.Objects[i];
//			if (object.type == 1) // not currently implemented – there are no types
			for (var j = 0; j < Game.Rates.length; j++ ) {
				Game.Rates[j] += object.number * object.production[j];
			}
		}
}

Game.Logic = function()
{
	if (Game.Nobjects > 0 ){
		var amounts = [0,0,0,0,0];
		for (var i = 0; i < amounts.length; i++ ) {
			amounts[i] = Game.Rates[i]/Game.FPS;
		}
		Game.Produce(amounts);
	}
}

Game.getCost = function(item,number)
{
	var prices = [0,0,0,0,0];
 	var item = Game.Objects[item];

	for (var i = 0; i < Game.Rates.length; i++) {
		prices[i] = Math.ceil(item.basecosts[i] * Math.pow(item.costgrowth[i],item.number));
	}
	return prices;
}

Game.Produce = function(amounts)
{
	if (amounts.length == Game.Currencies.length) {
		for (var i = 0; i < Game.Currencies.length; i++) {
			Game.Wallet[i] += amounts[i]*1;
		}
		return 1;
	} else return 0
}

Game.Spend = function(amounts)
{
	if (amounts.length == Game.Currencies.length) {
		success = 0;
		for (var i = 0; i < Game.Currencies.length; i++) {
			if (Game.Wallet[i] >= Math.floor(amounts[i])) { 
				success++;
			} 
		}
		if (success == Game.Currencies.length) {
			for (var i = 1; i < Game.Currencies.length; i++) {
				Game.Wallet[i] -= Math.floor(amounts[i]);
			}
			return 1;
		} else return 0;
	} else return 0;
}

Game.Draw = function() //rename this
{
// UPDATE GENERATOR BUTTONS
	for (var i in Game.Objects) {
 		var generator = Game.Objects[i];
		
		if (generator.type == Game.ActiveItem){
			// UPDATE NUMBER	
			lookup(generator.id + '_number').innerHTML = generator.number;

			// UPDATE TITLE
			if (generator.number == 1) {
				lookup(generator.id + '_title').innerHTML = generator.singular;
			} else {
				lookup(generator.id + '_title').innerHTML = generator.plural;
			}
		
			// UPDATE COST
			var prices = Game.getCost(generator.singular,1);
			for (var k = 0; k < prices.length; k++ ) {
				if (prices[k] > 0) {
					lookup(generator.id + '_cost').innerHTML = prices[k] + ' ' + Game.Currencies[k][1] + '   ';
				}
			} 
		
			// UPDATE PRODUCTION
			// sort of allows for displaying production of multiple different things – but it's not pretty. If that's never necessary, simplify this code...
			for (var j = 2; j < Game.Rates.length; j++ ) {
				if (generator.production[j] > 0) {
					lookup(generator.id + '_production').innerHTML =  Math.round(generator.production[j]*generator.number*10)/10 + ' ' + Game.Currencies[j][1] + ' per sec (' + Math.round(generator.production[j]*10)/10 + ' each).';
				}
			}
			// check if minimum requirements are met (see below)
//			lookup(generator.id + '_button') MAKE VISIBLE
		} else {
//			lookup(generator.id + '_button') MAKE HIDDEN
		}
	}


// THIS IS THE OLD CODE FOR CHECKING IF GENERATORS SHOULD BE VISIBLE
// 	var visible = 0;
// 	if (generator.number >= 1) {
// 		visible = 1;
// 	} else {
// 		var checker = 0;
// 	 	for (var j = 0; j < Game.Currencies.length; j++) {
// 	 		if (Game.Wallet[j] >= generator.minrequirements[j] && Game.Wallet[j] <= generator.maxrequirements[j]) {
// 	 			checker++;
// 	 		}
// 	 	}
// 	 	if (checker == Game.Currencies.length) {
// 	 		visible = 1;
// 	 	}
//  	}
//  	if (visible == 1) {
// 		var prices = Game.getCost(generator.singular,1);
// 		var checker2 = 0;
// 		for (i = 0; i < prices.length; i++) {
// 			if (prices[i] <= Game.Wallet[i]){
// 		checker2++;
// 		}
// 		}
// 		var affordable = 0;
// 		if (checker2 == prices.length) {
// 		affordable = 1;
// 		} 	  			
// 		if (affordable == 1 || generator.number > 0){
//		generatortable += ' class="affordable ';
//		} else {
//		generatortable += ' class="unaffordable ';
//		}
 	  	
 	  	

// UPDATE ITEM BUTTONS
	for (var i = 2; i < Game.Currencies.length; i++) {
		lookup(Game.Currencies[i][2] + '_number').innerHTML = Math.floor(Game.Wallet[i]);
		if (Game.Rates[i] > 0) {
			lookup(Game.Currencies[i][2] + '_currentlyearning').innerHTML = 'Currently earning';
			lookup(Game.Currencies[i][2] + '_production').innerHTML = Math.round(Game.Rates[i]*10)/10 + ' per sec.';
		} else {
			lookup(Game.Currencies[i][2] + '_currentlyearning').innerHTML = '';
			lookup(Game.Currencies[i][2] + '_production').innerHTML = '';
		}
	}
}

Game.ItemMenu = function()
{
	var itemtable = [];
	for (var i = 2; i < Game.Currencies.length; i++) {
		itemtable += '<div id="' + Game.Currencies[i][2] + '_button" class="itembutton active visible">';
		itemtable += '<div id="' + Game.Currencies[i][2] + '_number" class="itemnumber"></div>';
		itemtable += '<div id="' + Game.Currencies[i][2] + '_title" class="itemtitle">'+Game.Currencies[i][1]+'</div>';
		itemtable += '<div id="' + Game.Currencies[i][2] + '_currentlyearning" class="currentlyearning">Currently earning</div>';
		itemtable += '<div id="' + Game.Currencies[i][2] + '_production" class="itemproduction"></div>';
		itemtable += '</div>';
	}
	lookup('items').innerHTML = itemtable;
}

Game.GeneratorMenu = function() {
	var generatortable = [];
 	for (var i in Game.Objects) {
 		var generator = Game.Objects[i];
 		generatortable += '<div id="' + generator.id + '_button" class="generatorbutton active visible">';
  		generatortable += '<div id="' + generator.id + '_number" class="generatornumber"></div>'; 		
  		generatortable += '<div id="' + generator.id + '_title" class="generatortitle">'+generator.plural+'</div>';
		generatortable += '<div class="eachcosts">Each costs</div>';
		generatortable += '<div id="' + generator.id + '_cost" class="generatorcost"></div>';
		generatortable += '<div class="generating">Generating</div>';
		generatortable += '<div id="' + generator.id + '_production" class="generatorproduction"></div>';
 		generatortable += '</div>';
 	}
 	lookup('generators').innerHTML = generatortable;
 	
	for (var k in Game.Objects) {
		var generator = Game.Objects[k];
		generator.lookup = lookup(generator.id + '_button');
		AddEvent(generator.lookup,'click',function(what){return function(e){Game.Purchase(what,1);};}(generator.singular));
	}
}

window.onload = function()
{
	Game.Load();
}

// DELETE BEFORE RELEASE (this is so I can speed up production using the keyboard)
document.addEventListener('keydown',function(event) {
    var control = 0;
    if (event.keyCode == 65 || event.keyCode == 87 || event.keyCode == 69 || event.keyCode == 70 || event.keyCode == 32) { // A-W-E-F-space
		//Game.Produce([0,0,10,10,10]);
		var amounts = [0,0,0,0,0];
		for (var i = 0; i < amounts.length; i++ ) {
			amounts[i] = 30 * Game.Rates[i]/Game.FPS;
		}
		Game.Produce(amounts);
    }
});
