Univ.LoadUpgrades = function(){
// id,name,items_affected,type,generator,factor,infoblurb,cost,VisibilityFcn
	new Univ.GeneratorUpgrade('test','Free Test Upgrade','qfoam','multiply','qfoam1',3,
	'<b>Effect:</b> Triples the Quantum Foam production rate of Quantum Field Equations.',
	function(){ // cost
		var prices = {
			qfoam: 10000
		}
		return prices;
	},
	function(){ // visibility
		return !this.bought;
	});
}