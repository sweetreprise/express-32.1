const express = require('express');
const res = require('express/lib/response');
const ExpressError = require('./expressError')

const app = express()

app.get('/mean', (req, res, next) => {
    try {
        const q = req.query.q;
        if(!q) {
            throw new ExpressError('Numbers are required!', 400);
        }
        if(!onlyNumbers(q)) {
            throw new ExpressError('Only numbers are accepted.', 400);
        }

        const nums = q.split(',').map(num => {
            return parseInt(num, 10);
        });

        const response = {
        operation: "mean",
        value: getMean(nums)
        }
        return res.json(response);

    } catch(error) {
        return next(error);
    }
});

app.get('/median', (req, res, next) => {
    try {
        const q = req.query.q;
        if(!q) {
            throw new ExpressError('Numbers are required!', 400);
        }
        if(!onlyNumbers(q)) {
            throw new ExpressError('Only numbers are accepted.', 400);
        }

        const nums = q.split(',').map(num => {
            return parseInt(num, 10);
        });

        const response = {
            operation: "median",
            value: getMedian(nums)
        }
        return res.json(response);

    } catch(error) {
        return next(error);
    }
});

app.get('/mode', (req, res, next) => {
    try {
        const q = req.query.q;
        if(!q) {
            throw new ExpressError('Numbers are required!', 400);
        }
        if(!onlyNumbers(q)) {
            throw new ExpressError('Only numbers are accepted.', 400);
        }
        const nums = q.split(',').map(num => {
            return parseInt(num, 10);
        });

        const response = {
            operation: "mode",
            value: getMode(nums)
        }
        return res.json(response);

    } catch(error) {
        return next(error);
    }
});

app.get('/all', (req, res, next) => {
    try {
        const q = req.query.q;
        if(!q) {
            throw new ExpressError('Numbers are required!', 400);
        }
        if(!onlyNumbers(q)) {
            throw new ExpressError('Only numbers are accepted.', 400);
        }
        const nums = q.split(',').map(num => {
            return parseInt(num, 10);
        });

        const response = {
            operation: 'all',
            mean: getMean(nums),
            median: getMedian(nums),
            mode: getMode(nums)
        }
        return res.send(response);

    } catch(error) {
        return next(error);
    }
});

// helper function: tests for any non-numbers in a given string
function onlyNumbers(str) {
    return /^[0-9,]+$/.test(str);
}
// helper function: finds the mean
function getMean(nums) {
    const sum = nums.reduce((num, accum) => num + accum, 0);
    return sum / nums.length;
}
// helper function: finds the median
function getMedian(nums) {
    const a = nums.sort((a,b)=>a-b);
    let median;
        if(a.length % 2 !== 0) {
            median = a[Math.floor(a.length/2)]
        } else {
            median = (a[Math.floor(a.length/2 - 1)] + a[Math.floor(a.length/2)])/2
        }
    return median
}
// helper function: finds the mode
function getMode(nums) {
    const mode = Object.values(nums.reduce((count, e) => {
        if (!(e in count)) {
            count[e] = [0, e];
        }
        count[e][0]++;
        return count;
        }, {})).reduce((a, v) => v[0] < a[0] ? a : v, [0, null])[1];
    return mode
}

app.use((re, res, next) => {
    const error = new ExpressError('Page not found', 404);
    next(error);
});


app.use(function (error, req, res, next){
    let status = error.status || 500;
    let message = error.msg;

    return res.status(status).json({
        error: {message, status}
    });
});

app.listen(3000, () => {
    console.log('Server started on Port 3000')
});