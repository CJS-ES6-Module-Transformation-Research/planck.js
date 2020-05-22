import { expect as testutilexpect_expectjs } from "./testutil/expect";
import { Pool as libutilPool_Pooljs } from "../lib/util/Pool";

describe('Pool', function() {
  it('Pool', function() {

    var pool = new libutilPool_Pooljs({
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

    testutilexpect_expectjs(a.created).be.ok;
    testutilexpect_expectjs(a.busy).be.ok;
    testutilexpect_expectjs(a.discarded).not.be.ok;

    pool.release(a);
    testutilexpect_expectjs(a.busy).not.be.ok;
    testutilexpect_expectjs(a.discarded).not.be.ok;

    pool.release(b);
    testutilexpect_expectjs(b.discarded).be.ok;

  });
});
