```javascript
function solution(A) {
    const lengthOfA = A.length;
    const counterQ = [];  // traveling to the west
    counterQ[0] = A[0];
    for (let i = 1; i < lengthOfA; i++) {
        counterQ[i] = counterQ[i - 1] + A[i];
    }

    const lastIdx = lengthOfA - 1;
    if (counterQ[lastIdx] === 0) {
        return 0;
    }

    let numOfCarPair = 0;
    for (let i = 0; i < lengthOfA; i++) {
        if (A[i] === 0) {
            numOfCarPair += counterQ[lastIdx] - counterQ[i];
        }

        // 1000000001
        if (numOfCarPair > 1000000000) {
            return -1;
        }
    }

    if (numOfCarPair > 1000000000) {
        return -1;
    }

    return numOfCarPair;
}
```