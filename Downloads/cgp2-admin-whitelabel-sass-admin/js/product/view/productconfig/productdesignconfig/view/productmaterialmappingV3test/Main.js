/**
 * Created by nan on 2020/5/20.
 */
Ext.Loader.syncRequire(['CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3test.model.ProductMaterialMappingV3HistoryModel']);
Ext.onReady(function () {
    var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
    var productId = JSGetQueryString('productId');
    var controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3test.controller.Controller');
    var productConfigDesignId = JSGetQueryString('productConfigDesignId');
    var configType = JSGetQueryString('configType');
    var MMTId = JSGetQueryString('MMTId');
    var skuAttributesStore = Ext.create('CGP.product.view.managerskuattribute.store.SkuAttributeGridStore', {
        storeId: 'skuAttributeStore',
        autoLoad: true,
        aimUrlId: productId
    });
    var store = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3test.store.ProductMaterialMappingV3HistoryStore', {
        params: {
            filter: Ext.JSON.encode([{
                name: configType == 'mappingConfig' ? 'productMappingId' : 'productDesignId',
                type: 'number',
                value: productConfigDesignId
            }])
        }
    });
    var customerStore = Ext.create('CGP.customer.store.CustomerStore', {});
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('language'),
        isReadOnly: true,
        block: 'language',
        editPage: 'edit.html',
        gridCfg: {
            store: store,
            frame: false,
            columnDefaults: {
                autoSizeColumn: true,
                tdCls: 'vertical-middle',
                sortable: false,
                width: 200,
                menuDisabled: true
            },
            editActionHandler: function (gridView, rowIndex, colIndex, view, event, record, dom) {
               ;
                var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
                var productId = JSGetQueryString('productId');
                builderConfigTab.checkTestRecordDetail(productId, record.getId());
            },
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    itemId: 'id',
                    width: 100,
                },
                {
                    text: i18n.getKey('测试数据'),
                    dataIndex: 'productAttributes',
                    itemId: 'productAttributes',
                    xtype: 'componentcolumn',
                    width: 100,
                    renderer: function (value, metadata, record, rowIndex, colIndex, store, gridView) {
                        metadata.tdAttr = 'data-qtip="查看测试数据"';
                        return {
                            xtype: 'displayfield',
                            value: '<a href="#")> 查看</a>',
                            listeners: {
                                render: function (display) {
                                    var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                    var ela = Ext.fly(a); //获取到a元素的element封装对象
                                    ela.on("click", function () {
                                        var skuAttributeStore = Ext.data.StoreManager.get('skuAttributeStore');
                                        var form = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3test.view.ProductSkuAttributeForm', {
                                            border: false,
                                            skuAttributeStore: skuAttributeStore,
                                            isReadOnly: false
                                        });
                                        var win = Ext.create('Ext.window.Window', {
                                            layout: 'fit',
                                            modal: true,
                                            constrain: true,
                                            title: i18n.getKey('check') + i18n.getKey('测试数据'),
                                            items: [form],
                                            tbar: [
                                                {
                                                    text: i18n.getKey('以当前数据重试'),
                                                    dataIndex: 'retry',
                                                    itemId: 'retry',
                                                    iconCls: 'icon_reset',
                                                    handler: function (btn) {
                                                        Ext.Msg.confirm(i18n.getKey('prompt'), '是否重试?', function (selector) {
                                                            if (selector == 'yes') {
                                                                var grid = gridView.ownerCt;
                                                                win.el.mask('请求中...');
                                                                var form = win.items.items[0];
                                                                var data = {};
                                                                form.items.items.forEach(function (item) {
                                                                    if (item.disabled == false) {
                                                                        if (item.xtype == 'datetimefield') {
                                                                            data[item.getName()] = Ext.util.Format.date(item.getValue(), 'Y/m/d H:i:s');
                                                                        } else {
                                                                            data[item.getName()] = item.getValue();
                                                                        }
                                                                    }
                                                                });
                                                                var attributeData = record.get('productAttributes');
                                                                var result = controller.retryTestMapping(attributeData, productConfigDesignId, record.store, configType);
                                                                win.el.unmask();
                                                                win.close();
                                                            }
                                                        })
                                                    }
                                                }, {
                                                    text: i18n.getKey('查看JSON'),
                                                    dataIndex: 'retry',
                                                    itemId: 'checkJSON',
                                                    iconCls: 'icon_check',
                                                    handler: function (btn) {
                                                        JSShowJsonData(record.get('productAttributes'), '测试数据');
                                                    }
                                                }
                                            ]
                                        });
                                        win.show();
                                        var data = {};
                                        for (var i = 0; i < value.length; i++) {
                                            data[value[i].id] = value[i].value;
                                        }
                                        win.items.items[0].setValue(data);
                                    });
                                }
                            }
                        };
                    }
                },
                {
                    text: i18n.getKey('测试人员'),
                    dataIndex: 'operator',
                    itemId: 'operator',
                    renderer: function (value, metaData, record) {
                        return '姓名：' + value.lastName + value.firstName + '<br>邮箱：' + value.email + '';
                    }
                },
                {
                    text: i18n.getKey('测试时间'),
                    dataIndex: 'operationTime',
                    itemId: 'operationTime',

                    renderer: function (value, mateData, record) {
                        mateData.style = "color: gray";
                        value = Ext.Date.format(value, 'Y/m/d H:i');
                        mateData.tdAttr = 'data-qtip="' + value + '"';
                        return '<div style="white-space:normal;">' + value + '</div>';
                    }
                },
                {
                    text: i18n.getKey('status'),
                    dataIndex: 'runResult',
                    itemId: 'status',
                    renderer: function (value, metaData, record) {
                        return value ? '<font color=green>成功</font>' : '<font color=red>失败</font>';
                    }
                },
                {
                    text: i18n.getKey('测试结果'),
                    dataIndex: 'runResult',
                    itemId: 'runResult',
                    xtype: 'componentcolumn',
                    flex: 1,
                    minWidth: 150,
                    renderer: function (value, metaData, record) {
                        var material = record.get('material');
                        var executeExpect = record.get('executeExpect');
                        var data = record.getData();
                        if (value) {
                            if (executeExpect == 'Uncertain') {
                                executeExpect = '待确定';
                            } else if (executeExpect == 'Conformity') {
                                executeExpect = '符合期望';
                            } else {
                                executeExpect = '不符合期望';
                            }
                            return {
                                xtype: 'fieldcontainer',
                                layout: 'vbox',
                                items: [
                                    {
                                        xtype: 'displayfield',
                                        labelWidth: 50,
                                        fieldLabel: i18n.getKey('物料'),
                                        value: '<a title="查看物料"  href="#")>' + material._id + '</a>',
                                        listeners: {
                                            render: function (display) {
                                                var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                                var ela = Ext.fly(a); //获取到a元素的element封装对象
                                                ela.on("click", function () {
                                                    JSOpen({
                                                        id: 'material' + '_edit',
                                                        url: path + "partials/material/edit.html?materialId=" + material._id + '&isLeaf=' + false + '&parentId= &isOnly=true',
                                                        title: i18n.getKey('materialInfo') + '(' + i18n.getKey('id') + ':' + material._id + ')',
                                                        refresh: true
                                                    });
                                                });
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'displayfield',
                                        labelWidth: 50,
                                        fieldLabel: i18n.getKey('状态'),
                                        value: function () {
                                            var executeExpect = record.get('executeExpect');
                                            if (executeExpect == 'Uncertain') {
                                                return '<font color="red">' + '待确定' + '</font> <a title="校验物料" href="#")>' + '校验物料' + '</a>';
                                            } else if (executeExpect == 'Conformity') {
                                                return '<font color="green">' + '符合期望' + '</font>';
                                            } else {
                                                return '<font color="gray">' + '不符合期望' + '</font>';
                                            }
                                        }(),
                                        listeners: {
                                            render: function (display) {
                                                var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                                if (a) {
                                                    var ela = Ext.fly(a); //获取到a元素的element封装对象
                                                    ela.on("click", function () {
                                                        var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
                                                        var productId = JSGetQueryString('productId');
                                                        var productConfigDesignId = JSGetQueryString('productConfigDesignId');
                                                       ;
                                                        var isReadOnly = (executeExpect != '待确定');
                                                        builderConfigTab.validMaterial(productConfigDesignId, productId, material._id, record.get('_id'), isReadOnly, configType);
                                                    });
                                                }
                                            }
                                        }
                                    }
                                ]

                            };
                        } else {
                            return {
                                xtype: 'displayfield',
                                value: '<a href="#")>查看错误信息</a>',
                                listeners: {
                                    render: function (display) {
                                        var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                        var ela = Ext.fly(a); //获取到a元素的element封装对象
                                        ela.on("click", function () {
                                            var form = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3test.view.ErrorInfoFrom', {
                                                data: data
                                            });
                                            var title = null;
                                            var attributeMappingConfigError = [
                                                'com.qpp.cgp.domain.record.mapping2test.failure.AttributeMappingError',
                                                'com.qpp.cgp.domain.record.mapping2test.failure.AttributeLackConfigError',
                                            ];
                                            var bomItemMappingConfigError = [
                                                'com.qpp.cgp.domain.record.mapping2test.failure.BomItemLackConfigError',
                                                'com.qpp.cgp.domain.record.mapping2test.failure.BomItemMappingError',
                                            ];
                                            if (Ext.Array.contains(attributeMappingConfigError, data.clazz)) {
                                                title = '属性映射配置错误';
                                            } else if (Ext.Array.contains(bomItemMappingConfigError, data.clazz)) {
                                                title = 'BomItem映射配置错误';
                                            } else {
                                                title = '其他类型错误';
                                            }
                                            var win = Ext.create('Ext.window.Window', {
                                                modal: true,
                                                constrain: true,
                                                title: title,
                                                items: [form]
                                            })
                                            win.show();
                                        });
                                    }
                                }
                            };
                        }
                    }
                }
            ]
        },
        // 查询输入框
        filterCfg: {
            items: [
                {
                    id: 'includeIds',
                    name: 'includeIds',
                    isLike: false,
                    allowReset: true,
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey("id"),
                    value: JSGetQueryString('includeIds') || [],
                    itemId: 'includeIds',
                    reset: function () {
                        var me = this;
                        me.setValue();
                    }
                },
                {
                    name: 'operator.id',
                    xtype: 'gridcombo',
                    itemId: 'operator',
                    fieldLabel: i18n.getKey('测试人员'),
                    multiSelect: false,
                    displayField: 'email',
                    valueField: 'id',
                    labelAlign: 'right',
                    store: customerStore,
                    queryMode: 'remote',
                    editable: false,
                    matchFieldWidth: false,
                    pickerAlign: 'bl',
                    gridCfg: {
                        store: customerStore,
                        height: 300,
                        width: 600,
                        viewConfig: {
                            enableTextSelection: true
                        },
                        columns: [
                            {
                                text: i18n.getKey('id'),
                                dataIndex: 'id',
                                width: 100,
                                xtype: 'gridcolumn',
                                itemId: 'id',
                                sortable: true
                            },
                            {
                                text: i18n.getKey('email'),
                                dataIndex: 'email',
                                xtype: 'gridcolumn',
                                itemId: 'email',
                                sortable: false,
                                minWidth: 170,
                                renderer: function (value, metadata) {
                                    metadata.style = "font-weight:bold";
                                    return value;
                                }
                            },
                            {
                                text: i18n.getKey('firstName'),
                                dataIndex: 'firstName',
                                xtype: 'gridcolumn',
                                itemId: 'firstName',
                                sortable: false,
                                flex: 1,
                                minWidth: 100
                            },
                            {
                                text: i18n.getKey('lastName'),
                                dataIndex: 'lastName',
                                xtype: 'gridcolumn',
                                itemId: 'lastName',
                                sortable: false,
                                flex: 1,
                                minWidth: 100
                            }
                        ],
                        bbar: Ext.create('Ext.PagingToolbar', {
                            store: customerStore,
                            displayInfo: true, // 是否 ? 示， 分 ? 信息
                            displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                            emptyMsg: i18n.getKey('noData')
                        })
                    },
                    filterCfg: {
                        width: '100%',
                        height: 80,
                        layout: {
                            type: 'table',
                            columns: 2
                        },
                        defaults: {
                            width: 180,
                            labelWidth: 50
                        },
                        items: [
                            {
                                id: 'firstNameSearchField',
                                name: 'firstName',
                                xtype: 'textfield',
                                fieldLabel: i18n.getKey('firstName'),
                                itemId: 'firstName'
                            },
                            {
                                id: 'lastNameSearchField',
                                name: 'lastName',
                                xtype: 'textfield',
                                fieldLabel: i18n.getKey('lastName'),
                                itemId: 'lastName'
                            },
                            {
                                id: 'emailSearchField',
                                name: 'emailAddress',
                                xtype: 'textfield',
                                fieldLabel: i18n.getKey('email'),
                                itemId: 'email'
                            }
                        ]
                    }
                },
                {
                    id: 'runResult',
                    name: 'runResult',
                    xtype: 'combo',
                    fieldLabel: i18n.getKey('status'),
                    itemId: 'runResult',
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            'value',
                            'display'
                        ],
                        data: [
                            {
                                value: true,
                                display: '成功'
                            }, {
                                value: false,
                                display: '失败'
                            }
                        ]
                    }),
                    valueField: 'value',
                    editable: false,
                    displayField: 'display'
                },
                {
                    id: 'operationTime',
                    style: 'margin-right:50px; margin-top : 0px;',
                    name: 'operationTime',
                    xtype: 'datefield',
                    itemId: 'operationTime',
                    fieldLabel: i18n.getKey("测试时间"),
                    format: 'Y/m/d',
                    scope: true,
                    width: 218
                },
            ]
        }
    })
});
