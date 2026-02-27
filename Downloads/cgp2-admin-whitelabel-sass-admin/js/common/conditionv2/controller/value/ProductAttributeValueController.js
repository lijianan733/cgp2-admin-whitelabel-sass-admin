/**
 * @Description: 一般作为左值，指明一个属性
 * @author nan
 * @date 2022/9/27
 */
Ext.define('CGP.common.conditionv2.controller.value.ProductAttributeValueController', {
    extend: 'CGP.common.conditionv2.controller.SubController',
    contextStore: null,//必填
    generate: function () {
        var controller = this;
        var data = controller.model.raw;
        if (Ext.isEmpty(controller.contextStore)) {
            console.error('controller.contextStore缺失');
        }
        var record = controller.contextStore.findRecord('key', data.attributeId);
        if (record.get('allowArgsToAttrs')) {
            var result = 'attrs["' + record.get('code') + '"]';
            return result;
        } else {
            var result = record.get('path') + '["' + data.attributeId + '"]';
            return result;
        }
    }
})