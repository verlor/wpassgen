let wasm;

let WASM_VECTOR_LEN = 0;

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
  if (
    cachedUint8ArrayMemory0 === null ||
    cachedUint8ArrayMemory0.byteLength === 0
  ) {
    cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachedUint8ArrayMemory0;
}

const cachedTextEncoder =
  typeof TextEncoder !== "undefined"
    ? new TextEncoder("utf-8")
    : {
        encode: () => {
          throw Error("TextEncoder not available");
        },
      };

const encodeString =
  typeof cachedTextEncoder.encodeInto === "function"
    ? function (arg, view) {
        return cachedTextEncoder.encodeInto(arg, view);
      }
    : function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
          read: arg.length,
          written: buf.length,
        };
      };

function passStringToWasm0(arg, malloc, realloc) {
  if (realloc === undefined) {
    const buf = cachedTextEncoder.encode(arg);
    const ptr = malloc(buf.length, 1) >>> 0;
    getUint8ArrayMemory0()
      .subarray(ptr, ptr + buf.length)
      .set(buf);
    WASM_VECTOR_LEN = buf.length;
    return ptr;
  }

  let len = arg.length;
  let ptr = malloc(len, 1) >>> 0;

  const mem = getUint8ArrayMemory0();

  let offset = 0;

  for (; offset < len; offset++) {
    const code = arg.charCodeAt(offset);
    if (code > 0x7f) break;
    mem[ptr + offset] = code;
  }

  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset);
    }
    ptr = realloc(ptr, len, (len = offset + arg.length * 3), 1) >>> 0;
    const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
    const ret = encodeString(arg, view);

    offset += ret.written;
    ptr = realloc(ptr, len, offset, 1) >>> 0;
  }

  WASM_VECTOR_LEN = offset;
  return ptr;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
  if (
    cachedDataViewMemory0 === null ||
    cachedDataViewMemory0.buffer.detached === true ||
    (cachedDataViewMemory0.buffer.detached === undefined &&
      cachedDataViewMemory0.buffer !== wasm.memory.buffer)
  ) {
    cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
  }
  return cachedDataViewMemory0;
}

function addToExternrefTable0(obj) {
  const idx = wasm.__externref_table_alloc();
  wasm.__wbindgen_export_4.set(idx, obj);
  return idx;
}

function handleError(f, args) {
  try {
    return f.apply(this, args);
  } catch (e) {
    const idx = addToExternrefTable0(e);
    wasm.__wbindgen_exn_store(idx);
  }
}

const cachedTextDecoder =
  typeof TextDecoder !== "undefined"
    ? new TextDecoder("utf-8", { ignoreBOM: true, fatal: true })
    : {
        decode: () => {
          throw Error("TextDecoder not available");
        },
      };

if (typeof TextDecoder !== "undefined") {
  cachedTextDecoder.decode();
}

function getStringFromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return cachedTextDecoder.decode(
    getUint8ArrayMemory0().subarray(ptr, ptr + len),
  );
}

function isLikeNone(x) {
  return x === undefined || x === null;
}

function debugString(val) {
  // primitive types
  const type = typeof val;
  if (type == "number" || type == "boolean" || val == null) {
    return `${val}`;
  }
  if (type == "string") {
    return `"${val}"`;
  }
  if (type == "symbol") {
    const description = val.description;
    if (description == null) {
      return "Symbol";
    } else {
      return `Symbol(${description})`;
    }
  }
  if (type == "function") {
    const name = val.name;
    if (typeof name == "string" && name.length > 0) {
      return `Function(${name})`;
    } else {
      return "Function";
    }
  }
  // objects
  if (Array.isArray(val)) {
    const length = val.length;
    let debug = "[";
    if (length > 0) {
      debug += debugString(val[0]);
    }
    for (let i = 1; i < length; i++) {
      debug += ", " + debugString(val[i]);
    }
    debug += "]";
    return debug;
  }
  // Test for built-in
  const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
  let className;
  if (builtInMatches && builtInMatches.length > 1) {
    className = builtInMatches[1];
  } else {
    // Failed to match the standard '[object ClassName]'
    return toString.call(val);
  }
  if (className == "Object") {
    // we're a user defined class or Object
    // JSON.stringify avoids problems with cycles, and is generally much
    // easier than looping through ownProperties of `val`.
    try {
      return "Object(" + JSON.stringify(val) + ")";
    } catch (_) {
      return "Object";
    }
  }
  // errors
  if (val instanceof Error) {
    return `${val.name}: ${val.message}\n${val.stack}`;
  }
  // TODO we could test for more things here, like `Set`s and `Map`s.
  return className;
}

function takeFromExternrefTable0(idx) {
  const value = wasm.__wbindgen_export_4.get(idx);
  wasm.__externref_table_dealloc(idx);
  return value;
}
/**
 * Generates a passphrase based on the provided settings.
 *
 * @param {Object} settings - The settings object for generating the passphrase
 * @param {number} settings.num_words - Number of words in the passphrase (default: 3)
 * @param {boolean} settings.replace_vowels - Whether to replace vowels with numbers (default: false)
 * @param {boolean} settings.uppercase - Whether to use uppercase letters (default: false)
 * @param {boolean} settings.special_chars - Whether to add special characters (default: false)
 * @param {string} settings.special_charset - Special characters to use (default: "#$&*_?!1234567890")
 * @param {boolean} settings.random_chars - Whether to use random characters instead of the passphrase (default: false)
 * @returns {Promise<string>} A promise that resolves to the generated passphrase
 * @throws {Error} If the settings object is invalid
 * @example
 * ```js
 * const passphrase = await generate_passphrase({
 *   num_words: 3,
 *   replace_vowels: true,
 *   uppercase: true
 * });
 * ```
 * @see {@link https://github.com/your-repo/passgen|Project Documentation}
 * @param {any} settings
 * @returns {string}
 */
export function generate_passphrase(settings) {
  let deferred2_0;
  let deferred2_1;
  try {
    const ret = wasm.generate_passphrase(settings);
    var ptr1 = ret[0];
    var len1 = ret[1];
    if (ret[3]) {
      ptr1 = 0;
      len1 = 0;
      throw takeFromExternrefTable0(ret[2]);
    }
    deferred2_0 = ptr1;
    deferred2_1 = len1;
    return getStringFromWasm0(ptr1, len1);
  } finally {
    wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
  }
}

async function __wbg_load(module, imports) {
  if (typeof Response === "function" && module instanceof Response) {
    if (typeof WebAssembly.instantiateStreaming === "function") {
      try {
        return await WebAssembly.instantiateStreaming(module, imports);
      } catch (e) {
        if (module.headers.get("Content-Type") != "application/wasm") {
          console.warn(
            "`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n",
            e,
          );
        } else {
          throw e;
        }
      }
    }

    const bytes = await module.arrayBuffer();
    return await WebAssembly.instantiate(bytes, imports);
  } else {
    const instance = await WebAssembly.instantiate(module, imports);

    if (instance instanceof WebAssembly.Instance) {
      return { instance, module };
    } else {
      return instance;
    }
  }
}

function __wbg_get_imports() {
  const imports = {};
  imports.wbg = {};
  imports.wbg.__wbg_String_8f0eb39a4a4c2f66 = function (arg0, arg1) {
    const ret = String(arg1);
    const ptr1 = passStringToWasm0(
      ret,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
  };
  imports.wbg.__wbg_buffer_609cc3eee51ed158 = function (arg0) {
    const ret = arg0.buffer;
    return ret;
  };
  imports.wbg.__wbg_call_672a4d21634d4a24 = function () {
    return handleError(function (arg0, arg1) {
      const ret = arg0.call(arg1);
      return ret;
    }, arguments);
  };
  imports.wbg.__wbg_call_7cccdd69e0791ae2 = function () {
    return handleError(function (arg0, arg1, arg2) {
      const ret = arg0.call(arg1, arg2);
      return ret;
    }, arguments);
  };
  imports.wbg.__wbg_crypto_ed58b8e10a292839 = function (arg0) {
    const ret = arg0.crypto;
    return ret;
  };
  imports.wbg.__wbg_getRandomValues_bcb4912f16000dc4 = function () {
    return handleError(function (arg0, arg1) {
      arg0.getRandomValues(arg1);
    }, arguments);
  };
  imports.wbg.__wbg_getwithrefkey_1dc361bd10053bfe = function (arg0, arg1) {
    const ret = arg0[arg1];
    return ret;
  };
  imports.wbg.__wbg_instanceof_ArrayBuffer_e14585432e3737fc = function (arg0) {
    let result;
    try {
      result = arg0 instanceof ArrayBuffer;
    } catch (_) {
      result = false;
    }
    const ret = result;
    return ret;
  };
  imports.wbg.__wbg_instanceof_Uint8Array_17156bcf118086a9 = function (arg0) {
    let result;
    try {
      result = arg0 instanceof Uint8Array;
    } catch (_) {
      result = false;
    }
    const ret = result;
    return ret;
  };
  imports.wbg.__wbg_isSafeInteger_343e2beeeece1bb0 = function (arg0) {
    const ret = Number.isSafeInteger(arg0);
    return ret;
  };
  imports.wbg.__wbg_length_a446193dc22c12f8 = function (arg0) {
    const ret = arg0.length;
    return ret;
  };
  imports.wbg.__wbg_msCrypto_0a36e2ec3a343d26 = function (arg0) {
    const ret = arg0.msCrypto;
    return ret;
  };
  imports.wbg.__wbg_new_a12002a7f91c75be = function (arg0) {
    const ret = new Uint8Array(arg0);
    return ret;
  };
  imports.wbg.__wbg_newnoargs_105ed471475aaf50 = function (arg0, arg1) {
    const ret = new Function(getStringFromWasm0(arg0, arg1));
    return ret;
  };
  imports.wbg.__wbg_newwithbyteoffsetandlength_d97e637ebe145a9a = function (
    arg0,
    arg1,
    arg2,
  ) {
    const ret = new Uint8Array(arg0, arg1 >>> 0, arg2 >>> 0);
    return ret;
  };
  imports.wbg.__wbg_newwithlength_a381634e90c276d4 = function (arg0) {
    const ret = new Uint8Array(arg0 >>> 0);
    return ret;
  };
  imports.wbg.__wbg_node_02999533c4ea02e3 = function (arg0) {
    const ret = arg0.node;
    return ret;
  };
  imports.wbg.__wbg_process_5c1d670bc53614b8 = function (arg0) {
    const ret = arg0.process;
    return ret;
  };
  imports.wbg.__wbg_randomFillSync_ab2cfe79ebbf2740 = function () {
    return handleError(function (arg0, arg1) {
      arg0.randomFillSync(arg1);
    }, arguments);
  };
  imports.wbg.__wbg_require_79b1e9274cde3c87 = function () {
    return handleError(function () {
      const ret = module.require;
      return ret;
    }, arguments);
  };
  imports.wbg.__wbg_set_65595bdd868b3009 = function (arg0, arg1, arg2) {
    arg0.set(arg1, arg2 >>> 0);
  };
  imports.wbg.__wbg_static_accessor_GLOBAL_88a902d13a557d07 = function () {
    const ret = typeof global === "undefined" ? null : global;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
  };
  imports.wbg.__wbg_static_accessor_GLOBAL_THIS_56578be7e9f832b0 = function () {
    const ret = typeof globalThis === "undefined" ? null : globalThis;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
  };
  imports.wbg.__wbg_static_accessor_SELF_37c5d418e4bf5819 = function () {
    const ret = typeof self === "undefined" ? null : self;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
  };
  imports.wbg.__wbg_static_accessor_WINDOW_5de37043a91a9c40 = function () {
    const ret = typeof window === "undefined" ? null : window;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
  };
  imports.wbg.__wbg_subarray_aa9065fa9dc5df96 = function (arg0, arg1, arg2) {
    const ret = arg0.subarray(arg1 >>> 0, arg2 >>> 0);
    return ret;
  };
  imports.wbg.__wbg_versions_c71aa1626a93e0a1 = function (arg0) {
    const ret = arg0.versions;
    return ret;
  };
  imports.wbg.__wbindgen_as_number = function (arg0) {
    const ret = +arg0;
    return ret;
  };
  imports.wbg.__wbindgen_bigint_from_u64 = function (arg0) {
    const ret = BigInt.asUintN(64, arg0);
    return ret;
  };
  imports.wbg.__wbindgen_bigint_get_as_i64 = function (arg0, arg1) {
    const v = arg1;
    const ret = typeof v === "bigint" ? v : undefined;
    getDataViewMemory0().setBigInt64(
      arg0 + 8 * 1,
      isLikeNone(ret) ? BigInt(0) : ret,
      true,
    );
    getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
  };
  imports.wbg.__wbindgen_boolean_get = function (arg0) {
    const v = arg0;
    const ret = typeof v === "boolean" ? (v ? 1 : 0) : 2;
    return ret;
  };
  imports.wbg.__wbindgen_debug_string = function (arg0, arg1) {
    const ret = debugString(arg1);
    const ptr1 = passStringToWasm0(
      ret,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
  };
  imports.wbg.__wbindgen_error_new = function (arg0, arg1) {
    const ret = new Error(getStringFromWasm0(arg0, arg1));
    return ret;
  };
  imports.wbg.__wbindgen_in = function (arg0, arg1) {
    const ret = arg0 in arg1;
    return ret;
  };
  imports.wbg.__wbindgen_init_externref_table = function () {
    const table = wasm.__wbindgen_export_4;
    const offset = table.grow(4);
    table.set(0, undefined);
    table.set(offset + 0, undefined);
    table.set(offset + 1, null);
    table.set(offset + 2, true);
    table.set(offset + 3, false);
  };
  imports.wbg.__wbindgen_is_bigint = function (arg0) {
    const ret = typeof arg0 === "bigint";
    return ret;
  };
  imports.wbg.__wbindgen_is_function = function (arg0) {
    const ret = typeof arg0 === "function";
    return ret;
  };
  imports.wbg.__wbindgen_is_object = function (arg0) {
    const val = arg0;
    const ret = typeof val === "object" && val !== null;
    return ret;
  };
  imports.wbg.__wbindgen_is_string = function (arg0) {
    const ret = typeof arg0 === "string";
    return ret;
  };
  imports.wbg.__wbindgen_is_undefined = function (arg0) {
    const ret = arg0 === undefined;
    return ret;
  };
  imports.wbg.__wbindgen_jsval_eq = function (arg0, arg1) {
    const ret = arg0 === arg1;
    return ret;
  };
  imports.wbg.__wbindgen_jsval_loose_eq = function (arg0, arg1) {
    const ret = arg0 == arg1;
    return ret;
  };
  imports.wbg.__wbindgen_memory = function () {
    const ret = wasm.memory;
    return ret;
  };
  imports.wbg.__wbindgen_number_get = function (arg0, arg1) {
    const obj = arg1;
    const ret = typeof obj === "number" ? obj : undefined;
    getDataViewMemory0().setFloat64(
      arg0 + 8 * 1,
      isLikeNone(ret) ? 0 : ret,
      true,
    );
    getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
  };
  imports.wbg.__wbindgen_string_get = function (arg0, arg1) {
    const obj = arg1;
    const ret = typeof obj === "string" ? obj : undefined;
    var ptr1 = isLikeNone(ret)
      ? 0
      : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
  };
  imports.wbg.__wbindgen_string_new = function (arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1);
    return ret;
  };
  imports.wbg.__wbindgen_throw = function (arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
  };

  return imports;
}

function __wbg_init_memory(imports, memory) {}

function __wbg_finalize_init(instance, module) {
  wasm = instance.exports;
  __wbg_init.__wbindgen_wasm_module = module;
  cachedDataViewMemory0 = null;
  cachedUint8ArrayMemory0 = null;

  wasm.__wbindgen_start();
  return wasm;
}

function initSync(module) {
  if (wasm !== undefined) return wasm;

  if (typeof module !== "undefined") {
    if (Object.getPrototypeOf(module) === Object.prototype) {
      ({ module } = module);
    } else {
      console.warn(
        "using deprecated parameters for `initSync()`; pass a single object instead",
      );
    }
  }

  const imports = __wbg_get_imports();

  __wbg_init_memory(imports);

  if (!(module instanceof WebAssembly.Module)) {
    module = new WebAssembly.Module(module);
  }

  const instance = new WebAssembly.Instance(module, imports);

  return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
  if (wasm !== undefined) return wasm;

  if (typeof module_or_path !== "undefined") {
    if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
      ({ module_or_path } = module_or_path);
    } else {
      console.warn(
        "using deprecated parameters for the initialization function; pass a single object instead",
      );
    }
  }

  if (typeof module_or_path === "undefined") {
    module_or_path = new URL("passgen_bg.wasm", import.meta.url);
  }
  const imports = __wbg_get_imports();

  if (
    typeof module_or_path === "string" ||
    (typeof Request === "function" && module_or_path instanceof Request) ||
    (typeof URL === "function" && module_or_path instanceof URL)
  ) {
    module_or_path = fetch(module_or_path);
  }

  __wbg_init_memory(imports);

  const { instance, module } = await __wbg_load(await module_or_path, imports);

  return __wbg_finalize_init(instance, module);
}

export { initSync };
export default __wbg_init;
