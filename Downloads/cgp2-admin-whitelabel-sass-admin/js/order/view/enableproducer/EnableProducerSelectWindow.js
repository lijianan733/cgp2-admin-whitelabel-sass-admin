/**
 * Created by nan on 2018/3/28.
 */
Ext.define('CGP.order.view.enableproducer.EnableProducerSelectWindow', {
    extend: 'Ext.window.Window',
    title: i18n.getKey('selectSupplier'),
    height: 150,
    width: 400,
    layout: 'fit',
    gridstore: null,
    initComponent: function () {
        var me = this;
        me.items = {
            xtype: 'form',
            border: false,
            itemId: 'form',
            layout: {
                type: 'vbox',
                align: 'center',
                pack: 'center'
            },
            items: [
                {
                    xtype: 'gridcombo',
                    name: 'supplier',
                    allowBlank: false,
                    fieldLabel: i18n.getKey('supplier'),
                    itemId: 'supplier',
                    displayField: 'name',
                    valueField: 'id',
                    autoScroll: true,
                    width: 350,
                    labelWidth: 50,
                    editable: false,
                    labelAlign: 'right',
                    store: me.store,
                    matchFieldWidth: false,
                    gridCfg: {
                        height: 200,
                        store: me.store,
                        width: 500,
                        viewConfig: {
                            enableTextSelection: true
                        },
                        columns: [
                            {
                                text: i18n.getKey('id'),
                                width: 70,
                                dataIndex: 'id'
                            },
                            {
                                text: i18n.getKey('name'),
                                width: 150,
                                dataIndex: 'name',
                                renderer: function (value, metadata) {
                                    metadata.tdAttr = 'data-qtip="' + value + '"';
                                    return value;
                                }
                            },
                            {
                                text: i18n.getKey('email'),
                                width: 150,
                                dataIndex: 'email',
                                renderer: function (value, metadata) {
                                    metadata.tdAttr = 'data-qtip="' + value + '"';
                                    return value;
                                }
                            },
                            {
                                text: i18n.getKey('telephone'),
                                width: 150,
                                dataIndex: 'telephone',
                                renderer: function (value, metadata) {
                                    metadata.tdAttr = 'data-qtip="' + value + '"';
                                    return value;
                                }
                            },
                            {
                                text: i18n.getKey('belongWebsite'),
                                width: 150,
                                dataIndex: 'website',
                                renderer: function (value, metadata) {
                                    metadata.tdAttr = 'data-qtip="' + value.name + '"';
                                    return value.name;
                                }
                            }
                        ],
                        dockedItems: [
                            {
                                xtype: 'pagingtoolbar',
                                store: me.store,
                                dock: 'bottom',
                                displayInfo: true
                            }
                        ]
                    }

                }
            ],
            bbar: [
                '->',
                {
                    xtype: 'button',
                    iconCls: 'icon_agree',
                    text: i18n.getKey('ok'),
                    handler: function (view) {
                        var form = view.ownerCt.ownerCt;
                        var me = view.ownerCt.ownerCt.ownerCt;
                        if (form.isValid()) {
                            var partnerId = form.getComponent('supplier').getSubmitValue()[0];
                            Ext.Ajax.request({
                                url: adminPath + 'api/orders/' + me.orderId + '/producePartner?partnerId=' + partnerId,
                                method: 'POST',
                                headers: {
                                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                                },
                                success: function (response) {
                                    var responseMessage = Ext.JSON.decode(response.responseText);
                                    if (responseMessage.success) {
                                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('save') + i18n.getKey('success'), function () {
                                            me.close();
                                            me.gridstore.loadPage(me.gridstore.currentPage);

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
                    iconCls: 'icon_cancel',
                    text: i18n.getKey('cancel'),
                    handler: function (view) {
                        view.ownerCt.ownerCt.ownerCt.close();
                    }
                }
            ]
        }
        me.callParent(arguments)
    }
})