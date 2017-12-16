import clone from 'clone';

class GameSimulation {
	constructor() {
		this.players = [];
		this.state = null;
		this.isValid = true;
	}
	excute() {
		executeRound()
	}
	executeRound() {
		for (let player of this.players) {
			this.takeTurn(player);
		}
	}
	takeTurn(activePlayer) {
		let choice = activePlayer.choose([ 'increase', 'decrease' ]);
	}
}

let sim = new GameSimulation();
sim.state = {};
sim.players = [];
sim.isValid = true;
sim.execute();
let finalState = sim.state;
let isValid = sim.isValid;

class GameRules {
	constructor() {
	}
	execute(state, choose) {
		let turn = this.chooseTurn(choose);
		if (turn === 'play') {

		}
		else if (turn === 'draw') {
			let cards = this.imagineThreeCards(choose);
		}
		else if (turn === 'discard') {

		}
		else {
			throw new Error('No valid turn!');
		}
	}
	chooseTurn(choose) {
		return choose([ 'play', 'draw', 'discard' ]);
	}
	imagineThreeCards(choose)  {
		return choose([ 'carrots', 'buns', 'buns' ], true); // is uncertain
	}
	promptChoice(choice) {
	}
}

let gameRules = new GameRules();
let choiceHistory = [];
let choiceIndex = 0;
let moreChoices = 0;
gameRules.execute({}, possibilities => {
	// we've never gotten this far before, just pick the top choice
	if (typeof(choiceHistory[choiceIndex]) === 'undefined') {
		choiceHistory[choiceIndex] = 0;
	}
	if (possibilities.length > choiceHistory[choiceIndex] + 1) {
		moreChoices = choiceIndex;
	}
	choiceIndex += 1;
});

/*
so we want to:
	choose the first option on everything
	keep track of the LAST decision with more than one option
	then on the second run, choose the first option on everything except
		for THAT LAST decision, choose the second
		and after that, choose the first option for everything
		and keep track of where the last legic decision BEFORE that decision is
		if we get to the last decision on that track, move the last legit decision back to the current run's one
we don't really need to record non-decisions (0 or 1 possibility) anyway, right?
	so we can just move the point every time

how do we keep track of
	- uncertainty events
	- when a different evaluator should be used
	- okay we work backwards
	so for a single execution
		- for the last decision, whichever evaluator chooses that
		- then we step backwards
		- so choose needs to know which evaluator to use at each step

execute should return the state at the end of it?
choose should take in an evaluator each time
gamerules should take
	a state, but should this be passed into the function or constructed with it?
		probably constructed with it, maybe via setState
		and then it has a getState and that's how we extract and evaluate


simulation needs to keep track of whether or not it's reality, e.g. with imagining cards
	also how do we do proportional probability?
	for uncertain events, each choice comes paired with a weight of how likely it is
	that weight is used for evaluation purposes, taking the "weighted average"
		except we might want a robot that does something better than weighted average

ooh ooh, i like that this can span any number of turns

execute does need to have the chooser passed into it

gamerule should take the evaluators as players like via setState
*/


class DecisionPoint {
	constructor() {
		this.isDecisionPoint = true;
	}
	getPossibleChoices(state) {
		return [];
	}
	applyChoice(choice, state) {
		return state;
	}
}

class BasicDecisionPoint extends DecisionPoint {
	constructor(possibilities) {
		super()
		this.possibilities = possibilities;
	}
	getPossibleChoices(state) {
		return this.possibilities;
	}
}

let gameState = {};

let choosePlay = new BasicDecisionPoint([
	'yes',
	'no'
]);

let chooseTurn = new BasicDecisionPoint([
	choosePlay,
	'draw',
	'discard'
]);



/*


so wait, do we need an id

let's say the choices 

GameState {
	takeTurn()
}

var card = this.promptChoice(this.chooseCard(), 'choose-card-2');

each choice needs a unique id

function() {
	let card = chooseCard()
	let mode = null;
	if (card && card.isFoodItem) {
		mode = chooseMode(card);
	}
	let target = null;
	if (mode === 'pass') {
		target = chooseTarget(card, mode);
	}
	playCard(card, mode, target);
}

chooseCard
	getPossibleChoices(state)

chooseMode
	getPossibleChoices(state, card)

chooseTarget
	getPossibleChoices(state, card, mode)

play a card
	choose a card -> a card
	(based on card) choose a mode ->
	(based on card and mode) choose a target ->
	make it so

	so i feel like when choosing a card, you don't know if all the things down the line will be valid
		so we really should allow for there to be 0 possibilities, and handle that


create sequence
	decision
	decision
	decision

	which do not depend on one another

choose:
	play cards (only if at least 1 card)
		choose a card
		choose how to play it (serve / pass)
			pass: choose which player to play it on
		~NOW SOMETHING HAPPENS~
		choose another card (only if at least 1 card) or no more cards
	draw 3 + discard 1
		imagine possible draws
		choose card to discard
		~NOW SOMETHING HAPPENS~
	discard hand + draw 5
		imagine possible hands
		~NOW SOMETHING HAPPENS~
*/


function chooseBestChoice(decisionPoint, state, evaluate) {
	let bestStates = null;
	let bestEvaluation = null;
	for (let choice of decisionPoint.getPossibleChoices(state)) {
		let statePostChoice;
		// if the choice lead to another decision point, well... do that!
		if (choice && choice.isDecisionPoint) {
			statePostChoice = chooseBestChoice(choice, clone(state), evaluate);
		}
		// otherwise apply the choice
		else {
			statePostChoice = decisionPoint.applyChoice(choice, clone(state));
		}
		// it's possible there were no valid choices
		if (statePostChoice) {
			let evaluation = evaluate(statePostChoice);
			// this choice was better than any other so far!
			if (bestEvaluation === null || bestEvaluation < evaluation) {
				bestStates = [ statePostChoice ];
				bestEvaluation = evaluation;
			}
			// this choice was just as good at the other choices so far
			else if (bestEvaluation === evaluation) {
				bestStates.push(statePostChoice);
			}
			// otherwise it was worse than some of the other choices
		}
	}
	// if there are ties for best resulting state, choose randomly
	if (bestStates && bestStates.length > 0) {
		return bestStates[Math.floor(Math.random() * bestStates.length)];
	}
	// if there were no valid choices then this was not a valid path forward
	else {
		return null;
	}
}

function evaluateState(state) {
	return 0;
}

chooseBestChoice(chooseTurn, gameState, evaluateState);


