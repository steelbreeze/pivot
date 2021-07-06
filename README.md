# pivot
[![Maintainability](https://api.codeclimate.com/v1/badges/d2fd7facda5a61d2b66a/maintainability)](https://codeclimate.com/github/steelbreeze/pivot/maintainability)

A minimalist pivot table library for TypeScript/JavaScript. While small in size (a mere 996 bytes when minified), this library is large in capability, supporting derived and custom dimensions, derived fields for dimensions and calculations, composite axes, filtering. Even hypercubes are possible.

The library also provides a modest set of numberical selectors. Suggestions for additions, or better still contributions, are welcome.

## Why create another pivot table library?
There are plenty of pivot table libraries in existance, so why create another one? Well, this is actually a spin-off from the [steelbreeze/landscape](https://github.com/steelbreeze/landscape) project, where instead of aggregating numerical data from the pivot cube, non-numerical data is needed.

## Example
The following is the result of pivoting publicly available information about the Fulham Football Club [mens squad](https://web.archive.org/web/20210516151437/https://www.fulhamfc.com/teams) at the end of the 2020/21 season, calculating the average age of players by position and country.
```typescript
import * as pivot from '../pivot';

// create axes derived from the squad data
const x = pivot.axis.fromTable(squad, 'position');
const y = pivot.axis.fromTable(squad, 'country', { get: player => player.country.substr(0, 3).toUpperCase() });

// create the pivot cube
const cube = pivot.cube(squad, y, x);

// find the average age of players by position by country
const result = pivot.map(cube, pivot.average(age));
```
The selection is the average age of the players grouped by position and country:
```
        Defend… Forward Goalke… Midfie…
BEL     32
CAM                             25
DEN     24
ENG     25      23              23.25
FRA     27              28
GAB                             27
JAM     28      28
NET     25
NIG     24      22
POR             27
SCO                             31
SER             26
SLO                     24
SPA                     33
USA     28
```
> The full example code can be found [here](src/example/index.ts).

Alternatively, as can be seen in the [web example](https://steelbreeze.net/pivot), non-numerical content can also be queried, mapping the source data to an arbitrary selection:
```javascript
const result = pivot.map(cube, pivot.select(player => `${player.givenName} ${player.familyName}`));

```
 Resulting in this sort of output:
||Defender|Forward|Goalkeeper|Midfielder|
|-|-|-|-|-|
| Belgium|Denis Odoi||||			
|Cameroon||||Andre-Frank Zambo Anguissa|
|Denmark|Joachim Anderson|||
|England|Tosin Abarabioyo,Joe Bryan|Ademola Lookman||Ruben Loftus-Cheek, Harrison Reed, Josh Onomah, Fabio Carvalho|
|France|Terence Kongolo||Alphonse Areola|
|Gabon||||Mario Lemina|
|Jamaica|Michael Hector|Bobby De Cordova-Reid||
|Netherlands|Kenny Tete|||
|Nigeria|Ola Aina|Josh Maja||
|Portugal||Ivan Cavaleiro||
|Scotland||||Kevin McDonald, Tom Cairney|
|Serbia||Aleksander Mitrovic||
|Slovakia|||Marek Rodak|
|Spain|||Fabrico Agosto Ramirez|
|USA|Tim Ream, Antonee Robinson|||

> Data and calculations correct as of: 2021-05-23.

## Axis manipulation
### Custom axis
In the example above, the axes are derived from the values seen within the data using ```axis.fromTable```. Should you wish to use custom axes, you can call ```axis.fromValues```.
### Composite axes
Axes can be merged with a call to ```axis.join```.
If the criteria for one axis was [a, b] and another was [c, d], then the combined axis would be [ac, ad, bc, bd].
## Hypercubes
The ```cube``` function returns a table sliced on two axes, it acheives this through two calls to the ```slice``` function, one for each axis, implemented as follows:
```typescript
return slice(table, y).map(i => slice(i, x));
```

There is nothing to stop you making repeated calls to slice with additional axes, for example:
```typescript
const result = slice(table, z).map(i => slice(i, y)).map(i => slice(i, x));
```
