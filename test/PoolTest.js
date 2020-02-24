import { expect as expect_expect } from "./testutil/expect";
import { Pool as Pool_Pool } from "../lib/util/Pool";

describe('Pool', function() {
  it('Pool', function() {

    var pool = new Pool_Pool({
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

    expect_expect(a.created).be.ok;
    expect_expect(a.busy).be.ok;
    expect_expect(a.discarded).not.be.ok;

    pool.release(a);
    expect_expect(a.busy).not.be.ok;
    expect_expect(a.discarded).not.be.ok;

    pool.release(b);
    expect_expect(b.discarded).be.ok;

  });
});
