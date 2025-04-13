import {buildGrid} from "./CheckUtils.js";

export const getGridSet = () => {
    return [
        [
            {
                item: buildGrid(10, 0, 8, 0, 84, 81),
                args: {
                    t: 10,
                    b: 0,
                    l: 8,
                    r: 0,
                    w: 84,
                    h: 81
                }
            }
        ],
        [
            {
                item: buildGrid(10, 0, 8, 0, 84, 38),
                args: {
                    t: 10,
                    b: 0,
                    l: 8,
                    r: 0,
                    w: 84,
                    h: 38
                }
            },
            {
                item: buildGrid(55, 0, 8, 0, 84, 38),
                args: {
                    t: 55,
                    b: 0,
                    l: 8,
                    r: 0,
                    w: 84,
                    h: 38
                }
            }
        ],
        [
            {
                item: buildGrid(10, 0, 26, 0, 50, 38),
                args: {
                    t: 10,
                    b: 0,
                    l: 26,
                    r: 0,
                    w: 50,
                    h: 38
                }
            },
            {
                item: buildGrid(55, 0, 2, 0, 42, 38),
                args: {
                    t: 55,
                    b: 0,
                    l: 2,
                    r: 0,
                    w: 42,
                    h: 38
                }
            },
            {
                item: buildGrid(55, 0, 52, 0, 42, 38),
                args: {
                    t: 55,
                    b: 0,
                    l: 52,
                    r: 0,
                    w: 42,
                    h: 38
                }
            }
        ],
        [
            {
                item: buildGrid(10, 0, 2, 0, 42, 38),
                args: {
                    t: 10,
                    b: 0,
                    l: 2,
                    r: 0,
                    w: 42,
                    h: 38
                }
            },
            {
                item: buildGrid(10, 0, 52, 0, 42, 38),
                args: {
                    t: 10,
                    b: 0,
                    l: 52,
                    r: 0,
                    w: 42,
                    h: 38
                }
            },
            {
                item: buildGrid(55, 0, 2, 0, 42, 38),
                args: {
                    t: 55,
                    b: 0,
                    l: 2,
                    r: 0,
                    w: 42,
                    h: 38
                }
            },
            {
                item: buildGrid(55, 0, 52, 0, 42, 38),
                args: {
                    t: 55,
                    b: 0,
                    l: 52,
                    r: 0,
                    w: 42,
                    h: 38
                }
            }
        ]
    ]
}