class Deck {
	constructor () {
		this.drawPile = {};
		this.discardPile = {};
	}

	//Draw Function
	function draw(){
		var drawnCard = this.drawPile.pop();
		this.discardPile.push(drawnCard);
		return drawnCard;
	}

	//
	function advantageDraw(){
		
		var cards = []
		cards.push(this.drawPile.pop())
		cards.push(this.drawPile.pop());
		//V2 would determine which card was more valuable automatically if possible.
		return cards;
	}
	function disadvantageDraw(){
		//V2
		this.advantageDraw();
	}

	//Shuffles only the draw pile.  Used for blessings, curses and negative scenario effects.
	function shuffle(){
		let m = this.drawPile.length, i;

		while (m) {
			i = Math.floor(Math.random() * m--);
			[this.drawPile[m], this.drawPile[i]] = [this.drawPile[i], this.drawPile[m]];
		}
	}

	//Shuffles the draw and discard pile together.
	function shuffleAll(){
		this.drawPile = this.drawPile.concat(this.discardPile);
		this.discardPile = [];
		this.shuffle();
	}

	get length(){
		return this.drawPile.length + this.discardPile.length;
	}

	// function setClass(class){
	// 	this.class = class
	// }

	//Pull in the JSON and return an array.
	function populateDeck(){
		var request = new XMLHttpRequest();
		request.open('GET', '/data/attack-modifiers.js');
		request.responseType = 'json';
		request.send();
		request.onload = function() {
			attackModifiers = request.response;
			/*populateDeck(attackModifiers);*/
		}
	}
}