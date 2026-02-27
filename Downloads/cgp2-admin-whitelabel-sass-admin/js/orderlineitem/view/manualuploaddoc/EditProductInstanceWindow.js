Ext.define('CGP.orderlineitem.view.manualuploaddoc.EditProductInstanceWindow', {
    extend: 'Ext.window.Window',
    modal: true,
    layout: 'fit',
    maximized: true,
    maximizable: true,
    animCollapse: true,
    mode: 'uploadUserDesign',
    // uploadUserDesign上传用户设计文档，
    // changeUserDesign更改用户设计，是两相似但不相同的功能，更改用户设计，需要额外参数orderLineItemUploadStatus
    initComponent: function () {
        var me = this;
        me.title = i18n.getKey('builder');
        me.items = [Ext.create('CGP.orderlineitem.view.manualuploaddoc.EditProductInstancePanel', {
            productInstanceId: me.productInstanceId,
            builderUrl: me.builderUrl,
            win: me,
            editOrPreview: me.editOrPreview,
            orderLineItemId: me.orderLineItemId,
            order: me.order,
            mode: me.mode
        })];
        me.callParent(arguments);
    }
});