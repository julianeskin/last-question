Univ.LoadObjects = function(){
//	unique ID, type, Singular Name, Plural Name, number, InfoBlurb, Visibility Fcn, CostEquation, Interval, ProductionEquation, ConsumptionEquation
 	new Univ.Object('qfoam1','qfoam','Quantum Field Equation','Quantum Field Equations',0,
 		'Quantum Field Equations are the most basic production unit. Use them to generate Quantum Foam out of nothing.',
		function(){ // isVisible
			return 1;
		},
		{ // CostEquation
			qfoam: {
				type: 'exp',
				base: 1.01,
				start: 10
			}
		},
		function(){
			var interval = 4;
			if (Univ.upgradeBought('qfoam_intervalupgrade_1')){ interval -= Univ.Upgrades['qfoam_intervalupgrade_1'].magnitude; }
			if (Univ.upgradeBought('qfoam_intervalupgrade_2')){ interval -= Univ.Upgrades['qfoam_intervalupgrade_2'].magnitude; }
			if (Univ.upgradeBought('qfoam_intervalupgrade_3')){ interval -= Univ.Upgrades['qfoam_intervalupgrade_3'].magnitude; }
			if (Univ.upgradeBought('qfoam_intervalupgrade_4')){ interval -= Univ.Upgrades['qfoam_intervalupgrade_4'].magnitude; }
			if (Univ.upgradeBought('qfoam_intervalupgrade_5')){ interval -= Univ.Upgrades['qfoam_intervalupgrade_5'].magnitude; }
			return Math.max(interval,1/Univ.FPS);
			//return interval;
		},
		{ // ProductionEquation
			qfoam: {
				type: 'lin',
				slope: 1
			},
			upgrades: [ 'qfoam_rateupgrade_1',
						'qfoam_rateupgrade_2',
						'qfoam_rateupgrade_3',
						'qfoam_rateupgrade_4',
						'qfoam_rateupgrade_5' ]
		},
		{}
	);
	new Univ.Object('qfoam2','qfoam','Quantum Field Fluctuator','Quantum Field Fluctuators',0,
	'Quantum Field Fluctuators generate more Quantum Foam, faster.',
		function(){ // isVisible
			return Univ.Items['qfoam'].total_number >= 100 / 4;
		},
		{ // CostEquation
			qfoam: {
				type: 'exp',
				base: 1.01,
				start: 100
			}
		},
		function(){
			var interval = 4;
//			if (Univ.upgradeBought('upgradeID'){ interval -= Univ.Upgrades['upgradeID'].magnitude; }
			return Math.max(interval,1/Univ.FPS);
			//return interval;
		},
		{ // ProductionEquation
			qfoam: {
				type: 'lin',
				slope: 12
			}
		},
		{}
	);
	new Univ.Object('qfoam3','qfoam','Quantum Field Actuator','Quantum Field Actuators',0,
	'Quantum Field Actuators generate even more Quantum Foam, even faster. It\'s what the people want. Well, people don\'t exist yet, but they would love this stuff.',
		function(){ // isVisible
			return Univ.Items['qfoam'].total_number >= 1000 / 4;
		},
		{ // CostEquation
			qfoam: {
				type: 'exp',
				base: 1.01,
				start: 1000
			}
		},
		function(){ // interval
			var interval = 10;
//			if (Univ.upgradeBought('upgradeID'){ interval -= Univ.Upgrades['upgradeID'].magnitude; }
			return Math.max(interval,1/Univ.FPS);
			//return interval;
		},
		{ // ProductionEquation
			qfoam: {
				type: 'lin',
				slope: 150
			}
		},
		{}
	);
	new Univ.Object('elementary1','elementary','Sphaleron','Sphalerons',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['qfoam'].total_number >= 5000 / 4;
		},
		{ // CostEquation
			qfoam: {
				type: 'lin',
				slope: 5000
			}
		},
		function(){ // interval
			var interval = 5;
//			if (Univ.upgradeBought('upgradeID'){ interval -= Univ.Upgrades['upgradeID'].magnitude; }
			return Math.max(interval,1/Univ.FPS);
			//return interval;
		},
		{ // ProductionEquation
			elementary: {
				type: 'lin',
				slope: 25
			}
		},
		{ // ConsumptionEquation
			qfoam: {
				type: 'lin',
				slope: 100
			}
		}
	);
	new Univ.Object('elementary2','elementary','Symmetry Violator','Symmetry Violators',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['qfoam'].total_number >= 20000 / 4;
		},
		{ // CostEquation
			qfoam: {
				type: 'lin',
				slope: 20000
			}
		},
		function(){ // interval
			var interval = 5;
//			if (Univ.upgradeBought('upgradeID'){ interval -= Univ.Upgrades['upgradeID'].magnitude; }
			return Math.max(interval,1/Univ.FPS);
			//return interval;
		},
		{ // ProductionEquation
			elementary: {
				type: 'lin',
				slope: 124
			}
		},
		{ // ConsumptionEquation
			qfoam: {
				type: 'lin',
				slope: 248
			}
		}
	);
	new Univ.Object('elementary3','elementary','Quark Mixing Matrix','Quark Mixing Matrices',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['qfoam'].total_number >= 80000 / 4;
		},
		{ // CostEquation
			qfoam: {
				type: 'lin',
				slope: 80000
			}
		},
		function(){
			var interval = 5;
//			if (Univ.upgradeBought('upgradeID'){ interval -= Univ.Upgrades['upgradeID'].magnitude; }
			return Math.max(interval,1/Univ.FPS);
			//return interval;
		},
		{ // ProductionEquation
			elementary: {
				type: 'lin',
				slope: 625
			}
		},
		{ // ConsumptionEquation
			qfoam: {
				type: 'lin',
				slope: 625
			}
		}
	);
	/*new Univ.Object('subatomic1','subatomic','Spin Operator','Spin Operators',0,
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
		function(){
			var interval = 10;
//			if (Univ.upgradeBought('upgradeID'){ interval -= Univ.Upgrades['upgradeID'].magnitude; }
			return Math.max(interval,1/Univ.FPS);
			//return interval;
		},
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
		function(){
			var interval = 1.5;
//			if (Univ.upgradeBought('upgradeID'){ interval -= Univ.Upgrades['upgradeID'].magnitude; }
			return Math.max(interval,1/Univ.FPS);
			//return interval;
		},
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
		function(){
			var interval = 2;
//			if (Univ.upgradeBought('upgradeID'){ interval -= Univ.Upgrades['upgradeID'].magnitude; }
			return Math.max(interval,1/Univ.FPS);
			//return interval;
		},
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
				subatomic: 900 * howmany
			}
			return prices;
		},
		function(){
			var interval = 14;
//			if (Univ.upgradeBought('upgradeID'){ interval -= Univ.Upgrades['upgradeID'].magnitude; }
			return Math.max(interval,1/Univ.FPS);
			//return interval;
		},
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
				subatomic: 18000 * howmany
			}
			return prices;
		},
		function(){
			var interval = 12;
//			if (Univ.upgradeBought('upgradeID'){ interval -= Univ.Upgrades['upgradeID'].magnitude; }
			return Math.max(interval,1/Univ.FPS);
			//return interval;
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
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['subatomic'].total_number >= 36000 / 4;
		},
		function(howmany){ // costs
			var prices = {
				subatomic: 36000 * howmany
			}
			return prices;
		},
		function(){
			var interval = 10;
//			if (Univ.upgradeBought('upgradeID'){ interval -= Univ.Upgrades['upgradeID'].magnitude; }
			return Math.max(interval,1/Univ.FPS);
			//return interval;
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
		function(){
			var interval = 60;
//			if (Univ.upgradeBought('upgradeID'){ interval -= Univ.Upgrades['upgradeID'].magnitude; }
			return Math.max(interval,1/Univ.FPS);
			//return interval;
		},
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
		function(){
			var interval = 60;
//			if (Univ.upgradeBought('upgradeID'){ interval -= Univ.Upgrades['upgradeID'].magnitude; }
			return Math.max(interval,1/Univ.FPS);
			//return interval;
		},
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
			return Univ.Items['atom'].total_number >= 16000000 / 4;
		},
		function(howmany){ // costs
			var prices = {
				atom: 16000000 * howmany
			}
			return prices;
		},
		function(){
			var interval = 60;
//			if (Univ.upgradeBought('upgradeID'){ interval -= Univ.Upgrades['upgradeID'].magnitude; }
			return Math.max(interval,1/Univ.FPS);
			//return interval;
		},
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
		function(){
			var interval = 90;
//			if (Univ.upgradeBought('upgradeID'){ interval -= Univ.Upgrades['upgradeID'].magnitude; }
			return Math.max(interval,1/Univ.FPS);
			//return interval;
		},
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
		function(){
			var interval = 90;
//			if (Univ.upgradeBought('upgradeID'){ interval -= Univ.Upgrades['upgradeID'].magnitude; }
			return Math.max(interval,1/Univ.FPS);
			//return interval;
		},
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
		function(){
			var interval = 90;
//			if (Univ.upgradeBought('upgradeID'){ interval -= Univ.Upgrades['upgradeID'].magnitude; }
			return Math.max(interval,1/Univ.FPS);
			//return interval;
		},
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
		function(){
			var interval = 45;
//			if (Univ.upgradeBought('upgradeID'){ interval -= Univ.Upgrades['upgradeID'].magnitude; }
			return Math.max(interval,1/Univ.FPS);
			//return interval;
		},
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
		function(){
			var interval = 30;
//			if (Univ.upgradeBought('upgradeID'){ interval -= Univ.Upgrades['upgradeID'].magnitude; }
			return Math.max(interval,1/Univ.FPS);
			//return interval;
		},
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
		function(){
			var interval = 20;
//			if (Univ.upgradeBought('upgradeID'){ interval -= Univ.Upgrades['upgradeID'].magnitude; }
			return Math.max(interval,1/Univ.FPS);
			//return interval;
		},
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
		function(){
			var interval = 1;
//			if (Univ.upgradeBought('upgradeID'){ interval -= Univ.Upgrades['upgradeID'].magnitude; }
			return Math.max(interval,1/Univ.FPS);
			//return interval;
		},
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
		function(){
			var interval = 1;
//			if (Univ.upgradeBought('upgradeID'){ interval -= Univ.Upgrades['upgradeID'].magnitude; }
			return Math.max(interval,1/Univ.FPS);
			//return interval;
		},
		function(number){ // production
			var production = {
				mediumatom: 900000 * number
			}
			return production;
		},
		function(number){ // consumption
			var consumption = {
				atom: 9500000 * number
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
		function(){
			var interval = 4;
//			if (Univ.upgradeBought('upgradeID'){ interval -= Univ.Upgrades['upgradeID'].magnitude; }
			return Math.max(interval,1/Univ.FPS);
			//return interval;
		},
		function(number){ // production
			var production = {
				mediumatom: 900000 * number
			}
			return production;
		},
		function(number){ // consumption
			var consumption = {
				atom: 8500000 * number
			}
			return consumption;
		});
		new Univ.Object('heavyatom1','atom','Supernova Spark','Supernova Sparks',0,
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return (Univ.Items['star'].total_number >= 313 / 4 && Univ.Items['mediumatom'].total_number >= 100000000 / 4 );
		},
		function(howmany){ // costs
			var prices = {
				star: 313 * howmany
			}
			return prices;
		},
		function(){
			var interval = 300;
//			if (Univ.upgradeBought('upgradeID'){ interval -= Univ.Upgrades['upgradeID'].magnitude; }
			return Math.max(interval,1/Univ.FPS);
			//return interval;
		},
		function(number){ // production
			var production = {
				heavyatom: 9000000 * number
			}
			return production;
		},
		function(number){ // consumption
			var consumption = {
				star: 10 * number
			}
			return consumption;
		});
		new Univ.Object('galaxy1','galaxy','Accretion Disco','Accretion Discos',0,
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return (Univ.Items['star'].total_number >= 1000 / 4 );
		},
		function(howmany){ // costs
			var prices = {
				star: 1000 * howmany
			}
			return prices;
		},
		function(){
			var interval = 900;
//			if (Univ.upgradeBought('upgradeID'){ interval -= Univ.Upgrades['upgradeID'].magnitude; }
			return Math.max(interval,1/Univ.FPS);
			//return interval;
		},
		function(number){ // production
			var production = {
				galaxy: 1 * number
			}
			return production;
		},
		function(number){ // consumption
			var consumption = {
				star: 12000 * number
			}
			return consumption;
		});*/
}