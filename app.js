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
import {Deck} from 'deck';
import {Character} from 'character';

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

//Instantiating a new Character
try {

var activeCharacter = new Character('base','');
console.log(activeCharacter);
} catch(err) {
	console.log(err);
	console.error(err);
}

//localStorage.removeItem("Character(test7)");
select.listen('MDCSelect:change', () => {
	console.log("select listener");
  if (activeCharacter === undefined) {
    document.getElementById("chosen-class").src = `/images/class-icons/${select.value}.png`;
  } else if (activeCharacter.class != `${select.value}`) {
    document.getElementById("chosen-class").src = `/images/class-icons/${select.value}.png`;
    activeCharacter.class = `${select.value}`;
    activeCharacter.setClass(activeCharacter.class);
    console.log(`${select.value}` + ':' + activeCharacter.class);
  }
});

//Add event listener to hand for handling cards being drawn
document.getElementById("hand").addEventListener('click', (event) => {
  $("#cards").slideUp("fast");
  var discardPile = document.getElementById("discard");
  var tempDeck = activeCharacter.deck;
  //This is now handled by Deck.draw()
  // if (tempDeck.drawPile.length === 0) {
  //   tempDeck.shuffleAll();
  // }
  var drawnCard = tempDeck.draw();
  var stats = document.getElementById("stats");

  stats.innerHTML="Draw Pile: " + tempDeck.drawPile.length + ", Discard Pile: " + tempDeck.discardPile.length;
  discardPile.src = '/images/' + drawnCard.image;
  if (activeCharacter.deck.shuffleNeeded) {
    var warning = document.getElementById("warning");
  	warning.style = "display:inline;color:red;";
  }

});

document.getElementById("bless").addEventListener('click', (event) => {
var blessingCard =   {    "name": "am-pm-01",
    "points": 50,
    "image": "attack-modifiers/base/player-mod/am-pm-01.png",
    "value": "bless",
    "xws": "ampm01"
  };
  var tempDeck = activeCharacter.deck;
  tempDeck.addCard(blessingCard);


});

document.getElementById("discard").addEventListener('click', (event) => {
  $("#cards").slideDown("fast");
	var pileHTML = '';
	for (var i = activeCharacter.deck.discardPile.length-1;i>=0; i--){
		pileHTML = pileHTML + '<img src="' +'/images/' + activeCharacter.deck.discardPile[i].image + '" class="rounded_s" style="display:inline-block;width:100px;">'
	}
	fullDiscard.innerHTML = pileHTML;

});

//Adding event listener to handle shuffling
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

//Handle building the elements inside the modal window
document.getElementById("flip").addEventListener('click',(event) => {
  let tempDeck = activeCharacter.deck;
  let drawnCards = tempDeck.drawCards(2);
  let stats = document.getElementById("stats");
  let card1 = document.getElementById("recent");
  let card2 = document.getElementById("recent-1");

  stats.innerHTML="Draw Pile: " + tempDeck.drawPile.length + ", Discard Pile: " + tempDeck.discardPile.length;
  card1.src = '/images/' + drawnCards[0].image;
  card1.attributes["data-mdc-dialog-action"].value = card1.src;
  card2.src = '/images/' + drawnCards[1].image;
  card2.attributes["data-mdc-dialog-action"].value = card2.src;

  dialog.open();
});

dialog.listen('MDCDialog:opened', (event) => {
  console.log("Dialog Opened");
});

dialog.listen('MDCDialog:closed', (event) => {
  if (activeCharacter.deck.shuffleNeeded) {
    document.getElementById("warning").style = "display:inline;color:red;";
  }
  if (event.detail.action == "close"){
    document.getElementById("discard").src = '/images/' + activeCharacter.deck.discardPile[activeCharacter.deck.discardPile.length-1].image; 
  } else {
    document.getElementById("discard").src = event.detail.action;
  }
  
});
