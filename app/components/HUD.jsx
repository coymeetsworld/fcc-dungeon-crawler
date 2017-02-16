import React from 'react';
import {connect} from 'react-redux';


export class HUD extends React.Component {

	render() {
		
		let printWeapon = () => {
			if (!character.weapon) {
				return <span className="character-attribute">Weapon: none</span>	
			}
			
			return (
				<span className="character-attribute">
					Weapon: {character.weapon.name} (<span className="weapon-atk">+{character.weapon.attack} atk</span>)
				</span>		
			)
		}
		
		let character = this.props.dungeon.character;

		if (this.props.dungeon.endCondition === 'WIN') {
			return (
				<div className="win-banner">						
					YOU WIN!!!!				
				</div>
			)	
		} else if (this.props.dungeon.endCondition === 'LOSE') {
			return (
				<div className="lose-banner">
					YOU LOSE!!!!	
				</div>
			)
		} 
		else {
			return(
				<div className="character-attributes">
					<span className="character-attribute">Name: {character.name}</span>
					<span className="character-attribute">Level: {character.level}</span>
					<span className="character-attribute">HP: {character.hp}/{character.maxhp}</span>
					{printWeapon()}
					<span className="character-attribute">XP: {character.xp}</span>
					<span className="character-attribute">To next level: TBD</span>
					<span className="character-attribute">Dungeon Level: {this.props.dungeon.level}</span>
				</div>
			)
		}
	}
}

const mapStateToProps = (state) => {
	return state;
}


export default connect(mapStateToProps)(HUD);