import { combineReducers, createStore, compose } from 'redux';
import { dungeonMapReducer, characterReducer} from 'reducers';
import {splitContainer, Container} from 'Container';

const MAP_DIMENSIONS_COLUMNS = 50;
const MAP_DIMENSIONS_ROWS = 30;


export var configure = () => {
	
																//x,y,width,height
	let container = new Container(0,0,MAP_DIMENSIONS_COLUMNS,MAP_DIMENSIONS_ROWS);	
	console.log(container.toString());
	let sc = splitContainer(container, 2); //returns a BSPTree
	console.log(sc.getLeaves());
	
	
	
	const reducer = combineReducers({
		dungeon: dungeonMapReducer
	});
	
	let placeWeapons = () => {
		//Place weapons
		defaultMap[5][5] = {
			...defaultMap[5][5],
			containsWeapon: true,
			weapon: {
				name: 'Club',
				attack: 10
			}
		}
		defaultMap[12][18] = {
			...defaultMap[12][18],
			containsWeapon: true,
			weapon: {
				name: 'Dagger',
				attack: 15
			}
		}
	}	
	
	let placeWalls = () => {
		//Draw some walls
		for (let i = 3; i < 10; i++) {
			defaultMap[i][10] = {
				...defaultMap[i][10],
				isWall: true	
			}
		}	
		for (let i = 3; i < 10; i++) {
			defaultMap[10][i] = {
				...defaultMap[10][i],
				isWall: true	
			}
		}
	}
	
	let placePotions = () => {
		//Add potions
		defaultMap[3][9] = {
			...defaultMap[3][9],
			containsPotion: true,
		}
	}
	
	let placeMonsters = () => {
		//Create a monster
		defaultMap[0][5] = {
			...defaultMap[0][5],
			containsMonster: true,
			monster: {
				hp: 25,
				strength: 5,
				level: 1,
				xp: 10 /* derive xp later based on stats of monster, for now simplify it by giving it as an attribute. */
			}
		}

		//Create a monster
		defaultMap[5][12] = {
			...defaultMap[0][5],
			containsMonster: true,
			monster: {
				hp: 25,
				strength: 5,
				level: 1,
				xp: 10 /* derive xp later based on stats of monster, for now simplify it by giving it as an attribute. */
			}
		}
	}
	
	let placeCharacter = (character,x, y) => {
		//Place character
		defaultMap[y][x] = {
			...defaultMap[y][x],
			containsCharacter: true,
		}
	
	}
	
	let defaultMap = [MAP_DIMENSIONS_COLUMNS];
	
	for (let i = 0; i < MAP_DIMENSIONS_ROWS; i++) {
		defaultMap[i] = [];
		for (let j = 0; j < MAP_DIMENSIONS_COLUMNS; j++) {
			defaultMap[i].push({
				containsCharacter: false,
				containsMonster: false,
				containsWeapon: false,
				containsPotion: false,
				isWall: false
			});
		}
	}

	placeWeapons();
	placeWalls();
	placeMonsters();
	placePotions();

	//Faro, Jin
	let defaultCharacter = {
		name: 'Trey',
		weapon: undefined,
		level: 1,
		maxhp: 125,
		str: 15,
		hp: 125,
		xp: 0
	}
	
	let charX = 0;
	let charY = 0;
	placeCharacter(defaultCharacter, charX, charY);


	


	//xp to level should be constant and function defined elsewhere
	/*weapons an object with strength parameter?
	const weapons = {
		'dagger': 10,
		'club', 20,
		'sword': 40,
		'2h sword': 55
	}
	*/
	
	let initialState = { dungeon: {map: defaultMap, width: MAP_DIMENSIONS_COLUMNS, height: MAP_DIMENSIONS_ROWS, character: defaultCharacter, charLoc: {x: charX, y: charY}} };
	
	const store = createStore(reducer, initialState, compose(
		window.devToolsExtension ? window.devToolsExtension() : f => f
	));
	
	return store;
}