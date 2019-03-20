var version = 0.01;

function lookup(object) {return document.getElementById(object);}

var Game={};

Game.Load = function()
{
	//lookup('game_container').innerHTML = '<div style="padding:64px 64px;">It works!</div>';
};

Game.PublishLog = function(log_entry)
{
	lookup('output_log').innerHTML = log_entry;
};









window.onload = function()
{
	Game.Load();
};
