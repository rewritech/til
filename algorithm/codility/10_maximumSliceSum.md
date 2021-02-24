```javascript
function solution(A) {
    let startIdx = 0;
    let hasPossitiveNum = false;

    // search possitive num
    for (let i = 0; i < A.length; i++) {
        if (A[i] > 0) {
            hasPossitiveNum = true;
            startIdx = i;
            break;
        }
    }

    // No Positive num
    if (!hasPossitiveNum) {
        return Math.max(...A);
    }

    let maxNum = 0;
    let sum = 0;
    for (let i = startIdx; i < A.length; i++) {
        sum += A[i];
        if (sum > 0) {
            maxNum = Math.max(maxNum, sum);
        }else {
            sum = 0
        }
    }

    return maxNum;
}
```