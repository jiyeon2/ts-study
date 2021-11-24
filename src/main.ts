
type CardType = 'image' | 'video' | 'note' | 'task';
type DialogType = CardType | null; 

class Card {
  _element = document.createElement('article');
  constructor(
    private type: CardType, 
    private title:string, 
    private body:string) {
      this._element.classList.add(`${this.type}-card`, 'card');
      this._element.innerHTML = this.getTemplateString();

      const removeButton = this._element.querySelector('.card-close-button');
      removeButton?.addEventListener('click', () => {
        this.destroy();
      })
    }

  destroy() {
    this._element.remove();
  }

  add() {
    document.querySelector('.main')?.append(this._element);
  }

  getTemplateString(): string {
    let bodyString: string;

    switch (this.type) {
      case 'image':
        bodyString = `<img src="${this.body}" width="200" height="200">`
        break;
      case 'video':
        const youtubeVideoCode = this.body.replace('https://youtu.be/','');
        bodyString = `<iframe src="https://www.youtube.com/embed/${youtubeVideoCode}" width="300" height="200"></iframe>`
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
  openClassName = 'dialog-open';
  type: DialogType = null;
  isOpen: boolean = false;
  private _dialog: HTMLElement;
  private _titleInput: HTMLInputElement;
  private _bodyInput:HTMLInputElement;
  private _dialogTitle: HTMLElement;

  constructor(dialogClassName: string){
    const _dialog = document.querySelector<HTMLElement>(dialogClassName);
    if (!_dialog) throw new Error(`no such element has classname ${dialogClassName}`);
    this._dialog = _dialog;

    const _titleInput = _dialog.querySelector<HTMLInputElement>('#card-title');
    const _bodyInput = _dialog.querySelector<HTMLInputElement>('#card-body');
    const _dialogTitle = _dialog.querySelector<HTMLElement>('h3');
    if (!_titleInput || !_bodyInput || !_dialogTitle) throw new Error('invalid dialog template');
    this._titleInput = _titleInput;
    this._bodyInput = _bodyInput;
    this._dialogTitle = _dialogTitle;

    const closeButton = _dialog.querySelector('.dialog-close-button');
    closeButton?.addEventListener('click', () => this.closeDialog());

    const addButton = _dialog.querySelector('.card-add-button');
    addButton?.addEventListener('click', () => {
      if (!this.type) return;
      const title = this._titleInput.value || '';
      const body = this._bodyInput.value || '';

      const card = new Card(this.type, title, body);
      card.add();
      
      this.closeDialog();
    })
  }

  private clearInputs() {
    this._titleInput.value = '';
    this._bodyInput.value = '';
  }

  private _open(){
    this._dialogTitle.textContent = `add ${this.type}`;
    document.body.classList.add(this.openClassName);
  }

  private setType(type: DialogType) {
    this.type = type;
  }

  public closeDialog(){
    this.setType(null);
    this.clearInputs();
    document.body.classList.remove(this.openClassName);
  }

  public openDialog(type: CardType) {
    this.setType(type);
    this._open();
  }
}

class Menu {
  private _menu: HTMLElement;
  private _menuButtons: HTMLElement[];

  constructor(menuClassName: string, dialog: Dialog) {
    const _menu = document.querySelector<HTMLElement>(menuClassName);
    if (!_menu) throw new Error(`no such element has classname ${menuClassName}`);

    const _menuButtons = _menu.querySelectorAll('button');
    if (_menuButtons.length === 0) throw new Error (`no buttons in ${menuClassName}`);

    this._menu = _menu;
    this._menuButtons = Array.from(_menuButtons);

    this._menuButtons.forEach(button => {
      const cardType = button.textContent as CardType; // 버튼에 카드 타입을 달려면???
      button.addEventListener('click', () => {
        console.log({cardType, button});
        dialog.openDialog(cardType)
      });
    })
  }
}


class Motion {
  constructor(
    dialog = new Dialog('.dialog'),
    menu = new Menu('.nav', dialog)
  ){
    //로컬스토리지에서 [{type, title, body}] 가져와서 new Card.add
  }
}

new Motion();