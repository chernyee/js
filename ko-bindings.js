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
})(ko);
