'use strict';

const push = (query, field, params, prop, options) => {
  if (typeof field === 'undefined') {
    return;
  }
  if (typeof query.filter === 'undefined') {
    query.filter = [];
  }

  if (typeof params === 'undefined') {
    query.filter.push(field);
    return;
  }

  let _value;
  if (typeof params !== 'object') {
    options = prop;
    _value = params;
  } else {
    _value = params[prop];
  }

  if (typeof _value === 'undefined') {
    return;
  }

  let _type = 0;
  const data = {};

  if (options) {
    if (typeof options.cop !== 'undefined') {
      data._cop = options.cop;
    }
    if (typeof options.lop !== 'undefined') {
      data._lop = options.lop;
    }
    if (typeof options.type !== 'undefined') {
      _type = 1;
    }
  }

  if (_type === 0 && typeof _value !== 'number') {
    data[field] = Number(_value);
  } else {
    data[field] = _value;
  }
  query.filter.push(data);
};

const filterParsing = (query, filter) => {
  const operation = { eq: '=', neq: '<>', lt: '<', lte: '<=', gt: '>', gte: '>=', regex: 'regexp' };

  let _filter = [];
  if (typeof query.filter === 'string') {
    return;
  }

  if (typeof filter === 'string') {
    _filter.push(filter);
  } else if (filter instanceof Array) {
    _filter = [...filter];
  } else {
    return;
  }

  if (_filter.length <= 0) {
    return;
  }

  if (typeof query.filter !== 'undefined' && !(query.filter instanceof Array)) {
    query.filter = [query.filter];
  }

  for (let i = 0; i < _filter.length; i++) {
    const items = _filter[i].split(',');
    if (items.length < 2) {
      continue;
    }

    let cop;
    if (items.length === 3) {
      cop = operation[items[2]];
    } else {
      cop = '=';
    }

    if (typeof cop === 'undefined') {
      continue;
    }

    const fcolumn = items[0].replace(/[^0-9A-Za-z_\-.]/g, '');
    // const fvalue = items[1].replace(/[^0-9A-Za-z| _\-@.+]/g, '');
    const fvalue = items[1];

    if (cop === 'regexp') {
      push(query, `AND ${fcolumn} REGEXP '${fvalue}'`);
      continue;
    }
    const values = fvalue.split('||');
    if (values.length > 1) {
      push(query, fcolumn, { array: values }, 'array', { cop: cop, type: 1 });
    } else {
      push(query, fcolumn, fvalue, { cop: cop, type: 1 });
    }
  }
};

const getQueryOptions = (query, options, filterIgnore = 0) => {
  if (typeof options === 'undefined') {
    return;
  }

  for (let key in options) {
    if (typeof options[key] === 'undefined') {
      continue;
    }

    switch (key) {
      case 'sort':
      case 'dir':
      case 'limit':
      case 'offset':
        query[key] = options[key];
        break;
      case 'sync':
        query[key] = Number(options[key]);
        break;
      default:
        break;
    }
  }

  if (filterIgnore === 1) {
    return;
  }

  if (typeof options.filter !== 'undefined') {
    filterParsing(query, options.filter);
  }
};

const add = (filters, seperate, filter) => {
  if (seperate === '&') {
    seperate = ' AND ';
  } else if (seperate === '|') {
    seperate = ' OR ';
  }
  if (filter && filter.length > 0) {
    if (filters.length > 0) {
      filters += seperate;
    }
    filters += filter;
  }
  return filters;
};

module.exports = {
  add,
  push,
  getQueryOptions
};
