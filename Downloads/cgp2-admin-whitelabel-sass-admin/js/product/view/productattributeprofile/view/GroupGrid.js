Ext.define("CGP.product.view.productattributeprofile.view.GroupGrid", {
    extend: "Ext.grid.Panel",
    itemId: 'groupGrid',
    autoScroll: true,
    viewConfig: {
        enableTextSelection: true
    },
    constructor: function (config) {
        var me = this;
        me.callParent(arguments);
    },
    initComponent: function () {
        var me = this;
        me.title = i18n.getKey('group');
        var controller = Ext.create('CGP.product.view.productattributeprofile.controller.Controller');
        me.productId = parseInt(JSGetQueryString('productId'));
        me.store = Ext.create("CGP.product.view.productattributeprofile.store.AttributeGroupStore", {
            data: []
        });
        var skuAttributeStore = Ext.create("CGP.product.store.SkuAttribute", {
            configurableId: me.productId
        });
        me.columns = [

            {
                xtype: 'actioncolumn',
                itemId: 'actioncolumn',
                sortable: false,
                resizable: false,
                width: 70,
                tdCls: 'vertical-middle',
                menuDisabled: true,
                items: [
                    {
                        iconCls: 'icon_edit icon_margin',
                        tooltip: i18n.getKey('update'),
                        handler: function (view, rowIndex, colIndex, a, b, record) {
                            var store = me.store;
                            var editOrNew = 'modify';
                            controller.addProfileGroup('modify', record, me.profileStore, skuAttributeStore, me.store);
                        }
                    },
                    {
                        iconCls: 'icon_remove icon_margin',
                        itemId: 'actiondelete',
                        tooltip: i18n.getKey('remove'),
                        handler: function (view, rowIndex, colIndex, a, b, record) {
                            var store = view.getStore();
                            store.removeAt(rowIndex);
                        }
                    }
                ]
            }, {
                dataIndex: '_id',
                text: i18n.getKey('id'),
                width: 120,
                tdCls: 'vertical-middle',
                itemId: 'id'
            },
            {
                dataIndex: 'name',
                text: i18n.getKey('name'),
                width: 160,
                tdCls: 'vertical-middle',
                itemId: 'name'
            }, {
                dataIndex: 'displayName',
                text: i18n.getKey('displayName'),
                width: 160,
                tdCls: 'vertical-middle',
                itemId: 'displayName'
            },
            {
                dataIndex: 'sort',
                text: i18n.getKey('sorter'),
                width: 70,
                tdCls: 'vertical-middle',
                itemId: 'sort'
            },
            {
                text: i18n.getKey('attributeSet'),
                dataIndex: 'attributes',
                width: 500,
                xtype: 'arraycolumn',
                itemId: 'attributes',
                maxLineCount: 3,
                sortable: false,
                renderer: function (value, meta, record) {
                    return value.displayName + '<' + value.id + '>';
                }
            }
        ];

        me.tbar = [
            {
                xtype: 'button',
                text: i18n.getKey('add') + i18n.getKey('group'),
                // hidden: me.data.parentId != null,
                iconCls: 'icon_add',
                handler: function () {
                    var grid = this.ownerCt.ownerCt;
                    var editOrNew = 'add';
                    controller.addProfileGroup('create', null, me.profileStore, skuAttributeStore, me.store);
                }
            }
        ];
        me.viewConfig = {
            enableTextSelection: true,
            listeners: {
                expandBody: function (rowNode, record, expandRow) {
                    controller.expandBody(rowNode, record, expandRow);
                }
            }
        };
        me.callParent(arguments);
        me.content = me;
        window.controller = controller;
    },
    getValue: function () {
        var me = this;
        var datas = [];
        me.store.data.items.forEach(function (item) {
            datas.push(item.data);
        });

        Ext.Array.each(datas, function (data) {
            var skuAttributes = [];
            Ext.Array.each(data.attributes, function (attribute) {
                skuAttributes.push(attribute.id);
            });
            //delete data.attributes;
            data.skuAttributes = skuAttributes;
        });
        return datas;
    },

    refreshData: function (data) {
        var me = this;
        me.data = data.groups;
        var store = me.store;
        store.removeAll();
        if (!Ext.isEmpty(me.data)) {
            store.add(me.data);
        }
    }

});
