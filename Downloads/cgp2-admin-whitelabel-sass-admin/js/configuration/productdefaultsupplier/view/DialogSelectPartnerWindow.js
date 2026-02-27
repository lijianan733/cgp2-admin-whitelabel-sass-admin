/**
 * Created by nan on 2018/4/23.
 */
Ext.define('CGP.configuration.productdefaultsupplier.view.DialogSelectPartnerWindow', {
    extend: 'Ext.window.Window',
    title: i18n.getKey('select') + i18n.getKey('supplier'),
    modal: true,
    height: 150,
    width: 400,
    layout: 'fit',
    initComponent: function () {
        var me = this;
        var myMask = new Ext.LoadMask(me, {msg: "Please wait..."});
        var createOrEdit = Ext.isEmpty(me.preWin) ? 'edit' : 'create';
        me.partnerId = createOrEdit == 'edit' ? me.record.get('partner').id : null;
        me.items = {
            xtype: 'form',
            border: false,
            layout: {
                type: 'vbox',
                align: 'center',
                pack: 'center'
            },
            items: [
                {
                    name: 'supplier',
                    xtype: 'gridcombo',
                    itemId: 'supplier',
                    labelAlign: 'left',
                    queryMode: 'local',
                    allowBlank: false,
                    fieldLabel: i18n.getKey('supplier'),
                    multiSelect: false,
                    displayField: 'name',
                    valueField: 'id',
                    editable: false,
                    labelWidth: 50,
                    store: me.partnerStore,
                    matchFieldWidth: false,
                    pickerAlign: 'bl',
                    gridCfg: {
                        height: 250,
                        width: 600,
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
                                width: 120,
                                dataIndex: 'name'
                            },
                            {
                                text: i18n.getKey('contactor'),
                                width: 120,
                                dataIndex: 'contactor'
                            },
                            {
                                text: i18n.getKey('telephone'),
                                width: 120,
                                dataIndex: 'telephone'
                            },
                            {
                                text: i18n.getKey('cooperationType'),
                                sortable: false,
                                dataIndex: 'cooperationType'
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
                                    fieldLabel: i18n.getKey('name'),
                                    name: 'name',
                                    isLike: true,
                                    labelWidth: 40
                                },
                                '->',
                                {
                                    xtype: 'button',
                                    text: i18n.getKey('search'),
                                    websiteId: me.websiteId,
                                    handler: me.controller.searchPartner,
                                    width: 80
                                },
                                {
                                    xtype: 'button',
                                    text: i18n.getKey('clear'),
                                    websiteId: me.websiteId,
                                    handler: me.controller.clearPartnerParams,
                                    width: 80
                                }
                            ]
                        },
                        dockedItems: [
                            {
                                xtype: 'pagingtoolbar',
                                store: me.partnerStore,
                                dock: 'bottom',
                                displayInfo: true
                            }
                        ]
                    },
                    listeners: {
                        afterrender: function (view) {
                            var store = view.store;
                            if (me.partnerId) {
                                if (store.hasLoad) {
                                    view.setSubmitValue(me.partnerId + '');
                                } else {
                                    store.load(function () {
                                        view.setSubmitValue(me.partnerId + '');
                                    });
                                }
                            }
                        }
                    }
                }
            ],
            bbar: [
                {
                    text: i18n.getKey('lastStep'),
                    hidden: Ext.isEmpty(me.preWin),
                    iconCls: 'icon_previous_step',
                    handler: function (btn) {
                        me.close()
                    }
                },
                '->',
                {
                    text: i18n.getKey('ok'),
                    iconCls: 'icon_agree',
                    handler: function (btn) {
                        var form = btn.ownerCt.ownerCt;
                        btn.setDisabled(true);
                        if (form.isValid()) {
                            myMask.show();
                            var method = createOrEdit == 'create' ? 'POST' : 'PUT';
                            var url = method == 'POST' ? adminPath + 'api/websites/' + me.websiteId + '/productDefaultProducerConfigs' : adminPath + 'api/websites/' + me.websiteId + '/productDefaultProducerConfigs/' + me.recordId;
                            var supplier = form.getComponent('supplier').getSubmitValue()[0];
                            var productId = me.productId;
                            Ext.Ajax.request({
                                url: url,
                                method: method,
                                headers: {
                                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                                },
                                jsonData: {
                                    "partnerId": supplier,
                                    "productId": productId,
                                    "websiteId": me.websiteId,
                                    '_id': me.recordId,
                                    "clazz": 'com.qpp.cgp.domain.product.config.ProductDefaultProducerConfig'
                                },
                                success: function (response) {
                                    var responseMessage = Ext.JSON.decode(response.responseText);
                                    if (responseMessage.success) {
                                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'), function () {
                                            btn.setDisabled(false);
                                            me.gridStore.load();
                                            if (me.preWin) {
                                                me.preWin.close();
                                            }
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
                        if (me.preWin) {
                            me.preWin.close();
                        }
                        me.close();
                    }
                }
            ]
        };
        me.callParent(arguments);
        me.relayEvents(me.partnerStore,['nosupportpartner']);
        me.on('nosupportpartner',function(){
            me.close();
        })
    }
})