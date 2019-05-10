Univ.LoadUpgrades = function(){
// id,name,items_affected,type,generator,magnitude of effect,infoblurb,costFcn,VisibilityFcn

/**
TYPES:
	'speed'			: Changes the production interval of a generator
	'multiply'		: Multiplies Cost, Production, and Consumption by magnitude. Magnitude can be a function.
	'add'			: Adds magnitude to Cost, Production, and Consumption before multiplying. Magnitude can be a function.
	'efficiency'	: Multiplies Consumption by factor
	'costMult'		: Multiplies Costs by factor
	'action'		: Does something when checked. Magnitude must be a function. If we want to pass arguments, we can add them in.

Types should be in the format of {affected function}|{upgrade type}
	e.g. 'production|multiply' would multiply the production of the chosen generator by magnitude
**/

new Univ.GeneratorUpgrade('qfoam_rateupgrade_1','Upgrade 1','qfoam','production|multiply',
	'qfoam1|qfoam2|qfoam3|qfoam4|qfoam5|qfoam6|qfoam7|qfoam8|qfoam8|qfoam9|qfoam10',1.1,
	'Increases the Quantum Foam production rate of Generators by 10%.',
	function(){ // cost
		var prices = {
			qfoam: 100
		}
		return prices;
	},
	{}, // crystals
	function(){ // visibility
		var vis = 0;
		if (!this.bought && Univ.Objects['qfoam1'].number >= 10){
			vis = 1;
		}
		return vis;
	});
new Univ.GeneratorUpgrade('qfoam_rateupgrade_2','Upgrade 2','qfoam','production|multiply',
	'qfoam1|qfoam2|qfoam3|qfoam4|qfoam5|qfoam6|qfoam7|qfoam8|qfoam8|qfoam9|qfoam10',1.2,
	'Increases the Quantum Foam production rate of Generators by 20%.',
	function(){ // cost
		var prices = {
			qfoam: 200
		}
		return prices;
	},
	{}, // crystals
	function(){ // visibility
		var vis = 0;
		if (!this.bought && Univ.Objects['qfoam1'].number >= 20){
			vis = 1;
		}
		return vis;
	});
new Univ.GeneratorUpgrade('qfoam_rateupgrade_3','Upgrade 3','qfoam','production|multiply',
	'qfoam1|qfoam2|qfoam3|qfoam4|qfoam5|qfoam6|qfoam7|qfoam8|qfoam8|qfoam9|qfoam10',1.4,
	'Increases the Quantum Foam production rate of Generators by 40%.',
	function(){ // cost
		var prices = {
			qfoam: 400
		}
		return prices;
	},
	{ // crystals
		red: 1
	},
	function(){ // visibility
		var vis = 0;
		if (!this.bought && Univ.Objects['qfoam2'].number >= 10){
			vis = 1;
		}
		return vis;
	});
new Univ.GeneratorUpgrade('qfoam_rateupgrade_4','Upgrade 4','qfoam','production|multiply',
	'qfoam1|qfoam2|qfoam3|qfoam4|qfoam5|qfoam6|qfoam7|qfoam8|qfoam8|qfoam9|qfoam10',1.6,
	'Increases the Quantum Foam production rate of Generators by 60%.',
	function(){ // cost
		var prices = {
			qfoam: 800
		}
		return prices;
	},
	{ // crystals
		red: 1
	},
	function(){ // visibility
		var vis = 0;
		if (!this.bought && Univ.Objects['qfoam3'].number >= 10){
			vis = 1;
		}
		return vis;
	});
new Univ.GeneratorUpgrade('qfoam_rateupgrade_5','Upgrade 5','qfoam','production|multiply',
	'qfoam1|qfoam2|qfoam3|qfoam4|qfoam5|qfoam6|qfoam7|qfoam8|qfoam8|qfoam9|qfoam10',2,
	'Doubles the Quantum Foam production rate of Generators.',
	function(){ // cost
		var prices = {
			qfoam: 1600
		}
		return prices;
	},
	{ // crystals
		red: 1
	},
	function(){ // visibility
		var vis = 0;
		if (!this.bought && Univ.Objects['qfoam4'].number >= 10){
			vis = 1;
		}
		return vis;
	});
new Univ.GeneratorUpgrade('qfoam_rateupgrade_6','Upgrade 6','qfoam','production|multiply',
	'qfoam1|qfoam2|qfoam3|qfoam4|qfoam5|qfoam6|qfoam7|qfoam8|qfoam8|qfoam9|qfoam10',3,
	'Triples the Quantum Foam production rate of Generators.',
	function(){ // cost
		var prices = {
			qfoam: 3200
		}
		return prices;
	},
	{ // crystals
		red: 1
	},
	function(){ // visibility
		var vis = 0;
		if (!this.bought && Univ.Objects['qfoam5'].number >= 10){
			vis = 1;
		}
		return vis;
	});
new Univ.GeneratorUpgrade('qfoam_rateupgrade_7','Upgrade 7','qfoam','production|multiply',
	'qfoam1|qfoam2|qfoam3|qfoam4|qfoam5|qfoam6|qfoam7|qfoam8|qfoam8|qfoam9|qfoam10',4,
	'Multiplies the Quantum Foam production rate of Generators by 4.',
	function(){ // cost
		var prices = {
			qfoam: 6400
		}
		return prices;
	},
	{ // crystals
		red: 1
	},
	function(){ // visibility
		var vis = 0;
		if (!this.bought && Univ.Objects['qfoam6'].number >= 10){
			vis = 1;
		}
		return vis;
	});
new Univ.GeneratorUpgrade('qfoam_rateupgrade_8','Upgrade 8','qfoam','production|multiply',
	'qfoam1|qfoam2|qfoam3|qfoam4|qfoam5|qfoam6|qfoam7|qfoam8|qfoam8|qfoam9|qfoam10',5,
	'Multiplies the Quantum Foam production rate of Generators by 5.',
	function(){ // cost
		var prices = {
			qfoam: 12800
		}
		return prices;
	},
	{ // crystals
		red: 1
	},
	function(){ // visibility
		var vis = 0;
		if (!this.bought && Univ.Objects['qfoam7'].number >= 10){
			vis = 1;
		}
		return vis;
	});
new Univ.GeneratorUpgrade('qfoam_rateupgrade_9','Upgrade 9','qfoam','production|multiply',
	'qfoam1|qfoam2|qfoam3|qfoam4|qfoam5|qfoam6|qfoam7|qfoam8|qfoam8|qfoam9|qfoam10',6,
	'Multiplies the Quantum Foam production rate of Generators by 6.',
	function(){ // cost
		var prices = {
			qfoam: 25400
		}
		return prices;
	},
	{ // crystals
		red: 1
	},
	function(){ // visibility
		var vis = 0;
		if (!this.bought && Univ.Objects['qfoam8'].number >= 10){
			vis = 1;
		}
		return vis;
	});
new Univ.GeneratorUpgrade('qfoam_rateupgrade_10','Upgrade 10','qfoam','production|multiply',
	'qfoam1|qfoam2|qfoam3|qfoam4|qfoam5|qfoam6|qfoam7|qfoam8|qfoam8|qfoam9|qfoam10',8,
	'Multiplies the Quantum Foam production rate of Generators by 8.',
	function(){ // cost
		var prices = {
			qfoam: 50000
		}
		return prices;
	},
	{ // crystals
		red: 1
	},
	function(){ // visibility
		var vis = 0;
		if (!this.bought && Univ.Objects['qfoam9'].number >= 10){
			vis = 1;
		}
		return vis;
	});
new Univ.GeneratorUpgrade('qfoam_rateupgrade_11','Upgrade 11','qfoam','production|multiply',
	'qfoam1|qfoam2|qfoam3|qfoam4|qfoam5|qfoam6|qfoam7|qfoam8|qfoam8|qfoam9|qfoam10',10,
	'Multiplies the Quantum Foam production rate of Generators by 10.',
	function(){ // cost
		var prices = {
			qfoam: 98000
		}
		return prices;
	},
	{ // crystals
		red: 1
	},
	function(){ // visibility
		var vis = 0;
		if (!this.bought && Univ.Objects['qfoam10'].number >= 10){
			vis = 1;
		}
		return vis;
	});


// new Univ.GeneratorUpgrade('qfoam1_intervalupgrade_1','Upgrade A','qfoam','interval|add','qfoam1',-1/2,
// 	'Shortens the Interval between Quantum Foam production by Quantum Field Equations.',
// 	function(){ // cost
// 		var prices = {
// 			qfoam: 500
// 		}
// 		return prices;
// 	},
// 	function(){ // visibility
// 		var vis = 0;
// 		if (!this.bought && Univ.Objects['qfoam1'].number >= 25){
// 			vis = 1;	
// 		}
// 		return vis;
// 	});
// new Univ.GeneratorUpgrade('qfoam1_intervalupgrade_2','Upgrade B','qfoam','interval|add','qfoam1',-1/2,
// 	'Shortens the Interval between Quantum Foam production by Quantum Field Equations.',
// 	function(){ // cost
// 		var prices = {
// 			qfoam: 1000
// 		}
// 		return prices;
// 	},
// 	function(){ // visibility
// 		var vis = 0;
// 		if (!this.bought && Univ.Objects['qfoam1'].number >= 50){
// 			vis = 1;	
// 		}
// 		return vis;
// 	});
// new Univ.GeneratorUpgrade('qfoam1_intervalupgrade_3','Upgrade C','qfoam','interval|add','qfoam1',-1/3,
// 	'Shortens the Interval between Quantum Foam production by Quantum Field Equations.',
// 	function(){ // cost
// 		var prices = {
// 			qfoam: 2000
// 		}
// 		return prices;
// 	},
// 	function(){ // visibility
// 		var vis = 0;
// 		if (!this.bought && Univ.Objects['qfoam1'].number >= 100){
// 			vis = 1;	
// 		}
// 		return vis;
// 	});
// new Univ.GeneratorUpgrade('qfoam1_intervalupgrade_4','Upgrade D','qfoam','interval|add','qfoam1',-1/3,
// 	'Shortens the Interval between Quantum Foam production by Quantum Field Equations.',
// 	function(){ // cost
// 		var prices = {
// 			qfoam: 5000
// 		}
// 		return prices;
// 	},
// 	function(){ // visibility
// 		var vis = 0;
// 		if (!this.bought && Univ.Objects['qfoam1'].number >= 150){
// 			vis = 1;	
// 		}
// 		return vis;
// 	});
// new Univ.GeneratorUpgrade('qfoam1_intervalupgrade_5','Upgrade E','qfoam','interval|add','qfoam1',-1/3,
// 	'Shortens the Interval between Quantum Foam production by Quantum Field Equations.',
// 	function(){ // cost
// 		var prices = {
// 			qfoam: 10000
// 		}
// 		return prices;
// 	},
// 	function(){ // visibility
// 		var vis = 0;
// 		if (!this.bought && Univ.Objects['qfoam1'].number >= 200){
// 			vis = 1;	
// 		}
// 		return vis;
// 	});
// 
// 
// 
// 
// // Quantum Field Fluctuators
// new Univ.GeneratorUpgrade('qfoam2_rateupgrade_1','Upgrade 1','qfoam','production|multiply','qfoam2',2,
// 	'Increases the Quantum Foam production of Quantum Field Fluctuators.',
// 	function(){ // cost
// 		var prices = {
// 			qfoam: 10000
// 		}
// 		return prices;
// 	},
// 	function(){ // visibility
// 		var vis = 0;
// 		if (!this.bought && Univ.Objects['qfoam2'].number >= 10){
// 			vis = 1;
// 		}
// 		return vis;
// 	});
// new Univ.GeneratorUpgrade('qfoam2_rateupgrade_2','Upgrade 2','qfoam','production|multiply','qfoam2',3,
// 	'Increases the Quantum Foam production of Quantum Field Fluctuators.',
// 	function(){ // cost
// 		var prices = {
// 			qfoam: 100000
// 		}
// 		return prices;
// 	},
// 	function(){ // visibility
// 		var vis = 0;
// 		if (!this.bought && Univ.Objects['qfoam2'].number >= 30){
// 			vis = 1;
// 		}
// 		return vis;
// 	});
// new Univ.GeneratorUpgrade('qfoam2_rateupgrade_3','Upgrade 3','qfoam','production|multiply','qfoam2',4,
// 	'Increases the Quantum Foam production of Quantum Field Fluctuators.',
// 	function(){ // cost
// 		var prices = {
// 			qfoam: 1000000
// 		}
// 		return prices;
// 	},
// 	function(){ // visibility
// 		var vis = 0;
// 		if (!this.bought && Univ.Objects['qfoam2'].number >= 60){
// 			vis = 1;
// 		}
// 		return vis;
// 	});
// 	
// 	
}