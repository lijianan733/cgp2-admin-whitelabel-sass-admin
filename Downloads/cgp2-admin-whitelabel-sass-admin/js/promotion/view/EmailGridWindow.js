/**
 * @author xiu
 * @date 2023/10/24
 */
Ext.define('CGP.promotion.view.EmailGridWindow', {
    extend: 'CGP.common.commoncomp.QueryGrid',
    alias: 'widget.emailGridWindow',
    tbarCfg: null,
    websiteId: 11,
    storeFilter: null,
    otherStoreFilter: null,
    initComponent: function () {
        var me = this,
            store = Ext.create('CGP.customer.store.CustomerStore'),
            extraParamsData = [
                {
                    "name": "website",
                    "value": me.websiteId,
                    "type": "number"
                }
            ],
            totalArray = Ext.Array.merge(me.storeFilter || [], me.otherStoreFilter || []);

        var newValue = '';
        totalArray.forEach(item => {
            newValue += item + ','
        })

        !Ext.isEmpty(totalArray) && extraParamsData.push(
            {
                "name": "excludeEmails",
                "value": '[' + newValue + ']',
                "type": "string",
            },
        )
        store.proxy.extraParams = {
            filter: Ext.JSON.encode(extraParamsData)
        };

        me.gridCfg = {
            store: store,
            frame: false,
            selType: 'simple',
            deleteAction: false,
            editAction: false,
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: 'id',
                    width: 100,
                    xtype: 'gridcolumn',
                    itemId: 'id',
                    sortable: true
                },
                {
                    text: i18n.getKey('email'),
                    dataIndex: 'email',
                    xtype: 'gridcolumn',
                    itemId: 'email',
                    sortable: false,
                    minWidth: 200,
                    renderer: function (value, metadata) {
                        metadata.style = "font-weight:bold";
                        return value;
                    }
                },
                {
                    text: i18n.getKey('type'),
                    dataIndex: 'type',
                    xtype: 'gridcolumn',
                    itemId: 'type',
                    sortable: false,
                    width: 80,
                    renderer: function (value, metadata) {
                        if (value == "MEMBER") {
                            return i18n.getKey('member');
                        } else if (value == "ADMIN") {
                            return i18n.getKey('admin');
                        }
                        return value;
                    }
                },
                {
                    text: i18n.getKey('role'),
                    dataIndex: 'roles',
                    xtype: 'arraycolumn',
                    itemId: 'role',
                    sortable: false,
                    flex: 1,
                    lineNumber: 2,
                    valueField: 'name',
                    renderer: function (value, metadata) {
                        metadata.style = 'font-weight:bold';
                        return value;
                    }
                },
            ],
        };
        me.filterCfg = {
            header: false,
            defaults: {
                isLike: false,
            },
            items: [
                {
                    id: 'idSearchField',
                    name: 'id',
                    xtype: 'numberfield',
                    hideTrigger: true,
                    autoStripChars: true,
                    allowExponential: false,
                    allowDecimals: false,
                    fieldLabel: i18n.getKey('id'),
                    itemId: 'id'
                },
                {
                    id: 'typeSearchField',
                    name: 'type',
                    xtype: 'combo',
                    editable: false,
                    haveReset: true,
                    store: Ext.create('Ext.data.Store', {
                        fields: ['type', "value"],
                        data: [
                            {
                                type: i18n.getKey('admin'), value: 'ADMIN'
                            },
                            {
                                type: i18n.getKey('member'), value: 'MEMBER'
                            }
                        ]
                    }),
                    fieldLabel: i18n.getKey('type'),
                    itemId: 'type',
                    displayField: 'type',
                    valueField: 'value',
                    queryMode: 'local'
                },
                {
                    id: 'emailSearchField',
                    name: 'emailAddress',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('email'),
                    itemId: 'email'
                },
            ]
        };
        me.callParent();
    },
})
