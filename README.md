# pivot
[![Maintainability](https://api.codeclimate.com/v1/badges/c8ed29d6e2fa0bc0d582/maintainability)](https://codeclimate.com/github/steelbreeze/pivot/maintainability)

A minimalist pivot table library for TypeScript/JavaScript. While small (a mere 577 bytes when minified), this library is large in capability, supporting derived and custom dimensions, derived fields for dimensions and calculations, composite dimensions, filtering.

The library also provides a modest set of numerical selectors. Suggestions for additions, or better still contributions, are welcome.

## Why create another pivot table library?
There are plenty of pivot table libraries in existence, so why create another one? Well, this is a spin-off from the [steelbreeze/landscape](https://github.com/steelbreeze/landscape) project, where instead of aggregating numerical data from the pivot cube, non-numerical data is needed.

It also focuses just on dimension and cube creation, without any layout considerations keeping it small and unopinionated.

## Installation
### NPM
For installation via the node package manager:
```
npm i @steelbreeze/pivot
```
### Web
For web via a CDN:
```javascript
import * as pivot from 'https://cdn.skypack.dev/@steelbreeze/pivot';
```

## Documentation
The documentation can be found [here](http://steelbreeze.net/pivot/api/v3), and more discussion in the [Wiki](https://github.com/steelbreeze/pivot/wiki).

## Example
The following is the result of pivoting publicly available information about the Fulham Football Club [men's squad](https://web.archive.org/web/20210516151437/https://www.fulhamfc.com/teams) at the end of the 2020/21 season, calculating the average age of players by position and country.
```typescript
import { Player, squad } from './fulham';
import * as pivot from '@steelbreeze/pivot';

// create dimensions, one hard-coded, the other derived from the squad data
const x = pivot.dimension('position', ['Goalkeeper', 'Defender', 'Midfielder', 'Forward']);
const y = pivot.dimension('country', squad.map(player => player.country).filter((value, index, source) => source.indexOf(value) === index).sort());

// create the pivot cube from the squad data using position and country for x and y axes
let cube = pivot.cube(squad, y, x);

// find the average age of players by position by country as at 2021-05-23
const result = pivot.map(cube, pivot.average(age(new Date('2021-05-23'))));

// Creates a callback to calculate a players age from their date of birth as at a given date
function age(asAt: Date): (player: Player) => number {
	return (player: Player) => new Date(asAt.getTime() - player.dateOfBirth.getTime()).getUTCFullYear() - 1970;
}

```
The selection is the average age of the players grouped by position and country:
```
        Goalke… Defend… Midfie… Forward
Belgium         32
Camero…                 25
Denmark         24
England         25      23.25   23
France  28      27
Gabon                   27
Jamaica         28              28
Nether…         25
Nigeria         24              22
Portug…                         27
Scotla…                 31
Serbia                          26
Slovak… 24
Spain   33
USA             28
```
> The full example code can be found [here](src/example/index.ts).

Alternatively, as can be seen in the [web example](https://steelbreeze.net/pivot), non-numerical content can also be queried, mapping the source data to an arbitrary selection:
```javascript
const result = pivot.map(cube, pivot.select(player => `${player.givenName}&nbsp;${player.familyName}`));

```
 Resulting in this sort of output:
||Defender|Forward|Goalkeeper|Midfielder|
|-|-|-|-|-|
|**Belgium**|Denis&nbsp;Odoi||||			
|**Cameroon**||||Andre-Frank&nbsp;Zambo&nbsp;Anguissa|
|**Denmark**|Joachim&nbsp;Anderson|||
|**England**|Tosin&nbsp;Abarabioyo, Joe&nbsp;Bryan|Ademola&nbsp;Lookman||Ruben&nbsp;Loftus-Cheek, Harrison&nbsp;Reed, Josh&nbsp;Onomah, Fabio&nbsp;Carvalho|
|**France**|Terence&nbsp;Kongolo||Alphonse&nbsp;Areola|
|**Gabon**||||Mario&nbsp;Lemina|
|**Jamaica**|Michael&nbsp;Hector|Bobby&nbsp;De&nbsp;Cordova-Reid||
|**Netherlands**|Kenny&nbsp;Tete|||
|**Nigeria**|Ola Aina|Josh&nbsp;Maja||
|**Portugal**||Ivan&nbsp;Cavaleiro||
|**Scotland**||||Kevin&nbsp;McDonald, Tom&nbsp;Cairney|
|**Serbia**||Aleksander&nbsp;Mitrovic||
|**Slovakia**|||Marek&nbsp;Rodak|
|**Spain**|||Fabrico&nbsp;Agosto&nbsp;Ramirez|
|**USA**|Tim&nbsp;Ream, Antonee&nbsp;Robinson|||

> Data and calculations correct as of: 2021-05-23.
