/**
 * Created by nan on 2021/9/9
 */
Ext.Loader.syncRequire([
    'CGP.pcresourcelibrary.view.LeftNavigateTree',
    'CGP.pcresourcelibrary.view.PCResourceItemGridV2'
])
Ext.define('CGP.pcresourcelibrary.view.OutPanel', {
    extend: "Ext.panel.Panel",
    resourceLibraryId: null,
    layout: 'border',
    resourceType: null,
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'leftnavigatetree',
                width: 350,
                resourceType: me.resourceType,
                resourceLibraryId: me.resourceLibraryId
            },
            {
                xtype: 'panel',
                region: 'center',
                itemId: 'centerPanel',
                layout: 'fit',
                items: [
                    {
                        xtype: 'pcresourceitemgridv2',
                        itemId: 'resourceItemGrid',
                        hidden: true,
                        resourceType: me.resourceType,
                        resourceLibraryId: me.resourceLibraryId
                    }
                ],
                refreshData: function (data) {
                    var me = this;
                    var resourceItemGrid = me.getComponent('resourceItemGrid');
                    var categoryId = data._id;
                    var toolbar = resourceItemGrid.filter;
                    var category = toolbar.getComponent('category');
                    category.setInitialValue([categoryId]);
                    resourceItemGrid.show();
                    resourceItemGrid.categoryId = categoryId;
                    category.hide();
                    setTimeout(function () {
                        resourceItemGrid.grid.store.load();
                    }, 300)
                }
            }

        ]
        me.callParent();
    }
})