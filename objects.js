Univ.LoadItems = function(){
// singular,plural,type,number,rate
	new Univ.Item('Second','Seconds','secs',0,0);
	new Univ.Item('Kelvin','Kelvin','kelvin',0,0);
	new Univ.Item('Quantum Foam','Quantum Foam','qfoam',88,0);
	new Univ.Item('Elementary Particle','Elementary Particles','elementary',0,0);
	new Univ.Item('Subatomic Particle','Subatomic Particles','subatomic',0,0);
	new Univ.Item('Atom','Atoms','atom',0,0);
}

Univ.LoadObjects = function(){
//	unique ID, type, Singular Name, Plural Name, 
//	number, minimum requirements, maximum requirements
 	new Univ.Object('quantumgenerator1','qfoam','Quantum Field Equation','Quantum Field Equations',
		0,[0,0,0,0,0,0],[100,10,100000000,100000000,100000000,100000000],
		function(){ // isVisible
			return 1;
		},
		function(howmany){ // costs
			var prices = {
				qfoam: Math.ceil(10 * Math.pow(1.02,this.number))
			}
			return prices;
		},
		function(){ // costs
			var production = {
				qfoam: 0.1 * this.number
			}
			return production;
		});
	new Univ.Object('quantumgenerator2','qfoam','Quantum Field Actuator','Quantum Field Actuators',
		0,[0,0,50,0,0,0],[100,10,100000000,100000000,100000000,100000000],
		function(){ // isVisible
			return 1;
		},
		function(howmany){ // costs
			var prices = {
				qfoam: Math.ceil(100 * Math.pow(1.02,this.number))
			}
			return prices;
		},
		function(){ // costs
			var production = {
				qfoam: 1.2 * this.number
			}
			return production;
		});
	new Univ.Object('quantumgenerator3','qfoam','Quantum Field Fluctuator','Quantum Field Fluctuators',
		0,[0,0,500,0,0,0],[100,10,100000000,100000000,100000000,100000000],
		function(){ // isVisible
			return 1;
		},
		function(howmany){ // costs
			var prices = {
				qfoam: Math.ceil(1000 * Math.pow(1.02,this.number))
			}
			return prices;
		},
		function(){ // costs
			var production = {
				qfoam: 15 * this.number
			}
			return production;
		});
	new Univ.Object('elementary1','elementary','Sphaleron','Sphalerons',
		0,[0,0,2000,0,0,0],[100,100000000,100000000,100000000,100000000,100000000],
		function(){ // isVisible
			return 1;
		},
		function(howmany){ // costs
			var prices = {
				qfoam: 5000 * howmany
			}
			return prices;
		},
		function(){ // costs
			var production = {
				elementary: 1 * this.number
			}
			return production;
		});
	new Univ.Object('elementary2','elementary','Symmetry Violator','Symmetry Violators',
		0,[0,0,15000,0,0,0],[100,100000000,100000000,100000000,100000000,100000000],
		function(){ // isVisible
			return 1;
		},
		function(howmany){ // costs
			var prices = {
				qfoam: 20000 * howmany
			}
			return prices;
		},
		function(){ // costs
			var production = {
				elementary: 7 * this.number
			}
			return production;
		});
	new Univ.Object('elementary3','elementary','Quark Mixing Matrix','Quark Mixing Matrices',
		0,[0,0,50000,0,0,0],[100,100000000,100000000,100000000,100000000,100000000],
		function(){ // isVisible
			return 1;
		},
		function(howmany){ // costs
			var prices = {
				qfoam: 80000 * howmany
			}
			return prices;
		},
		function(){ // costs
			var production = {
				elementary: 35 * this.number
			}
			return production;
		});
	new Univ.Object('subatomic1','subatomic','Spin Operator','Spin Operators',
		0,[0,0,0,255,0,0],[100,100000000,100000000,100000000,100000000,100000000],
		function(){ // isVisible
			return 1;
		},
		function(howmany){ // costs
			var prices = {
				elementary: 555 * howmany
			}
			return prices;
		},
		function(){ // production
			var production = {
				subatomic: 0.333 * this.number
			}
			return production;
		});
	new Univ.Object('subatomic2','subatomic','Strong Interaction','Strong Interactions',
		0,[0,0,0,2555,0,0],[100,100000000,100000000,100000000,100000000,100000000],
		function(){ // isVisible
			return 1;
		},
		function(howmany){ // costs
			var prices = {
				elementary: 5555 * howmany
			}
			return prices;
		},
		function(){ // production
			var production = {
				subatomic: 4.444 * this.number
			}
			return production;
		});
	new Univ.Object('subatomic3','subatomic','Relativistic Renormalizer','Relativistic Renormalizers',
		0,[0,0,0,25555,0,0],[100,100000000,100000000,100000000,100000000,100000000],
		function(){ // isVisible
			return 1;
		},
		function(howmany){ // costs
			var prices = {
				elementary: 55555 * howmany
			}
			return prices;
		},
		function(){ // production
			var production = {
				subatomic: 55.555 * this.number
			}
			return production;
		});
	new Univ.Object('atom1','atom','Hydrogen Condenser','Hydrogen Condensers',
		0,[0,0,0,0,45,0],[100,100000000,100000000,100000000,100000000,100000000],
		function(){ // isVisible
			return 1;
		},
		function(howmany){ // costs
			var prices = {
				subatomic: 90 * Math.pow(0.998,this.number)
			}
			return prices;
		},
		function(){ // production
			var production = {
				atom: 1 * this.number
			}
			return production;
		});
	new Univ.Object('atom2','atom','Isotope Organizer','Isotope Organizers',
		0,[0,0,0,0,900,0],[100,100000000,100000000,100000000,100000000,100000000],
		function(){ // isVisible
			return 1;
		},
		function(howmany){ // costs
			var prices = {
				subatomic: 1800 * Math.pow(0.998,this.number)
			}
			return prices;
		},
		function(){ // production
			var production = {
				atom: 17.5 * this.number
			}
			return production;
		});
	new Univ.Object('atom3','atom','Quantum Degenerator','Quantum Degenerators',
		0,[0,0,0,0,18000,0],[100,100000000,100000000,100000000,100000000,100000000],
		function(){ // isVisible
			return 1;
		},
		function(howmany){ // costs
			var prices = {
				subatomic: 36000 * Math.pow(0.998,this.number)
			}
			return prices;
		},
		function(){ // production
			var production = {
				atom: 350 * this.number
			}
			return production;
		});
	new Univ.Object('atom4','atom','Heavy Element Engine (Star)','Heavy Element Engines (Stars)',
		0,[0,0,0,0,360000,0],[100,100000000,100000000,100000000,100000000,100000000],
		function(){ // isVisible
			return 1;
		},
		function(howmany){ // costs
			var prices = {
				atom: 720000 * Math.pow(0.998,this.number)
			}
			return prices;
		},
		function(){ // production
			var production = {
				atom: 7000 * this.number
			}
			return production;
		});
}