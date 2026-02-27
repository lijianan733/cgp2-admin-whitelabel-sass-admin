Ext.define('CGP.customer.view.addressbook.AddressBooksGrid', {
    extend: 'Ext.grid.Panel',
    store: '',
    columns: {
        defaults: {
            tdCls: 'vertical-middle'
        },
        items: []
    },
    autoScroll: true,
    viewConfig: {
        enableTextSelection: true
    },
    userId: '',
    defaultAddress: 0,
    constructor: function (config) {
        var me = this;
        var useRecord = '';
        var record = '';
        me.defaultAddress = config.record.get('defaultAddressBookId');
        var userId = config.recordId;
        me.store = Ext.create("CGP.customer.store.AddressBookStore", {
            userId: userId,
            autoLoad: true
        });
        me.tbar = Ext.create("Ext.toolbar.Toolbar", {
            items: [
                {
                    text: i18n.getKey('create'),
                    width: 75,
                    iconCls: 'icon_create',
                    height: 24,
                    handler: function (button) {
                        me.controller.openEditWindow("creating", null, me.record, me.store);

                    }
                }
            ]
        });
        me.columns.items = [
            {
                xtype: 'actioncolumn',
                itemId: 'actioncolumn',
                sortable: false,
                resizable: false,
                width: 70,
                menuDisabled: true,
                items: [
                    {
                        iconCls: 'icon_edit icon_margin',
                        tooltip: i18n.getKey('update'),
                        handler: function (view, rowIndex, colIndex, a, b, record) {
                            me.controller.openEditWindow("editing", record, me.record, me.store);
                        }
                    },
                    {
                        iconCls: 'icon_remove icon_margin',
                        itemId: 'actiondelete',
                        tooltip: i18n.getKey('remove'),
                        handler: function (view, rowIndex, colIndex, a, b, record) {
                            me.controller.deleteAddress(record, me.store, me.record);
                        }
                    }
                ]
            },
            {
                text: i18n.getKey('operation'),
                sortable: false,
                itemId: 'operation',
                width: 150,
                minWidth: 105,
                tdCls: 'vertical-middle',
                xtype: 'componentcolumn',
                renderer: function (value, metadata, record) {
                    var id = record.getId();
                    if (record.get('id') == me.defaultAddress) {
                        return "<font color='red' style='font-weight: bold' >" + i18n.getKey('defaultAddress') + "</font>"
                    } else {
                        return {
                            xtype: 'button',
                            text: i18n.getKey('setDefaultAddress'),
                            ui: 'default-toolbar-small',
                            handler: function (button) {
                                me.defaultAddress = id;
                                me.controller.setDefaultAddress(id, config.record);
                            }
                        };
                    }

                }
            },
            {

                dataIndex: 'id',
                itemId: 'id',
                header: i18n.getKey('id')
            },
            {

                itemId: 'firstName',
                header: i18n.getKey('lastName') + i18n.getKey('firstName'),
                renderer: function (value, metar, record) {
                    return record.get("lastName") + record.get("firstName");
                }
            },
            {
                dataIndex: 'address',
                itemId: 'address',
                width: 350,
                header: i18n.getKey('address'),
                renderer: function (value, metar, record) {
                    var record = record;
                    var gender;
                    var addressStr = '';
                    if (record.get('gender') != null) {
                        var str = record.get("gender");
                        if (str == 'M') {
                            gender = i18n.getKey('male');
                        } else if (str == 'F') {
                            gender = i18n.getKey('female');
                        }
                    }
                    var name = record.get('firstName') + record.get('lastName') + " ";
                    if (!Ext.isEmpty(gender)) {
                        name = name + gender + " ";
                    }
                    var emailAddress,
                        countryName;
                    if (!Ext.isEmpty(record.get("emailAddress"))) {
                        name = name + record.get("emailAddress") + "  ";
                    }
                    if (!Ext.isEmpty(record.get("countryName"))) {
                        name = name + record.get("countryName") + "  ";
                    }
                    addressStr = name + record.get('state') + " " + record.get("city") + " " + record.get("suburb");

                    if (!Ext.isEmpty(record.get("streetAddress1"))) {
                        addressStr = addressStr + "<br>" + record.get("streetAddress1");
                    }
                    if (!Ext.isEmpty(record.get("streetAddress2"))) {
                        addressStr = addressStr + "<br>" + record.get("streetAddress2");
                    }
                    metar.tdAttr = 'data-qtip="' + addressStr + '"';
                    return addressStr;
                }
            },
            {
                dataIndex: 'telephone',
                itemId: 'telephone',
                width: 150,
                header: i18n.getKey('telephone')
            },
            {
                dataIndex: 'emailAddress',
                itemId: 'emailAddress',
                width: 150,
                header: i18n.getKey('emailAddress')
            },
            {
                dataIndex: 'company',
                itemId: 'company',
                width: 200,
                header: i18n.getKey('company')

            },
            {
                dataIndex: 'locationType',
                itemId: 'locationType',
                header: i18n.getKey('locationType')
            }

        ],
            me.dockedItems = [
                {
                    xtype: 'pagingtoolbar',
                    store: me.store,
                    dock: 'bottom',
                    displayInfo: true
                }
            ],
            me.callParent(arguments);
    },
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
    }
});
