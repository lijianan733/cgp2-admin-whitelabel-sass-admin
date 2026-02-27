/**
 * Created by nan on 2021/1/14
 */
Ext.Loader.syncRequire([
    'CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.SpecialConfigInfoFrom',
    'CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.CalenderDetailConfigForm',
    'CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.model.CalenderPreprocessConfigModel',
    'CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.model.RandomBackgroundPreprocessConfigModel',
    'CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.model.RandomLayoutPreprocessConfigModel',
    'CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.model.RandomContentPreprocessConfigModel',
    'CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.JsonPathSelectorFieldContainer',
    'CGP.product.view.productconfig.productdesignconfig.view.sourceconfig.view.ExtraInfoColumn',
    'CGP.pagecontentschema.view.Layers'
])
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.SpecialConfigTab', {
    extend: 'Ext.tab.Panel',
    recordId: null,
    createOrEdit: null,
    builderConfigTab: null,
    designId: null,
    controller: null,
    clazz: null,
    clazzMapping: {
        MaterialViewTypePreprocessConfig: {
            clazz: 'com.qpp.cgp.domain.preprocess.config.MaterialViewTypePreprocessConfig',
            description: '预处理配置描述',
            model: 'CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.model.PreProcessConfigModel'
        },
        CalenderPreprocessConfig: {
            clazz: 'com.qpp.cgp.domain.preprocess.config.CalenderPreprocessConfig',
            description: '日历预处理配置描述',
            model: 'CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.model.CalenderPreprocessConfigModel'
        },
        RandomBackgroundPreprocessConfig: {
            clazz: 'com.qpp.cgp.domain.preprocess.config.RandomBackgroundPreprocessConfig',
            model: 'CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.model.RandomBackgroundPreprocessConfigModel'
        },
        RandomLayoutPreprocessConfig: {
            clazz: 'com.qpp.cgp.domain.preprocess.config.RandomLayoutPreprocessConfig',
            model: 'CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.model.RandomLayoutPreprocessConfigModel'
        },
        RandomContentPreprocessConfig: {
            clazz: 'com.qpp.cgp.domain.preprocess.config.RandomContentPreprocessConfig',
            model: 'CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.model.RandomContentPreprocessConfigModel'
        }
    },

    isValid: function () {
        var me = this;
        var result = true;
        for (var i = 0; i < me.items.items.length; i++) {
            var panel = me.items.items[i];
            if (panel.isValid() == false) {
                me.setActiveTab(panel);
                result = false;
                break;
            }
        }
        return result;
    },
    setValue: function (data) {
        var me = this;
        for (var i = 0; i < me.items.items.length; i++) {
            var panel = me.items.items[i];
            panel.setValue(data);
        }
    },
    getValue: function () {
        var me = this;
        var result = {};
        for (var i = 0; i < me.items.items.length; i++) {
            var panel = me.items.items[i];
            Ext.Object.merge(result, panel.getValue());
        }
        return result;
    },
    listeners: {
        afterrender: function () {
            var me = this;
            var recordId = me.recordId;
            var tab = this;
            var baseInfoForm = tab.getComponent('baseInfoForm');
            if (!Ext.isEmpty(recordId)) {
                Ext.create('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.store.AllTypePCSPreprocessStore', {
                    model: me.clazzMapping[me.clazz].model,
                    params: {
                        filter: Ext.JSON.encode([
                            {
                                name: '_id',
                                type: 'string',
                                value: recordId
                            }
                        ])
                    },
                    listeners: {
                        load: function (store, records) {
                            var data = records[0].getData();
                            tab.setValue(data);
                        }
                    }
                })
            } else {
                baseInfoForm.getComponent('clazz').setValue(me.clazzMapping[me.clazz].clazz);
            }
        }
    },
    initComponent: function () {
        var me = this;
        me.items = [];
        me.items.push({
            xtype: 'specialpreprocessconfigfrom',
            itemId: 'baseInfoForm',
            clazz: me.clazzMapping[me.clazz].clazz,
            designId: me.designId,
        });

        me.tbar = [
            {
                xtype: 'button',
                text: i18n.getKey('save'),
                iconCls: 'icon_save',
                handler: function (btn) {
                    var tab = btn.ownerCt.ownerCt;
                    var data = {};
                    if (tab.isValid()) {
                        for (var i = 0; i < tab.items.items.length; i++) {
                            var panel = tab.items.items[i];
                            data = Ext.Object.merge(data, panel.getValue());
                        }
                        tab.controller.savePreProcessConfig(data, tab.createOrEdit, tab);
                    }
                }
            },
            {
                xtype: 'button',
                text: i18n.getKey('操作JSON数据'),
                iconCls: 'icon_check',
                handler: function (btn) {
                    var tab = btn.ownerCt.ownerCt;
                    var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
                    var isLock = builderConfigTab.isLock;
                    tab.controller.checkPCPreProcessConfigData(tab.getValue(), tab, isLock);
                }
            }
        ];
        if (me.clazz == 'CalenderPreprocessConfig') {
            me.items.push({
                xtype: 'calenderdetailconfigform',
                itemId: 'calenderDetailConfigForm',
            });
            me.items.push({
                xtype: 'layers',
                itemId: 'layers',
                title: i18n.getKey('日期格子内容模板'),
                LayerLeftTreePanelConfig: {
                    rootType: 'container',
                    name: 'dateElementTemplate',
                    setValue: function (data) {
                        var me = this;
                        var layers = data.dateElementTemplate;
                        //转换数据结
                        if (layers) {
                            layers = [layers];
                            var rootNode = me.store.getRootNode();
                            rootNode.removeAll()
                            JSReplaceKeyName(layers, 'items', 'children');
                            rootNode.appendChild(layers);
                            me.expandAll();
                        }
                    },
                    getValue: function () {
                        var me = this;
                        var rootNode = me.getRootNode();
                        var data = {};
                        if (rootNode.hasChildNodes() == false) {//只有根
                            data.dateElementTemplate = null;
                        } else {
                            data = JSTreeNodeToJsonTree(rootNode, {children: []});
                            JSReplaceKeyName(data, 'children', 'items');
                            //如果是container类型，必须有items
                            JSObjectEachItem(data, function (data, i) {
                                if (data.clazz == 'Container') {
                                    if (data.items) {

                                    } else {
                                        data.items = [];
                                    }
                                }
                            })
                            data.dateElementTemplate = data.items[0];
                            delete data.items;
                        }
                        return data;
                    },
                },
            });
        }
        me.callParent();
        me.on('afterrender', function () {
            var page = this;
            var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
            var productId = builderConfigTab.productId;
            var isLock = JSCheckProductIsLock(productId);
            if (isLock) {
                JSLockConfig(page);
            }
        });
    }
})