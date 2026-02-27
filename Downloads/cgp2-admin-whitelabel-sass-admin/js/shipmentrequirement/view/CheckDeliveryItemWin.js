Ext.define('CGP.shipmentrequirement.view.CheckDeliveryItemWin', {
    extend: 'Ext.window.Window',
    width: 1000,
    maxHeight: 700,
    minHeight: 300,
    modal: true,
    layout: 'fit',
    recordClazz: '',
    recordId: '',
    getDeliverItemInfo: function (recordClazz, recordId) {
        var url = '';
        var result = {};
        //获取发货项列表信息
        if (recordClazz == 'com.qpp.cgp.domain.shipment.ShipmentOrder') {//发货单
            url = adminPath + 'api/shipmentOrders' + '/' + recordId;

        } else if (recordClazz = 'com.qpp.cgp.domain.shipment.ShipmentRequirement') {//发货要求
            url = adminPath + 'api/shipmentRequirements' + '/' + recordId;
        }
        JSAjaxRequest(url, 'GET', false, null, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    result = responseText.data;
                }
            }
        });
        return result;
    },
    initComponent: function () {
        var me = this;

        me.title = i18n.getKey('delivery') + i18n.getKey('item') + i18n.getKey('列表');
        var grid = Ext.create('CGP.shipmentrequirement.view.DeliveryItemGridV2', {
            hideItemBar: true,
            itemId: 'batchGrid',
            readOnly: true,
            listeners: {
                afterrender: function (comp) {
                    me.mask();
                    setTimeout(function () {
                        var result = me.getDeliverItemInfo(me.recordClazz, me.recordId);
                        comp.setValue(result.items);
                        me.unmask();
                        me.doLayout();
                    }, 250)

                }
            }
        });
        me.items = [grid];
        me.callParent(arguments);
        me.grid = grid;
    }
})