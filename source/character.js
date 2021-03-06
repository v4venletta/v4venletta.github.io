/*export*/ class Character {
	constructor(strName, characterClass){
		console.log('Character being constructed');
		this.name = strName;

		//to-do Update the logic in this to not use "perks" in the name of the class.
		this.class = characterClass;
		this.sheet;
		this.deck;
		this.items = [];
		this.activePerks = [];
		this.xp = 0;
		this.gold = 0;
		console.log('Pre load()');
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
					action.cards.foreach(function(card) {
						this.deck.addCardByName(card.name);
					});
					break;
				default:
					//to-do error handling
			}
		});

	}

	//to-do
	removePerk(){

	}

	get storageName(){
		//to-do make sure this isn't vulnerable to injection.
		return "Character(" + this.name + ")";
	}

	//Callback function to set the perks to bind the context to "this".
	setSheet(json){
		this.sheet = json.filter(sheet => sheet.name == this.class.name + " perks");
		// this.save();
	}

	//Callback function to set the perks to bind the context to "this".
	setDeck(json){

		//Not sure if this is the best place to determine which cards are base vs mods but it's here for now.
		var baseCards, modCards;
		baseCards = json.filter(card => card.name.startsWith("am-p-"));
		modCards = json.filter(card => card.name.startsWith ("am-" + this.class.abbr));

		//Check to see if the global modifier deck has been set, if not set it.
		//to-do - Include monster modifier cards and make the filter logic more sound.
		if (!localStorage.getItem("globalModCards")) {
			localStorage.setItem("globalModCards", JSON.stringify(json.filter(card => card.name.startsWith("am-pm-"))));
		}

		this.deck = new Deck(baseCards, modCards);
		// this.save();
	}

	delete(){
		localStorage.removeItem(this.storageName);
	}

	save(){
		localStorage.setItem(this.storageName, JSON.stringify(this));
	}

	load(){
		//to-do - make sure this isn't vulnerable to injection.
		// var char = localStorage.getItem(this.storageName);

		//If the character is already stored in local storage then load it.
		// if (char != null){			
		// 	Object.assign(this, JSON.parse(char));
		// //If not then initialize a few more things.
		// } else {
			console.log('Load character-perks');
			$.getJSON("../data/character-perks+.js")
				.then(this.setSheet.bind(this))
			    .fail(function(json) {
			    	console.log('Character perk load failed');
			        //to-do error handling
		    	});
		    console.log('Load attack-modifiers');
			$.getJSON("../data/attack-modifiers.js")
				.then(this.setDeck.bind(this))
				.fail(function(json) {
					console.log('AM Load failed');
					//to-do error handling
				});

		// }
	}
}
