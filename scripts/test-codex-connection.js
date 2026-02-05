
import { fetch } from 'bun';

const API_KEY = process.env.VITE_CODEX_API_KEY;
const BASE_URL = 'https://graph.codex.io/graphql';

async function testCodex() {
    console.log('Testing Codex API...');
    console.log('API Key present:', !!API_KEY);

    if (!API_KEY) {
        console.error('Error: VITE_CODEX_API_KEY is missing.');
        return;
    }

    const query = `
    query GetWalletBalances($address: String!, $networkId: Int!) {
      balances(
        input: { walletAddress: $address, networks: [$networkId], includeNative: false, limit: 1 }
      ) {
        items {
          tokenAddress
          balance
        }
      }
    }
  `;

    const variables = {
        address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', // vitalik.eth
        networkId: 1
    };

    // Logic mirroring src/services/api/codex.js
    const headers = {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY
    };

    const isJwt = API_KEY.split('.').length === 3;
    if (isJwt) {
        headers['Authorization'] = `Bearer ${API_KEY}`;
    } else {
        headers['Authorization'] = API_KEY;
    }

    console.log('Headers:', JSON.stringify(headers, null, 2));

    try {
        const start = performance.now();
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers,
            body: JSON.stringify({ query, variables })
        });

        const latency = performance.now() - start;
        console.log(`Status: ${response.status} ${response.statusText}`);
        console.log(`Latency: ${latency.toFixed(2)}ms`);

        const data = await response.json();

        if (data.errors) {
            console.error('GraphQL Errors:', JSON.stringify(data.errors, null, 2));
        } else {
            console.log('Success! Balances found:', data.data?.balances?.items?.length);
        }

    } catch (err) {
        console.error('Fetch Error:', err);
    }
}

testCodex();
