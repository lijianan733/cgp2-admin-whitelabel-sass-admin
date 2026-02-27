Ext.define("CGP.partner.view.config.customcurrency.CurrencyList", {
    extend: 'CGP.common.commoncomp.QueryGrid',


    minWidth: 700,
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
    constructor: function (config) {
        var me = this;
        me.callParent(arguments);

    },

    initComponent: function () {
        var me = this;
        var store = Ext.create('CGP.partner.store.AllCurrency', {
            params: {
                filter: '[{"name":"website.id","value":' + 11 + ',"type":"number"}]'
            }
        });
        store.on('load', function (store, records, options) {

            var grid = Ext.getCmp('allCurrency');

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
            id: 'allCurrency',
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
                }


            },
            columns: [{
                text: i18n.getKey('id'),
                width: 90,
                dataIndex: 'id',
                itemId: 'id',
                isLike: false,
                sortable: true
            },
                {
                    text: i18n.getKey('title'),
                    dataIndex: 'title',
                    width: 100,
                    itemId: 'title'
                },
                {
                    text: i18n.getKey('code'),
                    dataIndex: 'code',
                    width: 165,
                    itemId: 'code'
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
                    id: 'idSearchField',
                    name: 'id',
                    xtype: 'numberfield',
                    hideTrigger: true,
                    autoStripChars: true,
                    allowExponential: false,
                    allowDecimals: false,
                    fieldLabel: i18n.getKey('id'),
                    itemId: 'id'
                },{
                    id: 'websiteSearchField',
                    name: 'website.id',
                    xtype: 'numberfield',
                    hideTrigger: true,
                    hidden: true,
                    value: 11,
                    autoStripChars: true,
                    allowExponential: false,
                    allowDecimals: false,
                    itemId: 'websiteSearchField'
                },
                {
                    id: 'nameSearchField',
                    name: 'title',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('title'),
                    itemId: 'title'
                },
                {
                    id: 'codeSearchField',
                    name: 'code',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('code'),
                    itemId: 'code'
                },
                {
                    xtype: 'textfield',
                    name: 'excludeIds',
                    hidden: true,
                    isLike: false,
                    value: function () {
                        if (Ext.isEmpty(me.filterData)) {
                            return;
                        } else if (Ext.isString(me.filterData)) {
                            return me.filterData;
                        } else {
                            var value = [];
                            for (var i = 0; i < me.filterData.length; i++) {
                                value.push(me.filterData[i].getId());
                            }
                            return "[" + value.join(",") + "]";
                        }
                    }()
                }
            ]
        };
        me.callParent(arguments);
    }
});
