# pivot
[![Maintainability](https://api.codeclimate.com/v1/badges/c8ed29d6e2fa0bc0d582/maintainability)](https://codeclimate.com/github/steelbreeze/pivot/maintainability)

A minimalist pivot table library for TypeScript/JavaScript. While small (a mere 575 bytes when minified), this library is large in capability, supporting derived and custom dimensions, derived fields for dimensions and calculations, composite dimensions, filtering.

The library also provides a modest set of numerical selectors. Suggestions for additions, or better still contributions, are welcome.

## Why create another pivot table library?
There are plenty of pivot table libraries in existence, so why create another one? Well, this is a spin-off from the [steelbreeze/landscape](https://github.com/steelbreeze/landscape) project, where instead of aggregating numerical data from the pivot cube, non-numerical data is needed.

It also focuses just on dimension and cube creation, without any layout considerations keeping it small and unopinionated.
### n-cubes
The libary allows 1-n dimensions to be passed into the cube function allowing n-cube (or hypercube) generation.

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
The documentation can be found [here](http://steelbreeze.net/pivot/api/v4), and more discussion in the [Wiki](https://github.com/steelbreeze/pivot/wiki).

## Example
The following is the result of pivoting publicly available information about the Fulham Football Club [men's squad](https://web.archive.org/web/20210516151437/https://www.fulhamfc.com/teams) at the end of the 2020/21 season, calculating the average age of players by position and country.
```typescript
import { distinct, criteria, pivot, map, average } from '@steelbreeze/pivot';
import { squad } from './fulham';

// the position dimension we want in a custom order
const positions = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];

// the countries dimension we derive from the data and order alphabetically
const countries = squad.map(player => player.country).filter(distinct).sort();

// we then create dimensions which also reference a property in the source data 
const x = positions.map(criteria('position'));
const y = countries.map(criteria('country'));

// create the pivot cube from the squad data using position and country for x and y axes
let cube = pivot(squad, y, x);

// find the average age of players by position by country as at 2021-05-23
const result = map(cube, average(age(new Date('2021-05-23'))));
```
The full example can be found [here](https://github.com/steelbreeze/pivot/tree/main/src/example).

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
```JavaScript
const result = pivot.map(cube, pivot.select(player => `${player.givenName} ${player.familyName}`));
```
 Resulting in this sort of output:
||Goalkeeper|Defender|Midfielder|Forward|
|-|-|-|-|-|
|**Belgium**||Denis&nbsp;Odoi|||			
|**Cameroon**|||Andre-Frank&nbsp;Zambo&nbsp;Anguissa||
|**Denmark**||Joachim&nbsp;Anderson||
|**England**||Tosin&nbsp;Abarabioyo, Joe&nbsp;Bryan|Ruben&nbsp;Loftus-Cheek, Harrison&nbsp;Reed, Josh&nbsp;Onomah, Fabio&nbsp;Carvalho|Ademola&nbsp;Lookman|
|**France**|Alphonse&nbsp;Areola|Terence&nbsp;Kongolo||
|**Gabon**|||Mario&nbsp;Lemina||
|**Jamaica**||Michael&nbsp;Hector||Bobby&nbsp;De&nbsp;Cordova-Reid|
|**Netherlands**||Kenny&nbsp;Tete||
|**Nigeria**||Ola Aina||Josh&nbsp;Maja|
|**Portugal**||||Ivan&nbsp;Cavaleiro|
|**Scotland**|||Kevin&nbsp;McDonald, Tom&nbsp;Cairney||
|**Serbia**||||Aleksander&nbsp;Mitrovic|
|**Slovakia**|Marek&nbsp;Rodak||||
|**Spain**|Fabrico&nbsp;Agosto&nbsp;Ramirez||||
|**USA**||Tim&nbsp;Ream, Antonee&nbsp;Robinson|||

> Data and calculations correct as of: 2021-05-23.
