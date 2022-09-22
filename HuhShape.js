/*
Implemention of log-radius profile representation of convex curves described in:
1. Huh, D. (2015). The vector space of convex curves: How to mix shapes.
    arXiv preprint arXiv:1506.07515.
2. Huh, D., & Sejnowski, T. J. (2015). Spectrum of power laws for curved hand
movements. Proceedings of the National Academy of Sciences, 112(29), E3950-E3958.
*/

class HuhShape {

    constructor(m, n, eps=1, p=0) {
        /*
            m =     rotational symmetry (number of max-curvature points)
            n =     period size
            eps =   eccentricity
            p =     phase offset (relative to native phase)

            m & n must be co-prime integers.
        */

        if (!Array.isArray(n)) {
            this.m = [m];
            this.n = [n];
            this.eps = [eps];
            this.p = [p];
        } else {
            this.m = m;
            this.n = n;
            this.eps = eps;
            this.p = p;
        }

        this.nu = [];
        this.phase = [];
        for (let i = 0; i < this.n.length; i++) {
            this.nu.push(this.m[i] / this.n[i]);
            let nativePhase = 0;
            if (this.m[i] > 0) {
                nativePhase = .5 * Math.PI / this.nu[i] - (1 / this.m[i]) * Math.PI;
            }
            this.phase.push(nativePhase - this.p[i]);
        }

        // --
        // estimate period length:
        const maxPeriod = Math.min(this.n.reduce((a, b) => a * b), 50);
        this.period = 2 * Math.PI * maxPeriod;
        for (let k = Math.max.apply(null, this.n); k <= maxPeriod; k++)
        {   
            let areCommonDivisors = true;
            for (let i = 0; i < this.n.length; i++) {
                if (k % this.n[i] != 0) {
                    areCommonDivisors = false;
                    break;
                }
            }
            if (areCommonDivisors) {
                this.period = 2 * Math.PI * k;
                break;
            }
        }
        // --

    }
    
    get numComponents() {
        return this.n.length;
    }

    get beta() {
        // predicted powerlaw betas for shape-
        let result = []
        for (const v of this.nu) {
            result.push((2 / 3) * (1 + .5 * v ** 2) / (1 + v ** 2 + (v ** 4) / 15))
        }
        return result;
    }

    plus(other) {
        return new HuhShape(
            this.m.concat(other.m),
            this.n.concat(other.n),
            this.eps.concat(other.eps),
            this.p.concat(other.p));
    }

    mult(scalar) {
        let newEps = [];
        for (let i = 0; i < this.numComponents; i++) {
            newEps.push(this.eps[i] * scalar);
        }
        return new HuhShape(this.m, this.n, newEps, this.p);
    } 

    fullPeriodThetas() {
        let dtheta = .5 * Math.PI / 180;
        let thetas = [];
        for (let theta = 0; theta <= (dtheta + this.period); theta += dtheta) {
            thetas.push(theta);
        }
        return thetas;
    }

    logRadius(thetas) {
        if (thetas == null) {
            thetas = this.fullPeriodThetas();
        }
        let logR = [];
        for (let i = 0; i < thetas.length; i++) {
            logR.push(0);
            for (let j = 0; j < this.numComponents; j ++) {
                logR[i] += this.eps[j] * Math.sin(this.nu[j] * (thetas[i] - this.phase[j]));
            }
        }
        return logR;
    }

    curvePoints(center=true) {
        let thetas = this.fullPeriodThetas();
        let logR = this.logRadius(thetas);
        let x = 0;
        let y = 0;
        let points = [];
        let dtheta = 0;
        let avg = {x: 0, y: 0};
        for (let i = 0; i < thetas.length; i++) {
            if (i < thetas.length - 1) {
                dtheta = thetas[i + 1] - thetas[i];
            }
            let rho = 2 * Math.sin(.5 * dtheta) * Math.exp(-logR[i]);
            x += rho * Math.cos(thetas[i]);
            y += rho * Math.sin(thetas[i]);
            points.push({x: x, y: y});
            avg.x += x;
            avg.y += y;
        }

        if (center) {
            avg.x /= points.length;
            avg.y /= points.length;
            for (let point of points) {
                point.x -= avg.x;
                point.y -= avg.y;
            }
        }
        return points;
    }

}

function addHuhShapes(shapes, avg=true) {
    let weight = avg ? (1 / shapes.length) : 1;
    let sumShape = shapes[0].mult(weight);
    for (let i = 1; i < shapes.length; i++) {
        sumShape = sumShape.plus(shapes[i].mult(weight));
    }
    return sumShape;
}
