Ext.define("Order.status.view.productmaterialbomgrid.BomTree",{
    extend: 'Ext.window.Window',
    modal: true,
    layout: 'fit',
    initComponent: function(){
        var me = this;
        me.title = i18n.getKey('check')+i18n.getKey('materialPath');
        var store = Ext.create('CGP.product.view.productconfig.productdesignconfig.store.BomTree',{
            root: me.root
        });
        store.on('load', function (store,node,records) {
            Ext.Array.each(records,function(item){
                var type = item.get('type');
                if (type == 'MaterialType') {
                    item.set('icon', '../../ClientLibs/extjs/resources/themes/images/material/T.png');
                } else if(type == 'MaterialSpu'){
                    item.set('icon', '../../ClientLibs/extjs/resources/themes/images/material/S.png');
                }else{
                    item.set('icon', '../../ClientLibs/extjs/resources/themes/images/material/B.png');
                }
            });
            Ext.each(records,function(item){
                if('root'!=item.data._id){
                    item.setId(item.data.parentId+'-'+item.data._id);
                    item.commit();
                }
            });
        });
        var bomTree = Ext.create('Ext.tree.Panel',{
            width: 450,
            height: 400,
            store: store,
            collapsible: true,
            header: false,
            useArrows: true,
            config: {
                rootVisible: true,
                viewConfig: {
                    stripeRows: true
                }
            },
            autoScroll: true,
            children: null,
            itemId: 'bomTree',
            selModel: {
                selType: 'rowmodel'
            },
            listeners: {
                beforeload: function(sto,operation,e){
                    var type = operation.node.get('type');
                    var clazz;
                    if(operation.node.raw){
                        clazz = operation.node.raw.clazz;
                    }
                    var parentNode = operation.node.parentNode;
                    if(Ext.isEmpty(type) && !operation.node.isRoot()){
                        var idRealArray = parentNode.get('_id').split('-');
                        var realId = idRealArray[idRealArray.length-1];
                        sto.proxy.url = adminPath + 'api/materials/bomTree/{id}/children?type=bomitem&materialId='+realId;
                        delete sto.proxy.extraParams;
                    }else{
                        /*sto.proxy.extraParams = {
                         type: 'material'
                         };*/
                        sto.proxy.url = adminPath + 'api/materials/bomTree/{id}/children?type=material';
                    }
                },
                afterrender: function(comp){
                    if(!Ext.isEmpty(me.materialPath)){
                        var pathArr = me.materialPath.split(',');
                        var path = '';
                        Ext.Array.each(pathArr,function(item){
                            path += '/'+item;
                        });
                        comp.expandPath(path,'pathID','/',function callback(){
                            comp.selectPath(path,'pathID');
                        });
                    }
                }
            },
            columns: [
                {
                    xtype: 'treecolumn',
                    text: i18n.getKey('name'),
                    width: 350,
                    dataIndex: 'name',
                    //locked: true,
                    renderer: function (value, metadata, record) {
                        var id = record.get('_id').split('-').pop();
                        if(Ext.isEmpty(record.get('type')) && !record.isRoot()){
                            if(record.get('clazz') == 'com.qpp.cgp.domain.bom.bomitem.FixedBOMItem'){
                                return record.get("name")+'('+i18n.getKey('FixedBOMItem')+')'+'<'+id+'>';
                            }else if(record.get('clazz') == 'com.qpp.cgp.domain.bom.bomitem.OptionalBOMItem'){
                                return record.get("name")+'('+i18n.getKey('OptionalBomItem')+')'+'<'+id+'>';
                            }else if(record.get('clazz') == 'com.qpp.cgp.domain.bom.bomitem.UnassignBOMItem'){
                                return record.get("name")+'('+i18n.getKey('UnassignBOMItem')+')'+'<'+id+'>';
                            }
                        }else if(!Ext.isEmpty(record.get('type')) || record.isRoot()){
                            return record.get("name")+'<'+id+'>';
                        }
                    }
                }
            ]
        });
        me.items = [bomTree];
        /*me.bbar = ['->',{
            xtype: 'button',
            text: i18n.getKey('confirm'),
            handler: function(){
                var selectNode = me.getComponent('bomTree').getSelectionModel().getSelection()[0];
                if(!Ext.isEmpty(selectNode)){
                    if(selectNode.get('type') == 'MaterialType' || selectNode.get('type') == 'MaterialSpu'){
                        var valueArr = selectNode.getPath('pathID').split("/");
                        valueArr.splice(0,1);
                        var value = valueArr.join(',');
                        Ext.getCmp('materialPath').setValue(value);
                        me.close();
                    }else{
                        Ext.Msg.alert('提示','请选择一个物料');
                    }
                }else{
                    Ext.Msg.alert('提示','请选择一个物料');
                }
            }
        },{
            xtype: 'button',
            text: i18n.getKey('cancel'),
            handler: function(){
                me.close();
            }
        }];*/
        me.callParent(arguments);
    }
});