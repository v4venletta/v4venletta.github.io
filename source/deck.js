class Deck {
	constructor (baseCards, modCards = []) {
		this.drawPile = baseCards 
		this.discardPile = [];
		this.modPile = modCards;
	}

	addCard(cardObj){
		this.drawPile.push(cardObj);
	}

	addModCardByName(cardName){
		var index = this.modPile.findIndex(card => card.name == cardName);
		this.drawPile.push(this.modPile[index]);
		this.modPile.splice(index, 1);
	}

	removeCardByName(cardName){
		var index = this.drawPile.findIndex(card => card.name == cardName);
		this.removeCardByIndex(index);
	}

	removeCardByIndex(index){

		//Determine where the removed card came from and put it back in the correct place.
		var urlArray = this.drawPile[index].name.split("/");
		switch (urlArray[urlArray.length - 1]) {
			case "player":
			case "monster":
				break;
			case "player-mod":
				Deck.returnGlobalModCard(this.drawPile[index]);
				break;
			case "monster-mod":
				//to-do - return this to the global deck
				break;
			default:
				this.modPile.push(this.drawPile[index]);

		}

		this.drawPile.splice(index, 1);
	}

	draw(){
		var drawnCard = this.drawPile.pop();
		if (drawnCard.value != "bless" && drawnCard.value != "curse") {
			this.discardPile.push(drawnCard);
		}
		return drawnCard;
	}

	drawAdvantage(){
		
		var cards = [];
		cards.push(this.draw())
		cards.push(this.draw());

		//V2 would determine which card was more valuable automatically if possible.
		return cards;
	}
	
	drawDisadvantage(){

		//V2 would handle this differently than advantageDraw
		return this.drawAdvantage();
	}

	//Shuffles only the draw pile.  Used for blessings, curses and negative scenario effects.
	shuffle(){
		let m = this.drawPile.length, i;

		while (m) {
			i = Math.floor(Math.random() * m--);
			[this.drawPile[m], this.drawPile[i]] = [this.drawPile[i], this.drawPile[m]];
		}
	}

	//Shuffles the draw and discard pile together.
	shuffleAll(){
		this.drawPile = this.drawPile.concat(this.discardPile);
		this.discardPile = [];
		this.shuffle();
	}

	//Total deck length
	get length(){
		return this.drawPile.length + this.discardPile.length;
	}

	/*
		Find a card by card name and type.
		Type = cardTypes enum @utility.js
	*/
	static findCard(cardName, cardTypeEnum){
		$.getJSON("../data/" + cardTypeEnum)
				.then(function(json) {
					return json.filter(card => card.name == cardName);
				})
			    .fail(function(json) {
			        //to-do error handling
		    	});
	}

	static takeGlobalModCard(cardName){
		var globalModCards, index, card;

		//Get the globalModCards
		globalModCards = JSON.parse(localStorage.getItem("globalModCards"));

		//Find the card by name
		index = globalModCards.findIndex(card => card.name == cardName);

		//Take the card out of the array
		card = globalModCards.splice(index, 1);

		//Set global cards now that we've removed one.
		localStorage.setItem("globalModCards", JSON.stringify(globalModCards));

		//to-do - throw an error or instantiate the globalModCards if null
		return card;
	}

	static returnGlobalModCard(cardObj){
		var globalModCards = JSON.parse(localStorage.getItem("globalModCards"));
		globalModCards.push(cardObj);
		localStorage.setItem("globalModCards", JSON.stringify(globalModCards));
	}
}