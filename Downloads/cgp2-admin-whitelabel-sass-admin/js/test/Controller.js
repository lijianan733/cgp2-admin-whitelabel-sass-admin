function expression(args) {
    var index = 1;
    var valueObj = {
        "cover": "cover",
        "months": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        "format": "{month} {year}"
    };
    var getStartMonth = function expression(args) {
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
        return '2021-9';
    };
    if (index == 0) {
        return valueObj.cover;
    } else {
        var startMonth = getStartMonth(args);
        startMonth = startMonth.split('-');
        var months = valueObj.months, month = startMonth[1], year = startMonth[0],
            date = new Date(year, Number(month) + index-1);
        console.log(Ext.Date.format(date,'Y/m/d'));
        var result = valueObj.format.replace(/{month}/, months[date.getMonth()]);
        result = result.replace(/{year}/, date.getFullYear());
        return result
    }
};
expression();
