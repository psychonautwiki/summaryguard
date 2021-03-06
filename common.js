'use strict';

{
	class SummaryGuard {
		constructor() {
			if(!this._isPageEligible()) {
				return;
			}

			this._initialSectionSummary = /\/\* (.*?) \*\//;

			const summaryHeader = document.getElementById('wpSummaryLabel');

			this._elements = {
				editform: document.getElementsByName('editform')[0],
				summary: document.getElementsByName('wpSummary')[0],
				summaryHeader,
				summaryHeaderLabel: summaryHeader.getElementsByTagName('label')[0],
				checkbox: null,
				warning: null
			};

			this._setup();
		}

		_isPageEligible() {
			return document.body.classList.contains('action-edit');
		}

		_setup() {
			this._renderUI();
			this._setupEvents();

			this._patchUI();
		}

		_setupEvents() {
			this._elements.editform.addEventListener('submit', evt => {
				if (!this._verifySubmit()) {
					evt.preventDefault();
				}
			});

			this._elements.checkbox.addEventListener('change', evt => {
				if (evt.target.checked) {
					this._setAutoSummary();
					return;
				}
			});
		}

		_patchUI() {
			const sectionName = this._getSectionName();

			if (sectionName) {
				const sectionNote = this._buildSectionNote(`[Section: ${sectionName[1]}]`);

				this._elements.summaryHeader.insertBefore(sectionNote, this._elements.summaryHeader.firstChild);

				// clear summary
				this._elements.summary.value = '';
			}

			this._elements.summaryHeaderLabel.innerHTML = 'Explanation of this change:';
		}

		_getSectionName() {
			return (this._elements.summary.value || '').match(this._initialSectionSummary);
		}

		_setAutoSummary() {
			if (!this._isSummaryEmpty()) {
				return;
			}

			this._elements.summary.value = 'Grammatics';
		}

		_getSummary() {
			return this._elements.summary.value;
		}

		_hasInitialSummary(summary) {
			return this._initialSectionSummary.test(summary);
		}

		_isSummaryEmpty() {
			return this._getSummary() === '';
		}

		_verifySubmit() {
			if (this._hasInitialSummary(this._getSummary())) {
				this._showWarning('Your summary must not include text of the format "/* anything */".');

				return false;
			}

			if (this._isSummaryEmpty()) {
				this._showWarning('You cannot save this article without a summary. Please consult our <a href="/wiki/Guidelines">guidelines</a> (general article guide).');

				return false;
			}

			return true;
		}

		_renderUI() {
			this._elements.checkbox = this._buildCheckbox();
			this._elements.warning = this._buildWarning();

			this._util_prependElement(this._elements.checkbox, 'editCheckboxes');
			this._util_prependElement(this._elements.warning, 'editOptions', 'editButtons');
		}

		_util_prependElement(element, parentClass, firstChildClass) {
			const parent = document.getElementsByClassName(parentClass)[0];
			const firstChild = firstChildClass ? document.getElementsByClassName(firstChildClass)[0] : parent.firstChild;

			parent.insertBefore(element, firstChild);
		}

		_buildCheckbox() {
			const set = document.createElement('span');

			const input = document.createElement('input');

			input.type = 'checkbox';
			input.id = 'wpGrammarEdit';
			input.checked = false;

			const label = document.createElement('label');

			label.htmlFor = 'wpGrammarEdit';

			label.appendChild(document.createTextNode('This is a grammar edit'));

			[
				input,
				document.createTextNode(' '),
				label,
				document.createTextNode(' ')
			].forEach(e => set.appendChild(e));

			return set;
		}

		_showWarning(text) {
			this._elements.warning.innerHTML = text;
			this._elements.warning.style.display = 'inherit';
		}

		_hideWarning() {
			this._elements.warning.style.display = 'none';
		}

		_buildWarning() {
			const notice = document.createElement('div');

			notice.className = 'need-summary-warn';

			// hide per default
			notice.style.display = 'none';

			notice.style.border = '1px solid';
			notice.style.padding = '5px';
			notice.style.margin = '5px 0';
			notice.style.fontWeight = '700';

			notice.style.color = 'red';

			return notice;
		}

		_buildSectionNote(sectionName) {
			const note = document.createElement('span');

			note.style.color = 'red';
			note.style.marginRight = '5px';

			note.appendChild(document.createTextNode(sectionName));

			return note;
		}
	}

	new SummaryGuard();
};