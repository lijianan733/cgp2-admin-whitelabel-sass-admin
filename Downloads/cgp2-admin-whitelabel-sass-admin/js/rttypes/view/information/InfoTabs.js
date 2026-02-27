Ext.define("CGP.rttypes.view.information.InfoTabs", {
    extend: "Ext.tab.Panel",
    alias: 'widget.rttypeinfo',
    componentInit: false,
    region: 'center',
    itemId: 'infoTab',
    layout: 'fit',
    record: null,
    initComponent: function () {
        var me = this;
        me.title = i18n.getKey("information");
        var controller = Ext.create('CGP.rttypes.controller.Controller');
        me.tbar = Ext.create('Ext.toolbar.Toolbar', {
            items: [{
                itemId: 'btnSave',
                text: i18n.getKey('save'),
                disabled: true,
                iconCls: 'icon_save',
                handler: function (comp) {
                    var result = null;
                    var tab = comp.ownerCt.ownerCt;
                    var baseInfo = tab.getComponent('baseInfo');
                    var rtAttributeDef = tab.getComponent('rtAttributeDef');
                    var treePanel = tab.ownerCt.getComponent('rtTypeTree');
                    var data = baseInfo.getValues();
                    data.clazz = 'com.qpp.cgp.domain.bom.attribute.RtType';
                    data.attributesToRtTypes = rtAttributeDef.getValue();
                    result = controller.saveRtType(data, treePanel);
                    rtAttributeDef.hadModify = false;
                    return result;
                }
            }]
        });

        me.callParent(arguments);
    },
    refreshData: function (record) {
        var me = this;
        me.record = record;
        if (!me.componentInit)
            me.addItem();
        me.recordId = record.get('id');
        me.setTitle(i18n.getKey('information') + ':' + record.get('name'));
        Ext.Array.each(me.items.items, function (item) {
            item.refreshData(record);
        });

        me.setActive(me.items.items[0]);

    },
    listeners: {
        beforetabchange: function (tab, newPanel, oldPanel) {
            var toolBar = tab.getDockedItems('toolbar[dock="top"]')[0];
            var rtAttributeDef = tab.getComponent('rtAttributeDef');
            var btnSave = toolBar.getComponent('btnSave');
            var store = rtAttributeDef.getStore();
            if (newPanel.itemId == 'rtAttributeDefTreePanel') {
                if (rtAttributeDef.hadModify == true) {
                    Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('是否提交rtAttributeDef中的修改?'), function (selector) {
                        if (selector == 'yes') {
                            var result = btnSave.handler(btnSave);
                            if (result == true) {
                                tab.setActiveTab(newPanel);
                                newPanel.refreshData(tab.record);
                                toolBar.hide();
                            }
                        } else {
                            rtAttributeDef.hadModify = false;
                            tab.setActiveTab(newPanel);
                        }
                    })
                    return false;
                } else {
                    toolBar.hide();
                }
            } else {
                toolBar.show();
            }
        }
    },
    addItem: function () {
        var me = this;
        var saveButton = me.child("toolbar").getComponent("btnSave");
        saveButton.setDisabled(false);
        var baseInfo = Ext.create('CGP.rttypes.view.information.BaseInfo');
        var allAttributeStore = Ext.create('CGP.rttypes.store.AllAttribute');
        var attribute = Ext.create('CGP.rttypes.view.information.attribute.Attribute', {
            allAttributeStore: allAttributeStore
        });
        var rtAttributeDef = Ext.create('CGP.rttypes.view.information.attribute.RtAttributeDef');

        var rtAttributeDefTreePanel = Ext.create('CGP.rttypes.view.information.attribute.RtAttributeDefTreePanel');
        me.add([baseInfo, rtAttributeDef, rtAttributeDefTreePanel]);
        me.componentInit = true;
    }
})
