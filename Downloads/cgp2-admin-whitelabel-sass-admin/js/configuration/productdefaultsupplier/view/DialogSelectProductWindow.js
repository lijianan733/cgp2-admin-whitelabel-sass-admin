/**
 * Created by nan on 2018/4/23.
 */
Ext.define('CGP.configuration.productdefaultsupplier.view.DialogSelectProductWindow', {
    extend: 'Ext.window.Window',
    title: i18n.getKey('select') + i18n.getKey('product'),
    modal: true,
    height: 150,
    width: 400,
    layout: 'fit',
    initComponent: function () {
        var me = this;
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
                    name: 'product',
                    xtype: 'gridcombo',
                    itemId: 'product',
                    labelAlign: 'left',
                    allowBlank: false,
                    fieldLabel: i18n.getKey('product'),
                    multiSelect: false,
                    displayField: 'name',
                    valueField: 'id',
                    editable: false,
                    labelWidth: 50,
                    store: me.supportProductStore,
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
                                width: 150,
                                dataIndex: 'name'
                            },
                            {
                                text: i18n.getKey('model'),
                                width: 150,
                                dataIndex: 'model'
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
                                    handler: me.searchFunction,
                                    width: 80
                                },
                                {
                                    xtype: 'button',
                                    text: i18n.getKey('clear'),
                                    websiteId: me.websiteId,
                                    handler: me.cleanFunction,
                                    width: 80
                                }
                            ]
                        },
                        dockedItems: [
                            {
                                xtype: 'pagingtoolbar',
                                store: me.supportProductStore,
                                dock: 'bottom',
                                displayInfo: true
                            }
                        ]
                    }
                }
            ],
            bbar: ['->', {
                text: i18n.getKey('nextStep'),
                iconCls: 'icon_next_step',
                handler: function (btn) {
                    var form = btn.ownerCt.ownerCt;
                    if (form.isValid()) {
                        var productId = form.getComponent('product').getSubmitValue()[0];
                        var win = Ext.create('CGP.configuration.productdefaultsupplier.view.DialogSelectPartnerWindow', {
                            productId: productId,
                            websiteId: me.websiteId,
                            gridStore: me.gridStore,
                            preWin: me,
                            controller: me.controller,
                            partnerStore: Ext.create('CGP.configuration.productdefaultsupplier.store.EnablePartnerStore', {
                                productId: productId,
                                listeners:{
                                    load:function(store){
                                        store.hasLoad=true;
                                        if(!store.getCount()>0){
                                            store.noSupportPartner=true;
                                            Ext.Msg.alert(i18n.getKey('prompt'),i18n.getKey('无支持该产品的供应商'),function(){
                                                store.fireEvent('nosupportpartner');
                                            });

                                        }
                                    }
                                }
                            })
                        });
                        win.show();
                    }
                }
            }, {
                text: i18n.getKey('cancel'),
                iconCls: 'icon_cancel',
                handler: function (btn) {
                    me.close();
                }
            }]
        };
        me.callParent(arguments)
    }
})