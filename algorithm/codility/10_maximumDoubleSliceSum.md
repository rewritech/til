### Trying to solve
```javascript
function solution(A) {
    if (A.length === 3) {
        return 0;
    }

    if (A.length === 4) {
        let maxNum = Math.max(A[1], A[2]);
        maxNum = Math.max(maxNum, 0);

        return maxNum;
    }

    let startIdx = 0;
    let hasPossitiveNum = false;
    const targetA = A.slice(1, A.length);
    const targetLength = targetA.length;

    // search possitive num
    for (let i = 0; i < targetLength; i++) {
        if (targetA[i] > 0) {
            hasPossitiveNum = true;
            startIdx = i;
            break;
        }
    }

    // No Positive num
    if (!hasPossitiveNum) {
        return 0;
    }

    let maxNum = 0;
    let sum = 0;
    let maxStartIdx = startIdx;
    let maxEndIdx = targetLength - 1;
    for (let i = startIdx; i < targetLength; i++) {
        sum += targetA[i];
        if (sum > 0) {
            maxNum = Math.max(maxNum, sum);
            maxEndIdx = (maxNum === sum) ? i : maxEndIdx;
        }else {
            sum = 0
            maxStartIdx = (i + 1 !== targetLength) ? i + 1 : maxStartIdx;
        }
    }

    console.log(maxStartIdx, maxEndIdx)

    return maxNum;
}

```