/**
 * Created by nan on 2020/2/24.
 * 编辑状态下不能修改源和目标mvtsource
 */

Ext.onReady(function () {
    var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
    var designId = JSGetQueryString('designId');
    var recordId = JSGetQueryString('recordId');
    var createOrEdit = recordId ? 'edit' : 'create';
    var clazz = JSGetQueryString('clazz');
    var controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.controller.Controller');
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit'
    });
    if (clazz == 'MaterialViewTypePreprocessConfig') {//自定义的预处理
        var tab = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.CustomizeConfigTab', {
            recordId: recordId,
            designId: designId,
            clazz: clazz,
            builderConfigTab: builderConfigTab,
            createOrEdit: createOrEdit,
            controller: controller
        });
        page.add(tab);
    } else {//特例化得预处理
        var tab = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.SpecialConfigTab', {
            recordId: recordId,
            designId: designId,
            clazz: clazz,
            builderConfigTab: builderConfigTab,
            createOrEdit: createOrEdit,
            controller: controller
        });
        page.add(tab);
    }
});
