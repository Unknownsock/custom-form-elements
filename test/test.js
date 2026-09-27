function output(form) {
	return form.closest('section').querySelector('.test-output');
}

// Shows what the form would actually submit, to prove the custom UI writes back to the real inputs.
function logValues(form) {
	const hidden = new Set([...form.querySelectorAll('input[type="hidden"]')].map((input) => input.name));
	const lines = [];

	for (const [name, value] of new FormData(form)) {
		if (hidden.has(name)) continue;
		lines.push(`${name} = ${value instanceof File ? value.name || '(no file)' : value}`);
	}

	output(form).textContent = lines.join('\n') || '(nothing to submit)';
}

document.addEventListener('submit', (event) => {
	event.preventDefault();
	logValues(event.target);
});

document.addEventListener('click', (event) => {
	const button = event.target.closest('[data-test-action]');
	if (!button) return;

	const form = button.closest('section')?.querySelector('form');

	switch (button.dataset.testAction) {
		case 'log':
			logValues(form);
			break;
		case 'reset':
			// Same thing CF7 does after a successful send.
			form.reset();
			output(form).textContent = '';
			break;
		case 'reinit':
			// Should be a no-op: nothing gets enhanced twice.
			window.CustomFormElements.init();
			break;
	}
});
