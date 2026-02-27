/**
 * Created by miao on 2021/10/8.
 */
Ext.define('CGP.virtualcontainerobject.view.Main', {
    extend: 'Ext.ux.ui.GridPage',
    alias: 'widget.vcomain',
    config: {
        i18nblock: i18n.getKey('VCO'),
        block: 'virtualcontainerobject/app/view',
        editPage: 'edit.html',
        //权限控制
        //accessControl: true,
        tbarCfg: {
            btnCreate: {
                itemId: 'createbtn',
                handler: function (btn) {
                    var controller = Ext.create('CGP.virtualcontainerobject.controller.VirtualContainerObject');
                    controller.selectVCT(btn);
                }
            }
        },
        gridCfg: {

            store: 'VirtualContainerObject',
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    xtype: 'gridcolumn',
                    sortable: true,
                    width: 80
                },
                {
                    text: i18n.getKey('description'),
                    dataIndex: 'description',
                    xtype: 'gridcolumn',
                    sortable: true,
                    width: 200,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('VCT'),
                    dataIndex: 'containerType',
                    xtype: 'gridcolumn',
                    width: 160,
                    sortable: true,
                    renderer: function (value, metadata, record) {
                        if (Ext.isObject(value) && value._id) {
                            var displayValue = Ext.String.format('<{0}>{1}', value._id, value.description);
                            metadata.tdAttr = 'data-qtip="' + displayValue + '"';
                            return displayValue;
                        } else {
                            return null;
                        }
                    }
                },
                // {
                //     text: i18n.getKey('argument'),
                //     dataIndex: 'name',
                //     xtype: 'gridcolumn',
                //     width: 160,
                //     sortable: true,
                //     renderer: function (value, metadata, record) {
                //         metadata.tdAttr = 'data-qtip="' + value + '"';
                //         return value;
                //     }
                // },
                {
                    text: i18n.getKey('contentMapItems'),
                    dataIndex: 'contentMapItems',
                    xtype: 'gridcolumn',
                    width: 160,
                    sortable: true,
                    renderer: function (value, metadata, record) {
                        var displayValue = '';
                        if (Ext.isArray(value)) {
                            value.forEach(function (item) {
                                displayValue += Ext.String.format('<{0}>{1},', item._id, item.name);
                            })
                            displayValue = displayValue.substr(0, displayValue.length - 1);
                        }
                        metadata.tdAttr = 'data-qtip="' + displayValue + '"';
                        return displayValue;
                    }
                },
                {
                    text: i18n.getKey('layout'),
                    dataIndex: 'layout',
                    xtype: 'gridcolumn',
                    width: 160,
                    flex: 1,
                    renderer: function (value, metadata, record) {
                        if (value?.margin) {
                            var displayValue = JSON.stringify(value?.margin);
                            displayValue = displayValue.substring(1, displayValue.length - 1).replace(/"/g, '');
                            metadata.tdAttr = 'data-qtip="' + displayValue + '"';
                            return displayValue;
                        } else {
                            return null;
                        }
                    }
                }
            ]
        },
        // 搜索框
        filterCfg: {
            defaults: {
                isLike: false,
                width:280
            },
            items: [
                {
                    id: 'idSearchField',
                    name: '_id',
                    itemId: 'id',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('id'),
                    hideTrigger: true,
                    listeners: {
                        render: function (comp) {
                            var searchId = JSGetQueryString('id');
                            if (searchId) {
                                comp.setValue(searchId);
                            }
                        }
                    }
                },
                {
                    id: 'vcoSearch',
                    xtype: 'gridcombo',
                    name: 'containerType._id',
                    itemId: 'containerType',
                    fieldLabel: i18n.getKey('VCT'),
                    displayField: 'displayName',
                    valueField: '_id',
                    editable: false,
                    matchFieldWidth: false,
                    multiSelect: false,
                    autoScroll: true,
                    haveReset:true,
                    store: Ext.create('CGP.virtualcontainertype.store.VirtualContainerTypeStore', {
                        storeId: 'vctStore',
                    }),
                    gridCfg: {
                        store: Ext.data.StoreManager.lookup('vctStore'),
                        height: 300,
                        width: 600,
                        autoScroll: true,
                        //hideHeaders : true,
                        columns: [
                            {
                                text: i18n.getKey('id'),
                                width: 100,
                                dataIndex: '_id',
                                renderer: function (value, metaData) {
                                    metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                                    return value;
                                }
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
                                    xtype: 'textfield',
                                    fieldLabel: i18n.getKey('_id'),
                                    name: '_id',
                                    isLike: false,
                                    labelWidth: 40
                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: i18n.getKey('description'),
                                    name: 'description',
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
                            store: Ext.data.StoreManager.lookup('vctStore'),
                            displayInfo: true, // 是否 ? 示， 分 ? 信息
                            displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                            emptyMsg: i18n.getKey('noData')
                        })
                    },
                },
            ]
        }
    },
    constructor: function (config) {
        var me = this;
        me.initConfig(config);
        me.callParent([config]);
    },
});