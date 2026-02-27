function expression(arg) {
    var p = arg.product;
    var gps = [[{qty: 1, gp: 0.75}, {qty: 2, gp: 0.70}, {qty: 6, gp: 0.65}, {qty: 30, gp: 0.6}, {
        qty: 50,
        gp: 0.55
    }, {qty: 100, gp: 0.50}, {qty: 250, gp: 0.50}, {qty: 500, gp: 0.50}, {qty: 1000, gp: 0.45}, {
        qty: 2000,
        gp: 0.40
    }, {qty: 2500, gp: 0.35}, {qty: 5000, gp: 0.3}, {qty: 7500, gp: 0.30}, {qty: 10000, gp: 0.25}, {
        qty: 12500,
        gp: 0.25
    }, {qty: 15000, gp: 0.25}, {qty: 20000, gp: 0.2}, {qty: 50000, gp: 0.2}], [{qty: 1, gp: 0.8}, {
        qty: 2,
        gp: 0.75
    }, {qty: 6, gp: 0.7}, {qty: 30, gp: 0.65}, {qty: 50, gp: 0.60}, {qty: 100, gp: 0.55}, {
        qty: 250,
        gp: 0.55
    }, {qty: 500, gp: 0.55}, {qty: 1000, gp: 0.50}, {qty: 2000, gp: 0.45}, {qty: 2500, gp: 0.40}, {
        qty: 5000,
        gp: 0.35
    }, {qty: 7500, gp: 0.35}, {qty: 10000, gp: 0.30}, {qty: 12500, gp: 0.30}, {qty: 15000, gp: 0.30}, {
        qty: 20000,
        gp: 30
    }, {qty: 50000, gp: 30}]];
    var getAttr = function (id) {
        for (var i = 0; i < p.attributeValues.length; i++) {
            if (p.attributeValues[i].attribute.id == id || p.attributeValues[i].attribute.id == id.toString()) {
                return p.attributeValues[i]
            }
        }
    };
    var foldStyleValue = getAttr(9352030).optionIds;
    return foldStyleValue == 9352032 ? gps[1] : gps[0];
}