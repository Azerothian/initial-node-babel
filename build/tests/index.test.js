"use strict";

var _expect = require("expect");

var _expect2 = _interopRequireDefault(_expect);

var _deepFreeze = require("deep-freeze");

var _deepFreeze2 = _interopRequireDefault(_deepFreeze);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("index test", function () {
  it("basic test", function () {
    var input = "test";
    (0, _deepFreeze2.default)(input);
    var after = "test1";
    (0, _deepFreeze2.default)(after);
    var result = input + "1";
    (0, _expect2.default)(after).toEqual(result);
  });
});
//# sourceMappingURL=index.test.js.map
