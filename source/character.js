class Character {
	constructor(strClass){
		this.name = "";
		this.class = strClass;
		this.perks;
		this.deck;
		this.items = [];
		this.xp = 0;
		this.gold = 0;

		$.getJSON("../data/character-perks+.js", {data: "value"}, function(json){
			this.perks = json[this.class];
		});

		$.getJSON("../data/am_base_player.js", {data: "value"}, function(json){
			this.deck = new Deck(json);
		});
	}

	applyPerk(perkName){

	}
}