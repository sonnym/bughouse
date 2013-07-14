module.exports.setUp = function(callback) {
  this.acceptance = new AcceptanceTest();
  this.acceptance.start_server();
  callback();
}

module.exports.can_join_game = function(test) {
  this.acceptance.get("/", function(client) {
    test.ok(client.html("#welcome"));

    var hold_display = function() {
      return client.querySelector("#hold").attributes._nodes.class._nodeValue !== "hidden";
    }

    client.evaluate("ib.play()");

    Gourdian.ext.Sync.wait_for(hold_display, function() {
      test.ok(!client.html("#welcome"));
      test.done
    });
  });
}
