/**
 * Created by nan on 2018/5/21.
 */
Ext.syncRequire(['CGP.userdesigncategory.controller.Controller', 'CGP.userdesigncategory.store.UserDesignCategoryStore'])
Ext.define('CGP.userdesigncategory.view.CategoryListNavigator', {
    extend: "Ext.grid.Panel",
    itemId: 'CategoryListNavigator',
    region: 'west',
    autoScroll: true,
    width: 280,
    /*  collapsible: true,
     config: {
     rootVisible: false,
     useArrows: true,
     viewConfig: {
     stripeRows: true
     }
     },*/
    viewConfig: {
        enableTextSelection: true
    },
    autoScroll: true,
    /*
     children: null,
     */
    selModel: {
        selType: 'rowmodel'
    },
    initComponent: function () {
        var me = this;
        me.title = i18n.getKey('userDesignCategory');
        var controller = Ext.create('CGP.userdesigncategory.controller.Controller');
        var store = Ext.create('CGP.userdesigncategory.store.UserDesignCategoryStore');
        me.store = store;
        me.tbar = [
            {
                xtype: 'button',
                text: i18n.getKey('add') + i18n.getKey('category'),
                iconCls: 'icon_create',
                //hidden:
                handler: function () {
                    controller.addNewCategory(me);
                }
            },
            {
                xtype: 'button',
                text: i18n.getKey('refresh'),
                iconCls: 'icon_reset',
                handler: function (button) {
                    me.store.load(function (store) {
                        me.getSelectionModel().deselectAll();
                    });
                    var UserDesignDispalyPanel = button.ownerCt.ownerCt.ownerCt.getComponent('UserDesignDispalyPanel');
                    UserDesignDispalyPanel.grid.hide();
                    UserDesignDispalyPanel.setTitle(i18n.getKey('userDesign'))
                }
            },
            '->',
            {
                xtype: 'trigger',
                width: 100,
                trigger1Cls: 'x-form-search-trigger',
                checkChangeBuffer: 600,
                listeners: {
                    change: function (view, newValue, oldValue) {
                        me.store.proxy.extraParams = {
                            filter: '[{"name":"name","value":"%' + newValue + '%","type":"string"}]'
                        }
                        me.store.load();
                    }
                }
            }
        ];
        me.bbar = Ext.create('Ext.PagingToolbar', {
            store: me.store,
            displayInfo: false, // 是否显示，分页信息
            emptyMsg: i18n.getKey('noData')
        });
        me.columns = [
            {
                text: i18n.getKey('name'),
                flex: 1,
                dataIndex: 'name',
                renderer: function (value, metadata, record) {
                    return '<div style="padding-left: 20px"><img style="vertical-align: middle;margin-right: 5px" src="../../partials/material/category.png">' + record.get("name") + '</div>';
                }
            }
        ];
        me.listeners = {
            select: function (rowModel, record, index, eOpts) {
                var categoryId = record.get('_id');
                var categoryName = record.get('name');
                var UserDesignDispalyPanel = rowModel.view.ownerCt.ownerCt.getComponent('UserDesignDispalyPanel');
                var CategoryListNavigator = rowModel.view.ownerCt.ownerCt.getComponent('CategoryListNavigator');
                UserDesignDispalyPanel.refreshData(categoryId, categoryName)
            },
            itemcontextmenu: function (view, record, item, index, e, eOpts) {
                controller.categoryEventMenu(view, record, e);
            }
        };
        me.callParent(arguments);

    }
})