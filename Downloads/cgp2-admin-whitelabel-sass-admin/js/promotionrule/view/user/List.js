Ext.Loader.syncRequire(
    ['CGP.common.field.WebsiteCombo']
)
Ext.define("CGP.promotionrule.view.user.List", {
    extend: 'CGP.common.commoncomp.QueryGrid',


    filterDate: null, //需要过滤吊的数据
    websiteId: null,

    minWidth: 500,
    constructor: function (config) {
        var me = this;

        me.callParent(arguments);
    },

    initComponent: function () {
        var me = this;
        me.gridCfg = {
            editAction: false,
            deleteAction: false,
            store: Ext.create("CGP.customer.store.CustomerStore", {
//					filters :  [
//					    {filterFn: function(item){
//							var data = me.filterDate;
//							for(var i = 0;i < data.length;i++){
//								if(item.get("id") == data[i].get("id")) return false;
//							}
//							return true;
//						}}
//					]
            }),
            multiSelect: true,
            columns: [{
                text: i18n.getKey('id'),
                dataIndex: 'id',
                itemId: 'id',
                minWidth: 60
            }, {
                text: i18n.getKey('customerEmail'),
                dataIndex: 'email',
                itemId: 'email',
                sortable: false,
                minWidth: 170,
                renderer: function (value, metadata) {
                    metadata.style = "font-weight:bold";
                    return value;
                }
            }, {
                text: i18n.getKey('website'),
                dataIndex: 'website',
                xtype: 'gridcolumn',
                itemId: 'website',
                sortable: false,
                minWidth: 150,
                renderer: function (record) {
                    return record.name;
                }
            }, {
                text: i18n.getKey('source'),
                dataIndex: 'source',
                xtype: 'gridcolumn',
                itemId: 'source',
                sortable: false,
                minWidth: 80
            }, {
                text: i18n.getKey('firstName'),
                dataIndex: 'firstName',
                itemId: 'firstName',
                sortable: false,
                minWidth: 150
            }, {
                text: i18n.getKey('lastName'),
                dataIndex: 'lastName',
                itemId: 'lastName',
                sortable: false,
                minWidth: 150
            }]

        };
        me.filterCfg = {
            height: 110,
            defaults: {
                width: 280
            },
            items: [{
                id: 'emailSearchField',
                name: 'emailAddress',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('customerEmail'),
                itemId: 'email'
            }, {
                name: 'website',
                xtype: 'websitecombo',
                itemId: 'websiteCombo',
                hidden: true,
                value: me.websiteId || 11
            }, {
                name: 'source',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('source'),
                itemId: 'source'
            }, {
                name: 'firstName',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('firstName'),
                itemId: 'firstName'
            }, {
                name: 'lastName',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('lastName'),
                itemId: 'lastName'
            }, {
                xtype: 'textfield',
                name: 'excludeIds',
                hidden: true,
                value: function () {
                    if (Ext.isEmpty(me.filterDate)) {
                        return;
                    } else {
                        var value = [];
                        for (var i = 0; i < me.filterDate.length; i++) {
                            value.push(me.filterDate[i].get("id"));
                        }
                        return value.join(",");
                    }
                }()
            }]
        };

        me.callParent(arguments);
    },
    getValue: function () {
        var me = this;
        return me.down("grid").getSelectionModel().getSelection();
    }
});