/**
 * Created by nan on 2020/3/26.
 */
Ext.define("CGP.product.view.productconfig.productdesignconfig.view.propertysimplifyconfig.view.condition.OutPanel", {
    extend: 'Ext.panel.Panel',
    alias: 'widget.outpanel',
    layout: 'border',
    border: false,
    rawData: null,
    productId: null,
    getValue: function () {
        var me = this;
        return me.getComponent('leftGrid').getValue();
    },
    setValue: function (data) {
        var me = this;
        var leftGrid = me.getComponent('leftGrid');
        leftGrid.setValue(data);
    },
    isValid: function () {
        var me = this;
        var leftGrid = me.getComponent('leftGrid');
        return leftGrid.isValid();
    },
    getErrors: function () {
        var me = this;
        return '该配置必须完备'
    },
    getFieldLabel: function () {
        return  '映射规则'
    },
    getName: function () {
        return this.name;
    },
    initComponent: function () {
        var me = this;
        var leftGrid = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.propertysimplifyconfig.view.condition.LeftGridPanel', {
            region: 'west',
            itemId: 'leftGrid',
            width: 300,
            productId: me.productId,
        });
        var centerGrid = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.propertysimplifyconfig.view.condition.CenterGrid', {
            region: 'center',
            itemId: 'centerGrid',
            width: 500,
            height: 500,
        });
        me.items = [leftGrid, centerGrid];
        me.callParent();
    }
})
