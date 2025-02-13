// A smaller clone of softwarerero:meteor-accounts-t9n
// https://github.com/softwarerero/meteor-accounts-t9n

import tracker from 'meteor/tracker';

if (typeof Meteor !== "undefined" && Meteor !== null) {
  Meteor.startup(function() {
    if (Meteor.isClient) {
      return typeof Template !== "undefined" && Template !== null ? Template.registerHelper('t9n', function(x, params) {
        return T9n.get(x, true, params.hash);
      }) : void 0;
    }
  });
}

T9n = (function() {
  function T9n() {}

  T9n.maps = {};

  T9n.defaultLanguage = 'en';

  T9n.language = '';

  T9n.dep = tracker.Tracker ? new tracker.Tracker.Dependency() : void 0;

  T9n.depLanguage = tracker.Tracker ? new tracker.Tracker.Dependency() : void 0;

  T9n.missingPrefix = ">";

  T9n.missingPostfix = "<";

  T9n.map = function(language, map) {
    var ref;
    if (!this.maps[language]) {
      this.maps[language] = {};
    }
    this.registerMap(language, '', false, map);
    return (ref = this.dep) != null ? ref.changed() : void 0;
  };

  T9n.get = function(label, markIfMissing, args, language) {
    var index, parent, ref, ref1, ref2, ref3, ret;
    if (markIfMissing == null) {
      markIfMissing = true;
    }
    if (args == null) {
      args = {};
    }
    if ((ref = this.dep) != null) {
      ref.depend();
    }
    if ((ref1 = this.depLanguage) != null) {
      ref1.depend();
    }
    if (typeof label !== 'string') {
      return '';
    }
    if (language == null) {
      language = this.language;
    }
    ret = (ref2 = this.maps[language]) != null ? ref2[label] : void 0;
    if (!ret) {
      index = language.lastIndexOf('_');
      if (index) {
        parent = language.substring(0, index);
        if (parent) {
          return this.get(label, markIfMissing, args, parent);
        }
      }
    }
    if (!ret) {
      ret = (ref3 = this.maps[this.defaultLanguage]) != null ? ref3[label] : void 0;
    }
    if (!ret) {
      if (markIfMissing) {
        return this.missingPrefix + label + this.missingPostfix;
      } else {
        return label;
      }
    }
    if (Object.keys(args).length === 0) {
      return ret;
    } else {
      return this.replaceParams(ret, args);
    }
  };

  T9n.registerMap = function(language, prefix, dot, map) {
    var key, results, value;
    if (typeof map === 'string') {
      return this.maps[language][prefix] = map;
    } else if (typeof map === 'object') {
      if (dot) {
        prefix = prefix + '.';
      }
      results = [];
      for (key in map) {
        value = map[key];
        results.push(this.registerMap(language, prefix + key, true, value));
      }
      return results;
    }
  };

  T9n.getLanguage = function() {
    var ref;
    if ((ref = this.depLanguage) != null) {
      ref.depend();
    }
    return this.language;
  };

  T9n.getLanguages = function() {
    var ref;
    if ((ref = this.dep) != null) {
      ref.depend();
    }
    return Object.keys(this.maps).sort();
  };

  T9n.getLanguageInfo = function() {
    var i, k, keys, len, ref, results;
    if ((ref = this.dep) != null) {
      ref.depend();
    }
    keys = Object.keys(this.maps).sort();
    results = [];
    for (i = 0, len = keys.length; i < len; i++) {
      k = keys[i];
      results.push({
        name: this.maps[k]['t9Name'],
        code: k
      });
    }
    return results;
  };

  T9n.setLanguage = function(language) {
    var ref;
    if (this.language === language) {
      return;
    }
    language = language.replace(new RegExp('-', 'g'), '_');
    if (!this.maps[language]) {
      if (language.indexOf('_') > 1) {
        return this.setLanguage(language.substring(0, language.lastIndexOf('_')));
      } else {
        throw Error("language " + language + " does not exist");
      }
    }
    this.language = language;
    return (ref = this.depLanguage) != null ? ref.changed() : void 0;
  };

  T9n.replaceParams = function(str, args) {
    var key, re, value;
    for (key in args) {
      value = args[key];
      re = new RegExp("@{" + key + "}", 'g');
      str = str.replace(re, value);
    }
    return str;
  };

  return T9n;

})();

this.T9n = T9n;

this.t9n = function(x, includePrefix, params) {
  return T9n.get(x);
};

if (typeof module !== "undefined" && module !== null) {
  module.exports.T9n = T9n;
}
