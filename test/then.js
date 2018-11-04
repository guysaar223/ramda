var assert = require('assert');

var R = require('../source');
var eq = require('./shared/eq');


describe('then', function() {
  it('invokes then on the promise with the function passed to it', function(done) {
    R.then(
        function(n) {
          eq(n, 1);
          done();
        },
        Promise.resolve(1)
    );
  });

  it('flattens promise returning functions', function(done) {
    var incAndWrap = R.compose(Promise.resolve.bind(Promise), R.inc);
    var asyncAddThree = R.pipe(incAndWrap, R.then(incAndWrap), R.then(incAndWrap));

    R.then(function(result) {
      eq(result, 4);
      done();
    })(asyncAddThree(1));
  });

  it('throws a typeError if the then method does not exist', function() {
    assert.throws(
            function() { R.then(R.inc, 1); },
            function(err) {
              return err.constructor === TypeError &&
                       err.message === '`then` expected a Promise, received 1';
            }
        );

  });

  it('is not dependent on a particular promise implementation', function(done) {
    var thennable = {
      then: function(f) {
        return f(42);
      }
    };

    var f = function(n) {
      eq(n, 42);
      done();
    };

    R.then(f, thennable);
  });
});
