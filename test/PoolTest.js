import { expect as testutilexpect_expect } from "./testutil/expect";
import { Pool as libutilPool_Pool } from "../lib/util/Pool";

describe('Pool', function() {
  it('Pool', function() {

    var pool = new libutilPool_Pool({
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

    testutilexpect_expect(a.created).be.ok;
    testutilexpect_expect(a.busy).be.ok;
    testutilexpect_expect(a.discarded).not.be.ok;

    pool.release(a);
    testutilexpect_expect(a.busy).not.be.ok;
    testutilexpect_expect(a.discarded).not.be.ok;

    pool.release(b);
    testutilexpect_expect(b.discarded).be.ok;

  });
});
