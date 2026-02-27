/**
 * Created by nan on 2019/1/17.
 */
Ext.define('CGP.product.view.bothwayattributepropertyrelevanceconfig.view.LeftNavigateGrid', {
    extend: "Ext.grid.Panel",
    region: 'west',
    header: false,
    width: '20%',
    productId: null,
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
        var menu = Ext.create('Ext.menu.Menu', {
            items: [
                {
                    text: i18n.getKey('delete') + i18n.getKey('config'),
                    itemId: 'add',
                    handler: function () {
                        var controller = Ext.create('CGP.product.view.bothwayattributepropertyrelevanceconfig.controller.Controller');
                        controller.menuDeleteSelectedConfig(record, view.ownerCt);
                    }
                },
                {
                    text: i18n.getKey('edit') + i18n.getKey('config') + i18n.getKey('name'),
                    disabledCls: 'menu-item-display-none',
                    handler: function () {
                        var controller = Ext.create('CGP.product.view.bothwayattributepropertyrelevanceconfig.controller.Controller');
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
        var controller = Ext.create('CGP.product.view.bothwayattributepropertyrelevanceconfig.controller.Controller');
        me.store = Ext.create('CGP.product.view.bothwayattributepropertyrelevanceconfig.store.BothwayAttributePropertyRelevanceConfigStore', {
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
        me.tbar = [
            {
                xtype: 'button',
                flex: 2,
                text: i18n.getKey('add'),
                iconCls: 'icon_create',
                handler: function (btn) {
                    var win = Ext.create('CGP.product.view.bothwayattributepropertyrelevanceconfig.view.CreateNewConfigWindow', {
                        leftNavigateGrid: me
                    });
                    win.show();
                }
            },
            {
                xtype: 'button',
                flex: 2,
                text: i18n.getKey('delete'),
                iconCls: 'icon_delete',
                handler: function () {
                    controller.deleteSelectedConfig(me);
                }
            }
        ]
        me.columns = [
            {
                text: i18n.getKey('name'),
                flex: 1,
                dataIndex: 'name',
                renderer: function (value, metadata, record) {
                    metadata.tdAttr = 'data-qtip="' + value + '"';
                    return value + '(' + record.getId() + ')';
                }
            }
        ];
        me.listeners = {
            select: function (rowModel, record, index, eOpts) {
                me.rightTabPanel.show();
                var itemsGrid = me.rightTabPanel.getComponent('itemsGrid');
                var editItemTabPanel = me.rightTabPanel.getComponent('editItemTabPanel');
                me.rightTabPanel.remove(editItemTabPanel);
                controller.rightItemGridLoadData(record, itemsGrid);
            }
        }
        me.callParent(arguments);

    }
})
