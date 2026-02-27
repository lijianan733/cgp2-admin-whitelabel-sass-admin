Ext.Loader.syncRequire([
    'CGP.common.field.WebsiteCombo'
]);
Ext.define("CGP.product.view.procductManage.view.UserList", {
    extend: 'CGP.common.commoncomp.QueryGrid',


    minWidth: 300,
    height: 400,
    /**
     * @cfg {Object} filterDate
     * 实现过滤已存在的合作用户
     */
    filterDate: null,
    /**
     * @cfg {Ext.util.MixedCollection} collection
     * 記錄所有選中的產品ID集合，实现翻页记录
     */
    collection: new Ext.util.MixedCollection(),
    setedUsers: null,//已设置的用户

    constructor: function (config) {
        var me = this;
        me.callParent(arguments);

    },

    initComponent: function () {
        var me = this;
        var store = Ext.create('CGP.customer.store.CustomerStore');
        var websiteStore = Ext.create("CGP.partner.store.WebsiteAll");
        var users = me.setedUsers.map(function (el) {
            return el.email;
        })
        store.on('load', function (store, records, options) {
            // store.filter([
            //     {
            //         filterFn: function (item) {
            //             return Ext.Array.indexOf(users, item.get('email')) < 0;
            //         }
            //     }
            // ]);
            var grid = Ext.getCmp('allUser');

            Ext.Array.each(me.collection, function () {
                for (var i = 0; i < records.length; i++) {
                    var record = records[i];
                    if (me.collection.containsKey(record.get("id"))) {
                        grid.getSelectionModel().select(i, true, false);    //选中record，并且保持现有的选择，不触发选中事件
                    }
                }
            });
        });

        me.gridCfg = {
            store: store,
            id: 'allUser',
            editAction: false,
            deleteAction: false,
            listeners: {
                //选中时加到collection集合中
                'select': function (checkModel, record) {
                    me.collection.add(record.get("id"), record.get('id'));
                },
                //取消选中时 从集合中去除
                'deselect': function (checkModel, record, index, eOpts) {
                    me.collection.remove(me.collection.get(record.get("id")));
                },
                beforeselect: function (comp, rec, index) {//已选项选项不能选中
                    if (Ext.Array.indexOf(users, rec.get('email')) >= 0) {
                        Ext.Msg.alert('提示', Ext.String.format('<p style="white-space:nowrap;">该用户已被添加为管理员！</p>', rec.get('partnerId')));
                        return false;
                    }
                }
            },
            viewConfig: {
                getRowClass: function (rec) {//已添加选项重新设置行样式
                    if (Ext.Array.indexOf(users, rec.get('email')) >= 0) {
                        return 'select_disable'; //html添加该样式
                    }
                }
            },
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: 'id',
                    width: 60,
                    itemId: 'id'
                },
                {
                    text: i18n.getKey('firstName'),
                    dataIndex: 'firstName'
                },
                {
                    text: i18n.getKey('lastName'),
                    dataIndex: 'lastName'
                },
                {
                    text: i18n.getKey('email'),
                    dataIndex: 'email',
                    width: 180
                },

                {
                    text: i18n.getKey('website'),
                    dataIndex: 'website',
                    flex: 1,
                    renderer: function (value) {
                        return value.name
                    }
                }
            ]

        };
        me.filterCfg = {
            height: 90,
            header: false,
            defaults: {
                width: 280
            },
            items: [
                {
                    name: 'role',
                    xtype: 'numberfield',
                    fieldLabel: i18n.getKey('role'),
                    itemId: 'role',
                    hidden: true,
                    value: 25365244
                },
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
                    name: 'emailAddress',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('email'),
                    itemId: 'emailAddress'
                },
                {
                    name: 'websiteIds',
                    xtype: 'websitecombo',
                    itemId: 'websiteCombo',
                    hidden: true,
                    value: 5
                }
            ]
        };
        me.callParent(arguments);
        /*
                Ext.getCmp('websiteSearchField').setValue([me.websiteId, 5]);
        */
    }
});
