/**
 * Created by nan on 2020/3/26.
 */
Ext.define("CGP.virtualcontainertype.view.condition.OutPanel", {
    extend: 'Ext.panel.Panel',
    alias: 'widget.outpanel',
    layout: 'border',
    border: false,
    rawData: null,
    getValue: function () {
        var me = this;
        return me.getComponent('leftTree').getValue();
    },
    setValue: function (data) {
        var me = this;
        var leftTree = me.getComponent('leftTree');
        leftTree.setValue(data);
    },
    isValid: function () {
        return true;
    },
    getName: function () {
        return this.name;
    },
    initComponent: function () {
        var me = this;
        var leftTree = Ext.create('CGP.virtualcontainertype.view.condition.LeftTreePanel', {
            region: 'west',
            itemId: 'leftTree',
            width: 300
        });
        var centerGrid = Ext.create('CGP.virtualcontainertype.view.condition.CenterGrid', {
            region: 'center',
            itemId: 'centerGrid',
            width: 500,
            height: 500,
        });
        me.items = [leftTree, centerGrid];
        me.callParent();
    }
})
