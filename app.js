import {MDCDrawer} from "@material/drawer";
import {MDCList} from "@material/list";
import {MDCTopAppBar} from "@material/top-app-bar";
import {MDCSelect} from '@material/select';
import {MDCMenu} from '@material/menu';

const drawer = MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));
const menu = new MDCMenu(document.querySelector('.mdc-menu'));
const topAppBar = MDCTopAppBar.attachTo(document.getElementById('app-bar'));
const select = new MDCSelect(document.querySelector('.mdc-select'));

/*
select.listen('MDCSelect:change', () => {
  alert(`Selected option at index ${select.selectedIndex} with value "${select.value}"`);
});
*/
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

