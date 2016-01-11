# To do list

## Login
### Front end
* Log in
* Sign up
* Forgot password
* Reset password page

### Back end
* Validate login info
* Add new user to DB
* Send reset password link to email

## Main menu
### Front end
* New game
    * With friend
    * With random
* Games in progress
    * Load
    * Abandon
* Stats
    * Win/Loss/Played
    * Story tree
* Friend list
    * Add
    * Remove
    * Online status
    * View stats
    * Chat
* Settings
    * Change password
    * Change email

### Back end
* New game
    * Searching pool
    * Send request to user
* Games in progress
    * Resume from DB
    * Remove from DB
* Stats
    * Read from DB
* Friends
    * Send request
    * Remove link
    * Is online
    * View stats
* Settings
    * Update settings

## Story
### Front end
* Dialog
    * Display on screen

### Back end
* Store and parse dialog
* Story path
    * Win/Loss
    * Which side you're on (??)

## Planning phase
### Front end
* Spending
    * Character points
        * New characters (?)
        * Stats
        * Skills (?)
    * Money
        * Equipment
            * Armour (?)
            * Weapon
        * Consumable
            * Heal
            * Boost (?)
    * Undo this visit to shop's spending only
* Equip items to characters
* Done button

### Back end
* Spending
    * Record transactions
* Record equipped things

## Gameplay
### Front end
* Terrain types

#### Planning phase
* Choose units to bring
    * Arrange units within given space
* View map
    * Hide enemies start locations
* Done button
* Wait for other player

#### Fighting phase
* Turns
    * Your turn
    * Move units (Once per character turn)
        * Range indicator
    * Take action (Once per character per turn)
        * Attack
        * (Trade and) use Item
    * Enemy turn
        * Show actions as they come
* Fight animation
* Fog of war
* End turn button

### Back end
* Maps
    * Layout
    * Story order

#### Planning phase
* Record arrangement
* Notify readiness

#### Fighting phase
* Receive/send actions as they are made
    * Move validation
    * Damage calculation
* Switch turns
* Store game state
    * Winner detection

## Results
### Front end
* Show stats
    * Winner/Loser
    * Turns
    * Units lost per side
    * EXP/Money awarded
* Final results (end of game)
* Continue button

### Back end
* Award EXP/Money

## Chat client
### Front end
* Show chat overlay
* Receive input

### Back end
* Send messages
* Store messages
* Return message history
* Censor (??)
* Group chat rooms

## Database
* Users
    * Personal info
    * Stats
    * Online status
    * Friends
        * Chat history
* Games in progress