var BughouseModel = require("./../../app/models/bughouse.js");

module.exports = {
  "setUp": function(callback) {
    callback();
  }
}

exports.one_can_join = function(test) {
  test.equal(BughouseModel.join("sid0", "client0"), null);
  BughouseModel.quit("sid0");

  test.done();
}

exports.two_make_a_game = function(test) {
  test.equal(BughouseModel.join("sid0", "client0"), null);

  var response = BughouseModel.join("sid1", "client1");
  test.equal(response["opp"], "sid0");
  test.ok(response["sid1"]);
  test.ok(response.states);
  test.ok(response.states.c);

  test.ok(!(response.states.l && response.states.r));

  // only one player needs to quit to remove the game
  BughouseModel.quit("sid0");

  test.done();
}

exports.piece_carry_over = function(test) {
  var response, sid_1_w, sid_1_b, sid_2_w, sid_2_b;

  // game 1
  test.equal(BughouseModel.join("sid0", "client0"), null);

  response = BughouseModel.join("sid1", "client1");
  test.equal(response["opp"], "sid0");
  test.ok(response["sid1"]);
  test.ok(response.states);
  test.ok(response.states.c);

  test.ok(!(response.states.l && response.states.r));

  if (response["sid1"] == "w") {
    sid_1_w = "sid1";
    sid_1_b = "sid0";
  } else {
    sid_1_w = "sid0";
    sid_1_b = "sid1";
  }

  // game 2
  test.equal(BughouseModel.join("sid2", "client2"), null);

  response = BughouseModel.join("sid3", "client3");
  test.equal(response["opp"], "sid2");
  test.ok(response["sid3"]);
  test.ok(response["states"]);
  test.ok(response["states"]["c"]);

  test.ok(response["states"]["l"] || response["states"]["r"]);

  if (response["sid3"] == "w") {
    sid_2_w = "sid3";
    sid_2_b = "sid2";
  } else {
    sid_2_w = "sid2";
    sid_2_b = "sid3";
  }

  // capture => 1. e4 d5 2. exd
  BughouseModel.update(sid_1_w, 52, 36);
  BughouseModel.update(sid_1_b, 11, 27);
  BughouseModel.update(sid_1_w, 36, 27);

  BughouseModel.update(sid_2_w, 52, 36, function(result) {
    test.equal(result.state.s_b, "p");

    // again for wrap around
    BughouseModel.update(sid_2_b, 11, 27);
    BughouseModel.update(sid_2_w, 36, 27);

    BughouseModel.update(sid_1_b, 8, 16, function(result) {
      test.equal(result.state.s_b, "p"); // fails when test is run along side others
      test.done();
    });
  });
};
