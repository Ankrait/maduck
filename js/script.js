// * faq block
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

// * phone number input
const telInput = document.querySelector('.tel-input');
telInput &&
	telInput.addEventListener('input', (e) => {
		e.target.value = e.target.value.replace(/[^0-9.]/g, '');
	});

// * burger icon
const burger = document.querySelector('.burger');
burger.onclick = () => {
	document.body.classList.toggle('menu_active');
};

// * swiper
let init = false;
let swiper;
function swiperCard() {
	if (window.innerWidth <= 700) {
		if (init) return;

		document.querySelector('.fields__swiper').classList.add('swiper');
		document.querySelector('.fields__list').classList.add('swiper-wrapper');
		document
			.querySelectorAll('.fields__item')
			.forEach((el) => el.classList.add('swiper-slide'));
		init = true;
		swiper = new Swiper('.swiper', {
			spaceBetween: 10,
			allowTouchMove: true,
			pagination: {
				el: '.swiper-pagination',
				// bulletClass: 'swiper-bullet',
				// bulletActiveClass: '_active',
				clickable: true,
				dynamicBullets: true,
				dynamicMainBullets: 1,
			},
		});
	} else if (init) {
		swiper.destroy();
		init = false;
		document.querySelector('.fields__swiper').classList.remove('swiper');
		document.querySelector('.fields__list').classList.remove('swiper-wrapper');
		document
			.querySelectorAll('.fields__item')
			.forEach((el) => el.classList.remove('swiper-slide'));
	}
}
window.addEventListener('DOMContentLoaded', swiperCard);
window.addEventListener('resize', swiperCard);

// * textarea auto height
const textarea_input = document.querySelector('.form-contact textarea');
const textareaAutoHeight = () => {
	textarea_input.style.height = 0;
	textarea_input.style.height = textarea_input.scrollHeight + 'px';
};

textarea_input.addEventListener('input', textareaAutoHeight);
window.addEventListener('DOMContentLoaded', textareaAutoHeight);
window.addEventListener('resize', textareaAutoHeight);
