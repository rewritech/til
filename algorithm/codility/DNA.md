// you can write to stdout for debugging purposes, e.g.
// console.log('this is a debug message');

function solution(S, P, Q) {

    // return solution1(S, P, Q);
    return solution2(S, P, Q);
}

// Googleで学んだidea
function solution2(S, P, Q) {
    const lengthOfS = S.length;

    // A, C, Gの存在情報登録のリスト生成
    // Tは省略：A、C、G以外はTの4で、自動に分かる為、省略
    const indicatorA = new Array(lengthOfS);
    const indicatorC = new Array(lengthOfS);
    const indicatorG = new Array(lengthOfS);

    // 直前と比較リスト：indicatorA[0]に0を格納し、indicatorA[1]にP[0]を格納
    // P[0]、Q[0]の場合、
    // indicatorA[0]、indicatorA[1]を見て、
    // 差分があるとS[0]はAと分かる
    indicatorA[0] = 0;
    indicatorC[0] = 0;
    indicatorG[0] = 0;

    // 差分の記載
    for (let i = 0; i < lengthOfS; i++ ) {
        const nucleotide = S[i];
        let a = 0;
        let c = 0;
        let g = 0;
        if (nucleotide === 'A') {
            a = 1;
        } else if (nucleotide === 'C') {
            c = 1;
        } else  if (nucleotide === 'G') {
            g = 1;
        }

        // aがあったら、[0, 1]になり、for文完了後に[0, 0, 0, 1, 1, 2]になる
        // indexが1, 4の場合、そのindexの２つの数字を比較し、差分が1以上ならAの1になる
        indicatorA[i + 1] = indicatorA[i] + a;
        indicatorC[i + 1] = indicatorC[i] + c;
        indicatorG[i + 1] = indicatorG[i] + g;
    }

    const impactFactors = [];
    for (let i = 0; i < P.length; i++ ) {
        const startIdx = P[i];
        const endIdx = Q[i] + 1;

        // ２つのindexの間にA、C、Gがあったら、差分があり
        if (indicatorA[endIdx] > indicatorA[startIdx]) {
            impactFactors.push(1);
        } else if (indicatorC[endIdx] > indicatorC[startIdx]) {
            impactFactors.push(2);
        } else  if (indicatorG[endIdx] > indicatorG[startIdx]) {
            impactFactors.push(3);
        } else {
            impactFactors.push(4);
        }
    }

    return impactFactors;
}


// 一番簡単で、効率が悪い（保健）
// 最悪例）CCCC..CCCA, [0,0, ..., 0], [N,N, ..., N]
function solution1(S, P, Q) {
    const impactFactors = []; 
    for (let i = 0; i < P.length; i++ ) {
        const startIdx = P[i];
        const endIdx = Q[i] + 1;
        const DNApart = S.slice(startIdx, endIdx);

        if (DNApart.includes('A')) {
            impactFactors.push(1);
        } else if (DNApart.includes('C')) {
            impactFactors.push(2);
        } else if (DNApart.includes('G')) {
            impactFactors.push(3);
        } else {
            impactFactors.push(4);  // 'T'
        }
    }

    return impactFactors;
}
