# Names
link: [codechrysalis/algorithms-meetup](https://github.com/codechrysalis/algorithms-meetup/blob/master/meetup-18/1-Names.md)

## Summary

You've adopted a pet and have no idea what to name to give your new family member. You decide to take suggestions from the internet. After waiting a day, the suggestions have exploded and you have a very long list of names, some of the names repeated multiple times.

Write an algorithm that will take the array of strings and output another array of unique names.

## Input

An array of strings

## Output

An array of strings without repeated strings

## Example

```
Example 1
Input:
["Bob", "Ross", "Guy", "Taco", "Waffles", "Ross", "Felix", "Felix", "Waffles"]

Output:
["Bob", "Ross", "Guy", "Taco", "Waffles", "Felix"]

Example 2
Input:
["Taco", "Taco", "Taco", "Felix", "Taco", "Burrito", "Pino"]

Output:
["Taco", "Felix", "Burrito", "Pina"]
```
## Constraints

You cannot use Sets.

## Tips

Try to get it to O(n) time complexity!


## Answer

```javascript
const input = ["Bob", "Ross", "Guy", "Taco", "Waffles", "Ross", "Felix", "Felix", "Waffles"];
const inputLength = input.length;
const duplicatedFlags = input.map(() => false);
for (let i = 0; i < inputLength; i++) {
  const currentValue = input[i];

  for (let j = i + 1; j < inputLength; j++) {
    if (currentValue === input[j]) {
      duplicatedFlags[j] = true;
    }
  }
}
console.log(duplicatedFlags); // [false, false, false, false, false, true, false, true, true]

const result = [];
for (let i = 0; i < inputLength; i++) {
  if (!duplicatedFlags[i]) {
    result.push(input[i]);
  }
}
console.log(result); // ["Bob", "Ross", "Guy", "Taco", "Waffles", "Felix"]
```
