/**
 * Created by nan on 2020/5/21.
 * 校验物料是否符合预期的tab,
 * 包括左边的smu物料结构树，和右边的spu属性，bomItem展示页
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3test.view.ValidMaterialPanel', {
    extend: 'Ext.panel.Panel',
    layout: {
        type: 'border'
    },
    isReadOnly: false,
    initComponent: function () {
        var me = this;
        var recordId = JSGetQueryString('recordId');
        var MMTId = JSGetQueryString('MMTId');
        var controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3test.controller.Controller');
        var MMTDetail = controller.getMMDetail(MMTId);
        var SMUBomTree = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3test.view.SMUBomTree', {
            region: 'west',
            id: 'SMUBomTree',
            isReadOnly:me.isReadOnly,
            recordId: recordId,
            MMTDetail: MMTDetail
        });
        var SMUInfoTab = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3test.view.SMUInfoTab', {
            region: 'center',
            id: 'SMUInfoTab',
            isReadOnly:me.isReadOnly,
            recordId: recordId,
            MMTDetail: MMTDetail
        });
        me.items = [SMUBomTree, SMUInfoTab];
        me.callParent();
    }
})
