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

**/

new Univ.GeneratorUpgrade('qfoam_rateupgrade_1','Upgrade 1','qfoam','multiply','qfoam1',1.1,
	'Increases the Quantum Foam production of Quantum Field Equations.',
	function(){ // cost
		var prices = {
			qfoam: 100
		}
		return prices;
	},
	function(){ // visibility
		var vis = 0;
		if (!this.bought && Univ.Objects['qfoam1'].number >= 10){
			vis = 1;
		}
		return vis;
	});
new Univ.GeneratorUpgrade('qfoam_rateupgrade_2','Upgrade 2','qfoam','multiply','qfoam1',1.1,
	'Increases the Quantum Foam production of Quantum Field Equations.',
	function(){ // cost
		var prices = {
			qfoam: 200
		}
		return prices;
	},
	function(){ // visibility
		var vis = 0;
		if (!this.bought && Univ.Objects['qfoam1'].number >= 20){
			vis = 1;
		}
		return vis;
	});
new Univ.GeneratorUpgrade('qfoam_rateupgrade_3','Upgrade 3','qfoam','multiply','qfoam1',1.1,
	'Increases the Quantum Foam production of Quantum Field Equations.',
	function(){ // cost
		var prices = {
			qfoam: 400
		}
		return prices;
	},
	function(){ // visibility
		var vis = 0;
		if (!this.bought && Univ.Objects['qfoam1'].number >= 40){
			vis = 1;
		}
		return vis;
	});
new Univ.GeneratorUpgrade('qfoam_rateupgrade_4','Upgrade 4','qfoam','multiply','qfoam1',1.1,
	'Increases the Quantum Foam production of Quantum Field Equations.',
	function(){ // cost
		var prices = {
			qfoam: 800
		}
		return prices;
	},
	function(){ // visibility
		var vis = 0;
		if (!this.bought && Univ.Objects['qfoam1'].number >= 80){
			vis = 1;
		}
		return vis;
	});
new Univ.GeneratorUpgrade('qfoam_rateupgrade_5','Upgrade 5','qfoam','multiply','qfoam1',1.1,
	'Increases the Quantum Foam production of Quantum Field Equations.',
	function(){ // cost
		var prices = {
			qfoam: 1600
		}
		return prices;
	},
	function(){ // visibility
		var vis = 0;
		if (!this.bought && Univ.Objects['qfoam1'].number >= 160){
			vis = 1;
		}
		return vis;
	});
new Univ.GeneratorUpgrade('qfoam_intervalupgrade_1','Upgrade 6','qfoam','speed','qfoam1',1/2,
	'Shortens the Interval between Quantum Foam production by Quantum Field Equations.',
	function(){ // cost
		var prices = {
			qfoam: 500
		}
		return prices;
	},
	function(){ // visibility
		var vis = 0;
		if (!this.bought && Univ.Objects['qfoam1'].number >= 25){
			vis = 1;	
		}
		return vis;
	});
new Univ.GeneratorUpgrade('qfoam_intervalupgrade_2','Upgrade 7','qfoam','speed','qfoam1',1/2,
	'Shortens the Interval between Quantum Foam production by Quantum Field Equations.',
	function(){ // cost
		var prices = {
			qfoam: 1000
		}
		return prices;
	},
	function(){ // visibility
		var vis = 0;
		if (!this.bought && Univ.Objects['qfoam1'].number >= 50){
			vis = 1;	
		}
		return vis;
	});
new Univ.GeneratorUpgrade('qfoam_intervalupgrade_3','Upgrade 8','qfoam','speed','qfoam1',1/3,
	'Shortens the Interval between Quantum Foam production by Quantum Field Equations.',
	function(){ // cost
		var prices = {
			qfoam: 2000
		}
		return prices;
	},
	function(){ // visibility
		var vis = 0;
		if (!this.bought && Univ.Objects['qfoam1'].number >= 100){
			vis = 1;	
		}
		return vis;
	});
new Univ.GeneratorUpgrade('qfoam_intervalupgrade_4','Upgrade 9','qfoam','speed','qfoam1',1/3,
	'Shortens the Interval between Quantum Foam production by Quantum Field Equations.',
	function(){ // cost
		var prices = {
			qfoam: 5000
		}
		return prices;
	},
	function(){ // visibility
		var vis = 0;
		if (!this.bought && Univ.Objects['qfoam1'].number >= 150){
			vis = 1;	
		}
		return vis;
	});
new Univ.GeneratorUpgrade('qfoam_intervalupgrade_5','Upgrade 10','qfoam','speed','qfoam1',1/3,
	'Shortens the Interval between Quantum Foam production by Quantum Field Equations.',
	function(){ // cost
		var prices = {
			qfoam: 10000
		}
		return prices;
	},
	function(){ // visibility
		var vis = 0;
		if (!this.bought && Univ.Objects['qfoam1'].number >= 200){
			vis = 1;	
		}
		return vis;
	});
}