/**
 * Created by nan on 2018/4/17.
 */
Ext.define('CGP.partner.view.supportableproduct.controller.Controller', {
    manageDeliveryMethodConfig: function (partnerId, productId, websiteId) {
        var record = Ext.create('CGP.partner.view.supportableproduct.model.PartnerSupportProductDeliverConfigModel');
        record.set('productId', productId);
        var partnerSupportedConfigId = '';
        Ext.Ajax.request({
            url: adminPath + 'api/partners/' + partnerId + '/producer/configs',
            method: 'GET',
            async: false,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    partnerSupportedConfigId = responseMessage.data._id;
                    record.set('partnerSupportedConfigId', responseMessage.data._id)
                }
            }
        });
        var partnerSupportProductDeliverConfigStore = Ext.create('CGP.partner.view.supportableproduct.store.PartnerSupportProductDeliverConfigStore', {
            params: {
                filter: '[{"name":"partnerSupportedConfigId","value":"' + partnerSupportedConfigId + '","type":"string"},{"name":"productId","value":' + productId + ',"type":"number"}]'
            },
            listeners: {
                load: function (store) {
                    record = store.getAt(0) || record;//获取到记录
                    if (store.count() > 0) {
                        /*  var form = view.getComponent('form');
                         var deliveryMethodType = form.getComponent('deliveryMethodType');
                         var receiveAddressId = form.getComponent('receiveAddressId');
                         deliveryMethodType.setValue(record.get('deliveryMethodType'));
                         receiveAddressId.store.on('load', function () {
                         receiveAddressId.setSubmitValue(record.get('receiveAddressId'));
                         })*/
                    }
                    var method = store.count() > 0 ? 'PUT' : 'POST';
                    var win = Ext.create('CGP.partner.view.supportableproduct.view.ReceiveAddressWindow', {
                        method: method,
                        record: record,
                        websiteId: websiteId
                    });
                    win.show();
                }
            }
        });


    },
    searchProduct: function () {
        var me = this;
        var queries = [];
        var items = this.ownerCt.items.items;
        var store = this.ownerCt.ownerCt.getStore();
        var params = {};
        queries.push({"name":"type","value":"%sku%","type":"string"})
        for (var i = 0; i < items.length; i++) {
            var query = {};
            if (items[i].xtype == 'button')
                continue;
            if (Ext.isEmpty(items[i].value))
                continue;
            query.name = items[i].name;
            if (!Ext.isEmpty(items[i].isLike) && !items[i].isLike) {
                query.value = items[i].getValue();
            } else if (Ext.isEmpty(items[i].isLike) || items[i].isLike) {
                query.value = '%' + items[i].getValue() + '%'
            }
            if (items[i].xtype == 'numberfield') {
                query.type = 'number';

            } else {
                query.type = 'string';
            }
            queries.push(query);
            //添加对应的websiteId过滤
        }

        if (queries.length > 0) {
            store.proxy.extraParams = {
                filter: Ext.JSON.encode(queries)
            }
        } else {
            store.proxy.extraParams = {
                filter: Ext.JSON.encode([{"name":"type","value":"%sku%","type":"string"}])
            }
        }
        store.loadPage(1);
    },
    clearParams: function () {
        var me = this;
        var items = this.ownerCt.items.items;
        var store = this.ownerCt.ownerCt.getStore();

        for (var i = 0; i < items.length; i++) {
            if (items[i].xtype == 'button')
                continue;
            if (Ext.isEmpty(items[i].value))
                continue;
            items[i].setValue('');
        }

        store.proxy.extraParams = {
            filter: Ext.JSON.encode([
                [{"name":"type","value":"%sku%","type":"string"}]
            ])
        }
    }
})