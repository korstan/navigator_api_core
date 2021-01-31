const calculateRotationDirection = (points) => {
    const left = 'налево';
    const right = 'направо';
    let result;
    let i=0;
    if ((points[i].x - points[i+1].x) === 0) {
        const dy = points[i+1].y - points[i].y;
        const dx = points[i+2].x - points[i+1].x;
        if ((dy > 0 && dx > 0) || (dy < 0 && dx < 0)) {
            result = left;
        } else {
            result = right
        }
    } else {
        const dx = points[i+1].x - points[i].x;
        const dy = points[i+2].y - points[i+1].y;
        if ((dy > 0 && dx > 0) || (dy < 0 && dx < 0)) {
            result = right;
        } else {
            result = left
        }
    }
    return result;
}

const calculateRotationDirectionNew = (points) => {
    const left = 'налево';
    const right = 'направо';
    let result;
    let i=0;
    
    let p0 = points[i];
    let p1 = points[i+1];
    let p2 = points[i+2];
    
    let v1x = p1.x - p0.x;
    let v1y = p1.y - p0.y;
    let v2x = p2.x - p1.x;
    let v2y = p2.y - p1.y;
    if (v1x * v2y - v1y * v2x > 0)
        result = right;
    else
        result = left;
    return result;
}

// Склонение числительных
    // Пример: declOfNum(sum, ['роль', 'роли', 'ролей'])
const declOfNum = (n, titles) => {
        return titles[(n % 10 === 1 && n % 100 !== 11) ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2]
}

module.exports = {
    generateTextByPoints(points) {
        const textParts = []
        if (points.length > 2) {
            for (let i = 0; i < points.length - 1; i++) {
                if ((points[i].x - points[i + 1].x) === 0) {
                    if (points[i + 1].textToSpeech && points[i + 1].textToSpeech.length > 1) {
                        textParts.push(`пройдите прямо до ${points[i + 1].textToSpeech}`)
                    } else {
                        const count = Math.abs(points[i].y - points[i + 1].y)
                        textParts.push(`пройдите прямо ${count} ${declOfNum(count, ['метр', 'метра', 'метров'])}`)
                    }
                    if (((i + 2) < (points.length)) && ((points[i + 1].y - points[i + 2].y) === 0)) {
                        const direction = calculateRotationDirectionNew([points[i], points[i + 1], points[i + 2],]);
                        textParts.push(`поверните ${direction}`)
                    }
                } else if ((points[i].y - points[i + 1].y) === 0) {
                    if (points[i + 1].textToSpeech && points[i + 1].textToSpeech.length > 1) {
                        textParts.push(`пройдите прямо до ${points[i + 1].textToSpeech}`)
                    } else {
                        const count = Math.abs(points[i].x - points[i + 1].x)
                        textParts.push(`пройдите прямо ${count} ${declOfNum(count, ['метр', 'метра', 'метров'])}`)
                    }
                    if (((i + 2) < (points.length)) && ((points[i + 1].x - points[i + 2].x) === 0)) {
                        const direction = calculateRotationDirectionNew([points[i], points[i + 1], points[i + 2],]);
                        textParts.push(`поверните ${direction}`)
                    }
                }
            }
        } else {
            const count = Math.abs(points[0].y - points[1].y) + Math.abs(points[0].y - points[1].y)
            textParts.push(`пройдите прямо ${count} ${declOfNum(count, ['метр', 'метра', 'метров'])}`)
        }
        return textParts.join('. ');
    },
}
