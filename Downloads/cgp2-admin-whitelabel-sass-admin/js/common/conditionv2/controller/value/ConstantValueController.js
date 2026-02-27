/**
 * @Description:
 * @author nan
 * @date 2022/9/27
 */
Ext.define('CGP.common.conditionv2.controller.value.ConstantValueController', {
    extend: 'CGP.common.conditionv2.controller.SubController',
    generate: function () {
        var me = this;
        var data = me.model.raw;
        var value = data.value;
        var valueType = data.valueType;
        if (valueType == 'String') {
            value = '"' + value + '"'
        } else if (valueType == 'Number') {

        } else if (valueType == 'Boolean') {

        } else if (valueType == 'Array') {
            if (Ext.isArray(value)) {
                value = value.map(function (item) {
                    return '"' + item + '"';
                });
                value = '[' + value.toString() + ']';
            }
        } else if (valueType == 'Null') {

        }

        return value;
    }
})
