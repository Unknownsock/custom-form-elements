# Custom Form Elements

Custom-styled checkboxes, radios, selects and file inputs, themed with SCSS or CSS custom properties. It works with plain HTML and with the markup that popular WordPress form plugins output:

- Contact Form 7 (default, `use_label_element`, `label_first`, acceptance)
- Gravity Forms
- WPForms (classic dropdown and uploader)
- Fluent Forms

The native inputs stay in the DOM and remain the source of truth. Values submit normally, the keyboard and screen readers use the real controls, and form resets (including CF7's reset after a successful send) are reflected in the UI.

## Usage

Include the built files:

```html
<link rel="stylesheet" href="dist/custom-form-elements.min.css">
<script src="dist/custom-form-elements.min.js"></script>
```

Every checkbox, radio, single select and file input on the page is enhanced on `DOMContentLoaded`. For forms added later (AJAX, popups, FacetWP, Ninja Forms), call `init` again. Calling it more than once is safe, because already-enhanced elements are skipped:

```js
CustomFormElements.init();              // whole document
CustomFormElements.init(someContainer);  // just part of the page
CustomFormElements.init(document, { file: false, ignore: '.my-widget select' });
```

| Option     | Default | |
|------------|---------|---|
| `checkbox` | `true`  | Enhance checkboxes |
| `radio`    | `true`  | Enhance radios |
| `select`   | `true`  | Enhance single selects (`multiple` selects are always left native) |
| `file`     | `true`  | Enhance file inputs |
| `ignore`   | `.cfe-ignore, [data-cfe-ignore], .ff-screen-reader-element` | Skip elements matching (or inside) this selector |

Per-element extras:

- `<option data-image="url">` shows an image in the custom dropdown.
- `<input type="file" data-button-text="Browse…" data-placeholder="Attach your CV">` changes the file input's text.

## Theming

At runtime, with CSS custom properties:

```css
:root {
	--cfe-accent: #0055ff;
	--cfe-radius: 0;
}
.dark-form {
	--cfe-background: #111;
	--cfe-text: #fff;
}
```

At build time, with SCSS (see [`src/scss/_variables.scss`](src/scss/_variables.scss) for every variable):

```scss
@use 'custom-form-elements/src/scss/main' with (
	$accent: #0055ff,
	$radius: 0
);
```

Text fields and submit buttons get base styles wrapped in `:where()`, so they have zero specificity and any theme or plugin CSS overrides them.

### Class reference

| Element | Classes |
|---|---|
| Checkbox / radio | `.cfe-choice` (the label), `.cfe-choice--checkbox`, `.cfe-choice--radio`, `.cfe-choice__indicator`, `.cfe-choice__input` |
| Select | `.cfe-select` (`.is-open`, `.has-value`, `.is-disabled`), `.cfe-select__value`, `.cfe-select__arrow`, `.cfe-select__list`, `.cfe-select__option` (`.is-selected`, `.is-disabled`), `.cfe-select__group`, `.cfe-select__native` |
| File | `.cfe-file` (`.has-file`, `.is-disabled`), `.cfe-file__button`, `.cfe-file__name`, `.cfe-file__input` |

Checked, focus and disabled states for checkboxes and radios come from the real input through CSS (`:checked`, `:has()`), not from JS classes, so they can't drift out of sync.

## Development

```bash
npm install
npm run dev     # watch build + live-reloading test page at http://localhost:8082/test/
npm run build   # production build to dist/
```

[`test/index.html`](test/index.html) contains every element in plain HTML plus mock markup from each supported plugin, including CF7's post-validation error state. Each section has buttons to log the submitted values and to reset the form. The plugin markup is approximate and the plugins' own stylesheets aren't loaded, so check against a live install when a plugin changes its output.

## Known limitations

- The custom dropdown list is for pointer users. Keyboard and screen-reader users interact with the visually hidden native `<select>`, which keeps the custom display in sync.
- Changing a select's value from JS without firing `change` won't update the custom display.
- Adjacent-label markup (`<input id><label for>`) must have the label immediately after the input, as Gravity Forms and WPForms do.
- WPForms' "modern" dropdowns and drag-and-drop uploader, and Fluent Forms' uploader, bring their own UI. Leave those alone with `ignore` (Fluent's is ignored by default).
