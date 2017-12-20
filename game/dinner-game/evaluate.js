function evaluate(state) {
	let { hand, table, held, plate, tummy } = state.guests[this.index];
	// maximize in this order
	//   1. cards on plate
	//   2. cards in hand
	//   3. tiles on table / held
	return 100 * plate.length + 10 * hand.length + (table.length + (held ? 1 : 0));
}

export default evaluate;