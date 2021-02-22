```javascript
function solution(S) {
    if (S === '') {
        return 1;
    }

    if (S.includes('VW')) {
        return 1;
    }

    const openNesteds = ['(', '{', '['];
    const closeNesteds = [')', '}', ']'];
    const fullNesteds = openNesteds.concat(closeNesteds);

    let hasNesteds = false;
    for (let i = 0; i < S.length; i++) {
        const char = S[i];
        if (fullNesteds.includes(char)) {
            hasNesteds = true;
            break;
        }
    }

    // meaningless str
    if (!hasNesteds) {
        return 0;
    }

    const nestedStact = [];
    for (let i = 0; i < S.length; i++) {
        const char = S[i];
        if (!fullNesteds.includes(char)) {
            continue;
        }

        if (openNesteds.includes(char)) {
            nestedStact.push(char);
            continue;
        }

        // char must be one of closeNesteds
        // No openNesteds in nestedStack
        if (nestedStact.length < 1) {
            return 0;
        }

        const openNestedIdx = openNesteds.indexOf(nestedStact.pop())
        const closeNestedIdx = closeNesteds.indexOf(char)
        if (openNestedIdx !== closeNestedIdx) {
            return 0;
        }
    }

    if ( nestedStact.length > 0) {
        return 0;
    }

    return 1;
}
```