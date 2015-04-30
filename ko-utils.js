/**
  knockout extenders
**/

(function(ko) {
  // classes
  function Promise(task) {
      var self = this, state, handlers = [];
     
      function resolve(response) {
          state = { s: 1, value: response };
          notify();
      }
      
      function reject(error) {
          state = { s: 0, value: error };
          notify();
      }
      
      function notify() {
          if (state) {
              for (var i = 0, j = handlers.length; i < j; ++i) {
                  with (handlers[i]) {
                      if (state.s == 1) {
                          if (success) success(state.value);
                      } else {
                          if (error) error(state.value);
                      }
                  }
              }
          }
          return self;
      }
  
      this.then = function(success, error) {
          handlers.push({ success: success, error: error });
          return notify();
      };
  
      if (typeof task == 'function') {
          task.apply(null, [resolve, reject]);
      }
  }
  
  // modules
  var http = (function() {
      // send a get request
      function _get(url, options) {
          return new Promise(function(resolve, reject) {
              var xhr = new XMLHttpRequest();
              with (xhr) {
                  open("GET", url, true);
                  onreadystatechange = function() {
                      if (xhr.readyState == 4) {
                          xhr.status == 200 ? resolve(responseText) : reject(xhr);
                      }
                  };
                  send();
              }
          });
      }
      return {
          get: _get
      };
  })();
  
  // custom bindings
  ko.extenders['validate'] = function(target, options) {
    console.log("test");
  };
  
  // global utils facade
  ko.rest = {
    get: http.get
  };

})(ko);
