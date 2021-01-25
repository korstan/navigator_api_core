module.exports = {
    generateTextByPoints(points) {
        const textParts = []
        if (points.length > 2) {
            for (let i = 0; i < points.length - 2; i++) {
                if ((points[i].x - points[i + 1].x) === 0) {
                    if (points[i + 1].title && points[i + 1].title.length > 1) {
                        textParts.push(`пройдите прямо до аудитории ${points[i + 1].title}`)
                    } else {
                        const count = Math.abs(points[i].y - points[i + 1].y)
                        textParts.push(`пройдите прямо ${count} ${declOfNum(count, ['метр', 'метра', 'метров'])}`)
                    }
                    if ((points[i + 1].y - points[i + 2].y) === 0) {
                        const direction = calculateRotationDirection([points[i], points[i + 1], points[i + 2],]);
                        textParts.push(`поверните ${direction}`)
                    }
                } else if ((points[i].y - points[i + 1].y) === 0) {
                    if (points[i + 1].title && points[i + 1].title.length > 1) {
                        textParts.push(`пройдите прямо до аудитории ${points[i + 1].title}`)
                    } else {
                        const count = Math.abs(points[i].x - points[i + 1].x)
                        textParts.push(`пройдите прямо ${count} ${declOfNum(count, ['метр', 'метра', 'метров'])}`)
                    }
                    if ((points[i + 1].x - points[i + 2].x) === 0) {
                        const direction = calculateRotationDirection([points[i], points[i + 1], points[i + 2],]);
                        textParts.push(`поверните ${direction}`)
                    }
                }
            }
        } else {
            const count = Math.abs(points[0].y - points[1].y) + Math.abs(points[0].y - points[1].y)
            textParts.push(`пройдите прямо ${count} ${declOfNum(count, ['метр', 'метра', 'метров'])}`)
        }
        return textParts.join('. ');
    }
}

function calculateRotationDirection(points){
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

// Склонение числительных
// Пример: declOfNum(sum, ['роль', 'роли', 'ролей'])
export const declOfNum = (n, titles) => {
    return titles[(n % 10 === 1 && n % 100 !== 11) ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2]
}