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
console.log(1);
const select = new MDCSelect(document.querySelector('.mdc-select'));
console.log(2);
const drawer = MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));
console.log(3);
const listEl = document.querySelector('.mdc-drawer .mdc-list');
console.log(4);
const topAppBar = MDCTopAppBar.attachTo(document.getElementById('app-bar'));
console.log(5);

topAppBar.setScrollTarget(document.getElementById('main-content'));
topAppBar.listen('MDCTopAppBar:nav', () => {
  drawer.open = !drawer.open;
});

var activeCharacter;
localStorage.removeItem("Character(test7)");
select.listen('MDCSelect:change', () => {
  if (activeCharacter === undefined) {
    document.getElementById("chosen-class").src = `/images/class-icons/${select.value}.png`;
    activeCharacter = new Character("test7", `${select.value}`);
    console.log('New Character');
  } else if (activeCharacter.class != `${select.value}`) {
    document.getElementById("chosen-class").src = `/images/class-icons/${select.value}.png`;
    activeCharacter.class = `${select.value}`;
    console.log(`${select.value}`);
  }
});
document.getElementById("hand").addEventListener('click', (event) => {
  alert("click1");
  var discardPile = document.getElementById("discard");
  var tempDeck = activeCharacter.deck;
  alert("click2");
  if (tempDeck.drawPile.length === 0) {
    tempDeck.shuffleAll();
  }
  var drawnCard = tempDeck.draw();
  alert("click3");
  var stats = document.getElementById("stats");
  alert("click4");
  stats.innerHTML="Draw Pile: " + tempDeck.drawPile.length + ", Discard Pile: " + tempDeck.discardPile.length;
  //console.log(drawnCard);
  //console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(activeCharacter)));
  //console.log(tempDeck.draw());
  discardPile.src = '/images/' + drawnCard.image;
  alert("click5");
});

document.getElementById("shuffle").addEventListener('click', (event) => {
  var discardPile = document.getElementById("discard");
  var tempDeck = activeCharacter.deck;
  tempDeck.shuffleAll();
  //var drawnCard = tempDeck.draw();
  //  console.log(drawnCard);
  //console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(activeCharacter)));
  //console.log(tempDeck.draw());
  discardPile.src = '';
  var stats = document.getElementById("stats");
  stats.innerHTML="Draw Pile: " + tempDeck.drawPile.length + ", Discard Pile: " + tempDeck.discardPile.length;
});
