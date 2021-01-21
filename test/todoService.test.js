const { describe, it, before, afterEach } = require('mocha');
const { expect } = require('chai');
const TodoService = require('../src/todoService');
const { createSandbox } = require('sinon');
const Todo = require('../src/todo');
const TodoRepository = require('../src/todoRepository');

describe('todoService', () => {
  let sandbox;

  before(() => {
    sandbox = createSandbox();
  });

  afterEach(() => sandbox.restore());

  describe('#list', () => {
    const mockDatabase = [
      {
        name: 'O Batman',
        age: 87,
        meta: { revision: 0, created: 1611186515251, version: 0 },
        $loki: 1,
      },
    ];

    let todoService;
    beforeEach(() => {
      //dependencies é para validar testes que já estavam feitos e funcionando
      const dependencies = {
        todoRepository: {
          list: sandbox.stub().returns(mockDatabase),
        },
      };
      todoService = new TodoService(dependencies);
    });

    it('should return data on a specific format', () => {
      const result = todoService.list();
      //tira meta e $loki e cria uma variavel expected com o que você quer pegar
      const [{ meta, $loki, ...expected }] = mockDatabase;
      expect(result).to.be.deep.equal([expected]);
    });
  });
  describe('#create', () => {
    let todoService;
    beforeEach(() => {
      //dependencies é para validar testes que já estavam feitos e funcionando
      //e simular o todoRepository (espiando os metodos dele)
      const dependencies = {
        todoRepository: {
          create: sandbox.stub().returns(true),
        },
      };
      todoService = new TodoService(dependencies);
    });

    it("shouldn't save todo item with invalid data", () => {
      const data = new Todo({
        text: '',
        when: '',
      });
      //reflect é o mesmo que deletar a propriedade de um objeto
      Reflect.deleteProperty(data, 'id');
      const expected = {
        error: {
          message: 'invalid data',
          data: data,
        },
      };

      const result = todoService.create(data);
      expect(result).to.be.deep.equal(expected);
    });
    it('should save todo item with late status data when the property is later than expected', () => {
      const properties = {
        text: 'I must walk my dog',
        when: new Date('2020-12-01 12:00:00 GMT-0'),
      };

      const expectedId = '000001';

      const uuid = require('uuid');
      const fakeUUID = sandbox.fake.returns(expectedId);
      //troca o uuid padrão pelo fakeUUID
      sandbox.replace(uuid, 'v4', fakeUUID);

      const data = new Todo(properties);

      const today = new Date('2020-12-02');
      //mantem a data sempre padrão para caso mude o dia (atual) não dê conflitos
      sandbox.useFakeTimers(today.getTime());

      todoService.create(data);

      const expectedCallWith = {
        ...data,
        status: 'late',
      };

      expect(
        todoService.todoRepository.create.calledOnceWithExactly(
          expectedCallWith
        )
      ).to.be.ok;
    });
    it('should save todo item with pending status', () => {
      const properties = {
        text: 'I must walk my dog',
        when: new Date('2020-12-10 12:00:00 GMT-0'),
      };

      const expectedId = '000001';

      const uuid = require('uuid');
      const fakeUUID = sandbox.fake.returns(expectedId);
      //troca o uuid padrão pelo fakeUUID
      sandbox.replace(uuid, 'v4', fakeUUID);

      const data = new Todo(properties);

      const today = new Date('2020-12-02');
      //mantem a data sempre padrão para caso mude o dia (atual) não dê conflitos
      sandbox.useFakeTimers(today.getTime());

      todoService.create(data);

      const expectedCallWith = {
        ...data,
        status: 'pending',
      };

      expect(
        todoService.todoRepository.create.calledOnceWithExactly(
          expectedCallWith
        )
      ).to.be.ok;
    });
  });
});
