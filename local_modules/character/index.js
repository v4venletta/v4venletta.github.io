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
		this.sheet = json[json.findIndex(sheet => sheet.name == this.class + " perks")];
		//this.save();
		console.log(this.sheet);
	}

	//Callback function to set the perks to bind the context to "this".
	setDeck(json){

		//Not sure if this is the best place to determine which cards are base vs mods but it's here for now.
		var baseCards, modCards;
		baseCards = json.filter(card => card.name.startsWith("am-p-"));
		//modCards = json.filter(card => card.name.startsWith ("am-" + this.class.abbr));

		//Check to see if the global modifier deck has been set, if not set it.
		//to-do - Include monster modifier cards and make the filter logic more sound.
		// if (!sessionStorage.getItem("globalModCards")) {
		// 	sessionStorage.setItem("globalModCards", JSON.stringify(json.filter(card => card.name.startsWith("am-pm-"))));
		// }

		this.deck = new Deck(baseCards, modCards);
		//this.save();
	}

	setClass(className){
		this.class = className;
		this.load();
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

		//}
	}

	static takeGlobalModCard(cardValue){
		var globalModCards, index, card;

		//Get the globalModCards
		globalModCards = JSON.parse(sessionStorage.getItem("globalModCards"));

		//Find the card by name
		index = globalModCards.findIndex(card => card.value == cardValue);

		//Take the card out of the array
		card = globalModCards.splice(index, 1);

		//Set global cards now that we've removed one.
		sessionStorage.setItem("globalModCards", JSON.stringify(globalModCards));

		//to-do - throw an error or instantiate the globalModCards if null
		return card;
	}

	static returnGlobalModCard(cardObj){
		var globalModCards = JSON.parse(sessionStorage.getItem("globalModCards"));
		globalModCards.push(cardObj);
		sessionStorage.setItem("globalModCards", JSON.stringify(globalModCards));
	}
}