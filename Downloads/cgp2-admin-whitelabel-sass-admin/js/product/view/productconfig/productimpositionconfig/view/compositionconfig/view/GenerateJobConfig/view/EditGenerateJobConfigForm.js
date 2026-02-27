/**
 * Created by nan on 2020/7/1.
 */
Ext.define('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.GenerateJobConfig.view.EditGenerateJobConfigForm', {
    extend: 'Ext.ux.form.ErrorStrickForm',
    requires: [
        'CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.GenerateJobConfig.store.JobConfigStore',
        'CGP.common.rttypetortobject.view.RtTypeAttributeValueExInputForm',
        'CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.store.ProductMaterialViewTypeVersionFiveStore',
        'CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.GenerateJobConfig.view.EditPageGenerateConfigWindow',
        'CGP.common.rttypetortobject.view.RtTypeAttributeInputFieldContainer',
        'CGP.common.condition.ConditionFieldV3',
        'CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.GenerateJobConfig.config.Config'

    ],
    alias: 'widget.editgeneratejobconfigform',
    defaults: {
        width: 400,
        margin: '10 30 10 30',
        allowBlank: false,
    },
    singleJobConfig: null,
    isValidForItems: true,//是否校验时用getFields来获取所有field
    recordData: null,
    impositionId: null,
    bomConfigId: null,
    productId: null,//该配置可能为空
    compositeJobConfigId: null,
    designId: null,//个impression配置关联的最新design配置id,这里选用的pmvt是
    commonExpression: false,//是否有共有的执行条件
    listeners: {
        afterrender: function (form) {
            var me = this;
            if (me.recordData) {
                me.diySetValue(me.recordData);
            }
            me.designId = me.controller.getLatestProductConfigDesign(me.impositionId).id;
        }
    },
    diyGetValue: function () {
        var me = this;
        var data = me.getValue();

        //对conditionDTO字段进行处理，用改字段生成condition字段,如果以前有旧数据,使用以前的
        //如果是使用conditionDTO组件，再期其清空数据时，把condition也做清除
        var conditionDTO = me.getComponent('conditionDTO');
        var condition = me.getComponent('condition');
        if (conditionDTO.hidden == false) {
            if (data.conditionDTO) {
                data.condition = conditionDTO.getExpression();
            } else {
                data.condition = null;
            }
        }
        //多job的情况
        if (conditionDTO.hidden == true && condition.hidden == true) {
            data.condition = conditionDTO.getExpression();
            data.conditionDTO = conditionDTO.getValue();
        }
        return data;
    },
    diySetValue: function (data) {
        var me = this;
        me.setValue(data);
        //新的条件组件的设置值处理
        var condition = me.getComponent('condition');
        var conditionDTO = me.getComponent('conditionDTO');
        if (me.commonExpression) {
            conditionDTO.hide();
            conditionDTO.setDisabled(true);
            condition.hide();
        } else {
            if (data.conditionDTO) {
                //如果有配置conditionDto，则显示新的条件组件，否则使用旧的
                conditionDTO.show();
                conditionDTO.setDisabled(false);
                condition.hide();
                condition.setDisabled(true);
            } else {
                if (Ext.isEmpty(data.condition)) {
                    //两个都没配置使用新的组件
                    conditionDTO.show();
                    conditionDTO.setDisabled(false);
                    condition.hide();
                    condition.setDisabled(true);
                } else {
                    condition.show();
                    condition.setDisabled(false);
                    conditionDTO.hide();
                    conditionDTO.setDisabled(true);
                }
            }
        }
    },
    initComponent: function () {
        var me = this;
        var controller = me.controller = Ext.create('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.GenerateJobConfig.controller.Controller');
        var jobRtTypeId = me.singleJobConfig.context ? me.singleJobConfig.context._id : null;
        me.impositionId = JSGetQueryString('impositionId');
        var generatePageConfigData = [];
        for (var i = 0; i < me.singleJobConfig.pages.length; i++) {
            generatePageConfigData.push({
                clazz: "com.qpp.cgp.composing.config.PageGenerateConfig",
                pageConfigId: me.singleJobConfig.pages[i],
                contextConfig: null,
                isExtra: true,
                designDataConfig: null,
            })
        }

        //构建表达式的数据
        var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
        var productId = builderConfigTab.productId;
        var contentData = controller.buildContentData(productId);
        var contextTemplate = controller.buildContentTemplate(contentData);
        var rtTypeId = JSGetQueryString('rtTypeId');
        var rtAttribute = controller.getRtAttribute(rtTypeId);
        if (rtAttribute?.length > 0) {
            contentData = contentData.concat(rtAttribute);
        }
        var productMaterialViewTypeVersionFiveStore = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.store.ProductMaterialViewTypeVersionFiveStore', {
            proxy: {
                type: 'uxrest',
                url: adminPath + 'api/productConfigImpositions/' + me.impositionId + '/productMaterialViewTypes',
                reader: {
                    type: 'json',
                    root: 'data'
                }
            }
        });
        me.items = [
            {
                xtype: 'displayfield',
                name: 'productConfigImpositionId',
                hidden: true,
                value: me.impositionId
            },
            {
                xtype: 'displayfield',
                name: 'clazz',
                hidden: true,
                value: 'com.qpp.cgp.composing.config.JobGenerateConfig'
            },
            {
                xtype: 'displayfield',
                name: 'singleJobConfigId',
                hidden: true,
                value: me.singleJobConfig._id,
            },
            {
                xtype: 'displayfield',
                name: 'compositeJobConfigId',
                hidden: true,
                value: me.compositeJobConfigId,
            },
            {
                xtype: 'uxfieldcontainer',
                name: 'singleJobConfig',
                fieldLabel: i18n.getKey('job配置信息'),
                defaults: {
                    margin: '5 0 0 105',
                    allowBlank: false,
                    width: '100%',
                },
                items: [
                    {
                        xtype: 'displayfield',
                        name: '_id',
                        hidden: true,
                        value: me.singleJobConfig._id,
                    },
                    {
                        xtype: 'displayfield',
                        name: 'clazz',
                        hidden: true,
                        value: 'com.qpp.job.domain.config.SingleJobConfig',
                    },
                    {
                        xtype: 'displayfield',
                        fieldLabel: i18n.getKey('id'),
                        name: '_id',
                        value: me.singleJobConfig._id,
                        diySetValue: function () {
                        },
                    },
                    {
                        xtype: 'displayfield',
                        name: 'name',
                        fieldLabel: i18n.getKey('name'),
                        value: me.singleJobConfig.name
                    }, {
                        xtype: 'displayfield',
                        name: 'jobType',
                        fieldLabel: i18n.getKey('jobType'),
                        value: me.singleJobConfig.jobType
                    }
                ]
            },
            {
                xtype: 'textfield',
                name: 'name',
                fieldLabel: i18n.getKey('name'),
                itemId: 'name'
            },
            {
                xtype: 'checkboxgroup',
                fieldLabel: i18n.getKey('compose') + i18n.getKey('type'),
                name: 'supportTypes',
                columns: 2,
                allowBlank: true,
                vertical: true,
                items: [
                    {
                        boxLabel: i18n.getKey('NORMAL') + i18n.getKey('compose'),
                        name: 'supportTypes',
                        inputValue: 'DEFAULT',
                        checked: true
                    },
                    {
                        boxLabel: i18n.getKey('template') + i18n.getKey('compose'),
                        name: 'supportTypes',
                        inputValue: 'TEMPLATE'
                    }
                ],
                diyGetValue: function () {
                    var me = this, data = [];
                    if (Ext.Object.getValues(me.getValue())[0]) {
                        data = data.concat(Ext.Object.getValues(me.getValue())[0]);
                    }
                    return data;
                },
                diySetValue: function (data) {
                    var me = this;
                    var value = {};
                    value[me.name] = data;
                    me.setValue(value);
                }
            },
            {
                xtype: 'expressionfield',
                fieldLabel: me.commonExpression ? i18n.getKey('公有的执行条件') : i18n.getKey('执行条件'),
                name: 'condition',
                hidden: true,
                tipInfo: me.commonExpression ? '混合的Job生成配置共用同一个执行条件' : null,
                itemId: 'condition',
                allowBlank: true,
                defaultResultType: 'Boolean',
                uxTextareaContextData: {},
                defaultExpression: 'function expression(args) { return true; }',
                defaultClazz: 'com.qpp.cgp.expression.Expression',
                expressionConfig: {
                    emptyText: '例如：function expression(args) { return args.context.batchId == 1 }'
                }
            },
            {
                xtype: 'conditionfieldv3',
                itemId: 'conditionDTO',
                checkOnly: false,
                inputModel: 'MULTI',
                name: 'conditionDTO',
                fieldLabel: me.commonExpression ? i18n.getKey('公有的执行条件') : i18n.getKey('执行条件'),
                hidden: me.commonExpression,
                contextTemplate: contextTemplate,
                contentData: contentData,
                // rtAttribute: rtAttribute,
                valueType: 'expression',
                tipInfo: me.commonExpression ? '混合的Job生成配置共用同一个执行条件' : null,
                allowBlank: true,
                conditionWindowConfig: {
                    conditionFieldContainerConfig: {
                        conditionPanelItems: {
                            qtyConditionGridPanel: {
                                hidden: false,
                            }
                        }
                    }
                }
            },
            {
                xtype: 'rttypeattributeinputfieldcontainer',
                width: 700,
                itemId: 'contextConfig',
                name: 'contextConfig',
                allowBlank: false,
                rtTypeId: jobRtTypeId,
                fieldLabel: i18n.getKey('上下文')
            },
            {
                xtype: 'gridfield',
                name: 'pages',
                itemId: 'pages',
                fieldLabel: i18n.getKey('page生成配置'),
                msgTarget: 'none',
                hidden: Ext.isEmpty(me.singleJobConfig.pages),
                disabled: Ext.isEmpty(me.singleJobConfig.pages),
                allowBlank: false,
                gridConfig: {
                    renderTo: JSGetUUID(),
                    autoScroll: true,
                    minHeight: 120,
                    maxHeight: 200,
                    width: 850,
                    store: Ext.create('Ext.data.Store', {
                        xtype: 'store',
                        fields: [
                            {name: 'pageConfigId', type: 'string'},
                            {
                                name: 'designDataConfig', type: 'object'
                            },
                            {name: 'contextConfig', type: 'object'},
                            {
                                name: 'clazz',
                                type: 'string',
                                defaultValue: 'com.qpp.cgp.composing.config.PageGenerateConfig'
                            },
                            {
                                name: '_id',//这不是记录的唯一标识，其实是designId，要就问志勇
                                type: 'string'
                            }, {
                                name: 'isExtra',
                                type: 'boolean',
                                defaultValue: true,
                            }
                        ],
                        proxy: {
                            type: 'memory'
                        },
                        data: generatePageConfigData
                    }),
                    tbar: {
                        hidden: true,
                    },
                    columns: [
                        {
                            xtype: 'actioncolumn',
                            tdCls: 'vertical-middle',
                            itemId: 'actioncolumn',
                            width: 60,
                            sortable: false,
                            resizable: false,
                            menuDisabled: true,
                            items: [
                                {
                                    iconCls: 'icon_edit icon_margin',
                                    itemId: 'actionedit',
                                    tooltip: 'Edit',
                                    handler: function (view, rowIndex, colIndex, icon, event, record) {
                                        var grid = view.ownerCt;
                                        var pageConfigId = record.get('pageConfigId');
                                        var pageConfig = controller.getPageConfigs(pageConfigId)[0];
                                        try {
                                            var win = Ext.create('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.GenerateJobConfig.view.EditPageGenerateConfigWindow', {
                                                productMaterialViewTypeStore: productMaterialViewTypeVersionFiveStore,
                                                pageConfigId: pageConfigId,
                                                pageConfig: pageConfig,
                                                gridFieldGrid: grid,
                                                record: record,
                                                rowIndex: rowIndex,
                                                designId: me.designId,
                                                bomConfigId: me.bomConfigId
                                            });
                                            win.show();
                                        } catch (e) {
                                            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('page数据有错误!'));
                                        }
                                    }
                                },
                                {
                                    iconCls: 'icon_remove icon_margin',
                                    tooltip: '关联的Job上已不存在该Page配置',
                                    isDisabled: function (view, rowIndex, colIndex, actionColumns, record) {
                                        var me = this;
                                        return (record.raw.isExtra);
                                    },
                                    handler: function (view, rowIndex, colIndex) {
                                        var store = view.getStore();
                                        store.removeAt(rowIndex);
                                    }
                                }
                            ]
                        },
                        {
                            text: i18n.getKey('pageConfig'),
                            dataIndex: 'pageConfigId',
                            width: 200,
                            xtype: 'componentcolumn',
                            renderer: function (value, metadata, record) {
                                var page = controller.getPageConfigs(value)[0];
                                return page.name + '(' + page._id + ')';
                            }
                        },
                        {
                            text: i18n.getKey('产品物料ViewType编号'),
                            dataIndex: 'designDataConfig',
                            width: 200,
                            xtype: 'componentcolumn',
                            renderer: function (value, metadata, record) {
                                if (value.productMaterialViewTypeId) {
                                    metadata.tdAttr = 'data-qtip="查看productMaterialViewType配置"';
                                    return {
                                        xtype: 'displayfield',
                                        value: '<a href="#")>' + value.productMaterialViewTypeId + '</a>',
                                        listeners: {
                                            render: function (display) {
                                                var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                                var ela = Ext.fly(a); //获取到a元素的element封装对象
                                                ela.on("click", function () {
                                                    //以关联的最新的design来查看
                                                    controller.checkProductMaterialViewType(value.productMaterialViewTypeId, me.productId, me.bomConfigId, me.designId);
                                                });
                                            }
                                        }
                                    };
                                } else {
                                    return null;
                                }
                            }
                        },
                        {
                            text: i18n.getKey('materialPath'),
                            dataIndex: 'designDataConfig',
                            width: 200,
                            renderer: function (value, meta, record) {
                                meta.tdAttr = 'data-qtip="' + value.materialPath + '"';
                                if (value) {
                                    // return '<div style="white-space:normal;word-wrap:break-word; overflow:hidden;">' + value.materialPath + '</div>';
                                    return value.materialPath;
                                }
                            }
                        },
                        {
                            text: i18n.getKey('pciQty'),
                            dataIndex: 'designDataConfig',
                            width: 80,
                            renderer: function (value, meta, record) {
                                //meta.tdAttr = 'data-qtip="' + value.materialPath + '"';
                                if (value.pciQty) {
                                    return value.pciQty;
                                }
                            }
                        },
                        {
                            text: i18n.getKey('上下文变量'),
                            dataIndex: 'contextConfig',
                            flex: 1,
                            minWidth: 100,
                            xtype: 'componentcolumn',
                            renderer: function (value, record) {
                                if (value) {
                                    return {
                                        xtype: 'displayfield',
                                        value: '<a href="#")>查看</a>',
                                        listeners: {
                                            render: function (display) {
                                                var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                                var ela = Ext.fly(a); //获取到a元素的element封装对象
                                                ela.on("click", function () {
                                                    controller.showContext(value);
                                                });
                                            }
                                        }
                                    };
                                }
                            }
                        }
                    ]
                },
                diySetValue: function (data) {
                    var me = this;
                    var store = me.getStore();
                    for (var i = 0; i < data.length; i++) {
                        //是否在job配置中存在
                        var index = store.findExact('pageConfigId', data[i].pageConfigId + '', 0);
                        data[i].isExtra = (index != -1);
                        if (data[i].isExtra == true) {
                            //存在了就覆盖
                            store.proxy.data[index] = data[i];
                        } else {
                            //不存在了就添加
                            store.proxy.data.push(data[i]);
                        }
                        //处理旧数据里面designDataConfig缺失clazz
                        if (data[i].designDataConfig) {
                            data[i].designDataConfig.clazz = 'com.qpp.cgp.composing.config.PageDesignDataConfig';
                        }
                    }
                    store.load();
                },
                validate: function () {
                    var me = this;
                    if (me.disabled) {
                        return true;
                    }
                    var isValid = true;
                    var data = me.gridConfig.store.data.items;
                    for (var i = 0; i < data.length; i++) {
                        var item = data[i].getData();
                        if (Ext.Object.isEmpty(item.designDataConfig)) {
                            me.errorStr = 'page生成配置中每条配置必须完备';
                            me.setActiveError(me.errorStr);
                            me.renderActiveError();
                            isValid = false;
                            break;
                        }
                        if (data[i].raw.isExtra == false) {
                            me.errorStr = '关联的job配置中删除了部分page配置,请手动处理';
                            me.setActiveError(me.errorStr);
                            me.renderActiveError();
                            isValid = false;
                            break;
                        }
                    }
                    return isValid;
                },
                getErrors: function () {
                    var me = this;
                    return me.errorStr;
                },
            }
        ];
        me.callParent();

    },
})
