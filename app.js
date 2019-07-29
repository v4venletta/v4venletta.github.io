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
import {
    MDCDialog
} from '@material/dialog';
import {
    MDCCheckbox
} from '@material/checkbox';
import {
    Deck
} from 'deck';
import {
    Character
} from 'character';
import anime from 'animejs/lib/anime.es.js';
const characterClasses = {
    beasttyrant: {
        name: "beast tyrant",
        abbr: "bt"
    },
    berserker: {
        name: "berserker",
        abbr: "be"
    },
    bladeswarm: {
        name: "bladeswarm",
        abbr: "bs"
    },
    brute: {
        name: "brute",
        abbr: "br"
    },
    cragheart: {
        name: "cragheart",
        abbr: "ch"
    },
    diviner: {
        name: "diviner",
        abbr: "dr"
    },
    doomstalker: {
        name: "doomstalker",
        abbr: "ds"
    },
    elementalist: {
        name: "elementalist",
        abbr: "el"
    },
    mindthief: {
        name: "mindthief",
        abbr: "mt"
    },
    nightshroud: {
        name: "nightshroud",
        abbr: "ns"
    },
    plagueherald: {
        name: "plagueherald",
        abbr: "ph"
    },
    quartermaster: {
        name: "quartermaster",
        abbr: "qm"
    },
    sawbones: {
        name: "sawbones",
        abbr: "sb"
    },
    scoundrel: {
        name: "scoundrel",
        abbr: "sc"
    },
    soothsinger: {
        name: "soothsinger",
        abbr: "ss"
    },
    spellweaver: {
        name: "spellweaver",
        abbr: "sw"
    },
    summoner: {
        name: "summoner",
        abbr: "su"
    },
    sunkeeper: {
        name: "sunkeeper",
        abbr: "sk"
    },
    tinkerer: {
        name: "tinkerer",
        abbr: "ti"
    }
};

const dialog = new MDCDialog(document.querySelector('.mdc-dialog'));
const perksDialog = new MDCDialog(document.getElementById('perks'));
const select = new MDCSelect(document.querySelector('.mdc-select'));
const drawer = MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));
const listEl = document.querySelector('.mdc-drawer .mdc-list');
const topAppBar = MDCTopAppBar.attachTo(document.getElementById('app-bar'));
var fullDiscard = document.getElementById("discardpile");
var rotate = 0;

topAppBar.setScrollTarget(document.getElementById('main-content'));
topAppBar.listen('MDCTopAppBar:nav', () => {
    drawer.open = !drawer.open;
});

//Instantiating a new Character
try {

    var activeCharacter = new Character('base', '');
    console.log(activeCharacter);
} catch (err) {
    console.log(err);
    console.error(err);
}

//localStorage.removeItem("Character(test7)");
select.listen('MDCSelect:change', () => {   

    document.getElementById("chosen-class").src = `/images/class-icons/${select.value}.png`;

    activeCharacter.setClass(characterClasses[`${select.value}`])
        .then(function() {
            var perkDiv = document.getElementById("perksContent");
            perkDiv.innerHTML = "";

            if (activeCharacter.sheet.perks){  
              for (let i = 0; i < activeCharacter.sheet.perks.length; i++){
                //Start of code to replace (icon) text with the actual icon images.
                let labelText = activeCharacter.sheet.perks[i].name.replace(/\([^)]+\)/g, (match, string) => {
                      return `<img style="height: 25px; width: 25px;" src="/images/icons/${match.substr(1, match.length-2)}.png">`;
                });


                let newDiv = document.createElement("div");
                newDiv.tabindex = i;
                newDiv.innerHTML = `
                  <div class="mdc-form-field">
                    <div class="mdc-checkbox">
                      <input type="checkbox"
                             class="mdc-checkbox__native-control"
                             value="${i}"
                             id="checkbox-${i}"/>
                      <div class="mdc-checkbox__background">
                        <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24">
                          <path class="mdc-checkbox__checkmark-path" 
                                fill="none" 
                                d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
                        </svg>
                        <div class="mdc-checkbox__mixedmark"></div>
                      </div>
                    </div>
                    <label for="checkbox-${i}">${labelText}</label>
                  </div>`;

                perkDiv.appendChild(newDiv);
              }
            } else {
              perkDiv.innerHTML = "Comming Soon";
            }
            
            // console.log("Active Character");
            // console.log(activeCharacter);
        })
        .fail(function() {
            console.log("Set Class Failed");
        });
});


//Add event listener to hand for handling cards being drawn
var cardState = "front";
document.getElementById("hand").addEventListener('click', (event) => {
    $("#cards").slideUp("fast");
    var discardPile = document.getElementById("discarded");
    var tempDeck = activeCharacter.deck;
    if (tempDeck.discardPile.length > 0) {
        document.getElementById("discardParent").style.backgroundImage = "url('/images/" + tempDeck.discardPile[tempDeck.discardPile.length - 1].image + "')";
    };
    var drawnCard = tempDeck.draw();
    var stats = document.getElementById("stats");

    stats.innerHTML = "Draw Pile: " + tempDeck.drawPile.length + ", Discard Pile: " + tempDeck.discardPile.length;
    discardPile.src = '/images/' + drawnCard.image;
    document.getElementById("discard").style.zIndex = 1;
    if (screen.width <= 600) {
        console.log(screen.width);
        if (cardState === "back") {
            anime({
                targets: '#discard',
                rotateY: '+=180',
                duration: 0,
                delay: 10
            });
            cardState = "front";
            console.log(cardState);
        }
        anime({
            targets: '#discard',
            scale: [{
                value: 1
            }, {
                value: 1.4
            }, {
                value: 1,
                delay: 250
            }],
            rotateY: {
                value: '+=180',
                delay: 200
            },
            translateY: {
                value: [-200, 0],
                duration: 400
            },
            easing: 'easeInOutSine',
            duration: 400

        });

    } else {
        console.log(screen.width);
        if (cardState === "back") {
            anime({
                targets: '#discard',
                rotateY: '+=180',
                duration: 0,
                delay: 10
            });
            cardState = "front";
            console.log(cardState);
        }
        anime({
            targets: '#discard',
            scale: [{
                value: 1
            }, {
                value: 1.4
            }, {
                value: 1,
                delay: 250
            }],
            rotateY: {
                value: '+=180',
                delay: 200
            },
            translateX: {
                value: [-600, 0],
                duration: 800
            },
            easing: 'easeInOutSine',
            duration: 400
        });
    }
    if (activeCharacter.deck.shuffleNeeded) {
        var warning = document.getElementById("warning");
        warning.style = "display:inline;color:red;";
    }
    cardState = "back";
});


document.getElementById("bless").addEventListener('click', (event) => {
    let blessingCard = {
        "name": "am-pm-01",
        "points": 50,
        "image": "attack-modifiers/base/player-mod/am-pm-01.png",
        "value": "bless",
        "xws": "ampm01"
    };
    let tempDeck = activeCharacter.deck;
    tempDeck.addCard(blessingCard);
    let blessDeck = document.getElementById("modDeck");
    blessDeck.src = "/images/attack-modifiers/base/player-mod/am-pm-01.png";
    blessDeck.style.opacity = 1.0;
    rotate = rotate + 360;
    anime({
        targets: '#modDeck',
        translateX: {
            value: [-250, 0],
            duration: 800
        },
        opacity: {
            value: 0.0,
            delay: 800,
            easing: 'linear'
        },
        rotate: rotate,
        duration: 800
    });

});
document.getElementById("curse").addEventListener('click', (event) => {
    let curseCard = {
        "name": "am-pm-21",
        "points": 50,
        "image": "attack-modifiers/base/player-mod/am-pm-21.png",
        "value": "curse",
        "xws": "ampm21"
    };
    let tempDeck = activeCharacter.deck;
    tempDeck.addCard(curseCard);
    let curseDeck = document.getElementById("modDeck");
    curseDeck.src = "/images/attack-modifiers/base/player-mod/am-pm-21.png";
    curseDeck.style.opacity = 1.0;
    rotate = rotate + 360;
    anime({
        targets: '#modDeck',
        translateX: {
            value: [-250, 0],
            duration: 800
        },
        opacity: {
            value: 0.0,
            delay: 800,
            easing: 'easeInOutSine'
        },
        rotate: rotate,
        duration: 800
    });
});
document.getElementById("discard").addEventListener('click', (event) => {

    var cardsDiv = document.getElementById("cards");
    if (window.getComputedStyle(cardsDiv).display != "none") {
        // Do something..
        console.log("sliding up");
        $('#cards').slideUp("fast");
    } else {
        $('#cards').slideDown("fast");
        var pileHTML = '';
        for (var i = activeCharacter.deck.discardPile.length - 1; i >= 0; i--) {
            pileHTML = pileHTML + '<img src="' + '/images/' + activeCharacter.deck.discardPile[i].image + '" class="rounded_s" style="display:inline-block;width:100px;">'
        }
        fullDiscard.innerHTML = pileHTML;
    }


});


//Adding event listener to handle shuffling
document.getElementById("shuffle").addEventListener('click', (event) => {
    var discardPile = document.getElementById("discard");
    var tempDeck = activeCharacter.deck;
    tempDeck.shuffleAll();
    discardPile.style.zIndex=-1;
    document.getElementById("discardParent").style.backgroundImage = "";
    var stats = document.getElementById("stats");
    stats.innerHTML = "Draw Pile: " + tempDeck.drawPile.length + ", Discard Pile: " + tempDeck.discardPile.length;
    var warning = document.getElementById("warning");
    warning.style = "display:none;";

});

//Handle building the elements inside the modal window
document.getElementById("flip").addEventListener('click', (event) => {
    let tempDeck = activeCharacter.deck;
    let drawnCards = tempDeck.drawCards(2);
    let stats = document.getElementById("stats");
    let card1 = document.getElementById("recent");
    let card2 = document.getElementById("recent-1");

    stats.innerHTML = "Draw Pile: " + tempDeck.drawPile.length + ", Discard Pile: " + tempDeck.discardPile.length;
    card1.src = '/images/' + drawnCards[0].image;
    card1.attributes["data-mdc-dialog-action"].value = card1.src;
    card2.src = '/images/' + drawnCards[1].image;
    card2.attributes["data-mdc-dialog-action"].value = card2.src;

    dialog.open();
});

document.getElementById('chosen-class').addEventListener('click', (event) => {
    perksDialog.open();
});

dialog.listen('MDCDialog:opened', (event) => {
    console.log("Dialog Opened");
});

dialog.listen('MDCDialog:closed', (event) => {
    if (activeCharacter.deck.shuffleNeeded) {
        document.getElementById("warning").style = "display:inline;color:red;";
    }
    if (event.detail.action == "close") {
        document.getElementById("discard").src = '/images/' + activeCharacter.deck.discardPile[activeCharacter.deck.discardPile.length - 1].image;
    } else {
        document.getElementById("discard").src = event.detail.action;
    }

});

perksDialog.listen('MDCDialog:closed', (event) => {
    if (event.detail.action == "accept") {
        let perkDiv = document.getElementById("perksContent");
        let checkBoxes = perkDiv.getElementsByTagName("input");
        activeCharacter.load()
          .then(function() {
              for (let i = 0; i < checkBoxes.length; i++) {
                  if (checkBoxes[i].checked) {
                      activeCharacter.applyPerk(i);
                  }
              }
          });       
    }
});