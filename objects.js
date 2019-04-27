Univ.LoadItems = function(){
// singular,plural,type,visibility,available_number,total_number,production_rate,consumption_rate
	new Univ.Item('Second','Seconds','secs',0,0,0,0,0);
	new Univ.Item('Kelvin','Kelvin','kelvin',0,0,0,0,0);
	new Univ.Item('Computation','Computations','computation',0,0,0,0,0);
	new Univ.Item('Quantum Foam','Quantum Foam','qfoam',1,100,100,0,0);	// start with 100 Quantum Foam for testing
	new Univ.Item('Elementary Particle','Elementary Particles','elementary',1,0,0,0,0);
	new Univ.Item('Subatomic Particle','Subatomic Particles','subatomic',1,0,0,0,0);
	new Univ.Item('Atom','Atoms','atom',1,0,0,0,0);
	new Univ.Item('Atom','Atoms','mediumatom',0,0,0,0,0);
	new Univ.Item('Atom','Atoms','heavyatom',0,0,0,0,0);
	new Univ.Item('Gas Cloud','Gas Clouds','gascloud',1,0,0,0,0);
	new Univ.Item('Nebula','Nebulae','nebula',1,0,0,0,0);
	new Univ.Item('Star','Stars','star',1,0,0,0,0);
	new Univ.Item('Galaxy','Galaxies','galaxy',1,0,0,0,0);
	new Univ.Item('Galactic Cluster','Galactic Clusters','galaxycluster',1,0,0,0,0);
	new Univ.Item('Supercluster','Superclusters','supercluster',1,0,0,0,0);
	new Univ.Item('Planet','Planets','planet',1,0,0,0,0);
	new Univ.Item('Habitable Planet','Habitable Planets','habitableplanet',1,0,0,0,0);
	new Univ.Item('Molecule of Life','Molecules of Life','molecule',1,0,0,0,0);
	new Univ.Item('Homeworld','Homeworlds','homeworld',1,0,0,0,0);
	new Univ.Item('Unicellular Organism','Unicellular Organisms','unicellular',1,0,0,0,0);
	new Univ.Item('Multicellular Organism','Multicellular Organisms','multicellular',1,0,0,0,0);
	new Univ.Item('Sentient Organism','Sentient Organisms','sentient',1,0,0,0,0);
	new Univ.Item('Computing Machine','Computing Machines','computer',1,0,0,0,0);
	new Univ.Item('Planetary Computer','Planetary Computers','planetaryAC',1,0,0,0,0);
	new Univ.Item('Matrioshka Brain','Matrioshka Brains','matrioshka',1,0,0,0,0);
	new Univ.Item('Galactic Computer','Galactic Computer','galacticAC',1,0,0,0,0);
	new Univ.Item('Galactic LAN Party','Galactic LAN Parties','superclusterAC',1,0,0,0,0);
	new Univ.Item('Universal Computer','Universal Computer','universalAC',1,0,0,0,0);
	new Univ.Item('Cosmic Computer','Cosmic Computer','cosmicAC',1,0,0,0,0);
}

Univ.LoadObjects = function(){
//	unique ID, type, Singular Name, Plural Name, number, InfoBlurb, Visibility Fcn, Cost Fcn, Interval, Production Fcn, Consumption Fcn
 	new Univ.Object('qfoam1','qfoam','Quantum Field Equation','Quantum Field Equations',0,
 		'Quantum Field Equations are the most basic production unit. Use them to generate Quantum Foam out of nothing.',
		function(){ // isVisible
			return 1;
		},
		function(howmany){ // costs
			var prices = {
				qfoam: 10 * howmany
			}
			return prices;
		},
		1/Univ.FPS, 	// interval in seconds (So 1/Univ.FPS = 1 game tick, the fastest possible rate)
		function(number){ // production
			var production = {
				qfoam: 1 * number	// each makes 1 qfoam every 1 second
			}
			return production;
		},
		function(){ // consumption
			var consumption = {}
			return consumption;
		});
	new Univ.Object('qfoam2','qfoam','Quantum Field Fluctuator','Quantum Field Fluctuators',0,
	'Quantum Field Fluctuators generate more Quantum Foam, faster.',
		function(){ // isVisible
			return Univ.Items['qfoam'].total_number >= 100 / 4;
		},
		function(howmany){ // costs
			var prices = {
				qfoam: 100 * howmany
			}
			return prices;
		},
		1, // interval
		function(number){ // production
			var production = {
				qfoam: 12 * number
			}
			return production;
		},
		function(number){ // consumption
			var consumption = {}
			return consumption;
		});
	new Univ.Object('qfoam3','qfoam','Quantum Field Actuator','Quantum Field Actuators',0,
	'Quantum Field Actuators generate even more Quantum Foam, even faster. It\'s what the people want. Well, people don\'t exist yet, but they would love this stuff.',
		function(){ // isVisible
			return Univ.Items['qfoam'].total_number >= 1000 / 4;
		},
		function(howmany){ // costs
			var prices = {
				qfoam: 1000 * howmany
			}
			return prices;
		}, // interval
		10,
		function(number){ // production
			var production = {
				qfoam: 150 * number // 150 qfoam every 10 seconds
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
			return Univ.Items['qfoam'].total_number >= 5000 / 4;
		},
		function(howmany){ // costs
			var prices = {
				qfoam: 5000 * howmany
			}
			return prices;
		},
		5, //interval 
		function(number){ // production
			var production = {
				elementary: 25 * number
			}
			return production;
		},
		function(number){ // consumption
			var consumption = {
				qfoam: 100 * number
			}
			return consumption;
		});
	new Univ.Object('elementary2','elementary','Symmetry Violator','Symmetry Violators',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['qfoam'].total_number >= 20000 / 4;
		},
		function(howmany){ // costs
			var prices = {
				qfoam: 20000 * howmany
			}
			return prices;
		},
		5, //interval
		function(number){ // production
			var production = {
				elementary: 124 * number
			}
			return production;
		},
		function(number){ // consumption
			var consumption = {
				qfoam: 248 * number
			}
			return consumption;
		});
	new Univ.Object('elementary3','elementary','Quark Mixing Matrix','Quark Mixing Matrices',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['qfoam'].total_number >= 80000 / 4;
		},
		function(howmany){ // costs
			var prices = {
				qfoam: 80000 * howmany
			}
			return prices;
		},
		5, // interval
		function(number){ // production
			var production = {
				elementary: 625 * number
			}
			return production;
		},
		function(number){ // consumption
			var consumption = {
				qfoam: 625 * number
			}
			return consumption;
		});
	new Univ.Object('subatomic1','subatomic','Spin Operator','Spin Operators',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['elementary'].total_number >= 555 / 4;
		},
		function(howmany){ // costs
			var prices = {
				elementary: 555 * howmany
			}
			return prices;
		},
		2/Univ.FPS, //interval
		function(number){ // production
			var production = {
				subatomic: 2 * number
			}
			return production;
		},
		function(number){ // consumption
			var consumption = {
				elementary: 5 * number
			}
			return consumption;
		});
	new Univ.Object('subatomic2','subatomic','Strong Interaction','Strong Interactions',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['elementary'].total_number >= 5555 / 4;
		},
		function(howmany){ // costs
			var prices = {
				elementary: 5555 * howmany
			}
			return prices;
		},
		4/Univ.FPS, //interval
		function(number){ // production
			var production = {
				subatomic: 2 * number
			}
			return production;
		},
		function(number){ // consumption
			var consumption = {
				elementary: 4 * number
			}
			return consumption;
		});
	new Univ.Object('subatomic3','subatomic','Relativistic Renormalizer','Relativistic Renormalizers',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['elementary'].total_number >= 55555 / 4;
		},
		function(howmany){ // costs
			var prices = {
				elementary: 55555 * howmany
			}
			return prices;
		},
		8/Univ.FPS, // interval
		function(number){ // production
			var production = {
				subatomic: 20 * number
			}
			return production;
		},
		function(number){ // consumption
			var consumption = {
				elementary: 35 * number
			}
			return consumption;
		});
	new Univ.Object('atom1','atom','Hydrogen Condenser','Hydrogen Condensers',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['subatomic'].total_number >= 900 / 4;
		},
		function(howmany){ // costs
			var prices = {
				subatomic: 900
			}
			return prices;
		},
		14, // interval
		function(number){ // production
			var production = {
				atom: 1 * number
			}
			return production;
		},
		function(number){ // consumption
			var consumption = {
				subatomic: 1 * number // 1 proton per hydrogen
			}
			return consumption;
		});
	new Univ.Object('atom2','atom','Isotope Organizer','Isotope Organizers',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['subatomic'].total_number >= 18000 / 4;
		},
		function(howmany){ // costs
			var prices = {
				subatomic: 18000
			}
			return prices;
		},
		12, //interval
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
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['subatomic'].total_number >= 36000 / 4;
		},
		function(howmany){ // costs
			var prices = {
				subatomic: 36000
			}
			return prices;
		},
		10, // interval
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
		new Univ.Object('gascloud1','gascloud','Interstellar Medium','Interstellar Medium',0,
		'Some say it can predict the future.',
		function(){ // isVisible
			return Univ.Items['atom'].total_number >= 1000000 / 4;
		},
		function(howmany){ // costs
			var prices = {
				atom: 1000000 * howmany
			}
			return prices;
		},
		60, // interval
		function(number){ // production
			var production = {
				gascloud: 1 * number
			}
			return production;
		},
		function(number){ // consumption
			var consumption = {
				atom: 1500000 * number
			}
			return consumption;
		});
		new Univ.Object('gascloud2','gascloud','Interstellar Large','Interstellar Large',0,
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['atom'].total_number >= 4000000 / 4;
		},
		function(howmany){ // costs
			var prices = {
				atom: 4000000 * howmany
			}
			return prices;
		},
		60, // interval
		function(number){ // production
			var production = {
				gascloud: 3 * number
			}
			return production;
		},
		function(number){ // consumption
			var consumption = {
				atom: 1500000 * 2.5 * number
			}
			return consumption;
		});
		new Univ.Object('gascloud3','gascloud','Interstellar XL','Interstellar XL',0,
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['atom'].total_number >= 1600000 / 4;
		},
		function(howmany){ // costs
			var prices = {
				atom: 1600000 * howmany
			}
			return prices;
		},
		60, // interval
		function(number){ // production
			var production = {
				gascloud: 9 * number
			}
			return production;
		},
		function(number){ // consumption
			var consumption = {
				atom: 1500000 * 7 * number
			}
			return consumption;
		});
		new Univ.Object('nebula1','nebula','Nebulizer','Nebulizers',0,
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['gascloud'].total_number >= 200 / 4;
		},
		function(howmany){ // costs
			var prices = {
				gascloud: 200 * howmany
			}
			return prices;
		},
		90,  // interval
		function(number){ // production
			var production = {
				nebula: 1 * number
			}
			return production;
		},
		function(number){ // consumption
			var consumption = {
				gascloud: 10 * number
			}
			return consumption;
		});
		new Univ.Object('nebula2','nebula','Rosette Polarizer','Rosette Polarizers',0,
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['gascloud'].total_number >= 2000 / 4;
		},
		function(howmany){ // costs
			var prices = {
				gascloud: 2000 * howmany
			}
			return prices;
		},
		90,  // interval
		function(number){ // production
			var production = {
				nebula: 12 * number
			}
			return production;
		},
		function(number){ // consumption
			var consumption = {
				gascloud: 100 * number
			}
			return consumption;
		});
		new Univ.Object('nebula3','nebula','Orionizer','Orionizers',0,
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['gascloud'].total_number >= 20000 / 4;
		},
		function(howmany){ // costs
			var prices = {
				gascloud: 20000 * howmany
			}
			return prices;
		},
		90,  // interval
		function(number){ // production
			var production = {
				nebula: 150 * number
			}
			return production;
		},
		function(number){ // consumption
			var consumption = {
				gascloud: 1000 * number
			}
			return consumption;
		});
		new Univ.Object('star1','star','Core Nucleator','Core Nucleators',0,
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['nebula'].total_number >= 123 / 4;
		},
		function(howmany){ // costs
			var prices = {
				nebula: 123 * howmany
			}
			return prices;
		},
		45, // interval
		function(number){ // production
			var production = {
				star: 10 * number
			}
			return production;
		},
		function(number){ // consumption
			var consumption = {
				nebula: 10 * number
			}
			return consumption;
		});
		new Univ.Object('star2','star','Bok Globule','Bok Globules',0,
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['nebula'].total_number >= 1234 / 4;
		},
		function(howmany){ // costs
			var prices = {
				nebula: 1234 * howmany
			}
			return prices;
		},
		30, // interval
		function(number){ // production
			var production = {
				star: 120 * number
			}
			return production;
		},
		function(number){ // consumption
			var consumption = {
				nebula: 100 * number
			}
			return consumption;
		});
		new Univ.Object('star3','star','Stellar Nursery','Stellar Nurseries',0,
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['nebula'].total_number >= 12345 / 4;
		},
		function(howmany){ // costs
			var prices = {
				nebula: 12345 * howmany
			}
			return prices;
		},
		20, // interval
		function(number){ // production
			var production = {
				star: 800 * number
			}
			return production;
		},
		function(number){ // consumption
			var consumption = {
				nebula: 600 * number
			}
			return consumption;
		});
		new Univ.Object('lightatom1','atom','Primordial Spallation','Primordial Spallation',0,
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return (Univ.Items['qfoam'].total_number >= 10000000 / 4 && Univ.Items['atom'].total_number >= 10000000 / 4 );
		},
		function(howmany){ // costs
			var prices = {
				qfoam: 10000000 * howmany
			}
			return prices;
		},
		1/Univ.FPS, // interval
		function(number){ // production
			var production = {
				lightatom: 100000 * number
			}
			return production;
		},
		function(number){ // consumption
			var consumption = {
				atom: 300000 * number
			}
			return consumption;
		});
		new Univ.Object('mediumatom1','atom','Main Sequence Ignition','Main Sequence Ignition',0,
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return (Univ.Items['star'].total_number >= 155 / 4 && Univ.Items['atom'].total_number >= 100000000 / 4 );
		},
		function(howmany){ // costs
			var prices = {
				star: 155 * howmany
			}
			return prices;
		},
		1/Univ.FPS, // interval
		function(number){ // production
			var production = {
				heavyatom: 9000000 * number
			}
			return production;
		},
		function(number){ // consumption
			var consumption = {
				atom: 150000000 * number
			}
			return consumption;
		});
		new Univ.Object('mediumatom2','atom','Convection Zoning Law','Convection Zoning Laws',0,
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return (Univ.Items['star'].total_number >= 1777 / 4 && Univ.Items['atom'].total_number >= 100000000 / 4 );
		},
		function(howmany){ // costs
			var prices = {
				star: 1777 * howmany
			}
			return prices;
		},
		4/Univ.FPS, // interval
		function(number){ // production
			var production = {
				heavyatom: 900000000 * number
			}
			return production;
		},
		function(number){ // consumption
			var consumption = {
				atom: 15000000000 * number
			}
			return consumption;
		});
		new Univ.Object('heavyatom1','atom','Supernova Spark','Supernova Sparks',0,
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return (Univ.Items['star'].total_number >= 313 / 4 && Univ.Items['atom'].total_number >= 100000000 / 4 );
		},
		function(howmany){ // costs
			var prices = {
				star: 313 * howmany
			}
			return prices;
		},
		300, // interval
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
// 		new Univ.Object('galaxy1','galaxy','Accretion Disco','Accretion Discos',0,
// 		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
// 		function(){ // isVisible
// 			return 1;
// 		},
// 		function(howmany){ // costs
// 			var prices = {
// 				star: 5000 * howmany
// 			}
// 			return prices;
// 		},
// 		function(number){ // production
// 			var production = {
// 				galaxy: 0.0001 * number
// 			}
// 			return production;
// 		},
// 		function(number){ // consumption
// 			var consumption = {
// 				star: 120 * number
// 			}
// 			return consumption;
// 		});
}