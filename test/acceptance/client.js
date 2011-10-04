module.exports = ClientTest = function() {
  AcceptanceTest.call(this);

  var async = this.start();

  this.can_join_game = function() {
    this.get("/", function(client) {
      assert.ok(client.html("#welcome"));

      var hold_display = function() {
        return client.querySelector("#hold").attributes._nodes.class._nodeValue !== "hidden";
      }

      client.evaluate("ib.play()");

      ext.Sync.wait_for(hold_display, function() {
        assert.ok(!client.html("#welcome"));
        async.finish();
      });
    });
  }
}
inherits(ClientTest, AcceptanceTest);
