Ext.define("CGP.font.view.LanguageList", {
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
    constructor: function (config) {
        var me = this;

        me.callParent(arguments);

    },

    initComponent: function () {
        var me = this;
        var zoneStore = Ext.create('CGP.zone.store.Zone');
        var store = Ext.create('CGP.common.store.Language');
        store.on('load', function (store, records, options) {

            var grid = Ext.getCmp('allLanguage');

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
            id: 'allLanguage',
            editAction: false,
            deleteAction: false,
            columns: [
                {
                    text: i18n.getKey('id'),
                    sortable: false,
                    dataIndex: 'id',
                    width: 80,
                    renderer: function (value) {
                        if (value < 0) {
                            return '';
                        } else {
                            return value;
                        }
                    }
                },
                {
                    text: i18n.getKey('name'),
                    sortable: false,
                    dataIndex: 'name',
                    width: 180,
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip ="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('locale'),
                    dataIndex: 'locale',
                    xtype: 'gridcolumn',
                    itemId: 'locale',
                    sortable: true,
                    renderer: function (v) {
                        if (v) {
                            return v.name + '(' + v.code + ')';
                        }
                    }
                }, {
                    text: i18n.getKey('code'),
                    dataIndex: 'code',
                    xtype: 'gridcolumn',
                    itemId: 'code',
                    flex:1,
                    sortable: true,
                    renderer: function (v) {
                        return v.code;
                    }
                }
            ],
            viewConfig: {
                getRowClass: function (rec) {//已添加选项重新设置行样式
                    if (me.selecteds && me.selecteds.findExact('id', rec.getId().toString()) >= 0) {
                        return 'select_disable'; //html添加该样式
                    }
                }
            },
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
                    if (me.selecteds && me.selecteds.findExact('id', rec.getId().toString()) >= 0) {
                        Ext.Msg.alert('提示', '选项已添加，不能重复添加！')
                        return false;
                    }
                }
            }

        };
        me.filterCfg = {
            height: 90,
            header: false,
            defaults: {
                width: 240
            },
            items: [
                {
                    id: 'idSearchField',
                    name: 'id',
                    xtype: 'numberfield',
                    hideTrigger: true,
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
                    name: 'locale.id',
                    fieldLabel: i18n.getKey('locale'),
                    itemId: 'locale',
                    xtype: 'gridcombo',
                    haveReset: true,
                    allowBlank: true,
                    multiSelect: false,
                    displayField: 'code',
                    valueField: 'id',
                    labelAlign: 'right',
                    editable: false,
                    store: zoneStore,
                    matchFieldWidth: false,
                    diySetValue: function (data) {
                        var me = this;
                        if (data) {
                            me.setInitialValue([data.id])
                        }
                    },
                    diyGetValue: function () {
                        var me = this;
                        if (me.getSubmitValue().length > 0) {
                            return {
                                id: me.getSubmitValue()[0],
                                clazz: 'com.qpp.cgp.domain.common.Zone'
                            }
                        }
                        return null;

                    },
                    gridCfg: {
                        height: 280,
                        width: 500,
                        viewConfig: {
                            enableTextSelection: true
                        },
                        columns: [
                            {
                                text: i18n.getKey('id'),
                                width: 80,
                                dataIndex: 'id'
                            },
                            {
                                text: i18n.getKey('name'),
                                width: 100,
                                dataIndex: 'name'
                            },
                            {
                                text: i18n.getKey('code'),
                                width: 100,
                                dataIndex: 'code'
                            },
                            {
                                text: i18n.getKey('country'),
                                flex: 1,
                                dataIndex: 'country',
                                renderer: function (v) {
                                    return v.name;
                                }
                            }
                        ],
                        bbar: Ext.create('Ext.PagingToolbar', {
                            store: zoneStore,
                            displayInfo: true, // 是否 ? 示， 分 ? 信息
                            displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                            emptyMsg: i18n.getKey('noData')
                        })
                    }
                }, {
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
                                value.push(me.filterData[i].get("id"));
                            }
                            return '[' + value.join(",") + ']';
                        }
                    }()
                }
            ]
        };
        me.callParent(arguments);
    }
});
