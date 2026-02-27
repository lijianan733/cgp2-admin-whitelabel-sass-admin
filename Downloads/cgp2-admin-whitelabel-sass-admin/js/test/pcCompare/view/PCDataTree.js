Ext.define("CGP.test.pcCompare.view.PCDataTree", {
    extend: "Ext.tree.Panel",
    autoScroll: true,
    title: i18n.getKey('pc图层数据'),
    itemId: 'PCDataTree',
    //split: true,
    //test1 test2 test3 test4
    //collapsible: true,
    rootVisible: false,
    initComponent: function () {
        var me = this;
        me.controller = Ext.create('CGP.test.pcCompare.controller.Controller');
        me.store = Ext.create('CGP.test.pcCompare.store.PcDataStore', {
            root: {'text': ''}
        });
        me.listeners = {
            checkchange: function (node, checked) {
                me.setChildChecked(node, checked);
                me.setParentChecked(node, checked);
                var pcCompareBuilder = me.ownerCt.ownerCt.getComponent('pcCompareBuilder');
                var pictures;
                if(me.compareType != 'cacheImageCompare'){
                    me.comparePicture = me.ownerCt.getComponent('pictureViewPanel').getValue().data;
                }
                var pcData = me.getChecked();
                var pageContent = me.getValue();
                if(!Ext.isEmpty(pcData) && pcCompareBuilder.state == 'initial'){
                    me.controller.updateBuilderPcData(pageContent,me.comparePicture,me.compareType);
                    pcCompareBuilder.refreshData();
                }else if(!Ext.isEmpty(pcData) && pcCompareBuilder.state == 'release'){

                }
            }
        };
        me.columns = [
            {
                xtype: 'treecolumn',
                text: i18n.getKey('name'),
                width: 350,
                dataIndex: 'text'
            }
        ];
        me.callParent(arguments);
    },
    refreshData: function (pageContent,haveCachePicture,comparePicture) {
        var me = this;
        me.pageContent = pageContent;
        me.originalLayers = Ext.Array.clone(me.pageContent.layers);
        me.haveCachePicture = haveCachePicture;
        me.comparePicture = comparePicture;
        var rootNode = me.controller.buildPCDataTree(me.pageContent);
        var pcCompareBuilder = me.ownerCt.ownerCt.getComponent('pcCompareBuilder');
        me.store.setRootNode(rootNode);
        me.controller.updateBuilderPcData(me.pageContent,me.comparePicture,'cacheImageCompare');
        pcCompareBuilder.refreshData();

    },
    getValue: function () {
        var me = this;
        var allCheckeds = me.getChecked();
        var resultLayers = [];
        var originalLayers = me.originalLayers;
        Ext.Array.each(originalLayers, function (originalLayer) {
            var resultLayer = {};
            Ext.Array.each(allCheckeds, function (checked) {
                var checkedId = checked.data.id;

                if (originalLayer.id == checkedId) {
                    var resultLayerItems = [];
                    Ext.Array.each(allCheckeds, function (checked) {
                        var checkedId = checked.data.id;
                        Ext.Array.each(originalLayer.items, function (originalLayerItem) {
                            if (originalLayerItem.id == checkedId) {
                                resultLayerItems.push(originalLayerItem);
                            }
                        });
                    });
                    resultLayer = JSON.parse(JSON.stringify(originalLayer));
                    resultLayer.items = resultLayerItems;
                    resultLayers.push(resultLayer);
                }

            })
        });
        if(!Ext.Object.isEmpty(me.pageContent)){
            me.pageContent.layers = resultLayers;
        }
        return me.pageContent;
    },
    setChildChecked: function (node, checked) {
        var me = this;
        node.expand();
        node.set({checked: checked});
        if (node.hasChildNodes()) {
            node.eachChild(function (child) {
                me.setChildChecked(child, checked);
            });
        }
    },
//选中父节点
    setParentChecked: function (node, checked) {
        var me = this;
        node.set({checked: checked});
        var parentNode = node.parentNode;
        if (parentNode != null) {
            var flag = false;
            parentNode.eachChild(function (child) {
                if (child.data.checked == true) {
                    flag = true;
                }
            });
            if (checked == false) {
                if (!flag) {
                    me.setParentChecked(parentNode, checked);
                }
            } else {
                if (flag) {
                    me.setParentChecked(parentNode, checked);
                }
            }
        }
    }

});