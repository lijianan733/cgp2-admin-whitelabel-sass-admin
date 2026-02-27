/**
 * Created by nan on 2021/9/28
 */
Ext.Loader.syncRequire([
    'CGP.virtualcontainertype.view.CustomDataForm',
    'CGP.virtualcontainertype.view.ReplaceDataForm'
])
Ext.define('CGP.virtualcontainertype.view.CenterPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.centerpanel',
    itemId: 'centerPanel',
    layout: 'fit',
    recordId: null,
    tbar: {
        items: [
            {
                xtype: 'button',
                text: i18n.getKey('save'),
                iconCls: 'icon_save',
                handler: function (btn) {
                    var centerPanel = btn.ownerCt.ownerCt;
                    var form = centerPanel.items.items[0];
                    if (form.isValid()) {
                        var data = form.getValue();
                        console.log(data);
                        centerPanel.controller.saveConfig(data, centerPanel);
                    }
                }
            }
        ]
    },
    initComponent: function () {
        var me = this;
        me.controller = Ext.create('CGP.virtualcontainertype.controller.Controller');
        me.callParent();
    },
    listeners: {
        afterrender: function () {
            var me = this;
            if (me.recordId) {
                CGP.virtualcontainertype.model.VirtualContainerTypeModel.load(me.recordId, {
                    scope: this,
                    failure: function (record, operation) {
                        //do something if the load failed
                    },
                    success: function (record, operation) {
                        var template = record.get('template');
                        if (template) {
                            me.add({
                                xtype: 'customdataform',
                                record: record
                            });
                        } else {
                            me.add({
                                xtype: 'replacedataform',
                                record: record
                            });
                        }

                    },
                    callback: function (record, operation) {
                    }
                })
            } else {
                var model = JSGetQueryString('model');
                if (model == 'custom') {
                    me.add({
                        xtype: 'customdataform',
                    });
                } else {
                    me.add({
                        xtype: 'replacedataform',
                    });
                }
            }
        }
    }
})