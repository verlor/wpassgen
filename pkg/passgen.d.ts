/* tslint:disable */
/* eslint-disable */
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
 */
export function generate_passphrase(settings: any): string;

export type InitInput =
  | RequestInfo
  | URL
  | Response
  | BufferSource
  | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly generate_passphrase: (a: any) => [number, number, number, number];
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (
    a: number,
    b: number,
    c: number,
    d: number,
  ) => number;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __externref_table_alloc: () => number;
  readonly __wbindgen_export_4: WebAssembly.Table;
  readonly __externref_table_dealloc: (a: number) => void;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(
  module: { module: SyncInitInput } | SyncInitInput,
): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init(
  module_or_path?:
    | { module_or_path: InitInput | Promise<InitInput> }
    | InitInput
    | Promise<InitInput>,
): Promise<InitOutput>;
