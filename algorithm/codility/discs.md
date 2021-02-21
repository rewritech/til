```javascript
function solution(A) {
    const lengthOfA = A.length;
    const discSizes = new Array(lengthOfA);

    for (let i = 0; i < lengthOfA; i++) {
        const center = i;
        const radius = A[i];
        discSizes[i] = [center - radius, center + radius];
    }

    let intersectNum = 0; 
    for (let i = 0; i < lengthOfA; i++) {
        const left = discSizes[i][0];
        const right = discSizes[i][1];
        for (let j = i + 1; j < lengthOfA; j++) {
            const targetLeft = discSizes[j][0];
            const targetRight = discSizes[j][1];

            if (
                left <= targetRight
                && targetLeft <= right
                ) {
                intersectNum++;
            }

        }

        if (intersectNum > 10000000) {
            return -1;
        }
    }

    return intersectNum;
}
```