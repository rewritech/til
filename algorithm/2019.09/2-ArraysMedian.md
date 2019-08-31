# Median of Two Arrays
link: [codechrysalis/algorithms-meetup](https://github.com/codechrysalis/algorithms-meetup/blob/master/meetup-18/1-Names.md)

## Summary

You're in charge of merging two family trees together. The family is pretty big and they want to know who of the children is the middle child. Each family has given you an array containing the ages of their children.

Create an algorithm that finds the median of two sorted number arrays.

## Input

Your algorithm should take two number Arrays as input.

## Output

A number

## Example

```
Input:
[1, 4, 8], [3, 6, 7, 10]

Output: 6

Input:
[1, 1, 2, 2, 6], [4, 7, 7, 8]

Output: 4
```


## Tips

The best I time complexity I could come up with is O(n)

## practice
```javascript
const input1 = [1, 1, 2, 2, 6];
const input2 = [4, 7, 7, 8];

const uniqueInputs = [...new Set(input1.concat(input2))];
uniqueInputs.sort();

const midian = parseInt(uniqueInputs.length / 2, 10);
const result = uniqueInputs[midian];
console.log(result);  // 6
```
