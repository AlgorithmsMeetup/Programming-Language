var log_console = function(msg) {
    $('#console').append('<p>' + msg + '</p>');
};
// After page load
$(function() {
    var myTurtle = new Turtle("turtlecanvas");
    var env = { };
    addBinding(env, 'forward', function(d) { myTurtle.forward(d); });
    addBinding(env, 'right', function(a) { myTurtle.right(a); });
    addBinding(env, 'left', function(a) { myTurtle.left(a); });
    addBinding(env, 'home', function() { myTurtle.home(); });

    $('#submit').click(function() {
        var user_text = $('#input').val();
        $('#console').html('');
        myTurtle.clear();
        try {
            var parsed = TORTOISE.parse(user_text);
            try {
                var result = evalStatements(parsed, env);
            }
            catch(e) {
                log_console(' ');
            }
        }
        catch(e) {
            log_console(' ');
        }
        return result;
    });

    $('.examples').on('click', '.circspiral', function() {
      var input = $('#input');
      var program = 'repeat(18) {right(20); repeat(36) { forward(20); right(10); } }';
      input.val(program);
    });

    $('.examples').on('click', '.square', function() {
      var input = $('#input');
      var program = 'repeat(4){forward(100); right(90);}';
      input.val(program);
    });
    
    $('.examples').on('click','.spiral', function() {
      var input = $('#input');
      var program = 'define spiral(size) {if (size < 100) { forward(size); right(15); spiral(size*1.02);} } spiral(5);'
      input.val(program);
    });
      
});