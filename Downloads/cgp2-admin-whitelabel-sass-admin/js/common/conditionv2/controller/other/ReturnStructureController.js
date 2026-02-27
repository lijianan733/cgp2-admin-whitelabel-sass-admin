/**
 * @Description:返回语句块
 * @author nan
 * @date 2022/9/27
 */
Ext.define('CGP.common.conditionv2.controller.other.ReturnStructureController', {
    extend: 'CGP.common.conditionv2.controller.SubController',
    generate: function () {
        var controller = this;
        var mainController = controller.mainController;
        var data = controller.model.raw;
        var result = 'return (' + mainController.builderController(data.value).generate() + ');';
        return result;
    }
})

