class TodoService {
  constructor({ todoRepository }) {
    this.todoRepository = todoRepository;
  }

  create(todoItem) {
    if (!todoItem.isValid()) {
      return {
        error: {
          message: 'invalid data',
          data: todoItem,
        },
      };
    }

    const { when } = todoItem;
    const today = new Date();
    const todo = {
      ...todoItem,
      status: when > today ? 'pending' : 'late',
    };
    return this.todoRepository.create(todo);
  }

  list(query) {
    return (
      this.todoRepository
        .list()
        //só trazer o result de dentro dos dados
        .map(({ meta, $loki, ...result }) => result)
    );
  }
}

module.exports = TodoService;
