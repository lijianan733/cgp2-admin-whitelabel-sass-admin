/**
 * Created by nan on 2020/12/15
 */

Ext.define("CGP.pagecontent.view.EditTab", {
    extend: "Ext.tab.Panel",
    pagecontentData: null,
    controller: null,
    pageContentId: null,
    setValue: function (data) {
        var me = this;
        me.pagecontentData = data;
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            item.setValue(data);
        }
    },
    getValue: function () {
        var me = this;
        var result = {};
        for (var i = 0; i < me.items.items.length; i++) {
            result = Ext.Object.merge(result, me.items.items[i].getValue());
        }
        //保留旧数据里面多余的字段
        result = Ext.Object.merge(me.pagecontentData || {}, result);
        JSObjectEachItem(result, function (data, i) {
                if (data[i] === '' || data[i] === null) {
                    delete data[i];
                }
            }
        )
        console.log(result);
        return result;
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
        var information = Ext.create('CGP.pagecontent.view.Information');
        var layers = Ext.create('CGP.pagecontentschema.view.Layers');
        me.items = [information, layers];
        me.controller = Ext.create('CGP.pagecontent.controller.Controller');
        me.tbar = [
            {
                xtype: 'button',
                text: i18n.getKey('save'),
                iconCls: 'icon_save',
                handler: function (btn) {
                    var tab = btn.ownerCt.ownerCt;
                    if (tab.isValid()) {
                        var result = tab.getValue();
                        console.log(result)
                        tab.controller.savePageContentConfig(result,tab);
                    }
                }
            },
            {
                xtype: 'button',
                text: i18n.getKey('copy'),
                itemId: 'copyBtn',
                iconCls: 'icon_copy',
                disabled: !me.pageContentId,
                handler: function (btn) {
                    var tab = btn.ownerCt.ownerCt;
                    tab.pagecontentData._id = null;
                    btn.setDisabled(true);
                    var pagecontentEdit = top.Ext.getCmp('tabs').getComponent('pagecontent_edit');
                    pagecontentEdit.setTitle(i18n.getKey('create') + '_pagecontent');
                }
            },
            {
                xtype: 'button',
                text: i18n.getKey('操作JSON数据'),
                iconCls: 'icon_check',
                handler: function (btn) {
                    var tab = btn.ownerCt.ownerCt;
                    me.controller.checkPageContentSchemaData(tab.getValue(), tab);
                }
            }
        ];
        me.callParent(arguments);
    }
});
