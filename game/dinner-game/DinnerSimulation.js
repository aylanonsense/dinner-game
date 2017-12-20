import GameSimulation from '../GameSimulation';

class DinnerSimulation extends GameSimulation {
	getNumExpectedPlayers() {
		return this.state.guests.length;
	}
	run() {
		this.playTurn();
		this.setUpNextTurn();
	}
	playTurn() {
		// figure out whose turn it is
		let player = this.players[this.state.currGuest];
		let guest = this.state.guests[this.state.currGuest];

		// that player gets to choose how they'd like to spend their turn
		let turn = player.choose([ 'draw cards', 'play cards' ]);
		if (turn === 'draw cards') {
			// draw three cards from the top of the draw pile
			guest.hand = [ ...guest.hand, ...this.state.drawPile.splice(0, this.state.drawAmount) ];
		}
		else if (turn === 'play cards') {
			// the player chooses a card to play
			let cardIndex = this.chooseCardToPlay(guest);
			while (cardIndex !== 'none') {
				// remove that card from the player's hand
				let card = guest.hand.splice(cardIndex, 1)[0];
				// then play the card
				this.playCard(guest, card);
				// then the player can choose another card to play
				cardIndex = this.chooseCardToPlay(guest);
			}
		}
	}
	setUpNextTurn() {
		this.state.currGuest = (this.state.currGuest + 1) % this.state.guests.length;
	}
	chooseCardToPlay(guest) {
		let player = this.players[guest.index];
		return player.choose([ 'none', ...guest.hand.map((card, i) => i).filter(i => this.canPlayCard(guest, guest.hand[i])) ]);
	}
	canPlayCard(guest, card) {
		return this.canPlayCardToPass(guest, card) || this.canPlayCardToServe(guest, card);
	}
	canPlayCardToPass(guest, card) {
		let guestWithTile = this.getGuestWithTile(card.type);
		return guestWithTile.index !== guest.index;
	}
	canPlayCardToServe(guest, card) {
		let guestWithTile = this.getGuestWithTile(card.type);
		return guestWithTile.index === guest.index;
	}
	playCard(guest, card) {
		let guestWithTile = this.getGuestWithTile(card.type);
		if (guestWithTile.index !== guest.index) {
			this.state.discardPile.push(card);
			return this.passTile(guestWithTile, card.type, this.getGuestClockwise(guestWithTile));
		}
		else {
			return this.serve(guest, card);
		}
	}
	getGuestClockwise(guest) {
		return this.state.guests[(guest.index + 1) % this.state.guests.length];
	}
	getGuestWithTile(type) {
		return this.state.guests.filter(guest => this.hasTile(guest, type))[0];
	}
	hasTile(guest, type) {
		return (guest.held && guest.held.type === type) || guest.table.filter(tile => tile.type === type).length > 0;
	}
	putDownHeldTile(guest) {
		if (guest.held) {
			// put down the held tile
			if (guest.table.length < this.state.maxTableTiles) {
				guest.table.push(guest.held);
				guest.held = null;
				return true;
			}
			// there isn't enough space to put down the held tile
			else {
				return false;
			}
		}
		// the guest wasn't holding anything anyways
		else {
			return true;
		}
	}
	pickUpTile(guest, type) {
		if (guest.held) {
			// the guest was already holding the tile!
			if (guest.held.type === type) {
				return true;
			}
			// the guest couldn't put down the held tile
			else if(!this.putDownHeldTile(guest)) {
				return false;
			}
		}
		let tileIndex = guest.table.map((tile, i) => i).filter(i => guest.table[i].type === type)[0];
		// hold the item
		if (typeof(tileIndex) === 'number') {
			guest.held = guest.table[tileIndex];
			guest.table.splice(tileIndex, 1);
			return true;
		}
		// couldn't find the tile
		else {
			return false;
		}
	}
	swapHeldTiles(guest1, guest2) {
		let temp = guest1.held;
		guest1.held = guest2.held;
		guest2.held = temp;
	}
	passTile(guest1, type, guest2) {
		if (this.pickUpTile(guest1, type)) {
			this.swapHeldTiles(guest1, guest2);
			return true;
		}
		else {
			return false;
		}
	}
	serve(guest, card) {
		guest.plate.push(card);
		return true;
	}
}

export default DinnerSimulation;