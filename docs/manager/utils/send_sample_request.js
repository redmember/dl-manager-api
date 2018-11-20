/* global localStorage define pathToRegexp btoa */
define([
  'jquery',
  'lodash'
], function ($, _) {
  var initDynamic = function () {
    // Button send
    $('.sample-request-send').off('click');
    $('.sample-request-send').on('click', function (e) {
      e.preventDefault();
      var $root = $(this).parents('article');
      var group = $root.data('group');
      var name = $root.data('name');
      var version = $root.data('version');
      sendSampleRequest(group, name, version, $(this).data('sample-request-type'));
    });

    // Button clear
    $('.sample-request-clear').off('click');
    $('.sample-request-clear').on('click', function (e) {
      e.preventDefault();
      var $root = $(this).parents('article');
      var group = $root.data('group');
      var name = $root.data('name');
      var version = $root.data('version');
      clearSampleRequest(group, name, version);
    });
  }; // initDynamic

  function sendSampleRequest (group, name, version, type) {
    var isJson = false;
    var $root = $('article[data-group="' + group + '"][data-name="' + name + '"][data-version="' + version + '"]');

    // Optional header
    var header = {};
    $root.find('.sample-request-header:checked').each(function (i, element) {
      var group = $(element).data('sample-request-header-group-id');
      $root.find('[data-sample-request-header-group="' + group + '"]').each(function (i, element) {
        var key = $(element).data('sample-request-header-name');
        var value = element.value;
        if (!element.optional && element.defaultValue !== '') {
          value = element.defaultValue;
        }
        if (value.length > 0) {
          header[key] = value;
        }
      });
    });

    // create JSON dictionary of parameters
    var param = {};
    var paramType = {};
    $root.find('.sample-request-param:checked').each(function (i, element) {
      var group = $(element).data('sample-request-param-group-id');
      $root.find('[data-sample-request-param-group="' + group + '"]').each(function (i, element) {
        var key = $(element).data('sample-request-param-name');
        var value = element.value;
        if (!element.optional && element.defaultValue !== '') {
          value = element.defaultValue;
        }
        if (value.length > 0) {
          param[key] = value;
          paramType[key] = $(element).next().text();
        }
      });
    });

    // grab user-inputted URL
    var url = $root.find('.sample-request-url').val();
    // Insert url parameter
    var pattern = pathToRegexp(url, null);
    var matches = pattern.exec(url);
    for (var i = 1; i < matches.length; i++) {
      var prematch = matches[i].replace('?', '');
      var key = prematch.substr(1);

      if (param[key] !== undefined) {
        url = url.replace(prematch, encodeURIComponent(param[key]));

        // remove URL parameters from list
        delete param[key];
      } else {
        if (isNaN(parseInt(key, 10))) {
          url = url.replace(prematch, '');
        }
      }
    } // for

    $root.find('.sample-request-response').fadeTo(250, 1);
    $root.find('.sample-request-response-json').html('Loading...');
    refreshScrollSpy();

    _.each(param, function (val, key) {
      var t = paramType[key].toLowerCase();
      if (t === 'rowjson') {
        param = JSON.parse(val);
      }
      if (t === 'object' || t === 'array') {
        try {
          param[key] = JSON.parse(val);
        } catch (e) {
        }
      }
      if (t === 'number') {
        param[key] = Number(val);
      }
      if (t === 'boolean') {
        param[key] = (val === 'true');
      }
      if (t === 'base64') {
        param[key] = btoa(val);
      }
    });

    if ((type.toUpperCase() === 'PUT' || type.toUpperCase() === 'POST') && $.isEmptyObject(header)) {
      header['Content-Type'] = 'application/json';
    }

    if (header['Content-Type'] && header['Content-Type'] === 'application/json') {
      isJson = true;
    }

    if (isJson) {
      param = JSON.stringify(param);
    }

    try {
      var idtoken = localStorage.getItem('doc_id_token');
      if (idtoken) {
        header['Authorization'] = 'Bearer ' + idtoken;
      }
    } catch (err) {
      console.log('id_token not found');
    }

    // send AJAX request, catch success or error callback
    var ajaxRequest = {
      url: url,
      xhrFields: { withCredentials: true },
      headers: header,
      data: param,
      type: type.toUpperCase(),
      success: displaySuccess,
      error: displayError
    };

    $.ajax(ajaxRequest);

    function displaySuccess (data, status, jqXHR) {
      var jsonResponse;
      try {
        jsonResponse = JSON.parse(jqXHR.responseText);
        jsonResponse = JSON.stringify(jsonResponse, null, 4);
      } catch (e) {
        jsonResponse = data;
      }
      $root.find('.sample-request-response-json').html(jsonResponse);
      refreshScrollSpy();
    };

    function displayError (jqXHR, textStatus, error) {
      var message = 'Error ' + jqXHR.status + ': ' + error;
      var jsonResponse;
      try {
        jsonResponse = JSON.parse(jqXHR.responseText);
        jsonResponse = JSON.stringify(jsonResponse, null, 4);
      } catch (e) {
        jsonResponse = escape(jqXHR.responseText);
      }

      if (jsonResponse) {
        message += '<br>' + jsonResponse;
      }

      // flicker on previous error to make clear that there is a new response
      if ($root.find('.sample-request-response').is(':visible')) {
        $root.find('.sample-request-response').fadeTo(1, 0.1);
      }

      $root.find('.sample-request-response').fadeTo(250, 1);
      $root.find('.sample-request-response-json').html(message);
      refreshScrollSpy();
    };
  }

  function clearSampleRequest (group, name, version) {
    var $root = $('article[data-group="' + group + '"][data-name="' + name + '"][data-version="' + version + '"]');

    // hide sample response
    $root.find('.sample-request-response-json').html('');
    $root.find('.sample-request-response').hide();

    // reset value of parameters
    $root.find('.sample-request-param').each(function (i, element) {
      element.value = '';
    });

    // restore default URL
    var $urlElement = $root.find('.sample-request-url');
    $urlElement.val($urlElement.prop('defaultValue'));

    refreshScrollSpy();
  }

  function refreshScrollSpy () {
    $('[data-spy="scroll"]').each(function () {
      $(this).scrollspy('refresh');
    });
  }

  /*
  function escapeHtml (str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }
  */

  /**
   * Exports.
   */
  return {
    initDynamic: initDynamic
  };
});
