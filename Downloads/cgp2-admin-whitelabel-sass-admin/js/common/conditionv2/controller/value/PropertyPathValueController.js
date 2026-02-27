/**
 * @Description:
 * @author nan
 * @date 2022/9/27
 */
Ext.define('CGP.common.conditionv2.controller.value.PropertyPathValueController', {
    extend: 'CGP.common.conditionv2.controller.SubController',
    generate: function () {
        var controller = this;
        var data = controller.model.raw;
        return data.value;
    }
})