Univ.LoadItems = function(){
// singular,plural,type,number,production_rate,consumption_rate
	new Univ.Item('Second','Seconds','secs',0,0,0);
	new Univ.Item('Kelvin','Kelvin','kelvin',0,0,0);
	new Univ.Item('Computation','Computations','computation',0,0,0);
	new Univ.Item('Quantum Foam','Quantum Foam','qfoam',90,0,0);	// start with 90 Quantum Foam for testing
	new Univ.Item('Elementary Particle','Elementary Particles','elementary',0,0,0);
	new Univ.Item('Subatomic Particle','Subatomic Particles','subatomic',0,0,0);
	new Univ.Item('Light Atom','Light Atoms','lightatom',0,0,0);
	new Univ.Item('Heavy Atom','Heavy Atoms','heavyatom',0,0,0);
	new Univ.Item('Gas Cloud','Gas Clouds','gascloud',0,0,0);
	new Univ.Item('Nebula','Nebulae','nebula',0,0,0);
	new Univ.Item('Star','Stars','star',0,0,0);
	new Univ.Item('Galaxy','Galaxies','galaxy',0,0,0);
	new Univ.Item('Galactic Cluster','Galactic Clusters','galaxycluster',0,0,0);
	new Univ.Item('Supercluster','Superclusters','supercluster',0,0,0);
	new Univ.Item('Planet','Planets','planet',0,0,0);
	new Univ.Item('Habitable Planet','Habitable Planets','habitableplanet',0,0,0);
	new Univ.Item('Molecule of Life','Molecules of Life','molecule',0,0,0);
	new Univ.Item('Homeworld','Homeworlds','homeworld',0,0,0);
	new Univ.Item('Unicellular Organism','Unicellular Organisms','unicellular',0,0,0);
	new Univ.Item('Multicellular Organism','Multicellular Organisms','multicellular',0,0,0);
	new Univ.Item('Sentient Organism','Sentient Organisms','sentient',0,0,0);
	new Univ.Item('Computing Machine','Computing Machines','computer',0,0,0);
	new Univ.Item('Planetary Computer','Planetary Computers','planetaryAC',0,0,0);
	new Univ.Item('Matrioshka Brain','Matrioshka Brains','matrioshka',0,0,0);
	new Univ.Item('Galactic Computer','Galactic Computer','galacticAC',0,0,0);
	new Univ.Item('Galactic LAN Party','Galactic LAN Parties','superclusterAC',0,0,0);
	new Univ.Item('Universal Computer','Universal Computer','universalAC',0,0,0);
	new Univ.Item('Cosmic Computer','Cosmic Computer','cosmicAC',0,0,0);
}

Univ.LoadObjects = function(){
//	unique ID, type, Singular Name, Plural Name, number, InfoBlurb, Visibility Fcn, Cost Fcn, Production Fcn, Consumption Fcn
 	new Univ.Object('quantumgenerator1','qfoam','Quantum Field Equation','Quantum Field Equations',0,
 		'Quantum Field Equations are the most basic production unit. Use them to generate Quantum Foam out of nothing.',
		function(){ // isVisible
			return 1;
		},
		function(howmany){ // costs
			var prices = {
				qfoam: Math.ceil(10 * Math.pow(0.999,this.activenumber)) // doesn't work for buying more than 1
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
	new Univ.Object('quantumgenerator2','qfoam','Quantum Field Fluctuator','Quantum Field Fluctuators',0,
	'Quantum Field Fluctuators generate more Quantum Foam, faster.',
		function(){ // isVisible
			return 1;
		},
		function(howmany){ // costs
			var prices = {
				qfoam: Math.ceil(100 * Math.pow(0.999,this.number))  // doesn't work for buying more than 1
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
	new Univ.Object('quantumgenerator3','qfoam','Quantum Field Actuator','Quantum Field Actuators',0,
	'Quantum Field Actuators generate even more Quantum Foam, even faster. It\'s what the people want. Well, people don\'t exist yet, but they would love this stuff.',
		function(){ // isVisible
			return 1;
		},
		function(howmany){ // costs
			var prices = {
				qfoam: Math.ceil(1000 * Math.pow(0.999,this.number)) // doesn't work for buying more than 1
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
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
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
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
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
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
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
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
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
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
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
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
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
	new Univ.Object('lightatom1','lightatom','Hydrogen Condenser','Hydrogen Condensers',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return 1;
		},
		function(howmany){ // costs
			var prices = {
				subatomic: 90
			}
			return prices;
		},
		function(number){ // production
			var production = {
				lightatom: 1 * number
			}
			return production;
		},
		function(number){ // consumption
			var consumption = {
				subatomic: 1 * number
			}
			return consumption;
		});
	new Univ.Object('lightatom2','lightatom','Isotope Organizer','Isotope Organizers',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return 1;
		},
		function(howmany){ // costs
			var prices = {
				subatomic: 1800
			}
			return prices;
		},
		function(number){ // production
			var production = {
				lightatom: 17.5 * number
			}
			return production;
		},
		function(number){ // consumption
			var consumption = {
				subatomic: 25 * number
			}
			return consumption;
		});
	new Univ.Object('lightatom3','lightatom','Quantum Degenerator','Quantum Degenerators',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return 1;
		},
		function(howmany){ // costs
			var prices = {
				subatomic: 36000
			}
			return prices;
		},
		function(number){ // production
			var production = {
				lightatom: 350 * number
			}
			return production;
		},
		
		
		//Univ.Items['gascloud'].number;
		//Univ.Items['lightatom'].number = 149900000;

		
		function(number){ // consumption
			var consumption = {
				subatomic: 500 * number
			}
			return consumption;
		});
		new Univ.Object('gascloud1','gascloud','Interstellar Medium','Interstellar Medium',0,
		'Some say it can predict the future.',
		function(){ // isVisible
			return 1;
		},
		function(howmany){ // costs
			var prices = {
				lightatom: 10000000 * howmany
			}
			return prices;
		},
		function(number){ // production
			var production = {
				gascloud: 0.01 * number
			}
			return production;
		},
		function(number){ // consumption
			var consumption = {
				lightatom: 150000000 * number
			}
			return consumption;
		});
		new Univ.Object('gascloud2','gascloud','Interstellar Large','Interstellar Large',0,
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return 1;
		},
		function(howmany){ // costs
			var prices = {
				lightatom: 40000000 * howmany
			}
			return prices;
		},
		function(number){ // production
			var production = {
				gascloud: 0.05 * number
			}
			return production;
		},
		function(number){ // consumption
			var consumption = {
				lightatom: 150000000 * 4.5 * number
			}
			return consumption;
		});
		new Univ.Object('gascloud3','gascloud','Interstellar XL','Interstellar XL',0,
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return 1;
		},
		function(howmany){ // costs
			var prices = {
				lightatom: 160000000 * howmany
			}
			return prices;
		},
		function(number){ // production
			var production = {
				gascloud: 0.25 * number
			}
			return production;
		},
		function(number){ // consumption
			var consumption = {
				lightatom: 150000000 * 18 * number
			}
			return consumption;
		});
		new Univ.Object('nebula1','nebula','Nebulizer','Nebulizers',0,
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return 1;
		},
		function(howmany){ // costs
			var prices = {
				gascloud: 200 * howmany
			}
			return prices;
		},
		function(number){ // production
			var production = {
				nebula: 0.001 * number
			}
			return production;
		},
		function(number){ // consumption
			var consumption = {
				gascloud: 0.020 * number
			}
			return consumption;
		});
		new Univ.Object('nebula2','nebula','Rosette Polarizer','Rosette Polarizers',0,
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return 1;
		},
		function(howmany){ // costs
			var prices = {
				gascloud: 2000 * howmany
			}
			return prices;
		},
		function(number){ // production
			var production = {
				nebula: 0.012 * number
			}
			return production;
		},
		function(number){ // consumption
			var consumption = {
				gascloud: 0.240 * number
			}
			return consumption;
		});
		new Univ.Object('nebula3','nebula','Orionizer','Orionizers',0,
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return 1;
		},
		function(howmany){ // costs
			var prices = {
				gascloud: 20000 * howmany
			}
			return prices;
		},
		function(number){ // production
			var production = {
				nebula: 0.0150 * number
			}
			return production;
		},
		function(number){ // consumption
			var consumption = {
				gascloud: 3 * number
			}
			return consumption;
		});
		new Univ.Object('star1','star','Core Nucleator','Core Nucleators',0,
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return 1;
		},
		function(howmany){ // costs
			var prices = {
				nebula: 123 * howmany
			}
			return prices;
		},
		function(number){ // production
			var production = {
				star: 0.1 * number
			}
			return production;
		},
		function(number){ // consumption
			var consumption = {
				nebula: 0.0333 * number
			}
			return consumption;
		});
		new Univ.Object('star2','star','Bok Globule','Bok Globules',0,
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return 1;
		},
		function(howmany){ // costs
			var prices = {
				nebula: 1234 * howmany
			}
			return prices;
		},
		function(number){ // production
			var production = {
				star: 0.05 * number
			}
			return production;
		},
		function(number){ // consumption
			var consumption = {
				nebula: 0.01 * number
			}
			return consumption;
		});
		new Univ.Object('star3','star','Stellar Nursery','Stellar Nurseries',0,
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return 1;
		},
		function(howmany){ // costs
			var prices = {
				nebula: 12345 * howmany
			}
			return prices;
		},
		function(number){ // production
			var production = {
				star: 0.025 * number
			}
			return production;
		},
		function(number){ // consumption
			var consumption = {
				nebula: 0.00333 * number
			}
			return consumption;
		});
		new Univ.Object('heavyatom1','heavyatom','Main Sequence Ignition','Main Sequence Ignition',0,
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return 1;
		},
		function(howmany){ // costs
			var prices = {
				star: 155 * howmany
			}
			return prices;
		},
		function(number){ // production
			var production = {
				heavyatom: 9000000 * number
			}
			return production;
		},
		function(number){ // consumption
			var consumption = {
				lightatom: 150000000 * number
			}
			return consumption;
		});
		new Univ.Object('heavyatom2','heavyatom','Convection Zoning Law','Convection Zoning Laws',0,
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return 1;
		},
		function(howmany){ // costs
			var prices = {
				star: 1777 * howmany
			}
			return prices;
		},
		function(number){ // production
			var production = {
				heavyatom: 900000000 * number
			}
			return production;
		},
		function(number){ // consumption
			var consumption = {
				lightatom: 15000000000 * number
			}
			return consumption;
		});
		new Univ.Object('heavyatom3','heavyatom','Cosmic Spallation','Cosmic Spallation',0,
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return 1;
		},
		function(howmany){ // costs
			var prices = {
				qfoam: 10000000 * howmany
			}
			return prices;
		},
		function(number){ // production
			var production = {
				heavyatom: 10000000 * number
			}
			return production;
		},
		function(number){ // consumption
			var consumption = {
				lightatom: 500000000 * number
			}
			return consumption;
		});
		new Univ.Object('heavyatom4','heavyatom','Supernova Spark','Supernova Sparks',0,
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return 1;
		},
		function(howmany){ // costs
			var prices = {
				star: 313 * howmany
			}
			return prices;
		},
		function(number){ // production
			var production = {
				heavyatom: 90000000000 * number
			}
			return production;
		},
		function(number){ // consumption
			var consumption = {
				star: 1000 * number
			}
			return consumption;
		});
		new Univ.Object('galaxy1','galaxy','Accretion Disco','Accretion Discos',0,
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return 1;
		},
		function(howmany){ // costs
			var prices = {
				star: 5000 * howmany
			}
			return prices;
		},
		function(number){ // production
			var production = {
				galaxy: 0.0001 * number
			}
			return production;
		},
		function(number){ // consumption
			var consumption = {
				star: 120 * number
			}
			return consumption;
		});
}