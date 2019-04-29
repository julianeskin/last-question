Univ.LoadUpgrades = function(){
// id,name,items_affected,type,generator,factor,infoblurb,cost,VisibilityFcn
	new Univ.GeneratorUpgrade('qfoam_upgrade_1','Free Test Upgrade','qfoam','multiply','qfoam1',3,
	'<b>Effect:</b> Triples the Quantum Foam production rate of Quantum Field Equations.',
	function(){ // cost
		var prices = {
			qfoam: 10000
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
}