import './scss/main.scss';
import { enhanceChoice } from './js/choice.js';
import { enhanceSelect } from './js/select.js';
import { enhanceFile } from './js/file.js';

const ENHANCED = 'data-cfe-enhanced';

const defaults = {
	checkbox: true,
	radio: true,
	select: true,
	file: true,
	// Fluent Forms already wraps its file input in its own upload button.
	ignore: '.cfe-ignore, [data-cfe-ignore], .ff-screen-reader-element',
};

const enhancers = [
	['checkbox', 'input[type="checkbox"]', enhanceChoice],
	['radio', 'input[type="radio"]', enhanceChoice],
	['select', 'select:not([multiple])', enhanceSelect],
	['file', 'input[type="file"]', enhanceFile],
];

export function init(root = document, options = {}) {
	const settings = { ...defaults, ...options };

	enhancers.forEach(([key, selector, enhance]) => {
		if (!settings[key]) return;

		root.querySelectorAll(selector).forEach((el) => {
			if (el.hasAttribute(ENHANCED) || (settings.ignore && el.closest(settings.ignore))) return;
			el.setAttribute(ENHANCED, '');
			enhance(el);
		});
	});
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => init());
} else {
	init();
}
