/**
 * Created by nan on 2019/6/27.
 */
Ext.onReady(function () {
    var store = Ext.create('CGP.operationlog.store.OperationLogStore');
    Ext.apply(Ext.form.field.VTypes, {
        IP: function (val, field) {
            var regex = /^((\d)|([1-9]\d)|(1\d{2})|((2[0-4]\d)|(25[0-5])))(\.((\d)|([1-9]\d)|(1\d{2})|((2[0-4]\d)|(25[0-5])))){3}$/
            return regex.test(val);
        },
        ipText: '请输入正确的ip地址',
        ipMask: /[\d.]/
    });
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('operationlog'),
        block: 'operationLog',
        editPage: 'edit.html',
        tbarCfg: {
            disabledButtons: ['create', 'delete']
        },
        gridCfg: {
            editAction: false,//是否启用edit的按钮
            deleteAction: false,//是否启用delete的按钮
            store: store,
            frame: false,
            columnDefaults: {
                autoSizeColumn: true,
                width: 150,
                renderer: function (value, metadata, record) {
                    metadata.tdAttr = 'data-qtip="' + value + '"';
                    return value;
                }
            },
            columns: [
                {
                    xtype: 'actioncolumn',
                    width: 50,
                    items: [
                        {
                            iconCls: 'icon_check',  // Use a URL in the icon config
                            tooltip: 'Check',
                            handler: function (grid, rowIndex, colIndex, a, b, record) {
                                var date = Ext.Date.format(new Date(record.get('time')), "Y-m-d");
                                JSOpen({
                                    id: 'operatorLog_check',
                                    url: path + "partials/operationlog/edit.html?id=" + record.getId() + '&date=' + date,
                                    title: i18n.getKey('check') + i18n.getKey('operation') + i18n.getKey('log'),
                                    refresh: true
                                });
                            }
                        }
                    ]
                },
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    itemId: 'id',
                    width: 80,
                    sortable: false
                }, {
                    text: i18n.getKey('user'),
                    dataIndex: 'user',
                    width: 80,
                    xtype: 'componentcolumn',
                    itemId: 'user',
                    sortable: false,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="查看用户信息"';
                        return {
                            xtype: 'displayfield',
                            value: '<a href="#" style="text-decoration: none">' + value + '</a>',
                            listeners: {
                                render: function (display) {
                                    var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                    var ela = Ext.fly(a); //获取到a元素的element封装对象
                                    ela.on("click", function () {
                                        JSOpen({
                                            id: 'customerpage',
                                            url: path + "partials/customer/customer.html?id=" + value,
                                            title: i18n.getKey('customer'),
                                            refresh: true
                                        })
                                    });
                                }
                            }
                        };
                    }
                }, {
                    text: i18n.getKey('IP'),
                    dataIndex: 'ip',
                    itemId: 'IP',
                    sortable: false
                }, {
                    text: i18n.getKey('time'),
                    dataIndex: 'time',
                    itemId: 'time',
                    sortable: true,
                    renderer: function (value, metadata, record) {
                        metadata.style = "color: gray";
                        value = Ext.Date.format(value, 'Y/m/d H:i');
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return '<div style="white-space:normal;">' + value + '</div>';
                    }
                }, {
                    text: i18n.getKey('duration') + i18n.getKey("(ms)"),
                    dataIndex: 'duration',
                    itemId: 'duration',
                    width: 120,
                    sortable: false
                }, {
                    text: i18n.getKey('level'),
                    dataIndex: 'level',
                    itemId: 'level',
                    sortable: false
                }, {
                    text: i18n.getKey('message'),
                    dataIndex: 'message',
                    itemId: 'message',
                    sortable: false
                }, {
                    text: i18n.getKey('module'),
                    dataIndex: 'module',
                    itemId: 'module',
                    sortable: false
                }, {
                    text: i18n.getKey('operator'),
                    dataIndex: 'operator',
                    itemId: 'operator',
                    sortable: false
                }, {
                    text: i18n.getKey('tags'),
                    dataIndex: 'tags',
                    itemId: 'tags',
                    xtype: 'uxarraycolumn',
                    lineNumber: 1,
                    flex: 1,
                    minWidth: 150,
                    maxLineCount: 2,
                    sortable: false,
                    showContext: function (id, title) {
                        var store = window.store;
                        var record = store.findRecord('_id', id);
                        var win = Ext.create('Ext.window.Window', {
                            modal: true,
                            constrain: true,
                            width: 400,
                            layout: {
                                type: 'fit'
                            },
                            height: 350,
                            title: i18n.getKey('check') + i18n.getKey('tags'),
                            items: [
                                Ext.create('Ext.grid.property.Grid', {
                                        header: false,
                                        width: 300,
                                        autoScroll: true,
                                        renderTo: Ext.getBody(),
                                        source: record.raw.tags
                                    }
                                )
                            ]
                        });
                        win.show();
                    }
                }]
        },
        // 搜索框
        filterCfg: {
            defaults: {
                width: 350
            },
            items: [{
                name: '_id',
                xtype: 'textfield',
                isLike: false,
                fieldLabel: i18n.getKey('id'),
                itemId: 'id'
            }, {
                name: 'user',
                xtype: 'textfield',
                isLike: false,
                fieldLabel: i18n.getKey('user'),
                itemId: 'user'
            }, {
                name: 'ip',
                xtype: 'textfield',
                isLike: false,
                vtype: 'IP',
                fieldLabel: i18n.getKey('IP'),
                itemId: 'IP'
            }, {
                id: 'time',
                style: 'margin-right:50px; margin-top : 0px;',
                name: 'time',
                xtype: 'datefield',
                scope: true,
                fieldLabel: i18n.getKey('time'),
                width: 360,
                format: 'Y/m/d'
            }, {
                name: 'duration',
                xtype: 'numberrange',
                minValue: 1,
                fieldLabel: i18n.getKey('duration'),
                itemId: 'duration'
            },
                {
                    name: 'level',
                    xtype: 'combo',
                    fieldLabel: i18n.getKey('level'),
                    itemId: 'level',
                    displayField: 'display',
                    valueField: 'value',
                    editable: false,
                    haveReset: true,
                    store: Ext.create('Ext.data.Store', {
                        fields: ['display', 'value'],
                        data: [
                            {
                                display: i18n.getKey('WARN'),
                                value: 'WARN'
                            },
                            {
                                display: i18n.getKey('IMPORTANT'),
                                value: 'IMPORTANT'
                            },
                            {
                                display: i18n.getKey('TRIVIAL'),
                                value: 'TRIVIAL'
                            }
                        ]
                    })
                }, {
                    name: 'operator',
                    xtype: 'combo',
                    fieldLabel: i18n.getKey('operator'),
                    itemId: 'operator',
                    displayField: 'display',
                    valueField: 'value',
                    haveReset: true,
                    editable: false,
                    store: Ext.create('Ext.data.Store', {
                        fields: ['display', 'value'],
                        data: [
                            {
                                display: i18n.getKey('CREATE'),
                                value: 'CREATE'
                            },
                            {
                                display: i18n.getKey('UPDATE'),
                                value: 'UPDATE'
                            },
                            {
                                display: i18n.getKey('DELETE'),
                                value: 'DELETE'
                            }
                        ]
                    })
                }, {
                    xtype: 'combo',
                    name: 'module',
                    valueField: 'value',
                    displayField: 'display',
                    haveReset: true,
                    fieldLabel: i18n.getKey('module'),
                    itemId: 'module',
                    store: {
                        xtype: 'store',
                        fields: ['value', 'display'],
                        data: [{
                            value: 'attributes',
                            display: 'attributes'
                        }]
                    }
                }, {
                    name: 'tags',
                    xtype: 'fieldcontainer',
                    itemId: 'tags',
                    id: 'tags',
                    fieldLabel: i18n.getKey('tags'),
                    defaults: {
                        style: 'margin:0'
                    },
                    layout: {
                        type: 'table',
                        columns: 2,
                        tdAttrs: {
                            style: 'margin:0'
                        }
                    },
                    items: [
                        {
                            xtype: 'combo',
                            fieldLabel: false,
                            width: 130,
                            isExtraParam: true,
                            itemId: 'extraParamName',
                            valueField: 'value',
                            displayField: 'display',
                            store: {
                                xtype: 'store',
                                fields: ['value', 'display'],
                                data: [{
                                    value: 'id',
                                    display: 'id'
                                }]
                            }
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: false,
                            width: 130,
                            name: 'tags',
                            //margin:'10 0 0 0',
                            isExtraParam: true,
                            itemId: 'extraParamValue'
                        }
                    ]
                }
            ]
        }
    });

});
