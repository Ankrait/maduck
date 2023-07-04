// *
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

// *
// * phone number input
const telInput = document.querySelector('.tel-input');
telInput &&
	telInput.addEventListener('input', (e) => {
		e.target.value = e.target.value.replace(/[^0-9.]/g, '');
	});

// *
// * burger
const burger = document.querySelector('.burger');
const burger_close = document.querySelector('.header__close');
burger.onclick = () => {
	document.body.classList.add('menu_active');
};
burger_close.onclick = () => {
	document.body.classList.remove('menu_active');
};

// *
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

// *
// * textarea auto height
const textarea_input = document.querySelector('.form-contact textarea');
const textareaAutoHeight = () => {
	textarea_input.style.height = 0;
	textarea_input.style.height = textarea_input.scrollHeight + 2 + 'px';
};

textarea_input.addEventListener('input', textareaAutoHeight);
window.addEventListener('DOMContentLoaded', textareaAutoHeight);
window.addEventListener('resize', textareaAutoHeight);

// *
// * site header
const scroll_view = document.querySelector('.scroll');
const site_header = document.querySelector('.site-header');

scroll_view.addEventListener('scroll', (e) => {
	if (scroll_view.scrollTop > 120) {
		if (!site_header.classList.contains('_fixed')) {
			site_header.classList.add('_fixed');
			document.querySelector('.site-header-wrapper').appendChild(site_header);
		}
	} else {
		site_header.classList.remove('_fixed');
		document.querySelector('.general__head').appendChild(site_header);
	}
});

// *
// * scroll to block
const scrollTo = (to_element, link_element) => {
	link_element.addEventListener('click', () => {
		document.body.classList.remove('menu_active');
		setTimeout(
			() => {
				document
					.querySelector('.scroll')
					.scrollTo({ behavior: 'smooth', top: to_element.offsetTop - 140 });
			},
			link_element.dataset?.nodelay === 'true' ? 0 : 500
		);
	});
};

const scroll_links = document.querySelectorAll('[data-scroll]');
scroll_links.forEach((link) => {
	const block = document.querySelector(`.${link.dataset.scroll}`);
	scrollTo(block, link);
});

// *
// * отправление запроса к php
const form = document.querySelector('.form-contact');
const file_input = document.getElementById('input-file');
form.addEventListener('submit', (e) => {
	e.preventDefault();
	const data = new FormData(form);

	if (!form.Name.value) {
		alert('Введите имя');
		return;
	}
	if (!form.Phone.value) {
		alert('Введите телефон');
		return;
	}

	fetch('send-message-to-telegram.php', {
		method: 'POST',
		body: data,
	}).then((response) => {
		console.log(response);
		if (response.ok) {
			alert('success');
		} else {
			alert('error');
		}
	});
});
file_input.addEventListener('change', (e) => {
	if (file_input.files.length > 2) {
		alert('Не больше двух файлов');
		file_input.value = '';
	}
	console.log(file_input?.files);
});
