Univ.LoadItems = function(){
// singular,plural,type,number,production_rate,consumption_rate
	new Univ.Item('Second','Seconds','secs',0,0,0);
	new Univ.Item('Kelvin','Kelvin','kelvin',0,0,0);
	new Univ.Item('Quantum Foam','Quantum Foam','qfoam',88,0,0);	// start with 90 Quantum Foam for testing
	new Univ.Item('Elementary Particle','Elementary Particles','elementary',0,0,0);
	new Univ.Item('Subatomic Particle','Subatomic Particles','subatomic',0,0,0);
	new Univ.Item('Atom','Atoms','atom',0,0,0);
}

Univ.LoadObjects = function(){
//	unique ID, type, Singular Name, Plural Name, number, Visibility Fcn, Cost Fcn, Production Fcn, Consumption Fcn
 	new Univ.Object('quantumgenerator1','qfoam','Quantum Field Equation','Quantum Field Equations',0,
		function(){ // isVisible
			return 1;
		},
		function(howmany){ // costs
			var prices = {
				qfoam: Math.ceil(10 * Math.pow(1.02,this.activenumber)) // doesn't work for buying more than 1
			}
			return prices;
		},
		function(number){ // production
			var production = {
				qfoam: 0.1 * number
			}
			return production;
		},
		function(){ // consumption
			var consumption = {}
			return consumption;
		});
	new Univ.Object('quantumgenerator2','qfoam','Quantum Field Actuator','Quantum Field Actuators',0,
		function(){ // isVisible
			return 1;
		},
		function(howmany){ // costs
			var prices = {
				qfoam: Math.ceil(100 * Math.pow(1.02,this.number))  // doesn't work for buying more than 1
			}
			return prices;
		},
		function(number){ // production
			var production = {
				qfoam: 1.2 * number
			}
			return production;
		},
		function(number){ // consumption
			var consumption = {}
			return consumption;
		});
	new Univ.Object('quantumgenerator3','qfoam','Quantum Field Fluctuator','Quantum Field Fluctuators',0,
		function(){ // isVisible
			return 1;
		},
		function(howmany){ // costs
			var prices = {
				qfoam: Math.ceil(1000 * Math.pow(1.02,this.number)) // doesn't work for buying more than 1
			}
			return prices;
		},
		function(number){ // production
			var production = {
				qfoam: 15 * number
			}
			return production;
		},
		function(number){ // consumption
			var consumption = {}
			return consumption;
		});
	new Univ.Object('elementary1','elementary','Sphaleron','Sphalerons',0,
		function(){ // isVisible
			return 1;
		},
		function(howmany){ // costs
			var prices = {
				qfoam: 5000 * howmany
			}
			return prices;
		},
		function(number){ // production
			var production = {
				elementary: 1 * number
			}
			return production;
		},
		function(number){ // consumption
			var consumption = {
				qfoam: 4 * number
			}
			return consumption;
		});
	new Univ.Object('elementary2','elementary','Symmetry Violator','Symmetry Violators',0,
		function(){ // isVisible
			return 1;
		},
		function(howmany){ // costs
			var prices = {
				qfoam: 20000 * howmany
			}
			return prices;
		},
		function(number){ // production
			var production = {
				elementary: 7 * number
			}
			return production;
		},
		function(number){ // consumption
			var consumption = {
				qfoam: 14 * number
			}
			return consumption;
		});
	new Univ.Object('elementary3','elementary','Quark Mixing Matrix','Quark Mixing Matrices',0,
		function(){ // isVisible
			return 1;
		},
		function(howmany){ // costs
			var prices = {
				qfoam: 80000 * howmany
			}
			return prices;
		},
		function(number){ // production
			var production = {
				elementary: 35 * number
			}
			return production;
		},
		function(number){ // consumption
			var consumption = {
				qfoam: 35 * number
			}
			return consumption;
		});
	new Univ.Object('subatomic1','subatomic','Spin Operator','Spin Operators',0,
		function(){ // isVisible
			return 1;
		},
		function(howmany){ // costs
			var prices = {
				elementary: 555 * howmany
			}
			return prices;
		},
		function(number){ // production
			var production = {
				subatomic: 0.333 * number
			}
			return production;
		},
		function(number){ // consumption
			var consumption = {
				elementary: 1 * number
			}
			return consumption;
		});
	new Univ.Object('subatomic2','subatomic','Strong Interaction','Strong Interactions',0,
		function(){ // isVisible
			return 1;
		},
		function(howmany){ // costs
			var prices = {
				elementary: 5555 * howmany
			}
			return prices;
		},
		function(number){ // production
			var production = {
				subatomic: 4.333 * number
			}
			return production;
		},
		function(number){ // consumption
			var consumption = {
				elementary: 13 * number
			}
			return consumption;
		});
	new Univ.Object('subatomic3','subatomic','Relativistic Renormalizer','Relativistic Renormalizers',0,
		function(){ // isVisible
			return 1;
		},
		function(howmany){ // costs
			var prices = {
				elementary: 55555 * howmany
			}
			return prices;
		},
		function(number){ // production
			var production = {
				subatomic: 55.333 * number
			}
			return production;
		},
		function(number){ // consumption
			var consumption = {
				elementary: 166 * number
			}
			return consumption;
		});
	new Univ.Object('atom1','atom','Hydrogen Condenser','Hydrogen Condensers',0,
		function(){ // isVisible
			return 1;
		},
		function(howmany){ // costs
			var prices = {
				subatomic: Math.ceil(90 * Math.pow(0.998,this.number)) // doesn't work for buying more than 1
			}
			return prices;
		},
		function(number){ // production
			var production = {
				atom: 1 * number
			}
			return production;
		},
		function(number){ // consumption
			var consumption = {
				subatomic: 1 * number
			}
			return consumption;
		});
	new Univ.Object('atom2','atom','Isotope Organizer','Isotope Organizers',0,
		function(){ // isVisible
			return 1;
		},
		function(howmany){ // costs
			var prices = {
				subatomic: Math.ceil(1800 * Math.pow(0.998,this.number)) // doesn't work for buying more than 1
			}
			return prices;
		},
		function(number){ // production
			var production = {
				atom: 17.5 * number
			}
			return production;
		},
		function(number){ // consumption
			var consumption = {
				subatomic: 25 * number
			}
			return consumption;
		});
	new Univ.Object('atom3','atom','Quantum Degenerator','Quantum Degenerators',0,
		function(){ // isVisible
			return 1;
		},
		function(howmany){ // costs
			var prices = {
				subatomic: Math.ceil(36000 * Math.pow(0.998,this.number)) // doesn't work for buying more than 1
			}
			return prices;
		},
		function(number){ // production
			var production = {
				atom: 350 * number
			}
			return production;
		},
		function(number){ // consumption
			var consumption = {
				subatomic: 500 * number
			}
			return consumption;
		});
	new Univ.Object('atom4','atom','Heavy Element Engine (Star)','Heavy Element Engines (Stars)',0,
		function(){ // isVisible
			return 1;
		},
		function(howmany){ // costs
			var prices = {
				atom: Math.ceil(720000 * Math.pow(0.998,this.number)) // doesn't work for buying more than 1
			}
			return prices;
		},
		function(number){ // production
			var production = {
				atom: 7000 * number
			}
			return production;
		},
		function(number){ // consumption
			var consumption = {
//				subatomic: 8000 * number,
				atom: 3000 * number // to simulate turning lower elements into higher ones? -- probably unnecessary
			}
			return consumption;
		});
}