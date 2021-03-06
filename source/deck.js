class Deck {
	constructor (baseCards, modCards = []) {
		this.drawPile = baseCards 
		this.discardPile = [];
		this.modPile = modCards;
		this.shuffle();
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

	drawNoDiscard(){
		if (this.drawPile.length < 1){
			this.shuffleAll();
		}
		return this.drawPile.pop();
	}

	draw(){
		return this.drawCards()[0];
	}

	drawCards(numCards = 1){
		var i = 1, drawnCards = [], cardsToDiscard = [], rollingModCount = 0;

		do {
			i++;

			let drawnCard = this.drawNoDiscard();
			drawnCards.push(drawnCard);

			//Prevents blessing and curses from being discarded
			if (drawnCard.value != "bless" && drawnCard.value != "curse") {
				cardsToDiscard.push(drawnCard);
			}

			//Check to see if the card has a rolling modifier
			//to-do Updated the logic once we've added the rolling value/condition
			if (drawnCard.value == "rolling") {
				rollingModCount++;
			}

		//If we have drawn all rolling modifiers then keep drawing
		} while (i <= numCards || rollingModCount == drawnCards.length);

		//Put the cards into the discard pile
		this.discardPile = this.discardPile.concat(cardsToDiscard);
		return drawnCards;
	}

	drawAdvantage(){
		//to-do determine which card is better
		return this.drawCards(2);
	}
	
	drawDisadvantage(){
		//to-do determine which card is worse
		return this.drawCards(2);
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