/**
 * Created by nan on 2020/7/1.
 * 管理生成job配置的管理界面
 * 复合类型的job生成配置记录自行组成
 */
Ext.define('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.GenerateJobConfig.view.GenerateJobConfigGrid', {
    extend: 'Ext.grid.Panel',
    requires: [
        'CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.GenerateJobConfig.store.GenerateJobConfigStore',
        'CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.GenerateJobConfig.controller.Controller',
        'CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.GenerateJobConfig.view.ManageJobConfigTab',
        'CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.GenerateJobConfig.view.SubJobConfigGrid',
        'CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.GenerateJobConfig.config.Config'
    ],
    impositionId: null,
    bomConfigId: null,
    productId: null,
    preview: null,
    alias: 'widget.generatejobconfiggrid',
    plugins: [
        {
            ptype: 'rowexpander',
            rowBodyTpl: new Ext.XTemplate(
                '<div id="gridExpander-{id}"></div>'
            ),
            isHadGridRowExpander: function (record) {
               
                if (record.get('clazz') != 'com.qpp.cgp.composing.config.JobGenerateConfig') {
                    return true;
                } else {
                    return false;
                }
            }
        }
    ],
    viewConfig: {
        enableTextSelection: true,
        loadMask: true,
        listeners: {
            expandBody: function (rowNode, record, expandRow) {
                var me = this;
                var orderLineItemDom = document.getElementById('gridExpander-' + record.get('id'));
                if (record.get('clazz') == 'com.qpp.cgp.composing.config.ConfigImpositionJobGenerateConfig') {
                    if (!orderLineItemDom.innerHTML) {
                        var grid = Ext.widget('subjobconfiggrid', {
                            store: Ext.create('Ext.data.Store', {
                                model: 'CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.GenerateJobConfig.model.GenerateJobConfigModel',
                                data: record.raw.singleJobConfigs,
                                proxy: {
                                    type: 'memory'
                                }
                            }),
                            renderTo: orderLineItemDom
                        })
                        console.log(orderLineItemDom);
                    }
                }
            }
        }
    },
    initComponent: function () {
        var me = this;
        var impositionId = me.impositionId;
        me.store = Ext.create('Ext.data.Store', {
            model: 'CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.GenerateJobConfig.model.GenerateJobConfigModel',
            data: [],
            proxy: {
                type: 'memory'
            }
        });
        me.generateJobConfigStore.on({
            beforeload: function (store) {
                var p = store.getProxy();
                if (Ext.isEmpty(p.filter)) {
                    p.filter = me.filter;
                }
            }
        });
        me.generateJobConfigStore.on({
            load: function (store, records) {
                var compositeJobConfig = {};
                var result = [];
                for (var i = 0; i < records.length; i++) {
                    var record = records[i];
                    var recordData = record.getData();
                    var productConfigImpositionId = recordData.compositeJobConfigId;
                    if (!Ext.isEmpty(productConfigImpositionId)) {
                        if (compositeJobConfig[productConfigImpositionId]) {

                        } else {
                            compositeJobConfig[productConfigImpositionId] = [];
                        }
                        compositeJobConfig[productConfigImpositionId].push(records[i]);
                    } else {
                        result.push(recordData);
                    }
                }
                for (var i in compositeJobConfig) {
                    var data = [];
                    for (var j = 0; j < compositeJobConfig[i].length; j++) {
                        data.push(compositeJobConfig[i][j].getData());
                    }
                    result.push({
                        clazz: 'com.qpp.cgp.composing.config.ConfigImpositionJobGenerateConfig',
                        singleJobConfigs: data,
                        compositeJobConfigId: i,
                        compositeJobConfig: compositeJobConfig[i][0].get('compositeJobConfig'),
                        id: JSGetUUID(),
                        name: '混合Job生成配置',
                        productConfigImpositionId: productConfigImpositionId,
                        condition: compositeJobConfig[i][0].get('condition'),
                        conditionDTO: compositeJobConfig[i][0].get('conditionDTO')
                    })
                }
                me.store.loadData(result);
            }
        });
        var controller = Ext.create('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.GenerateJobConfig.controller.Controller');
        me.tbar = [
            {
                xtype: 'button',
                text: i18n.getKey('create'),
                iconCls: 'icon_create',
                handler: function (btn) {
                    var grid = btn.ownerCt.ownerCt;
                    var tab = grid.ownerCt.ownerCt;
                    controller.selectGenerateJobConfigType(tab, grid, me.impositionId);
                }
            },
            {
                xtype: 'button',
                text: i18n.getKey('批量测试执行条件'),
                iconCls: 'icon_config',
                // hidden:true,//这里还未实现完全
                itemId: 'testImpressionSelectExpression',
                handler: function (btn) {
                    var grid = btn.ownerCt.ownerCt;
                    var generateIds=[];
                    grid.store.each(function (item){
                        generateIds.push(item.get('_id'))
                    });
                    // JSValidValueEx(data, me.uxTextareaContextData || {},executeHandler);
                    ///todo:implements validGenerateCondition
                    controller.validGenerateCondition(generateIds,me.uxTextareaContextData || {});
                }
            }];
        me.bbar = Ext.create('Ext.PagingToolbar', {
            store: me.generateJobConfigStore,
            displayInfo: true, // 是否显示，分页信息
            displayMsg: 'Displaying {0} - {1} of {2}', //显示的分页信息
            emptyMsg: i18n.getKey('noData')
        });
        me.columns = [
            {
                xtype: 'rownumberer',
                tdCls: 'vertical-middle'
            },
            {
                xtype: 'actioncolumn',
                width: 50,
                items: [
                    {
                        iconCls: 'icon_edit icon_margin',  // Use a URL in the icon config
                        tooltip: 'Edit',
                        handler: function (gridView, rowIndex, colIndex, a, b, record) {
                            var grid = gridView.ownerCt;
                            var tab = grid.ownerCt.ownerCt;
                            var recordData = record.raw;
                            var manageJobConfigTab = tab.getComponent('manageJobConfigTab');
                            if (manageJobConfigTab) {
                                tab.remove(manageJobConfigTab);
                            }
                            manageJobConfigTab = Ext.widget('managejobconfigtab', {
                                jobConfig: recordData.singleJobConfig || recordData.compositeJobConfig,
                                createOrEdit: 'edit',
                                productId: me.productId,
                                conditionDTOValue: recordData.conditionDTO,
                                bomConfigId: me.bomConfigId,
                                recordData: recordData
                            });
                            tab.add(manageJobConfigTab);
                            tab.setActiveTab(manageJobConfigTab);

                        }
                    },
                    {
                        iconCls: 'icon_remove icon_margin',
                        tooltip: 'Delete',
                        handler: function (view, rowIndex, colIndex, a, b, record) {
                            var ids = [];
                            if (record.get('clazz') == 'com.qpp.cgp.composing.config.ConfigImpositionJobGenerateConfig') {
                                for (var j = 0; j < record.raw.singleJobConfigs.length; j++) {
                                    var singleJobConfig = record.raw.singleJobConfigs[j];
                                    ids.push(singleJobConfig._id);
                                }
                            } else {
                                ids.push(record.getId());
                            }
                            Ext.Msg.confirm('提示', '确定删除？', callback);

                            function callback(id) {
                                if (id === 'yes') {
                                    controller.deleteGenerateJobConfig(view.ownerCt, ids);
                                }
                            }
                        }
                    }
                ]
            },
            {
                text: i18n.getKey('id'),
                dataIndex: '_id',
                width: 100
            },
            {
                text: i18n.getKey('name'),
                dataIndex: 'name',
                width: 150
            },
            {
                text: i18n.getKey('Job配置编号'),
                dataIndex: 'jobConfig',
                width: 200,
                xtype: 'componentcolumn',
                renderer: function (value, metadata, record) {
                    if (value) {
                        return value._id;
                    }
                }
            },
            {
                text: i18n.getKey('job配置名称'),
                dataIndex: 'jobConfig',
                width: 250,
                renderer: function (value, medate, record) {
                    return value.name;
                }
            },
            {
                text: i18n.getKey('jobType'),
                dataIndex: 'jobConfig',
                width: 100,
                renderer: function (value, medate, record) {
                    return value.jobType ? value.jobType : '组合';
                }
            },
            {
                text: i18n.getKey('执行条件'),
                dataIndex: 'condition',
                width: 100,
                xtype: 'componentcolumn',
                renderer: function (value, metadata, record) {
                    metadata.tdAttr = 'data-qtip="查看执行条件"';
                    if (value) {
                        return {
                            xtype: 'displayfield',
                            value: '<a href="#")>查看</a>',
                            listeners: {
                                render: function (display) {
                                    var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                    var ela = Ext.fly(a); //获取到a元素的element封装对象
                                    ela.on("click", function () {
                                        controller.checkExpression(value);
                                    });
                                }
                            }
                        };
                    }
                }

            },
            {
                text: '必须的上下文',
                dataIndex: 'contextConfig',
                width: 100,
                xtype: 'componentcolumn',
                renderer: function (value, metadata, record) {
                    metadata.tdAttr = 'data-qtip="查看必须的上下文"';
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
            },
            {
                text: i18n.getKey('page生成配置'),
                dataIndex: 'pages',
                flex: 1,
                xtype: 'componentcolumn',
                renderer: function (value, metadata, record) {
                    metadata.tdAttr = 'data-qtip="page生成配置"';
                    if (!Ext.isEmpty(value)) {
                        return {
                            xtype: 'displayfield',
                            value: '<a href="#")>查看</a>',
                            listeners: {
                                render: function (display) {
                                    var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                    var ela = Ext.fly(a); //获取到a元素的element封装对象
                                    ela.on("click", function () {
                                        controller.checkPageGenerateConfig(value);
                                    });
                                }
                            }
                        };
                    }
                }
            }
        ];
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
