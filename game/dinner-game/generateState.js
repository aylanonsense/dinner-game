const CARD_TYPES = [
	{ type: 'casserole',	name: 'Green Bean Casserole',	points: 4,	isTopping: false,	toppings: [] },
	{ type: 'carrots',		name: 'Carrots',				points: 2,	isTopping: false,	toppings: [] },
	{ type: 'butter',		name: 'Butter',					points: 2,	isTopping: true,	toppings: [] },
	{ type: 'turkey',		name: 'Turkey',					points: 7,	isTopping: false,	toppings: [ [ 'cranberry', 'gravy' ] ] },
	{ type: 'ham',			name: 'Ham',					points: 7,	isTopping: false,	toppings: [] },
	{ type: 'cranberry',	name: 'Cranberry Sauce'			points: 3,	isTopping: false,	toppings: [] },
	{ type: 'potatoes',		name: 'Mashed Potatoes'			points: 4,	isTopping: false,	toppings: [ [ 'butter', 'gravy' ], [ 'salt' ] ] },
	{ type: 'salt',			name: 'Salt',					points: 1,	isTopping: true,	toppings: [] },
	{ type: 'buns',			name: 'Buns',					points: 3,	isTopping: false,	toppings: [ [ 'butter' ] ] },
	{ type: 'salad',		name: 'Salad',					points: 2,	isTopping: false,	toppings: [ [ 'dressing' ] ] },
	{ type: 'sprouts',		name: 'Brussels Sprouts',		points: 4,	isTopping: false,	toppings: [ [ 'butter' ], [ 'butter' ], [ 'salt' ] ] },
	{ type: 'gravy',		name: 'Gravy',					points: 3,	isTopping: true,	toppings: [] },
	{ type: 'dressing',		name: 'Dressing',				points: 3,	isTopping: true,	toppings: [] }
];

const CARD_AMOUNTS = {
	casserole: 5,
	carrots: 5,
	butter: 5,
	turkey: 5,
	ham: 5,
	cranberry: 5,
	potatoes: 5,
	salt: 5,
	buns: 5,
	salad: 5,
	sprouts: 5,
	gravy: 5,
	dressing: 5
};

function generateState(numPlayers) {
	// generate a deck of cards
	let cards = [];
	let id = 0;
	for (let cardBlueprint of CARD_TYPES) {
		let amount = CARD_AMOUNTS[cardBlueprint.type];
		for (let i = 0; i < amount; i++) {
			let card = clone(cardBlueprint);
			card.id = id;
			cards.push(card);
			id++;
		}
	}

	// shuffle cards
	for (let i = 0; i < cards.length; i++) {
		let j = i + Math.floor(Math.random() * (cards.length - i));
		let temp = cards[i];
		cards[i] = cards[j];
		cards[j] = temp;
	}

	// maybe the game state should be a bunch of classes, with a getState that turns it to json and a setState vice versa
}

export default generateState;