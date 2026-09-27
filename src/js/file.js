import { registerSync } from './utils.js';

function fileLabel(input, placeholder) {
	const count = input.files?.length ?? 0;
	if (count === 0) return placeholder;
	if (count === 1) return input.files[0].name;
	return `${count} files selected`;
}

export function enhanceFile(input) {
	const placeholder = input.dataset.placeholder || 'No file chosen';

	const wrapper = document.createElement('div');
	wrapper.className = 'cfe-file';

	const button = document.createElement('span');
	button.className = 'cfe-file__button';
	button.setAttribute('aria-hidden', 'true');
	button.textContent = input.dataset.buttonText || (input.multiple ? 'Upload files' : 'Upload file');

	const name = document.createElement('span');
	name.className = 'cfe-file__name';
	name.setAttribute('aria-hidden', 'true');

	input.classList.add('cfe-file__input');
	input.before(wrapper);
	wrapper.append(input, button, name);

	const sync = () => {
		name.textContent = fileLabel(input, placeholder);
		wrapper.classList.toggle('has-file', input.files?.length > 0);
		wrapper.classList.toggle('is-disabled', input.disabled);
	};

	input.addEventListener('change', sync);
	registerSync(input, sync);
}
