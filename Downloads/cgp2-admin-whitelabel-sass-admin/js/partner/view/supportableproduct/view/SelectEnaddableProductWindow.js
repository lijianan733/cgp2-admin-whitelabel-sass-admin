/**
 * Created by nan on 2018/4/28.
 */
Ext.define('CGP.partner.view.supportableproduct.view.SelectEnaddableProductWindow', {
    extend: 'Ext.window.Window',
    title: '选择产品',
    height: 150,
    modal: true,
    width: 400,
    layout: 'fit',
    initComponent: function () {
        var me = this;
        var unAddProductStore = Ext.create('CGP.partner.view.supportableproduct.store.AddAbleSupportableProductStore', {
            partnerId: me.partnerId,
            params: {
                filter: '[{"name":"type","value":"%sku%","type":"string"}]'
            }
        });
        me.items = {
            xtype: 'form',
            border: false,
            layout: {
                type: 'vbox',
                align: 'center',
                pack: 'center'

            },
            bbar: [
                '->',
                {
                    text: i18n.getKey('ok'),
                    iconCls: 'icon_agree',
                    handler: function (btn) {
                        var form = btn.ownerCt.ownerCt;
                        var addProducts = form.getComponent('product');
                        var addProductsArray = addProducts.getSubmitValue();
                        btn.setDisabled(true);
                        if (form.isValid()) {
                            var myMask = new Ext.LoadMask(me.page, {msg: "Please wait..."});
                            Ext.Ajax.request({
                                url: adminPath + 'api/partners/' + me.partnerId + '/supportedProducts',
                                headers: {
                                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                                },
                                jsonData: addProductsArray,
                                success: function (response) {
                                    var responseMessage = Ext.JSON.decode(response.responseText);
                                    if (responseMessage.success) {
                                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'), function () {
                                            btn.setDisabled(false);
                                            me.page.grid.getStore().load();
                                            me.close();
                                            myMask.hide();
                                        });

                                    } else {
                                        Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                        btn.setDisabled(false);
                                        myMask.hide();
                                    }
                                },
                                failure: function (response) {
                                    var responseMessage = Ext.JSON.decode(response.responseText);
                                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                    btn.setDisabled(false);
                                    myMask.hide();
                                }
                            });
                        }
                    }
                },
                {
                    text: i18n.getKey('cancel'),
                    iconCls: 'icon_cancel',
                    handler: function (btn) {
                        me.close();
                    }
                }
            ],
            items: [
                {
                    name: 'product',
                    xtype: 'gridcombo',
                    itemId: 'product',
                    labelAlign: 'left',
                    allowBlank: false,
                    multiSelect: true,
                    displayField: 'name',
                    valueField: 'id',
                    editable: false,
                    labelWidth: 50,
                    margin: '0 10 0 10',
                    width: '100%',
                    store: unAddProductStore,
                    matchFieldWidth: false,
                    pickerAlign: 'bl',
                    gridCfg: {
                        height: 250,
                        width: 600,
                        selType: 'checkboxmodel',
                        viewConfig: {
                            enableTextSelection: true
                        },
                        columns: [
                            {
                                text: i18n.getKey('id'),
                                width: 80,
                                dataIndex: 'id'
                            },
                            {
                                text: i18n.getKey('name'),
                                width: 200,
                                dataIndex: 'name'
                            },
                            {
                                text: i18n.getKey('sku'),
                                width: 200,
                                dataIndex: 'sku'
                            }
                        ],
                        tbar: {
                            layout: {
                                type: 'column'
                            },
                            defaults: {
                                width: 170,
                                isLike: false,
                                padding: 2
                            },
                            items: [
                                {
                                    xtype: 'numberfield',
                                    fieldLabel: i18n.getKey('id'),
                                    name: 'id',
                                    hideTrigger: true,
                                    isLike: false,
                                    labelWidth: 40
                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: i18n.getKey('sku'),
                                    name: 'sku',
                                    isLike: true,
                                    labelWidth: 40
                                },
                                '->',
                                {
                                    xtype: 'button',
                                    text: i18n.getKey('search'),
                                    handler: me.controller.searchProduct,
                                    width: 80
                                },
                                {
                                    xtype: 'button',
                                    text: i18n.getKey('clear'),
                                    width: 80,
                                    handler: me.controller.clearParams
                                }
                            ]
                        },
                        dockedItems: [
                            {
                                xtype: 'pagingtoolbar',
                                store: unAddProductStore,
                                dock: 'bottom',
                                displayInfo: true
                            }
                        ]
                    }
                }

            ]
        }
        this.callParent(arguments);
    }
});
