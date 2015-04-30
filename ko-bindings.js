/**
  knockout bindings
**/

(function(ko) {
  ko.bindingHandlers['reference'] = {
      update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
          var options = ko.unwrap(valueAccessor());
          var data = ko.unwrap(options.options);
          var value = ko.unwrap(options.value);
          for (var i = 0, description = undefined; i < data.length; ++i) {
              if (ko.unwrap(data[i][options.key || 'id']) == value) {
                  description = ko.unwrap(data[i][options.caption || 'description']);
              }
          }
          element.innerHTML = description || '';
      }
  };
  
  var format1 = function(v, n, x) {
      var re = '(\\d)(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
      return v.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$1,');
  };
  
  ko.bindingHandlers['number'] = {
      update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
          var options = ko.unwrap(valueAccessor()), text = '';
          var value = parseFloat(ko.unwrap(options.value));
          if (!isNaN(value)) {
              text = format1(value, options.decimal || 0, options.digiGroup || 3);
              if (options.currency) text = options.currency + ' ' + text;
          } 
          element.innerHTML = text;
      }
  };
})(ko);
