# Individual Item Identifier

In the original version of the game, stacked items were treated as a single entity without any individual identifiers. However, in modern games, stacked items are assigned a unique identifier that enables better tracking and management.

Each stacked item now receives a unique identifier that allows it to be identified, even when it's part of a larger stack. This allows the game to keep track of individual items, including their creation date, modification history, and ownership.

# Trading Stackable Items

When trading stackable items, the game uses the creation date timestamp to select the individual items to trade. For example, if a player has five copies of a particular item in their inventory, each with a different creation date, the game will select the newest item first `(this may change in future)` when the player initiates a trade.