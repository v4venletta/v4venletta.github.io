import {Deck} from '../deck';
export class Character {
	constructor(strName){
		console.log('Character being constructed');
		this.name = strName;
		this.class;
		this.sheet;
		this.deck;
		this.items = [];
		this.activePerks = [];
		this.xp = 0;
		this.gold = 0;
		this.load();

	}

	applyPerk(perkIndex){
		var perk = this.sheet.perks[perkIndex];
		this.deck.shuffleAll();
		
		perk.actions.forEach((action) => {
			switch(action.type) {
				case 'remove':
					action.cards.forEach((card) => {
						this.deck.removeCardByName(card);
					});
					break;
				case 'add':
					action.cards.forEach((card) => {
						this.deck.addModCardByName(card);
					});
					break;
				default:
					//to-do error handling
			}
		});

	}

	get storageName(){
		return "Character(" + this.name + ")";
	}

	//Callback function to set the perks to bind the context to "this".
	setSheet(json){
		this.sheet = json[json.findIndex(sheet => sheet.name == this.class.name + " perks")];
	}

	//Callback function to set the perks to bind the context to "this".
	setDeck(json){

		//Not sure if this is the best place to determine which cards are base vs mods but it's here for now.
		var baseCards, modCards, globalModCards;
		baseCards = json.filter(card => card.name.startsWith("am-p-"));
		globalModCards = json.filter(card => card.name.startsWith("am-pm-")); //Player Mod only right now
		if (this.class){
			modCards = json.filter(card => card.name.startsWith ("am-" + this.class.abbr));
		}

		//Check to see if the global modifier deck has been set, if not set it.
		//to-do - Include monster modifier cards and make the filter logic more sound.
		// if (!sessionStorage.getItem("globalModCards")) {
		// 	sessionStorage.setItem("globalModCards", JSON.stringify(json.filter(card => card.name.startsWith("am-pm-"))));
		// }

		this.deck = new Deck(baseCards, modCards, globalModCards);
		//this.save();
	}

	setClass(classObj){
		this.class = classObj;

		return $.getJSON("../data/character-perks+.js")
			.then(this.setSheet.bind(this))
			.then(this.load.bind(this));
		    // .fail(function(json) {
		    // 	console.log('Character perk load failed');
		    //     //to-do error handling
	    	// });
	}

	delete(){
		//localStorage.removeItem(this.storageName);
	}

	save(){
		//localStorage.setItem(this.storageName, JSON.stringify(this));
		//to-do
	}

	load(){
		//to-do - make sure this isn't vulnerable to injection.
		//var char = localStorage.getItem(this.storageName);

		//If the character is already stored in local storage then load it.
		// if (char != null){			
		// 	//Object.assign(this, JSON.parse(char));
		// //If not then initialize a few more things.
		// } else {
		return $.getJSON("../data/attack-modifiers.js")
				.then(this.setDeck.bind(this));
				// .fail(function(json) {
				// 	console.log('AM Load failed');
				// 	//to-do error handling
				// });

		//}
	}
}