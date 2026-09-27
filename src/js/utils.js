const syncers = new WeakMap();
const formsWithResetListener = new WeakSet();

export function registerSync(control, sync) {
	syncers.set(control, sync);
	sync();

	const { form } = control;
	if (!form || formsWithResetListener.has(form)) return;

	formsWithResetListener.add(form);
	// Controls only change after the reset event has fired, so resync on the next tick.
	// Matters for CF7, which resets the form after a successful send.
	form.addEventListener('reset', () => {
		setTimeout(() => form.querySelectorAll('[data-cfe-enhanced]').forEach((el) => syncers.get(el)?.()));
	});
}
