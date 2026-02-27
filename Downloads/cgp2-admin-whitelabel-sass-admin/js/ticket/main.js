Ext.Loader.syncRequire([
    'CGP.common.field.WebsiteCombo'
])
Ext.onReady(function () {


    var status = [
        {name: 'new', color: 'red'},
        {name: 'replied', color: 'green'},
        {name: 'closed', color: 'gray'}
    ];


    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('ticket'),
        block: 'ticket',
        editPage: 'edit.html',
        //权限控制
        accessControl: false,
        gridCfg: {
            deleteAction: false,
            store: Ext.create('CGP.ticket.store.Ticket'),
            frame: false,
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: 'id',
                    width: 50
                }, {
                    text: i18n.getKey('reply'),
                    xtype: 'componentcolumn',
                    itemId: "reply",
                    width: 90,
                    sortable: false,
                    renderer: function (value, metaData, record, rowIndex) {
                        if (record.get("status") === 3) {
                            return null;
                        } else {
                            return new Ext.button.Button({
                                text: i18n.getKey('reply'),
                                itemId: 'reply',
                                iconCls: 'icon_reply',
                                handler: function () {
                                    Ext.create('CGP.ticket.view.Reply', {
                                        ticketId: Number.parseInt(record.get("id")),
                                        receiver: record.get("email")
                                    }).show();
                                }

                            });
                        }
                    }
                },
                {
                    text: i18n.getKey('date'),
                    dataIndex: 'createdDate',
                    width: 154,
                    renderer: function (value, metadata) {
                        value = Ext.Date.format(value, 'Y/m/d H:i');
                        metadata.style = 'color:gray';
                        return '<div style="white-space:normal;">' + value + '</div>'
                    }

                },
                {
                    text: i18n.getKey('status'),
                    dataIndex: 'status',
                    renderer: function (value, metadata) {
                        metadata.style = 'color:' + status[value - 1].color;
                        return i18n.getKey(status[value - 1].name);
                    }
                },
                {
                    text: i18n.getKey('subject'),
                    dataIndex: 'subject',
                    width: 200,
                    renderer: function (value, metadata) {
                        metadata.style = 'color:blue';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('category'),
                    dataIndex: 'category',
                    width: 154
                },
                {
                    text: i18n.getKey('from'),
                    dataIndex: 'name',
                    renderer: function (value, metadata) {
                        metadata.style = 'color:blue';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('email'),
                    dataIndex: 'email',
                    width: 200
                },
                {
                    text: i18n.getKey('website'),
                    dataIndex: 'websiteName'
                },
                {
                    text: i18n.getKey('checkAttachments'),
                    dataIndex: 'attachments',
                    width: 160,
                    xtype: 'arraycolumn',
                    itemId: 'attachments',
                    sortable: false,
                    lineNumber: 1,
                    renderer: function (value, metadata, record) {
                        /*var i;
                        for(i=1;i<=value['name'].length;i++){
                            var urlName = '附件'+i;
                        }*/
                        var urlName = value['name'];
                        var url = value['url'];
                        return '<a target="_blank" href=' + url + '>' + urlName + '</a>';
                    }
                }
            ]
        },
        tbarCfg: {
            hiddenButtons: ['create', 'config', 'delete']
        },
        // 搜索框
        filterCfg: {
            items: [
                {
                    name: 'id',
                    xtype: 'numberfield',
                    hideTrigger: true,
                    fieldLabel: i18n.getKey('id'),
                    itemId: 'id'
                },
                {
                    name: 'createdDate',
                    width: 360,
                    xtype: 'daterange',
                    fieldLabel: i18n.getKey('date'),
                    itemId: 'createdDate'
                },
                {
                    name: 'subject',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('subject'),
                    itemId: 'subject'
                },
                {
                    name: 'category.name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('category'),
                    itemId: 'category'
                }, {
                    id: 'statusSearch',
                    name: 'status',
                    xtype: 'combo',
                    editable: false,
                    store: Ext.create('Ext.data.Store', {
                        fields: ['status', "value"],
                        data: [
                            {
                                status: i18n.getKey('new'), value: 1
                            },
                            {
                                status: i18n.getKey('replied'), value: 2
                            },
                            {
                                status: i18n.getKey('closed'), value: 3
                            }
                        ]
                    }),
                    fieldLabel: i18n.getKey('status'),
                    itemId: 'status',
                    displayField: 'status',
                    valueField: 'value',
                    queryMode: 'local'
                },
                {
                    name: 'email',
                    xtype: 'textfield',
                    width: 360,
                    fieldLabel: i18n.getKey('email'),
                    itemId: 'email'
                },
                {
                    name: 'website.id',
                    itemId: 'website',
                    xtype: 'websitecombo',
                    hidden: true,
                }
            ]
        }

    });
});