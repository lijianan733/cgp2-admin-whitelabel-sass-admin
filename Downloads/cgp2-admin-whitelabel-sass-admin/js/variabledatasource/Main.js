/**
 * Created by nan on 2019/12/12.
 */
Ext.onReady(function () {
    // 用于下面的资源
    // 初始化资源
    // 创建一个GridPage控件
    var productId = JSGetQueryString('productId');
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('variableDataSource'),
        block: 'variabledatasource',
        // 编辑页面
        editPage: 'edit.html',
        tbarCfg: {
            btnCreate: {
                handler: function () {
                    JSOpen({
                        id: 'variableDataSource_edit',
                        url: path + "partials/variabledatasource/edit.html",
                        title: i18n.getKey('create') + '_' + i18n.getKey('variableDataSource'),
                        refresh: true
                    });
                }
            },
        },
        gridCfg: {
            // store是指store.js
            store: Ext.create('CGP.variabledatasource.store.VariableDataSourceStore'),
            frame: false,
            columnDefaults: {
                autoSizeColumn: true,
                width: 200,
                tdCls: 'vertical-middle'
            },
            editActionHandler: function (grid, rowIndex, colIndex, view, event, record, dom) {//编辑按钮的操作
                JSOpen({
                    id: 'variableDataSource_edit',
                    url: path + "partials/variabledatasource/edit.html?_id=" + record.getId(),
                    title: i18n.getKey('edit') + '_' + i18n.getKey('variableDataSource') + '_' + record.getId(),
                    refresh: true
                });
            },
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    width: 100
                },
                {
                    text: i18n.getKey('name'),
                    dataIndex: 'name',
                },
                {
                    text: i18n.getKey('rtType'),
                    dataIndex: 'rtType',
                    width: 100,
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="查看rtType"';
                        if (value) {
                            value = value._id;
                            return {
                                xtype: 'displayfield',
                                value: '<a href="#")>' + value + '</a>',
                                listeners: {
                                    render: function (display) {
                                        var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                        var ela = Ext.fly(a); //获取到a元素的element封装对象
                                        ela.on("click", function () {
                                            JSOpen({
                                                id: 'rttypespage',
                                                url: path + "partials/rttypes/rttype.html?rtType=" + value,
                                                title: 'RtType',
                                                refresh: true
                                            });
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
                    text: i18n.getKey('上传元素数量'),
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record) {
                        var expression = record.get('expression');
                        var quantityRange = record.get('quantityRange');
                        if (!Ext.isEmpty(expression) || !Ext.isEmpty(quantityRange)) {
                            return {
                                xtype: 'displayfield',
                                value: '<a href="#")>查看</a>',
                                listeners: {
                                    render: function (display) {
                                        var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                        var ela = Ext.fly(a); //获取到a元素的element封装对象
                                        ela.on("click", function () {
                                            var win = Ext.create('Ext.window.Window', {
                                                modal: true,
                                                constrain: true,
                                                title: i18n.getKey('quantityRange'),
                                                defaults: {
                                                    width: 450,
                                                    margin: '10 20 5 20'
                                                },
                                                items: [
                                                    {
                                                        xtype: 'displayfield',
                                                        value: expression ? '固定值' : '范围值',
                                                        fieldLabel: i18n.getKey('rangeType')
                                                    },
                                                    {
                                                        xtype: 'textarea',
                                                        readOnly: true,
                                                        grow: true,
                                                        value: expression ? expression : (quantityRange ? quantityRange.mixExpression : ''),
                                                        fieldLabel: i18n.getKey('minValue')
                                                    },
                                                    {
                                                        xtype: 'textarea',
                                                        value: quantityRange ? quantityRange.maxExpression : '',
                                                        readOnly: true,
                                                        grow: true,
                                                        hidden: expression ? true : false,
                                                        fieldLabel: i18n.getKey('maxValue')
                                                    }
                                                ],
                                            })
                                            win.show();
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
                    text: i18n.getKey('selector'),
                    dataIndex: 'selector',
                },
                {
                    text: i18n.getKey('expression'),
                    dataIndex: 'expression',
                    width: 450,
                    renderer: function (value, metadata, record) {
                        return '<div style="white-space:normal;word-wrap:break-word; overflow:hidden;">' + value + '</div>'
                    }
                },
                {
                    text: i18n.getKey('type'),
                    dataIndex: 'clazz',
                    flex: 1,
                    renderer: function (value, metadata, record) {
                        return value.split('.').pop();
                    }
                }]
        },
        // 查询输入框
        filterCfg: {
            height: 100,
            items: [
                {
                    name: '_id',
                    xtype: 'textfield',
                    hideTrigger: true,
                    allowDecimals: false,
                    isLike: false,
                    fieldLabel: i18n.getKey('id'),
                    itemId: '_id'
                },
                {
                    name: 'clazz',
                    fieldLabel: i18n.getKey('type'),
                    itemId: 'clazz',
                    editable: false,
                    valueField: 'value',
                    displayField: 'display',
                    xtype: 'combo',
                    isLike: false,
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            'value',
                            'display'
                        ],
                        data: [
                            {
                                value: 'com.qpp.cgp.domain.bom.datasource.ImageGroupDataSource',
                                display: 'ImageGroupDataSource'
                            },
                            {
                                value: 'com.qpp.cgp.domain.bom.datasource.LocalDataSource',
                                display: 'LocalDataSource'
                            }
                        ]
                    })
                }
            ]
        }
    });
})
