/**
 * Created by nan on 2020/7/3.
 */
Ext.define('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.GenerateJobConfig.view.ManageJobConfigTab', {
    extend: 'Ext.tab.Panel',
    jobConfig: null,
    closable: true,
    alias: 'widget.managejobconfigtab',
    createOrEdit: 'create',
    id: 'manageJobConfigTab',
    recordData: null,
    bomConfigId: null,
    productId: null,
    conditionValue: null,//混合类型的执行条件
    conditionDTOValue: null,//混合类型的执行条件的界面配置数据
    preview: false,
    listeners: {
        afterrender: function (tab) {
            var conditions = tab.query('[itemId=condition]');
            var conditionDTOs = tab.query('[itemId=conditionDTO]');
            for (var i = 1; i < conditions.length; i++) {
                conditions[i].items.items[0].expressionStore = conditions[0].items.items[0].expressionStore;
            }
            console.log(tab.conditionValue)
            if (!Ext.Object.isEmpty(tab.conditionValue)) {
                for (var i = 0; i < conditions.length; i++) {
                    conditions[i].setValue(tab.conditionValue);
                }
            }
            console.log(tab.conditionDTOValue)
            if (!Ext.Object.isEmpty(tab.conditionDTOValue)) {
                for (var i = 0; i < conditionDTOs.length; i++) {
                    conditionDTOs[i].setValue(tab.conditionDTOValue);
                }
            }
            if (!Ext.isEmpty(tab.jobConfig.singleJobConfigs)) {//复合的配置
                for (var i = 0; i < tab.items.items.length; i++) {
                    var item = tab.items.items[i];
                    tab.setActiveTab(item);
                }
                tab.setActiveTab(0);
            } else {
                tab.tabBar.hide();
            }
            tab.on('tabChange', function (tabPanel, newCard, oldCard, eOpts) {
                newCard.getComponent('pages')._grid.getView().refresh();
            })
        }
    },
    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.GenerateJobConfig.controller.Controller');
        me.preview = !Ext.isEmpty(JSGetQueryString('preview')) && JSGetQueryString('preview') == 'true';
        me.items = [];
        me.tbar = [
            {
                xtype: 'button',
                iconCls: 'icon_save',
                text: i18n.getKey('save'),
                handler: function (btn) {
                    var tab = btn.ownerCt.ownerCt;
                    var isValid = true;
                    for (var i = 0; i < tab.items.items.length; i++) {
                        var item = tab.items.items[i];
                        if (item.isValid() == false) {
                            tab.setActiveTab(item);
                            isValid = false;
                            break;
                        }
                    }
                    if (isValid == true) {
                        for (var i = 0; i < tab.items.items.length; i++) {
                            var item = tab.items.items[i];
                            controller.saveGenerateJobConfig(tab, item);
                        }
                    }
                }
            },
            {
                xtype: 'button',
                iconCls: 'icon_edit',
                text: i18n.getKey('修改执行条件'),
                hidden: Ext.isEmpty(me.jobConfig.singleJobConfigs),
                handler: function (btn) {
                    var tab = btn.ownerCt.ownerCt;
                    if (me.conditionDTOValue) {
                        var conditionDTOs = tab.query('[itemId=conditionDTO]');
                        var conditions = tab.query('[itemId=condition]');
                        var conditionDTOValue = conditionDTOs[0].getValue();
                        var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
                        var productId = builderConfigTab.productId;
                        var contentData = controller.buildContentData(productId);
                        var contextTemplate = controller.buildContentTemplate(contentData);
                        var contentAttributeStore = Ext.create('Ext.data.Store', {
                            storeId: 'contentAttributeStore',
                            fields: [
                                {
                                    name: 'key',
                                    type: 'string'
                                },
                                {
                                    name: 'type',
                                    type: 'string'
                                }, {
                                    name: 'valueType',
                                    type: 'string'
                                }, {
                                    name: 'selectType',
                                    type: 'string'
                                }, {
                                    name: 'attrOptions',
                                    type: 'array'
                                }, {
                                    name: 'required',
                                    type: 'string'
                                }, {
                                    name: 'attributeInfo',
                                    type: 'string'
                                }, {
                                    name: 'path',
                                    type: 'string'
                                },
                                {
                                    name: 'displayName',
                                    type: 'string'
                                }
                            ],
                            data: contentData
                        });
                        var win = Ext.create('CGP.common.condition.view.ConditionWindow', {
                            width: 800,
                            height: 450,
                            contentAttributeStore: contentAttributeStore,
                            contextTemplate: contextTemplate,
                            listeners: {
                                afterrender: function () {
                                    var me = this;
                                    me.setValue(conditionDTOValue);
                                }
                            },
                            bbar: {
                                items: [
                                    '->',
                                    {
                                        xtype: 'button',
                                        text: i18n.getKey('confirm'),
                                        iconCls: 'icon_agree',
                                        handler: function (btn) {
                                            var win = btn.ownerCt.ownerCt;
                                            console.log(win.getValue());
                                            for (var i = 0; i < conditionDTOs.length; i++) {
                                                conditionDTOs[i].setValue(win.getValue());
                                            }
                                            for (var i = 0; i < conditions.length; i++) {
                                                conditions[i].setValue(conditionDTOs[0].getExpression());
                                            }
                                            win.close();
                                        }
                                    },
                                    {
                                        xtype: 'button',
                                        text: i18n.getKey('cancel'),
                                        iconCls: 'icon_cancel',
                                        handler: function (btn) {
                                            var win = btn.ownerCt.ownerCt;
                                            win.close();
                                        }
                                    }
                                ]
                            }
                        });
                        win.show();
                    } else {
                        var conditions = tab.query('[itemId=condition]');
                        var win = Ext.create('CGP.common.valueExV3.view.SetExpressionValueWindow', {
                            expressionValueStore: conditions[0].items.items[0].expressionStore,
                            readOnly: false,
                            title: '修改执行条件'
                        });
                        win.show();
                    }
                }
            }
        ];
        me.title = i18n.getKey(me.createOrEdit) + i18n.getKey('Job生成配置');
        if (!Ext.isEmpty(me.jobConfig.singleJobConfigs)) {//复合的配置
            for (var i = 0; i < me.jobConfig.singleJobConfigs.length; i++) {
                var editGenerateJobConfigForm = Ext.widget('editgeneratejobconfigform', {
                    title: 'Job配置：' + me.jobConfig.singleJobConfigs[i]._id + '的生成配置',
                    singleJobConfig: me.jobConfig.singleJobConfigs[i],
                    bomConfigId: me.bomConfigId,
                    recordData: me.recordData ? me.recordData.singleJobConfigs[i] : null,
                    itemId: me.jobConfig.singleJobConfigs[i]._id,
                    compositeJobConfigId: me.jobConfig._id,
                    productId: me.productId,
                    commonExpression: true,
                    impositionId: me.impositionId
                });
                me.items.push(editGenerateJobConfigForm);
            }
        } else {
            var editGenerateJobConfigForm = Ext.widget('editgeneratejobconfigform', {
                singleJobConfig: me.jobConfig,
                bomConfigId: me.bomConfigId,
                recordData: me.recordData,
                productId: me.productId,
                impositionId: me.impositionId
            });
            me.items.push(editGenerateJobConfigForm);
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
