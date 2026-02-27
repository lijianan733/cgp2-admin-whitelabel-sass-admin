/**
 * Created by nan on 2018/7/23.
 */
Ext.define('CGP.partner.view.ecommerceenableproductmanage.controller.Controller', {
    /**
     * 创建添加可以产品的弹窗
     * @param id partner的id
     * @param websiteId partner的所属网站id
     * @param store 展示可以产品界面的store
     */
    addProductWindow: function (partnerId, websiteId, store) {
        var win = Ext.create('CGP.partner.view.ecommerceenableproductmanage.view.AddableProductWindow', {
            partnerId: partnerId,
            outGridStore: store
        });
        win.show();
    },
    patchCreateEnableProduct: function (me) {
        var myMask = new Ext.LoadMask(me, {
            msg: "加载中..."
        });
        if (me.selectedRecord.getCount() > 0) {
            var isAllSetedPrice = Ext.Array.each(me.selectedRecord.getRange(), function (record) {
                if (Ext.isEmpty(record.price)) {
                    return false;
                }
            });
            if (!isAllSetedPrice) {
                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('必须为所有选中的产品设置值，才能进行批量操作！'))
            } else {
                console.log(me.selectedRecord.getRange());
                var jsonData = [];
                Ext.Array.forEach(me.selectedRecord.getRange(), function (record) {
                    jsonData.push({
                        clazz: 'com.qpp.cgp.domain.partner.saler.SalerProductConfig',
                        status: 'OFFLINE',
                        productId: record.id,
                        price: record.price
                    })
                });
                myMask.show();
                Ext.Ajax.request({
                    url: adminPath + 'api/salers/' + me.partnerId + '/productConfigs/batch',
                    method: 'POST',
                    jsonData: jsonData,
                    headers: {
                        Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                    },
                    success: function (response) {
                        var responseMessage = Ext.JSON.decode(response.responseText);
                        if (responseMessage.success) {
                            myMask.hide();
                            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('batchCreate') + i18n.getKey('success'), function () {
                                me.outGridStore.load();
                                me.close();
                            });
                        } else {
                            myMask.hide();
                            Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                        }
                    },
                    failure: function (response) {
                        myMask.hide();
                        var responseMessage = Ext.JSON.decode(response.responseText);
                        Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                    }
                });
            }
        } else {
            Ext.Msg.alert(i18n.getKey('prompt'), '请先选择要添加的产品');
        }

    },
    /**
     * 修改产品价格
     * @param record
     * @param store
     */
    modifyPrice: function (record, store, partnerId) {
        var win = Ext.create('Ext.window.Window', {
            title: i18n.getKey('modifyPrice'),
            height: 150,
            width: 300,
            layout: {
                type: 'vbox',
                align: 'center',
                pack: 'center'
            },
            items: [
                {
                    xtype: 'numberfield',
                    hideTrigger: true,
                    itemId: 'productPrice',
                    minValue: 0
                }
            ],
            bbar: [
                '->',
                {
                    xtype: 'button',
                    text: i18n.getKey('confirm'),
                    iconCls: 'icon_agree',
                    handler: function (view) {
                        var win = view.ownerCt.ownerCt;
                        var value = win.getComponent('productPrice').getValue();
                        if (!Ext.isEmpty(value)) {
                            var jsonData = {
                                '_id': record.getId(),
                                'clazz': 'com.qpp.cgp.domain.partner.saler.SalerProductConfig',
                                'productId': record.get('product').id,
                                'price': value
                            }
                            Ext.Ajax.request({

                                url: adminPath + 'api/salers/' + partnerId + '/productConfigs/' + record.getId(),
                                method: 'PUT',
                                jsonData: jsonData,
                                headers: {
                                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                                },
                                success: function (response) {
                                    var responseMessage = Ext.JSON.decode(response.responseText);
                                    if (responseMessage.success) {
                                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('edit') + i18n.getKey('success'), function () {
                                            store.load();
                                            win.close();
                                        });
                                    } else {
                                        Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                    }
                                },
                                failure: function (response) {
                                    var responseMessage = Ext.JSON.decode(response.responseText);
                                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                }
                            });
                        }
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('cancel'),
                    iconCls: 'icon_cancel',
                    handler: function (view) {
                        win.close();

                    }
                }
            ]
        });
        win.show();
    }
})