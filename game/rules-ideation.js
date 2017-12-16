import clone from 'clone';

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


play a card
	choose a card -> a card
	(based on card) choose a mode ->
	(based on card and mode) choose a target ->
	make it so


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
		let evaluation = evaluate(statePostChoice);
		// this choice was better than any other so far!
		if (bestEvaluation == null || bestEvaluation < evaluation) {
			bestStates = [ statePostChoice ];
			bestEvaluation = evaluation;
		}
		// this choice was just as good at the other choices so far
		else if (bestEvaluation === evaluation) {
			bestStates.push(statePostChoice);
		}
		// otherwise it was worse than some of the other choices
	}
	// if there are ties for best resulting state, choose randomly
	if (bestStates && bestStates.length > 0) {
		return bestStates[Math.floor(Math.random() * bestStates.length)];
	}
	// if there were no valid choices... well, that's unexpected!
	else {
		throw new Error('No choice could be made!');
	}
}

function evaluateState(state) {
	return 0;
}

chooseBestChoice(chooseTurn, gameState, evaluateState);


