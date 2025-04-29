export const getGrid = () => {
    const t = getRandomInt(8,12)
    const l = getRandomInt(6,10)
    const w = getRandomInt(60,84)
    const h = getRandomInt(60,81)


    return  {
            t: t,
            b: 0,
            l: l,
            r: 0,
            w: w,
            h: h
    }
}

export const getPolar = () => {

    const po = getRandomInt(40,60)

    return {
            pi: 0,
            po: po,
            pl: po,
            pt: po
    }
}

export const buildGrid = (t, b, l, r, w, h) => {
    return {
        top: `${t}%`,
        bottom: `${b}%`,
        left: `${l}%`,
        right: `${r}%`,
        width: `${w}%`,
        height: `${h}%`,
        containLabel: true,
    }
}

export const buildPolar = (pi, po, pl, pt) => {
    return {
        radius: [`${pi}%`, `${po}%`],
        center: [`${pl}%`, `${pt}%`]
    }
}

function getRandomInt(min, max) {
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

export const labelTypeForPosition = ['inner','outside']

export const roseTypeSelect = ['radius','area']

