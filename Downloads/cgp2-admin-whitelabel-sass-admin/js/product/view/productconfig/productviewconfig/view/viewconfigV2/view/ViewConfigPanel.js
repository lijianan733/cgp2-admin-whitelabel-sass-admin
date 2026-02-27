/**
 * Created by nan on 2020/8/1.
 */
Ext.define('CGP.product.view.productconfig.productviewconfig.view.viewconfigV2.view.ViewConfigPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.viewconfigpanel',
    layout: 'border',
    frame: false,
    border: false,
    createOrEdit: 'create',
    navigationDTOId: null,
    productViewConfigId: null,
    recordData: null,
    initComponent: function () {
        var me = this;
        me.items = [
            Ext.create('CGP.product.view.productconfig.productviewconfig.view.viewconfigV2.view.NavigationTree', {
                region: 'west',
                itemId: 'navigationTree',
                width: 400,
                navigationDTOId: me.navigationDTOId,
                recordData: me.recordData,
                productViewConfigId: me.productViewConfigId,
            }),
            Ext.create('CGP.product.view.productconfig.productviewconfig.view.viewconfigV2.view.CenterBuilderViewConfigPanel', {
                region: 'center',
                navigationDTOId: me.navigationDTOId,
                recordData: me.recordData,
                productViewConfigId: me.productViewConfigId,
                itemId: 'centerBuilderViewConfigPanel',
            }),
        ];
        me.callParent();
    }
})
