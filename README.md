Eclipse board game battle simulator

In the Eclipse board game an important aspect of the game is players battling ships that they have built and upgraded.  Because ship parts have different costs (both in research and energy requirements) and determining the odds of success isn't always the easiest this battle simulator was created to help guild the purchase and equipping of ships.

Currently this battle simulator will generate all of the possible ship permutations of one type of ship and battle them against a defined enemy (Ancient Ship, Galactic Center Defense System, etc) X times to generate an win percentage.

For example if you are fighting a single interceptor against a single alien the following is the best ship.
At most 1 research upgrade and at most spending 10 research
    ~37% Upgrades: 2 Cost:6 Research:1 boxes:PLASMA CANNON, nuclear source, nuclear drive, HULL, influence_2
At most 2 research upgrade and at most spending 10 research
    ~44% Upgrades: 2 Cost:10 Research:2 boxes:PLASMA CANNON, nuclear source, nuclear drive, IMPROVED HULL, influence_2


To run the eclipse battle simulator visit http://anubiann00b.github.com/eclipse-battle-simulator using Google Chrome and do the following steps:

1) Pull up inspector, by right clicking on the screen and selecting 'Inspect Element'
2) Goto the console tab
3) run
    $ test_ship(cruiser);

It will output an object containing all of the battles so you can look through the winning results to get a feel for what combos work best.

test_ship takes as an argument a stock ship (interceptor, cruiser, dreadnought) which is used to generate the ship combinations.  The convenience function test_interceptor(), etc also exists.


Global variables you can set:

max_cost     - Max price willing to pay for a ship part
max_research - Maximum allowed research upgrades a ship can have

max_ships    - When battling battle this number of ships against the offense (defaults to 1)
max_tries    - The number of battles to run to determine the % of win's
offense      - The opposing team, by default it is [ancient], but it can be set to anything, such as [ancient, ancient] or [gcds]

all_ships_must_survive - True by default this says that you only 'win' a battle if you have no losses.  Useful for comparing for example the different class sizes against each other. Set to false if you want to get the results for any outcome that would cause a win.  This option only matters if max_ships is greater than 1.

To disable a specific part (For example if it hasn't been drawn in your game yet or you just don't want it to be included) set the available flag to false in the parts listing.

    $ parts['plasm missile'].available = false;


Frontend:
Currently this is simply a console based application and satisfied my curiosity into the problem, but as it is just a webpage a nice frontend could certainly be incorporated.  A simple UI showing off all of the parts (letting you enable/disable them) and a way to select which ships are battling or even to construct ships on the fly in an interface that fits on a phone or ipad would definitely make for something to play around with while waiting for your turn.  If you create a frontend submit a pull request and I will incorporate it into this project.
