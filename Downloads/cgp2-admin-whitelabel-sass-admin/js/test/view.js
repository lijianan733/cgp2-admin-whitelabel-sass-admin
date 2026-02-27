function expression(args) {
    function equal(arr1, arr2) {
        var flag = true;
        if (arr1.length !== arr2.length) {
            flag = false
        } else {
            arr1.forEach(function (item, index, arr) {
                if (arr2.indexOf(item) === -1) {
                    flag = false
                }
            })
        }
        return flag
    };

    function isContained(aa, bb) {
        if (aa == null && aa == undefined) {
            return false
        }
        ;
        for (var i = 0; i < bb.length; i++) {
            var flag = false;
            for (var j = 0; j < aa.length; j++) {
                if (aa[j] == bb[i]) {
                    flag = true;
                    break;
                }
            }
            if (flag == false) {
                return flag;
            }
        }
        return true;
    };
    if (equal(args.context['9352096'], [9352097])) {
        return ['Linen Finish']
    }
    ;
    if (equal(args.context['9352096'], [9352097, 9352099])) {
        return ['Linen Finish', 'Gold Foil Stamping']
    }
    ;
    if (equal(args.context['9352096'], [9352097, 9352098])) {
        return ['Linen Finish', 'Silver Foil Stamping']
    }
    ;
    if (equal(args.context['9352096'], [9352097, 9352098, 9352099])) {
        return ['Linen Finish', 'Gold Foil Stamping', 'Silver Foil Stamping']
    }
    ;
    if (equal(args.context['9352096'], [9352099])) {
        return ['Gold Foil Stamping']
    }
    ;
    if (equal(args.context['9352096'], [9352098])) {
        return ['Silver Foil Stamping']
    }
    ;
    if (equal(args.context['9352096'], [9352098, 9352099])) {
        return ['Gold Foil Stamping', 'Silver Foil Stamping']
    }
    ;
    if (isContained([9352097, 9352098, 9352099], args.context[9352096])) {
        return []
    }
    ;
}