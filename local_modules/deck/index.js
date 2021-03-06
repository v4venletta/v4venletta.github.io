export class Deck {
	constructor (baseCards, modCards = [], globalModCards = []) {
		this.drawPile = baseCards 
		this.discardPile = [];
		this.modPile = modCards;
		this.globalModCards = globalModCards;
		this.shuffleNeeded = false;
		this.shuffle();
	}

	addCard(cardObj){
		this.drawPile.push(cardObj);
		this.shuffle();
	}

	addModCardByName(cardName){
		var index = this.modPile.findIndex(card => card.name == cardName);
		this.drawPile.push(this.modPile[index]);
		this.modPile.splice(index, 1);
		this.shuffle();
	}

	removeCardByName(cardName){
		var index = this.drawPile.findIndex(card => card.name == cardName);
		this.removeCardByIndex(index);
	}

	removeCardByIndex(index){

		//Determine where the removed card came from and put it back in the correct place.
		var urlArray = this.drawPile[index].image.split("/");
		switch (urlArray[urlArray.length - 1]) {
			case "player":
			case "monster":
				break;
			case "player-mod":
				this.returnGlobalModCard(this.drawPile[index]);
				break;
			case "monster-mod":
				//to-do - return this to the global deck
				break;
			default:
				this.modPile.push(this.drawPile[index]);

		}

		console.log("Removed " + this.drawPile[index].name + " card");
		this.drawPile.splice(index, 1);
	}

	drawNoDiscard(){
		if (this.drawPile.length < 1){
			this.shuffleAll();
		}
		let card = this.drawPile.pop();

		if (card.value == "x2" || card.value == "miss"){
			this.shuffleNeeded = true;
		}

		return card;
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
			} else {
				this.returnGlobalModCard(drawnCard);
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
		this.shuffleNeeded = false;
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

	takeGlobalModCard(cardValue){
		let index, card;

		//Get the globalModCards
		//globalModCards = JSON.parse(sessionStorage.getItem("globalModCards"));

		//Find the card by name
		index = this.globalModCards.findIndex(card => card.value == cardValue);

		//Take the card out of the array
		if (index > -1) {
			card = this.globalModCards.splice(index, 1)[0];
		}

		//Set global cards now that we've removed one.
		//sessionStorage.setItem("globalModCards", JSON.stringify(globalModCards));

		//to-do - throw an error or instantiate the globalModCards if null
		return card;
	}

	returnGlobalModCard(cardObj){
		this.globalModCards.push(cardObj);
		// Future use with Session/LocalStorate
		// var globalModCards = JSON.parse(sessionStorage.getItem("globalModCards"));
		// globalModCards.push(cardObj);
		// sessionStorage.setItem("globalModCards", JSON.stringify(globalModCards));
	}
}