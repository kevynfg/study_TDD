const loki = require('lokijs');

class TodoRepository {
  constructor() {
    const db = new loki('todo', {});
    this.schedule = db.addCollection('schedule');
  }

  list() {
    return this.schedule.find();
  }

  create(data) {
    return this.schedule.insertOne(data);
  }
}

module.exports = TodoRepository;

// const c = new TodoRepository();

// c.create({ name: 'O Batman', age: 87 });
// c.create({ name: 'O teste Mistico', age: 27 });

// console.log('list', c.list());
