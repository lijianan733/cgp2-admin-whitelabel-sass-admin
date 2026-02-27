/**
 * Created by nan on 2019/6/27.
 */
Ext.onReady(function () {
    var store = Ext.create('CGP.feign_log.store.FeignLogStore');
    Ext.apply(Ext.form.field.VTypes, {
        IP: function (val, field) {
            var regex = /^((\d)|([1-9]\d)|(1\d{2})|((2[0-4]\d)|(25[0-5])))(\.((\d)|([1-9]\d)|(1\d{2})|((2[0-4]\d)|(25[0-5])))){3}$/
            return regex.test(val);
        },
        ipText: '请输入正确的ip地址',
        ipMask: /[\d.]/
    });
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('feign_log'),
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
                                    url: path + "partials/feign_log/edit.html?id=" + record.getId() + '&date=' + date,
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
                    width: 100,
                }, {
                    text: i18n.getKey('env'),
                    dataIndex: 'env',
                    itemId: 'env',
                }, {
                    text: i18n.getKey('requestMethod'),
                    dataIndex: 'requestMethod',
                }, {
                    text: i18n.getKey('responseStatusCode'),
                    dataIndex: 'responseStatusCode',
                    width: 160,
                },
                {
                    text: i18n.getKey('createdDate'),
                    dataIndex: 'createdDate',
                    renderer: function (value, metadata, record) {
                        var date = new Date(Number(value));
                        metadata.style = "color: gray";
                        date = Ext.Date.format(date, 'Y/m/d H:i');
                        metadata.tdAttr = 'data-qtip="' + date + '"';
                        return '<div style="white-space:normal;">' + date + '</div>';
                    }
                }, {
                    xtype: 'auto_bread_word_column',
                    text: i18n.getKey('requestUrl'),
                    dataIndex: 'requestUrl',
                    flex: 2,
                },]
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
                style: 'margin-right:50px; margin-top : 0px;',
                name: 'createdDate',
                xtype: 'datefield',
                scope: true,
                fieldLabel: i18n.getKey('createdDate'),
                width: 360,
                format: 'Y/m/d'
            }, {
                xtype: 'combo',
                fieldLabel: 'requireMethod',
                itemId: 'requireMethod',
                name: 'requireMethod',
                editable: false,
                valueField: 'value',
                displayField: 'display',
                store: {
                    xtype: 'store',
                    fields: ['value', 'display'],
                    data: [{
                        value: 'GET',
                        display: 'GET'
                    }, {
                        value: 'PUT',
                        display: 'PUT'
                    }, {
                        value: 'POST',
                        display: 'POST'
                    }, {
                        value: 'DELETE',
                        display: 'DELETE'
                    }]
                }
            }, {
                xtype: 'combo',
                fieldLabel: '目标环境',
                itemId: 'env',
                name: 'env',
                editable: false,
                valueField: 'value',
                displayField: 'display',
                store: {
                    xtype: 'store',
                    fields: ['value', 'display'],
                    data: [{
                        value: 'Stage',
                        display: 'Stage'
                    }, {
                        value: 'Production',
                        display: 'Production'
                    }]
                }
            }, {
                xtype: 'combo',
                fieldLabel: 'response StatusCode',
                itemId: 'responseStatusCode',
                name: 'responseStatusCode',
                editable: true,
                valueField: 'value',
                displayField: 'display',
                tipInfo: '其他自行输入',
                store: {
                    xtype: 'store',
                    fields: ['value', 'display'],
                    data: [{
                        value: '200',
                        display: '200'
                    }, {
                        value: '404',
                        display: '404'
                    }, {
                        value: '500',
                        display: '500'
                    }]
                }
            }, {
                xtype: 'textfield',
                fieldLabel: 'requireUrl',
                itemId: 'requireUrl',
                name: 'requireUrl',
            },]
        }
    });

});
