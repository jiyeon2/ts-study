"use strict";
class Card {
    constructor(type, title, body) {
        this.type = type;
        this.title = title;
        this.body = body;
        this._element = document.createElement('article');
        this._element.classList.add(`${this.type}-card`, 'card');
        this._element.innerHTML = this.getTemplateString();
        const removeButton = this._element.querySelector('.card-close-button');
        removeButton === null || removeButton === void 0 ? void 0 : removeButton.addEventListener('click', () => {
            this.destroy();
        });
    }
    destroy() {
        this._element.remove();
    }
    add() {
        var _a;
        (_a = document.querySelector('.main')) === null || _a === void 0 ? void 0 : _a.append(this._element);
    }
    getTemplateString() {
        let bodyString;
        switch (this.type) {
            case 'image':
                bodyString = `<img src="${this.body}" width="200" height="200">`;
                break;
            case 'video':
                const youtubeVideoCode = this.body.replace('https://youtu.be/', '');
                bodyString = `<iframe src="https://www.youtube.com/embed/${youtubeVideoCode}" width="300" height="200"></iframe>`;
                break;
            case 'task':
                bodyString = `
        <ul>
            <li><input type="checkbox">${this.body}</li>
        </ul>`;
                break;
            case 'note':
            default:
                bodyString = `<p>${this.body}</p>`;
        }
        const template = `
      <div class="card-content-box">
          <h2>${this.title}</h2>
          ${bodyString}
      </div>
      <button class="card-close-button">x</button>
    `;
        return template;
    }
}
class Dialog {
    constructor(dialogClassName) {
        this.openClassName = 'dialog-open';
        this.type = null;
        this.isOpen = false;
        const _dialog = document.querySelector(dialogClassName);
        if (!_dialog)
            throw new Error(`no such element has classname ${dialogClassName}`);
        this._dialog = _dialog;
        const _titleInput = _dialog.querySelector('#card-title');
        const _bodyInput = _dialog.querySelector('#card-body');
        const _dialogTitle = _dialog.querySelector('h3');
        if (!_titleInput || !_bodyInput || !_dialogTitle)
            throw new Error('invalid dialog template');
        this._titleInput = _titleInput;
        this._bodyInput = _bodyInput;
        this._dialogTitle = _dialogTitle;
        const closeButton = _dialog.querySelector('.dialog-close-button');
        closeButton === null || closeButton === void 0 ? void 0 : closeButton.addEventListener('click', () => this.closeDialog());
        const addButton = _dialog.querySelector('.card-add-button');
        addButton === null || addButton === void 0 ? void 0 : addButton.addEventListener('click', () => {
            if (!this.type)
                return;
            const title = this._titleInput.value || '';
            const body = this._bodyInput.value || '';
            const card = new Card(this.type, title, body);
            card.add();
            this.closeDialog();
        });
    }
    clearInputs() {
        this._titleInput.value = '';
        this._bodyInput.value = '';
    }
    _open() {
        this._dialogTitle.textContent = `add ${this.type}`;
        document.body.classList.add(this.openClassName);
    }
    setType(type) {
        this.type = type;
    }
    closeDialog() {
        this.setType(null);
        this.clearInputs();
        document.body.classList.remove(this.openClassName);
    }
    openDialog(type) {
        this.setType(type);
        this._open();
    }
}
class Menu {
    constructor(menuClassName, dialog) {
        const _menu = document.querySelector(menuClassName);
        if (!_menu)
            throw new Error(`no such element has classname ${menuClassName}`);
        const _menuButtons = _menu.querySelectorAll('button');
        if (_menuButtons.length === 0)
            throw new Error(`no buttons in ${menuClassName}`);
        this._menu = _menu;
        this._menuButtons = Array.from(_menuButtons);
        this._menuButtons.forEach(button => {
            const cardType = button.textContent; // 버튼에 카드 타입을 달려면???
            button.addEventListener('click', () => {
                console.log({ cardType, button });
                dialog.openDialog(cardType);
            });
        });
    }
}
class Motion {
    constructor(dialog = new Dialog('.dialog'), menu = new Menu('.nav', dialog)) {
        //로컬스토리지에서 [{type, title, body}] 가져와서 new Card.add
    }
}
new Motion();
//# sourceMappingURL=main.js.map