import * as SecureStore from "expo-secure-store";

const options = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

export async function readSecureSession(key) {
  const raw = await SecureStore.getItemAsync(key, options);
  return raw ? JSON.parse(raw) : null;
}

export async function writeSecureSession(key, value) {
  if (!value) {
    await SecureStore.deleteItemAsync(key, options);
    return;
  }

  await SecureStore.setItemAsync(key, JSON.stringify(value), options);
}
