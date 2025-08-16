export const getGrid = () => {
    const t = getRandomInt(100, 150)
    const l = getRandomInt(50, 100)
    const w = getRandomInt(700, 750)
    const h = getRandomInt(600, 650)

    return {
        t: t,
        l: l,
        w: w,
        h: h
    }
}

export const getPolar = () => {

    const po = getRandomInt(300, 350)

    return {
        pi: 0,
        po: po,
        pl: po,
        pt: po
    }
}

export const buildGrid = (t, l, w, h) => {
    return {
        top: t,
        left: l,
        width: w,
        height: h,
        containLabel: true,
    }
}

export const buildPolar = (pi, po, pl, pt) => {
    return {
        radius: [pi, po],
        center: [pl, pt]
    }
}

export function getRandomInt(min, max) {
    // 处理min > max的情况
    if (min > max) [min, max] = [max, min];
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const getPosition = (is, type) => {
    if (type === 1) {
        if (is) return 'right'
        else return 'left'
    } else {
        if (is) return 'bottom'
        else return 'top'
    }
}

export const getSymbol = (is) => {
    if (is) return ['none', 'arrow']
    else return ['arrow', 'none']
}

export const labelTypeForPosition = ['inner', 'outside']

export const roseTypeSelect = ['radius', 'area']

