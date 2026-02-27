/**
 * Created by nan on 2020/8/1.
 */
Ext.define('CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.view.ViewConfigPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.viewconfigpanel',
    layout: 'border',
    frame: false,
    border: false,
    createOrEdit: 'create',
    navigationDTOId: null,
    productViewConfigId: null,
    recordData: null,
    controller: Ext.create('CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.controller.Controller'),
    /**
     * 获取实时完整数据
     */
    getCurrentValue: function () {
        var me = this;
        var centerPanel = me.getComponent('centerBuilderViewConfigPanel');
        var treePanel = me.getComponent('navigationTree');
        var controller = me.controller;
        var currentData = null;
        if (centerPanel.record) {
            var data = centerPanel.getValue();
            centerPanel.record.set('editViewConfigDTO', data);
            currentData = treePanel.getValue();
            //界面数据更新到componentArr
            controller.builderComponentArr(currentData);
        }
        currentData = treePanel.getValue();
        return currentData;
    },
    initComponent: function () {
        var me = this;
        me.items = [
            Ext.create('CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.view.NavigationTree', {
                region: 'west',
                itemId: 'navigationTree',
                id: 'navigationTree',
                width: 400,
                navigationDTOId: me.navigationDTOId,
                recordData: me.recordData,
                productViewConfigId: me.productViewConfigId,
            }),
            Ext.create('CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.view.CenterBuilderViewConfigPanel', {
                region: 'center',
                navigationDTOId: me.navigationDTOId,
                recordData: me.recordData,
                productViewConfigId: me.productViewConfigId,
                itemId: 'centerBuilderViewConfigPanel',
                id: 'centerBuilderViewConfigPanel'
            }),
        ];
        me.callParent();
    }
})
