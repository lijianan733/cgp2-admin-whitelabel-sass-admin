/**
 * @author xiu
 * @date 2023/2/20
 */
Ext.Loader.setConfig({
    paths: {
        'partner.productSupplier': path + 'js/partner/view/productsupplier',
    },
    disableCaching: false,
    enabled: true
})
Ext.Loader.syncRequire([
    'partner.productSupplier.view.EditPanel',
    'partner.productSupplier.controller.Controller'
])
Ext.onReady(function () {
    var data = {};
    var partnerId = JSGetQueryString('partnerId');
    var url = adminPath + 'api/manufactures/partner/' + partnerId;
    var controller = Ext.create('partner.productSupplier.controller.Controller');
    JSSetLoading(true);
    JSAjaxRequest(url, 'GET', false, null, null, function (require, success, response) {
        JSSetLoading(false);
        if (success) {
            var responseText = Ext.JSON.decode(response.responseText);
            if (responseText.success) {
                data = responseText.data;
                controller.isPOST = Ext.Object.isEmpty(data);
                !controller.isPOST && (controller.queryDataId = data.id);
            }
        }
    })
    Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [
            {
                xtype: 'edit_panel',
                queryData: data,
                controller: controller,
                isEmpty: Ext.Object.isEmpty(data)
            }
        ]
    })
})