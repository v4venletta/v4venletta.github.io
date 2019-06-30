import {MDCDrawer} from "@material/drawer";
import {MDCList} from "@material/list";
import {MDCTopAppBar} from "@material/top-app-bar";
import {MDCSelect} from '@material/select';
import {MDCMenu} from '@material/menu';

const drawer = MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));
const menu = new MDCMenu(document.querySelector('.mdc-menu'));
const topAppBar = MDCTopAppBar.attachTo(document.getElementById('app-bar'));
const select = new MDCSelect(document.querySelector('.mdc-select'));
var activeCharacter;

/* listens for state change on select field */
select.listen('MDCSelect:change', () => {
  if (activeCharacter === undefined)
  {
    document.getElementById("chosen-class").src = `/images/class-icons/${select.value}.png`;
    activeCharacter = new Character("test3", `${select.value}`);
} else if (activeCharacter.class != `${select.value}`) {
  document.getElementById("chosen-class").src = `/images/class-icons/${select.value}.png`;
  activeCharacter.class = `${select.value}`;
}
});

topAppBar.setScrollTarget(document.getElementById('main-content'));
topAppBar.listen('MDCTopAppBar:nav', () => {
  drawer.open = !drawer.open;
});

const listEl = document.querySelector('.mdc-drawer .mdc-list');
const mainContentEl = document.querySelector('.main-content');
/*
listEl.addEventListener('click', (event) => {
  mainContentEl.querySelector('input, button').focus();
});*/

mainContentEl.addEventListener('click', (event) => {
drawer.open = false;
});
/*
var attackModifiers;
		function drawCard() {
		var discardPile = document.getElementById("discard");
		var min = 0;
		var max = attackModifiers.length;
		var random = Math.floor(Math.random() * (+max - +min)) + +min;
		discardPile.src = '/images/' + attackModifiers[random].image;
		}
		var request = new XMLHttpRequest();
		request.open('GET', '/data/am_base_player.js');
		request.responseType = 'json';
		request.send();
		request.onload = function() {
		attackModifiers = request.response;
		populateDeck(attackModifiers);
		}
		function populateDeck(jsonObj) {
		var deckElem = document.getElementById("deck");
		var myList = document.createElement('ul');
		for (var j = 0; j < jsonObj.length; j++) {
		var newItem = document.createElement('li');
		var newImage = document.createElement('IMG');
		newImage.src = '/images/' + jsonObj[j].image;
		/*newItem.appendChild(newImage);
		myList.appendChild(newItem);
		}
		/*deckElem.appendChild(myList);




  }
  function drawCard() {
    var discardPile = document.getElementById("discard");
    var min = 0;
    var max = attackModifiers.length;
    var random = Math.floor(Math.random() * (+max - +min)) + +min;
    discardPile.src = '/images/' + attackModifiers[random].image;
  }*/
		document.getElementById("hand").addEventListener('click',(event) => {
      var discardPile = document.getElementById("discard");
      console.log(activeCharacter.deck);
      console.log(activeCharacter.deck.draw());
		    //discardPile.src = 	'/images/' + activeCharacter.deck.draw().image ;
		});
