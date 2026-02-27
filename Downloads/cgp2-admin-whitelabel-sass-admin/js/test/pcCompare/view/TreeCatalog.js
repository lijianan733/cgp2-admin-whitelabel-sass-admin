Ext.define("CGP.test.pcCompare.view.TreeCatalog", {
    extend: "Ext.panel.Panel",
    id: 'Catalog_panel',
    collapsible: true,
    autoScroll: true,
    title: i18n.getKey('pc目录'),
    region: 'west',
    //fill: false,
    layout: {
        type: 'accordion'/*,
        fill: false*/
    },
    animCollapse: true,
    //split: true,
    //collapseDirection: Ext.Component.DIRECTION_LEFT,
    width: '10%',
    minWidth: 230,
    //split: true,
    collapsible: true,
    initComponent: function(){
        var me = this;
        var controller = Ext.create('CGP.test.pcCompare.controller.Controller');
        var results = controller.getPcCatalogs(me.productInstance,me.compareType,me.mainPage);
        var trees = [];
        for (var i = 0; i < results.length; i++) {
            var text = results[i].text;
            var title = i18n.getKey(text) || text;
            var tree = Ext.create('Ext.tree.Panel', {
                id: 'mainPage_' + i,
                title: results[i].text,
                collapsible: true,
                store: Ext.create('CGP.test.pcCompare.store.PcCatalogStore', {
                    root: results[i]
                }),
                columns: [{
                    dataIndex: 'text',
                    flex: 1,
                    height: 0,
                    //header: false,
                    sortable: true,
                    renderer: function (value, metadata, record) {
                        if(!Ext.isEmpty(record.get('materialViewName'))){
                            value += '('+record.get('materialViewName')+')'
                        }
                        if(me.compareType == 'cacheImageCompare'){
                            if(record.get('haveCachePicture')){
                                value += '(' + '<font color=green>' + "有对比图层" + '</font>' +')';
                            }else{
                                value += '(' + '<font color=red>' + "无对比图层" + '</font>' +')';
                            }
                        }
                        return value;
                    }

                }],
                rootVisible: false,
                listeners: {
                    'select': me.onTreeItemClick/*,
                    afterrender: function (comp) {
                        var defaultSelectNode = comp.getRootNode().childNodes[0];
                        if(!comp.collapsed){
                            comp.getSelectionModel().select(defaultSelectNode);
                        }
                    }*/
                }
            });
            //tree.expand();
            // tree.expandAll();
            trees.push(tree);
            //trees[3].expand();
        }
        me.items= trees;
        me.listeners={
            select: me.onTreeItemClick
        };
        me.callParent(arguments);
        console.log(me);
    },
    onTreeItemClick: function (tree, record, item, index, e, opts) {
        var cachePicturePcPanel = tree.view.ownerCt.ownerCt.ownerCt.getComponent('cachePicturePcPanel');
        cachePicturePcPanel.refreshData(record.get('pageContent'),tree.view.ownerCt.ownerCt.productInstance,record.get('haveCachePicture'),record.get('comparePicture'));
    }
})