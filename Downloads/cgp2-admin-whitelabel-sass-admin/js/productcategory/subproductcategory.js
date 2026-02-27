Ext.onReady(function () {

    var isMain = false;

    
    var toolbar = Ext.widget({
        xtype: 'toolbar',
        dock: 'top',
        items: [{
            id: 'website',
            xtype: 'combo',
            labelWidth: 100,
            fieldLabel: i18n.getKey('selectWebsite'),
            displayField: 'name',
            valueField: 'id',
            labelAlign: 'left',
            store: websiteStore,
            value: defaultWebsite
            }]
    });

    controller('infoPanel', 'tree', store, 'website', isMain, window);

    store.on('beforeload', function (me, operation) {
        var params = Ext.merge(operation.params, {
            website: defaultWebsite.get('id'),
            isMain: isMain
        })

        operation.pararms = params;
        return true;
    }, this, {
        single: true
    })

  

    infoPanel = Ext.create('Ext.tab.Panel', {
        id: 'infoPanel',
        region: 'center',
        tbar: Ext.create('Ext.toolbar.Toolbar', {
            hidden: true,
            items: [{
                itemId: 'btnSave',
                text: i18n.getKey('Save'),
                iconCls: 'icon_save',
                handler: controller.save
  }]
        }),
        items: []
    });

    Ext.QuickTips.init();
    var tree = Ext.create('Ext.tree.Panel', {
        id: 'tree',
        width: 400,
        useArrows: true,
        rootVisible: false,
        store: Ext.data.StoreManager.lookup('productCategoryStore'),
        autoScroll: true,
        columns: [{
            xtype: 'treecolumn',
            text: i18n.getKey('name'),
            width: 400,
            sortable: true,
            dataIndex: 'name',
            locked: true,
            editor: {
                xtype: 'textfield'
            }
  }],
        viewConfig: {
            stripeRows: true,
            plugins: {
                ptype: 'treeviewdragdrop',
                enableDrag: true,
                enableDrop: true
            },
            listeners: {
                'itemcontextmenu': controller.onItemRightClick,
                nodedragover: function (targetNode, position, dragData, e,
                    eOpts) {
                    targetNode.set('leaf', false);
                    return true;
                }
            }
        },
        selModel: {
            selType: 'cellmodel'
        },
        tbar: [{
            text: i18n.getKey('addSubCategory'),
            iconCls: 'icon_add',
            handler: controller.onAddParentNode
        }],
        dockedItems: [toolbar],
        listeners: {
            'itemclick': controller.onItemClick
        }
    });
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'border',
        items: [Ext.create('Ext.panel.Panel', {
            region: 'west',
            width: 400,
            autoScroll: true,
            // collapsible : true,
            items: [tree]
        }), infoPanel]
    });

    var combo = Ext.getCmp('website');
    store.relayEvents(Ext.getCmp('website'), ['select'], 'combo');
    store.on('comboselect', function (combo, record) {
        var selection;
        var selModel = tree.getSelectionModel();
        //需要将Selection设为undenfied 才能正常刷新页面
        var selected = selModel.select(selection);
        store.load({
            params: {
                website: record[0].get('id'),
                isMain: isMain
            }
        });
    })
});