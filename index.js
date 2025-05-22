import init, { generate_passphrase } from "./pkg/passgen.js";

const loadWasm = async () => {
  await init({
    module_path: "./pkg/passgen_bg.wasm"  ,
  });
};

loadWasm();

// Utility: Show toast
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.remove("hidden", "opacity-0");
  toast.classList.add("opacity-100");

  setTimeout(() => {
    toast.classList.add("opacity-0");
    setTimeout(() => toast.classList.add("hidden"), 300);
  }, 2000);
}

// Copy to clipboard
document.getElementById("copyBtn").addEventListener("click", () => {
  const password = document.getElementById("password").value;
  if (!password.trim()) return;

  navigator.clipboard
    .writeText(password)
    .then(() => showToast("✅ Password copied!"))
    .catch(() => showToast("⚠️ Failed to copy"));
});

// Clear password
document.getElementById("clearBtn").addEventListener("click", () => {
  document.getElementById("password").value = "";
  showToast("🗑️ Password cleared");
});

document.getElementById("generateBtn").addEventListener("click", () => {
  const password = generate_passphrase({
    num_words: 3,
    replace_vowels: document.getElementById("replaceVowels").checked,
    uppercase: document.getElementById("uppercase").checked,
    special_chars: document.getElementById("symbols").checked,
    random_chars: document.getElementById("randomChars").checked,
  });
  document.getElementById("password").value = password;
});
