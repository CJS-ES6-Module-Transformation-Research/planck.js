import { World as Serializer_World } from "./World";

var toJson = function(world) {
  return JSON.stringify(world._serialize(), function(key, value) {
    if (typeof value === 'object') {
      if (value !== null) {
        if (typeof value._serialize === 'function') {
          value = value._serialize();
        }
      }
    }
    return value;
  }, '  ');
};

export { toJson };;

var fromJson = function(string) {
  return Worldjs__deserialize(JSON.parse(string));
};

export { fromJson };;
