# Gashapon

[Gashapon](https://en.wikipedia.org/wiki/Gashapon) (ガシャポン) are toys that are dispensed from vending machine in a plastic capsule.

![Gashapon](/public/images/Gachapon.jpg)

This project enables artists to create an NFT vending machine that dispenses generative art. In order to generate an NFT, a proof-of-work puzzle must be solved. The more work you do, the more 'rare' the generated NFT is. We also added a unique economic twist.

## Generative Art
We considered implementing a few different types of generative art:

### Snowflakes
Inpired by Vivian Wu's [snowflake generator](https://viviariums.com/projects/snowflake/), we considered building an NFT generator for animated snowflakes. With about 64 bits of entropy, we can create a large number of beautifully animated snowflakes, each of them unique.

![Snowflake Generator](/public/images/growth.gif)

### Royal Titles
We considered generating royal titles and a corresponding coat-of-arms. The titles are based on real historic titles and ones from fictional worlds. So you might end up buying a title like "The Guardian of York" or "Duke of Nogrod". Coats-of-arms would be generated from common elements typical of coats-of-arms with a randomized color scheme.

### MoonOwls
Inspired by [Moon Cat Rescue](https://mooncatrescue.com/), we decided to create a Moon Owl generator. As part of the system, we also built a template generator so that other artist could create their own variation of cute, pixelated characters that can be randomized and set up a vending machine to dispense them.

## The Economics

### Rarity
Like MoonCats you have to mine for MoonOwls. What's different is that the longer you mine, the higher the 'level' of the MoonOwl you will get. We built a miner where you can specify the minimum rarity of the MoonOwl you want to buy. The more rare, the longer you have to mine. It doesn't cost any more to buy a rarer MoonOwl you just have to be willing to wait more than a minute or two to mine it. If you wait hours or days, you will find extremely rare MoonOwls. But if you wait too long to buy, you might lose the opportunity to buy it at at today's price (see Escalating Price).

### Escalating Price
The price of each new MoonOwl is higher than the price of the last MoonOwl. The price starts at a fairly low amount (say .001 Ether). Each additional MoonOwl costs a set percentage more that the last one that was sold, the price rises exponentially. The longer you wait to to buy one, the more you will have to pay.

### Burn baby burn
If you own a sick MoonOwl, YOU can cash in on Raribles, or SuperRare, or maybe wrap it in an NFTX index fund, sell shares in it through NIFTEX, rent it to Decentraland Art Gallery, or just proudly display it on your ENS powered website.

On the other hand, if the MoonOwl that you got isn't one of crème de la crème that fetch top dollar, you can still show off your one-of-a-kind, cute little moon owl...or you can burn it and get a percentage of the last price that was last paid for a MoonOwl from the vending machine. So say you bought yours for .001 Ether and a few hundred have been sold since then. Maybe the last one that sold went for 0.1 Ether. You can choose to burn your MoonOwl and collect 0.09 ether, netting a 90x profit!

As new MoonOwls are minted, the price goes up. As MoonOwls are burned, the price goes down.

### Revenue Share
Minting charges are split between reserves to pay out for burned NFTs and the owner/artist. The percentage are set when the vending machine contract is set up.

## TODO
- [x] Build PoW miner
- [x] Build pixel editor
- [x] Contract factory
- [ ] Contract facory UI
- [ ] NFT minter
- [x] Escalating price
- [ ] Burn to earn
- [ ] Website animations
- [ ] Deploy to Rinkeby
- [ ] Deploy to mainnet
