# pivot
[![Maintainability](https://api.codeclimate.com/v1/badges/d2fd7facda5a61d2b66a/maintainability)](https://codeclimate.com/github/steelbreeze/pivot/maintainability)

A minimalist pivot table library for TypeScript/JavaScript. While small in size (a mere 971 bytes when minified), this library is large in capability, supporting derived and custom dimensions, derived fields for dimensions and calculations, multiple dimensions for an axis; even hypercubes can be generated.

The library also provides a modest set of numberical selectors. Suggestions for additions, or better still contributions, are welcome.

## Why create another pivot table library?
There are plenty of pivot table libraries in existance, so why create another one? Well, this is actually a spin-off from the steelbreeze/landscape project, where instead of aggregating numerical data from the pivot cube, non-numerical data is needed. So this library does both.

## Example
The following is the result of pivoting publicly available information about the Fulham Football Club [mens squad](https://web.archive.org/web/20210516151437/https://www.fulhamfc.com/teams) in the form of an array of objects, calculating the average age of players by position and country.
```typescript
// create axes out of the dimensions derived from the squad data
const x = axis(dimension(squad, 'position'));
const y = axis(dimension(squad, 'country'));

// create the pivot cube
const cube = pivot(squad, y, x);

// find the average age of players by position by country
const result = query(cube, average(age));
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
Jamaca  28      28
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

Alternatively, as can be seen in the web example, non-numerical content can also be queried, resulting in this sort of output:
||Defender|Forward|Goalkeeper|Midfielder|
|-|-|-|-|-|
| Belgium|Denis Odoi||||			
|Cameroon||||Andre-Frank Zambo Anguissa|
|Denmark|Joachim Anderson|||
|England|Tosin Abarabioyo,Joe Bryan|Ademola Lookman||Ruben Loftus-Cheek, Harrison Reed, Josh Onomah, Fabio Carvalho|
|France|Terence Kongolo||Alphonse Areola|
|Gabon||||Mario Lemina|
|Jamaca|Michael Hector|Bobby De Cordova-Reid||
|Netherlands|Kenny Tete|||
|Nigeria|Ola Aina|Josh Maja||
|Portugal||Ivan Cavaleiro||
|Scotland||||Kevin McDonald, Tom Cairney|
|Serbia||Aleksander Mitrovic||
|Slovakia|||Marek Rodak|
|Spain|||Fabrico Agosto Ramirez|
|USA|Tim Ream, Antonee Robinson|||

> Data and calculations correct as of: 2021-05-23.
