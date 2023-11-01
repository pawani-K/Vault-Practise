const rootKey = "myroot";
const unsealKey = "FzNYQwyJlBFg21zsD77rNW0GiFLNTWi+/XOoJS8ZiSI=";

const options = {
  apiVersion: "v1", // Use "v1" for Vault version 1.x
  endpoint: "http://127.0.0.1:8200",
  token: rootKey,
};

const vault = require("node-vault")(options);

const axios = require("axios");

const vaultAddress = "http://127.0.0.1:8200"; // Update with your Vault address
const vaultToken = rootKey; // Replace with your root token
const secretsEnginePath = "myapp"; // Update with your desired path

const enableSecretsEngine = async () => {
  try {
    const response = await axios.post(
      `${vaultAddress}/v1/sys/mounts/${secretsEnginePath}`,
      {
        type: "kv",
        options: { version: 2 },
      },
      {
        headers: {
          "X-Vault-Token": vaultToken,
        },
      }
    );

    if (response.status === 204) {
      console.log(
        `Secrets engine '${secretsEnginePath}' enabled successfully.`
      );
    } else {
      console.error("Failed to enable secrets engine:", response.data);
    }
  } catch (error) {
    console.error("Error enabling secrets engine:", error.message);
  }
};

// enableSecretsEngine();

async function initializeAndUnseal() {
  try {
    // Unseal Vault with the provided unseal key
    await vault.unseal({ key: unsealKey });
    console.log("Vault unsealed successfully");

    // Create a secret in KV version 2
    const secretPath = "secret/myapp";
    const secretData = { username: "admin", password: "supersecret" };
    await vault.write(`${secretPath}/data`, secretData);
    console.log("Secret created successfully");

    // Read the secret from the KV version 2 path
    const readResult = await vault.read(`${secretPath}/data`);
    console.log("Read Secret:", readResult.data);
  } catch (error) {
    console.error("Error:", error);
  }
}

initializeAndUnseal();
