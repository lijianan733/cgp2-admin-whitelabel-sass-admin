Ext.Loader.syncRequire(['CGP.common.store.WebsiteObject']);
Ext.define("CGP.cmspage.view.cmsvariable.CmsVariableGrid",{
    extend : 'CGP.common.commoncomp.QueryGrid',


    collection: new Ext.util.MixedCollection(),
    constructor : function(config){
        var me = this;

        me.callParent(arguments);

    },
    width: 900,
    height: 600,
    diyGridCfg:null,
    initComponent : function(){
        var me = this;
        /*me.width= Ext.getBody().getWidth()*0.8;
         me.height= Ext.getBody().getHeight()*0.8;*/
        me.store.on('load',function(store,records,options){

            var grid = me.down("grid");

            Ext.Array.each(me.collection, function () {
                for (var i = 0; i < records.length; i++) {
                    var record = records[i];
                    if (me.collection.containsKey(record.get("id"))) {
                        grid.getSelectionModel().select(i, true, false);    //选中record，并且保持现有的选择，不触发选中事件
                    }
                }
            });
        });
        me.gridCfg = Ext.Object.merge({
            editAction: false,
            deleteAction: false,
            store :me.store,
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
            columns : [
                {
                text: i18n.getKey('id'),
                dataIndex: 'id',
                xtype: 'gridcolumn',
                itemId: 'id',
                sortable: true
            },
                {
                text: i18n.getKey('name'),
                dataIndex: 'name',
                xtype: 'gridcolumn',
                width : 180,
                sortable : false,
                itemId: 'variableName'
            },
                {
                text: i18n.getKey('type'),
                dataIndex: 'type',
                xtype: 'gridcolumn',
                width : 120,
                itemId: 'variableType',
                sortable: false
            },
                {
                text: i18n.getKey('selector'),
                dataIndex: 'selector',
                xtype: 'gridcolumn',
                width : 120,
                itemId: 'selector',
                sortable: false
            }, {
                text: i18n.getKey('code'),
                dataIndex: 'code',
                width : 180,
                xtype: 'gridcolumn',
                itemId: 'variableCode',
                sortable: false
            }, {
                text: i18n.getKey('description'),
                dataIndex: 'description',
                xtype: 'gridcolumn',
                width : 180,
                itemId: 'description',
                sortable: false
            }, {
                text: i18n.getKey('website'),
                dataIndex: 'website',
                width: 120,
                itemId: 'website',
                sortable: false,
                renderer: function (value, metadata, record){
                    metadata.tdAttr = 'data-qtip="' + value['name'] + '"';
                    return value['name'] ;
                }
            }, {
                text: i18n.getKey('value'),
                dataIndex: 'value',
                xtype: 'componentcolumn',
                width : 80,
                itemId: 'value',
                sortable: false,
                renderer: function (value, metaData, record, rowIndex) {
                    return new Ext.button.Button({
                        text: '<div style="color: #666666">' + i18n.getKey('value') + '</div>',
                        frame: false,
                        width: 100,
                        style: {
                            background: '#F5F5F5'
                        },
                        handler: function (comp) {

                            var win = Ext.create("Ext.window.Window", {
                                id: "cmsvariablevalue",
                                width: 400,
                                height: 400,
                                modal: true,
                                autoScroll: true,
                                title: i18n.getKey('value'),
                                html: value
                            });
                            win.show();
                        }

                    });
                }

            }]

        },me.diyGridCfg);
        me.filterCfg = {
            height : 100,
            header: false,
            defaults : {
                width : 280
            },
            items : [{
                name: 'id',
                xtype: 'numberfield',
                hideTrigger: true,
                fieldLabel: i18n.getKey('id'),
                itemId: 'id'
            }, {
                name: 'name',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('name'),
                itemId: 'variableName'
            }, {
                name: 'code',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('code'),
                itemId: 'variableCode'
            }, {
                name: 'selector',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('selector'),
                itemId: 'selector'
            },{
                name: 'type',
                xtype: 'combo',
                itemId: 'variableType',
                editable: false,
                store: Ext.create('Ext.data.Store', {
                    fields: ['type', "value"],
                    data: [
                        {
                            type: 'REST_API_LIST', value: 'REST_API_LIST'
                        },
                        {
                            type: 'JSON_OBJ', value: 'JSON_OBJ'
                        },{
                            type: 'REST_API', value: 'REST_API'
                        },{
                            type: 'CONSTANT', value: 'CONSTANT'
                        },{
                            type: 'URL', value: 'URL'
                        }
                    ]
                }),
                fieldLabel: i18n.getKey('type'),
                displayField: 'type',
                valueField: 'value',
                queryMode: 'local'
            },{
                fieldLabel: i18n.getKey('website'),
                name: 'website.id',
                itemId: 'website',
                xtype: 'combo',
                hidden: true,
                store: me.websiteStore,
                displayField: 'name',
                valueField: 'id',
                value: me.record.get('websiteId') || 11,
                editable: false,
                listeners: {
                    afterrender: function (combo) {
                        var store = combo.getStore();
                        store.on('load', function () {
                            this.insert(0, {
                                id: null,
                                name: i18n.getKey('allWebsite')
                            });
                            // combo.select(store.getAt(0));
                        });
                    }
                }
            },{
                    xtype : 'textfield',
                    name : 'excludeIds',
                    hidden : true,
                isLike: false,
                    value : function(){
                        if(Ext.isEmpty(me.filterDate)){
                            return ;
                        }else if(Ext.isString(me.filterDate)){
                            return me.filterDate;
                        }else{
                            var value = [];
                            for(var i = 0 ; i < me.filterDate.length;i++){
                                value.push( me.filterDate[i].get("id"));
                            }
                            return value.join(",");
                        }
                    }()
                }]
        };


        me.callParent(arguments);
    }


});