const faq_item = document.querySelectorAll('.item-faq');
const toggleHeightBlock = (block) => {
	if (block.style.height === '0px') {
		block.style.height = `${block.scrollHeight}px`;
	} else {
		block.style.height = `${block.scrollHeight}px`;
		window.getComputedStyle(block, null).getPropertyValue('height');
		block.style.height = '0';
	}
	block.addEventListener(
		'transitionend',
		() => {
			if (block.style.height !== '0px') {
				block.style.height = 'auto';
			}
		},
		{ once: true }
	);
};

faq_item.forEach((el) => {
	const answer_block = el.querySelector('.item-faq__answer');
	toggleHeightBlock(answer_block);

	el.querySelector('.item-faq__header').addEventListener('click', () => {
		el.classList.toggle('_active');
		toggleHeightBlock(answer_block);
	});
});

const telInput = document.querySelector('.tel-input');
telInput &&
	telInput.addEventListener('input', (e) => {
		e.target.value = e.target.value.replace(/[^0-9.]/g, '');
	});

const burger = document.querySelector('.burger');
burger.onclick = () => {
	burger.classList.toggle('_active');
};

let init = false;
let swiper;
function swiperCard() {
	if (window.innerWidth <= 700) {
		if (init) return;

		document.querySelector('.fields__swiper').classList.add('.swiper');
		document.querySelector('.fields__list').classList.add('.swiper-wrapper');
		document
			.querySelectorAll('.fields__item')
			.forEach((el) => el.classList.add('.swiper-slide'));
		init = true;
		swiper = new Swiper('.swiper', {
			spaceBetween: 10,
			allowTouchMove: true,
			pagination: {
				el: '.swiper-pagination',
				bulletClass: 'swiper-bullet',
				bulletActiveClass: '_active',
				clickable: true,
			},
		});
	} else if (init) {
		swiper.destroy();
		init = false;
		document.querySelector('.fields__swiper').classList.remove('.swiper');
		document.querySelector('.fields__list').classList.remove('.swiper-wrapper');
		document
			.querySelectorAll('.fields__item')
			.forEach((el) => el.classList.remove('.swiper-slide'));
	}
}
swiperCard();
window.addEventListener('resize', swiperCard);
