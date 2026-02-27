Ext.define("CGP.pagecontentschema.view.EditTab", {
    extend: "Ext.tab.Panel",
    region: 'center',
    pageContentSchemaId: null,
    pageContentSchemaData: null,
    controller: null,
    id: 'PCSTab',
    setValue: function (data) {
        var me = this;
        me.pageContentSchemaData = data;
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            item.setValue(data);
        }
        var url = path + 'partials/pagecontentschema/canvas/main.html?pageContentSchemaId=' + data._id;
        var canvas = me.getComponent('canvas');
        if (canvas) {

        } else {
            canvas = {
                itemId: 'canvas',
                title: i18n.getKey('canvas'),
                html: '<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                closable: false,
                isValid: function () {
                    return true;
                },
                getValue: function () {
                    return null;
                },
                setValue: function () {
                    return null;
                }
            };
            me.add(canvas);
        }
    },
    getValue: function () {
        var me = this;
        var result = {};
        for (var i = 0; i < me.items.items.length; i++) {
            result = Ext.Object.merge(result, me.items.items[i].getValue());
        }
        result = Ext.Object.merge(me.pageContentSchemaData || {}, result);
        me.controller.clearNullValueKey(result, true, ['printFile', 'imageName', 'text', 'color']);
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
    listeners: {
        tabchange: function (tabPanel, newCard, oldCard, eOpts) {
            var tbar = tabPanel.getDockedItems('toolbar[dock="top"]')[0];
            if (Ext.Array.contains(['canvas', 'canvas_edit'], newCard.itemId)) {
                tbar.hide();
            } else {
                tbar.show();
            }
        }
    },
    initComponent: function () {
        var me = this;
        var information = Ext.create('CGP.pagecontentschema.view.Information');
        var layers = Ext.create('CGP.pagecontentschema.view.Layers');
        me.items = [information, layers];
        me.controller = Ext.create('CGP.pagecontentschema.controller.Controller');
        me.tbar = [
            {
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
            },
            {
                xtype: 'button',
                text: i18n.getKey('操作JSON数据'),
                iconCls: 'icon_check',
                handler: function (btn) {
                    var tab = btn.ownerCt.ownerCt;
                    var rawData = tab.getValue();
                    me.controller.checkPageContentSchemaData(rawData, tab);


                }
            }
        ];
        me.callParent(arguments);
    }
});
