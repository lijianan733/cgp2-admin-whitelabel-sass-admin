function expression(args) {
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

    function equal(arr1, arr2) {
        var flag = true;
        if(arr1 == '' || arr1 == undefined ||arr1 == null){return arr2.length == 0;};
        if (arr1.length !== arr2.length) {
            flag = false
        } else {
            arr1.forEach(function (item, index, arr) {
                if (!isContained(arr2, [item])) {
                    flag = false
                }
            })
        }
        return flag
    };
    return (equal(args.context.lineItems[0].productAttributeValueMap['1445185'], [1575780]) == true)
}
