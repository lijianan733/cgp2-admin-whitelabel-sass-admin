/**
 * @Description:
 * @author nan
 * @date 2022/9/27
 */
Ext.define('CGP.common.conditionv2.controller.value.ContextPathValueController', {
    extend: 'CGP.common.conditionv2.controller.SubController',
    generate: function () {
        var controller = this;
        var data = controller.model.raw;
        return data.path;
    }
})