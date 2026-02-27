/**
 * Created by nan on 2021/1/14
 */

Ext.define('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.SpecialConfigInfoFrom', {
    extend: 'Ext.ux.form.ErrorStrickForm',
    alias: 'widget.specialpreprocessconfigfrom',
    designId: null,
    clazz: null,
    title: i18n.getKey('baseInfo'),
    defaults: {
        margin: '10 25 5 50',
        width: 450,
        allowBlank: true
    },
    isValidForItems: true,
    initComponent: function () {
        var me = this;
        var targetMaterialViewTypeDataSourceStore = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.sourceconfig.store.SourceConfigStore', {
            params: {
                filter: Ext.JSON.encode([{
                    name: 'designId',
                    type: 'string',
                    value: me.designId
                }])
            }
        });
        var pageContentStore = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.sourceconfig.store.PageContentStore');
        var pageContentList = {
            xtype: 'gridcombo',
            fieldLabel: i18n.getKey('PC源数据列表'),
            name: 'pageContentList',
            itemId: 'pageContentList',
            id: 'pageContentList',
            displayField: 'name',
            valueField: '_id',
            editable: false,
            hidden: true,
            disabled: true,
            store: pageContentStore,
            matchFieldWidth: false,
            multiSelect: true,
            filterCfg: {
                height: 80,
                layout: {
                    type: 'column',
                    columns: 2
                },
                fieldDefaults: {
                    labelAlign: 'right',
                    layout: 'anchor',
                    width: 200,
                    style: 'margin-right:20px; margin-top : 5px;',
                    labelWidth: 50
                },
                items: [
                    {
                        name: '_id',
                        xtype: 'textfield',
                        isLike: false,
                        fieldLabel: i18n.getKey('id'),
                        itemId: 'id'
                    }, {
                        name: 'name',
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('name'),
                        itemId: 'name'
                    }, {
                        name: 'generateMode',
                        xtype: 'combo',
                        valueField: 'value',
                        displayField: 'display',
                        editable: false,
                        isLike: false,
                        hidden: true,
                        store: Ext.create('Ext.data.Store', {
                            fields: ['value', 'display'],
                            data: [
                                {
                                    value: 'auto',
                                    display: '自动创建'
                                }, {
                                    value: 'manual',
                                    display: '人工创建'
                                }]
                        }),
                        value: 'manual',
                        fieldLabel: i18n.getKey('generateMode'),
                        itemId: 'generateMode'
                    }
                ]
            },
            gridCfg: {
                store: pageContentStore,
                selType: 'checkboxmodel',
                height: 450,
                width: 500,
                columns: [
                    {
                        text: i18n.getKey('id'),
                        width: 120,
                        dataIndex: '_id'
                    },
                    {
                        text: i18n.getKey('name'),
                        flex: 1,
                        dataIndex: 'name',
                    }
                ],
                bbar: Ext.create('Ext.PagingToolbar', {
                    store: pageContentStore,
                    displayInfo: true,
                    displayMsg: 'Displaying {0} - {1} of {2}',
                    emptyMsg: i18n.getKey('noData')
                })
            },
            tipInfo: '所选PC必须有相同的结构,<br>使数据源位置配置可以查找出对应位置',
        };
        var pcSourceContentSelector = {
            xtype: 'jsonpathselectorfieldcontainer',
            name: 'pcSourceContentSelector',
            fieldLabel: i18n.getKey('PC源数据位置'),
            rows: 1,
            grow: true,
            maxHeight: 100,
            hidden: true,
            disabled: true,
            itemId: 'pcSourceContentSelector',
            getLayerData: function () {
                var result = null;
                var pageContentList = Ext.getCmp('pageContentList');
                var mvtData = pageContentList.getArrayValue()[0];
                if (mvtData) {
                    result = Ext.clone(mvtData);
                } else {
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('请先选择PC源数据'));
                }
                return result;
            }
        };
        var pcTargetSelector = {
            xtype: 'jsonpathselectorfieldcontainer',
            name: 'pcTargetSelector',
            fieldLabel: i18n.getKey('数据注入位置'),
            rows: 1,
            grow: true,
            maxHeight: 100,
            hidden: true,
            disabled: true,
            itemId: 'pcTargetSelector'
        };
        var bgColorElementSelector = {
            xtype: 'jsonpathselectorfieldcontainer',
            name: 'bgColorElementSelector',
            fieldLabel: i18n.getKey('背景颜色注入位置'),
            rows: 1,
            grow: true,
            maxHeight: 100,
            hidden: true,
            disabled: true,
            itemId: 'bgColorElementSelector'
        };
        var bgImageElementSelector = {
            xtype: 'jsonpathselectorfieldcontainer',
            name: 'bgImageElementSelector',
            fieldLabel: i18n.getKey('背景图片注入位置'),
            rows: 1,
            grow: true,
            maxHeight: 100,
            hidden: true,
            disabled: true,
            itemId: 'bgImageElementSelector'
        };
        var bgWidthEx = {
            xtype: 'valueexfield',
            name: 'bgWidthEx',
            fieldLabel: i18n.getKey('背景图宽度'),
            itemId: 'bgWidthEx',
            commonPartFieldConfig: {
                uxTextareaContextData: true,
                defaultValueConfig: {
                    type: 'Number',
                }
            }
        };
        var bgHeightEx = {
            xtype: 'valueexfield',
            name: 'bgHeightEx',
            fieldLabel: i18n.getKey('背景图长度'),
            itemId: 'bgHeightEx',
            commonPartFieldConfig: {
                uxTextareaContextData: true,
                defaultValueConfig: {
                    type: 'Number',
                }
            }
        };
        var bgUnit = {
            xtype: 'combo',
            name: 'bgUnit',
            fieldLabel: i18n.getKey('背景图尺寸单位'),
            itemId: 'bgUnit',
            value: 'mm',
            store: Ext.create('Ext.data.Store', {
                fields: ['value', 'display'],
                data: [

                    {
                        value: 'cm',
                        display: i18n.getKey('cm')
                    },
                    {
                        value: 'mm',
                        display: i18n.getKey('mm')
                    },
                    {
                        value: 'in',
                        display: i18n.getKey('in')
                    }
                ]
            }),
            editable: false,
            valueField: 'value',
            displayField: 'display'
        };
        me.items = [
            {
                xtype: 'textfield',
                name: '_id',
                allowBlank: true,
                hidden: true,
                itemId: '_id'
            },
            {
                xtype: 'textfield',
                name: 'description',
                allowBlank: false,
                value: '预处理配置描述',
                fieldLabel: i18n.getKey('description'),
                itemId: 'description'
            },
            {
                xtype: 'textfield',
                name: 'clazz',
                fieldLabel: i18n.getKey('clazz'),
                hidden: true,
                itemId: 'clazz',
                mapping: {
                    'common': ['description', 'clazz', 'designId', 'runWhenInit', 'targetMaterialViewType', '_id'],
                    'com.qpp.cgp.domain.preprocess.config.MaterialViewTypePreprocessConfig': [],
                    'com.qpp.cgp.domain.preprocess.config.CalenderPreprocessConfig': [
                        'monthContainerSelector', 'firstDateOfWeek', 'dateElementTemplate', 'dateRowSpacing',
                        'dateColumnSpacing', 'holidaySelector', 'holidayNation', 'holidayElementOperatorConfig',
                        'language', 'startMonth', 'total', 'monthImageSelector', 'layout', 'background'
                    ],
                    'com.qpp.cgp.domain.preprocess.config.RandomBackgroundPreprocessConfig': ['bgImageElementSelector', 'bgColorElementSelector', 'bgWidthEx', 'bgHeightEx', 'bgUnit'],
                    'com.qpp.cgp.domain.preprocess.config.RandomLayoutPreprocessConfig': ['pageContentList', 'pcTargetSelector', 'pcSourceContentSelector'],
                    'com.qpp.cgp.domain.preprocess.config.RandomContentPreprocessConfig': ['layout', 'background']
                },
                listeners: {
                    change: function (textField, newValue, oldValue) {
                        var form = textField.ownerCt;
                        for (var i = 0; i < form.items.items.length; i++) {
                            var item = form.items.items[i];
                            if (Ext.Array.contains(textField.mapping['common'], item.itemId)) {
                            } else if (Ext.Array.contains(textField.mapping[newValue], item.itemId)) {
                                item.show();
                                item.setDisabled(false);
                            } else {
                                item.hide();
                                item.setDisabled(true);
                            }
                        }
                    }
                }
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
                fieldLabel: i18n.getKey('预处理目标MVT'),
                store: targetMaterialViewTypeDataSourceStore,
                multiSelect: false,
                xtype: 'gridcombo',
                valueField: '_id',
                displayField: 'description',
                editable: false,
                allowBlank: false,
                id: 'targetMaterialViewType',
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
                            value: 'com.qpp.cgp.domain.preprocess.config.PageContentSourceConfig',
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
                    width: 800,
                    height: 450,
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
                            width: 200,
                            dataIndex: 'description',
                        },
                        {
                            text: i18n.getKey('额外信息'),
                            dataIndex: 'clazz',
                            itemId: 'extraInfo',
                            flex: 1,
                            xtype: 'sourcedataextrainfocolumn',
                        }
                    ],
                    bbar: Ext.create('Ext.PagingToolbar', {
                        store: targetMaterialViewTypeDataSourceStore,
                        displayInfo: true, // 是否 ? 示， 分 ? 信息
                        displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                        emptyMsg: i18n.getKey('noData')
                    })
                },
                tipInfo: '经过预处理后的数据将会注入到该MVT指定位置'
            },
            bgImageElementSelector,
            bgColorElementSelector,
            bgWidthEx,
            bgHeightEx,
            bgUnit,
            pcTargetSelector,
            pageContentList,
            pcSourceContentSelector,
            {
                xtype: 'optionalconfigcontainer',
                title: i18n.getKey('随机布局'),
                name: 'layout',
                itemId: 'layout',
                width: '100%',
                defaults: {
                    width: '100%'
                },
                allowBlank: true,
                initExpand: false,
                margin: '10 25 5 25',
                containerConfig: {
                    defaults: {
                        width: 450,
                        margin: '10 25 5 25',
                        allowBlank: false,
                    },
                },
                containerItems: [
                    {
                        xtype: 'textfield',
                        name: 'clazz',
                        fieldLabel: i18n.getKey('clazz'),
                        itemId: 'clazz',
                        hidden: true,
                        value: 'com.qpp.cgp.domain.preprocess.config.RandomLayoutPreprocessConfig'
                    },
                    Ext.Object.merge(Ext.clone(pageContentList), {
                        id: 'pageContentList2',
                        hidden: false,
                        disabled: false
                    }),
                    Ext.Object.merge(Ext.clone(pcSourceContentSelector), {
                        id: 'pcSourceContentSelector2',
                        hidden: false,
                        disabled: false,
                        getLayerData: function () {
                            var result = null;
                            var pageContentList = Ext.getCmp('pageContentList2');
                            var mvtData = pageContentList.getArrayValue()[0];
                            if (mvtData) {
                                result = Ext.clone(mvtData);
                            } else {
                                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('请先选择PC源数据'));
                            }
                            return result;
                        }

                    }),
                    Ext.Object.merge(Ext.clone(pcTargetSelector), {
                        id: 'pcTargetSelector2',
                        hidden: false,
                        disabled: false
                    })
                ]
            },
            {
                xtype: 'optionalconfigcontainer',
                title: i18n.getKey('随机背景'),
                name: 'background',
                itemId: 'background',
                width: '100%',
                defaults: {
                    width: '100%'
                },
                margin: '10 25 5 25',
                allowBlank: true,
                initExpand: false,
                containerConfig: {
                    defaults: {
                        width: 450,
                        margin: '10 25 5 25',
                        allowBlank: false,
                    },
                },
                containerItems: [
                    {
                        xtype: 'textfield',
                        name: 'clazz',
                        fieldLabel: i18n.getKey('clazz'),
                        itemId: 'clazz',
                        hidden: true,
                        value: 'com.qpp.cgp.domain.preprocess.config.RandomBackgroundPreprocessConfig'
                    },
                    Ext.Object.merge(Ext.clone(bgImageElementSelector), {
                        id: 'bgImageElementSelector2',
                        hidden: false,
                        disabled: false

                    }),
                    Ext.Object.merge(Ext.clone(bgColorElementSelector), {
                        id: 'bgColorElementSelector2',
                        hidden: false,
                        disabled: false,
                        allowBlank: true
                    }),
                    bgWidthEx,
                    bgHeightEx,
                    bgUnit,
                ]
            }
        ];
        me.callParent();
    }
})