console.log("Hello world");
import {MDCDrawer} from "@material/drawer";
import {MDCList} from "@material/list";
import {MDCTopAppBar} from "@material/top-app-bar";


const drawer = MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));

const topAppBar = MDCTopAppBar.attachTo(document.getElementById('app-bar'));
topAppBar.setScrollTarget(document.getElementById('main-content'));
topAppBar.listen('MDCTopAppBar:nav', () => {
  drawer.open = !drawer.open;
});

const listEl = document.querySelector('.mdc-drawer .mdc-list');
const mainContentEl = document.querySelector('.main-content');

listEl.addEventListener('click', (event) => {
  mainContentEl.querySelector('input, button').focus();
});

mainContentEl.addEventListener('click', (event) => {
drawer.open = false;
});
