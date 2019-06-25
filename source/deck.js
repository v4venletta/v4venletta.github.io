class Deck {
	constructor () {
		this.drawPile = [];
		this.discardPile = [];

		this.populateBaseDeck();
	}

	// addCard(){

	// }

	// removeCard(){

	// }

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

	get lengthOfDrawPile(){
		return this.drawPile.length;
	}

	get lengthOfDiscardPile(){
		return this.discardPile.length;
	}

	//Not sure if I need these
	// get drawPile() {
	// 	return this.drawPile;
	// }

	// get discardPile() {
	// 	return this.discardPile;
	// }

	// setClass(strClass){
	// 	this.class = class
	// }

	/*Pull in the JSON and return an array.*/
	populateBaseDeck(){
		var request = new XMLHttpRequest();
		request.open('GET', '/data/attack-modifiers.js');
		request.responseType = 'json';
		request.send();
		request.onload = function() {
			this.drawPile = request.response;
			/*populateDeck(attackModifiers);*/
		}
	}
}