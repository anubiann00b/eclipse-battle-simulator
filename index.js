'use strict';

var parts = {};
parts['ion cannon'] = {
    dice: 1,
    damage: 1,
    energy: -1
};
parts['plasma cannon'] = {
    dice: 1,
    damage: 2,
    energy: -2,
    cost_max: 6,
    cost_min: 4
};
parts['antimatter cannon'] = {
    dice: 1,
    damage: 4,
    energy: -4,
    cost_max: 14,
    cost_min: 7
};
parts['plasma missile'] = {
    dice: 2,
    damage: 2,
    cost_max: 14,
    cost_min: 7,
    shoot_once: true
};

parts['electron computer'] = {
    computer: 1
};
parts['positron computer'] = {
    computer: 2,
    influence: 1,
    energy: -1,
    cost_max: 8,
    cost_min: 5
};
parts['gluon computer'] = {
    computer: 3,
    influence: 2,
    energy: -2,
    cost_max: 16,
    cost_min: 8
};

parts['nuclear source'] = {
    energy: 3
};
parts['fusion source'] = {
    energy: 6,
    cost_max: 6,
    cost_min: 4
};
parts['tachyon source'] = {
    energy: 9,
    cost_max: 12,
    cost_min: 6
};

parts['nuclear drive'] = {
    energy: -1,
    influence: 1,
    speed: 1
};
parts['fusion drive'] = {
    energy: -2,
    influence: 2,
    cost_max: 4,
    cost_min: 3,
    speed: 2
};
parts['tachyon drive'] = {
    energy: -3,
    influence: 3,
    cost_max: 12,
    cost_min: 6,
    speed: 3
};

parts['hull'] = {
    hull: 1
};
parts['improved hull'] = {
    hull: 2,
    cost_max: 4,
    cost_min: 3
};
parts['gauss shield'] = {
    shield: 1,
    cost_max: 2,
    cost_min: 2
};
parts['phase shield'] = {
    shield: 2,
    energy: -1,
    cost_max: 8,
    cost_min: 5
};

parts['influence_1'] = {
    influence: 1,
    upgradeable: false
};
parts['influence_2'] = {
    influence: 2,
    upgradeable: false
};
parts['influence_3'] = {
    influence: 2,
    upgradeable: false
};
parts['influence_4'] = {
    influence: 2,
    upgradeable: false
};

// Include the object name inside the object
// for when we output the results
for (var n in parts) {
    parts[n]['name'] = n;
}


var ancient = [];
ancient.push(parts['ion cannon']);
ancient.push(parts['ion cannon']);
ancient.push(parts['electron computer']);
ancient.push(parts['hull']);
ancient.push(parts['influence_2']);
// technically not on the board, but not a valid ship without
ancient.push(parts['nuclear drive']);
ancient.push(parts['nuclear source']);

var gcds = [];
gcds.push(parts['ion cannon']);
gcds.push(parts['ion cannon']);
gcds.push(parts['ion cannon']);
gcds.push(parts['ion cannon']);
gcds.push(parts['electron computer']);
gcds.push(parts['hull']);
gcds.push(parts['hull']);
gcds.push(parts['hull']);
gcds.push(parts['hull']);
gcds.push(parts['hull']);
gcds.push(parts['hull']);
gcds.push(parts['hull']);
// technically not on the board, but not a valid ship without
gcds.push(parts['nuclear drive']);
gcds.push(parts['fusion source']);

// The following are the stock human ships
// Modify them as needed for the stock alien ships

var interceptor = [];
interceptor.push({});
interceptor.push(parts['ion cannon']);
interceptor.push(parts['nuclear source']);
interceptor.push(parts['nuclear drive']);
interceptor.push(parts['influence_2']);

var cruiser = [];
cruiser.push({});
cruiser.push(parts['ion cannon']);
cruiser.push(parts['hull']);
cruiser.push(parts['electron computer']);
cruiser.push(parts['nuclear source']);
cruiser.push(parts['nuclear drive']);
cruiser.push(parts['influence_1']);

var dreadnought = [];
dreadnought.push({});
dreadnought.push(parts['ion cannon']);
dreadnought.push(parts['ion cannon']);
dreadnought.push(parts['hull']);
dreadnought.push(parts['hull']);
dreadnought.push(parts['electron computer']);
dreadnought.push(parts['nuclear source']);
dreadnought.push(parts['nuclear drive']);

function validShip(ship) {
    function tally(ship, name) {
        var total = 0;
        for (var item in ship) {
            total += (ship[item][name] || 0);
        }
        return total;
    }
    if ((tally(ship, 'energy') < 0)
     || (tally(ship, 'speed') < 1)
     || (tally(ship, 'dice') < 1))
        return false;
    return true;
}

function rollDie() {
    var min = 1;
    var max = 6;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// TODO currently if a dice is a hit
// we simply assign it damage to the first valid
// ship rather than optimally distributing the dice
// which can matter is multi-ship multi-class battles.
function execBattle(ships) {
    for (var ship in ships) {
        ships[ship].hit = 0;
    }

    function attack(attackingShip, roll, damage) {
        if (roll === 1)
            return;

        function hit(ship) {
            ship.hit += damage;
            //console.log('hit: ' + ship.player + ' got a hit of ' + damage);
        }

        var computer = attackingShip['computer'];
        var player = attackingShip.player;
        var ahit = false;
        for (var ship in ships) {
            if (ships[ship].player === player)
                continue;
            if ((ships[ship].hull - ships[ship].hit) < 0)
                continue;
            if (roll === 6) {
                ahit = true;
                hit(ships[ship]);
            } else {
                var shield = ships[ship].shield;
                if (roll + computer - shield >= 6) {
                    ahit = true;
                    hit(ships[ship]);
                }
            }
            //if ((ships[ship].hull - ships[ship].hit) < 0)
            //    console.log(ships[ship].player + ' destroyed by ' + player + ' ' + damage + ' ' + roll);
            if (ahit)
                break;
        }
        //console.log('attack: ' + player + ' ' + roll + ' ' + damage + ' ' + computer + ' ' + ahit);
    }

    function rollDice(shoot_once) {
        for (var ship in ships) {
            if ((ships[ship].hull - ships[ship].hit) < 0)
                continue;
            for (var item in ships[ship]) {
                var once = (ships[ship][item]['shoot_once'] || false);
                if (once !== shoot_once)
                    continue;
                var dice = ships[ship][item]['dice'] || 0;
                while (dice > 0) {
                    var roll = rollDie();
                    attack(ships[ship], roll, ships[ship][item]['damage'] || 0);
                    dice--;
                }
            }
        }
    }

    function countUp() {
        ac = 0;
        bc = 0;
        for (var ship in ships) {
            if ((ships[ship].hull - ships[ship].hit) < 0)
                continue;
            if (ships[ship].player === 'a')
                ac++;
            if (ships[ship].player === 'b')
                bc++;
        }
    }
    var ac = 0;
    var bc = 0;
    countUp();
    var initialbc = bc;

    rollDice(true);
    do {
        rollDice(false);
        countUp();
    } while (ac > 0 && bc > 0);
    //console.log((ac > 0 ? 'a' : 'b') + ' won');
    return bc > 0 && bc === initialbc;
}

function battle(playerA, playerB) {
    // Tag the ships and put into one list sorted by influence
    for (var ship in playerA)
        playerA[ship].player = 'a';
    for (var ship in playerB)
        playerB[ship].player = 'b';
    var ships = [].concat(playerA, playerB);
    ships.sort(function(a, b) { return a['influence'] < b['influence']; });

    for (var ship in ships) {
        if (!validShip(ships[ship])) {
            console.warn('Not a valid ship');
            return 0;
        }
    }

    // Total up the ship's capabilities before fighting
    function tally(name) {
        for (var ship in ships) {
            var total = 0;
            for (var item in ships[ship]) {
                total += (ships[ship][item][name] || 0);
            }
            ships[ship][name] = total;
        }
    }
    tally('hull');
    tally('computer');
    tally('shield');
    tally('influence');

    var wins = 0;
    for (var i = 0; i < max_tries; ++i) {
        wins += execBattle(ships);
    }
    return 100 * (wins/max_tries);
}

function allValidShipCombinations(numberOfSpaces) {
    // Return an array of all combinations of
    // 'setSize' from the array 'from'
    function combinationsWithRepetition(setSize, from) {
        function _internal(setSize, got, pos, from) {
            if (got.length === setSize) {
                return [got.slice(0)];
            }
            var result = [];
            var length = from.length;
            for (var i = pos; i < length; ++i) {
                got.push(from[i]);
                result = result.concat(_internal(setSize, got, i, from));
                got.pop();
            }
            return result;
        }
        return _internal(setSize, [], 0, from);
    }

    // Make up a list of only upgradeable parts
    var partsArray = [];
    for (var name in parts) {
        if (parts[name]['upgradeable'] === false)
            continue;
        if (parts[name]['available'] === false)
            continue;
        if ((parts[name]['cost_max'] || 0) > max_cost)
            continue;
        partsArray.push(parts[name]);
    }
    var all = combinationsWithRepetition(numberOfSpaces, partsArray);

    all = all.filter(validShip);

    function researchShip(ship) {
        var c = countResearch(ship);
         if (c > max_research)
            return false;
        return true;
    }

    return all.filter(researchShip);
}

function countResearch(ship) {
    var research = {};
    for (var i = 0; i < ship.length; ++i) {
        if (ship[i]['cost_max'])
            research[ship[i]['name']] = 1;
    }
    var c = 0;
    for (var r in research)
        c++;
    return c;
}

function countCost(ship) {
    var research = {};
    for (var i = 0; i < ship.length; ++i) {
        if (ship[i]['cost_max'])
            research[ship[i]['name']] = ship[i]['cost_max'] || 0;
    }
    var c = 0;
    for (var r in research)
        c += research[r];
    return c;
}

function countUpgrades(stock, ship) {
    var c = 0;
    var stockCopy= stock.slice();
    for (var i = 0; i < ship.length; ++i) {
        var name = ship[i]['name'];
        ship[i]['upgraded'] = true;
        for (var j = 0; j < stock.length; ++j) {
            if (stockCopy[j]['name'] === name) {
                stockCopy[j] = {};
                ship[i]['upgraded'] = false;
                ++c;
                break;
            }
        }
    }
    return stock.length - c;
}

function test_ship(stock) {
    var base = [];
    for (var i = 0; i < stock.length; ++i) {
        if (stock[i]['upgradeable'] === false)
            base.push(stock[i]);
    }
    var size = stock.length - base.length;

    var all = allValidShipCombinations(size);
    var results = {};
    for (var offset in all) {
        var ship = all[offset];
        ship = ship.concat(base);
        var defense = [];
        for (var i = 0; i < max_ships; ++i) {
            defense.push(ship);
        }
        var r = battle(offense, defense);
        r = Math.floor(r);
        r += 1/(offset+1);
        var tname = '';
        var research = countResearch(ship);
        var upgrades = countUpgrades(stock, ship);
        var cost = countCost(ship);
        for (var i = 0; i < ship.length; ++i) {
            var name = ship[i]['name'];
            if (ship[i]['upgraded'])
                name = name.toUpperCase();
            tname += name + ', ';
        }
        results[r] = 'Upgrades: ' + upgrades + ' Cost:' + cost + ' Research:' + research + ' boxes:' + tname;
    }
    console.log(results);

    var best = 0;
    var bestShip;
    for (var ship in results) {
        if (parseInt(ship, 10) > best) {
            best = ship;
            bestShip = results[best];
        }
    }
    return best + '% ' + bestShip;
}

function test_interceptor() {
    return test_ship(interceptor);
}

function test_cruiser () {
    return test_ship(cruiser);
}

function test_dreadnought() {
    return test_ship(dreadnought);
}

var offense = [ancient];
var max_tries = 200;
var max_research = 1;
var max_cost = 10;
var max_ships = 1;
