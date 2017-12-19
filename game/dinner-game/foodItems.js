const FOOD_ITEMS = {
	casserole: {
		name: 'Green Bean Casserole',
		points: 4,
		isTopping: false,
		toppings: []
	},
	carrots: {
		name: 'Carrots',
		points: 2,
		isTopping: false,
		toppings: []
	},
	butter: {
		name: 'Butter',
		points: 2,
		isTopping: true,
		toppings: []
	},
	turkey: {
		name: 'Turkey',
		points: 7,
		isTopping: false,
		toppings: [ [ 'cranberry', 'gravy' ] ]
	},
	ham: {
		name: 'Ham',
		points: 7,
		isTopping: false,
		toppings: []
	},
	cranberry: {
		name: 'Cranberry Sauce',
		points: 3,
		isTopping: false,
		toppings: []
	},
	potatoes: {
		name: 'Mashed Potatoes',
		points: 4,
		isTopping: false,
		toppings: [ [ 'butter', 'gravy' ], [ 'salt' ] ]
	},
	salt: {
		name: 'Salt',
		points: 1,
		isTopping: true,
		toppings: []
	},
	buns: {
		name: 'Buns',
		points: 3,
		isTopping: false,
		toppings: [ [ 'butter' ] ]
	},
	salad: {
		name: 'Salad',
		points: 2,
		isTopping: false,
		toppings: [ [ 'dressing' ] ]
	},
	sprouts: {
		name: 'Brussels Sprouts',
		points: 4,
		isTopping: false,
		toppings: [ [ 'butter' ], [ 'butter' ], [ 'salt' ] ]
	},
	gravy: {
		name: 'Gravy',
		points: 3,
		isTopping: true,
		toppings: []
	},
	dressing: {
		name: 'Dressing',
		points: 3,
		isTopping: true,
		toppings: []
	}
};

export default FOOD_ITEMS;