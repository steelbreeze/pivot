# pivot
[![Maintainability](https://api.codeclimate.com/v1/badges/d2fd7facda5a61d2b66a/maintainability)](https://codeclimate.com/github/steelbreeze/pivot/maintainability)

A minimalist pivot table library for TypeScript/JavaScript. While small (just 987 bytes when minified), this library is large in capability, supporting derived and custom dimensions, derived fields for dimensions and calculations, composite axes, filtering.

The library also provides a modest set of numerical selectors. Suggestions for additions, or better still contributions, are welcome.

## Why create another pivot table library?
There are plenty of pivot table libraries in existence, so why create another one? Well, this is a spin-off from the [steelbreeze/landscape](https://github.com/steelbreeze/landscape) project, where instead of aggregating numerical data from the pivot cube, non-numerical data is needed.

## Example
The following is the result of pivoting publicly available information about the Fulham Football Club [men's squad](https://web.archive.org/web/20210516151437/https://www.fulhamfc.com/teams) at the end of the 2020/21 season, calculating the average age of players by position and country.
```typescript
import * as pivot from '..';

// create axes derived from the squad data
const y = pivot.deriveDimension(squad, 'country');
const x = pivot.deriveDimension(squad, 'position');

// create the pivot cube
const cube = pivot.cube(squad, y, x);

// find the average age of players by position by country
const result = pivot.map(cube, pivot.average(age));
```
The selection is the average age of the players grouped by position and country:
```
        Defend… Forward Goalke… Midfie…
Belgium 32
Camero…                         25
Denmark 24
England 25      23              23.25
France  27              28
Gabon                           27
Jamaica 28      28
Nether… 25
Nigeria 24      22
Portug…         27
Scotla…                         31
Serbia          26
Slovak…                 24
Spain                   33
USA     28
```
> The full example code can be found [here](src/example/index.ts).

Alternatively, as can be seen in the [web example](https://steelbreeze.net/pivot), non-numerical content can also be queried, mapping the source data to an arbitrary selection:
```javascript
const result = pivot.map(cube, pivot.select(player => `${player.givenName}&nbsp;${player.familyName}`));

```
 Resulting in this sort of output:
||Defender|Forward|Goalkeeper|Midfielder|
|-|-|-|-|-|
| Belgium|Denis&nbsp;Odoi||||			
|Cameroon||||Andre-Frank&nbsp;Zambo&nbsp;Anguissa|
|Denmark|Joachim&nbsp;Anderson|||
|England|Tosin&nbsp;Abarabioyo, Joe&nbsp;Bryan|Ademola&nbsp;Lookman||Ruben&nbsp;Loftus-Cheek, Harrison&nbsp;Reed, Josh&nbsp;Onomah, Fabio&nbsp;Carvalho|
|France|Terence&nbsp;Kongolo||Alphonse&nbsp;Areola|
|Gabon||||Mario&nbsp;Lemina|
|Jamaica|Michael&nbsp;Hector|Bobby&nbsp;De&nbsp;Cordova-Reid||
|Netherlands|Kenny&nbsp;Tete|||
|Nigeria|Ola Aina|Josh&nbsp;Maja||
|Portugal||Ivan&nbsp;Cavaleiro||
|Scotland||||Kevin&nbsp;McDonald, Tom&nbsp;Cairney|
|Serbia||Aleksander&nbsp;Mitrovic||
|Slovakia|||Marek&nbsp;Rodak|
|Spain|||Fabrico&nbsp;Agosto&nbsp;Ramirez|
|USA|Tim&nbsp;Ream, Antonee&nbsp;Robinson|||

> Data and calculations correct as of: 2021-05-23.

## Axis manipulation
### Custom dimensions
In the example above, the axes are derived from the values seen within the data using ```deriveDimension```. Should you wish to use custom dimensions, you can call ```dimension``` and pass in the desired values.
### Composite dimensions
Dimensions can be merged with a call to ```join```.
If the criteria for one dimension was [a, b] and another was [c, d], then the combined dimension would be [ac, ad, bc, bd].
