var version = 0.03; //
var Game = {};
Game.Objects = [];

Game.FPS = 30;
Game.Currencies =  [['Second','Seconds','secs'], // this is some kind of time unit, I need to decide what – not implemented yet
					['Kelvin','Kelvin','kelv'], // not sure how this will be used
					['Quantum Foam','Quantum Foam','qfoam'],
					['Elementary Particle','Elementary Particles','elementary'],
					['Subatomic Particle','Subatomic Particles','subatomic'],
					['Atom','Atoms','atom']];
var starting_point = [];
for (var i in Game.Currencies) {starting_point[i] = 0;}
Game.Rates = starting_point.slice(); // Initial production rates: 0 of all resources
Game.Wallet = [0,0,88,0,0,0]; // Arbitrarily, initial resources: just 88 Quantum Foam
Game.Nobjects = 1;

Game.Object = function(id,type,singular,plural,basecosts,costgrowth,production,number,minreq,maxreq)
{
    this.singular = singular;
	this.plural = plural;
	this.number = number;
	this.minrequirements = minreq;
	this.maxrequirements = maxreq;
	this.basecosts = basecosts; //[seconds,kelvin,Qfoam,baryons,atoms] (although nothing ever "costs time")
	this.costgrowth = costgrowth; //[seconds,kelvin,Qfoam,baryons,atoms] (although nothing ever "costs time")
	this.production = production; //[seconds,kelvin,Qfoam,baryons,atoms] ("Producing time" is the game's way of advancing the age of the universe)
	this.id = id;
	this.type = type;
	Game.Objects[this.singular] = this;
	return this;
}

Game.ActiveItem = '';

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
//	unique ID, type, Singular Name, Plural Name, 
//	base costs, cost growth exponents, production rates, number, minimum requirements, maximum requirements
 	new Game.Object('quantumgenerator1','qfoam','Quantum Field Equation','Quantum Field Equations',
		[0,0,10,0,0,0],[0,0,1.02,0,0,0],[0,0,0.1,0,0,0],0,[0,0,0,0,0,0],[100,10,100000000,100000000,100000000,100000000]);
	new Game.Object('quantumgenerator2','qfoam','Quantum Field Actuator','Quantum Field Actuators',
		[0,0,100,0,0,0],[0,0,1.02,0,0,0],[0,0,1.2,0,0,0],0,[0,0,50,0,0,0],[100,10,100000000,100000000,100000000,100000000]);
	new Game.Object('quantumgenerator3','qfoam','Quantum Field Fluctuator','Quantum Field Fluctuators',
		[0,0,1000,0,0,0],[0,0,1.02,0,0,0],[0,0,15,0,0,0],0,[0,0,500,0,0,0],[100,10,100000000,100000000,100000000,100000000]);
	new Game.Object('elementary1','elementary','Sphaleron','Sphalerons',
		[0,0,5000,0,0,0],[0,0,1,0,0,0],[0,0,0,1,0,0],0,[0,0,2000,0,0,0],[100,100000000,100000000,100000000,100000000,100000000]);
	new Game.Object('elementary2','elementary','Symmetry Violator','Symmetry Violators',
		[0,0,20000,0,0,0],[0,0,1,0,0,0],[0,0,0,7,0,0],0,[0,0,15000,0,0,0],[100,100000000,100000000,100000000,100000000,100000000]);
	new Game.Object('elementary3','elementary','Quark Mixing Matrix','Quark Mixing Matrices',
		[0,0,80000,0,0,0],[0,0,1,0,0,0],[0,0,0,35,0,0],0,[0,0,50000,0,0,0],[100,100000000,100000000,100000000,100000000,100000000]);
	new Game.Object('subatomic1','subatomic','Spin Operator','Spin Operators',
		[0,0,0,555,0,0],[0,0,0,1,0,0],[0,0,0,0,0.33,0],0,[0,0,0,255,0,0],[100,100000000,100000000,100000000,100000000,100000000]);
	new Game.Object('subatomic2','subatomic','Strong Interaction','Strong Interactions',
		[0,0,0,5555,0,0],[0,0,0,1,0,0],[0,0,0,0,4.44,0],0,[0,0,0,2555,0,0],[100,100000000,100000000,100000000,100000000,100000000]);
	new Game.Object('subatomic3','subatomic','Relativistic Renormalizer','Relativistic Renormalizers',
		[0,0,0,55555,0,0],[0,0,0,1,0,0],[0,0,0,0,55.5,0],0,[0,0,0,25555,0,0],[100,100000000,100000000,100000000,100000000,100000000]);
	new Game.Object('atom1','atom','Hydrogen Condenser','Hydrogen Condenser',
		[0,0,0,0,90,0],[0,0,0,0,0.998,0],[0,0,0,0,0,1],0,[0,0,0,0,45,0],[100,100000000,100000000,100000000,100000000,100000000]);
	new Game.Object('atom2','atom','Isotope Organizer','Isotope Organizers',
		[0,0,0,0,1800,0],[0,0,0,0,0.998,0],[0,0,0,0,0,17.5],0,[0,0,0,0,900,0],[100,100000000,100000000,100000000,100000000,100000000]);
	new Game.Object('atom3','atom','Quantum Degenerator','Quantum Degenerators',
		[0,0,0,0,36000,0],[0,0,0,0,0.998,0],[0,0,0,0,0,350],0,[0,0,0,0,18000,0],[100,100000000,100000000,100000000,100000000,100000000]);
	new Game.Object('atom4','atom','Heavy Element Engine (Star)','Heavy Element Engines (Stars)',
		[0,0,0,0,0,720000],[0,0,0,0,0,0.998],[0,0,0,0,0,7000],0,[0,0,0,0,360000,0],[100,100000000,100000000,100000000,100000000,100000000]);

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
	Game.Rates = starting_point.slice();
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
		var amounts = starting_point.slice();
		for (var i = 0; i < amounts.length; i++ ) {
			amounts[i] = Game.Rates[i]/Game.FPS;
		}
		Game.Produce(amounts);
	}
}

Game.getCost = function(item,number)
{
	var prices = starting_point.slice();
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
		//// check if minimum requirements are met
			lookup(generator.id + '_button').style = 'display:block;';
		} else {
			lookup(generator.id + '_button').style = 'display:none;';
		}
	}

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
	
	var items = Game.Currencies.slice(2,Game.Currencies.length);
	for (var j in items) {
		var item = items[j][2];
		try{throw item}
		catch(thing){
			AddEvent(lookup(thing + '_button'),'click',function(what){return function(e){Game.ActiveItem = thing;};}(thing));
		}
	}
}

Game.GeneratorMenu = function() {
	var generatortable = [];
 	for (var i in Game.Objects) {
 		var generator = Game.Objects[i];
 		generatortable += '<div id="' + generator.id + '_button" class="generatorbutton active" style="display:none;">';
  		generatortable += '<div id="' + generator.id + '_number" class="generatornumber"></div>'; 		
  		generatortable += '<div id="' + generator.id + '_title" class="generatortitle">'+generator.plural+'</div>';
		generatortable += '<div class="eachcosts">Making 1 costs</div>';
		generatortable += '<div id="' + generator.id + '_cost" class="generatorcost"></div>';
		generatortable += '<div class="generating">Generating</div>';
		generatortable += '<div id="' + generator.id + '_production" class="generatorproduction"></div>';
 		generatortable += '</div>';
 	}
 	lookup('generators').innerHTML = generatortable;
 	
	for (var k in Game.Objects) {
		var generator = Game.Objects[k];
		AddEvent(lookup(generator.id + '_button'),'click',function(what){return function(e){Game.Purchase(what,1);};}(generator.singular));
	}
}

window.onload = function()
{
	Game.Load();
}

// DELETE BEFORE RELEASE (this is so I can speed up production using the A/W/E/F keys)
document.addEventListener('keydown',function(event) {
    var control = 0;
    if (event.keyCode == 65 || event.keyCode == 87 || event.keyCode == 69 || event.keyCode == 70) { // A/W/E/F
		var amounts = starting_point.slice();
		for (var i = 0; i < amounts.length; i++ ) {
			amounts[i] = 30 * Game.Rates[i]/Game.FPS; //30 seconds worth of FPS
		}
		Game.Produce(amounts);
    }
});
