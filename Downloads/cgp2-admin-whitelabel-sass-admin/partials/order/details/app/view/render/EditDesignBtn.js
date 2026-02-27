/**
 * @Description: 修改用户设计的按钮
 * @author nan
 * @date 2024/4/18
 */
Ext.define('CGP.orderdetails.view.render.EditDesignBtn', {
    extend: 'Ext.button.Button',
    alias: 'widget.edit_design_btn',
    text: i18n.getKey('edit') + i18n.getKey('userDesign'),
    cls: 'a-btn',
    mode: 'uploadUserDesign',
    // uploadUserDesign上传用户设计文档，
    // changeUserDesign更改用户设计，是两相似但不相同的功能，更改用户设计，需要额外参数orderLineItemUploadStatus
    handler: function () {
        var btn = this;
        var record = btn.record;
        var orderLineItemId = record.getId();
        var productInstanceId = record.get('productInstanceId');
        var controller = Ext.create('CGP.orderlineitem.controller.OrderLineItem');
        var order = controller.getOrder(record.get('orderId'));
        var url = adminPath + 'api/builder/resource/builder/url/latest' +
            '?productInstanceId=' + productInstanceId + '&platform=PC&language=en';
        JSAjaxRequest(url, 'GET', true, null, false, function (require, success, response) {
            if (success) {
                // 2025.11.25 xiu 给修改用户设计与查看用户设计的iframe地址加一个参数 themes=qpmn
                var responseText = Ext.JSON.decode(response.responseText),
                    newUrl = responseText.data;
                
                if (responseText.success) {
                    if (Ext.isEmpty(responseText.data)) {
                        Ext.Msg.alert('提示', '产品无配置的builder地址。')
                    } else {
                        Ext.create('CGP.orderlineitem.view.manualuploaddoc.EditProductInstanceWindow', {
                            orderLineItemId: orderLineItemId,
                            productInstanceId: productInstanceId,
                            builderUrl: responseText.data,
                            order: order,
                            mode: btn.mode
                        }).show();
                    }
                }
            }
        })
    },
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
    },
})