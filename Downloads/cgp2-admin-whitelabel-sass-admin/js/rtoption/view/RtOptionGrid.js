Ext.define('CGP.rtoption.view.RtOptionGrid', {
    extend: 'CGP.common.commoncomp.QueryGrid',
    itemId: 'rtOptionGrid',
    width: 900,
    initComponent: function () {
        var me = this;
        me.store = Ext.create('CGP.rtoption.store.RtOption',{
            storeId:"RtOption"
        });
        var tagStore = Ext.data.StoreManager.get('RtOptionTag');
        if(Ext.isEmpty(tagStore)){
            tagStore= Ext.create('CGP.rtoption.store.RtOptionTag', {
                storeId:'RtOptionTag'
            });
        }
        if (me.tagId) {
            var params = [];
            if (me.tagId) {
                params.push({
                    name: 'tag.id',
                    type: 'number',
                    value: me.tagId
                })
                me.store.proxy.extraParams = {
                    filter: Ext.JSON.encode(params)
                };
            }
        }
        var controller = Ext.create('CGP.rtoption.controller.Controller');
        me.gridCfg = {
            editAction: false,
            deleteAction: false,
            store: me.store,
            defaults: {
                width: 180
            },
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    hidden: Ext.isEmpty(me.tagId),
                    items: [
                        {
                            xtype: 'button',
                            text: i18n.getKey('add') + i18n.getKey('rtOption'),
                            iconCls: 'icon_create',
                            handler: function () {
                                var gridStore = me.down('grid').getStore();
                                controller.editRtOptionWind(gridStore, me.data.tagId, me.data.id,controller);
                            }
                        }
                    ]
                }
            ],
            columns: [
                {
                    xtype: 'actioncolumn',
                    itemId: 'actioncolumn',
                    width: 60,
                    hidden: Ext.isEmpty(me.tagId),
                    sortable: false,
                    resizable: false,
                    menuDisabled: true,
                    tdCls: 'vertical-middle',
                    items: [
                        {
                            iconCls: 'icon_edit icon_margin',
                            itemId: 'actionedit',
                            tooltip: i18n.getKey('check') + i18n.getKey('rtOptionInfo'),
                            handler: function (view, rowIndex, colIndex, a, b, record) {
                                var treePanel = me.ownerCt.ownerCt.down('treepanel');
                                var gridStore = view.getStore();
                                var id = record.getId();
                                var tagId = record.get('tag').id;
                                controller.operateInspection(id, '修改', controller.editRtOption(gridStore, tagId, id));

                            }
                        },
                        {
                            iconCls: 'icon_remove icon_margin',
                            itemId: 'actiondelete',
                            tooltip: i18n.getKey('remove'),
                            handler: function (view, rowIndex, colIndex, a, b, record) {
                                var store = view.getStore();
                                var id = record.getId();
                                controller.operateInspection(id, '删除', controller.deleteRtOption(id, store));
                            }
                        }
                    ]
                },
                {
                    text: i18n.getKey('id'),
                    dataIndex: 'id',
                    xtype: 'gridcolumn',
                    width: 180,
                    tdCls: 'vertical-middle',
                    itemId: 'id',
                    sortable: true
                },
                {
                    text: i18n.getKey('name'),
                    dataIndex: 'name',
                    width: 180,
                    xtype: 'gridcolumn',
                    itemId: 'name',
                    tdCls: 'vertical-middle',
                    sortable: true,
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('value'),
                    dataIndex: 'value',
                    width: 180,
                    xtype: 'gridcolumn',
                    itemId: 'value',
                    sortable: true,
                    tdCls: 'vertical-middle',
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('displayValue'),
                    dataIndex: 'displayValue',
                    xtype: 'gridcolumn',
                    flex: 1,
                    tdCls: 'vertical-middle',
                    itemId: 'displayValue',
                    sortable: false,
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
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
                beforeselect: function (comp, rec, index) {//已选项选项不能选中
                    if (me.selecteds && me.selecteds.findExact('id', rec.getId().toString()) >= 0) {
                        Ext.Msg.alert('提示', '选项已添加，不能重复添加！')
                        return false;
                    }
                }
            }
        };
        me.filterCfg = {
            height: 60,
            header: false,
            border:false,
            defaults: {
                width: 270,
                isLike: false
            },
            items: [
                {
                    name: 'id',
                    xtype: 'numberfield',
                    fieldLabel: i18n.getKey('id'),
                    itemId: 'id',
                    hideTrigger: true,
                    allowDecimals: false,
                    minValue: 1
                },
                {
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                    itemId: 'name',
                    isLike: true
                },
                {
                    name: 'tag.id',
                    xtype: 'gridcombo',
                    fieldLabel: i18n.getKey('rtOption') + i18n.getKey('tag'),
                    itemId: 'tagId',
                    hidden:me.tagId?true:false,
                    displayField: 'nameId',
                    valueField: 'id',
                    editable: false,
                    store: tagStore,
                    matchFieldWidth: false,
                    multiSelect: false,
                    autoScroll: true,
                    gridCfg: {
                        store: tagStore,
                        height: 300,
                        width: 600,
                        autoScroll: true,
                        //hideHeaders : true,
                        columns: [
                            {
                                text: i18n.getKey('id'),
                                width: 80,
                                dataIndex: 'id',
                                renderer: function (value, metaData) {
                                    metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                                    return value;
                                }
                            },
                            {
                                text: i18n.getKey('name'),
                                width: 120,
                                dataIndex: 'name'
                            },
                            {
                                text: i18n.getKey('description'),
                                flex: 1,
                                dataIndex: 'description'
                            }
                        ],
                        tbar: {
                            layout: {
                                type: 'column'
                            },
                            defaults: {
                                width: 170,
                                isLike: false,
                                padding: 2
                            },
                            items: [
                                {
                                    xtype: 'numberfield',
                                    fieldLabel: i18n.getKey('id'),
                                    name: 'id',
                                    isLike: false,
                                    labelWidth: 40
                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: i18n.getKey('name'),
                                    name: 'name',
                                    labelWidth: 40
                                },
                                {
                                    xtype: 'button',
                                    text: i18n.getKey('search'),
                                    width: 80,
                                    handler: function () {
                                        var queries = [];
                                        var items = this.ownerCt.items.items;
                                        var store = this.ownerCt.ownerCt.getStore();
                                        var params = {};
                                        for (var i = 0; i < items.length; i++) {
                                            var query = {};
                                            if (items[i].xtype == 'button')
                                                continue;
                                            if (Ext.isEmpty(items[i].value))
                                                continue;
                                            query.name = items[i].name;
                                            if (!Ext.isEmpty(items[i].isLike) && !items[i].isLike) {
                                                query.value = items[i].getValue();
                                            } else if (Ext.isEmpty(items[i].isLike) || items[i].isLike) {
                                                query.value = '%' + items[i].getValue() + '%'
                                            }
                                            query.type = 'string';
                                            queries.push(query);
                                        }

                                        if (queries.length > 0) {
                                            store.proxy.extraParams = {
                                                filter: Ext.JSON.encode(queries)
                                            }
                                        } else {
                                            store.proxy.extraParams = null;
                                        }
                                        store.loadPage(1);
                                    },
                                },
                                {
                                    xtype: 'button',
                                    text: i18n.getKey('clear'),
                                    handler: function () {
                                        var items = this.ownerCt.items.items;
                                        var store = this.ownerCt.ownerCt.getStore();
                                        for (var i = 0; i < items.length; i++) {
                                            if (items[i].xtype == 'button')
                                                continue;
                                            if (Ext.isEmpty(items[i].value))
                                                continue;
                                            items[i].setValue('');
                                        }
                                        store.proxy.extraParams = null;
                                    },
                                    width: 80
                                }
                            ]
                        },
                        bbar: Ext.create('Ext.PagingToolbar', {
                            store: tagStore,
                            displayInfo: true, // 是否 ? 示， 分 ? 信息
                            displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                            emptyMsg: i18n.getKey('noData')
                        })
                    }
                }
            ]
        };
        me.callParent(arguments);
    },
    refreshData: function (data, seachId) {
        var me = this;
        var store = me.down('grid').getStore();
        if (Ext.isEmpty(data))
            return false;

        me.data = data, me.tagId = data.tagId;

        me.ownerCt.setTitle("<font color=black>" + data['name'] + "</font>" + i18n.getKey('tag') + '下所有rtOption');
        //查询框设值
        if (data && data.tagId) {
            var tagStore = Ext.data.StoreManager.get('RtOptionTag');
            var tagRecord = tagStore.findRecord('id', data.tagId);
            if (tagRecord) {
                me.filter.getComponent('tagId').setValue(tagRecord.data);
            }
            var params = [];
            params.push({
                name: 'tag.id',
                type: 'number',
                value: data.tagId
            })
            store.proxy.extraParams = {
                filter: Ext.JSON.encode(params)
            };
        }
        if (seachId) {
            me.filter.getComponent('id').setValue(seachId);
            store.filter('id', seachId);
        } else {
            me.filter.getComponent('id').setValue(null)
        }
        //me.filter.getComponent("fieldContainer").getComponent("searchButton").fireEvent("click");
        store.loadPage(1);
    },
    listeners: {

        // afterrender: function (comp) {//过滤掉已选项选项
        //     comp.store.on('load',
        //         function (store, records) {
        //             store.filterBy(function (item) {
        //                 if (comp.selecteds) {
        //                     --store.totalCount;
        //                     return comp.selecteds.findExact('id', item.getId()) < 0;
        //                 }
        //                 return true;
        //             });
        //         })
        // }
    },
});
