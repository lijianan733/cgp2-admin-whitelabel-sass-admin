Ext.define('CGP.material.view.information.views.AddMtViews',{
    extend: 'Ext.window.Window',
    modal: true,
    /**
     * @cfg {Ext.util.MixedCollection} collection
     * 記錄所有選中的產品ID集合，實現在批量生成時記錄各產品頁面選擇產品狀態
     * 實現再次打開選擇產品頁面是恢復產品選中狀態
     */
    collection: new Ext.util.MixedCollection(),
    layout: 'fit',
    width: 900,
    height: 650,
    constrain:true,
    maximizable:true,
    initComponent: function(){
        var  me = this;
        me.title = i18n.getKey('materialView');
        var store = Ext.create('CGP.material.store.MaterialViewType');
        var filterData = me.filterData;
        store.on('load',function(store,records,options){

            var grid = Ext.getCmp('selectProduct');
            //遍历collection恢复翻页选中的产品
            Ext.Array.each(me.collection, function () {
                for (var i = 0; i < records.length; i++) {
                    var record = records[i];
                    if (me.collection.containsKey(record.get("id"))) {
                        grid.getSelectionModel().select(i, true, false);    //选中record，并且保持现有的选择，不触发选中事件
                    }
                }
            });
        });

        var grid = Ext.create('CGP.common.commoncomp.QueryGrid',{
            header: false,
            gridCfg: {
                editAction: false,
                deleteAction: false,
                id: 'selectMtViews',
                selType: 'checkboxmodel',
                store :store,
                multiSelect : true,
                listeners:{
                    //选中时加到collection集合中
                    'select':function(checkModel,record){
                        me.collection.add(record.get("id"),record.get('id'));
                    },
                    //取消选中时 从集合中去除
                    'deselect': function(checkModel, record, index, eOpts){
                        me.collection.remove(me.collection.get(record.get("id")));
                    }
                },

                columns : [{
                    dataIndex: '_id',
                    text: i18n.getKey('id'),
                    width: 150,
                    itemId: 'id'
                },
                    {
                        dataIndex: 'name',
                        text: i18n.getKey('name'),
                        width: 200,
                        itemId: 'name'
                    },
                    {
                        dataIndex: 'designType',
                        text: i18n.getKey('designType'),
                        width: 200,
                        itemId: 'designType',
                        renderer: function(value){
                            if(!Ext.isEmpty(value)){
                                return value['name'];
                            }
                        }
                    },
                    {
                        dataIndex: 'preDesignObject',
                        text: i18n.getKey('preDesignObject'),
                        width: 200,
                        itemId: 'preDesignObject',
                        renderer: function(value){
                            if(!Ext.isEmpty(value)){
                                return value['name'];
                            }
                        }
                    },
                    {
                        dataIndex: 'sequenceNumber',
                        text: i18n.getKey('sequenceNumber'),
                        width: 70,
                        itemId: 'sequenceNumber'
                    },
                    {
                        dataIndex: 'pageContentStrategy',
                        text: i18n.getKey('pageContentStrategy'),
                        width: 200,
                        itemId: 'pageContentStrategy'
                    },
                    {
                        dataIndex: 'pageContentFetchStrategy',
                        text: i18n.getKey('pageContentFetchStrategy'),
                        width: 200,
                        itemId: 'pageContentFetchStrategy'
                    },
                    {
                        dataIndex: 'pageContentQuantity',
                        text: i18n.getKey('pageContentQuantity'),
                        width: 70,
                        itemId: 'pageContentQuantity'
                    },
                    {
                        dataIndex: 'viewQuantity',
                        text: i18n.getKey('viewQuantity'),
                        width: 70,
                        itemId: 'viewQuantity'
                    },{
                        dataIndex: 'pageContentSchemaId',
                        text: i18n.getKey('pageContentSchemaId'),
                        width: 200,
                        itemId: 'pageContentSchemaId'
                    }]
            },
            filterCfg: {
                height : 60,
                header: false,
                defaults : {
                    width : 280
                },
                items : [{
                    name : 'id',
                    xtype : 'textfield',
                    fieldLabel : i18n.getKey('id'),
                    itemId : 'id'
                },{
                    name : 'name',
                    xtype : 'textfield',
                    fieldLabel : i18n.getKey('name'),
                    itemId : 'name'
                },{
                    xtype : 'textfield',
                    name : 'excludeIds',
                    hidden : true,
                    isLike: false,
                    isArray: true,
                    value : function(){
                        if(Ext.isEmpty(filterData)){
                            return ;
                        }else{
                            var value = [];
                            for(var i = 0 ; i < filterData.length;i++){
                                value.push( filterData[i].get("_id"));
                            }
                            return value;
                        }
                    }()
                }]
            }
        });
        me.items = [grid];
        me.bbar = ["->",{
            xtype: 'button',
            text: i18n.getKey('confirm'),
            handler: function(){
                var data = me.down('grid').getSelectionModel().getSelection();
                me.existStore.add(data);
                me.close();
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