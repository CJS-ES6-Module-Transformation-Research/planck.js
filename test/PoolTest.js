var _Pool = require('../lib/util/Pool');

var expect = require('./testutil/expect');

describe('Pool', function () {
  it('Pool', function () {

    var pool = new _Pool.Pool({
      create: function create() {
        return {
          created: true,
          busy: false,
          discarded: false
        };
      },
      allocate: function allocate(obj) {
        obj.busy = true;
      },
      release: function release(obj) {
        obj.busy = false;
      },
      discard: function discard(obj) {
        obj.discarded = true;
      },
      max: 1
    });

    var a = pool.allocate();
    var b = pool.allocate();

    expect(a.created).be.ok;
    expect(a.busy).be.ok;
    expect(a.discarded).not.be.ok;

    pool.release(a);
    expect(a.busy).not.be.ok;
    expect(a.discarded).not.be.ok;

    pool.release(b);
    expect(b.discarded).be.ok;
  });
});
