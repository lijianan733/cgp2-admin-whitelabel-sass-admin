/**
 * Created by nan on 2018/8/28.
 */
Ext.define('CGP.useableauthoritymanage.view.RightPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.rightpanel',
    layout: 'border',
    region: 'center',
    itemId: 'rightPanel',
    initComponent: function () {
        var me = this;
        var operationStore = Ext.create('CGP.resourcesoperation.store.ResourcesOperationStore', {});
        var resourcesStore = Ext.create('CGP.resourcesmanage.store.ResourcesStore', {});
        var dataStore = Ext.create('CGP.useableauthoritymanage.store.UseableAuthorityManageStore', {});//源数据
        var treePanel = Ext.create("CGP.useableauthoritymanage.view.Navigation", {dataStore: dataStore});
        var dataStore2 = Ext.create('CGP.useableauthoritymanage.store.UseableAuthorityManageStore', { });//源数据
        var centerPanel = Ext.create('CGP.useableauthoritymanage.view.CenterPanel', {
            createOrEdit: 'create',
            operationStore: operationStore,
            resourcesStore: resourcesStore,
            type: 'atomPrivilege',
            authorityStore: dataStore2
        });
        me.items = [treePanel, centerPanel]
        me.callParent();
    }
})