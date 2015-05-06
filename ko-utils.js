/**
  knockout utilities: extenders, modules etc.
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
      // tojson 
      function _tojson(txt) {
          return ko.utils.parseJson(txt) || txt;
      }
      // send a get request
      function _get(url, options) {
          return new Promise(function(resolve, reject) {
              var xhr = new XMLHttpRequest();
              with (xhr) {
                  open("GET", url, true);
                  onreadystatechange = function() {
                      if (xhr.readyState == 4) {
                          if (xhr.status == 200) {
                            resolve(_tojson(responseText));
                          } else {
                            reject(xhr);
                          }
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
  
	// object property iterator
	ko.utils.objectForEach = function(obj, cb) {
		for (var prop in (typeof obj == 'object' ? obj : {})) {
			if (cb(obj[prop], prop) === false) {
				break;
			}
		}
	};
	
	// observable extenders
	ko.extenders['check'] = function(target, options) {
		// evaluators
		function required(value, config, check) {
			return config && !value;
		};
		// kick start validation
		ko.computed(function() {
			var error, value = ko.unwrap(target);
			ko.utils.objectForEach(options, function(item, key) {
				var config = ko.unwrap(item);
				console.log(value, config);
				/*if (eval("typeof " + name + " == 'function' ? " + name + "(value, config, item) : undefined")) {
					error = item.text;
				}*/
			});
		});
	};

  ko.extenders['selected'] = function(target, options) {
    var current, unset = options.allowUnset === undefined ? true : options.allowUnset;
    ko.computed(function() {
      var value = ko.unwrap(target), selected = options.store();
      if (current != value) {
        if (value || (!value && unset)) {
          options.store((current = value) ? options.item : undefined);
        } else {
          setTimeout(function() { target(current = true); }, 0);
        }
      } else {
        target(current = (selected === options.item));
      }
    });
  };
  
  // global utils facade
  ko.http = {
    get: http.get
  };

})(ko);
