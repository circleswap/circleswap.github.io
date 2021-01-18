# CircleSwap Interface

- Website: [circleswap.org](https://circleswap.org/)
- Twitter: [@circleswap](https://twitter.com/circleswap)
- Email: [contact@uniswap.org](mailto:circleswap.finance@gmail.com)
- Telegram: [@circleswap](https://t.me/circleswap)
- Medium: [@circleswap](https://medium.com/@circleswap)

## Accessing the CircleSwap Interface

visit [circleswap.org](https://circleswap.org).


## Development

### Install Dependencies

```bash
yarn
```

### Run

```bash
yarn start
```

### Configuring the environment (optional)

To have the interface default to a different network when a wallet is not connected:

1. Make a copy of `.env` named `.env.local`
2. Change `REACT_APP_NETWORK_ID` to `"{YOUR_NETWORK_ID}"`
3. Change `REACT_APP_NETWORK_URL` to e.g. `"https://{YOUR_NETWORK_ID}.infura.io/v3/{YOUR_INFURA_KEY}"` 

Note that the interface only works on testnets where both 
[CircleSwap](https://scan.hecochain.com/address/0xF08b8c2233CD3B3932FAeC73F4303CcE8B00198c#contracts) and 
[multicall](https://github.com/makerdao/multicall) are deployed.
The interface will not work on other networks.

## Contributions

**Please open all pull requests against the `master` branch.** 
CI checks will run against all PRs.

