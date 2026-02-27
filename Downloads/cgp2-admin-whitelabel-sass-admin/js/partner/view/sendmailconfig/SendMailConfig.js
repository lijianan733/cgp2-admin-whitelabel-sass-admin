/**
 * Created by nan on 2018/6/11.
 */
Ext.onReady(function () {
    var partnerId = JSGetQueryString('partnerId');
    var websiteId = JSGetQueryString('websiteId');
    var store = Ext.create('CGP.partner.view.sendmailconfig.store.SendMailConfigStore', {
        partnerId: partnerId
    })
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('sendMailCfg'),
        block: 'partner/sendmailconfig',
        editPage: 'edit.html',
        tbarCfg: {
            btnCreate: {
                handler: function (view) {
                    JSOpen({
                        id: 'edit_endmailconfig',
                        url: path + 'partials/partner/sendmailconfig/edit.html?partnerId=' + partnerId + '&websiteId=' + websiteId + '&createOrEdit=create',
                        title: i18n.getKey('create') + '_' + i18n.getKey('sendMailCfg'),
                        refresh: true
                    })
                }
            }
        },
        //权限控制
        gridCfg: {
            store: store,
            frame: false,
            columnDefaults: {
                autoSizeColumn: true,
                width: 150
            },
            editAction: false,//是否启用edit的按钮
            deleteAction: false,//是否启用delete的按钮
            columns: [
                {
                    xtype: 'actioncolumn',
                    width: 50,
                    items: [
                        {
                            iconCls: 'icon_edit icon_margin',  // Use a URL in the icon config
                            tooltip: 'Edit',
                            handler: function (grid, rowIndex, colIndex, a, b, record) {
                                var type = record.get('targetType');
                                var recordId = record.get('_id');
                                JSOpen({
                                    id: 'edit_endmailconfig',
                                    url: path + 'partials/partner/sendmailconfig/edit.html?partnerId=' + partnerId + '&websiteId=' + websiteId + '&type=' + type + '&recordId=' + recordId + '&createOrEdit=edit',
                                    title: i18n.getKey('edit') + '_' + i18n.getKey('sendMailCfg'),
                                    refresh: true
                                })
                            }
                        },
                        {
                            iconCls: 'icon_remove icon_margin',
                            tooltip: 'Delete',
                            handler: function (view, rowIndex, colIndex, a, b, record) {
                                var store = view.getStore();
                                var constraintId = record.getId();
                                Ext.Msg.confirm('提示', '确定删除？', callback);
                                function callback(id) {
                                    if (id === 'yes') {
                                        store.remove(record);
                                    }
                                }
                            }
                        }
                    ]
                },
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    itemId: '_id'
                },
                {
                    text: i18n.getKey('type'),
                    dataIndex: 'targetType',
                    itemId: 'targetType',
                    renderer: function (value, meta, record) {
                        if (value == 'customer') {
                            return i18n.getKey('customer');
                        } else {
                            return i18n.getKey('admin');
                        }
                    }
                },
                {
                    text: i18n.getKey('host'),
                    dataIndex: 'host',
                    itemId: 'host'
                },
                {
                    text: i18n.getKey('address'),
                    dataIndex: 'address',
                    itemId: 'address',
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('username'),
                    dataIndex: 'username',
                    itemId: 'username'
                },
                {
                    text: i18n.getKey('password'),
                    dataIndex: 'password',
                    itemId: 'password'
                },
                {
                    text: i18n.getKey('port'),
                    dataIndex: 'port',
                    itemId: 'port'
                },
                {
                    text: i18n.getKey('timeout'),
                    dataIndex: 'timeout',
                    itemId: 'timeout'
                },
                {
                    text: i18n.getKey('protocol'),
                    dataIndex: 'protocol',
                    itemId: 'protocol'
                }

            ]
        },
        // 搜索框
        filterCfg: {
            hidden: true
        }
    });
});
