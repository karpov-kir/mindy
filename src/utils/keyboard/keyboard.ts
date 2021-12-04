import { isMac } from '../platform';

type KeyPressCallback = (event: KeyboardEvent) => void;

const globallyPressedKeys = new Map<number, number>();
// We usually use numeric code of a key to outline a physical key we want to use
// but if it's a custom key, then a big tier is a way to separate the logic.
const CUSTOM_KEY_TIER_MODIFIER = 1000000;
let areKeyboardListenersAttached = false;

listenKeyboard(false);

// Values are `event.which || event.keyCode` for the physical keys and
// a number + `CUSTOM_KEY_TIER_MODIFIER` for custom keys.
export enum KEYS {
  backspace = 8,
  tab = 9,
  control = 17,
  escape = 27,
  // Option on MacOS
  alt = 18,
  delete = 46,
  // Command on MacOS
  meta = 91,
  space = 32,
  plus = 187,

  controlOSSpecific = CUSTOM_KEY_TIER_MODIFIER + 17,
}

// If `event` is not passed than the key will be checked
// against globally pressed keys (`globallyPressedKeys`) at the moment.
export const isKeyPressed = (key: KEYS, event?: KeyboardEvent) => {
  let keyCodesToCheck: number[] = [];
  let isPressed = false;

  if (event) {
    const keyCode = event.which || event.keyCode;

    keyCodesToCheck.push(keyCode);
  } else {
    keyCodesToCheck = Array.from(globallyPressedKeys.values());
  }

  for (let i = 0, l = keyCodesToCheck.length; i < l; i++) {
    const keyCode = keyCodesToCheck[i];

    switch (key) {
      case KEYS.controlOSSpecific:
        isPressed = isMac() ? keyCode === KEYS.meta : keyCode === KEYS.control;
        break;
      default:
        isPressed = keyCode === key;
        break;
    }

    if (isPressed) {
      return true;
    }
  }

  return false;
};

const keyDownCallbacks: {
  [key in KEYS]?: KeyPressCallback[];
} = {};

// Todo migrate to Map
const keysDownCallbacks: {
  [key: string]: KeyPressCallback[];
} = {};

const keyUpCallbacks: {
  [key in KEYS]?: KeyPressCallback[];
} = {};

const keyPressCallbacks: {
  [key in KEYS]?: KeyPressCallback[];
} = {};

export const onKeyDown = (key: KEYS, callback: KeyPressCallback) => {
  if (!keyDownCallbacks[key]) {
    keyDownCallbacks[key] = [];
  }

  keyDownCallbacks[key]!.push(callback);
};

export const onKeysDown = (_keys: KEYS[], callback: KeyPressCallback) => {
  const keysToken = [..._keys].sort().join('-');

  if (!keysDownCallbacks[keysToken]) {
    keysDownCallbacks[keysToken] = [];
  }

  keysDownCallbacks[keysToken]!.push(callback);
};

export const onKeyUp = (key: KEYS, callback: KeyPressCallback) => {
  if (!keyUpCallbacks[key]) {
    keyUpCallbacks[key] = [];
  }

  keyUpCallbacks[key]!.push(callback);
};

export const onKeyPressed = (key: KEYS, callback: KeyPressCallback) => {
  if (!keyPressCallbacks[key]) {
    keyPressCallbacks[key] = [];
  }

  keyPressCallbacks[key]!.push(callback);
};

function listenKeyboard(debug = false) {
  if (areKeyboardListenersAttached) {
    return;
  }

  areKeyboardListenersAttached = true;

  document.addEventListener('keydown', function (event) {
    const keyCode = event.which || event.keyCode;

    globallyPressedKeys.set(keyCode, keyCode);

    if (debug) {
      console.log('Key down', keyCode, getKeyName(keyCode), globallyPressedKeys);
    }

    if (keyDownCallbacks[keyCode]) {
      keyDownCallbacks[keyCode]!.forEach((callback) => callback(event));
    }

    for (const token in keysDownCallbacks) {
      const callbacks = keysDownCallbacks[token];
      const keys = token.split('-');
      let shouldFire = true;

      for (let i = 0, l = keys.length; i < l; i++) {
        const key = parseInt(keys[i], 10);

        if (!globallyPressedKeys.has(key)) {
          shouldFire = false;
          break;
        }
      }

      if (shouldFire) {
        callbacks.forEach((callback) => {
          callback(event);
        });
      }
    }
  });

  document.addEventListener('keyup', function (event) {
    const keyCode = event.which || event.keyCode;

    globallyPressedKeys.delete(keyCode);

    if (debug) {
      console.log('Key up', keyCode, getKeyName(keyCode), globallyPressedKeys);
    }

    if (keyUpCallbacks[keyCode]) {
      keyUpCallbacks[keyCode]!.forEach((callback) => callback(event));
    }

    if (keyPressCallbacks[keyCode]) {
      keyPressCallbacks[keyCode]!.forEach((callback) => callback(event));
    }
  });

  // Only for debug purposes
  function getKeyName(keyCode: unknown) {
    return Object.entries(KEYS).find(([enumKeyCode]) => parseInt(enumKeyCode, 10) === keyCode)?.[1];
  }
}
