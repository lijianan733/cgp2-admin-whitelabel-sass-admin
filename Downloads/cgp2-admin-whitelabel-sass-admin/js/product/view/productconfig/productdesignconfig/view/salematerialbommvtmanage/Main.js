/**
 * Created by nan on 2019/7/10.
 * 以树状的层次结构管理简易的bom节点配置,
 * 不同的productDesign版本对应一个productBom配置Id,
 * 根据Bom配置id找到对应的物料，该物料的Bom结构就是进行简易化的依据，
 * 根节点的sbomPath为其对应的物料，其余子节点的sbomPath为1其对应的物料节点到根节点的路径，不包含根节点
 */
Ext.Loader.syncRequire([
    'CGP.product.view.productconfig.productbomconfig.model.ProductBomConfigModel'
]);
Ext.onReady(function () {
    var productDesignId = JSGetQueryString('productConfigDesignId');
    var productBomConfigId = JSGetQueryString('productBomConfigId');
    var materialId = JSGetQueryString('materialId');
    var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
    var page = Ext.create('Ext.container.Viewport', {
        title: "simplifyBomNode",
        layout: "border",
        defaults: {
            split: true,
            hideCollapseTool: true
        }
    });
    var materialName = '';
    var materialType = '';
    Ext.Ajax.request({
        url: adminPath + 'api/materials/' + materialId,
        method: 'GET',
        async: false,
        headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
        success: function (resp) {
            var response = Ext.JSON.decode(resp.responseText);
            var success = response.success;
            if (success) {
                var data = response.data;
                materialName = data.name;
                if (data.clazz == 'com.qpp.cgp.domain.bom.MaterialType') {
                    materialType = 'MaterialType'
                } else if (data.clazz == 'com.qpp.cgp.domain.bom.MaterialSpu') {
                    materialType = 'MaterialSpu'
                }
            } else {
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        },
        failure: function (resp) {
            var response = Ext.JSON.decode(resp.responseText);
            Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
        }
    });
    var treePanel = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.salematerialbommvtmanage.view.BomTree', {
        productConfigDesignId: productDesignId,
        productBomConfigId: productBomConfigId,
        materialId: materialId,
        materialName: materialName,
        materialType: materialType,
        builderConfigTab: builderConfigTab
    });
    var centerPanel = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.salematerialbommvtmanage.view.EditTab', {
        productConfigDesignId: productDesignId,
        productBomConfigId: productBomConfigId,
        materialId: materialId,
        builderConfigTab: builderConfigTab
    });
    page.add([treePanel, centerPanel]);
})
