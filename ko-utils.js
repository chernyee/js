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
			if (cb(obj[prop], prop) === false) break;
		}
	};
	
	// observable extenders
	ko.extenders['check'] = function(target, options) {
		// initial validation properties
		target.description = ko.observable(options.name || '');
		target.errors = ko.observableArray();
		target.hasError = ko.computed(function() { return target.errors().length ? true : false });
        
		// evaluators
		function required(value, config) {
			return config && !value;
		}
        
		function email(value, config) {
			return value && config && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/i.test(value) == false;
		}
        
		function pattern(value, config) {
			return value && config && (new RegExp(config)).test(value) == false;
		}
        
		// kick start validation
		ko.computed(function() {
			var errors = [], value = ko.unwrap(target);
			ko.utils.objectForEach(options, function(item, name) {
				if (eval("typeof " + name + " == 'function' ? " + name + "(value, ko.unwrap(item)) : undefined")) {
					errors.push(name);
				}
			});
			target.errors(errors)
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
