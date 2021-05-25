# pivot
A minimalist pivot table library for TypeScript/JavaScript. While small in size (a mere 903 bytes when minified), this library is large in capability, supporting user-supplied or source data derived dimensions, derived fields for dimensions and calculations, multiple dimensions for an axis; even hypercubes can be generated.

The library also provides a modest set of numberical selectors. Suggestions for additions, or better still contributions, are welcome.


## Example
The following is the result of pivoting publicly available information about the [Fulham Football Club mens squad](https://web.archive.org/web/20210516151437/https://www.fulhamfc.com/teams) in the form of an array of objects.

First, we create a pair of axes to pivot by, in this case deriving position and country dimensions from the squad data and using them as the x and y axes respectively:
```typescript
const x = axis(dimension(squad, 'position'));
const y = axis(dimension(squad, 'country'));
```
Then we pivot the squad data by the chosen x and y axes:
```typescript
const cube = pivot(squad, x, y);
```
And finally, query the cube for the averate 
```typescript
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

> Data and calculations correct as of: 2021-05-23.