/**
 * Created by nan on 2021/4/6
 */
Ext.define("CGP.productset.view.OutPanel", {
    extend: "Ext.panel.Panel",
    alias: 'widget.outpanel',
    layout: 'border',
    items: [
        {
            xtype: 'lefttree',
            width: 450,
            itemId: 'leftTree',
        },
        {
            xtype: 'centerpanel',
            flex: 1,
            itemId: 'centerPanel',
        }
    ],
    getValue: function () {
        var me = this;
    },
    setValue: function (productSetInfo) {
        var me = this;
        var treePanel = me.getComponent('leftTree');
        console.log(treePanel)
        var centerPanel = me.getComponent('centerPanel');
        treePanel.setRootNodeValue(productSetInfo);
    },
    isValid: function () {
        var me = this;

    },
    listeners: {
        afterrender: function () {
            var me = this;
            var recordId = JSGetQueryString('id');
            me.mask('加载中...');
            if (recordId) {
                CGP.productset.model.ProductSetModel.load(recordId, {
                    scope: this,
                    success: function (record) {
                       ;
                        /*
                                                me.setValue(record.getData());
                        */
                        me.setValue(record.raw);
                    },
                    failure: function () {
                    },
                    callback: function () {
                        me.unmask();

                    }
                });

            } else {
                var treePanel = me.getComponent('leftTree');
                var centerPanel = Ext.create('CGP.productset.view.CenterPanel', {});
                var form = Ext.create('CGP.productset.view.ProductSetForm', {
                    createOrEdit: 'create',
                });
                var media = Ext.create('CGP.product.edit.module.Media');
                centerPanel.add([form, media]);
                var win = Ext.create('Ext.window.Window', {
                    modal: true,
                    constrain: true,
                    layout: 'fit',
                    width: 1200,
                    height: 800,
                    maximizable: false,
                    maximized: true,
                    treePanel: treePanel,
                    closable: false,
                    title: i18n.getKey('create') + i18n.getKey('productSet'),
                    /*
                                        items: [{
                                            xtype: 'errorstrickform',
                                            itemId: 'form',
                                            border: false,
                                            defaults: {
                                                allowBlank: false,
                                                width: 350,
                                                margin: 10,
                                            },
                                            items: [
                                              ],
                    */
                    items: [
                        centerPanel
                    ],
                    bbar: ['->', {
                        xtype: 'button',
                        text: i18n.getKey('save'),
                        iconCls: 'icon_save',
                        handler: function (btn) {
                            centerPanel.saveHandler();

                        }
                    }/*, {
                        xtype: 'button',
                        text: i18n.getKey('cancel'),
                        iconCls: 'icon_cancel',
                        handler: function (btn) {
                            var win = btn.ownerCt.ownerCt;
                            win.close();
                        }
                    }*/
                    ]
                });
                win.show();
            }
        }
    },
    initComponent: function () {
        var me = this;
        me.callParent();
    }
});

