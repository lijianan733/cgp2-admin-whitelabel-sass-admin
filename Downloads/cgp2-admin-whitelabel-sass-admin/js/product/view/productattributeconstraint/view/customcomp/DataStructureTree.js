Ext.define("CGP.product.view.productattributeconstraint.view.customcomp.DataStructureTree", {
    extend: "Ext.tree.Panel",
    width: 350,
    collapsible: true,
    header: false,
    config: {
        rootVisible: false,
        useArrows: true,
        viewConfig: {
            stripeRows: true
        }
    },
    autoScroll: true,
    itemId: 'dataStructureTree',
    selModel: {
        selType: 'rowmodel'
    },

    initComponent: function () {
        var me = this;
        var root = {id: 0,name:'root',optionId: 'root',children: []};
        me.createTreeData(0,root,me.attributeArray);
        me.store = Ext.create('CGP.product.view.productattributeconstraint.store.DataStructureStore',{
            root: root
        });
        me.tbar = [
            {
                text: i18n.getKey('reset'),
                iconCls: 'icon_reset',
                handler:function(){
                    var rootNode = {id: 0,name:'root',optionId: 'root',children: []};
                    me.createTreeData(0,rootNode,me.attributeArray);
                    me.store.setRootNode(rootNode);
                    me.expandAll();
                    //me.collapseAll();
                }

            },{
                text: i18n.getKey('collapseAll'),
                iconCls: 'icon_collapse',
                handler:function(btn){
                    if(btn.iconCls == 'icon_collapse'){
                        me.collapseAll();
                        btn.setText(i18n.getKey('expandAll'));
                        btn.setIconCls('icon_expand');
                    }else{
                        me.expandAll();
                        btn.setText(i18n.getKey('collapseAll'));
                        btn.setIconCls('icon_collapse');
                    }
                }
            },{
                name: 'exclude',
                xtype: 'checkbox',
                labelWidth: 50,
                fieldLabel: i18n.getKey('exclude'),
                itemId: 'exclude'
            },'->',{
                xtype: 'textfield',
                name: 'optionId',
                labelWidth: 50,
                emptyText: '/root/123456/123567',
                fieldLabel: i18n.getKey('options'),
                itemId: 'optionId'
            },{
                xtype: 'button',
                text: i18n.getKey('query'),
                handler: function(){
                    var optionPath = this.ownerCt.getComponent('optionId').getValue();
                    me.selectPath(optionPath,'optionId');
                }
            }
        ];
        var controller = Ext.create('CGP.product.view.productattributeconstraint.controller.Controller');
        me.columns = [
            {
                xtype: 'actioncolumn',
                itemId: 'actioncolumn',
                width: 30,
                sortable: false,
                resizable: false,
                menuDisabled: true,
                items: [
                    {
                        iconCls: 'icon_remove icon_margin',
                        itemId: 'actiondelete',
                        tooltip: i18n.getKey('remove'),
                        handler: function (view, rowIndex, colIndex, a, b, record) {
                            var store = view.getStore();
                            if(record.parentNode.childNodes.length == 1){
                                Ext.Msg.alert('提示','删除此节点将不能构成完整的结构组合！');
                            }else{
                                record.remove();
                                store.load();
                            }
                        }
                    }
                ]
            },
            {
                xtype: 'treecolumn',
                text: i18n.getKey('attribute'),
                width: 350,
                dataIndex: 'attributeId',
                //locked: true,
                renderer: function (value, metadata, record) {
                    return record.get('attributeName')+'（'+value+'）';
                }
            },
            {
                text: i18n.getKey('options'),
                width: 350,
                dataIndex: 'optionId',
                renderer: function (value, metadata, record) {
                    return record.get('optionName')+'（'+value+'）';
                }

            }
        ];
        me.listeners = {
            afterrender:function(){
                me.expandAll();
                //me.collapseAll();
            }
        };

        me.callParent(arguments);

    },
    createTreeData: function (n, parent,attributeObj) {
        var me= this;
        Ext.Array.each(attributeObj[n].attribute.options, function (item, index) {
            var child = {
                attributeId: attributeObj[n].id,
                attributeName: attributeObj[n].displayName,
                optionId: item.id,
                optionName: item.name,
                leaf: true

            };
            parent.children.push(child);
            if (n < attributeObj.length - 1) {
                child.children = [];
                child.leaf = false;
                me.createTreeData(n + 1, child,attributeObj)
            }
        });

    }
});
