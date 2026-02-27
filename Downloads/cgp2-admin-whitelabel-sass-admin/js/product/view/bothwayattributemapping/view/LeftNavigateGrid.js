/**
 * Created by nan on 2019/1/17.
 */
Ext.define('CGP.product.view.bothwayattributemapping.view.LeftNavigateGrid', {
    extend: "Ext.grid.Panel",
    region: 'west',
    header: false,
    width: '20%',
    productId: null,
    skuAttributes: null,
    collapsible: false,
    autoScroll: true,
    itemId: 'leftNavigateGrid',
    viewConfig: {
        enableTextSelection: true,
        listeners: {
            itemcontextmenu: function (view, record, item, index, e, eOpts) {
                view.ownerCt.categoryEventMenu(view, record, item, index, e, eOpts);
            }
        }
    },
    selType: 'checkboxmodel',
    rightTabPanel: null,
    categoryEventMenu: function (view, record, item, index, e, eOpts) {
        e.stopEvent();
        var me = this;
        var controller = Ext.create('CGP.product.view.bothwayattributemapping.controller.Controller');
        var menu = Ext.create('Ext.menu.Menu', {
            items: [
                {
                    text: i18n.getKey('delete') + i18n.getKey('config'),
                    itemId: 'add',
                    handler: function () {
                        controller.menuDeleteSelectedConfig(record, view.ownerCt);
                    }
                },
                {
                    text: i18n.getKey('edit') + i18n.getKey('config') + i18n.getKey('name'),
                    disabledCls: 'menu-item-display-none',
                    handler: function () {
                        controller.menuEditConfigName(record, view.ownerCt);
                    }
                }
            ]
        });
        menu.showAt(e.getXY());
    },
    initComponent: function () {
        var me = this;
        var mask = me.mask = new Ext.LoadMask(me, {
            msg: "加载中..."
        });
        Ext.apply(Ext.form.field.VTypes, {
            number: function (val, field) {
                return Ext.isNumber(parseInt(val));
            },
            numberText: '请输入正确的id',
            numberMask: /^\d$/
        });
        me.title = i18n.getKey('permission');
        var controller = Ext.create('CGP.product.view.bothwayattributemapping.controller.Controller');
        me.skuAttStore = Ext.create('CGP.product.view.bothwayattributemapping.store.ProductAttribute', {
            model: 'CGP.product.view.bothwayattributemapping.model.Attribute',
            data: me.skuAttributes,
            proxy: {
                type: 'memory'
            }
        });
        me.store = Ext.create('CGP.product.view.bothwayattributemapping.store.TwoWayProductAttributeMapping', {
            autoLoad: true,
            params: {
                filter: Ext.JSON.encode([
                    {
                        name: 'productId',
                        type: 'number',
                        value: me.productId
                    }
                ])
            }
        });
        me.bbar = Ext.create('Ext.PagingToolbar', {
            store: me.store,
            displayInfo: true,
            displayMsg: '',
            emptyMsg: i18n.getKey('noData')
        });
        me.tbar = Ext.create('Ext.ux.toolbar.Standard', {
            disabledButtons: [],
            hiddenButtons: ['config', 'import', 'export', 'clear', 'read', 'help'],
            btnCreate: {
                handler: function () {
                    controller.rightLoadData(null, me.outTab, me.skuAttributes, me.productId);
                    me.getSelectionModel().deselectAll();
                }
            },
            btnDelete: {
                handler: function (btn) {
                    var grid = me;
                    var selectedRecords = grid.getSelectionModel().getSelection();
                    if (selectedRecords.length > 0) {
                        Ext.MessageBox.confirm(i18n.getKey('prompt'), i18n.getKey('deleteConfirm'), function (select) {
                            if (select == 'yes') {
                                var mask = me.setLoading();
                                for (var i = 0; i < selectedRecords.length; i++) {
                                    var record = selectedRecords[i];
                                    controller.deleteRecord(record.get('_id'));
                                }
                                //controller.rightLoadData(null,me.outTab,me.skuAttributes,me.productId);
                                grid.store.reload();
                                me.outTab.removeAll();
                                mask.hide();
                            }
                        });
                    }
                }
            }
        });
        me.columns = [
            {
                text: i18n.getKey('id'),
                dataIndex: '_id',
                itemId: '_id'
            },
            {
                text: i18n.getKey('name'),
                dataIndex: 'description',
                itemId: 'description',
                flex: 1,
                renderer: function (value, metadata, record) {
                    metadata.tdAttr = 'data-qtip="' + value + '"';
                    return value;
                }
            }, {
                dataIndex: 'attributeMappingDomain',
                tdCls: 'vertical-middle',
                sortable: false,
                text: i18n.getKey('domain') + i18n.getKey('id'),
                renderer: function (value) {
                    return value._id;
                }
            }
//            {
//                dataIndex: 'leftSkuAttributeIds',
//                itemId: 'leftSkuAttributes',
//                tdCls: 'vertical-middle',
//                valueField: 'gridColumnsDisplayName',
//                lineNumber: 2,
//                maxLineCount: 3,
//                flex: 1,
//                text: i18n.getKey('leftSkuAttribute'),
//                renderer:function(value, metadata, record){
//                    return me.showAttributeName(value);
//                }
//            },
//            {
//                text: i18n.getKey('rightSkuAttribute'),
//                dataIndex: 'rightSkuAttributeIds',
//                itemId: 'right',
//                tdCls: 'vertical-middle',
//                valueField: 'gridColumnsDisplayName',
//                lineNumber: 2,
//                maxLineCount: 3,
//                flex: 1,
//                renderer:function(value, metadata, record){
//                    return me.showAttributeName(value);
//                }
//            }
        ];
        me.listeners = {
            itemclick: function (view, record, item, index, e, eOpts) {
                controller.rightLoadData(record.getData(), me.outTab, me.skuAttributes, me.productId);
            }
        };
        me.callParent(arguments);
        me.on('afterrender', function () {
            var page = this;
            var productId = page.productId;
            var isLock = JSCheckProductIsLock(productId);
            if (isLock) {
                JSLockConfig(page);
            }
        });
    },
    showAttributeName: function (value) {
        var me = this;
        var attributeNames = value.map(function (item) {
            var result = '', itemAtt = me.skuAttStore.findRecord('id', Ext.Number.from(item));
            if (itemAtt) {
                result = itemAtt.get('attributeName');
            }
            return result
        });
        //return JSON.stringify(attributeNames);
        return attributeNames.join('\n');
    }
})
