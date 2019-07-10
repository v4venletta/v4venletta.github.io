import {
  MDCDrawer
} from "@material/drawer";
import {
  MDCList
} from "@material/list";
import {
  MDCTopAppBar
} from "@material/top-app-bar";
import {
  MDCSelect
} from '@material/select';
import {
  MDCMenu
} from '@material/menu';
import {MDCDialog} from '@material/dialog';

const dialog = new MDCDialog(document.querySelector('.mdc-dialog'));
const select = new MDCSelect(document.querySelector('.mdc-select'));
const drawer = MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));
const listEl = document.querySelector('.mdc-drawer .mdc-list');
const topAppBar = MDCTopAppBar.attachTo(document.getElementById('app-bar'));
var fullDiscard = document.getElementById("discardpile"); 

/*dialog.listen('MDCDialog:opened', function() {
  // Assuming contentElement references a common parent element with the rest of the page's content
  contentElement.setAttribute('aria-hidden', 'true');
});

dialog.listen('MDCDialog:closing', function() {
  contentElement.removeAttribute('aria-hidden');
});*/

topAppBar.setScrollTarget(document.getElementById('main-content'));
topAppBar.listen('MDCTopAppBar:nav', () => {
  drawer.open = !drawer.open;
});
console.log("pre active character");
try {
var activeCharacter = new Character('base','');
} catch(err) {
	console.log(err);
	console.error(err);
}
console.log("post new character");
//localStorage.removeItem("Character(test7)");
select.listen('MDCSelect:change', () => {
	console.log("select listener");
  if (activeCharacter === undefined) {
    document.getElementById("chosen-class").src = `/images/class-icons/${select.value}.png`;
  } else if (activeCharacter.class != `${select.value}`) {
    document.getElementById("chosen-class").src = `/images/class-icons/${select.value}.png`;
    activeCharacter.class = `${select.value}`;
    console.log(`${select.value}` + ':' + activeCharacter.class);
  }
});

document.getElementById("hand").addEventListener('click', (event) => {
  var discardPile = document.getElementById("discard");
  var tempDeck = activeCharacter.deck;
  if (tempDeck.drawPile.length === 0) {
    tempDeck.shuffleAll();
  }
  var drawnCard = tempDeck.draw();
  var stats = document.getElementById("stats");

  stats.innerHTML="Draw Pile: " + tempDeck.drawPile.length + ", Discard Pile: " + tempDeck.discardPile.length;
  discardPile.src = '/images/' + drawnCard.image;
  if (drawnCard.value === "x2" || drawnCard.value === "miss") {
	var warning = document.getElementById("warning");
  	warning.style = "display:inline;color:red;";
  }
  
});

document.getElementById("discard").addEventListener('click', (event) => {
	var pileHTML = '';
	for (var i = activeCharacter.deck.discardPile.length-1;i>=0; i--){
		pileHTML = pileHTML + '<img src="' +'/images/' + activeCharacter.deck.discardPile[i].image + '" class="rounded_s" style="display:inline-block;width:100px;">'
	}
	fullDiscard.innerHTML = pileHTML ;
});

document.getElementById("shuffle").addEventListener('click', (event) => {
  var discardPile = document.getElementById("discard");
  var tempDeck = activeCharacter.deck;
  tempDeck.shuffleAll();

  discardPile.src = '';
  var stats = document.getElementById("stats");
  stats.innerHTML="Draw Pile: " + tempDeck.drawPile.length + ", Discard Pile: " + tempDeck.discardPile.length;
  var warning = document.getElementById("warning");
  warning.style = "display:none;";

});

document.getElementById("flip").addEventListener('click',(event)=>{
dialog.open();
});