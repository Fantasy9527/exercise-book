(function() {
  var removeEmpty, typeIsArray, typeIsObject;

  $.fn.serializeJson = function() {
    var arrayData, objectData;
    arrayData = this.serializeArray();
    objectData = {};
    $.each(arrayData, function() {
      var value;
      if (this.value != null) {
        value = this.value;
      } else {
        value = '';
      }
      if (objectData[this.name] != null) {
        if (!objectData[this.name].push) {
          objectData[this.name] = [objectData[this.name]];
        }
        return objectData[this.name].push(value);
      } else {
        return objectData[this.name] = value;
      }
    });
    return JSON.stringify(objectData);
  };

  $.fn.exists = function() {
    return this.length > 0;
  };

  window.Json = function(xhr) {
    return xhr.responseJSON;
  };

  window.Ajax = function(url, json, fsuccess, ferror) {
    return $.ajax(url, {
      type: "POST",
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      data: json,
      error: function(jqXHR, textStatus, errorThrown) {
        return ferror(jqXHR, textStatus, errorThrown);
      },
      success: function(data, textStatus, jqXHR) {
        return fsuccess(data, textStatus, jqXHR);
      }
    });
  };

  typeIsArray = function(value) {
    return value && typeof value === 'object' && value instanceof Array && typeof value.length === 'number' && typeof value.splice === 'function' && !(value.propertyIsEnumerable('length'));
  };

  typeIsObject = function(value) {
    return value && typeof value === 'object' && value instanceof Object;
  };

  removeEmpty = function(json) {
    var k, v, _results, _results1;
    if (typeIsArray(json)) {
      _results = [];
      for (k in json) {
        _results.push(removeEmpty(k));
      }
      return _results;
    } else if (typeIsObject(json)) {
      _results1 = [];
      for (k in json) {
        v = json[k];
        if (v === '') {
          _results1.push(json[k] = null);
        } else {
          _results1.push(removeEmpty(v));
        }
      }
      return _results1;
    }
  };

  window.Post = function(url, json) {
    removeEmpty(json);
    return $.ajax(url, {
      type: "POST",
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(json)
    });
  };

  window.Remove = function(url) {
    return $.ajax(url, {
      type: "DELETE"
    });
  };

  window.Warning = function(xhr) {
    var json, tip;
    if (xhr.status === 400) {
      if (xhr.responseJSON) {
        json = xhr.responseJSON;
        tip = json.message;
        if (json.extra_message) {
          tip = tip + ": " + json.extra_message;
        }
        return alert(tip);
      } else {
        return alert(xhr.responseText);
      }
    }
  };

  window.Delay = function(ms, func) {
    return setTimeout(func, ms);
  };

  window.Timer = function(ms, func) {
    return setInterval(func, ms);
  };

  window.Validate = function(id) {
    var inputs, ok;
    inputs = $(id + " :input");
    ok = true;
    inputs.each(function(e) {
      var check;
      try {
        check = $(this).parsley('validate');
        if (check === false) {
          ok = false;
        }
        return null;
      } catch (_error) {
        e = _error;
      }
    });
    return ok;
  };

  window.FormHandler = (function() {
    function FormHandler() {
      var self;
      self = this;
      $('input').blur(function(ev) {
        return self.blur($(this), ev);
      });
      $('form').submit(function(ev) {
        return self.form($(this), ev);
      });
    }

    FormHandler.prototype.form = function(obj, ev) {
      var error, ok, submit, url;
      url = obj.attr('data-url');
      if (!url) {
        return;
      }
      submit = obj.find(':submit');
      submit.attr('disabled', 'true');
      error = function() {
        return submit.removeAttr('disabled');
      };
      ok = function(data) {
        if (data.location != null) {
          location.href = data.location;
        }
        return submit.removeAttr('disabled');
      };
      Ajax(url, obj.serializeJson(), ok, error);
      ev.preventDefault();
      return false;
    };

    FormHandler.prototype.blur = function(obj, ev) {
      var ferror, fok, help, id, map, url;
      url = obj.attr('data-url');
      if (!url) {
        return;
      }
      id = obj.attr('name');
      if (!id) {
        id = obj.attr('id');
      }
      help = $("#help-" + id);
      map = {};
      map[id] = obj.val();
      obj.addClass('checking');
      fok = function(data, textStatus, jqXHR) {
        obj.removeClass('checking');
        obj.removeClass('check-failed');
        obj.addClass('check-ok');
        return help.addClass('hide');
      };
      ferror = function(jqXHR, textStatus, errorThrown) {
        obj.removeClass('checking');
        obj.removeClass('check-ok');
        obj.addClass('check-failed');
        help.removeClass('hide');
        return help.text(jqXHR.responseJSON.message);
      };
      return Ajax(url, JSON.stringify(map), fok, ferror);
    };

    return FormHandler;

  })();

  window.AutoRedirect = (function() {
    function AutoRedirect() {
      var autore, change, counter, text, timeout, timer;
      autore = $('a[data-timeout]:first');
      if (autore.exists()) {
        timeout = autore.attr('data-timeout');
        text = autore.text();
        counter = parseInt(timeout / 1000, 10);
        change = (function(_this) {
          return function() {
            autore.text("" + text + " (" + counter + ")");
            return counter -= 1;
          };
        })(this);
        change();
        timer = Timer(1000, change);
        Delay(timeout, function() {
          clearInterval(timer);
          return window.location.href = autore.attr('href');
        });
      }
    }

    return AutoRedirect;

  })();

  $(function() {
    var autore, handler;
    handler = new FormHandler();
    return autore = new AutoRedirect();
  });

}).call(this);

//# sourceMappingURL=main.js.map
