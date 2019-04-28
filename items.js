Univ.LoadItems = function(){
// singular,plural,type,visibility,available_number,total_number,production_rate,consumption_rate
	new Univ.Item('Second','Seconds','secs',0,0,0,0,0);
	new Univ.Item('Kelvin','Kelvin','kelvin',0,0,0,0,0);
	new Univ.Item('Computation','Computations','computation',0,0,0,0,0);
	new Univ.Item('Quantum Foam','Quantum Foam','qfoam',1,100,100,0,0);	// start with 100 Quantum Foam for testing
	new Univ.Item('Elementary Particle','Elementary Particles','elementary',1,0,0,0,0);
	new Univ.Item('Subatomic Particle','Subatomic Particles','subatomic',1,0,0,0,0);
	new Univ.Item('Atom','Atoms','atom',1,0,0,0,0); 		// Atomic Numbers 1-2
	new Univ.Item('Atom','Atoms','lightatom',0,0,0,0,0);	// Atomic Numbers 3-5
	new Univ.Item('Atom','Atoms','mediumatom',0,0,0,0,0);	// Atomic Numbers 6-26
	new Univ.Item('Atom','Atoms','heavyatom',0,0,0,0,0);	// Atomic Numbers 27+
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