/**
 * Created by admin on 2019/9/21.
 */
Ext.define('CGP.redodetails.view.redomaterial',{
    extend: "Ext.tree.Panel",
    mixins: {
        Filter: 'CGP.material.override.Filter'
    },
    requires: [
        'Ext.selection.CellModel'
    ],
    title:i18n.getKey('redo')+i18n.getKey('monitor')+i18n.getKey('view'),
    bomName: '销售物料结构',
    itemId: 'redomaterial',
    header: false,
    layout: 'fit',
    region: 'center',
    config: {
        rootVisible: true,
        useArrows: true,
        viewConfig: {
            stripeRows: true
        }
    },
    collapsible: true,
    autoScroll: true,
    children: null,
    selModel: {
        selType: 'rowmodel'
    },

    initComponent: function () {
        var me = this;
//        var controller = Ext.create('CGP.orderredo.view.redomaterial.Controller');
//        var name = me.getQueryString('materialName');
//        var id = me.getQueryString('materialId');
//        var type = me.getQueryString('type');
        var name = me.record.get('productInstance').material.name;
        var id = me.record.get('productInstance').material._id;
        var type = 'MaterialSpu';
        var store = Ext.create('CGP.material.store.BomTree', {
            root: {
                _id: id,
                name: name,
                type: type,
                originalqty:1,
                icon: type == 'MaterialSpu' ? '../material/S.png' : '../material/T.png'
            }/*,
             params: {
             type: 'material'
             }*/
        });
        me.store = store;
        //me.store.filter('type', 'MaterialSpu', true, false);
        me.tbar = [
            {
                xtype: 'button',
                text: i18n.getKey('collapseAll'),
                iconCls: 'icon_collapseAll',
                count: 0,
                handler: function (btn) {
                    var treepanel = btn.ownerCt.ownerCt;
                    if (btn.count % 2 == 0) {
                        treepanel.collapseAll();
                        btn.setText(i18n.getKey('expandAll'));
                        btn.setIconCls('icon_expandAll');
                    } else {
                        treepanel.expandAll();
                        btn.setText(i18n.getKey('collapseAll'));
                        btn.setIconCls('icon_collapseAll');

                    }
                    btn.count++;
                }
            }
        ];
        me.columns = [
            {
                xtype: 'treecolumn',
                text: i18n.getKey('name'),
                width: 350,
                dataIndex: 'name',
                //locked: true,
                renderer: function (value, metadata, record) {
                    var id = record.get('_id').split('-').pop();
                    if (Ext.isEmpty(record.get('type')) && !record.isRoot()) {
                        if (record.get('clazz') == 'com.qpp.cgp.domain.bom.bomitem.FixedBOMItem') {
                            return record.get("name") + '(' + i18n.getKey('FixedBOMItem') + ')' + '<' + id + '>';
                        } else if (record.get('clazz') == 'com.qpp.cgp.domain.bom.bomitem.OptionalBOMItem') {
                            return record.get("name") + '(' + i18n.getKey('OptionalBomItem') + ')' + '<' + id + '>';
                        } else if (record.get('clazz') == 'com.qpp.cgp.domain.bom.bomitem.UnassignBOMItem') {
                            return record.get("name") + '(' + i18n.getKey('UnassignBOMItem') + ')' + '<' + id + '>';
                        }
                    } else if (!Ext.isEmpty(record.get('type')) || record.isRoot()) {
                        return record.get("name") + '<' + id + '>';
                    }
                }
            },
            {
                xtype:'componentcolumn',
                text: i18n.getKey('redo')+i18n.getKey('qty'),
                width: 100,
                dataIndex: 'redoQty',
                renderer: function (value, metadata, record,view) {
                    var recordChecked=record.get('checked'), type = record.get('type');
                    if(!record.isRoot()&&(type == 'MaterialSpu')){
                        return {
                            id:record.getId(),
                            xtype: 'numberfield',
                            msgTarget: 'side',
                            disabled: recordChecked ? false : true,
                            maxValue:record.get('originalqty')*(me.record.get('qty')-me.addedProductQty),
                            value:value,
                            minValue:1,
                            allowBlank: false,
                            listeners:{
                                blur:function(nField){
                                    if(!nField.isValid()){
                                        nField.focus();
                                        nField.selectText();
                                        Ext.Msg.alert(i18n.getKey('ErrorInfo'),nField.getErrors());
                                        return false;
                                    }
                                    else{
                                        me.removeExist(me.materialItems,record.get('_id'));
                                        var redoItem=Ext.create('CGP.redodetails.model.RedoItemView');
                                        redoItem.set('originalOrderItemId',me.record.get('id'));
                                        redoItem.set('orderItemQty',me.record.get('qty'));
                                        redoItem.set('productId',me.record.get('product').id);
                                        redoItem.set('productName',me.record.get('productName'));
                                        redoItem.set('sku',me.record.get('productSku'));
                                        redoItem.set('materialPath',record.get('_id'));
                                        redoItem.set('materialId',record.get('id'));
                                        redoItem.set('materialName',record.get('name'));
                                        redoItem.set('originalqty',record.get('originalqty'));
                                        redoItem.set('qty',nField.value);
                                        redoItem.set('redoType','redoMaterial');
                                        me.materialItems.push(redoItem.data);
                                    }
                                }
                            }
                        }
                    }
                    return value;
                }
            },
            {
                text: i18n.getKey('maxValue'),
                width: 100,
                dataIndex: 'originalqty',
                renderer: function (value, metadata, record,view) {
                    var type = record.get('type'),result=1;
                    if(type=='MaterialType'||type == 'MaterialSpu'){
                        if(!Ext.isEmpty(value)){
                            result=value;
                        }
                        return result*(me.record.get('qty')-me.addedProductQty);
                    }
                    else{
                        return record.raw.quantity;
                    }
                }
            }
        ];
        me.listeners = {
            select: function (rowModel, record) {

            },
            itemcontextmenu: function (view, record, item, index, e, eOpts) {
                var centerPanel = view.ownerCt.ownerCt.getComponent('centerPanel');
                var parentId = record.get('parentId');
                var isLeaf = record.get('isLeaf');
                //controller.itemEventMenu(view, record, e, parentId, isLeaf);
            },
            itemexpand: function (node) {
                if (node.childNodes.length > 0) {//展开节点时，更改父节点图标样式
                    //node.getUI().getIconEl().src="../themes/images/default/editor/edit-word-text.png";
                }
                //更改当前节点下的所有子节点的图标
                for (var i = 0, len = node.childNodes.length; i < len; i++) {
                    var curChild = node.childNodes[i];
                    var type = curChild.get('type');
                    var isLeaf = curChild.get('isLeaf');
                    if (type == 'MaterialType') {
                        curChild.set('icon', '../material/T.png');
                    } else if (type == 'MaterialSpu') {
                        curChild.set('icon', '../material/S.png');
                    } else {
                        curChild.set('icon', '../material/B.png');
                    }
                }
            },
            beforeload: function (sto, operation, e) {
                var type = operation.node.get('type');
                var clazz;
                if (operation.node.raw) {
                    clazz = operation.node.raw.clazz;
                }
                var parentNode = operation.node.parentNode;
                if (Ext.isEmpty(type) && !operation.node.isRoot()) {
                    var idRealArray = parentNode.get('_id').split('-');
                    var realId = idRealArray[idRealArray.length - 1];
                    sto.proxy.url = adminPath + 'api/materials/bomTree/{id}/children?type=bomitem&materialId=' + realId;
                    delete sto.proxy.extraParams;
                } else {
                    /*sto.proxy.extraParams = {
                     type: 'material'
                     };*/
                    sto.proxy.url = adminPath + 'api/materials/bomTree/{id}/children?type=material';
                }
            },
            afterrender: function () {
                /*
                 me.expandAll();
                 */
            },
            checkchange: function (node, newChecked){
                if (Ext.getCmp(node.getId())) {
                    Ext.getCmp(node.getId()).setDisabled(!newChecked);
                    if(newChecked){
                        Ext.getCmp(node.getId()).focus();
                    }
                    me.removeChildMaterialItem(node,newChecked);
                }
            }
        };
        me.callParent(arguments);
        var parentChecked=[];
        me.store.on('load', function (store, node, records) {
            Ext.Array.each(records, function (item) {
                var type = item.get('type');
                if (type == 'MaterialType') {
                    item.set('icon', '../material/T.png');
                } else if (type == 'MaterialSpu') {
                    item.set('icon', '../material/S.png');
                } else {
                    item.set('icon', '../material/B.png');
                }
            });
            Ext.each(records, function (item) {
                if ('root' != item.data._id) {
                    var qty=1;
                    if(item.raw.quantity){
                        qty=item.raw.quantity;
                    }
                    if(item.parentNode.data.originalqty){
                        qty=qty*item.parentNode.data.originalqty;
                    }
                    item.set('originalqty',qty);
                    item.setId(item.data.parentId + '-' + item.data._id);
                    //绑定已添加项
                    var type = item.get('type');
                    if (type == 'MaterialSpu'){

                        var redoPage=me.orderitems.ownerCt,redoItemStore=null;
                        if(redoPage){
                            if(redoPage.getComponent('redoItemList')){
                                redoItemStore=redoPage.getComponent('redoItemList').getStore()
                            }
                        }
                        var addedIndex=redoItemStore.findBy(function(record){
                            return me.record.get('id')==record.get('originalOrderItemId')&&item.get('_id')==record.get('materialPath')
                        });
                        if(addedIndex>-1){
                            var addedItem=redoItemStore.getAt(addedIndex);
                            item.set('redoQty',addedItem.get('qty'));
                            item.set('checked',true);
                            parentChecked.push(item.get('_id'));
                        }
                        else{

                            var addedParent=Ext.Array.filter(parentChecked,function(el){
                                return item.get('_id').startsWith(el);
                            });
                            if(Ext.isEmpty(addedParent)){
                                item.set('checked',false);
                            }
                        }
                    }
                    item.commit();
                }
            });
        });
        me.expandAll();
    },
    removeChildMaterialItem:function(node,newChecked){
        var me=this;
        if(!newChecked){
            Ext.Array.each(me.materialItems,function(item,index ,arr){
                if(item.materialPath==node.get('_id')){
                    arr.splice(index, 1)
                    return false;
                }
            });
            me.deletePath.push({originalOrderItemId:me.record.get('id'),materialPath:node.get('_id')});
        }
        node.eachChild(function(item){
            var type = item.get('type');
            if(type == 'MaterialSpu'){
                item.set('checked',false);
                if(newChecked){
                    delete item.data.checked;
                    //Ext.getCmp(item.get('_id')).value='';
                    Ext.getCmp(item.get('_id')).setDisabled(true);
                    if(!me.removeExist(me.materialItems,item.get('_id'))){
                        me.deletePath.push({originalOrderItemId:me.record.get('id'),materialPath:item.get('_id')});
                    }
                }
            }
            me.removeChildMaterialItem(item,newChecked);

        });
    },
    removeExist:function(materialItems,path){
        var del=false;
        var existItems=Ext.Array.filter(materialItems,function(el){
            return el.materialPath==path;
        });
        Ext.Array.each(existItems,function(el){
            Ext.Array.remove(materialItems,el);
            del=true;
        });
        return del;
    }
});