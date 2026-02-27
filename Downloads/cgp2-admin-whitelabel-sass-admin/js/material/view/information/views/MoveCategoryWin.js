Ext.define('CGP.material.view.information.views.MoveCategoryWin',{
    extend: 'Ext.window.Window',
    layout: 'fit',
    itemId: 'moveToCategoryTree',

    initComponent: function(){
        var me = this;
        me.title = i18n.getKey('check')+ i18n.getKey('catalog');
        var controller = Ext.create('CGP.material.controller.Controller');
        var store = Ext.create('CGP.material.store.MaterialCategory');
        me.items = [Ext.create('Ext.tree.Panel',{
            width: 450,
            height: 600,
            rootVisible: false,
            selModel: {
                selType: 'rowmodel'
            },
            header: false,
            listeners: {
                afterrender: function(comp){
                    comp.expandAll();
                },
                select: function(){
                    var conformButton = me.down('toolbar').getComponent('confirm');
                    conformButton.setDisabled(false);
                }
            },
            autoScroll: true,
            store: store,
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
                }
            ]
        })];
        me.bbar = ['->',{
            xtype: 'button',
            text: i18n.getKey('confirm'),
            disabled: true,
            itemId: 'confirm',
            handler: function(){
                var treePanel = me.down('treepanel');
                var targetNodeId = treePanel.getSelectionModel().getSelection()[0].getId();
                var moveNode = me.tree.getSelectionModel().getSelection()[0];

                controller.moveCategory(targetNodeId,me.tree,moveNode,me);

            }
        },{
            xtype: 'button',
            text:i18n.getKey('cancel'),
            handler:function(){
                me.win.close();
            }
        }];
        me.callParent(arguments);
        store.on('load',function(store,node,records){
            var moveTreePanel = me.down('treepanel');
            var selected = me.tree.getSelectionModel().getSelection()[0];
            var categoryId = selected.getId();
            var needMovedNode = moveTreePanel.getStore().getNodeById(categoryId);
            Ext.Array.each(records,function(item){
                item.set('icon', '../material/category.png');
            });
            if (needMovedNode) {
                //如果它的父节点只有一个子节点 也不显示
                var parentNode = needMovedNode.parentNode;
                if (parentNode.childNodes.length == 1) {
                    needMovedNode = needMovedNode.parentNode;

                }
                needMovedNode.remove();

                me.on('hide', function () {
                        parentNode.insertChild(0, needMovedNode);
                    },
                    me, {
                        single: true
                    });

            }

        });
    }
});