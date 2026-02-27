/**
 * Created by nan on 2020/5/21.
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3test.view.SMUInfoTab', {
    extend: 'Ext.tab.Panel',
    data: null,
    refreshData: function (data, isLeaf, parentId) {
        var me = this;
        var type = data.type;
        me.data = data;
        data.isLeaf = isLeaf;
        if (!me.componentInit) {
            me.addItem(data);
        }
        Ext.Array.each(me.items.items, function (item) {
            item.refreshData(data);
        });
        me.setActive(me.items.items[0]);

    },
    addItem: function (data) {
        var me = this;
        var bomItem = Ext.create('CGP.material.view.information.BomItem', {
            data: me.data,
        });
        var spuRtType = Ext.create('CGP.material.view.information.SpuRtTypeObject');
        var packageQty = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3test.view.PackageQty');
        me.add([spuRtType, bomItem,packageQty]);
        me.componentInit = true;
    },
    initComponent: function () {
        var me = this;
        me.callParent();
    }
})
