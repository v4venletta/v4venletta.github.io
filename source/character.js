class Character {
	constructor(strName, strClass){
		this.name = strName;

		//to-do Update the logic in this to not use "perks" in the name of the class.
		this.class = strClass;
		this.sheet;
		this.deck;
		this.items = [];
		this.activePerks = [];
		this.xp = 0;
		this.gold = 0;

		this.load();

	}

	applyPerk(perkName){
		var perk = this.sheet.perks.filter(perk => perk.name == perkName);
		this.deck.shuffleAll();
		
		perk.actions.foreach(function(action) {
			switch(action.type) {
				case 'remove':
					action.cards.foreach(function(card) {
						this.deck.removeCardByName(card.name);
					});
					break;
				case 'add':
					//to-do Not sure how I want to do this yet.
					break;
				default:
					//to-do error handling
			}
		});

	}

	get storageName(){
		//to-do make sure this isn't vulnerable to injection.
		return "Character(" + this.name + ")";
	}

	//Had to use a callback function to set the perks so I could bind the context to "this".
	setSheet = function(json){
		this.sheet = json.filter(sheet => sheet.name == this.class);
		this.save();
	}

	//Had to use a callback function to set the deck so I could bind the context to "this".
	setDeck = function(json){
		this.deck = new Deck(json);
		this.save();
	}

	delete(){
		localStorage.removeItem(this.storageName);
	}

	save(){
		localStorage.setItem(this.storageName, JSON.stringify(this));
	}

	load(){
		//to-do make sure this isn't vulnerable to injection.
		var char = localStorage.getItem(this.storageName);

		//If the character is already stored in local storage then load it.
		if (char != null){			
			Object.assign(this, JSON.parse(char));
		//If not then initialize a few more things.
		} else {
			$.getJSON("../data/character-perks+.js")
				.then(this.setSheet.bind(this))
			    .fail(function(json) {
			        //to-do error handling
		    	});
			$.getJSON("../data/am_base_player.js")
				.then(this.setDeck.bind(this))
				.fail(function(json) {
					//to-do error handling
				});
		}
	}
}