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
		},
		{ // ProductionEquation
			qfoam: {
				type: 'lin',
				slope: 1
			},
			upgrades:  ['qfoam_rateupgrade_1',
						'qfoam_rateupgrade_2',
						'qfoam_rateupgrade_3',
						'qfoam_rateupgrade_4',
						'qfoam_rateupgrade_5']
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
	new Univ.Object('subatomic1','subatomic','Spin Operator','Spin Operators',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['elementary'].total_number >= 555 / 4;
		},
		{ // CostEquation
			elementary: {
				type: 'lin',
				slope: 555
			}
		},
		function(){
			var interval = 10;
//			if (Univ.upgradeBought('upgradeID'){ interval -= Univ.Upgrades['upgradeID'].magnitude; }
			return Math.max(interval,1/Univ.FPS);
			//return interval;
		},
		{ // ProductionEquation
			subatomic: {
				type: 'lin',
				slope: 2
			}
		},
		{ // ConsumptionEquation
			elementary: {
				type: 'lin',
				slope: 5
			}
		}
	);
	new Univ.Object('subatomic2','subatomic','Strong Interaction','Strong Interactions',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['elementary'].total_number >= 5555 / 4;
		},
		{ // CostEquation
			elementary: {
				type: 'lin',
				slope: 5555
			}
		},
		function(){
			var interval = 1.5;
//			if (Univ.upgradeBought('upgradeID'){ interval -= Univ.Upgrades['upgradeID'].magnitude; }
			return Math.max(interval,1/Univ.FPS);
			//return interval;
		},
		{ // ProductionEquation
			subatomic: {
				type: 'lin',
				slope: 2
			}
		},
		{ // ConsumptionEquation
			elementary: {
				type: 'lin',
				slope: 4
			}
		}
	);
	new Univ.Object('subatomic3','subatomic','Relativistic Renormalizer','Relativistic Renormalizers',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['elementary'].total_number >= 55555 / 4;
		},
		{ // CostEquation
			elementary: {
				type: 'lin',
				slope: 55555
			}
		},
		function(){
			var interval = 2;
//			if (Univ.upgradeBought('upgradeID'){ interval -= Univ.Upgrades['upgradeID'].magnitude; }
			return Math.max(interval,1/Univ.FPS);
			//return interval;
		},
		{ // ProductionEquation
			subatomic: {
				type: 'lin',
				slope: 20
			}
		},
		{ // ConsumptionEquation
			elementary: {
				type: 'lin',
				slope: 35
			}
		}
	);
	new Univ.Object('atom1','atom','Hydrogen Condenser','Hydrogen Condensers',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['subatomic'].total_number >= 900 / 4;
		},
		{ // CostEquation
			subatomic: {
				type: 'lin',
				slope: 900
			}
		},
		function(){
			var interval = 14;
//			if (Univ.upgradeBought('upgradeID'){ interval -= Univ.Upgrades['upgradeID'].magnitude; }
			return Math.max(interval,1/Univ.FPS);
			//return interval;
		},
		{ // ProductionEquation
			atom: {
				type: 'lin',
				slope: 1
			}
		},
		{ // ConsumptionEquation
			subatomic: {
				type: 'lin',
				slope: 1
			}
		}
	);
	new Univ.Object('atom2','atom','Isotope Organizer','Isotope Organizers',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['subatomic'].total_number >= 18000 / 4;
		},
		{ // CostEquation
			subatomic: {
				type: 'lin',
				slope: 18000
			}
		},
		function(){
			var interval = 12;
//			if (Univ.upgradeBought('upgradeID'){ interval -= Univ.Upgrades['upgradeID'].magnitude; }
			return Math.max(interval,1/Univ.FPS);
			//return interval;
		},
		{ // ProductionEquation
			atom: {
				type: 'lin',
				slope: 17.5
			}
		},
		{ // ConsumptionEquation
			subatomic: {
				type: 'lin',
				slope: 25
			}
		}
	);
	new Univ.Object('atom3','atom','Quantum Degenerator','Quantum Degenerators',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['subatomic'].total_number >= 36000 / 4;
		},
		{ // CostEquation
			subatomic: {
				type: 'lin',
				slope: 36000
			}
		},
		function(){
			var interval = 10;
//			if (Univ.upgradeBought('upgradeID'){ interval -= Univ.Upgrades['upgradeID'].magnitude; }
			return Math.max(interval,1/Univ.FPS);
			//return interval;
		},
		{ // ProductionEquation
			atom: {
				type: 'lin',
				slope: 350
			}
		},
		{ // ConsumptionEquation
			subatomic: {
				type: 'lin',
				slope: 500
			}
		}
	);
	new Univ.Object('gascloud1','gascloud','Interstellar Medium','Interstellar Medium',0,
	'Some say it can predict the future.',
		function(){ // isVisible
			return Univ.Items['atom'].total_number >= 1000000 / 4;
		},
		{ // CostEquation
			atom: {
				type: 'lin',
				slope: 1000000
			}
		},
		function(){
			var interval = 60;
//			if (Univ.upgradeBought('upgradeID'){ interval -= Univ.Upgrades['upgradeID'].magnitude; }
			return Math.max(interval,1/Univ.FPS);
			//return interval;
		},
		{ // ProductionEquation
			gascloud: {
				type: 'lin',
				slope: 1
			}
		},
		{ // ConsumptionEquation
			atom: {
				type: 'lin',
				slope: 1500000
			}
		}
	);
	new Univ.Object('gascloud2','gascloud','Interstellar Large','Interstellar Large',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['atom'].total_number >= 4000000 / 4;
		},
		{ // CostEquation
			atom: {
				type: 'lin',
				slope: 4000000
			}
		},
		function(){
			var interval = 60;
//			if (Univ.upgradeBought('upgradeID'){ interval -= Univ.Upgrades['upgradeID'].magnitude; }
			return Math.max(interval,1/Univ.FPS);
			//return interval;
		},
		{ // ProductionEquation
			gascloud: {
				type: 'lin',
				slope: 3
			}
		},
		{ // ConsumptionEquation
			atom: {
				type: 'lin',
				slope: 1500000 * 2.5
			}
		}
	);
	new Univ.Object('gascloud3','gascloud','Interstellar XL','Interstellar XL',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['atom'].total_number >= 16000000 / 4;
		},
		{ // CostEquation
			atom: {
				type: 'lin',
				slope: 16000000
			}
		},
		function(){
			var interval = 60;
//			if (Univ.upgradeBought('upgradeID'){ interval -= Univ.Upgrades['upgradeID'].magnitude; }
			return Math.max(interval,1/Univ.FPS);
			//return interval;
		},
		{ // ProductionEquation
			gascloud: {
				type: 'lin',
				slope: 9
			}
		},
		{ // ConsumptionEquation
			atom: {
				type: 'lin',
				slope: 1500000 * 7
			}
		}
	);
	new Univ.Object('nebula1','nebula','Nebulizer','Nebulizers',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['gascloud'].total_number >= 200 / 4;
		},
		{ // CostEquation
			gascloud: {
				type: 'lin',
				slope: 200
			}
		},
		function(){
			var interval = 90;
//			if (Univ.upgradeBought('upgradeID'){ interval -= Univ.Upgrades['upgradeID'].magnitude; }
			return Math.max(interval,1/Univ.FPS);
			//return interval;
		},
		{ // ProductionEquation
			nebula: {
				type: 'lin',
				slope: 1
			}
		},
		{ // ConsumptionEquation
			gascloud: {
				type: 'lin',
				slope: 10
			}
		}
	);
	new Univ.Object('nebula2','nebula','Rosette Polarizer','Rosette Polarizers',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['gascloud'].total_number >= 2000 / 4;
		},
		{ // CostEquation
			gascloud: {
				type: 'lin',
				slope: 2000
			}
		},
		function(){
			var interval = 90;
//			if (Univ.upgradeBought('upgradeID'){ interval -= Univ.Upgrades['upgradeID'].magnitude; }
			return Math.max(interval,1/Univ.FPS);
			//return interval;
		},
		{ // ProductionEquation
			nebula: {
				type: 'lin',
				slope: 12
			}
		},
		{ // ConsumptionEquation
			gascloud: {
				type: 'lin',
				slope: 100
			}
		}
	);
	new Univ.Object('nebula3','nebula','Orionizer','Orionizers',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['gascloud'].total_number >= 20000 / 4;
		},
		{ // CostEquation
			gascloud: {
				type: 'lin',
				slope: 20000
			}
		},
		function(){
			var interval = 90;
//			if (Univ.upgradeBought('upgradeID'){ interval -= Univ.Upgrades['upgradeID'].magnitude; }
			return Math.max(interval,1/Univ.FPS);
			//return interval;
		},
		{ // ProductionEquation
			nebula: {
				type: 'lin',
				slope: 150
			}
		},
		{ // ConsumptionEquation
			gascloud: {
				type: 'lin',
				slope: 1000
			}
		}
	);
	new Univ.Object('star1','star','Core Nucleator','Core Nucleators',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['nebula'].total_number >= 123 / 4;
		},
		{ // CostEquation
			nebula: {
				type: 'lin',
				slope: 123
			}
		},
		function(){
			var interval = 45;
//			if (Univ.upgradeBought('upgradeID'){ interval -= Univ.Upgrades['upgradeID'].magnitude; }
			return Math.max(interval,1/Univ.FPS);
			//return interval;
		},
		{ // ProductionEquation
			star: {
				type: 'lin',
				slope: 10
			}
		},
		{ // ConsumptionEquation
			nebula: {
				type: 'lin',
				slope: 10
			}
		}
	);
	new Univ.Object('star2','star','Bok Globule','Bok Globules',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['nebula'].total_number >= 1234 / 4;
		},
		{ // CostEquation
			nebula: {
				type: 'lin',
				slope: 1234
			}
		},
		function(){
			var interval = 30;
//			if (Univ.upgradeBought('upgradeID'){ interval -= Univ.Upgrades['upgradeID'].magnitude; }
			return Math.max(interval,1/Univ.FPS);
			//return interval;
		},
		{ // ProductionEquation
			star: {
				type: 'lin',
				slope: 120
			}
		},
		{ // ConsumptionEquation
			nebula: {
				type: 'lin',
				slope: 100
			}
		}
	);
	new Univ.Object('star3','star','Stellar Nursery','Stellar Nurseries',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['nebula'].total_number >= 12345 / 4;
		},
		{ // CostEquation
			nebula: {
				type: 'lin',
				slope: 12345
			}
		},
		function(){
			var interval = 20;
//			if (Univ.upgradeBought('upgradeID'){ interval -= Univ.Upgrades['upgradeID'].magnitude; }
			return Math.max(interval,1/Univ.FPS);
			//return interval;
		},
		{ // ProductionEquation
			star: {
				type: 'lin',
				slope: 800
			}
		},
		{ // ConsumptionEquation
			nebula: {
				type: 'lin',
				slope: 600
			}
		}
	);
	new Univ.Object('lightatom1','atom','Primordial Spallation','Primordial Spallation',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return (Univ.Items['qfoam'].total_number >= 10000000 / 4 && Univ.Items['atom'].total_number >= 10000000 / 4 );
		},
		{ // CostEquation
			qfoam: {
				type: 'lin',
				slope: 10000000
			}
		},
		function(){
			var interval = 1;
//			if (Univ.upgradeBought('upgradeID'){ interval -= Univ.Upgrades['upgradeID'].magnitude; }
			return Math.max(interval,1/Univ.FPS);
			//return interval;
		},
		{ // ProductionEquation
			lightatom: {
				type: 'lin',
				slope: 100000
			}
		},
		{ // ConsumptionEquation
			atom: {
				type: 'lin',
				slope: 300000
			}
		}
	);
	new Univ.Object('mediumatom1','atom','Main Sequence Ignition','Main Sequence Ignition',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return (Univ.Items['star'].total_number >= 155 / 4 && Univ.Items['atom'].total_number >= 100000000 / 4 );
		},
		{ // CostEquation
			star: {
				type: 'lin',
				slope: 155
			}
		},
		function(){
			var interval = 1;
//			if (Univ.upgradeBought('upgradeID'){ interval -= Univ.Upgrades['upgradeID'].magnitude; }
			return Math.max(interval,1/Univ.FPS);
			//return interval;
		},
		{ // ProductionEquation
			mediumatom: {
				type: 'lin',
				slope: 900000
			}
		},
		{ // ConsumptionEquation
			atom: {
				type: 'lin',
				slope: 9500000
			}
		}
	);
	new Univ.Object('mediumatom2','atom','Convection Zoning Law','Convection Zoning Laws',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return (Univ.Items['star'].total_number >= 1777 / 4 && Univ.Items['atom'].total_number >= 100000000 / 4 );
		},
		{ // CostEquation
			star: {
				type: 'lin',
				slope: 1777
			}
		},
		function(){
			var interval = 4;
//			if (Univ.upgradeBought('upgradeID'){ interval -= Univ.Upgrades['upgradeID'].magnitude; }
			return Math.max(interval,1/Univ.FPS);
			//return interval;
		},
		{ // ProductionEquation
			mediumatom: {
				type: 'lin',
				slope: 900000
			}
		},
		{ // ConsumptionEquation
			atom: {
				type: 'lin',
				slope: 8500000
			}
		}
	);
	new Univ.Object('heavyatom1','atom','Supernova Spark','Supernova Sparks',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return (Univ.Items['star'].total_number >= 313 / 4 && Univ.Items['mediumatom'].total_number >= 100000000 / 4 );
		},
		{ // CostEquation
			star: {
				type: 'lin',
				slope: 313
			}
		},
		function(){
			var interval = 300;
//			if (Univ.upgradeBought('upgradeID'){ interval -= Univ.Upgrades['upgradeID'].magnitude; }
			return Math.max(interval,1/Univ.FPS);
			//return interval;
		},
		{ // ProductionEquation
			heavyatom: {
				type: 'lin',
				slope: 9000000
			}
		},
		{ // ConsumptionEquation
			star: {
				type: 'lin',
				slope: 10
			}
		}
	);
	new Univ.Object('galaxy1','galaxy','Accretion Disco','Accretion Discos',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return (Univ.Items['star'].total_number >= 1000 / 4 );
		},
		{ // CostEquation
			star: {
				type: 'lin',
				slope: 1000
			}
		},
		function(){
			var interval = 900;
//			if (Univ.upgradeBought('upgradeID'){ interval -= Univ.Upgrades['upgradeID'].magnitude; }
			return Math.max(interval,1/Univ.FPS);
			//return interval;
		},
		{ // ProductionEquation
			galaxy: {
				type: 'lin',
				slope: 1
			}
		},
		{ // ConsumptionEquation
			star: {
				type: 'lin',
				slope: 12000
			}
		}
	);
}