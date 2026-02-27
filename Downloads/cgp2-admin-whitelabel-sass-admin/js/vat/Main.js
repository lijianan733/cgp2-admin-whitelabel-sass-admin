Ext.Loader.syncRequire([
    'CGP.vat.view.CountryGridCombo',
    'CGP.partner.store.PartnerStore'
])
Ext.onReady(function () {
    var status = JSGetQueryString('status');
    var partnerStore = Ext.create('CGP.partner.store.PartnerStore');
    var filterItems = [
        {
            name: '_id',
            xtype: 'numberfield',
            hideTrigger: true,
            fieldLabel: i18n.getKey('id'),
            itemId: '_id'
        },
        {
            xtype: 'gridcombo',
            fieldLabel: i18n.getKey('partner'),
            valueField: 'id',
            displayField: 'name',
            store: partnerStore,
            editable: false,
            itemId: 'partnerId',
            name: 'partner.id',
            matchFieldWidth: false,
            filterCfg: {
                height: 100,
                layout: {
                    type: 'column',
                    columns: 2
                },
                defaults: {},
                items: [
                    {
                        name: '_id',
                        xtype: 'numberfield',
                        hideTrigger: true,
                        fieldLabel: i18n.getKey('id'),
                        itemId: 'id'
                    },
                    {
                        name: 'partnerStatus',
                        xtype: 'hiddenfield',
                        fieldLabel: i18n.getKey('partnerStatus'),
                        itemId: 'partnerStatus',
                        value: 'APPROVED'
                    },
                    {
                        name: 'code',
                        xtype: 'textfield',
                        itemId: 'code',
                        fieldLabel: i18n.getKey('code')
                    },
                    {
                        name: 'name',
                        xtype: 'textfield',
                        itemId: 'name',
                        fieldLabel: i18n.getKey('name')
                    },
                    {
                        name: 'email',
                        xtype: 'textfield',
                        itemId: 'email',
                        fieldLabel: i18n.getKey('email')
                    },
                ]
            },
            valueType: 'id',
            gridCfg: {
                store: partnerStore,
                height: 450,
                width: 750,
                columns: [
                    {
                        xtype: 'rownumberer'
                    },
                    {
                        text: i18n.getKey('id'),
                        dataIndex: 'id',
                        width: 80
                    },
                    {
                        text: i18n.getKey('code'),
                        dataIndex: 'code',
                        sortable: false
                    },
                    {
                        text: i18n.getKey('name'),
                        dataIndex: 'name',
                        sortable: false
                    },
                    {
                        text: i18n.getKey('partner') + i18n.getKey('type'),
                        sortable: false,
                        dataIndex: 'partnerType',
                        renderer: function (value) {
                            var map = {
                                'INTERNAL': i18n.getKey('inner'),
                                'EXTERNAL': i18n.getKey('outside')
                            }
                            return map[value];
                        }
                    },
                    {
                        text: i18n.getKey('email'),
                        dataIndex: 'email',
                        flex: 1,
                        minWidth: 150,
                        sortable: false,
                        renderer: function (value, metadata, record) {
                            metadata.tdAttr = 'data-qtip="' + value + '"';
                            return value;
                        }
                    },
                ],
                bbar: {
                    xtype: 'pagingtoolbar',
                    store: partnerStore,
                }
            }
        },
        (status == 'Pending' ? {
            name: 'status',
            xtype: 'hiddenfield',
            fieldLabel: i18n.getKey('status'),
            itemId: 'status',
            isLike: false,
            value: status,
        } : {
            name: 'status',
            xtype: 'multicombobox',
            fieldLabel: i18n.getKey('status'),
            itemId: 'status2',
            valueField: 'value',
            displayField: 'display',
            editable: false,
            haveReset: true,
            store: {
                xtype: 'store',
                fields: [
                    'value', 'display'
                ],
                data: [
                    {
                        value: 'Valid',
                        display: '生效'
                    },
                    {
                        value: 'Invalid',
                        display: '无效'
                    }
                ]
            },
            listeners: {
                afterrender: function () {
                    var me = this;
                    me.setValue([])
                }
            },
            diyGetValue: function () {
                var me = this;
                var data = me.getValue();
                if (data.length > 0) {
                    return data;
                } else {
                    return ['Valid', 'Invalid'];
                }
            }
        }),
        {
            xtype: 'country_gridcombo',
            name: 'countryCode',
            itemId: 'countryCode',
            fieldLabel: i18n.getKey('国家/地区'),
            valueType: 'id',
        },
    ];
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('税资质'),
        block: 'vat',
        editPage: 'edit.html',
        //权限控制
        accessControl: false,
        tbarCfg: {
            disabledButtons: ['create', 'config', 'delete']
        },
        gridCfg: {
            deleteAction: false,
            editAction: false,
            store: Ext.create('CGP.vat.store.VatStore'),
            frame: false,
            columnDefaults: {
                width: 200,
            },
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    width: 100,
                },
                {
                    text: i18n.getKey('status'),
                    dataIndex: 'status',
                    width: 100,
                    renderer: function (value, metaData, record) {
                        var result = '';
                        if (value == 'Pending') {//未审核
                            result = JSCreateFont('orange', true, '未审核');

                        } else if (value == 'Valid') {//已通过
                            result = JSCreateFont('green', true, '生效');

                        } else if (value == 'Invalid') {//未通过
                            result = JSCreateFont('red', true, '无效');
                        }
                        return result;
                    }
                },
                {
                    text: i18n.getKey('operation'),
                    dataIndex: 'operation',
                    xtype: 'componentcolumn',
                    hidden: status != 'Pending',
                    width: 200,
                    renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                        var recordId = record.getId();
                        var grid = view.ownerCt;
                        return {
                            xtype: 'container',
                            layout: 'hbox',
                            width: '100%',
                            defaults: {
                                flex: 1,
                                ui: 'default-toolbar-small',
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    text: '通过',
                                    margin: '0 15 0 5',
                                    border: false,
                                    cls: 'a-btn',
                                    width: 50,
                                    handler: function (btn) {
                                        var controller = Ext.create('CGP.vat.controller.Controller');
                                        controller.showModifyWin('Valid', grid, record, 'PartnerVAT', '审核通过');
                                    }
                                },
                                {
                                    xtype: 'button',
                                    text: '不通过',
                                    margin: '0 5 0 0',
                                    border: false,
                                    cls: 'a-btn',
                                    handler: function (btn) {
                                        var controller = Ext.create('CGP.vat.controller.Controller');
                                        controller.showModifyWin('Invalid', grid, record, 'PartnerVAT', '审核不通过');
                                    }
                                }
                            ]
                        }
                    }
                },
                {
                    xtype: 'atagcolumn',
                    text: i18n.getKey('partner'),
                    dataIndex: 'partner',
                    width: 250,
                    getDisplayName: function (value, metaData, record) {
                        return value.name + ' <a href="#">(' + value.partnerId + ')</a>';
                    },
                    clickHandler: function (value, metaData, record) {
                        JSOpen({
                            id: 'partnerpage',
                            url: path + 'partials/partner/main.html?id=' + value.partnerId,
                            title: i18n.getKey('partner'),
                            refresh: true
                        });
                    },
                },
                {
                    xtype: 'atagcolumn',
                    text: i18n.getKey('VAT ID'),
                    dataIndex: 'vatId',
                    getDisplayName: function (value, metaData, record) {
                        return value /*+ ' <a href="#">查看</a>';*/
                    },
                    clickHandler: function (value, metaData, record) {
                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('开发中...'));
                    },
                },
                {
                    text: i18n.getKey('国家/地区'),
                    dataIndex: 'countryName',
                    renderer: function (value, mateData, record) {
                        return value + ' : ' + record.get('countryCode');
                    }
                },
                {
                    text: i18n.getKey('remark'),
                    dataIndex: 'remark',
                    flex: 1,
                }
            ]
        },
        filterCfg: {
            items: filterItems
        }
    });
});