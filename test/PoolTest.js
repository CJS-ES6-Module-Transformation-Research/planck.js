import { expect as PoolTest_expect } from "./testutil/expect";
import { Pool as PoolTest_Pool } from "../lib/util/Pool";

describe('Pool', function() {
  it('Pool', function() {

    var pool = new PoolTest_Pool({
      create : function() {
        return {
          created : true,
          busy : false,
          discarded : false,
        };
      },
      allocate : function(obj) {
        obj.busy = true;
      },
      release : function(obj) {
        obj.busy = false;
      },
      discard : function(obj) {
        obj.discarded = true;
      },
      max : 1
    });

    var a = pool.allocate();
    var b = pool.allocate();

    PoolTest_expect(a.created).be.ok;
    PoolTest_expect(a.busy).be.ok;
    PoolTest_expect(a.discarded).not.be.ok;

    pool.release(a);
    PoolTest_expect(a.busy).not.be.ok;
    PoolTest_expect(a.discarded).not.be.ok;

    pool.release(b);
    PoolTest_expect(b.discarded).be.ok;

  });
});
