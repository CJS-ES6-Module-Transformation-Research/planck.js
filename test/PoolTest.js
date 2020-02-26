var _expect = require("./testutil/expect");

var _Pool = require("../lib/util/Pool");

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

    (0, _expect.expect)(a.created).be.ok;
    (0, _expect.expect)(a.busy).be.ok;
    (0, _expect.expect)(a.discarded).not.be.ok;

    pool.release(a);
    (0, _expect.expect)(a.busy).not.be.ok;
    (0, _expect.expect)(a.discarded).not.be.ok;

    pool.release(b);
    (0, _expect.expect)(b.discarded).be.ok;
  });
});
