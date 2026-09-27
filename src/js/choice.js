const CONTROLS = 'input:not([type="hidden"]), select, textarea, button';

function ownLabel(input) {
	const wrapping = input.closest('label');
	// An outer <label> around a whole group of inputs (a common CF7 template mistake) isn't this input's label.
	if (wrapping && wrapping.querySelectorAll(CONTROLS).length === 1) return wrapping;

	// Gravity Forms / WPForms: <input id="x"><label for="x">. Must be adjacent so the CSS `+` state selectors work.
	const next = input.nextElementSibling;
	if (input.id && next?.matches(`label[for="${CSS.escape(input.id)}"]`)) return next;

	return null;
}

function endsLabel(node) {
	return node.nodeType === Node.ELEMENT_NODE
		&& (node.matches('br, label') || node.matches(CONTROLS) || node.querySelector(CONTROLS));
}

function wrapInLabel(input) {
	const label = document.createElement('label');
	const parent = input.parentElement;

	// CF7 without use_label_element: <span class="wpcf7-list-item"><input><span class="wpcf7-list-item-label">…
	// (label_first swaps the order), so take the whole list item.
	if (parent.matches('.wpcf7-list-item')) {
		label.append(...parent.childNodes);
		parent.append(label);
		return label;
	}

	// Plain markup: pull the text that follows the input into the label so it stays clickable.
	input.before(label);
	let node = input;
	do {
		const next = node.nextSibling;
		label.append(node);
		node = next;
	} while (node && !endsLabel(node));

	return label;
}

export function enhanceChoice(input) {
	const label = ownLabel(input) || wrapInLabel(input);
	label.classList.add('cfe-choice', `cfe-choice--${input.type}`);
	input.classList.add('cfe-choice__input');

	const indicator = document.createElement('span');
	indicator.className = 'cfe-choice__indicator';
	indicator.setAttribute('aria-hidden', 'true');
	label.prepend(indicator);
}
