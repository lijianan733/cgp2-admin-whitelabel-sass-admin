/**
 * Created by nan on 2021/5/25
 */
Ext.Loader.syncRequire([
    'CGP.product.view.productconfig.productdesignconfig.view.pcspreprocess.view.gridpcstemplateitem.view.BaseInfo',
    'CGP.product.view.productconfig.productdesignconfig.view.pcspreprocess.view.gridpcstemplateitem.view.Canvas',
    'CGP.product.view.productconfig.productdesignconfig.view.pcspreprocess.view.gridpcstemplateitem.view.ItemProcesses',
    'CGP.product.view.productconfig.productdesignconfig.view.pcspreprocess.view.gridpcstemplateitem.view.ItemTemplate',
])
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.pcspreprocess.view.gridpcstemplateitem.view.OutTab', {
    extend: 'Ext.tab.Panel',
    closable: true,
    header: false,
    PMVTId: null,
    record: null,
    pcsConfigData: null,//pcs配置源数据
    contentData: null,//条件组件用的上下文数据
    createOrEdit: 'create',
    isValid: function () {
        var me = this;
        var isValid = true;
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            if (item.isValid() == false) {
                isValid = false;
                me.setActiveTab(item);
                if (item.itemId == 'itemTemplate') {
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('itemTemplate不允许为空'))
                }
                break;
            }
        }
        return isValid;
    },
    getValue: function () {
        var me = this;
        var result = {};
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            if (item.diyGetValue) {
                result = Ext.Object.merge(result, item.diyGetValue());
            } else {
                result = Ext.Object.merge(result, item.getValue());
            }
        }
        return result;
    },
    setValue: function (data) {
        var me = this;
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            if (item.diySetValue) {
                item.diySetValue(data);
            } else {
                item.setValue(data);
            }
        }
    },
    initComponent: function () {
        var me = this;
        me.createOrEdit = me.record ? 'edit' : 'create';
        me.tbar = [
            {
                xtype: 'button',
                text: i18n.getKey('save'),
                iconCls: 'icon_save',
                handler: function (btn) {
                    var tab = btn.ownerCt.ownerCt;
                    if (tab.isValid()) {
                        var gridPCSPreprocessView = tab.ownerCt.getComponent('gridPCSPreprocessView');
                        var result = tab.getValue();
                        if (tab.record) {
                            for (var i in result) {
                                tab.record.set(i, result[i]);
                            }
                        } else {
                            var preprocessItemsStore = Ext.data.StoreManager.get('preprocessItemsStore');
                            var records = preprocessItemsStore.add(result);
                            var newRecord = records[0];
                            tab.record = newRecord;
                            tab.setTitle(i18n.getKey('edit')+'_'+i18n.getKey('preprocessItem'));
                        }
                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'))
                        /*
                                                tab.ownerCt.setActiveTab(gridPCSPreprocessView);
                        */
                    }
                }
            },
            {
                xtype: 'button',
                text: i18n.getKey('add') + i18n.getKey('canvas'),
                iconCls: 'icon_add',
                itemId: 'addCanvasBtn',
                hidden: true,
                handler: function (btn) {
                    var tab = btn.ownerCt.ownerCt;
                    var canvasForm = tab.getComponent('canvas');
                    for (var i = 0; i < canvasForm.items.items.length; i++) {
                        var item = canvasForm.items.items[i];
                        item.setDisabled(false);
                        item.show();
                    }
                }
            },
            {
                xtype: 'button',
                text: i18n.getKey('delete') + i18n.getKey('canvas'),
                iconCls: 'icon_delete',
                itemId: 'deleteCanvasBtn',
                hidden: true,
                handler: function (btn) {
                    var tab = btn.ownerCt.ownerCt;
                    var canvasForm = tab.getComponent('canvas');
                    for (var i = 0; i < canvasForm.items.items.length; i++) {
                        var item = canvasForm.items.items[i];
                        item.setDisabled(true);
                        item.hide();
                    }
                }
            },
        ];
        me.items = [
            {
                xtype: 'baseinfo',
                PMVTId: me.PMVTId,
                itemId: 'baseInfo',
                pcsConfigData: me.pcsConfigData,
                contentData: me.contentData,

            }, {
                xtype: 'itemtemplate',
                PMVTId: me.PMVTId,
                itemId: 'itemTemplate'
            }, {
                xtype: 'itemprocesses',
                PMVTId: me.PMVTId,
                itemId: 'itemProcesses'
            },
            {
                xtype: 'canvas',
                PMVTId: me.PMVTId,
                itemId: 'canvas',
                pcsConfigData: me.pcsConfigData,
                pageContentSchemaId: me.pcsConfigData._id
            },
        ];
        me.callParent();
    },
    listeners: {
        afterrender: function () {
            var me = this;
            if (me.record) {
                var data = Ext.clone(me.record.getData());
                me.setValue(data);
            }
        },
        tabchange: function (tab, newPanel, oldPanel) {
            var toolbar = tab.getDockedItems('toolbar[dock="top"]')[0];
            var addCanvasBtn = toolbar.getComponent('addCanvasBtn');
            var deleteCanvasBtn = toolbar.getComponent('deleteCanvasBtn');
            if (newPanel.itemId == 'canvas') {
                addCanvasBtn.show();
                deleteCanvasBtn.show();
                if (Ext.isEmpty(newPanel.rawData)) {
                    for (var i = 0; i < newPanel.items.items.length; i++) {
                        var item = newPanel.items.items[i];
                        item.setDisabled(true);
                        item.hide();
                    }
                }
            } else {
                addCanvasBtn.hide();
                deleteCanvasBtn.hide();
            }
        }
    }
})