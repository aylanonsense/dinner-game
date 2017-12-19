import clone from 'clone';
import FOOD_ITEMS from './foodItems';

const STARTING_HAND_SIZE = 4;

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
	for (let [ type, foodItem ] of Object.entries(FOOD_ITEMS)) {
		let amount = CARD_AMOUNTS[type] || 0;
		for (let i = 0; i < amount; i++) {
			cards.push({
				id,
				type,
				...clone(foodItem)
			});
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

	// generate all the tiles
	let tiles = [];
	id = 0;
	for (let [ type, foodItem ] of Object.entries(FOOD_ITEMS)) {
		tiles.push({
			id,
			type,
			...clone(foodItem)
		});
		id++;
	}

	// shuffle tiles
	for (let i = 0; i < tiles.length; i++) {
		let j = i + Math.floor(Math.random() * (tiles.length - i));
		let temp = tiles[i];
		tiles[i] = tiles[j];
		tiles[j] = temp;
	}

	// deal the cards and the tiles
	let guests = [];
	for (let i = 0; i < numPlayers; i++) {
		guests[i] = {
			hand: cards.slice(STARTING_HAND_SIZE * i, STARTING_HAND_SIZE * (i + 1)),
			table: tiles.filter((tile, j) => { return j % numPlayers === i }),
			held: null,
			plate: [],
			tummy: []
		};
	}

	// return the state
	return {
		drawPile: cards.slice(STARTING_HAND_SIZE * numPlayers),
		discardPile: [],
		currGuest: 0,
		guests: guests
	};
}

export default generateState;