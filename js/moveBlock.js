const moveBlock = (block, to, pos_i, max_width) => {
	if (!block || !to) return;

	const parent = block.parentNode;
	let init_pos_i = 0;

	Array.from(parent.children).forEach((el, i) => {
		if (el === block) {
			init_pos_i = i;
		}
	});

	const moving = () => {
		if (window.innerWidth <= max_width) {
			to.insertBefore(block, to.children[pos_i]);
		} else {
			parent.insertBefore(block, parent.children[init_pos_i]);
		}
	};

	window.addEventListener('DOMContentLoaded', moving);
	window.addEventListener('resize', moving);
};

const dataMoveBlock = document.querySelectorAll('[data-move]');
dataMoveBlock.forEach((el) => {
	const data = el.dataset.move.split(',').map(el => el.trim());

	if (data.length === 3) {
		const to = document.querySelector(data[0]);
		moveBlock(el, to, +data[1], +data[2]);
	}
});
