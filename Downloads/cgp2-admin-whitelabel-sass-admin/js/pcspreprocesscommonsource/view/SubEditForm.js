/**
 * Created by shirley on 2021/07/12
 * pcs预处理source类型基础组件
 */
Ext.define('CGP.pcspreprocesscommonsource.view.SubEditForm', {
    extend: 'Ext.ux.form.ErrorStrickForm',
    alias: 'widget.SubEditForm',
    controller: Ext.create('CGP.pcspreprocesscommonsource.controller.Controller'),
    tbar: [
        {
            xtype: 'button',
            text: i18n.getKey('save'),
            iconCls: 'icon_save',
            handler: function (btn) {
                var form = btn.ownerCt.ownerCt;
                var controller = form.controller;
                var result = form.getValue();
                if (form.isValid()) {
                    controller.saveRecord(result)
                }
            }
        }
    ],
    initComponent: function () {
        var me = this;
        me.items = Ext.Array.merge([
            {
                name: '_id',
                xtype: 'textfield',
                editable: false,
                allowBlank: true,
                hidden: true,
                itemId: '_id'
            },
            {
                name: 'description',
                xtype: 'textfield',
                valueField: 'description',
                displayField: 'description',
                editable: false,
                allowBlank: true,
                fieldLabel: i18n.getKey('description'),
                itemId: 'description'
            }
        ], me.items);
        me.callParent();
        me.on('afterrender', function () {
            var recordId = JSGetQueryString('sourceId');
            if (recordId) {
                CGP.pcspreprocesscommonsource.model.SourceModel.load(recordId, {
                    scope: this,
                    success: function (record) {
                        me.setValue(record.getData());
                    },
                    failure: function (data) {
                        Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveFailure') + object.data.message);
                    }
                })
            }
        });
    }
})