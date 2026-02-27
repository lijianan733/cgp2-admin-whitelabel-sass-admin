Ext.Loader.syncRequire([
    'CGP.common.field.WebsiteCombo'
])
Ext.onReady(function () {
    // 用于下面的资源


    var status = [
        {name: 'waitaudit', color: 'blue'},
        {name: 'agreed', color: 'green'},
        {name: 'rejected', color: 'red'},
    ];
    var websiteStore = Ext.create("CGP.partnerapplys.store.WebsiteAll");
    var store = Ext.create("CGP.partnerapplys.store.partnerApplys");
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('partnerApplys'),        //标题名
        block: 'partnerapplys',                   // 权限模块
        gridCfg: {
            //store.js
            deleteAction: false,
            editAction: false,
            store: store,
            frame: false,                          //True 为 Panel 填充画面,默认为false.
            columnDefaults: {
                autoSizeColumn: true
            },
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: 'id',
                    width: 50,
                }, {
                    text: i18n.getKey('audit'),
                    dataIndex: 'audit',
                    width: 160,
                    columns: [{
                        //同意按钮
                        id: 'agree',
                        dataIndex: 'agree',
                        xtype: 'componentcolumn',
                        text: i18n.getKey('agree'),
                        width: 80,
                        menuDisabled: true,
                        sortable: false,
                        renderer: function (value, metaData, record, rowIndex) {
                            if (record.get("status") == '1') {
                                return new Ext.button.Button({
                                    text: i18n.getKey('agree'),
                                    xtype: 'button',
                                    itemId: 'audit',
                                    width: 10,
                                    handler: function () {
                                        Ext.create('CGP.partnerapplys.view.AuditConfirm', {
                                            partnerId: Number.parseInt(record.get("id")),
                                            partneremail: record.get("email"),
                                            partnerStore: store,
                                            partnername: record.get("name"),
                                            partnerstatus: record.get("status"),
                                        }).show();
                                    }
                                });
                            } else {
                                return null;
                            }
                        }
                    }, {
                        //拒绝按钮
                        text: i18n.getKey('REJECTED'),
                        dataIndex: 'REJECTED',
                        xtype: 'componentcolumn',
                        width: 80,
                        sortable: false,
                        menuDisabled: true,
                        renderer: function (value, metaData, record, rowIndex) {
                            if (record.get("status") == '1') {
                                return new Ext.button.Button({
                                    text: i18n.getKey('REJECTED'),
                                    xtype: 'button',
                                    itemId: 'audit',
                                    width: 10,
                                    handler: function () {
                                        Ext.create('CGP.partnerapplys.view.AuditRefuse', {
                                            partnerId: Number.parseInt(record.get("id")),
                                            partneremail: record.get("email"),
                                            partnerStore: store,
                                            partnername: record.get("name"),
                                            partnerstatus: record.get("status"),
                                        }).show();
                                    }
                                });
                            } else {
                                return null;
                            }
                        }
                    }]
                }, {
                    text: i18n.getKey('status'),           //状态
                    dataIndex: 'status',
                    sortable: false,
                    renderer: function (value, metadata) {
                        metadata.style = 'color:' + status[value - 1].color;
                        return i18n.getKey(status[value - 1].name);
                    }
                }, {
                    text: i18n.getKey('reason'),          //理由
                    dataIndex: 'remark',
                    width: 150,
                    sortable: false,
                    renderer: function (value, metadata) {
                        metadata.style = 'color:gray';
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return '<div style="white-space:normal;">' + value + '</div>'
                    }
                }, {
                    text: i18n.getKey('name'),           //名称
                    dataIndex: 'name',
                    sortable: false
                }, {
                    text: i18n.getKey('email'),          //  "邮箱"
                    dataIndex: 'email',
                    width: 200,
                    sortable: false
                }, {
                    text: i18n.getKey('contactor'),      //"联系人"
                    dataIndex: 'contactor',
                    sortable: false,
                    width: 100
                }, {
                    text: i18n.getKey('telephone'),     // "联系号码"
                    dataIndex: 'telephone',
                    sortable: false,
                    width: 150
                }, {
                    text: i18n.getKey('website'),       //"网站名称"
                    sortable: false,
                    dataIndex: 'websiteName'
                }, {
                    text: i18n.getKey('modifiedBy'),    //"修改人"
                    dataIndex: 'modifiedBy',
                    sortable: false,
                    width: 150
                }, {
                    text: i18n.getKey('modifiedDate'),    //"修改日期"
                    dataIndex: 'modifiedDate',
                    sortable: false,
                    width: 100,
                    align: 'center',
                    renderer: function (value, metadata) {
                        var value = value.slice(0, 19);
                        metadata.style = 'color:gray';
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return '<div style="white-space:normal;">' + value + '</div>'
                    }
                }]
        },
        tbarCfg: {
            hiddenButtons: ['create', 'config', 'delete', 'export', 'import', 'help'],
        },
        //过滤查询配置项
        filterCfg: {
            items: [{
                //id: 'idSearchField',      //通过id查询
                name: 'id',
                xtype: 'numberfield',
                hideTrigger: true,
                autoStripChars: true,
                allowExponential: false,
                allowDecimals: false,
                fieldLabel: i18n.getKey('id'),
                itemId: 'id'
            }, {
                id: 'nameSearchField',
                name: 'name',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('name'),
                itemId: 'name'
            }, {
                id: 'statusSearchField',      //状态查询
                name: 'status',
                xtype: "combo",
                fieldLabel: i18n.getKey('status'),
                itemId: 'status',
                displayField: 'name',
                valueField: 'value',
                store: Ext.create('Ext.data.Store', {
                    fields: [{name: "value", type: 'int'},
                        {name: 'name', type: 'string'}],
                    data: [{
                        value: 1, name: i18n.getKey('waitaudit')
                    },
                        {
                            value: 2, name: i18n.getKey('agreed')
                        },
                        {
                            value: 3, name: i18n.getKey('rejected')
                        }]
                }),
                triggerAction: 'all'
            }, {
                id: 'emailSearchField',        //通过代码查询
                name: 'email',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('email'),
                itemId: 'email'
            }, {
                id: 'contactorSearchField',    //通过name查询
                name: 'contactor',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('contactor'),
                itemId: 'contactor'
            }, {
                id: 'telephoneSearchField',     //通过代码查询
                name: 'telephone',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('telephone'),
                itemId: 'telephone'
            }, {
                name: 'websiteId',
                xtype: 'websitecombo',
                hidden: true,
                itemId: 'websiteCombo',
                value: 11,

            }]
        }
    });

});