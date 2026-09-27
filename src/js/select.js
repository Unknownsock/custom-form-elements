import { registerSync } from './utils.js';

const ARROW = '<svg viewBox="0 0 19 11" fill="none" aria-hidden="true"><path d="M17.5 1.5 9.5 9.5l-8-8" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';

let documentListenersBound = false;

function closeAll(except) {
	document.querySelectorAll('.cfe-select.is-open').forEach((el) => {
		if (el !== except) el.classList.remove('is-open');
	});
}

function bindDocumentListeners() {
	if (documentListenersBound) return;
	documentListenersBound = true;

	document.addEventListener('click', (event) => closeAll(event.target.closest?.('.cfe-select')));
	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape') closeAll();
	});
}

function buildOption(option, select) {
	const item = document.createElement('li');
	item.className = 'cfe-select__option';
	item.textContent = option.textContent;

	if (option.dataset.image) {
		const image = document.createElement('img');
		image.src = option.dataset.image;
		image.alt = '';
		item.append(image);
	}

	const disabled = option.disabled || option.closest('optgroup')?.disabled;
	if (disabled) item.classList.add('is-disabled');

	item.addEventListener('click', (event) => {
		if (disabled) {
			event.stopPropagation();
			return;
		}
		option.selected = true;
		select.dispatchEvent(new Event('input', { bubbles: true }));
		select.dispatchEvent(new Event('change', { bubbles: true }));
	});

	return item;
}

function buildGroup(optgroup) {
	const item = document.createElement('li');
	item.className = 'cfe-select__group';
	item.textContent = optgroup.label;
	item.addEventListener('click', (event) => event.stopPropagation());
	return item;
}

export function enhanceSelect(select) {
	bindDocumentListeners();
	select.classList.add('cfe-select__native');

	const wrapper = document.createElement('div');
	wrapper.className = 'cfe-select';
	// Keyboard and screen reader users keep using the (visually hidden) native <select>.
	wrapper.setAttribute('aria-hidden', 'true');
	wrapper.innerHTML = `<div class="cfe-select__value"></div><span class="cfe-select__arrow">${ARROW}</span><ul class="cfe-select__list"></ul>`;

	const value = wrapper.querySelector('.cfe-select__value');
	const list = wrapper.querySelector('.cfe-select__list');
	const items = [];

	select.querySelectorAll('optgroup, option').forEach((node) => {
		if (node.tagName === 'OPTGROUP') {
			list.append(buildGroup(node));
			return;
		}
		const item = buildOption(node, select);
		items.push([node, item]);
		list.append(item);
	});

	select.after(wrapper);

	wrapper.addEventListener('click', () => {
		if (select.disabled) return;
		const opening = !wrapper.classList.contains('is-open');
		closeAll();
		wrapper.classList.toggle('is-open', opening);
	});

	const sync = () => {
		const selected = select.selectedOptions[0];
		value.textContent = selected ? selected.textContent : '';
		wrapper.classList.toggle('has-value', Boolean(selected?.value));
		wrapper.classList.toggle('is-disabled', select.disabled);
		items.forEach(([option, item]) => item.classList.toggle('is-selected', option.selected));
	};

	select.addEventListener('change', sync);
	registerSync(select, sync);
}
