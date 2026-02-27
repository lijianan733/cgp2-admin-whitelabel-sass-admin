Ext.onReady(function () {
    var skuAttributeStore = Ext.create('CGP.product.view.productattributeconstraintv2.store.SkuAttribute', {
        configurableId: 155723
    });
    var attributeArray = [];
    var skuIds = [188906,189428,189873]
    skuAttributeStore.load(function(){
        Ext.Array.each(skuIds, function (skuAttributeId) {
            var record = skuAttributeStore.findRecord('id', skuAttributeId);
            attributeArray.push(record.get('attribute'));
        });
    });

    var panel = Ext.create("CGP.product.view.productattributeconstraintv2.view.customcomp.DataStructureTree", {
        region: 'center',
        attributeArray: attributeArray,
        title: 'center'
    });
    var treeStore = Ext.create('CGP.test.pagingtreestore.TreeStore',{
        website: 11,
        isMain: true
    });
    var treePanel = Ext.create("Ext.tree.Panel", {
        region: 'west',
        width: 350,
        title: 'tree',
        store: treeStore,
        rootVisible: false,
        config: {
            useArrows: true,
            viewConfig: {
                stripeRows: true
            }
        },
        autoScroll: true,
        children: null,
        selModel: {
            selType: 'rowmodel'
        },
        bbar:{
            xtype : 'pagingtoolbar',
            listeners:{
                render:function(t){
                    var grid=t.up('grid')?t.up('grid'):t.up('treepanel')
                    t.bind(grid.store)
                    grid.store.load()
                }
            }
        },
        /*bbar: [{
            xtype: 'pagingtoolbar',
            store: treeStore,
            //displayInfo : true,  是否显示，分页信息
            //displayMsg : 'Displaying {0} - {1} of {2}', //显示的分页信息
            emptyMsg: i18n.getKey('noData')
        }],*/
        columns: [
            {
                xtype: 'treecolumn',
                text: i18n.getKey('name'),
                flex: 3,
                dataIndex: 'name',
                //locked: true,
                renderer: function (value, metadata, record) {
                    return record.get("name");
                }
            },{
                dataIndex: 'sortOrder',
                flex: 1,
                text: i18n.getKey('sortOrder')
            }
        ]
    });
    Ext.create("Ext.container.Viewport", {
        title: "test",
        layout: "border",
        defaults: {
            split: true,
            hideCollapseTool: true
        },
        items: [ treePanel,panel]
    })
})