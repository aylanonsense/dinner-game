const CARD_TYPES = {
	casserole: {
		name: 'Green Bean Casserole'
	},
	carrots: {
		name: 'Carrots'
	}
};

const CARD_AMOUNTS = {
	casserole: 2,
	carrots: 2
};

// generate a deck of cards
let cards = [];
let id = 0;
for (const [ type, amt ] of Object.entries(CARD_AMOUNTS)) {
	for (let i = 0; i < amt; i++) {
		let card = clone(CARD_TYPES[type]);
		card.id = id;
		card.type = type;
		cards.push(card);
		id++;
	}
}

export default cards;