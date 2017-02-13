export const dungeonMapReducer = (state = {}, action) => {

	let characterMove = (state, direction) => {
		let dungeonMap = state.map;
		let mapWidth = state.width;
		let mapHeight = state.height;
		let charX = state.charLoc.x;
		let charY = state.charLoc.y;
		let character = state.character;

		let newDungeonMap = undefined;
		let newCharLoc = state.charLoc; // Keep the same unless character actually moves.

		// If character is going on a tile with a weapon, remove it from the map (it will get added to character in another reducer.)
		let checkForWeapon = (cell, x, y) => {
			if (dungeonMap[y][x].containsWeapon) {					
				cell = {
					...cell,
					containsWeapon: false,
					weapon: null
				}
				character = {
					...character,
					weapon: dungeonMap[y][x].weapon	
				}
			}	
			return cell;
		}
		
		
		// For early stages, well say potion heals 50 of your XP
		let checkForPotion = (cell, x, y) => {
			if (dungeonMap[y][x].containsPotion) {
				cell = {
					...cell,
					containsPotion: false
				}
				character = {
					...character,
					hp: (character.hp + 5 > character.maxhp ? character.maxhp : character.hp + 5)
				}
			}
			return cell;	
		}
		
		let fightMonster = (cell) => {
			
			let charStrength = character.str;
			let monster = cell.monster;
			if (character.weapon) { charStrength += character.weapon.attack; }					
			let monsterHP = monster.hp - charStrength;
			let charHP = character.hp - monster.strength;
			
			if (charHP <= 0) {
				console.log("GAME OVER! Character is dead!");
				//make exit status later
			}
			character = {					
				...character,
				hp: charHP	
			}
			
			if (monsterHP <= 0) {
				
				// need to decide leveling up later
				character = {
					...character,
					xp: character.xp + monster.xp
				}
				
				return {
					...cell,
					containsMonster: false,
					monster: null
				}	
			}			
			
			return {
				...cell,
				monster: {
					...monster,
					hp: monsterHP
				}
			}
		}

		let rescanMap = (prev, next) => {
			
			return dungeonMap.map((row, rIndex) => {					
				return row.map((col, cIndex) => {	
						
					// Looking ahead, to see if there's a monster.
					// This is called first because if a monster is encountered, faught and dies. The character will move to his spot.
					if (cIndex === next.x && rIndex === next.y) {
						if (dungeonMap[next.y][next.x].containsMonster) { 	
							return fightMonster(dungeonMap[next.y][next.x]);
						}
					}	

					if (cIndex === prev.x && rIndex === prev.y) {
						if (dungeonMap[next.y][next.x].containsMonster) { return col; } 
						return {
							...dungeonMap[rIndex][cIndex],
							containsCharacter: false,
						}
					} else if (cIndex === next.x && rIndex === next.y) {
						if (dungeonMap[next.y][next.x].containsMonster) { return col; } 
						let cell = {
							...dungeonMap[rIndex][cIndex],
							containsCharacter: true,
						}
						cell = checkForWeapon(cell, cIndex, rIndex);
						cell = checkForPotion(cell, cIndex, rIndex);
						newCharLoc = {x: cIndex, y: rIndex};	
						
						return cell;
					}
					return col;
				});
			});
		}

		switch(direction) {
			case 'LEFT':

				if (charX-1 >= 0 && !dungeonMap[charY][charX-1].isWall) {
					newDungeonMap = rescanMap({x: charX, y: charY}, {x: charX-1, y: charY});
					return {
						...state,
						map: newDungeonMap,
						character,
						charLoc: newCharLoc
					}
				}
				break;

			case 'RIGHT':
				if (charX+1 < mapWidth && !dungeonMap[charY][charX+1].isWall) {
					newDungeonMap = rescanMap({x: charX, y: charY}, {x: charX+1, y: charY});
					return {
						...state,
						map: newDungeonMap,
						character,
						charLoc: newCharLoc
					}
				}
				break;

			case 'UP':
				if (charY-1 >= 0 && !dungeonMap[charY-1][charX].isWall) {
					newDungeonMap = rescanMap({x: charX, y: charY}, {x: charX, y: charY-1});
					return {
						...state,
						map: newDungeonMap,
						character,
						charLoc: newCharLoc
					}
				}
				break;

			case 'DOWN':
				if (charY+1 < mapHeight && !dungeonMap[charY+1][charX].isWall) {
					newDungeonMap = rescanMap({x: charX, y: charY}, {x: charX, y: charY+1});
					return {
						...state,
						map: newDungeonMap,
						character,
						charLoc: newCharLoc
					}
				}
		}

		return state;
	}


	switch (action.type) {
		case 'CHARACTER_MOVE': 
			return characterMove(state, action.direction);
		default:
			return state;
	}
}
