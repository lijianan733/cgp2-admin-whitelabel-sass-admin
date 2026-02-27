Ext.define('CGP.product.view.productconfig.productdesignconfig.view.EditPageContentSchemaGroup',{
    extend: 'Ext.window.Window',
    modal: true,
    layout: 'fit',
    initComponent: function(){
        var me = this;

        me.title = i18n.getKey(me.editOrNew) + i18n.getKey('productMaterialViewType');
        var store = Ext.create('CGP.product.view.productconfig.productdesignconfig.store.PageContentSchemaGroup');
        var form = {
            xtype: 'form',
            border: false,
            padding: '10 10 0 10',
            header: false,
            items: [{
                xtype: 'textfield',
                itemId: 'clazz',
                value: 'com.qpp.cgp.domain.bom.PageContentSchemaGroup',
                name: 'clazz',
                hidden: true
            },{
                name: 'rtType',
                xtype: 'treecombo',
                fieldLabel: i18n.getKey('rtType'),
                itemId: 'rtType',
                store: Ext.create('CGP.material.store.RtType'),
                displayField: 'name',
                valueField: '_id',
                editable: false,
                value: Ext.isEmpty(me.record) ? '' : me.record.get('rtType')['_id'],
                rootVisible: false,
                selectChildren: false,
                canSelectFolders: true,
                width: 380,
                multiselect: false,
                listeners: {
                    //展开时显示选中状态
                    expand: function (field) {
                        var recursiveRecords = [];

                        function recursivePush(node, setIds) {
                            addRecRecord(node);
                            node.eachChild(function (nodesingle) {
                                if (nodesingle.hasChildNodes() == true) {
                                    recursivePush(nodesingle, setIds);
                                } else {
                                    addRecRecord(nodesingle);
                                }
                            });
                        }
                        function addRecRecord(record) {
                            for (var i = 0, j = recursiveRecords.length; i < j; i++) {
                                var item = recursiveRecords[i];
                                if (item) {
                                    if (item.getId() == record.getId()) return;
                                }
                            }
                            if (record.getId() <= 0) return;
                            recursiveRecords.push(record);
                        }
                        var node = field.tree.getRootNode();
                        recursivePush(node, false);
                        Ext.each(recursiveRecords, function (record) {
                            var id = record.get(field.valueField);
                            if (field.getValue() == id && !Ext.isEmpty(field.getValue())) {
                                field.tree.getSelectionModel().select(record);
                            }
                        });
                    },
                    afterrender: function (comp) {
                        comp.tree.expandAll();
                    }
                }
            },{
                xtype: 'numberfield',
                name: 'productConfigDesignId',
                value: me.productConfigDesignId,
                itemId: 'productConfigDesignId',
                hidden: true
            }]
        };
        me.items= [form];
        me.bbar = ['->',{
            xtype: 'button',
            text: i18n.getKey('confirm'),
            handler: function(){
                var form = this.ownerCt.ownerCt.down('form');
                var data = {};
                if(form.isValid()){
                    Ext.Array.each(form.items.items,function(item){
                        if(item.name != 'fieldcontainer'){
                            data[item.name] = item.getValue();
                        }
                    });
                    data.rtType = {
                        _id: data.rtType,
                        idReference: 'RtType',
                        clazz: domainObj.RtType
                    };
                    if(Ext.isEmpty(me.record)){
                        me.controller.addPageContentSchemaGroup(data,me.store,me)
                    }else{
                        data = me.record.data;
                        var rtTypeId = form.getComponent('rtType').getValue();
                        data.rtType = {
                            _id: rtTypeId,
                            idReference: 'RtType',
                            clazz: domainObj.RtType
                        };
                        me.controller.updatePageContentSchemaGroup(data,me.store,me)
                    }
                }
            }
        },{
            xtype: 'button',
            text: i18n.getKey('cancel'),
            handler: function(){
                me.close();
            }
        }];
        me.callParent(arguments);
    }
});