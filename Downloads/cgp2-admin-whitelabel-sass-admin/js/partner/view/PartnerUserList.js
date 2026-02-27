Ext.define("CGP.partner.view.PartnerUserList", {
    extend: 'CGP.common.commoncomp.QueryGrid',
    minWidth: 300,
    height: 400,
    constructor: function (config) {
        var me = this;
        me.callParent(arguments);

    },
    initComponent: function () {
        var me = this;
        var websiteStore = Ext.create('CGP.partner.store.WebsiteStore');
        var store = Ext.create('Ext.data.Store', {
            fields: [
                {
                    name: 'id',
                    type: 'int',
                    useNull: true
                },
                {
                    name: 'firstName',
                    type: 'string'
                },
                {
                    name: 'lastName',
                    type: 'string'
                },
                {
                    name: 'email',
                    type: 'string'
                },
                {
                    name: 'website',
                    type: 'object'
                },
                {
                    name: 'userName',
                    type: 'string'
                }
            ],
            proxy: {
                type: 'uxrest',
                url: adminPath + 'api/partners/' + me.partnerId + '/users',
                reader: {
                    type: 'json',
                    root: 'data'
                }
            },
            autoLoad: true
        });
        me.gridCfg = {
            store: store,
            deleteAction: !me.readOnly,
            editAction: !me.readOnly,
            selType: 'rowmodel',
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: 'id',
                    width: 120,
                    itemId: 'id'
                },
                {
                    xtype: 'actioncolumn',
                    width: 40,
                    itemId: 'actioncolumn',
                    sortable: false,
                    resizable: false,
                    menuDisabled: true,
                    tdCls: 'vertical-middle',
                    items: [
                        {
                            iconCls: 'icon_remove icon_margin',
                            itemId: 'actiondelete',
                            tooltip: i18n.getKey('delete'),
                            handler: function (view, rowIndex, colIndex, item, e, record) {
                                Ext.MessageBox.confirm('提示', '是否删除该用户?', callBack);

                                function callBack(id) {
                                    //var selected = me.getSelectionModel().getSelection();
                                    if (id === "yes") {
                                        var requestConfig = {
                                            url: adminPath + 'api/partners/' + me.partnerId + '/users/' + record.get('id'),
                                            method: 'DELETE',
                                            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                                            success: function (resp) {
                                                record.store.remove(record);
                                            }
                                        }
                                        Ext.Ajax.request(requestConfig);
                                        //store.sync();
                                    } else {
                                        close();
                                    }
                                }
                            }
                        }
                    ]
                },
                {
                    text: i18n.getKey('firstName'),
                    width: 120,
                    dataIndex: 'firstName',
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('lastName'),
                    width: 120,
                    dataIndex: 'lastName',
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                /*{
                    text: i18n.getKey('email'),
                    dataIndex: 'email',
                    width: 180
                },*/
                {
                    text: i18n.getKey('userAccount'),
                    dataIndex: 'userName',
                    flex: 1
                },
            ]
        };
        me.filterCfg = {
            height: 90,
            hidden: true,
            header: false,
            defaults: {
                width: 280
            },
            items: [
                {
                    name: 'id',
                    xtype: 'numberfield',
                    fieldLabel: i18n.getKey('id'),
                    itemId: 'id',
                    minValue: 1,
                    allowDecimals: false,
                    allowExponential: false,
                    hideTrigger: true
                },
                {
                    name: 'firstName',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('firstName'),
                    itemId: 'firstName'
                },
                {
                    name: 'lastName',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('lastName'),
                    itemId: 'lastName'
                },
                {
                    name: 'email',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('email'),
                    itemId: 'email'
                }
            ]
        };
        me.callParent(arguments);
    }
});