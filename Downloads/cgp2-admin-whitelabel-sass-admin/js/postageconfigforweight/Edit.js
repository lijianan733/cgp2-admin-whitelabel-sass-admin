/***
 *Created by nan on 2023/9/12
 *
 *  */
Ext.Loader.syncRequire([
    'CGP.postageconfigforweight.view.AreaPostageFieldSet',
    'CGP.postageconfigforweight.model.PostageConfigModel'
])
Ext.onReady(function () {
    var page = Ext.widget({
        i18nblock: i18n.getKey('重量计运费配置'),
        xtype: 'uxeditpage',
        block: 'postageconfigforweight',
        gridPage: 'main.html',
        tbarCfg: {
            disabledButtons: ['reset']
        },
        formCfg: {
            model: 'CGP.postageconfigforweight.model.PostageConfigModel',
            useForEach: true,
            defaults: {
                margin: '5 25'
            },
            layout: 'vbox',
            fieldDefaults: {},
            items: [
                {
                    xtype: 'splitbar',
                    title: '<font style="font-weight: bold;color: green;">基础信息</font>',
                    width: '100%',
                    margin: false,
                    itemId: 'title1',
                },
                {
                    xtype: 'hiddenfield',
                    name: '_id',
                    itemId: '_id',
                    fieldLabel: i18n.getKey('_id')
                },
                {
                    xtype: 'hiddenfield',
                    name: 'clazz',
                    itemId: 'clazz',
                    fieldLabel: i18n.getKey('clazz'),
                    value: 'com.qpp.cgp.domain.shipment.WeightBasedPostageConfig'
                },
                {
                    xtype: 'textfield',
                    name: 'name',
                    itemId: 'name',
                    margin: '10 25',
                    allowBlank: false,
                    fieldLabel: i18n.getKey('name')
                },
                {
                    xtype: 'splitbar',
                    width: '100%',
                    itemId: 'title2',
                    margin: '25 0 0 0',
                    items: [
                        {
                            xtype: 'displayfield',
                            value: '<font style="font-weight: bold;color: green;">重量计运费规则表</font>',
                            width: 110,
                        },
                        {
                            xtype: 'button',
                            text: '添加',
                            iconCls: 'icon_add',
                            handler: function (btn) {
                                var areaWeightBasedPostageConfigs = btn.ownerCt.ownerCt.getComponent('areaWeightBasedPostageConfigs');
                                areaWeightBasedPostageConfigs.add({
                                    xtype: 'area_postage_fieldset',
                                    title: '区域规则',
                                })
                            }
                        },
                        {
                            xtype: 'button',
                            tooltip: '全部收起',
                            text: '全部收起',
                            itemId: 'collapseBtn',
                            iconCls: 'icon_collapseAll',
                            handler: function (btn) {
                                var areaWeightBasedPostageConfigs = btn.ownerCt.ownerCt.getComponent('areaWeightBasedPostageConfigs');
                                areaWeightBasedPostageConfigs.suspendLayouts();
                                areaWeightBasedPostageConfigs.items.items.map(function (item) {
                                    item.collapse();
                                });
                                areaWeightBasedPostageConfigs.resumeLayouts();
                                areaWeightBasedPostageConfigs.doLayout();
                            }
                        }
                    ]
                },
                {
                    xtype: 'uxfieldcontainer',
                    name: 'areaWeightBasedPostageConfigs',
                    itemId: 'areaWeightBasedPostageConfigs',
                    width: '100%',
                    flex: 1,
                    margin: false,
                    autoScroll: true,
                    layout: 'vbox',
                    defaults: {
                        margin: '15 25'
                    },
                    diyGetValue: function () {
                        var me = this;
                        var data = [];
                        me.items.items.map(function (item) {
                            data.push(item.diyGetValue());
                        })
                        return data;
                    },
                    diySetValue: function (data) {
                        var me = this;
                        me.removeAll();
                        if (data && data.length > 0) {
                            me.suspendLayouts();
                            data.map(function (item) {
                                me.add({
                                    xtype: 'area_postage_fieldset',
                                    title: '区域规则',
                                    initData: item,
                                });
                            });
                            me.resumeLayouts();
                            me.doLayout();
                        }
                    },
                    items: [
                        {
                            xtype: 'area_postage_fieldset',
                            title: '区域规则',
                        }
                    ]
                }

            ],
        },
    });
});

