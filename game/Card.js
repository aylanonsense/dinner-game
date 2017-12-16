class Card {
	constructor(id) {
		this.id = id;
	}
	isSameCard(card) {
		return this.id === card.id;
	}
	isFunctionallyIdentical(card) {
		return false;
	}
}