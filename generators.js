Univ.LoadObjects = function(){
//	unique ID, type, Singular Name, Plural Name, number, InfoBlurb, Visibility Fcn, CostEquation, Base Interval, ProductionEquation, ConsumptionEquation, BuyFunction

/* QUANTUM FOAM */
 	new Univ.Object('qfoam1','qfoam','Quantum Field Equation','Quantum Field Equations',0,
 		'Quantum Field Equations are the most basic production unit. Use them to generate Quantum Foam out of nothing.',
		function(){ // isVisible
			return 1;
		},
		{ // CostEquation
			qfoam: {
				visible: 1,
				type: 'exp',
				base: 1.005,
				start: 10
			}
		},
		4, // Base Interval
		function(){ // ProductionEquation
			var qfoam_rate_factor = 1-1/(1+Math.exp(-2*(Math.log10(Univ.Age)+34)));
			var production = {
				qfoam: {
					visible: 1,
					type: 'lin',
					slope: qfoam_rate_factor * 1
				}
			}
			return production;
		},
		{}
	);
	new Univ.Object('qfoam2','qfoam','Quantum Field Fluctuator','Quantum Field Fluctuators',0,
	'Quantum Field Fluctuators generate more Quantum Foam, faster.',
		function(){ // isVisible
			return Univ.Items['qfoam'].total_number >= 1e6 / 4;
		},
		{ // CostEquation
			qfoam: {
				visible: 1,
				type: 'exp',
				base: 1.005,
				start: 1e6
			}
		},
		4, // Base Interval
		function(){ // ProductionEquation
			var qfoam_rate_factor = 1-1/(1+Math.exp(-2*(Math.log10(Univ.Age)+34)));
			var production = {
				qfoam: {
					visible: 1,
					type: 'lin',
					slope: qfoam_rate_factor * 1.2 * 1e5
				}
			}
			return production;
		},
		{},
		0 // no special Buy Function
	);
	new Univ.Object('qfoam3','qfoam','Quantum Field Actuator','Quantum Field Actuators',0,
	'Quantum Field Actuators generate even more Quantum Foam, even faster. It\'s what the people want. Well, people don\'t exist yet, but they would love this stuff.',
		function(){ // isVisible
			return Univ.Items['qfoam'].total_number >= 1e11 / 4;
		},
		{ // CostEquation
			qfoam: {
				visible: 1,
				type: 'exp',
				base: 1.005,
				start: 1e11
			}
		},
		10, // Base Interval
		function() { // ProductionEquation
			var qfoam_rate_factor = 1-1/(1+Math.exp(-2*(Math.log10(Univ.Age)+34)));
			var production = {
				qfoam: {
					visible: 1,
					type: 'lin',
					slope: qfoam_rate_factor * 1.5 * 1e10
				}
			}
			return production;
		},
		{},
		0 // no special Buy Function
	);
	new Univ.Object('qfoam4','qfoam','QFoam Generator 4','QFoam Generator 4',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['qfoam'].total_number >= 1e16 / 4;
		},
		{ // CostEquation
			qfoam: {
				visible: 1,
				type: 'exp',
				base: 1.01,
				start: 1e16
			}
		},
		10, // Base Interval
		function() { // ProductionEquation
			var qfoam_rate_factor = 1-1/(1+Math.exp(-2*(Math.log10(Univ.Age)+34)));
			var production = {
				qfoam: {
					visible: 1,
					type: 'lin',
					slope: qfoam_rate_factor * 1.8 * 1e15
				}
			}
			return production;
		},
		{},
		0 // no special Buy Function
	);
	new Univ.Object('qfoam5','qfoam','QFoam Generator 5','QFoam Generator 5',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['qfoam'].total_number >= 1e21 / 4;
		},
		{ // CostEquation
			qfoam: {
				visible: 1,
				type: 'exp',
				base: 1.01,
				start: 1e21
			}
		},
		10, // Base Interval
		function() { // ProductionEquation
			var qfoam_rate_factor = 1-1/(1+Math.exp(-2*(Math.log10(Univ.Age)+34)));
			var production = {
				qfoam: {
					visible: 1,
					type: 'lin',
					slope: qfoam_rate_factor * 2 * 1e20
				}
			}
			return production;
		},
		{},
		0 // no special Buy Function
	);
new Univ.Object('qfoam6','qfoam','QFoam Generator 6','QFoam Generator 6',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['qfoam'].total_number >= 1e26 / 4;
		},
		{ // CostEquation
			qfoam: {
				visible: 1,
				type: 'exp',
				base: 1.01,
				start: 1e26
			}
		},
		10, // Base Interval
		function() { // ProductionEquation
			var qfoam_rate_factor = 1-1/(1+Math.exp(-2*(Math.log10(Univ.Age)+34)));
			var production = {
				qfoam: {
					visible: 1,
					type: 'lin',
					slope: qfoam_rate_factor * 2 * 1e25
				}
			}
			return production;
		},
		{},
		0 // no special Buy Function
	);
new Univ.Object('qfoam7','qfoam','QFoam Generator 7','QFoam Generator 7',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['qfoam'].total_number >= 1e37 / 4;
		},
		{ // CostEquation
			qfoam: {
				visible: 1,
				type: 'exp',
				base: 1.01,
				start: 1e37
			}
		},
		10, // Base Interval
		function() { // ProductionEquation
			var qfoam_rate_factor = 1-1/(1+Math.exp(-2*(Math.log10(Univ.Age)+34)));
			var production = {
				qfoam: {
					visible: 1,
					type: 'lin',
					slope: qfoam_rate_factor * 2 * 1e36
				}
			}
			return production;
		},
		{},
		0 // no special Buy Function
	);
new Univ.Object('qfoam8','qfoam','QFoam Generator 8','QFoam Generator 8',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['qfoam'].total_number >= 1e43 / 4;
		},
		{ // CostEquation
			qfoam: {
				visible: 1,
				type: 'exp',
				base: 1.01,
				start: 1e43
			}
		},
		10, // Base Interval
		function() { // ProductionEquation
			var qfoam_rate_factor = 1-1/(1+Math.exp(-2*(Math.log10(Univ.Age)+34)));
			var production = {
				qfoam: {
					visible: 1,
					type: 'lin',
					slope: qfoam_rate_factor * 2 * 1e42
				}
			}
			return production;
		},
		{},
		0 // no special Buy Function
	);
new Univ.Object('qfoam9','qfoam','QFoam Generator 9','QFoam Generator 9',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['qfoam'].total_number >= 1e49 / 4;
		},
		{ // CostEquation
			qfoam: {
				visible: 1,
				type: 'exp',
				base: 1.01,
				start: 1e49
			}
		},
		10, // Base Interval
		function() { // ProductionEquation
			var qfoam_rate_factor = 1-1/(1+Math.exp(-2*(Math.log10(Univ.Age)+34)));
			var production = {
				qfoam: {
					visible: 1,
					type: 'lin',
					slope: qfoam_rate_factor * 2 * 1e48
				}
			}
			return production;
		},
		{},
		0 // no special Buy Function
	);
new Univ.Object('qfoam10','qfoam','QFoam Generator 10','QFoam Generator 10',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['qfoam'].total_number >= 1e55 / 4;
		},
		{ // CostEquation
			qfoam: {
				visible: 1,
				type: 'exp',
				base: 1.01,
				start: 1e55
			}
		},
		10, // Base Interval
		function() { // ProductionEquation
			var qfoam_rate_factor = 1-1/(1+Math.exp(-2*(Math.log10(Univ.Age)+34)));
			var production = {
				qfoam: {
					visible: 1,
					type: 'lin',
					slope: qfoam_rate_factor * 2 * 1e54
				}
			}
			return production;
		},
		{},
		0 // no special Buy Function
	);
	
	
/* ELEMENTARY PARTICLES */	
	
	new Univ.Object('elementary1','elementary','Sphaleron','Sphalerons',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['qfoam'].total_number >= 1e60 / 4;
		},
		{ // CostEquation
			qfoam: {
				visible: 1,
				type: 'lin',
				slope: 5000
			}
		},
		5, // Base Interval
		{ // ProductionEquation
			elementary: {
				visible: 1,
				type: 'lin',
				slope: 25
			}
		},
		{ // ConsumptionEquation
			qfoam: {
				visible: 1,
				type: 'lin',
				slope: 100
			}
		},
		0 // no special Buy Function
	);
	new Univ.Object('elementary2','elementary','Symmetry Violator','Symmetry Violators',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['qfoam'].total_number >= 1e60 / 4;
		},
		{ // CostEquation
			qfoam: {
				visible: 1,
				type: 'lin',
				slope: 20000
			}
		},
		5, // Base Interval
		{ // ProductionEquation
			elementary: {
				visible: 1,
				type: 'lin',
				slope: 124
			}
		},
		{ // ConsumptionEquation
			qfoam: {
				visible: 1,
				type: 'lin',
				slope: 248
			}
		}
	);
	new Univ.Object('elementary3','elementary','Quark Mixing Matrix','Quark Mixing Matrices',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['qfoam'].total_number >= 1e60 / 4;
		},
		{ // CostEquation
			qfoam: {
				visible: 1,
				type: 'lin',
				slope: 80000
			}
		},
		5, // Base Interval
		{ // ProductionEquation
			elementary: {
				visible: 1,
				type: 'lin',
				slope: 625
			}
		},
		{ // ConsumptionEquation
			qfoam: {
				visible: 1,
				type: 'lin',
				slope: 625
			}
		},
		0 // no special Buy Function
	);
	new Univ.Object('subatomic1','subatomic','Spin Operator','Spin Operators',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['elementary'].total_number >= 555 / 4;
		},
		{ // CostEquation
			elementary: {
				visible: 1,
				type: 'lin',
				slope: 555
			}
		},
		10, // Base Interval
		{ // ProductionEquation
			subatomic: {
				visible: 1,
				type: 'lin',
				slope: 2
			}
		},
		{ // ConsumptionEquation
			elementary: {
				visible: 1,
				type: 'lin',
				slope: 5
			}
		},
		0 // no special Buy Function
	);
	new Univ.Object('subatomic2','subatomic','Strong Interaction','Strong Interactions',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['elementary'].total_number >= 5555 / 4;
		},
		{ // CostEquation
			elementary: {
				visible: 1,
				type: 'lin',
				slope: 5555
			}
		},
		1.5, // Base Interval
		{ // ProductionEquation
			subatomic: {
				visible: 1,
				type: 'lin',
				slope: 2
			}
		},
		{ // ConsumptionEquation
			elementary: {
				visible: 1,
				type: 'lin',
				slope: 4
			}
		},
		0 // no special Buy Function
	);
	new Univ.Object('subatomic3','subatomic','Relativistic Renormalizer','Relativistic Renormalizers',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['elementary'].total_number >= 55555 / 4;
		},
		{ // CostEquation
			elementary: {
				visible: 1,
				type: 'lin',
				slope: 55555
			}
		},
		2, // Base Interval
		{ // ProductionEquation
			subatomic: {
				visible: 1,
				type: 'lin',
				slope: 20
			}
		},
		{ // ConsumptionEquation
			elementary: {
				visible: 1,
				type: 'lin',
				slope: 35
			}
		},
		0 // no special Buy Function
	);
	new Univ.Object('atom1','atom','Hydrogen Condenser','Hydrogen Condensers',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['subatomic'].total_number >= 900 / 4;
		},
		{ // CostEquation
			subatomic: {
				visible: 1,
				type: 'lin',
				slope: 900
			}
		},
		14, // Base Interval
		{ // ProductionEquation
			atom: {
				visible: 1,
				type: 'lin',
				slope: 1
			},
			simpleatom: {
				visible: 0,
				type: 'lin',
				slope: 1
			}
		},
		{ // ConsumptionEquation
			subatomic: {
				visible: 1,
				type: 'lin',
				slope: 1
			}
		},
		0 // no special Buy Function
	);
	new Univ.Object('atom2','atom','Isotope Organizer','Isotope Organizers',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['subatomic'].total_number >= 18000 / 4;
		},
		{ // CostEquation
			subatomic: {
				visible: 1,
				type: 'lin',
				slope: 18000
			}
		},
		12, // Base Interval
		{ // ProductionEquation
			atom: {
				visible: 1,
				type: 'lin',
				slope: 17.5
			},			
			simpleatom: {
				visible: 0,
				type: 'lin',
				slope: 17.5
			}
		},
		{ // ConsumptionEquation
			subatomic: {
				visible: 1,
				type: 'lin',
				slope: 25
			}
		},
		0 // no special Buy Function
	);
	new Univ.Object('atom3','atom','Quantum Degenerator','Quantum Degenerators',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['subatomic'].total_number >= 36000 / 4;
		},
		{ // CostEquation
			subatomic: {
				visible: 1,
				type: 'lin',
				slope: 36000
			}
		},
		10, // Base Interval
		{ // ProductionEquation
			atom: {
				visible: 1,
				type: 'lin',
				slope: 350
			},
			simpleatom: {
				visible: 0,
				type: 'lin',
				slope: 350
			}
		},
		{ // ConsumptionEquation
			subatomic: {
				visible: 1,
				type: 'lin',
				slope: 500
			}
		},
		0 // no special Buy Function
	);
	new Univ.Object('gascloud1','gascloud','Interstellar Medium','Interstellar Medium',0,
	'Some say it can predict the future.',
		function(){ // isVisible
			return Univ.Items['atom'].total_number >= 1000000 / 4;
		},
		{ // CostEquation
			atom: {
				type: 'lin',
				visible: 1,
				slope: 1000000
			},
			simpleatom: {
				visible: 0,
				type: 'lin',
				slope: 1000000
			}
			
		},
		60, // Base Interval
		{ // ProductionEquation
			gascloud: {
				visible: 1,
				type: 'lin',
				slope: 1
			}
		},
		{ // ConsumptionEquation
			atom: {
				visible: 1,
				type: 'lin',
				slope: 1500000
			},
			simpleatom: {
				visible: 0,
				type: 'lin',
				slope: 1500000
			}
		},
		0 // no special Buy Function
	);
	new Univ.Object('gascloud2','gascloud','Interstellar Large','Interstellar Large',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['atom'].total_number >= 4000000 / 4;
		},
		{ // CostEquation
			atom: {
				visible: 1,
				type: 'lin',
				slope: 4000000
			},
			simpleatom: {
				visible: 1,
				type: 'lin',
				slope: 4000000
			}
		},
		60, // Base Interval
		{ // ProductionEquation
			gascloud: {
				visible: 1,
				type: 'lin',
				slope: 3
			}
		},
		{ // ConsumptionEquation
			atom: {
				visible: 1,
				type: 'lin',
				slope: 1500000 * 2.5
			},
			simpleatom: {
				visible: 1,
				type: 'lin',
				slope: 1500000 * 2.5
			}
		},
		0 // no special Buy Function
	);
	new Univ.Object('gascloud3','gascloud','Interstellar XL','Interstellar XL',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['atom'].total_number >= 16000000 / 4;
		},
		{ // CostEquation
			atom: {
				visible: 1,
				type: 'lin',
				slope: 16000000
			},
			simpleatom: {
				visible: 1,
				type: 'lin',
				slope: 16000000
			}
		},
		60, // Base Interval
		{ // ProductionEquation
			gascloud: {
				visible: 1,
				type: 'lin',
				slope: 9
			}
		},
		{ // ConsumptionEquation
			atom: {
				visible: 1,
				type: 'lin',
				slope: 1500000 * 7
			},
			simpleatom: {
				visible: 1,
				type: 'lin',
				slope: 1500000 * 7
			}
		},
		0 // no special Buy Function
	);
	new Univ.Object('nebula1','nebula','Nebulizer','Nebulizers',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['gascloud'].total_number >= 200 / 4;
		},
		{ // CostEquation
			gascloud: {
				visible: 1,
				type: 'lin',
				slope: 200
			}
		},
		90, // Base Interval
		{ // ProductionEquation
			nebula: {
				visible: 1,
				type: 'lin',
				slope: 1
			}
		},
		{ // ConsumptionEquation
			gascloud: {
				visible: 1,
				type: 'lin',
				slope: 10
			}
		},
		0 // no special Buy Function
	);
	new Univ.Object('nebula2','nebula','Rosette Polarizer','Rosette Polarizers',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['gascloud'].total_number >= 2000 / 4;
		},
		{ // CostEquation
			gascloud: {
				visible: 1,
				type: 'lin',
				slope: 2000
			}
		},
		90, // Base Interval
		{ // ProductionEquation
			nebula: {
				visible: 1,
				type: 'lin',
				slope: 12
			}
		},
		{ // ConsumptionEquation
			gascloud: {
				visible: 1,
				type: 'lin',
				slope: 100
			}
		},
		0 // no special Buy Function
	);
	new Univ.Object('nebula3','nebula','Orionizer','Orionizers',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['gascloud'].total_number >= 20000 / 4;
		},
		{ // CostEquation
			gascloud: {
				visible: 1,
				type: 'lin',
				slope: 20000
			}
		},
		90, // Base Interval
		{ // ProductionEquation
			nebula: {
				visible: 1,
				type: 'lin',
				slope: 150
			}
		},
		{ // ConsumptionEquation
			gascloud: {
				visible: 1,
				type: 'lin',
				slope: 1000
			}
		},
		0 // no special Buy Function
	);
	new Univ.Object('star1','star','Core Nucleator','Core Nucleators',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['nebula'].total_number >= 123 / 4;
		},
		{ // CostEquation
			nebula: {
				visible: 1,
				type: 'lin',
				slope: 123
			}
		},
		45, // Base Interval
		{ // ProductionEquation
			star: {
				visible: 1,
				type: 'lin',
				slope: 10
			}
		},
		{ // ConsumptionEquation
			nebula: {
				visible: 1,
				type: 'lin',
				slope: 10
			}
		},
		0 // no special Buy Function
	);
	new Univ.Object('star2','star','Bok Globule','Bok Globules',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['nebula'].total_number >= 1234 / 4;
		},
		{ // CostEquation
			nebula: {
				visible: 1,
				type: 'lin',
				slope: 1234
			}
		},
		30, // Base Interval
		{ // ProductionEquation
			star: {
				visible: 1,
				type: 'lin',
				slope: 120
			}
		},
		{ // ConsumptionEquation
			nebula: {
				visible: 1,
				type: 'lin',
				slope: 100
			}
		},
		0 // no special Buy Function
	);
	new Univ.Object('star3','star','Stellar Nursery','Stellar Nurseries',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return Univ.Items['nebula'].total_number >= 12345 / 4;
		},
		{ // CostEquation
			nebula: {
				visible: 1,
				type: 'lin',
				slope: 12345
			}
		},
		20, // Base Interval
		{ // ProductionEquation
			star: {
				visible: 1,
				type: 'lin',
				slope: 800
			}
		},
		{ // ConsumptionEquation
			nebula: {
				visible: 1,
				type: 'lin',
				slope: 600
			}
		},
		0 // no special Buy Function
	);
	new Univ.Object('lightatom1','atom','Primordial Spallation','Primordial Spallation',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return (Univ.Items['qfoam'].total_number >= 10000000 / 4 && Univ.Items['atom'].total_number >= 10000000 / 4 );
		},
		{ // CostEquation
			qfoam: {
				visible: 1,
				type: 'lin',
				slope: 10000000
			}
		},
		1, // Base Interval
		{ // ProductionEquation
			lightatom: {
				visible: 1,
				type: 'lin',
				slope: 1
			},
			atom: {
				visible: 0,
				type: 'lin',
				slope: 1
			}
		},
		{ // ConsumptionEquation
			atom: {
				visible: 0,
				type: 'lin',
				slope: 3
			},
			simpleatom: {
				visible: 1,
				type: 'lin',
				slope: 3
			}
		},
		0 // no special Buy Function
	);
	new Univ.Object('mediumatom1','atom','Main Sequence Ignition','Main Sequence Ignition',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return (Univ.Items['star'].total_number >= 155 / 4 && Univ.Items['atom'].total_number >= 100000000 / 4 );
		},
		{ // CostEquation
			star: {
				visible: 1,
				type: 'lin',
				slope: 155
			}
		},
		300, // Base Interval
		{ // ProductionEquation
			mediumatom: {
				visible: 1,
				type: 'lin',
				slope: 900000
			},
			atom: {
				visible: 0,
				type: 'lin',
				slope: 900000
			}
		},
		{ // ConsumptionEquation
			atom: {
				visible: 1,
				type: 'lin',
				slope: 9500000
			},
			simpleatom: {
				visible: 1,
				type: 'lin',
				slope: 9500000
			}
		},
		0 // no special Buy Function
	);
	new Univ.Object('mediumatom2','atom','Convection Zoning Law','Convection Zoning Laws',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return (Univ.Items['star'].total_number >= 1777 / 4 && Univ.Items['atom'].total_number >= 100000000 / 4 );
		},
		{ // CostEquation
			star: {
				visible: 1,
				type: 'lin',
				slope: 1777
			}
		},
		240, // Base Interval
		{ // ProductionEquation
			mediumatom: {
				visible: 1,
				type: 'lin',
				slope: 900000
			},
			atom: {
				visible: 0,
				type: 'lin',
				slope: 900000
			}
		},
		{ // ConsumptionEquation
			atom: {
				visible: 1,
				type: 'lin',
				slope: 8500000
			},
			simpleatom: {
				visible: 1,
				type: 'lin',
				slope: 8500000
			}
		},
		0 // no special Buy Function
	);
	new Univ.Object('heavyatom1','atom','Supernova Spark','Supernova Sparks',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return (Univ.Items['star'].total_number >= 313 / 4 && Univ.Items['mediumatom'].total_number >= 100000000 / 4 );
		},
		{ // CostEquation
			star: {
				visible: 1,
				type: 'lin',
				slope: 313
			}
		},
		300, // Base Interval
		{ // ProductionEquation
			heavyatom: {
				visible: 1,
				type: 'lin',
				slope: 9000000
			},
			atom: {
				visible: 0,
				type: 'lin',
				slope: 9000000
			}
		},
		{ // ConsumptionEquation
			star: {
				visible: 1,
				type: 'lin',
				slope: 10
			}
		},
		0 // no special Buy Function
	);
	new Univ.Object('galaxy1','galaxy','Accretion Disco','Accretion Discos',0,
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		function(){ // isVisible
			return (Univ.Items['star'].total_number >= 1000 / 4 );
		},
		{ // CostEquation
			star: {
				visible: 1,
				type: 'lin',
				slope: 1000
			}
		},
		900, // Base Interval
		{ // ProductionEquation
			galaxy: {
				visible: 1,
				type: 'lin',
				slope: 1
			}
		},
		{ // ConsumptionEquation
			star: {
				visible: 1,
				type: 'lin',
				slope: 12000
			}
		},
		0 // no special Buy Function
	);
}