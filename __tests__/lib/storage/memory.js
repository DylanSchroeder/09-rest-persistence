'use strict';

const Storage = require('../../../src/lib/storage/memory');

describe('MemoryStorage', () => {
  it('does not save a non-object', () => {
    var store = new Storage('test');

    return expect(store.save('nope'))
      .rejects.toThrow('schema "test"');
  });

  it('can save an object', () => {
    var store = new Storage('test');

    return store.save({ name: 'Shrek' })
      .then(saved => {
        expect(saved).toBeDefined();
        expect(saved.id).toBeDefined();
        expect(saved.name).toBe('Shrek');

        return store.get(saved.id)
          .then(fromStore => {
            expect(fromStore).toEqual(saved);
          });
      });
  });

  it('rejects if not given an id', () => {
    var store = new Storage('test');

    return expect(store.get('missing'))
      .rejects.toThrow('Document with id "missing" in schema "test" not found');
  });

  it('resolves with empty array for getAll on empty store', () => {
    var store = new Storage('test');

    return store.getAll()
      .then(results => {
        expect(results).toEqual([]);
      });
  });

  it('resolves with expected array for getAll on non-empty store', () => {
    var store = new Storage('test');

    var toSave = [
      { name: 'Shrek' },
      { class: 'Swamp' },
    ];

    return Promise.all(
      toSave.map(obj => store.save(obj))
    ).then(saved => {
      console.log(saved);

      return store.getAll()
        .then(results => {
          expect(results).toEqual(saved);
        });
    });
  });
});