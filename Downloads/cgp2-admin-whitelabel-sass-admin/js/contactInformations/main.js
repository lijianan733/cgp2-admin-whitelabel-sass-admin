Ext.Loader.syncRequire([
    'CGP.contactInformations.store.Store',
    'CGP.contactInformations.contorller.Contorller',
])
Ext.onReady(function () {
    var store = Ext.create('CGP.contactInformations.store.Store');
    Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('contactInformations'),
        block: 'contactInformations',
        editPage: 'edit.html',
        tbarCfg: {
            btnCreate: {
                disabled: true
            },
            btnDelete: {
                disabled: true
            }
        },
        gridCfg: {
            store: store,
            deleteAction: false,
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                },
                {
                    text: i18n.getKey('status'),
                    dataIndex: 'status',
                    renderer: function (value) {
                        var map = {
                            0: JSCreateFont('grey', true, '已作废'),
                            1: JSCreateFont('red', true, '待处理'),
                            2: JSCreateFont('green', true, '已处理'),
                        }
                        return map[value];
                    }
                },
                {
                    text: i18n.getKey('partnername'),
                    dataIndex: 'fullName',
                    width: 200
                },
                {
                    text: i18n.getKey('email'),
                    dataIndex: 'email',
                    width: 200
                },
                {
                    xtype: 'atagcolumn',
                    text: i18n.getKey('customer') + i18n.getKey('onlineStore') + i18n.getKey('address'),
                    dataIndex: 'websiteUrl',
                    width: 300,
                    getDisplayName: function (value, metadata, record) {
                        return '<font color=blue style="text-decoration:none">' + "<a>" + value + "</a>" + '</font>'
                    },
                    clickHandler: function (value, metadata, record) {
                        window.open(value,'_blank');
                    }
                },
                {
                    text: i18n.getKey('telephone'),
                    dataIndex: 'phoneNumber',
                    width: 200
                },
                {
                    text: i18n.getKey('discuss') + ' / ' + i18n.getKey('suggest'),
                    dataIndex: 'discuss',
                    flex: 1,
                    renderer: function (value) {
                        return JSAutoWordWrapStr(value);
                    }
                },
                {
                    text: i18n.getKey('remark'),
                    dataIndex: 'remark',
                    flex: 1,
                    renderer: function (value) {
                        return JSAutoWordWrapStr(value);
                    }
                },

            ]
        },
        filterCfg: {
            defaults: {
                xtype: 'textfield',
                isLike: false,
                allowDecimals: false,
            },
            items: [
                {
                    xtype: 'numberfield',
                    name: '_id',
                    itemId: '_id',
                    hideTrigger: true,
                    fieldLabel: i18n.getKey('id'),
                },
                {
                    xtype: 'combo',
                    name: 'status',
                    itemId: 'status',
                    editable: false,
                    haveReset: true,
                    displayField: 'key',
                    valueField: 'value',
                    store: {
                        xtype: 'store',
                        fields: ['key', 'value'],
                        data: [
                            {
                                key: '已作废',
                                value: '0'
                            },
                            {
                                key: '待处理',
                                value: '1'
                            },
                            {
                                key: '已处理',
                                value: '2'
                            }
                        ]
                    },
                    fieldLabel: i18n.getKey('status'),
                },
                {
                    name: 'fullName',
                    itemId: 'fullName',
                    fieldLabel: i18n.getKey('partnername'),
                },
                {
                    name: 'email',
                    itemId: 'email',
                    fieldLabel: i18n.getKey('email'),
                },
                {
                    name: 'websiteUrl',
                    itemId: 'websiteUrl',
                    fieldLabel: i18n.getKey('customer') + i18n.getKey('onlineStore') + i18n.getKey('address'),
                },
                {
                    name: 'phoneNumber',
                    itemId: 'phoneNumber',
                    fieldLabel: i18n.getKey('telephone'),
                },
                {
                    name: 'discuss',
                    itemId: 'discuss',
                    fieldLabel: i18n.getKey('discuss') + '/' + i18n.getKey('suggest'),
                },
            ]
        }
    });
});
