// you can write to stdout for debugging purposes, e.g.
// console.log('this is a debug message');

function solution(A) {
    const lengthOfA = A.length;

    let totalSum = 0;
    for (let i = 0; i < lengthOfA; i++)  {
        totalSum += A[i];
    }

    let sumLeft = A[0];
    let sumRight = totalSum - sumLeft;
    let difference = Math.abs(sumLeft - sumRight);
    if (difference === 0) {
        return 0
    }
    let minDifference = Math.abs(difference);

    // 0 ~ P-1
    // P ~ lengthOfA
    for (let i = 1; i < lengthOfA - 1; i++)  {
        sumLeft += A[i];
        sumRight = totalSum - sumLeft;
        difference = Math.abs(sumLeft - sumRight);

        if (difference === 0) {
            return 0
        } else if (difference < minDifference) {
            minDifference = difference
        }
    }

    return minDifference;
}
