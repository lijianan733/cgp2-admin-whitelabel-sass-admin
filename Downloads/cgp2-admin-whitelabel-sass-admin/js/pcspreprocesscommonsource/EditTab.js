Ext.define("CGP.pcspreprocesscommonsource.EditTab", {
    extend: "Ext.tab.Panel",
    region: 'center',
    recordData: null,
    controller: null,
    setValue: function (data) {
        var me = this;
        me.recordData = data;
    },
    getValue: function () {
        var  me = this;
        return me.recordData;
    },
    isValid: function () {
        var me = this;
        var isValid = true;
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            if (item.isValid() == false) {
                isValid = false;
                me.setActiveTab(item);
                break;
            }
        }
        return isValid;
    },
    initComponent: function () {
        var me = this;
        me.items = [];
        me.controller = Ext.create('CGP.pcspreprocesscommonsource.controller.Controller');
        me.tbar = [
            /*{
                xtype: 'button',
                text: i18n.getKey('save'),
                iconCls: 'icon_save',
                handler: function (btn) {
                    var tab = btn.ownerCt.ownerCt;
                    if (tab.isValid()) {
                        var result = tab.getValue();
                        console.log(result);
                        tab.controller.savePageContentSchema(result, tab);
                    }
                }
            },
            {
                xtype: 'button',
                text: i18n.getKey('copy'),
                itemId: 'copyBtn',
                iconCls: 'icon_copy',
                disabled: !me.pageContentSchemaId,
                handler: function (btn) {
                    var tab = btn.ownerCt.ownerCt;
                    tab.pageContentSchemaData._id = null;
                    btn.setDisabled(true);
                    var pageContentSchemaEdit = top.Ext.getCmp('tabs').getComponent('pagecontentschema_edit');
                    pageContentSchemaEdit.setTitle(i18n.getKey('create') + '_pageContentSchema');


                }
            },*/
            {
                xtype: 'button',
                text: i18n.getKey('操作JSON数据'),
                iconCls: 'icon_check',
                handler: function (btn) {
                    var tab = btn.ownerCt.ownerCt;
                    var rawData = tab.getValue();
                    me.controller.checkJsonData(rawData, tab);
                }
            }
        ];
        me.callParent(arguments);
    }
});
