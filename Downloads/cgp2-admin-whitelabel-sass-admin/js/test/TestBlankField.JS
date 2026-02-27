function expression(arg) {
    var p = arg.product;
    this.getAttr = function (id) {
        for (var i in p.attributeValues) {
            if (p.attributeValues[i].attribute.id == id || p.attributeValues[i].attribute.id == id.toString()) {
                return p.attributeValues[i]
            }
        }
    };
    var materials = [{
        id: 1410541,
        materials: [{name: 'cover', weight: 157, cost: 3}, {name: 'body', weight: 600, cost: 2.55}, {
            name: 'liner',
            weight: 250,
            cost: 2.65
        }]
    }, {
        id: 1410544,
        materials: [{name: 'cover', weight: 157, cost: 3}, {name: 'body', weight: 1000, cost: 2.25}, {
            name: 'liner',
            weight: 100,
            cost: 2.7
        }]
    }, {
        id: 1410543,
        materials: [{name: 'cover', weight: 157, cost: 3}, {name: 'body', weight: 1300, cost: 2.35}, {
            name: 'liner',
            weight: 100,
            cost: 2.7
        }]
    }, {
        id: 1410542,
        materials: [{name: 'cover', weight: 157, cost: 3}, {name: 'body', weight: 1600, cost: 2.5}, {
            name: 'liner',
            weight: 100,
            cost: 2.7
        }]
    }];
    var m = getAttr(1410540);
    if (m) {
        for (var i in materials) {
            var material = materials[i];
            if (m.optionIds == material.id || m.optionIds.toString() == material.id.toString()) {
                return material.materials
            }
        }
    }
    return materials[3].materials
}