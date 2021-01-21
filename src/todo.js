const uuid = require('uuid');

class Todo {
  constructor({ text, when }) {
    this.text = text;
    this.when = when;

    this.status = '';
    this.id = uuid.v4();
  }

  isValid() {
    //se tiver !! antes de algum valor, ele transforma o que estiver
    //na frente, em booleano, logo text está vazio = false
    return !!this.text && !isNaN(this.when.valueOf());
  }
}

module.exports = Todo;
