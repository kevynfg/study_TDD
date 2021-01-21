const { describe, it, before, afterEach } = require('mocha');
const { expect } = require('chai');
const TodoRepository = require('../src/todoRepository');
const { createSandbox } = require('sinon');

describe('todoRepository', () => {
  let todoRepository;
  let sandbox;

  before(() => {
    todoRepository = new TodoRepository();
    sandbox = createSandbox();
  });

  //afterEach reseta o sandbox toda vez que um It é chamado
  afterEach(() => {
    //Reseta o banco de dados ou objeto que está em testes para padrão
    sandbox.restore();
  });

  describe('methods signature', () => {
    it('should call find from lokijs', () => {
      const mockDatabase = [
        {
          name: 'O Batman',
          age: 87,
          meta: { revision: 0, created: 1611186515251, version: 0 },
          $loki: 1,
        },
      ];

      const functionName = 'find';
      const expectReturn = mockDatabase;

      //substitui o comportamento de alguma função
      //quando o "find" for chamado na classe, exige que retorne o valor padrão esperado
      //stub "espia" a propriedade de uma classe/module
      sandbox.stub(todoRepository.schedule, functionName).returns(expectReturn);
      const result = todoRepository.list();
      expect(result).to.be.deep.equal(expectReturn);

      //validar se existe algum loop interno/quantas vezes
      expect(todoRepository.schedule[functionName].calledOnce).to.be.ok;
    });

    it('should call insertOne from lokijs', () => {
      const functionName = 'insertOne';
      const expectReturn = true;

      const data = { name: 'Kevyn' };

      //substitui o comportamento de alguma função
      //quando o "find" for chamado na classe, exige que retorne o valor padrão esperado
      sandbox.stub(todoRepository.schedule, functionName).returns(expectReturn);
      const result = todoRepository.create(data);
      expect(result).to.be.ok;

      //validar se existe algum loop interno/quantas vezes
      //calledOnceWithExactly evita com que alterem o "create" e coloquem um "id" por exemplo
      expect(todoRepository.schedule[functionName].calledOnceWithExactly(data))
        .to.be.ok;
    });
  });
});

const mockDatabase = [
  {
    name: 'O Batman',
    age: 87,
    meta: { revision: 0, created: 1611186515251, version: 0 },
    $loki: 1,
  },
];
