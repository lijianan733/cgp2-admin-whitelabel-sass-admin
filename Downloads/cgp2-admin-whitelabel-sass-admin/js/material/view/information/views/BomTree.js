Ext.syncRequire(['CGP.material.model.Material', 'CGP.material.override.Filter']);
Ext.define("CGP.material.view.information.views.BomTree", {
    extend: "Ext.tree.Panel",
    mixins: {
        Filter: 'CGP.material.override.Filter'
    },
    width: 350,
    collapsible: true,
    header: false,
    config: {
        rootVisible: true,
        useArrows: true,
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

    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.material.controller.Controller');
        var store = Ext.create('CGP.material.store.BomTree',{
            root: {
                id: me.record.get('id'),
                name: me.record.get('name'),
                type: me.record.get('type'),
                icon: me.record.get('type') == 'MaterialSpu' ? '../material/S.png' : '../material/T.png'
            }/*,
            params: {
                type: 'material'
            }*/
        });
        me.store = store;
        //me.store.filter('type', 'MaterialSpu', true, false);
        store.on('load', function (store,node,records) {
            Ext.Array.each(records,function(item){
                var type = item.get('type');
                if (type == 'MaterialType') {
                    item.set('icon', '../material/T.png');
                } else if(type == 'MaterialSpu'){
                    item.set('icon', '../material/S.png');
                }else{
                    item.set('icon', '../material/B.png');
                }
            });
            Ext.each(records,function(item){
                if('root'!=item.data.id){
                    item.setId(item.data.parentId+'-'+item.data.id);
                    item.commit();
                }
            });
        });

        me.columns = [
            {
                xtype: 'treecolumn',
                text: i18n.getKey('name'),
                width: 350,
                dataIndex: 'name',
                //locked: true,
                renderer: function (value, metadata, record) {
                    return record.get("name");
                }
            },
            {
                text: i18n.getKey('type'),
                width: 200,
                dataIndex: 'type',
                renderer: function (value) {
                    var type;
                    if (value == 'MaterialSpu') {
                        type = '<div style="color: green">' + i18n.getKey('SMU') + '</div>'
                    } else if (value == 'MaterialType') {
                        type = '<div style="color: blue">' + i18n.getKey('SMT') + '</div>'
                    }
                    return type;
                }

            }
        ];
        me.listeners = {
            select: function (rowModel, record) {
                var materialId = record.get('id');
                var isLeaf = record.get('isLeaf');
                var parentId = record.get('parentId');
                var centerPanel = rowModel.view.ownerCt.ownerCt.getComponent('centerPanel');
                var treeStore = me.getStore();
                //controller.refreshData(record, centerPanel, isLeaf, parentId);
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
                    } else if(type == 'MaterialSpu'){
                        curChild.set('icon', '../material/S.png');
                    }else{
                        curChild.set('icon', '../material/B.png');
                    }
                }
            },
            beforeload: function(sto,operation,e){
                var type = operation.node.get('type');
                var clazz;
                if(operation.node.raw){
                    clazz = operation.node.raw.clazz;
                }
                var parentNode = operation.node.parentNode;
                if(clazz){
                    /*sto.proxy.extraParams = {
                     type: 'bomitem',
                     materialId: parentNode.get('id')
                     };*/
                    var idRealArray = parentNode.get('id').split('-');
                    var realId = idRealArray[idRealArray.length-1];
                    sto.proxy.url = adminPath + 'api/admin/materials/bomTree/{id}/children?type=bomitem&materialId='+realId;
                    delete sto.proxy.extraParams;
                }else{
                    /*sto.proxy.extraParams = {
                     type: 'material'
                     };*/
                    sto.proxy.url = adminPath + 'api/admin/materials/bomTree/{id}/children?type=material';
                }
            }
        };
        me.callParent(arguments);

    }/*,
     getQueryString: function (name) {
     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
     var r = window.location.search.substr(1).match(reg);
     if (r != null) return unescape(r[2]);
     return null;
     },
     refreshData: function (data) {

     var me = this;
     me.data = data;
     var store = me.getStore();
     store.proxy.url = adminPath + 'api/admin/materials/bomTree/{id}/children?type=material&materialId='+data.id;
     store.load();
     }*/
});