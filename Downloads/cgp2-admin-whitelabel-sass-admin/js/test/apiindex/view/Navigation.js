Ext.define("CGP.test.apiindex.view.Navigation",{
    extend: "Ext.tree.Panel",
    region: 'west',
    width: 350,
    config: {
        rootVisible: false,
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

    initComponent: function () {
        var me = this;
        me.title = i18n.getKey('materialBom');
        var task = new Ext.util.DelayedTask();
        function dealClick(type,treepanel,record){
            if(type == 'select'){
                me.controller.showMaterialItems(me,null);
                me.controller.showBomMaterialInfo(me, record);
            }else if(type == 'itemdblclick'){
                me.controller.showBomMaterialInfo(me, record);
            }
        };
        me.store = Ext.create('CGP.bommaterial.store.MaterialBomItem', {
            root: {
                expanded: true,
                children: me.children || []
            }
        });
        me.store.on({expand: {fn: function (node) {
            me.controller.showMaterialItems(me,node);
        }}});

        me.tbar = [
            {
                xtype: 'button',
                text: i18n.getKey('addChildMaterial'),
                handler: function () {
                    me.controller.addChildMaterialWin(me.parentMaterialId, me);
                }
            }
        ];
        me.columns = [
            {
                xtype: 'treecolumn',
                text: i18n.getKey('name'),
                flex: 3,
                dataIndex: 'name',
                //locked: true,
                renderer: function(value, metadata, record){
                    return record.get("name");
                }
            },{
                text: i18n.getKey('type'),
                flex: 1,
                dataIndex: 'type',
                renderer: function(value){
                    var type;
                    if(value == 'FIXED'){
                        type = '<div style="color: green">' + i18n.getKey(value) + '</div>'
                    }else if(value == 'OPTIONAL'){
                        type = '<div style="color: blue">' + i18n.getKey(value) + '</div>'
                    }else if(value == 'UNASSIGN'){
                        type = '<div style="color: red">' + i18n.getKey(value) + '</div>'
                    }
                    return type;
                }

            }
        ];
        me.listeners = {
            /*itemclick: function (view, record) {
             task.delay(300, dealClick, this, ['itemclick',me,record]);
             },*/
            itemdblclick: function(view, record){
                task.delay(300, dealClick, this, ['itemdblclick',me,record]);
            },
            select: function(view, record){
                task.delay(300, dealClick, this, ['select',me,record]);
            },
            itemcontextmenu: function(view, record, item, index, e, eOpts){
                me.controller.bomItemEventMenu(me,record,e);
            }
        };
        me.callParent(arguments);

    }
})