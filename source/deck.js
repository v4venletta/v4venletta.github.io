class Deck {
	constructor (jsonObj) {
		this.drawPile = jsonObj 
		this.discardPile = [];
		//this.loadBaseDeck();
	}

	addCard(jsonCardObj){

	}

	removeCard(jsonCardObjd){

	}

	removeCardByIndex(index){
		this.drawPile = this.drawPile.splice(index, 1);
	}

	//Draw Function
	draw(){
		var drawnCard = this.drawPile.pop();
		this.discardPile.push(drawnCard);
		return drawnCard;
	}

	//
	advantageDraw(){
		
		var cards = [];
		cards.push(this.drawPile.pop())
		cards.push(this.drawPile.pop());
		this.discardPile = this.discardPile.concat(cards);

		//V2 would determine which card was more valuable automatically if possible.
		return cards;
	}
	disadvantageDraw(){
		//V2 would handle this differently than advantageDraw
		return this.advantageDraw();
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

	// setClass(strClass){
	// 	this.class = class
	// }
}