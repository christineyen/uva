(function() {
  /*
  # Contains front-end logic
  */  window.UVA = {};
  UVA.cal = (function() {
    var init;
    init = function() {
      return $('.label.success').twipsy({
        placement: 'below',
        live: true,
        html: true
      });
    };
    return {
      init: init
    };
  })();
}).call(this);
