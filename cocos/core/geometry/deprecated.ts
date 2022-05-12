

import { replaceProperty, removeProperty } from '../utils/x-deprecated';
import { Line } from './line';
import intersect from './intersect';

replaceProperty(Line.prototype, 'line', [
    {
        name: 'mag',
        newName: 'len',
    },
    {
        name: 'magnitude',
        newName: 'len',
    },
]);

removeProperty(intersect, 'intersect', [
    {
        name: 'line_quad',
    },
]);
