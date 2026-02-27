/**
 * Created by nan on 2020/2/24.
 * 源mvtDataSource和目标mvtDataSource互斥
 *
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.BaseInfoForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.baseinfoform',
    designId: null,
    title: i18n.getKey('baseInfo'),
    defaults: {
        padding: '10 25 5 25',
        width: 350,
    },
    getValue: function () {
        var me = this;
        var data = me.getValues();
        var sourceMaterialViewTypes = me.getComponent('sourceMaterialViewTypes');
        var targetMaterialViewType = me.getComponent('targetMaterialViewType');
        var sourceMaterialViewTypesData = sourceMaterialViewTypes.getValue();
        var targetMaterialViewTypeData = targetMaterialViewType.getValue();
        var runWhenInit = me.getComponent('runWhenInit');
        data.runWhenInit = runWhenInit.getValue();
        data.sourceMaterialViewTypes = [];
        for (var i in sourceMaterialViewTypesData) {
            data.sourceMaterialViewTypes.push({
                _id: i,
                clazz: sourceMaterialViewTypesData[i].clazz
            })
        }
        for (var i in targetMaterialViewTypeData) {
            data.targetMaterialViewType = ({
                _id: i,
                clazz: targetMaterialViewTypeData[i].clazz
            })
        }
        return data;

    },
    setValue: function (data) {
        var me = this;
        //处理数据
        data.sourceMaterialViewTypes = data.sourceMaterialViewTypes.map(function (item) {
            return item._id;
        });
        data.targetMaterialViewType = [data.targetMaterialViewType._id];
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            if (item.xtype == 'gridcombo') {
                item.setInitialValue(data[item.getName()]);
            } else {
                item.setValue(data[item.getName()]);
            }
        }
    },
    isValid: function () {
        var me = this;
        var isValid = true;
        for (var i = 0; i < me.items.items.length; i++) {
            if (!me.items.items[i].isValid()) {
                isValid = false;
            }
        }
        isValid ? null : me.ownerCt.setActiveTab(me);
        return isValid;
    },
    initComponent: function () {
        var me = this;
        var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
        var sourceMaterialViewTypeDataSourceStore = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.sourceconfig.store.SourceConfigStore', {
            storeId: 'sourceMaterialViewTypeDataSourceStore',
            params: {
                filter: Ext.JSON.encode([{
                    name: 'designId',
                    type: 'string',
                    value: me.designId
                }])
            }
        });
        var targetMaterialViewTypeDataSourceStore = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.sourceconfig.store.SourceConfigStore', {
            storeId: 'targetMaterialViewTypeDataSourceStore',
            params: {
                filter: Ext.JSON.encode([{
                    name: 'designId',
                    type: 'string',
                    value: me.designId
                }])
            }
        });
        me.items = [
            {
                xtype: 'textfield',
                name: 'description',
                allowBlank: false,
                value: '默认预处理配置描述',
                fieldLabel: i18n.getKey('description'),
                itemId: 'description'
            },
            {
                xtype: 'textfield',
                name: 'clazz',
                fieldLabel: i18n.getKey('clazz'),
                hidden: true,
                itemId: 'clazz',
                value: 'com.qpp.cgp.domain.preprocess.config.MaterialViewTypePreprocessConfig'
            },
            {
                xtype: 'textfield',
                name: 'designId',
                fieldLabel: i18n.getKey('designId'),
                hidden: true,
                itemId: 'designId',
                value: me.designId
            },
            {
                xtype: 'checkbox',
                name: 'runWhenInit',
                inputValue: true,
                fieldLabel: i18n.getKey('是否初始化时运行'),
                itemId: 'runWhenInit',
            },
            {
                fieldLabel: i18n.getKey('源mvt'),
                store: sourceMaterialViewTypeDataSourceStore,
                multiSelect: true,
                valueField: '_id',
                displayField: 'description',
                editable: false,
                xtype: 'gridcombo',
                allowBlank: false,
                itemId: 'sourceMaterialViewTypes',
                id: 'sourceMaterialViewTypes',
                name: 'sourceMaterialViewTypes',
                matchFieldWidth: false,
                filterCfg: {
                    height: 80,
                    width: 480,
                    layout: {
                        type: 'column',
                        columns: 2
                    },
                    fieldDefaults: {
                        labelAlign: 'right',
                        layout: 'anchor',
                        style: 'margin-right:20px; margin-top : 5px;',
                        labelWidth: 70,
                        width: 220,
                    },
                    items: [
                        {
                            name: '_id',
                            xtype: 'textfield',
                            isLike: false,
                            fieldLabel: i18n.getKey('id'),
                            itemId: '_id'
                        },
                        {
                            name: 'name',
                            xtype: 'textfield',
                            fieldLabel: i18n.getKey('name'),
                            itemId: 'name'
                        },
                        {
                            xtype: 'combo',
                            name: 'clazz',
                            fieldLabel: i18n.getKey('config') + i18n.getKey('type'),
                            itemId: 'clazz',
                            editable: false,
                            valueField: 'value',
                            multiSelect: false,
                            displayField: 'display',
                            matchFieldWidth: false,
                            store: Ext.create('Ext.data.Store', {
                                fields: [
                                    'value', 'display'
                                ],
                                data: [
                                    {
                                        value: 'com.qpp.cgp.domain.preprocess.config.RtObjectSourceConfig',
                                        display: 'RtObjectSourceConfig'
                                    },
                                    {
                                        value: 'com.qpp.cgp.domain.preprocess.config.PageContentSourceConfig',
                                        display: 'PageContentSourceConfig'
                                    },
                                    {
                                        value: 'com.qpp.cgp.domain.preprocess.config.PageContentTemplateSourceConfig',
                                        display: 'PageContentTemplateSourceConfig'
                                    },
                                    {
                                        value: 'com.qpp.cgp.domain.preprocess.config.StaticPageContentLibrarySourceConfig',
                                        display: 'StaticPageContentLibrarySourceConfig'
                                    }
                                ]
                            })
                        },
                        {
                            name: 'designId',
                            xtype: 'textfield',
                            columnWidth: 0,
                            value: me.designId,
                            isLike: false,
                            hidden: true,
                            fieldLabel: i18n.getKey('designId'),
                            itemId: 'designId'
                        }
                    ]
                },
                gridCfg: {
                    store: sourceMaterialViewTypeDataSourceStore,
                    width: 650,
                    height: 280,
                    selType: 'checkboxmodel',
                    columns: [
                        {
                            text: i18n.getKey('id'),
                            dataIndex: '_id',
                            xtype: 'componentcolumn',
                            renderer: function (value, matete, record) {
                                return {
                                    xtype: 'displayfield',
                                    value: '<a href="#")>' + record.getId() + '</a>',
                                    sourceConfigId: record.getId(),
                                    listeners: {
                                        render: function (display) {
                                            var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                            var ela = Ext.fly(a); //获取到a元素的element封装对象
                                            ela.on("click", function () {
                                                var designId = JSGetQueryString('designId');
                                                var productId = JSGetQueryString('productId');
                                                var productBomConfigId = JSGetQueryString('productBomConfigId');
                                                builderConfigTab.manageSourceConfig(designId, productBomConfigId, productId, display.sourceConfigId);
                                            });
                                        }
                                    }
                                };
                            }
                        },
                        {
                            text: i18n.getKey('description'),
                            flex: 1,
                            dataIndex: 'description',
                        }, {
                            text: i18n.getKey('type'),
                            dataIndex: 'clazz',
                            itemId: 'clazz',
                            flex: 1,
                            renderer: function (value, metadata, record) {
                                return value.split('.').pop();
                            }
                        },

                    ],
                    bbar: Ext.create('Ext.PagingToolbar', {
                        store: sourceMaterialViewTypeDataSourceStore,
                        displayInfo: true, // 是否 ? 示， 分 ? 信息
                        displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                        emptyMsg: i18n.getKey('noData')
                    }),
                    listeners: {
                        beforedeselect: function (selModel, record, index) {
                           ;
                            var conditionMappingConfigGrid = me.ownerCt.getComponent('conditionMappingConfigGird');
                            var usingSourceMaterialViewTypeDataSourceIds = [];
                            if (conditionMappingConfigGrid.store.getCount() > 0) {
                                var conditionMappingConfigs = conditionMappingConfigGrid.getValue();
                                for (var i = 0; i < conditionMappingConfigs.conditionMappingConfigs.length; i++) {
                                    var conditionMappingConfig = conditionMappingConfigs.conditionMappingConfigs[i];
                                    for (var j = 0; j < conditionMappingConfig.pageContentTargetMappingConfigs.length; j++) {
                                        var pageContentMappingConfig = conditionMappingConfig.pageContentTargetMappingConfigs[j].pageContentMappingConfigs;
                                        for (var k = 0; k < pageContentMappingConfig.length; k++) {
                                            var dataSourceId = pageContentMappingConfig[k].sourcePageContentConfig.sourceConfig._id;
                                            if (usingSourceMaterialViewTypeDataSourceIds.indexOf(dataSourceId) == -1)
                                                usingSourceMaterialViewTypeDataSourceIds.push(dataSourceId);
                                        }
                                    }
                                }
                                if (Ext.Array.contains(usingSourceMaterialViewTypeDataSourceIds, record.getId())) {
                                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('该源数据正被使用'));
                                    return false;
                                }
                            }
                        }
                    }
                },
            },
            {
                fieldLabel: i18n.getKey('目标mvt'),
                store: targetMaterialViewTypeDataSourceStore,
                multiSelect: false,
                xtype: 'gridcombo',
                valueField: '_id',
                displayField: 'description',
                editable: false,
                allowBlank: false,
                name: 'targetMaterialViewType',
                itemId: 'targetMaterialViewType',
                matchFieldWidth: false,
                filterCfg: {
                    height: 80,
                    layout: {
                        type: 'column',
                        columns: 2
                    },
                    fieldDefaults: {
                        labelAlign: 'right',
                        layout: 'anchor',
                        width: 220,
                        style: 'margin-right:20px; margin-top : 5px;',
                        labelWidth: 70
                    },
                    items: [
                        {
                            name: '_id',
                            xtype: 'textfield',
                            isLike: false,
                            fieldLabel: i18n.getKey('id'),
                            itemId: '_id'
                        },
                        {
                            name: 'name',
                            xtype: 'textfield',
                            fieldLabel: i18n.getKey('name'),
                            itemId: 'name'
                        },
                        {
                            xtype: 'combo',
                            name: 'clazz',
                            fieldLabel: i18n.getKey('config') + i18n.getKey('type'),
                            itemId: 'clazz',
                            editable: false,
                            valueField: 'value',
                            multiSelect: false,
                            displayField: 'display',
                            matchFieldWidth: false,
                            store: Ext.create('Ext.data.Store', {
                                fields: [
                                    'value', 'display'
                                ],
                                data: [
                                    {
                                        value: 'com.qpp.cgp.domain.preprocess.config.RtObjectSourceConfig',
                                        display: 'RtObjectSourceConfig'
                                    },
                                    {
                                        value: 'com.qpp.cgp.domain.preprocess.config.PageContentSourceConfig',
                                        display: 'PageContentSourceConfig'
                                    },
                                    {
                                        value: 'com.qpp.cgp.domain.preprocess.config.PageContentTemplateSourceConfig',
                                        display: 'PageContentTemplateSourceConfig'
                                    },
                                    {
                                        value: 'com.qpp.cgp.domain.preprocess.config.StaticPageContentLibrarySourceConfig',
                                        display: 'StaticPageContentLibrarySourceConfig'
                                    }
                                ]
                            })
                        },
                        {
                            name: 'designId',
                            xtype: 'textfield',
                            columnWidth: 0,
                            value: me.designId,
                            isLike: false,
                            hidden: true,
                            fieldLabel: i18n.getKey('designId'),
                            itemId: 'designId'
                        }
                    ]
                },
                gridCfg: {
                    store: targetMaterialViewTypeDataSourceStore,
                    width: 650,
                    height: 280,
                    columns: [
                        {
                            text: i18n.getKey('id'),
                            dataIndex: '_id',
                            xtype: 'componentcolumn',
                            renderer: function (value, matete, record) {
                                return {
                                    xtype: 'displayfield',
                                    value: '<a href="#")>' + record.getId() + '</a>',
                                    sourceConfigId: record.getId(),
                                    listeners: {
                                        render: function (display) {
                                            var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                            var ela = Ext.fly(a); //获取到a元素的element封装对象
                                            ela.on("click", function () {
                                                var designId = JSGetQueryString('designId');
                                                var productId = JSGetQueryString('productId');
                                                var productBomConfigId = JSGetQueryString('productBomConfigId');
                                                builderConfigTab.manageSourceConfig(designId, productBomConfigId, productId, display.sourceConfigId);
                                            });
                                        }
                                    }
                                };
                            }
                        },
                        {
                            text: i18n.getKey('description'),
                            flex: 1,
                            dataIndex: 'description',
                        }, {
                            text: i18n.getKey('type'),
                            dataIndex: 'clazz',
                            itemId: 'clazz',
                            flex: 1,
                            renderer: function (value, metadata, record) {
                                return value.split('.').pop();
                            }
                        },
                    ],
                    bbar: Ext.create('Ext.PagingToolbar', {
                        store: targetMaterialViewTypeDataSourceStore,
                        displayInfo: true, // 是否 ? 示， 分 ? 信息
                        displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                        emptyMsg: i18n.getKey('noData')
                    })
                }
            }
        ];
        me.callParent();
    }
})
