function expression(args) {
    var printers = args[0];
    var materials = args[1];
    var printings = args[2];
    var technologies = args[3];
    var packings = args[4];
    var attr = args[5];
    var qty = args[6];
    var qtyPercents = args[7];
    this.rounding = function (n) {
        return Number(n.toFixed(3))
    };
    this.getOpenSizeNum = function (p, a) {
        var n1 = Math.floor(p.printSize.l / a.openSize.l) * Math.floor(p.printSize.w / a.openSize.w);
        var n2 = Math.floor(p.printSize.l / a.openSize.w) * Math.floor(p.printSize.w / a.openSize.l);
        return Math.max(n1, n2)
    };
    this.getLots = function (n) {
        return n > 0 ? Math.ceil(2 * qty / n) : 0
    };
    this.findQtyCost = function (l, q) {
        var m;
        for (var i in l) {
            var o = l[i];
            if (o.qty == q) {
                return o.cost
            } else if (o.qty > q) {
                return m.cost
            } else {
                m = l[i]
            }
        }
        return m ? m.cost : 0
    };
    this.getMaterialBaseCost = function (p, m) {
        return rounding(p.paperSize.l * p.paperSize.w * m.weight * m.cost * 1.2 / 1333 / 500)
    };
    this.getTechnologyCost = function (t, i, n) {
        var tech = t.technologies[i];
        var tCost = findQtyCost(tech.costs, n);
        return Math.max(tCost * n, tech.moq)
    };
    this.getTotalCost = function () {
        var arr = [];
        var pps = [];
        for (var i in printers) {
            var p = printers[i];
            var num = getOpenSizeNum(p, attr);
            var pp = {printer: p, openSizeNum: num, qty: qty};
            if (p.filter(attr) && num > 0) {
                var lot = getLots(num);
                var techNum = num > 1 ? lot : qty;
                pp.lot = lot;
                pp.techNum = techNum;
                var cost = 0;
                pp.materials = [];
                for (var j in materials) {
                    var m = materials[j];
                    var mCost = getMaterialBaseCost(p, m) * lot;
                    cost += mCost;
                    pp.materials.push({name: m.name, result: mCost})
                }
                pp.printings = [];
                for (var j in printings) {
                    var print = printings[j];
                    var index = print.selector(p, num);
                    if (index != null) {
                        var pCost = getTechnologyCost(print, index, techNum);
                        cost += pCost;
                        pp.printings.push({group: print.group, name: print.technologies[index].name, result: pCost})
                    }
                }
                pp.technologies = [];
                for (var j in technologies) {
                    var techno = technologies[j];
                    var tArr = techno.selector(attr, num);
                    if (tArr) {
                        for (var k in tArr) {
                            var tCost = getTechnologyCost(techno, tArr[k], techNum);
                            cost += tCost;
                            pp.technologies.push({
                                group: techno.group,
                                name: techno.technologies[tArr[k]].name,
                                result: tCost
                            })
                        }
                    }
                }
                pp.packings = [];
                for (var j in packings) {
                    var pk = packings[j];
                    var pCost = findQtyCost(pk.costs, qty) * qty;
                    cost += pCost;
                    pp.packings.push({name: pk.name, result: pCost})
                }
                arr.push(cost);
                pp.cost = cost
            }
            pps.push(pp)
        }
        return Math.round(Math.min.apply(null, arr))
    };
    this.findQtyGP = function (l, q) {
        var m;
        for (var i in l) {
            var o = l[i];
            if (o.qty == q) {
                return o.gp
            } else if (o.qty > q) {
                return m.gp
            } else {
                m = l[i]
            }
        }
        return m ? m.gp : 0
    };
    this.getUnitPrice = function () {
        var cost = getTotalCost();
        var gp = findQtyGP(qtyPercents, qty);
        return Number((cost / 7.8 / qty / (1 - gp)).toFixed(2))
    };
    return getUnitPrice()
}