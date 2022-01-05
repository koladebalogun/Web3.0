//to shorten the address being displayed from the current account
export const shortenAddress = (address) => `${address.slice(0,5)}....${address.slice(address.length - 4)}`