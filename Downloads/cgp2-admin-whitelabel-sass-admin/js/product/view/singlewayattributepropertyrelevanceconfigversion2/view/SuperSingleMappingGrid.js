/**
 * Created by nan on 2019/11/8.
 */
Ext.define("CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.SuperSingleMappingGrid", {
    extend: "CGP.common.commoncomp.QueryGrid",
    store: null,
    width: 2400,
    autoScroll: true,
    bodyStyle: 'border-color:silver;',
    header: {
        style: 'background-color:white;',
        color: 'black',
        border: '0 0 0 0'
    },
    viewConfig: {
        enableTextSelection: true,
        stripeRows: true
    },
    filterItem: null,//自定义过滤项
    controller: Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.controller.Controller'),
    initComponent: function () {
        var me = this;
        var store = Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.store.SingleWayProductAttributeMappingStore', {});
        var productId = me.productId;
        var skuAttributeStore = me.skuAttributeStore;
        me.filterItem = me.filterItem || [];
        me.gridCfg = {
            store: store,
            tbar: me.gridtbar,
            editAction: false,//是否启用edit的按钮
            deleteAction: false,//是否启用delete的按钮
            columns: Ext.Array.merge([
                {
                    xtype: 'actioncolumn',
                    width: 50,
                    tdCls: 'vertical-middle',
                    items: [
                        {
                            iconCls: 'icon_edit icon_margin',  // Use a URL in the icon config
                            tooltip: 'Edit',
                            handler: function (view, rowIndex, colIndex, a, b, record) {
                                var win = null;
                                var grid = view.ownerCt;
                                if (record.get('clazz') == 'com.qpp.cgp.domain.attributemapping.oneway.ConditionOneWayValueMapping') {
                                    win = Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.AdvancedSingleMappingWindow', {
                                        productId: productId,
                                        createOrEdit: 'edit',
                                        record: record,
                                        grid: grid,
                                        skuAttributeStore: skuAttributeStore
                                    });
                                    win.show();

                                } else if (record.get('clazz') == 'com.qpp.cgp.domain.attributemapping.oneway.OneWaySimpleCalculateValueMapping') {
                                    var controller = Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.controller.Controller');
                                    win = controller.addWindow(productId, 'CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.CalculateValueMapping', grid, record.raw);
                                } else if (record.get('clazz') == 'com.qpp.cgp.domain.attributemapping.oneway.OneWaySimpleValueMapping') {
                                    var controller = Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.controller.Controller');
                                    win = controller.addWindow(productId, 'CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.ValueMapping', grid, record.raw);
                                } else if (record.get('clazz') == 'com.qpp.cgp.domain.attributemapping.oneway.OneWaySimpleCalculateValueConditionMapping') {
                                    var controller = Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.controller.Controller');
                                    win = controller.addWindow(productId, 'CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.calculatevaluecondition.Edit', grid, record.raw);
                                }
                                win.refreshData(record.raw);
                                var isLock = JSCheckProductIsLock(productId);
                                if (isLock) {
                                    console.log(win)
                                    var toolbar = win.down("toolbar[@dock='bottom']");
                                    var saveBtn = toolbar.getComponent('saveBtn');
                                    saveBtn.setDisabled(true);

                                }
                            }
                        },
                        {
                            iconCls: 'icon_remove icon_margin',
                            tooltip: 'Delete',
                            handler: function (view, rowIndex, colIndex, a, b, record) {
                                var grid = view.ownerCt;
                                Ext.Msg.confirm('提示', '确定删除？', callback);

                                function callback(id) {
                                    if (id === 'yes') {
                                        grid.ownerCt.controller.deleteOneWayValueMapping(record, grid);
                                    }
                                }
                            }
                        }
                    ]
                },
                {
                    dataIndex: '_id',
                    tdCls: 'vertical-middle',
                    sortable: false,
                    text: i18n.getKey('id')
                }, {
                    dataIndex: 'attributeMappingDomain',
                    tdCls: 'vertical-middle',
                    sortable: false,
                    text: i18n.getKey('domain') + i18n.getKey('id'),
                    renderer: function (value) {
                        return value._id;
                    }
                },
                {
                    dataIndex: 'description',
                    tdCls: 'vertical-middle',
                    width: 250,
                    sortable: false,
                    text: i18n.getKey('description'),
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';//显示的文本
                        return value;
                    }
                },
                {
                    dataIndex: 'attributePropertyPath',
                    tdCls: 'vertical-middle',
                    sortable: false,
                    width: 200,
                    text: i18n.getKey('链入口'),
                    renderer: function (value) {
                        if (value.entryLink) {
                            return value.entryLink.linkName + '(' + value.entryLink._id + ')';
                        }
                    }
                },
                {
                    dataIndex: 'mappingLinks',
                    tdCls: 'vertical-middle',
                    sortable: false,
                    width: 200,
                    xtype: 'uxarraycolumnv2',
                    maxLineCount: 3,
                    lineNumber: 2,
                    text: i18n.getKey('所属mappingLinks'),
                    diyDisplay: function (record, value) {
                        var me = this;
                        var result = null;
                        if ((typeof value == 'object') && value.constructor == Object) {
                            result = value.linkName + '(' + value._id + ')';
                        } else {
                            result = value;
                        }
                        return result;
                    },
                    showContext: function (id, title) {
                        var grid = this.ownerCt.ownerCt;
                        var store = grid.store;
                        var record = store.findRecord('_id', id);
                        var mappingLinks = record.get('mappingLinks');
                        var win = Ext.create('Ext.window.Window', {
                            modal: true,
                            constrain: true,
                            title: i18n.getKey('linkName'),
                            layout: 'fit',
                            width: 500,
                            height: 300,
                            items: [
                                {
                                    xtype: 'grid',
                                    columns: [
                                        {
                                            dataIndex: '_id',
                                            menuDisabled: true,
                                            text: i18n.getKey('id'),
                                            renderer: function (value, me, record) {
                                                return value;
                                            }
                                        },
                                        {
                                            dataIndex: 'linkName',
                                            flex: 1,
                                            text: i18n.getKey('linkName'),
                                            menuDisabled: true,
                                            renderer: function (value, me, record) {
                                                return value;
                                            }
                                        }
                                    ],
                                    autoScroll: true,
                                    store: Ext.create('Ext.data.Store', {
                                        fields: ['_id', 'linkName'],
                                        data: mappingLinks
                                    })
                                }
                            ]
                        });
                        win.show();
                    }
                },
                {
                    dataIndex: 'depends',
                    tdCls: 'vertical-middle',
                    sortable: false,
                    width: 200,
                    xtype: 'uxarraycolumnv2',
                    text: i18n.getKey('依赖的其他映射'),
                    itemId: 'groups',
                    maxLineCount: 3,
                    lineNumber: 2,
                    valueField: '_id',
                    listeners: {
                        afterrender: function () {
                            var me = this;//只能创建完后设置，不然该columns对象的指向有问题id会重复
                            window['showContext_' + me.columnUUId] = me.showContext.bind(me);//把该方法变成全局方法
                            window['showDependDescription_' + me.columnUUId] = function (recordId, dependId) {
                                var grid = this.ownerCt.ownerCt;
                                var store = grid.store;
                                var record = store.findRecord('_id', recordId);
                                var depends = record.get('depends');
                                var depend = null;
                                for (var i = 0; i < depends.length; i++) {
                                    if (depends[i]._id == dependId) {
                                        depend = depends[i];
                                        break;
                                    }
                                }
                                var win = Ext.create('Ext.window.Window', {
                                    modal: true,
                                    constrain: true,
                                    title: i18n.getKey('depend'),
                                    layout: 'fit',
                                    width: 500,
                                    height: 150,
                                    items: [
                                        {
                                            xtype: 'form',
                                            layout: {
                                                type: 'vbox',
                                                align: 'center',
                                                pack: 'center'
                                            },
                                            defaults: {
                                                width: 450
                                            },
                                            items: [
                                                {
                                                    fieldLabel: i18n.getKey('id'),
                                                    xtype: 'textfield',
                                                    readOnly: true,
                                                    value: depend._id
                                                },
                                                {
                                                    fieldLabel: i18n.getKey('description'),
                                                    xtype: 'textfield',
                                                    readOnly: true,
                                                    value: depend.description
                                                }
                                            ]

                                        }
                                    ]
                                });
                                win.show();

                            }.bind(me)
                        }
                    },
                    diyDisplay: function (value, recordId) {
                        var me = this;
                        return new Ext.Template('<a href="#" onclick="{methodId}({recordId}' + ',{dependId})">' + value._id + '</a>').apply({
                            methodId: 'showDependDescription_' + me.columnUUId,//加dataIndex是因为处理多个不同的Uxarraycolumns
                            recordId: recordId,
                            dependId: value._id
                        });
                    },
                    defaultRenderer: function (v, metadata, record) {
                        var me = this;
                        if (Ext.isEmpty(v)) {
                            return null
                        }
                        var id = record.getId();
                        if (v.length > 0 && Object.prototype.toString.call(v) === '[object Array]') {
                            var returnvalue = [];
                            for (var i = 0; i < v.length; i++) {
                                var value1 = null;
                                if ((typeof v[i] == 'object') && v[i].constructor == Object) {
                                    value1 = me.diyDisplay(v[i], id);
                                }
                                if (i / me.lineNumber > 0 && i % me.lineNumber == 0) {
                                    value1 = "<br>" + me.diyDisplay(v[i], id);
                                }
                                returnvalue.push(value1);
                                if (!Ext.isEmpty(me.maxLineCount)) {
                                    if (i == me.lineNumber * (me.maxLineCount) - 1 && v.length > me.lineNumber * me.maxLineCount) {
                                        value1 = '<br>' + new Ext.Template('<a href="#" onclick="{methodId}({recordId})">' + 'More...' + '</a>').apply({
                                            methodId: 'showContext_' + me.columnUUId,//加dataIndex是因为处理多个不同的Uxarraycolumns
                                            recordId: id
                                        });
                                        returnvalue.push(value1);
                                        break;
                                    }
                                }
                            }
                            return returnvalue.join(me.delimiter);
                        } else {
                            var value2 = null;
                            if ((typeof v == 'object') && v.constructor == Object) {
                                if (me.valueField) {
                                    value2 = v[me.valueField];
                                } else if (me.deleteren) {
                                    value2 = me.deleteren(v);
                                } else {
                                    if (v.id != null) value2 = v.id;
                                    else {
                                        Ext.Msg.alert('message', "Didn't define the display field");
                                    }
                                }
                            } else {
                                value2 = v;
                            }
                            return value2;
                        }
                    },
                    showContext: function (id, title) {
                        var grid = this.ownerCt.ownerCt;
                        var store = grid.store;
                        var record = store.findRecord('_id', id);
                        var mappingLinks = record.get('depends');
                        var win = Ext.create('Ext.window.Window', {
                            modal: true,
                            constrain: true,
                            title: i18n.getKey('depend'),
                            layout: 'fit',
                            width: 500,
                            height: 300,
                            items: [
                                {
                                    xtype: 'grid',
                                    columns: [
                                        {
                                            dataIndex: '_id',
                                            menuDisabled: true,
                                            text: i18n.getKey('id'),
                                            renderer: function (value, me, record) {
                                                return value;
                                            }
                                        },
                                        {
                                            dataIndex: 'description',
                                            flex: 1,
                                            menuDisabled: true,
                                            text: i18n.getKey('description'),
                                            renderer: function (value, me, record) {
                                                return value;
                                            }
                                        }
                                    ],
                                    autoScroll: true,
                                    store: Ext.create('Ext.data.Store', {
                                        fields: ['_id', 'description'],
                                        data: mappingLinks
                                    })
                                }
                            ]
                        });
                        win.show();
                    }
                }
            ], me.columns)
        };
        me.filterCfg = {
            header: false,
            border: false,
            items: Ext.Array.merge([
                {
                    fieldLabel: i18n.getKey('id'),
                    xtype: 'textfield',
                    isLike: false,
                    itemId: '_id',
                    name: '_id'
                }, {
                    fieldLabel: i18n.getKey('domain') + i18n.getKey('id'),
                    xtype: 'textfield',
                    isLike: false,
                    itemId: 'domainId',
                    name: 'attributeMappingDomain._id'
                },
                {
                    fieldLabel: i18n.getKey('description'),
                    xtype: 'textfield',
                    itemId: 'description',
                    name: 'description'
                },
                {
                    xtype: 'gridcombo',
                    itemId: 'attributePropertyPath',
                    fieldLabel: i18n.getKey('触发属性'),
                    multiSelect: false,
                    name: 'attributePropertyPath.skuAttributeId',
                    displayField: 'attributeName',
                    valueField: 'id',
                    editable: false,
                    store: Ext.data.StoreManager.lookup('productAttributeStore'),
                    matchFieldWidth: false,
                    gridCfg: {
                        store: Ext.data.StoreManager.lookup('productAttributeStore'),
                        maxHeight: 280,
                        width: 300,
                        columns: [
                            {
                                dataIndex: 'attributeName',
                                flex: 1,
                                text: i18n.getKey('attributeName')
                            }
                        ]
                    }
                },
                {
                    fieldLabel: i18n.getKey('所属的mappingLink'),
                    xtype: 'combo',
                    isLike: false,
                    editable: false,
                    store: Ext.create('CGP.product.view.mappinglink.store.MappingLinkStore', {
                        params: {
                            filter: Ext.JSON.encode([{
                                name: 'productId',
                                type: 'number',
                                value: productId
                            }])
                        }
                    }),
                    valueField: '_id',
                    displayField: 'linkName',
                    itemId: 'mappingLinks',
                    name: 'mappingLinkIds'
                },
                {
                    fieldLabel: i18n.getKey('productId'),
                    xtype: 'numberfield',
                    itemId: 'productId',
                    name: 'productId',
                    hidden: true,
                    value: productId
                }

            ], me.filterItem)
        };
        me.filterCfg = Ext.merge({
            searchActionHandler: function () {
                me.grid.getStore().loadPage(1);
            },
            itemId: 'filter',
            region: 'north',
            filterParams: me.queryParams//传入的过滤键值对集合
        }, me.filterCfg);
        me.gridCfg = Ext.merge(me.gridCfg, {
            filter: me.filter,
            itemId: 'grid',
            autoScroll: true,
            region: 'center'
        }, me.gridCfg);
        me.callParent(arguments);
        me.on('afterrender', function () {
            var page = this;
            var productId = me.productId;
            var isLock = JSCheckProductIsLock(productId);
            if (isLock) {
                JSLockConfig(page);
            }
        });
    }
})
