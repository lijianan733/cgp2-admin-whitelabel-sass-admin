Ext.define("CGP.commonbuilderfont.view.FontList", {
    extend: 'CGP.common.commoncomp.QueryGrid',


    minWidth: 920,
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
        var store = Ext.create('CGP.commonbuilderfont.store.BuilderFontLocal');
        store.on('load', function (store, records, options) {

            var grid = Ext.getCmp('allFont');

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
            id: 'allFont',
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
                dataIndex: '_id',
                itemId: 'id',

                sortable: true
            },
                {
                    text: i18n.getKey('fontFamily'),
                    dataIndex: 'fontFamily',
                    width: 100,
                    itemId: 'fontFamily'
                },
                {
                    text: i18n.getKey('displayName'),
                    dataIndex: 'displayName',
                    width: 165,
                    itemId: 'displayName'
                },
                {
                    text: i18n.getKey('wordRegExp'),
                    dataIndex: 'wordRegExp',
                    width: 120,
                    itemId: 'wordRegExp'
                }, {
                    text: i18n.getKey('字体支持样式'),
                    dataIndex: 'fontStyleKeys',
                    width: 150,
                    xtype: 'uxarraycolumnv2',
                    itemId: 'fontStyleKeys',
                    sortable: false,
                    maxLineCount: 5,
                    lineNumber: 3,
                    renderer: function (value, mate, record) {
                        return value;

                    }
                },
                {
                    text: i18n.getKey('language'),
                    dataIndex: 'languages',
                    itemId: 'language',
                    width: 150,
                    xtype: 'uxarraycolumnv2',
                    sortable: false,
                    maxLineCount: 5,
                    lineNumber: 3,
                    renderer: function (value, mate, record) {
                        var result = '';
                        if (value.locale) {
                            result = value.code.code + '-' + value.locale.code;
                        } else {
                            result = value.code.code;
                        }
                        return result;
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
                    id: 'idSearchField',
                    name: '_id',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('id'),
                    isLike: false,
                    itemId: 'id'
                },
                {
                    id: 'nameSearchField',
                    name: 'fontFamily',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('fontFamily'),
                    itemId: 'fontFamily'
                },
                {
                    id: 'displaynameSearchField',
                    name: 'displayName',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('displayName'),
                    itemId: 'displayName'
                },
                {
                    name: 'languages',
                    xtype: 'combo',
                    fieldLabel: i18n.getKey('language'),
                    itemId: 'language',
                    editable: false,
                    isLike: false,
                    valueField: 'id',
                    displayField: 'name',
                    store: Ext.create('CGP.common.store.Language')
                }
            ]
        };
        me.callParent(arguments);
    }
});
